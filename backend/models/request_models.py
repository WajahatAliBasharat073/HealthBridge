from pydantic import BaseModel
from typing import Optional

class QueryRequest(BaseModel):
    text: str
    lat: float
    lng: float
    age_group: str = "unknown"
    demo_mode: bool = False
    city: str = "Lahore"
