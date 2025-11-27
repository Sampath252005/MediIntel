import os
from dotenv import load_dotenv
from langchain_core.prompts import (
    ChatPromptTemplate,
    MessagesPlaceholder,
    PromptTemplate,
)
from langchain_google_genai import GoogleGenerativeAI
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_community.chat_message_histories import SQLChatMessageHistory
from langchain_core.output_parsers import StrOutputParser

load_dotenv()


DATABASE_URL = os.getenv("DATABASE_URL")

def get_session_history(session_id: str) -> SQLChatMessageHistory:
    return SQLChatMessageHistory(
        connection_string=DATABASE_URL,
        session_id=session_id,
        table_name="message_store",
    )

llm = GoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.7)

MEDICAL_SYSTEM_PROMPT = """
You are a professional skin cancer AI assistant named DermaGuard AI. 
Provide accurate medical information, symptom analysis, and guidance. 
Be polite, professional, and empathetic. 
Clarify when unsure, and never prescribe medications. 
Always advise consulting a qualified doctor when necessary.
"""


def get_general_response(user_input, session_id):
    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", MEDICAL_SYSTEM_PROMPT),
            MessagesPlaceholder(variable_name="history"),
            ("human", "{input}"),
        ]
    )

    chain = prompt | llm

    conversation = RunnableWithMessageHistory(
        chain,
        get_session_history,
        input_messages_key="input",
        history_messages_key="history",
    )

    general_response = conversation.invoke(
        {"input": user_input}, config={"configurable": {"session_id": session_id}}
    )
    # Safety check
    warnings = ["i am not a doctor", "consult a physician", "seek medical attention"]
    if not any(w in general_response.lower() for w in warnings):
        general_response += " Please consult a qualified healthcare professional for proper guidance."
    return general_response.strip()


def headingGenerator(firstChat: str):
    template = (
        "You are a medical AI assistant. Generate a concise, descriptive title "
        "for a medical conversation based on the user's first message. "
        "Output only the title.\n\n"
        "User's first message: {text}"
    )
    prompt = PromptTemplate(input_variables=["text"], template=template)
    chain = prompt | llm | StrOutputParser()
    
    response = chain.invoke({'text' : firstChat})
    return response

def skinCancerRecGenerator(text: str):
    template = (
        "Here you have generate the suggestion and recommendation for thr following output"
        "Here the output is based on the skin cancer"
        "give the suggestion and recommendation in 5 point and go stright for the ans"
        "the output should be in the natural formate so that anyone can understand"
        "User's first message: {text}"
    )
    prompt = PromptTemplate(input_variables=["text"], template=template)
    chain = prompt | llm | StrOutputParser()
    
    response = chain.invoke({'text' : text})
    return response


def getHistry(session_id: str):
    history = get_session_history(session_id)
    messages_list = []

    for msg in history.messages:
        messages_list.append({
            "type": msg.type,
            "content": msg.content
        })
    return messages_list