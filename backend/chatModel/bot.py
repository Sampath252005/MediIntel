import os
import base64
from typing import List, Optional
from dotenv import load_dotenv

from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder, PromptTemplate
from langchain_google_genai import GoogleGenerativeAI, ChatGoogleGenerativeAI
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_community.chat_message_histories import SQLChatMessageHistory
from langchain_core.output_parsers import StrOutputParser
from langchain_community.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_core.documents import Document

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Initialize models
llm = GoogleGenerativeAI(model="gemini-2.0-flash-exp", temperature=0.7)
vision_llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash-exp", temperature=0.7)
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

# Store FAISS indices per session (in-memory storage)
session_vector_stores = {}
# Store uploaded images per session (in-memory)
session_images = {}


# ===== Session & History =====

def get_session_history(session_id: str) -> SQLChatMessageHistory:
    return SQLChatMessageHistory(
        connection_string=DATABASE_URL,
        session_id=session_id,
        table_name="message_store",
    )


def getHistry(session_id: str):
    """Get chat history for a session"""
    history = get_session_history(session_id)
    messages_list = []

    for msg in history.messages:
        messages_list.append({
            "type": msg.type,
            "content": msg.content
        })

    return messages_list


# ===== Image Processing =====

def encode_image(image_bytes: bytes) -> str:
    """Encode image bytes to base64 string"""
    return base64.b64encode(image_bytes).decode('utf-8')


def process_images_with_vision(image_files: List[bytes], user_text: str) -> str:
    """Extract information from images using Gemini vision model"""
    messages = [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": f"User message: {user_text}\n\nAnalyze the provided images and extract relevant information."
                }
            ]
        }
    ]

    for img_bytes in image_files:
        img_base64 = encode_image(img_bytes)
        messages[0]["content"].append({
            "type": "image_url",
            "image_url": {"url": f"data:image/jpeg;base64,{img_base64}"}
        })

    response = vision_llm.invoke(messages)
    return response.content


def store_image_context(session_id: str, image_description: str, user_text: str):
    """Store image context in FAISS vector store for the session"""
    combined_text = f"User query: {user_text}\nImage analysis: {image_description}"

    doc = Document(
        page_content=combined_text,
        metadata={"session_id": session_id, "type": "image_context"}
    )

    if session_id in session_vector_stores:
        session_vector_stores[session_id].add_documents([doc])
    else:
        session_vector_stores[session_id] = FAISS.from_documents([doc], embeddings)


def retrieve_image_context(session_id: str, query: str, k: int = 3) -> str:
    """Retrieve relevant image context from FAISS for the session"""
    if session_id not in session_vector_stores:
        return ""

    docs = session_vector_stores[session_id].similarity_search(query, k=k)

    if not docs:
        return ""

    context = "\n\n".join([doc.page_content for doc in docs])
    return f"Previous image context from this conversation:\n{context}"


def clear_session_vectors(session_id: str):
    """Clear vector store for a session"""
    if session_id in session_vector_stores:
        del session_vector_stores[session_id]


# ===== Unified Chat =====

def get_response(user_input: str, session_id: str, new_images: Optional[List[bytes]] = None) -> str:
    """
    Unified chat response function for text and images.
    Remembers previously uploaded images in the session.
    """
    # Initialize session images if not present
    if session_id not in session_images:
        session_images[session_id] = []

    # Add newly uploaded images
    if new_images:
        session_images[session_id].extend(new_images)

    # Process new images if present
    image_description = ""
    if new_images:
        image_description = process_images_with_vision(new_images, user_input)
        store_image_context(session_id, image_description, user_input)

    # Retrieve previous image context for this session
    past_context = retrieve_image_context(session_id, user_input)

    # Build system message
    system_message = (
        "You are Jarvis, a helpful AI assistant. "
        "You can see and analyze images shared by the user. "
        "Use the image information to provide accurate and helpful responses."
    )

    if past_context:
        system_message += f"\n\n{past_context}"

    if image_description:
        system_message += f"\n\nCurrent image analysis: {image_description}"

    # Create conversation with message history
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_message),
        MessagesPlaceholder(variable_name="history"),
        ("human", "{input}")
    ])

    chain = prompt | llm

    conversation = RunnableWithMessageHistory(
        chain,
        get_session_history,
        input_messages_key="input",
        history_messages_key="history"
    )

    response = conversation.invoke(
        {"input": user_input},
        config={"configurable": {"session_id": session_id}}
    )

    return response.strip()


# ===== Session Management =====

def clear_session(session_id: str):
    """Clear both FAISS vectors and stored images for a session"""
    session_images.pop(session_id, None)
    clear_session_vectors(session_id)


# ===== Title Generation =====

def headingGenerator(firstChat: str):
    """Generate a title from the first chat message"""
    template = (
        "Here I am sending the first chat of the user. "
        "You need to generate a title for me. "
        "The output should be only a string of the title so that I can directly use that. "
        "The first chat is: {text}"
    )
    prompt = PromptTemplate(input_variables=["text"], template=template)
    chain = prompt | llm | StrOutputParser()

    response = chain.invoke({'text': firstChat})
    return response
