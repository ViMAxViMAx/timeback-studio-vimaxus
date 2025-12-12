import React, { useState } from 'react';
import { ReportData } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, CheckCircle, ArrowRight, Zap, Star, TrendingUp, Mail, Loader2, AlertCircle } from 'lucide-react';
import ChatAssistant from './ChatAssistant';
import { supabase } from '../services/supabaseClient';

interface ReportProps {
  data: ReportData;
  answers: any;
}

const Report: React.FC<ReportProps> = ({ data, answers }) => {
  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    if (!supabase) {
      setSubmitError("Supabase is not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY in your environment.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const { error } = await supabase
        .from('leads')
        .insert({
          email: email,
          persona: data.personaName,
          report_data: data
        });

      if (error) throw error;
      setIsEmailSent(true);
    } catch (err: any) {
      console.error('Error saving lead:', err);
      setSubmitError(err.message || "Failed to save. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* HEADER HERO */}
      <div className="bg-teal-700 text-white pt-12 pb-24 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
           <svg width="400" height="400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#FFFFFF" d="M45.7,-76.3C58.9,-69.3,69.1,-58.1,76.5,-45.8C83.9,-33.5,88.5,-20,86.6,-7.1C84.7,5.8,76.3,18.1,67.1,28.6C57.9,39.1,48,47.8,37.3,53.8C26.6,59.8,15.1,63.1,3.3,57.3C-8.4,51.5,-20.5,36.6,-32.4,25.6C-44.3,14.6,-56.1,7.5,-61.6,-3.4C-67.1,-14.3,-66.4,-29,-58.3,-41.1C-50.2,-53.2,-34.8,-62.7,-20,-65.3C-5.2,-67.9,9,-63.6,23.5,-59.4L45.7,-76.3Z" transform="translate(100 100)" />
          </svg>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-teal-200 font-medium tracking-wider text-sm uppercase mb-3">Automation Plan Ready</h2>
          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-6">Hello, {data.personaName}</h1>
          <p className="text-teal-100 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            {data.executiveSummary}
          </p>
          
          <div className="mt-8 inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 border border-white/20">
            <span className="text-teal-50 mr-2">Potential Savings:</span>
            <span className="font-bold text-white text-lg">{data.estimatedHoursSaved} Hours / Week</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-16 relative z-20 space-y-8">
        
        {/* SCORE CARD */}
        <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 border-b-4 border-teal-500">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Zap className="text-yellow-500 w-5 h-5" /> Automation Opportunity Score
            </h3>
            <p className="text-slate-500">Based on your repetitive tasks and readiness.</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="#f1f5f9" strokeWidth="12" fill="none" />
                <circle 
                  cx="64" cy="64" r="56" 
                  stroke="#14b8a6" strokeWidth="12" 
                  fill="none" 
                  strokeDasharray={351} 
                  strokeDashoffset={351 - (351 * data.opportunityScore) / 100}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <span className="absolute text-3xl font-bold text-slate-800">{data.opportunityScore}%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COL: ROADMAP */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Quick Wins */}
            <section className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
               <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                 <CheckCircle className="text-teal-500" /> Quick Wins (Start Today)
               </h3>
               <div className="space-y-4">
                 {data.quickWins.map((win, idx) => (
                   <div key={idx} className="bg-slate-50 border border-slate-100 rounded-xl p-5 hover:border-teal-200 transition-colors">
                     <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-slate-800">{win.title}</h4>
                        <span className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded font-medium">{win.tool}</span>
                     </div>
                     <p className="text-slate-600 text-sm">{win.description}</p>
                   </div>
                 ))}
               </div>
            </section>

            {/* Strategic Roadmap */}
            <section className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <TrendingUp className="text-teal-500" /> Your Strategic Roadmap
              </h3>
              <div className="space-y-8">
                {data.roadmap.map((item, idx) => (
                  <div key={idx} className="relative pl-8 border-l-2 border-slate-200 last:border-0 pb-8 last:pb-0">
                    <div className="absolute -left-[9px] top-0 bg-white border-2 border-teal-500 w-4 h-4 rounded-full"></div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                      <h4 className="text-lg font-bold text-slate-800">{item.taskName}</h4>
                      <div className="flex gap-2 mt-2 sm:mt-0">
                        <span className={`text-xs px-2 py-1 rounded font-medium border
                          ${item.difficulty === 'Easy' ? 'bg-green-50 text-green-700 border-green-200' :
                            item.difficulty === 'Medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                            'bg-red-50 text-red-700 border-red-200'
                          }`}>
                          {item.difficulty}
                        </span>
                        <span className="text-xs px-2 py-1 rounded font-medium bg-slate-100 text-slate-600 border border-slate-200">
                          {item.approach}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 mb-4 font-mono">Tools: {item.tools}</p>
                    
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                      <h5 className="text-xs uppercase tracking-wide text-slate-400 font-bold mb-2">Implementation Blueprint</h5>
                      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{item.blueprint}</p>
                    </div>
                    
                    <div className="mt-2 text-teal-600 text-sm font-medium flex items-center">
                      <Star className="w-3 h-3 mr-1" fill="currentColor" /> Saves approx {item.timeSavings}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT COL: SIDEBAR */}
          <div className="space-y-8">
            
            {/* Forecast Chart */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wide">Time-Back Forecast</h3>
              <div className="h-48 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.weeklyForecast}>
                    <defs>
                      <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="hoursSaved" stroke="#0d9488" fillOpacity={1} fill="url(#colorHours)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="text-center text-xs text-slate-400 mt-2">Cumulative hours saved per week over time</p>
            </div>
            
            {/* Save/Email Action */}
            <div className="bg-teal-50 border border-teal-100 rounded-2xl p-6">
               <h3 className="font-bold text-teal-900 mb-2 flex items-center gap-2">
                 <Mail className="w-4 h-4" /> Save Your Results
               </h3>
               {isEmailSent ? (
                 <div className="text-teal-700 text-sm bg-teal-100 p-3 rounded-lg flex items-center">
                   <CheckCircle className="w-4 h-4 mr-2" />
                   Saved to dashboard!
                 </div>
               ) : (
                 <form onSubmit={handleEmailSubmit} className="space-y-2">
                   <p className="text-xs text-teal-700 mb-2">Enter your email to save this roadmap.</p>
                   {submitError && (
                     <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 p-2 rounded border border-red-100">
                       <AlertCircle className="w-3 h-3" /> {submitError}
                     </div>
                   )}
                   <input 
                      type="email" 
                      placeholder="Enter your email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-teal-200 focus:outline-none focus:border-teal-500 disabled:opacity-50"
                   />
                   <button 
                     type="submit" 
                     disabled={isSubmitting}
                     className="w-full bg-teal-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-teal-700 transition-colors flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
                   >
                     {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Report"}
                   </button>
                 </form>
               )}
            </div>

            {/* Expert Help */}
            <div className="bg-slate-800 rounded-2xl shadow-sm p-6 text-white">
               <h3 className="font-bold text-white mb-4 flex items-center">
                 Needs Expert Help?
               </h3>
               <div className="space-y-4 mb-6">
                 {data.expertHelp.map((help, idx) => (
                   <div key={idx} className="border-b border-slate-700 pb-3 last:border-0 last:pb-0">
                     <div className="font-medium text-teal-300">{help.area}</div>
                     <div className="text-xs text-slate-400 mt-1">{help.description}</div>
                     <div className="text-xs font-mono text-teal-500 mt-1">ROI: {help.roi}</div>
                   </div>
                 ))}
               </div>
               <button className="w-full bg-white text-slate-900 py-3 rounded-lg font-bold text-sm hover:bg-teal-50 transition-colors">
                 Book a 15-min Strategy Call
               </button>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button 
                onClick={handlePrint}
                className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 py-3 rounded-xl font-medium hover:bg-slate-50 transition-colors"
              >
                <Download className="w-4 h-4" /> Download PDF Report
              </button>
            </div>

          </div>
        </div>
      </div>

      <ChatAssistant contextData={data} answers={answers} />
    </div>
  );
};

export default Report;