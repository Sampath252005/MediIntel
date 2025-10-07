from sqlmodel import SQLModel,Field,Relationship
from typing import Optional

class ChatStore(SQLModel , table = True):
    id: Optional[int] = Field(default=None , primary_key=True)
    title: str
    session_id : str = Field(unique=True , index=True)
    user_id: int = Field(foreign_key="users.id")
    user: Optional["Users"] = Relationship(back_populates="chats") # type: ignore