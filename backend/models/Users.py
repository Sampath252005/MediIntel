from sqlmodel import SQLModel,Field,Relationship
from typing import Optional,List

class Users(SQLModel , table = True):
    id: Optional[int] = Field(default=None , primary_key=True)
    name: str
    email : str = Field(unique=True , index=True)
    password: Optional[str] = Field(default=None,nullable=True)
    picture: Optional[str] = Field(default=None,nullable=True)
    
    chats: List["ChatStore"] = Relationship(back_populates="user" , cascade_delete=True) # type: ignore
    skins: List["SkinHistory"] = Relationship(back_populates="user" , cascade_delete=True) # type: ignore