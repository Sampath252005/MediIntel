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

# PostgreSQL connection string
DATABASE_URL = os.getenv(
    "DATABASE_URL"
)  # e.g., "postgresql://user:password@localhost:5432/dbname"


# ✅ PostgreSQL persistence with psycopg2
def get_session_history(session_id: str) -> SQLChatMessageHistory:
    return SQLChatMessageHistory(
        connection_string=DATABASE_URL,
        session_id=session_id,
        table_name="message_store",
    )


llm = GoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.7)

# prompt = ChatPromptTemplate.from_messages([
#     ("system", "You are a helpful AI assistant. Have a natural conversation with the user. your name is jarvis"),
#     MessagesPlaceholder(variable_name="history"),
#     ("human", "{input}")
# ])

# chain = prompt | llm

# conversation = RunnableWithMessageHistory(
#     chain,
#     get_session_history,
#     input_messages_key="input",
#     history_messages_key="history"
# )


def get_general_response(user_input, session_id):
    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "You are a helpful AI assistant. Have a natural conversation with the user. your name is jarvis",
            ),
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
    return general_response.strip()


def headingGenerator(firstChat: str):
    template = (
        "Here I am sending the first chat of the user. "
        "You need to generate a title for me. "
        "The output should be only a string of the title so that I can directly use that. "
        "The first chat is: {text}"
    )
    prompt = PromptTemplate(input_variables=["text"], template=template)
    chain = prompt | llm | StrOutputParser()
    
    response = chain.invoke({'text' : firstChat})
    return response


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