from fastapi import FastAPI,Depends
from dto.userDto import GetUser
from models.Users import Users
from routers.authApi import router as authRouter , get_current_user
from routers.chatHistory import router as chatHistoryRouter
from routers.chatRouter import router as chatRouter
from routers.skinRouter import router as skinRouter
from database import create_db_and_tables, getSession
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from dotenv import load_dotenv
from sqlmodel import Session, select
import os

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    SessionMiddleware, 
    secret_key=os.getenv("SECRET_KEY")
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    
app.include_router(authRouter)
app.include_router(chatHistoryRouter)
app.include_router(chatRouter)
app.include_router(skinRouter)

@app.get('/Profile')
def getProfile(email: str = Depends(get_current_user),session: Session = Depends(getSession)):
    user: Users = session.exec(select(Users).where(Users.email == email)).first()
    return GetUser(name=user.name,email=user.email,picture=user.picture)