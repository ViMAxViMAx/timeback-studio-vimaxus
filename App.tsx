import React, { useState } from 'react';
import Layout from './components/Layout';
import Quiz from './components/Quiz';
import Report from './components/Report';
import { AppView, QuizState, ReportData } from './types';
import { generateReport } from './services/geminiService';
import { Loader2, ArrowRight } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.LANDING);
  const [quizData, setQuizData] = useState<any>(null);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleQuizComplete = async (answers: any) => {
    setQuizData(answers);
    setView(AppView.GENERATING);
    try {
      const report = await generateReport(answers);
      setReportData(report);
      setView(AppView.REPORT);
    } catch (err) {
      console.error(err);
      setError("Failed to generate report. Please try again.");
      setView(AppView.LANDING);
    }
  };

  const renderContent = () => {
    switch (view) {
      case AppView.LANDING:
        return (
          <div className="flex flex-col items-center justify-center text-center px-4 py-16 md:py-24">
            <div className="inline-block px-4 py-1 rounded-full bg-teal-100 text-teal-800 text-sm font-semibold mb-6 animate-pulse">
              Free Tool for Founders & Parents
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 mb-6 leading-tight max-w-4xl">
              Turn overwhelm into a <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">clear automation roadmap</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl">
              Discover exactly where your time goes and how to get it back. 
              Our AI analyzes your routine and builds a personalized implementation plan in 5 minutes.
            </p>
            <button
              onClick={() => setView(AppView.QUIZ)}
              className="group relative bg-teal-600 hover:bg-teal-700 text-white text-lg font-bold py-4 px-10 rounded-full shadow-lg shadow-teal-200 transition-all transform hover:scale-105 active:scale-95 flex items-center"
            >
              Discover Your Potential
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-slate-400 text-sm font-medium">
              <span>Trusted by Solopreneurs</span>
              <span>100% Free Plan</span>
              <span>No Tech Skills Needed</span>
              <span>Actionable in Minutes</span>
            </div>
          </div>
        );

      case AppView.QUIZ:
        return <Quiz onComplete={handleQuizComplete} />;

      case AppView.GENERATING:
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
            <Loader2 className="w-16 h-16 text-teal-500 animate-spin mb-6" />
            <h2 className="text-2xl font-serif font-bold text-slate-800 mb-2">Analyzing your routine...</h2>
            <p className="text-slate-500 max-w-md">
              We are identifying your biggest time-wasters and matching them with the perfect automation tools.
            </p>
            <div className="mt-8 w-64 h-2 bg-slate-200 rounded-full overflow-hidden">
               <div className="h-full bg-teal-500 animate-progress origin-left w-full"></div>
            </div>
            <style>{`
              @keyframes progress {
                0% { transform: scaleX(0); }
                100% { transform: scaleX(1); }
              }
              .animate-progress {
                animation: progress 4s ease-in-out;
              }
            `}</style>
          </div>
        );

      case AppView.REPORT:
        if (!reportData) return <div>Error loading report</div>;
        return <Report data={reportData} answers={quizData} />;

      default:
        return null;
    }
  };

  return (
    <Layout>
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      {renderContent()}
    </Layout>
  );
};

export default App;
