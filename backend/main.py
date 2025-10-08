from fastapi import FastAPI,Depends
from routers.authApi import router as authRouter , get_current_user
from routers.chatHistory import router as chatHistoryRouter
from routers.chatRouter import router as chatRouter
from database import create_db_and_tables
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from dotenv import load_dotenv
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

student = [
    {
        'id' : 1,
        'name' : "name1"
    },
    {
        'id' : 2,
        'name' : "name2"
    },
    {
        'id' : 3,
        'name' : "name3"
    }
]

@app.get('/')
def greeting():
    return "Hello World!!"

@app.get("/student")
def getStudent(email: str = Depends(get_current_user)):
    return student

@app.post("/student")
def addStudent(id: int,name : str , email: str=Depends(get_current_user)):
    student.append({
        'id' : id,
        'name' : name
    })
    
    return {'message' : "Student Added"}