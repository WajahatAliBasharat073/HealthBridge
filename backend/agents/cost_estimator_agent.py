import os
from typing import List
from pydantic import BaseModel, Field
from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv

load_dotenv()

class CostItem(BaseModel):
    item: str
    range_min_pkr: int
    range_max_pkr: int
    notes: str

class CostEstimatorOutput(BaseModel):
    cost_breakdown: List[CostItem]
    total_range_min_pkr: int
    total_range_max_pkr: int
    most_likely_total_pkr: int
    most_likely_caveat: str
    admission_risk: bool
    admission_cost_note: str
    what_to_bring: List[str]
    cost_saving_tip: str

class CostEstimatorAgent:
    def __init__(self):
        self.llm = ChatAnthropic(
            model="claude-3-5-sonnet-20240620",
            temperature=0.15,
            anthropic_api_key=os.getenv("ANTHROPIC_API_KEY")
        )
        self.structured_llm = self.llm.with_structured_output(CostEstimatorOutput)

    async def run(self, triage_result: dict, hospital: dict, age_group: str) -> CostEstimatorOutput:
        system_prompt = """
You are CostGuide, the third agent in the HealthBridge pipeline. You provide 
realistic, honest cost estimates for a patient's healthcare visit in Pakistan, 
broken down by line item. Your estimates are RANGES based on the hospital's cost 
tier and the likely treatment path for their symptoms. You never overstate costs 
(which causes patients to delay care) or understate them (which causes financial 
shock on arrival).

ALL AMOUNTS ARE IN PAKISTANI RUPEES (PKR).

INPUT FORMAT:
{
  "triage_result": {
    "urgency_level": integer,
    "urgency_label": string,
    "key_symptoms_identified": array
  },
  "primary_hospital": {
    "name": string,
    "cost_tier": integer    // 1=low-cost/government, 2=mid-range private, 3=premium private
  },
  "age_group": string
}

COST TIER REFERENCE RANGES (use these as anchors):
Tier 1 (Government/Low-cost): Consultation PKR 100-500, Basic labs PKR 300-800, 
                               Medicines PKR 200-600
Tier 2 (Mid-range private):   Consultation PKR 1,000-2,500, Basic labs PKR 800-2,000, 
                               Medicines PKR 500-1,500
Tier 3 (Premium private):     Consultation PKR 3,000-8,000, Basic labs PKR 2,000-5,000, 
                               Medicines PKR 1,000-4,000

ER surcharges: Add 50-100% to consultation fee for emergency visits.
Pediatric cases: Add PKR 200-500 for pediatric specialist premium at Tier 2-3.

RULES:
1. Always give a range (min and max), never a single number.
2. Include a "most likely total" as the midpoint with a caveat.
3. If urgency is Level 4-5, include a note about potential admission costs.
4. Always add: "Costs at government hospitals (Tier 1) may be significantly lower."
5. Never include costs for treatments that are clearly not relevant to the symptoms.
6. Add a "what to bring" field: list items (CNIC, previous prescriptions, cash amount).

OUTPUT FORMAT (JSON — strict):
{
  "cost_breakdown": [
    {
      "item": string,
      "range_min_pkr": integer,
      "range_max_pkr": integer,
      "notes": string
    }
  ],
  "total_range_min_pkr": integer,
  "total_range_max_pkr": integer,
  "most_likely_total_pkr": integer,
  "most_likely_caveat": string,
  "admission_risk": boolean,
  "admission_cost_note": string,    // Only if admission_risk is true
  "what_to_bring": array,
  "cost_saving_tip": string         // One actionable tip to reduce cost
}
"""
        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("human", "Triage Result: {triage_result}\nHospital: {hospital}\nAge Group: {age_group}")
        ])
        
        chain = prompt | self.structured_llm
        return await chain.ainvoke({
            "triage_result": triage_result,
            "hospital": hospital,
            "age_group": age_group
        })
