
import React from 'react';
import { Drug } from './types';

export const DRUGS: Drug[] = [
  { id: 'VKA', generic: 'Warfarin', brand: 'Coumadin®', category: 'VKA' },
  { id: 'NOAC_DABI', generic: 'Dabigatran', brand: 'Pradaxa®', frequency: 'BID', category: 'NOAC' },
  { id: 'NOAC_RIVA', generic: 'Rivaroxaban', brand: 'Xarelto®', frequency: 'QD', category: 'NOAC' },
  { id: 'NOAC_API', generic: 'Apixaban', brand: 'Eliquis®', frequency: 'BID', category: 'NOAC' },
  { id: 'NOAC_EDO', generic: 'Edoxaban', brand: 'Lixiana®', frequency: 'QD', category: 'NOAC' },
  { id: 'LMWH', generic: 'LMWH', brand: 'Enoxaparin etc.', frequency: 'Inject', category: 'Heparin' },
  { id: 'UFH', generic: 'UFH', brand: 'Heparin Infusion', frequency: 'Inject', category: 'Heparin' },
];

export const COLORS = {
  success: '#10b981', // green
  warning: '#f59e0b', // amber
  danger: '#ef4444',  // red
  info: '#3b82f6',    // blue
};
