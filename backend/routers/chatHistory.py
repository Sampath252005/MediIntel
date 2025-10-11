from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select , text
from database import getSession
from typing import List
from dto.chatStoreDto import ChatStoreDto
from models.ChatStore import ChatStore
from chatModel.bot import headingGenerator

router = APIRouter(prefix='/chatHistory')

@router.get('/{userId}')
def getChatHistory(userId: int , session : Session = Depends(getSession)):
    chats = session.exec(select(ChatStore).where(ChatStore.user_id == userId)).all()
    if not chats:
        raise HTTPException(status_code=404, detail="No chat history found for this user.")
    return {
        "message": "user chats found",
        "data": [ChatStoreDto(title=chat.title, session_id=chat.session_id) for chat in chats]
    }

@router.delete('')
def deleteChat(sessionId: str, session: Session = Depends(getSession)):
    chat : ChatStore = session.exec(select(ChatStore).where(ChatStore.session_id == sessionId)).first()
    
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found.")
    
    session.delete(chat)
    session.commit()
    
    session.exec(text("DELETE FROM message_store WHERE session_id = :session_id").bindparams(session_id=sessionId))
    session.commit()
    
    return {"message": "Chat deleted successfully."}

def storeChatHistory(userId: int,chat : ChatStoreDto,session : Session = Depends(getSession)):
    title = headingGenerator(chat.title)
    newChat = ChatStore(session_id=chat.session_id,title=title,user_id=userId)
    
    session.add(newChat)
    session.commit()
    session.refresh(newChat)
    
    return {
        "message": "Chat stored successfully",
        "data": ChatStoreDto(title=title,session_id=chat.session_id)
    }

    