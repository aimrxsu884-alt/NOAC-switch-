
export type DrugId = 'VKA' | 'NOAC_DABI' | 'NOAC_RIVA' | 'NOAC_API' | 'NOAC_EDO' | 'UFH' | 'LMWH';

export interface Drug {
  id: DrugId;
  generic: string;
  brand: string;
  frequency?: 'QD' | 'BID' | 'Inject';
  category: 'VKA' | 'NOAC' | 'Heparin';
}

export interface TransitionResult {
  recommendation: string;
  rationale: string;
  color: string;
  visualType: 'OVERLAP' | 'STOP_START' | 'IMMEDIATE';
  inrRecommendation?: string;
}
