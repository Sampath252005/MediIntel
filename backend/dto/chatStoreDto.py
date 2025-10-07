from pydantic import BaseModel

class ChatStoreDto(BaseModel):
    title : str
    session_id : str