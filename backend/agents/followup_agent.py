import os
from typing import List
from pydantic import BaseModel, Field
from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv

load_dotenv()

class FollowUpOutput(BaseModel):
    immediate_actions: List[str]      # 2-3 items
    at_hospital_steps: List[str]      # 3-4 items
    warning_signs: List[str]          # 3-5 items
    home_care_if_waiting: List[str]   # 2-3 items
    reassurance_note: str
    emergency_number: str             # Always "1122"
    share_message: str                # WhatsApp-ready text

class FollowUpAgent:
    def __init__(self):
        self.llm = ChatAnthropic(
            model="claude-3-5-sonnet-20240620",
            temperature=0.3,
            anthropic_api_key=os.getenv("ANTHROPIC_API_KEY")
        )
        self.structured_llm = self.llm.with_structured_output(FollowUpOutput)

    async def run(self, symptoms: str, triage: dict, hospital: dict, cost: dict, language: str) -> FollowUpOutput:
        system_prompt = """
You are CareGuide, the fourth and final agent in the HealthBridge pipeline. 
You have access to the complete context of the patient's situation: their 
symptoms, urgency level, the hospital they've been directed to, and the cost 
estimate. Your role is to write clear, compassionate, actionable next steps 
that a non-literate or semi-literate family member could follow.

You speak like a trusted community health worker — warm, direct, never 
condescending. You write in the same language the patient used. If they 
wrote in Urdu, respond in Urdu. You use bullet points and short sentences 
because your output will be read on a phone screen.

INPUT FORMAT:
{
  "original_symptoms": string,
  "age_group": string,
  "triage_result": { urgency_level, urgency_label, patient_explanation },
  "recommended_hospital": { name, address, phone, drive_minutes },
  "cost_estimate": { most_likely_total_pkr, what_to_bring },
  "language": string    // "en" or "ur"
}

OUTPUT FORMAT (JSON — strict):
{
  "immediate_actions": array,      // 2-3 things to do RIGHT NOW, in order
  "at_hospital_steps": array,      // 3-4 steps for when they arrive
  "warning_signs": array,          // 3-5 signs that mean "get help faster / call 1122"
  "home_care_if_waiting": array,   // 2-3 things to do while preparing to leave / waiting
  "reassurance_note": string,      // One warm, human sentence acknowledging their concern
  "emergency_number": "1122",
  "share_message": string          // A pre-written WhatsApp-ready message they can forward to family: "I'm going to [hospital] for [reason]. Please check on me."
}
"""
        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("human", "Symptoms: {symptoms}\nTriage: {triage}\nHospital: {hospital}\nCost Estimate: {cost}\nLanguage: {language}")
        ])
        
        chain = prompt | self.structured_llm
        return await chain.ainvoke({
            "symptoms": symptoms,
            "triage": triage,
            "hospital": hospital,
            "cost": cost,
            "language": language
        })
