import os
from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_google_genai import GoogleGenerativeAI
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_community.chat_message_histories import SQLChatMessageHistory

load_dotenv()

# PostgreSQL connection string
DATABASE_URL = os.getenv("DATABASE_URL")  # e.g., "postgresql://user:password@localhost:5432/dbname"

# ✅ PostgreSQL persistence with psycopg2
def get_session_history(session_id: str) -> SQLChatMessageHistory:
    return SQLChatMessageHistory(
        connection_string=DATABASE_URL,
        session_id=session_id,
        table_name="message_store"
    )

llm = GoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.7)

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful AI assistant. Have a natural conversation with the user. your name is jarvis"),
    MessagesPlaceholder(variable_name="history"),
    ("human", "{input}")
])

# chain = prompt | llm

# conversation = RunnableWithMessageHistory(
#     chain,
#     get_session_history,
#     input_messages_key="input",
#     history_messages_key="history"
# )

def get_general_response(user_input, session_id):
    chain = prompt | llm

    conversation = RunnableWithMessageHistory(
        chain,
        get_session_history,
        input_messages_key="input",
        history_messages_key="history"
    )
    general_response = conversation.invoke(
        {"input": user_input},
        config={"configurable": {"session_id": session_id}}
    )
    return general_response.content.strip()

# if __name__ == "__main__":
#     config = {"configurable": {"session_id": "user_123"}}
    
#     # First message
#     response1 = conversation.invoke(
#         {"input": "Hi! I'm learning LangChain."},
#         config=config
#     )
#     print(f"AI: {response1}\n")
    
#     # Second message - remembers context
#     response2 = conversation.invoke(
#         {"input": "What am I learning?"},
#         config=config
#     )
#     print(f"AI: {response2}\n")
    
#     # View history from PostgreSQL
#     print("\n--- Message History (from PostgreSQL) ---")
#     history = get_session_history("user_123")
#     for msg in history.messages:
#         print(f"{msg.type}: {msg.content}")