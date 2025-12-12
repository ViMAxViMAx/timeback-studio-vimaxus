import React, { useState, useEffect } from 'react';
import { QUESTIONS } from '../constants';
import { ChevronRight, ChevronLeft, GripVertical, Check } from 'lucide-react';

interface QuizProps {
  onComplete: (data: any) => void;
}

const RestScreen = ({ onContinue, text, imageId }: { onContinue: () => void, text: string, imageId: number }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 animate-fade-in text-center max-w-2xl mx-auto">
    <img 
      src={`https://picsum.photos/id/${imageId}/800/600`} 
      alt="Calming visual" 
      className="w-full max-w-md h-64 object-cover rounded-2xl shadow-lg mb-8 opacity-90"
    />
    <h3 className="text-2xl font-serif text-slate-700 italic mb-8 leading-relaxed">
      "{text}"
    </h3>
    <button
      onClick={onContinue}
      className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-full font-medium transition-all transform hover:scale-105 shadow-md"
    >
      Continue Journey
    </button>
  </div>
);

const Quiz: React.FC<QuizProps> = ({ onComplete }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isResting, setIsResting] = useState(false);
  const [restStep, setRestStep] = useState(0);

  // Filter questions based on conditions
  const activeQuestions = QUESTIONS.filter(q => !q.condition || q.condition(answers));
  const currentQuestion = activeQuestions[currentQIndex];

  // Logic to show rest screens based on Question ID ensures correct placement even if questions are skipped
  useEffect(() => {
    if (currentQuestion?.id === 'q4' && restStep === 0) {
      setIsResting(true);
      setRestStep(1);
    } else if (currentQuestion?.id === 'q8' && restStep === 1) {
      setIsResting(true);
      setRestStep(2);
    }
  }, [currentQuestion, restStep]);

  const handleAnswer = (val: any) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: val }));
  };

  const nextQuestion = () => {
    if (currentQIndex < activeQuestions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      onComplete(answers);
    }
  };

  const prevQuestion = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex(prev => prev - 1);
    }
  };

  // Ranking Logic Helpers
  const getRankingOptions = () => {
    // Determine options based on previous multi-select answer (q5)
    // Fallback if q5 hasn't been answered or is empty
    const selectedAreas = answers['q5'] || [];
    if (selectedAreas.length === 0) return ["Email", "Meetings", "Data Entry", "Social Media", "Support"];
    return selectedAreas;
  };
  
  // Initialize ranking state when entering the ranking question
  const [rankedItems, setRankedItems] = useState<string[]>([]);
  useEffect(() => {
    if (currentQuestion?.type === 'rank' && rankedItems.length === 0) {
      setRankedItems(getRankingOptions());
    }
  }, [currentQuestion, answers]);

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...rankedItems];
    if (direction === 'up' && index > 0) {
      [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
    } else if (direction === 'down' && index < newItems.length - 1) {
      [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    }
    setRankedItems(newItems);
    handleAnswer(newItems);
  };

  if (isResting) {
    const screens = [
      { text: "Breathe. You're taking the first step towards reclaiming your time.", img: 28 }, // Forest/Nature
      { text: "Imagine what you could build if the busy-work just... vanished.", img: 180 } // Laptop/Coffee/Work
    ];
    const screen = restStep === 1 ? screens[0] : screens[1];
    
    return <RestScreen 
      text={screen.text} 
      imageId={screen.img} 
      onContinue={() => setIsResting(false)} 
    />;
  }

  const progress = ((currentQIndex) / activeQuestions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 w-full animate-fade-in">
      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-2 rounded-full mb-8 overflow-hidden">
        <div 
          className="bg-teal-500 h-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-800 mb-6 leading-tight">
          {currentQuestion.text}
        </h2>

        {/* INPUT TYPES */}
        <div className="space-y-4">
          
          {currentQuestion.type === 'single' && (
            <div className="space-y-3">
              {currentQuestion.options?.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    handleAnswer(opt);
                    // Small delay to show selection
                    setTimeout(nextQuestion, 200);
                  }}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 
                    ${answers[currentQuestion.id] === opt 
                      ? 'border-teal-500 bg-teal-50 text-teal-900 shadow-sm' 
                      : 'border-slate-200 hover:border-teal-300 hover:bg-slate-50 bg-white'
                    }`}
                >
                  <span className="font-medium">{opt}</span>
                </button>
              ))}
            </div>
          )}

          {currentQuestion.type === 'multi' && (
            <div className="space-y-3">
              {currentQuestion.options?.map((opt) => {
                const selected = (answers[currentQuestion.id] || []).includes(opt);
                return (
                  <button
                    key={opt}
                    onClick={() => {
                      const curr = answers[currentQuestion.id] || [];
                      const next = selected ? curr.filter((i: string) => i !== opt) : [...curr, opt];
                      handleAnswer(next);
                    }}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex justify-between items-center
                      ${selected 
                        ? 'border-teal-500 bg-teal-50 text-teal-900 shadow-sm' 
                        : 'border-slate-200 hover:border-teal-300 bg-white'
                      }`}
                  >
                    <span className="font-medium">{opt}</span>
                    {selected && <Check className="w-5 h-5 text-teal-600" />}
                  </button>
                );
              })}
            </div>
          )}

          {currentQuestion.type === 'slider' && (
            <div className="py-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between mb-4">
                <span className="text-slate-500 text-sm">0 hours</span>
                <span className="text-3xl font-bold text-teal-600">
                  {answers[currentQuestion.id] ?? 0} <span className="text-lg text-slate-400 font-normal">hours/week</span>
                </span>
                <span className="text-slate-500 text-sm">40+ hours</span>
              </div>
              <input 
                type="range" 
                min={currentQuestion.min} 
                max={currentQuestion.max}
                step={currentQuestion.step}
                value={answers[currentQuestion.id] ?? 0}
                onChange={(e) => handleAnswer(Number(e.target.value))}
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <p className="text-center text-slate-500 mt-4 text-sm">Drag the slider to estimate</p>
            </div>
          )}

          {currentQuestion.type === 'text' && (
            <textarea
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder={currentQuestion.placeholder}
              className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-teal-500 focus:ring-0 min-h-[160px] text-lg outline-none transition-all resize-none"
              maxLength={500}
            />
          )}

          {currentQuestion.type === 'rank' && (
            <div className="space-y-2">
              <p className="text-sm text-slate-500 mb-2">Use arrows to reorder priorities.</p>
              {rankedItems.map((item, idx) => (
                <div key={item} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                  <div className="flex flex-col gap-1">
                    <button 
                      onClick={() => moveItem(idx, 'up')}
                      disabled={idx === 0}
                      className="text-slate-400 hover:text-teal-600 disabled:opacity-30"
                    >
                      <ChevronRight className="w-4 h-4 -rotate-90" />
                    </button>
                    <button 
                      onClick={() => moveItem(idx, 'down')}
                      disabled={idx === rankedItems.length - 1}
                      className="text-slate-400 hover:text-teal-600 disabled:opacity-30"
                    >
                      <ChevronRight className="w-4 h-4 rotate-90" />
                    </button>
                  </div>
                  <div className="bg-slate-100 p-2 rounded text-slate-400">
                    <span className="font-bold font-mono text-sm">{idx + 1}</span>
                  </div>
                  <span className="font-medium text-slate-700">{item}</span>
                  <GripVertical className="ml-auto text-slate-300 w-5 h-5" />
                </div>
              ))}
               {rankedItems.length === 0 && (
                   <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg text-sm">
                       No items selected in previous step. 
                       <button onClick={prevQuestion} className="underline ml-2">Go back</button>
                   </div>
               )}
            </div>
          )}

        </div>
      </div>

      <div className="flex justify-between items-center mt-10">
        <button 
          onClick={prevQuestion}
          disabled={currentQIndex === 0}
          className={`flex items-center text-slate-500 hover:text-slate-800 font-medium px-4 py-2 rounded-lg transition-colors
            ${currentQIndex === 0 ? 'opacity-0 cursor-default' : 'opacity-100'}
          `}
        >
          <ChevronLeft className="w-5 h-5 mr-1" /> Back
        </button>

        {currentQuestion.type !== 'single' && (
             <button 
             onClick={nextQuestion}
             className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-full font-medium shadow-md shadow-teal-200 flex items-center transition-transform active:scale-95"
           >
             {currentQIndex === activeQuestions.length - 1 ? "Get My Plan" : "Next"}
             <ChevronRight className="w-5 h-5 ml-1" />
           </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;
