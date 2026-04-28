export interface HospitalInfo {
  rank: number;
  id: string;
  name: string;
  address: string;
  phone: string;
  distance_km: number;
  drive_minutes: number;
  cost_tier: number;
  has_er: boolean;
  open_24h: boolean;
  recommendation_reason: string;
  directions_note: string;
}

export interface CostItem {
  item: string;
  range_min_pkr: number;
  range_max_pkr: number;
  notes: string;
}

export interface CostEstimate {
  cost_breakdown: CostItem[];
  total_range_min_pkr: number;
  total_range_max_pkr: number;
  most_likely_total_pkr: number;
  most_likely_caveat: string;
  admission_risk: boolean;
  admission_cost_note?: string;
  what_to_bring: string[];
  cost_saving_tip: string;
}

export interface FollowUpInfo {
  immediate_actions: string[];
  at_hospital_steps: string[];
  warning_signs: string[];
  home_care_if_waiting: string[];
  reassurance_note: string;
  emergency_number: string;
  share_message: string;
}

export interface HealthBridgeResponse {
  urgency_level: number;
  urgency_label: string;
  urgency_color: string;
  patient_explanation: string;
  key_symptoms: string[];
  recommended_hospitals: HospitalInfo[];
  cost_estimate?: CostEstimate;
  follow_up: FollowUpInfo;
  language: 'en' | 'ur';
  city: string;
  processing_time_ms: number;
  error?: string;
  demo_mode: boolean;
}
