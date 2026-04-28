from pydantic import BaseModel, Field
from typing import List, Optional

class HospitalInfo(BaseModel):
    rank: int
    id: str
    name: str
    address: str
    phone: str
    distance_km: float
    drive_minutes: int
    cost_tier: int
    has_er: bool
    open_24h: bool
    recommendation_reason: str
    directions_note: str

class CostItem(BaseModel):
    item: str
    range_min_pkr: int
    range_max_pkr: int
    notes: str

class CostEstimate(BaseModel):
    cost_breakdown: List[CostItem]
    total_range_min_pkr: int
    total_range_max_pkr: int
    most_likely_total_pkr: int
    most_likely_caveat: str
    admission_risk: bool
    admission_cost_note: Optional[str] = None
    what_to_bring: List[str]
    cost_saving_tip: str

class FollowUpInfo(BaseModel):
    immediate_actions: List[str]
    at_hospital_steps: List[str]
    warning_signs: List[str]
    home_care_if_waiting: List[str]
    reassurance_note: str
    emergency_number: str = "1122"
    share_message: str

class HealthBridgeResponse(BaseModel):
    # Triage
    urgency_level: int
    urgency_label: str
    urgency_color: str
    patient_explanation: str
    key_symptoms: List[str]
    
    # Hospitals
    recommended_hospitals: List[HospitalInfo]
    
    # Cost
    cost_estimate: Optional[CostEstimate] = None
    
    # Follow-up
    follow_up: FollowUpInfo
    
    # Metadata
    language: str
    city: str
    processing_time_ms: int
    error: Optional[str] = None
    demo_mode: bool = False
