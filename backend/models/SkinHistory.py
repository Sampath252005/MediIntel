from sqlmodel import SQLModel,Field,Relationship
from typing import Optional,List
from datetime import datetime

class SkinHistory(SQLModel , table = True):
    id: Optional[int] = Field(default=None , primary_key=True)
    diagnosis: str
    confidence_score: float
    severity_level: int
    urgency_score: float
    recommended_action: str
    ai_analysis: str
    user_id: int = Field(foreign_key="users.id")
    date_time: datetime = Field(default_factory=datetime.now)
    
    user: Optional["Users"] = Relationship(back_populates="skins") # type: ignore