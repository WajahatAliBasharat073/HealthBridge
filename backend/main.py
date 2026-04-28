import os
import time
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from models.request_models import QueryRequest
from models.response_models import HealthBridgeResponse
from graph.pipeline import pipeline
from utils.demo_response import DEMO_RESPONSE
from services.supabase_service import log_query, get_stats

load_dotenv()

app = FastAPI(title="HealthBridge API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "version": "1.0.0"}

@app.get("/api/stats")
async def stats():
    return await get_stats()

@app.post("/api/query", response_model=HealthBridgeResponse)
async def query(request: QueryRequest):
    start_time = time.time()
    
    if request.demo_mode:
        # Simulate delay
        time.sleep(2)
        return HealthBridgeResponse(**DEMO_RESPONSE)

    try:
        # Initialize state
        initial_state = {
            "raw_input": request.text,
            "user_lat": request.lat,
            "user_lng": request.lng,
            "city": request.city,
            "age_group": request.age_group,
            "demo_mode": False
        }
        
        # Run pipeline
        final_state = await pipeline.ainvoke(initial_state)
        
        processing_time = int((time.time() - start_time) * 1000)
        
        # Log query to Supabase
        await log_query(
            session_id=None,
            city=request.city,
            urgency_level=final_state.get("urgency_level", 0),
            language=final_state.get("language", "en")
        )
        
        # Build response
        response = {
            "urgency_level": final_state["urgency_level"],
            "urgency_label": final_state["urgency_label"],
            "urgency_color": final_state["urgency_color"],
            "patient_explanation": final_state["patient_explanation"],
            "key_symptoms": final_state["key_symptoms"],
            "recommended_hospitals": final_state["recommended_hospitals"],
            "follow_up": {
                "immediate_actions": final_state["immediate_actions"],
                "at_hospital_steps": final_state["at_hospital_steps"],
                "warning_signs": final_state["warning_signs"],
                "home_care_if_waiting": final_state["home_care"],
                "reassurance_note": final_state["reassurance_note"],
                "emergency_number": "1122",
                "share_message": final_state["share_message"]
            },
            "language": final_state["language"],
            "city": final_state["city"],
            "processing_time_ms": processing_time,
            "demo_mode": False
        }
        
        if "total_min_pkr" in final_state and final_state["total_min_pkr"] is not None:
            response["cost_estimate"] = {
                "cost_breakdown": final_state["cost_breakdown"],
                "total_range_min_pkr": final_state["total_min_pkr"],
                "total_range_max_pkr": final_state["total_max_pkr"],
                "most_likely_total_pkr": final_state["most_likely_pkr"],
                "most_likely_caveat": final_state["cost_caveat"],
                "admission_risk": final_state["admission_risk"],
                "what_to_bring": final_state["what_to_bring"],
                "cost_saving_tip": final_state["cost_saving_tip"]
            }
            
        return HealthBridgeResponse(**response)

    except Exception as e:
        print(f"Pipeline error: {e}")
        # Fallback to demo response on error
        return HealthBridgeResponse(**DEMO_RESPONSE, error=str(e))

@app.post("/api/transcribe")
async def transcribe(file: UploadFile = File(...), language: str = "ur"):
    # Mock Whisper for now as it requires OpenAI API key and actual audio processing
    # In a real implementation, you'd use openai.Audio.transcribe
    return {"text": "میرے بچے کو بخار ہے", "language": "ur"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
