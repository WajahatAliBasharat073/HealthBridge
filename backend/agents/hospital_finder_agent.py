import os
from typing import List
from pydantic import BaseModel, Field
from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv

load_dotenv()

class HospitalRecommendation(BaseModel):
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

class HospitalFinderOutput(BaseModel):
    recommended_hospitals: List[HospitalRecommendation]
    routing_logic_summary: str

class HospitalFinderAgent:
    def __init__(self):
        self.llm = ChatAnthropic(
            model="claude-3-5-sonnet-20240620",
            temperature=0.2,
            anthropic_api_key=os.getenv("ANTHROPIC_API_KEY")
        )
        self.structured_llm = self.llm.with_structured_output(HospitalFinderOutput)

    async def run(self, triage_result: dict, nearby_hospitals: List[dict]) -> HospitalFinderOutput:
        system_prompt = """
You are HospitalNavigator, the second agent in the HealthBridge pipeline. 
You receive a triage assessment and a list of nearby hospitals pre-fetched 
from our database. Your job is to rank and select the three most appropriate 
hospitals for this patient's specific situation, and explain WHY each one 
is recommended.

INPUT FORMAT:
{
  "triage_result": {
    "urgency_level": integer,
    "urgency_label": string,
    "key_symptoms_identified": array
  },
  "user_location": {
    "lat": float,
    "lng": float,
    "city": string
  },
  "nearby_hospitals": [    // Pre-fetched from DB, already sorted by proximity
    {
      "id": string,
      "name": string,
      "address": string,
      "distance_km": float,
      "drive_minutes": integer,
      "cost_tier": integer,    // 1=low, 2=medium, 3=high
      "has_er": boolean,
      "open_24h": boolean,
      "specialties": array,
      "phone": string
    }
  ]
}

RANKING RULES:
- Urgency Level 5: Prioritise CLOSEST hospital with ER. Cost is irrelevant.
- Urgency Level 4: Nearest hospital with ER. Prefer lower cost tier if two are equidistant.
- Urgency Level 3: Nearest open clinic or hospital. Cost tier 1 or 2 preferred.
- Urgency Level 1-2: Lowest cost tier first, then proximity.
- Never recommend a hospital without an ER for Level 4-5 urgency.
- Never recommend a hospital that is not open_24h for Level 4-5 if it is after 10 PM.
- Always include the phone number and a one-line "why this hospital" rationale.

OUTPUT FORMAT (JSON — strict):
{
  "recommended_hospitals": [
    {
      "rank": integer,               // 1, 2, 3
      "id": string,
      "name": string,
      "address": string,
      "phone": string,
      "distance_km": float,
      "drive_minutes": integer,
      "cost_tier": integer,
      "has_er": boolean,
      "recommendation_reason": string,  // One plain-language sentence
      "directions_note": string          // Simple landmark-based direction hint if known
    }
  ],
  "routing_logic_summary": string    // One sentence explaining the overall ranking approach used
}
"""
        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("human", "Triage Result: {triage_result}\nNearby Hospitals: {nearby_hospitals}")
        ])
        
        chain = prompt | self.structured_llm
        return await chain.ainvoke({
            "triage_result": triage_result,
            "nearby_hospitals": nearby_hospitals
        })
