
import React from 'react';
import { Drug } from '../types';
import { CheckCircle2 } from 'lucide-react';

interface DrugCardProps {
  drug: Drug;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const DrugCard: React.FC<DrugCardProps> = ({ drug, isSelected, onSelect }) => {
  const getBadgeColor = () => {
    switch (drug.frequency) {
      case 'BID': return 'bg-blue-100 text-blue-700';
      case 'QD': return 'bg-purple-100 text-purple-700';
      case 'Inject': return 'bg-rose-100 text-rose-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div
      onClick={() => onSelect(drug.id)}
      className={`relative flex flex-col justify-center p-3 h-full min-h-[90px] cursor-pointer transition-all duration-200 rounded-xl border-2 ${
        isSelected
          ? 'border-blue-500 bg-blue-50 shadow-sm'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:translate-y-[-2px]'
      }`}
    >
      {isSelected && (
        <CheckCircle2 className="absolute top-2 right-2 w-5 h-5 text-blue-500 fill-blue-50" />
      )}
      
      {drug.frequency && (
        <span className={`absolute top-2 left-2 text-[10px] px-1.5 py-0.5 font-bold rounded uppercase tracking-wider ${getBadgeColor()}`}>
          {drug.frequency}
        </span>
      )}

      <div className="mt-2 text-center sm:text-left">
        <p className="font-bold text-slate-800 text-sm sm:text-base leading-tight">
          {drug.generic}
        </p>
        <p className="text-slate-500 text-[10px] sm:text-xs truncate italic">
          {drug.brand}
        </p>
      </div>
    </div>
  );
};

export default DrugCard;
