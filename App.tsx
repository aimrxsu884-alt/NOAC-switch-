
import React, { useState, useMemo } from 'react';
import { ShieldCheck, ArrowRightLeft, Zap, Loader2, Info, ExternalLink, RotateCcw } from 'lucide-react';
import DrugCard from './components/DrugCard';
import VisualTimeline from './components/VisualTimeline';
import { DRUGS } from './constants';
import { DrugId, TransitionResult } from './types';
import { calculateSwitch } from './switchingLogic';

const App: React.FC = () => {
  const [selectedFrom, setSelectedFrom] = useState<DrugId | null>(null);
  const [selectedTo, setSelectedTo] = useState<DrugId | null>(null);
  const [inrValue, setInrValue] = useState<string>('');
  const [result, setResult] = useState<TransitionResult | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  const showInrInput = useMemo(() => {
    return selectedFrom === 'VKA' && selectedTo && selectedTo.includes('NOAC');
  }, [selectedFrom, selectedTo]);

  const handleCalculate = async () => {
    if (!selectedFrom || !selectedTo) return;
    
    setIsCalculating(true);
    setResult(null);

    // Simulate clinical processing delay for UX
    await new Promise(r => setTimeout(r, 600));

    const inr = inrValue ? parseFloat(inrValue) : undefined;
    const protocolResult = calculateSwitch(selectedFrom, selectedTo, inr);
    setResult(protocolResult);
    setIsCalculating(false);
  };

  const handleReset = () => {
    setSelectedFrom(null);
    setSelectedTo(null);
    setInrValue('');
    setResult(null);
  };

  return (
    <div className="min-h-screen pb-20 bg-slate-50">
      {/* Header */}
      <header className="bg-white px-6 py-10 rounded-b-[2.5rem] shadow-sm border-b border-slate-100 flex flex-col items-center justify-center text-center">
        <div className="bg-blue-600 p-3 rounded-2xl mb-4 shadow-lg shadow-blue-100">
          <ArrowRightLeft className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Switching Protocol</h1>
        <p className="text-slate-500 text-sm mt-2 font-medium max-w-xs leading-relaxed">
          Evidence-based anticoagulant transition utility.<br/>
          <span className="text-blue-600 font-bold uppercase text-[10px] tracking-widest mt-1 block">EHRA 2021 Practical Guide</span>
        </p>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-8 space-y-10">
        {/* From Section */}
        <section>
          <div className="flex justify-between items-end mb-4 px-1">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current Medication (From)</h2>
            {selectedFrom && (
              <button onClick={() => setSelectedFrom(null)} className="text-[10px] text-blue-500 font-bold uppercase hover:underline">Clear</button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {DRUGS.map(drug => (
              <DrugCard 
                key={`from-${drug.id}`}
                drug={drug}
                isSelected={selectedFrom === drug.id}
                onSelect={(id) => {
                  setSelectedFrom(id as DrugId);
                  setResult(null);
                }}
              />
            ))}
          </div>
        </section>

        {/* To Section */}
        <section>
          <div className="flex justify-between items-end mb-4 px-1">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Switch To</h2>
            {selectedTo && (
              <button onClick={() => setSelectedTo(null)} className="text-[10px] text-blue-500 font-bold uppercase hover:underline">Clear</button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {DRUGS.map(drug => (
              <DrugCard 
                key={`to-${drug.id}`}
                drug={drug}
                isSelected={selectedTo === drug.id}
                onSelect={(id) => {
                  setSelectedTo(id as DrugId);
                  setResult(null);
                }}
              />
            ))}
          </div>
        </section>

        {/* Conditional INR Input */}
        {showInrInput && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
            <label className="block text-sm font-bold text-slate-800 mb-3">Current INR Value</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                step="0.1"
                placeholder="Enter value..."
                value={inrValue}
                onChange={(e) => setInrValue(e.target.value)}
                className="flex-1 px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-lg font-bold"
              />
              <span className="bg-slate-100 px-6 py-4 rounded-2xl font-bold text-slate-500 text-sm">INR</span>
            </div>
            <p className="text-xs text-slate-400 mt-3 italic flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-400" /> 
              Timing is determined by current anticoagulation intensity.
            </p>
          </div>
        )}

        {/* Action Button */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleCalculate}
            disabled={!selectedFrom || !selectedTo || (showInrInput && !inrValue)}
            className={`w-full py-5 rounded-3xl flex items-center justify-center gap-3 font-bold text-xl transition-all duration-300 shadow-xl ${
              !selectedFrom || !selectedTo || (showInrInput && !inrValue)
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none translate-y-0'
                : 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white hover:scale-[1.02] hover:shadow-blue-200 active:scale-[0.98]'
            }`}
          >
            {isCalculating ? (
              <Loader2 className="w-7 h-7 animate-spin" />
            ) : (
              <>
                <Zap className="w-6 h-6 fill-current" />
                Calculate Transition
              </>
            )}
          </button>

          {(selectedFrom || selectedTo) && !isCalculating && (
            <button 
              onClick={handleReset}
              className="flex items-center justify-center gap-2 text-slate-400 hover:text-slate-600 transition-colors py-2 text-sm font-semibold"
            >
              <RotateCcw className="w-4 h-4" />
              Reset All
            </button>
          )}
        </div>

        {/* Results Card */}
        {result && (
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-700">
            <div className="p-8 sm:p-10">
              <div 
                className="inline-flex items-center px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.15em] text-white mb-6 shadow-sm"
                style={{ backgroundColor: result.color }}
              >
                Recommendation
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-[1.1] mb-5">
                {result.recommendation}
              </h3>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                {result.rationale}
              </p>
            </div>

            <VisualTimeline 
              from={selectedFrom!} 
              to={selectedTo!} 
              result={result} 
              inr={parseFloat(inrValue || '0')} 
            />

            <div className="bg-slate-50 px-8 py-5 flex items-center justify-between border-t border-slate-100">
              <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                Validated Reference: EHRA 2021
              </div>
              <a 
                href="https://academic.oup.com/europace/article/23/10/1612/6247378" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-200 text-blue-600 font-bold text-xs hover:bg-blue-50 transition-colors"
              >
                <span>Full Guide</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

        <footer className="text-center pt-10 px-8">
          <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.25em] leading-[2] opacity-60">
            DISCLAIMER: FOR PROFESSIONAL USE ONLY • NOT A SUBSTITUTE FOR CLINICAL JUDGMENT • ALWAYS VERIFY WITH LOCAL PROTOCOLS<br/>
            © 2024 CLINICAL DECISION SUPPORT
          </p>
        </footer>
      </main>
    </div>
  );
};

export default App;
