
import React from 'react';
import { DrugId, TransitionResult } from '../types';
import { ArrowDown } from 'lucide-react';

interface VisualTimelineProps {
  from: DrugId;
  to: DrugId;
  result: TransitionResult;
  inr: number;
}

const VisualTimeline: React.FC<VisualTimelineProps> = ({ from, to, result, inr }) => {
  const isVkaToNoac = from === 'VKA' && to.includes('NOAC');
  const isNoacToVka = from.includes('NOAC') && to === 'VKA';

  const Bar = ({ className, label, width }: { className: string, label: string, width: string }) => (
    <div 
      className={`h-6 rounded flex items-center justify-center text-[10px] font-bold text-white shadow-sm transition-all duration-1000 ${className}`}
      style={{ width }}
    >
      {label}
    </div>
  );

  return (
    <div className="bg-slate-50 border-t border-dashed border-slate-200 p-5 mt-4 rounded-b-2xl">
      {isNoacToVka ? (
        <div className="space-y-3">
          <div className="flex items-center">
            <span className="w-16 text-[10px] font-bold text-slate-400 text-right mr-3 uppercase">NOAC</span>
            <div className="flex-1 flex gap-0.5">
              <Bar className="bg-emerald-500" label="Continue" width="70%" />
              <Bar className="bg-slate-200 !text-slate-400" label="Stop" width="30%" />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center ml-16 text-rose-500">
            <ArrowDown className="w-3 h-3" />
            <span className="text-[10px] font-bold">INR CHECK (Day 3-5)</span>
          </div>
          <div className="flex items-center">
            <span className="w-16 text-[10px] font-bold text-slate-400 text-right mr-3 uppercase">VKA</span>
            <div className="flex-1">
              <Bar className="bg-blue-500" label="Start Overlap" width="100%" />
            </div>
          </div>
        </div>
      ) : isVkaToNoac ? (
        <div className="space-y-3">
          <div className="flex items-center">
            <span className="w-16 text-[10px] font-bold text-slate-400 text-right mr-3 uppercase">VKA</span>
            <div className="flex-1">
              <Bar className="bg-blue-500 border-r-2 border-rose-500" label="Stop" width="40%" />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center ml-16 text-amber-500">
            <ArrowDown className="w-3 h-3" />
            <span className="text-[10px] font-bold">
              {inr > 2.5 ? `Wait (INR: ${inr})` : inr > 0 ? `Start (INR: ${inr})` : 'Check INR'}
            </span>
          </div>
          <div className="flex items-center">
            <span className="w-16 text-[10px] font-bold text-slate-400 text-right mr-3 uppercase">NOAC</span>
            <div className="flex-1 flex">
              <div className="w-[40%] flex items-center justify-center">
                {inr > 2.5 && <span className="text-[10px] text-amber-400">...</span>}
              </div>
              <Bar className="bg-emerald-500 flex-1 border-l-2 border-emerald-300" label="Start" width="100%" />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center">
            <span className="w-16 text-[10px] font-bold text-slate-400 text-right mr-3 uppercase">OLD</span>
            <div className="flex-1">
              <Bar className="bg-slate-400 border-r-2 border-rose-500" label="Last Dose" width="50%" />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center ml-16 text-slate-400">
            <ArrowDown className="w-3 h-3" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Next Scheduled Time</span>
          </div>
          <div className="flex items-center">
            <span className="w-16 text-[10px] font-bold text-slate-400 text-right mr-3 uppercase">NEW</span>
            <div className="flex-1 flex">
              <div className="w-[50%]"></div>
              <Bar className="bg-emerald-500 flex-1 border-l-2 border-emerald-300" label="Start" width="100%" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualTimeline;
