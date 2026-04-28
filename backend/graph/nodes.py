import re
from typing import Dict, Any
from .state import HealthBridgeState
from agents.triage_agent import TriageAgent
from agents.hospital_finder_agent import HospitalFinderAgent
from agents.cost_estimator_agent import CostEstimatorAgent
from agents.followup_agent import FollowUpAgent
from services.supabase_service import get_nearby_hospitals

def detect_language(text: str) -> str:
    # Simple Urdu detection based on unicode range
    if any('\u0600' <= char <= '\u06FF' for char in text):
        return "ur"
    return "en"

def extract_age_group(text: str) -> str:
    text = text.lower()
    if any(word in text for word in ["baby", "infant", "شیر خوار"]):
        return "infant"
    if any(word in text for word in ["child", "kid", "بچہ", "بچی"]):
        return "child"
    if any(word in text for word in ["elderly", "old", "بوڑھا", "بزرگ"]):
        return "elderly"
    return "adult"

async def normalise_input(state: HealthBridgeState) -> Dict[str, Any]:
    raw_input = state.get("raw_input", "")
    language = detect_language(raw_input)
    age_group = extract_age_group(raw_input) if state.get("age_group") == "unknown" else state.get("age_group")
    
    # Simple duration extraction
    duration = "unknown"
    match = re.search(r'(\d+)\s*(days?|hours?|weeks?|دن|گھنٹے)', raw_input)
    if match:
        duration = match.group(0)

    return {
        "language": language,
        "age_group": age_group,
        "duration": duration
    }

async def triage_node(state: HealthBridgeState) -> Dict[str, Any]:
    agent = TriageAgent()
    result = await agent.run(
        symptoms=state["raw_input"],
        age_group=state["age_group"],
        duration=state["duration"],
        language=state["language"]
    )
    return {
        "urgency_level": result.urgency_level,
        "urgency_label": result.urgency_label,
        "urgency_color": result.urgency_color,
        "patient_explanation": result.patient_explanation,
        "key_symptoms": result.key_symptoms_identified,
        "escalation_flags": result.escalation_flags,
        "triage_confidence": result.confidence
    }

async def fetch_hospitals_node(state: HealthBridgeState) -> Dict[str, Any]:
    hospitals = await get_nearby_hospitals(
        lat=state["user_lat"],
        lng=state["user_lng"],
        city=state["city"]
    )
    return {"nearby_hospitals_raw": hospitals}

async def hospital_finder_node(state: HealthBridgeState) -> Dict[str, Any]:
    agent = HospitalFinderAgent()
    triage_data = {
        "urgency_level": state["urgency_level"],
        "urgency_label": state["urgency_label"]
    }
    result = await agent.run(triage_data, state["nearby_hospitals_raw"])
    
    # Convert Pydantic models to dicts for state
    recommended = [h.model_dump() for h in result.recommended_hospitals]
    
    return {
        "recommended_hospitals": recommended,
        "routing_logic": result.routing_logic_summary
    }

async def cost_estimator_node(state: HealthBridgeState) -> Dict[str, Any]:
    # Skip if urgency is 5 (handled by conditional edge, but good to have safety)
    if state.get("urgency_level") == 5:
        return {}
        
    agent = CostEstimatorAgent()
    primary_hospital = state["recommended_hospitals"][0] if state["recommended_hospitals"] else {}
    triage_data = {"urgency_level": state["urgency_level"]}
    
    result = await agent.run(triage_data, primary_hospital, state["age_group"])
    
    return {
        "cost_breakdown": [c.model_dump() for c in result.cost_breakdown],
        "total_min_pkr": result.total_range_min_pkr,
        "total_max_pkr": result.total_range_max_pkr,
        "most_likely_pkr": result.most_likely_total_pkr,
        "cost_caveat": result.most_likely_caveat,
        "admission_risk": result.admission_risk,
        "what_to_bring": result.what_to_bring,
        "cost_saving_tip": result.cost_saving_tip
    }

async def followup_node(state: HealthBridgeState) -> Dict[str, Any]:
    agent = FollowUpAgent()
    
    triage_data = {"urgency_level": state["urgency_level"], "urgency_label": state["urgency_label"]}
    hospital_data = state["recommended_hospitals"][0] if state["recommended_hospitals"] else {}
    cost_data = {
        "min": state.get("total_min_pkr"),
        "max": state.get("total_max_pkr"),
        "most_likely": state.get("most_likely_pkr")
    }
    
    result = await agent.run(
        symptoms=state["raw_input"],
        triage=triage_data,
        hospital=hospital_data,
        cost=cost_data,
        language=state["language"]
    )
    
    return {
        "immediate_actions": result.immediate_actions,
        "at_hospital_steps": result.at_hospital_steps,
        "warning_signs": result.warning_signs,
        "home_care": result.home_care_if_waiting,
        "reassurance_note": result.reassurance_note,
        "share_message": result.share_message
    }

async def emergency_shortcut_node(state: HealthBridgeState) -> Dict[str, Any]:
    # This is a placeholder as the logic is handled by conditional edges
    return {}
