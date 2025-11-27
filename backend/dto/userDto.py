from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str
    
class GetUser(BaseModel):
    name: str
    email: str
    picture: str | None = None