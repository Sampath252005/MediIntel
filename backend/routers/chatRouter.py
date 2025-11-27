from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from database import getSession
from typing import List
from dto.chatStoreDto import ChatStoreDto
from models.ChatStore import ChatStore
from models.Users import Users
from routers.authApi import get_current_user
from routers.chatHistory import storeChatHistory
from chatModel.bot import get_general_response,getHistry
from urllib.parse import unquote

router = APIRouter(prefix='/chats')

@router.post("/{sessionId}")
def messaging(sessionId: str, userInput: str,session : Session=Depends(getSession),email: str = Depends(get_current_user)):
    try:
        history = getHistry(sessionId)
        user: Users = session.exec(select(Users).where(Users.email == email)).first()
        if not history :
            chat = ChatStoreDto(title=unquote(userInput),session_id=sessionId)
            storeChatHistory(user.id,chat,session)
            
        response = get_general_response(session_id=sessionId, user_input=unquote(userInput))
        if not response:
            raise HTTPException(status_code=400, detail="Failed to generate a response for the given input.")
        
        return {
            "message": "Message sent successfully",
            "data": response
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")


@router.get("/history")
def messageHistory(sessionId: str):
    try:
        response = getHistry(session_id=sessionId)

        # ✅ Handle both list or dict responses gracefully
        if isinstance(response, list):
            if not response:
                raise HTTPException(status_code=404, detail="No chat history found for this session.")
        elif isinstance(response, dict):
            if not response.get("messages"):
                raise HTTPException(status_code=404, detail="No chat history found for this session.")
        else:
            raise HTTPException(status_code=500, detail="Unexpected data format returned by getHistry().")

        return {
            "message": "Chat history retrieved successfully",
            "data": response
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
