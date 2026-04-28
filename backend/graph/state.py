from typing import TypedDict, Optional, List, Any
from langgraph.graph import StateGraph, END

class HealthBridgeState(TypedDict):
    # INPUT
    raw_input: str                    # Original patient text
    language: str                     # "en" or "ur"
    age_group: str                    # "infant"|"child"|"adult"|"elderly"|"unknown"
    duration: str                     # Symptom duration or "unknown"
    user_lat: float                   # User GPS latitude
    user_lng: float                   # User GPS longitude
    city: str                         # "Lahore" (default for demo)
    
    # AGENT 1 OUTPUT
    urgency_level: Optional[int]          # 1-5
    urgency_label: Optional[str]          
    urgency_color: Optional[str]          
    patient_explanation: Optional[str]    
    key_symptoms: Optional[List[str]]     
    escalation_flags: Optional[List[str]]
    triage_confidence: Optional[float]    
    
    # INTERMEDIATE DATA
    nearby_hospitals_raw: Optional[List[dict]]  # From Supabase
    
    # AGENT 2 OUTPUT
    recommended_hospitals: Optional[List[dict]]  # Ranked list of 3
    routing_logic: Optional[str]
    
    # AGENT 3 OUTPUT
    cost_breakdown: Optional[List[dict]]
    total_min_pkr: Optional[int]
    total_max_pkr: Optional[int]
    most_likely_pkr: Optional[int]
    cost_caveat: Optional[str]
    admission_risk: Optional[bool]
    what_to_bring: Optional[List[str]]
    cost_saving_tip: Optional[str]
    
    # AGENT 4 OUTPUT
    immediate_actions: Optional[List[str]]
    at_hospital_steps: Optional[List[str]]
    warning_signs: Optional[List[str]]
    home_care: Optional[List[str]]
    reassurance_note: Optional[str]
    share_message: Optional[str]
    
    # METADATA
    error: Optional[str]
    processing_time_ms: Optional[int]
    demo_mode: bool
