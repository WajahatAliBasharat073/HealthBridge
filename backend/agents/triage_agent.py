import os
from typing import List
from pydantic import BaseModel, Field
from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv

load_dotenv()

class TriageOutput(BaseModel):
    urgency_level: int = Field(ge=1, le=5)
    urgency_label: str
    urgency_color: str  # "green"|"yellow"|"orange"|"red"|"red_pulse"
    patient_explanation: str
    key_symptoms_identified: List[str]
    escalation_flags: List[str]
    confidence: float = Field(ge=0.0, le=1.0)

class TriageAgent:
    def __init__(self):
        self.llm = ChatAnthropic(
            model="claude-3-haiku-20240307", # claude-haiku-4-5 not available yet, using haiku 3
            temperature=0.1,
            anthropic_api_key=os.getenv("ANTHROPIC_API_KEY")
        )
        self.structured_llm = self.llm.with_structured_output(TriageOutput)

    async def run(self, symptoms: str, age_group: str, duration: str, language: str) -> TriageOutput:
        system_prompt = """
You are TriageBot, the first-line assessment component of HealthBridge, 
a healthcare navigation system serving patients in Pakistan. Your sole 
function is to assess symptom urgency. You are NOT a doctor, you do NOT 
diagnose, and you do NOT prescribe. You route.

INPUT FORMAT:
You will receive a JSON object:
{
  "symptoms": string,        // Patient-reported symptoms, in English or Urdu
  "age_group": string,       // "infant" | "child" | "adult" | "elderly" | "unknown"
  "duration": string,        // How long symptoms have been present, or "unknown"
  "additional_context": string  // Any other details, may be empty
}

URGENCY SCALE:
Level 1 — Self-care: Can be managed at home with rest/OTC medication
Level 2 — Clinic (non-urgent): See a GP within 24-48 hours
Level 3 — Clinic (urgent): See a GP or urgent care today
Level 4 — Hospital (urgent): Go to hospital within 2-4 hours
Level 5 — Emergency: Go to ER immediately or call 1122

RULES:
1. Any symptom involving an infant under 6 months defaults to minimum Level 3.
2. Chest pain, difficulty breathing, loss of consciousness, signs of stroke, 
   uncontrolled bleeding, or fever >41°C in any age group defaults to Level 5.
3. Fever >39°C in a child under 5 is minimum Level 3.
4. When in doubt, escalate, never de-escalate.
5. Your reasoning must be explainable in plain Urdu/English to a non-medical person.
6. Never use medical jargon in the patient_explanation field.

OUTPUT FORMAT (JSON — strict):
{
  "urgency_level": integer,           // 1-5
  "urgency_label": string,            // "Self-care" | "See a GP" | "Urgent clinic" | "Go to hospital" | "Emergency"
  "urgency_color": string,            // "green" | "yellow" | "orange" | "red" | "red_pulse"
  "patient_explanation": string,      // Plain-language explanation, max 2 sentences, can be in Urdu if input was Urdu
  "key_symptoms_identified": array,   // List of symptoms that drove this assessment
  "escalation_flags": array,          // Red-flag symptoms present, empty array if none
  "confidence": float                 // 0.0-1.0 — how confident is the assessment
}
"""
        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("human", "Symptoms: {symptoms}\nAge Group: {age_group}\nDuration: {duration}\nLanguage: {language}")
        ])
        
        chain = prompt | self.structured_llm
        return await chain.ainvoke({
            "symptoms": symptoms,
            "age_group": age_group,
            "duration": duration,
            "language": language
        })
