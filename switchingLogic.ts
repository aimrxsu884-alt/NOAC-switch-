
import { DrugId, TransitionResult } from './types';
import { DRUGS } from './constants';

export const calculateSwitch = (fromId: DrugId, toId: DrugId, inr?: number): TransitionResult => {
  const fromDrug = DRUGS.find(d => d.id === fromId)!;
  const toDrug = DRUGS.find(d => d.id === toId)!;

  // Same drug or same class (minor adjustments usually)
  if (fromId === toId) {
    return {
      recommendation: `No switch required. Continue ${fromDrug.generic}.`,
      rationale: "The current and target medications are identical.",
      color: '#3b82f6',
      visualType: 'IMMEDIATE'
    };
  }

  // Scenario 1: NOAC to VKA (Overlap required)
  if (fromDrug.category === 'NOAC' && toDrug.category === 'VKA') {
    let edoxabanNote = fromId === 'NOAC_EDO' ? 'Reduce Edoxaban dose by 50% during the overlap phase.' : 'Continue full-dose NOAC.';
    return {
      recommendation: `Start VKA and OVERLAP with current NOAC.`,
      rationale: `${edoxabanNote} Check INR just before the next NOAC dose. Once INR ≥ 2.0 is achieved (usually after 3-5 days), discontinue the NOAC.`,
      color: '#3b82f6',
      visualType: 'OVERLAP'
    };
  }

  // Scenario 2: VKA to NOAC (Stop and wait for INR drop)
  if (fromDrug.category === 'VKA' && toDrug.category === 'NOAC') {
    if (inr === undefined) {
      return {
        recommendation: "Stop VKA and monitor INR.",
        rationale: "Transition timing depends on the current intensity of anticoagulation. Check INR 24-48 hours after stopping VKA.",
        color: '#f59e0b',
        visualType: 'STOP_START'
      };
    }
    if (inr < 2.0) {
      return {
        recommendation: `Start ${toDrug.generic} IMMEDIATELY.`,
        rationale: `INR is ${inr.toFixed(1)} (< 2.0). The patient is no longer therapeutically anticoagulated by VKA.`,
        color: '#10b981',
        visualType: 'IMMEDIATE'
      };
    } else if (inr >= 2.0 && inr <= 2.5) {
      return {
        recommendation: `Start ${toDrug.generic} NOW or TOMORROW.`,
        rationale: `INR is ${inr.toFixed(1)}. You may start the NOAC immediately or wait up to 24 hours.`,
        color: '#10b981',
        visualType: 'STOP_START'
      };
    } else {
      return {
        recommendation: `HOLD and recheck INR.`,
        rationale: `INR is ${inr.toFixed(1)}. Stop VKA and start the NOAC only when INR falls to ≤ 2.5.`,
        color: '#ef4444',
        visualType: 'STOP_START',
        inrRecommendation: 'Recheck in 24 hours'
      };
    }
  }

  // Scenario 3: NOAC to Parentral (Heparin/LMWH)
  if (fromDrug.category === 'NOAC' && toDrug.category === 'Heparin') {
    return {
      recommendation: `Start ${toDrug.generic} at the next scheduled NOAC dose.`,
      rationale: "Transition directly at the time the next oral dose would have been taken.",
      color: '#10b981',
      visualType: 'STOP_START'
    };
  }

  // Scenario 4: Parentral to NOAC
  if (fromDrug.category === 'Heparin' && toDrug.category === 'NOAC') {
    if (fromId === 'UFH') {
      return {
        recommendation: "Start NOAC 0-2 hours AFTER stopping UFH infusion.",
        rationale: "Unfractionated Heparin has a short half-life; prompt transition is required.",
        color: '#10b981',
        visualType: 'IMMEDIATE'
      };
    } else {
      return {
        recommendation: "Start NOAC 0-2 hours BEFORE the next scheduled LMWH dose.",
        rationale: "This 'bridging' technique ensures no gap in anticoagulation coverage.",
        color: '#10b981',
        visualType: 'STOP_START'
      };
    }
  }

  // Scenario 5: NOAC to NOAC
  if (fromDrug.category === 'NOAC' && toDrug.category === 'NOAC') {
    return {
      recommendation: `Start ${toDrug.generic} at the next scheduled dose of ${fromDrug.generic}.`,
      rationale: "Direct switching at the next dose interval is appropriate for all NOACs.",
      color: '#10b981',
      visualType: 'STOP_START'
    };
  }

  // Default: VKA to Heparin (Bridging)
  if (fromDrug.category === 'VKA' && toDrug.category === 'Heparin') {
    return {
      recommendation: "Stop VKA and start Heparin when INR < 2.0.",
      rationale: "Commonly used for perioperative bridging or when oral intake is impossible.",
      color: '#f59e0b',
      visualType: 'STOP_START'
    };
  }

  return {
    recommendation: `Switch to ${toDrug.generic} at the next scheduled interval.`,
    rationale: "General safety principle: avoid gaps and excessive overlap based on drug half-lives.",
    color: '#3b82f6',
    visualType: 'STOP_START'
  };
};
