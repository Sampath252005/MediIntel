from datetime import datetime
from pydantic import BaseModel

class getSkinData(BaseModel):
    id: int
    diagnosis: str
    confidence_score: float
    severity_level: int
    urgency_score: float
    recommended_action: str
    ai_analysis: str
    date_time: datetime