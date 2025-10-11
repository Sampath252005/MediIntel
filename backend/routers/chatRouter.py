from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlmodel import Session
from typing import List, Optional
from database import getSession
from dto.chatStoreDto import ChatStoreDto
from routers.chatHistory import storeChatHistory
from chatModel.bot import get_response, getHistry, clear_session
from urllib.parse import unquote

router = APIRouter(prefix='/chats')



@router.post("/{sessionId}/send")
async def chat(
    sessionId: str,
    userInput: str = Form(...),
    images: List[UploadFile] = File(None),
    db_session: Session = Depends(getSession)
):
    """
    Unified chat endpoint for text and optional images.
    Images uploaded once are remembered for the session.
    """
    try:
        # Get session history
        history = getHistry(sessionId)

        # Store first chat as session title
        if not history:
            chat = ChatStoreDto(title=unquote(userInput), session_id=sessionId)
            storeChatHistory(1, chat, db_session)

        # Read uploaded images safely
        image_bytes_list = []
        for img in images:
            # Skip invalid entries (Swagger sometimes sends placeholder strings)
            if not hasattr(img, "read"):
                continue
            img_bytes = await img.read()
            image_bytes_list.append(img_bytes)

        # Get response (unified for text + images)
        response = get_response(
            user_input=unquote(userInput),
            session_id=sessionId,
            new_images=image_bytes_list if image_bytes_list else None
        )

        if not response:
            raise HTTPException(
                status_code=400,
                detail="Failed to generate a response."
            )

        return {
            "message": "Message sent successfully",
            "data": response,
            "images_uploaded_this_message": len(image_bytes_list)
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal Server Error: {str(e)}"
        )


@router.get("/history")
def messageHistory(sessionId: str):
    """Get chat history for a session"""
    try:
        response = getHistry(session_id=sessionId)

        # Handle both list or dict responses gracefully
        if isinstance(response, list) and not response:
            raise HTTPException(
                status_code=404,
                detail="No chat history found for this session."
            )
        if isinstance(response, dict) and not response.get("messages"):
            raise HTTPException(
                status_code=404,
                detail="No chat history found for this session."
            )

        return {
            "message": "Chat history retrieved successfully",
            "data": response
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal Server Error: {str(e)}"
        )


@router.delete("/{sessionId}")
def clearSessionRoute(sessionId: str):
    """Clear session data including images and FAISS vectors"""
    try:
        clear_session(sessionId)
        return {
            "message": f"Session {sessionId} cleared successfully"
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal Server Error: {str(e)}"
        )
