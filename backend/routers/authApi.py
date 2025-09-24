from fastapi import APIRouter, Depends, HTTPException, Response, Request,status
from sqlmodel import Session, select
from database import getSession
from models.Users import Users
from models.RefreshToken import RefreshToken
from dto.userDto import UserCreate, UserLogin
from authlib.integrations.starlette_client import OAuth
from utils.authUtil import (
    create_access_token,
    create_refresh_token,
    hash_password,
    verify_password,
    verify_token,
)
from dotenv import load_dotenv
import os

load_dotenv()

router = APIRouter()

oauth = OAuth()

oauth.register(
    name="google",
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={
        "scope": "openid email profile"
    },
)


def get_current_user(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Access token missing")

    return verify_token(token)


@router.post("/register")
def register(user: UserCreate, session: Session = Depends(getSession)):
    existing_user = session.exec(select(Users).where(Users.email == user.email)).first()
    if existing_user:
        if not existing_user.password or existing_user.password == None:
            existing_user.password = hash_password(user.password)
            session.add(existing_user)
            session.commit()
            session.refresh(existing_user)
            return {"message": "User registered success!!"}
        else:
            raise HTTPException(status_code=400, detail="Username already exists")
    dbUser = Users(
        name=user.name, email=user.email, password=hash_password(user.password)
    )
    session.add(dbUser)
    session.commit()
    session.refresh(dbUser)
    return {"message": "User registered success!!"}


@router.post("/login")
def login(user: UserLogin, response: Response, session: Session = Depends(getSession)):
    db_user = session.exec(select(Users).where(Users.email == user.email)).first()
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if(db_user.password == None):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="Login with the google")
    if not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    aToken = create_access_token({"sub": db_user.email})
    rToken = create_refresh_token({"sub": db_user.email})

    existing_rToken = session.exec(
        select(RefreshToken).where(RefreshToken.email == user.email)
    ).first()

    if existing_rToken:
        existing_rToken.token = hash_password(rToken)
        session.add(existing_rToken)
        session.commit()
        session.refresh(existing_rToken)
    else:
        newRToken = RefreshToken(email=user.email, token=hash_password(rToken))
        session.add(newRToken)
        session.commit()
        session.refresh(newRToken)

    response.set_cookie(
        key="access_token",
        value=aToken,
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=15 * 60,
    )

    response.set_cookie(
        key="refresh_token",
        value=rToken,
        httponly=True,
        secure=True,
        path="/refresh",
        samesite="strict",
        max_age=60 * 60 * 24 * 7,
    )

    return {
        "message": "Login successful",
        "data": {"id": db_user.id, "name": db_user.name, "email": db_user.email},
    }


@router.get("/login/{provider}")
async def googleLogin(
    provider: str, request: Request, session: Session = Depends(getSession)
):
    if provider != "google":
        raise HTTPException(status_code=401, detail="Unsupported provider")
    redirect_uri = request.url_for('auth_callback', provider=provider)
    return await oauth.create_client(provider).authorize_redirect(request, redirect_uri)


@router.get("/auth/{provider}/callback")
async def auth_callback(request: Request, response : Response, provider: str,session: Session = Depends(getSession)):
    token = await oauth.create_client(provider).authorize_access_token(request)

    user_info = token.get("userinfo")

    if not user_info['email']:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    existing_user = session.exec(select(Users).where(Users.email == user_info['email'])).first()
    if not existing_user :
        user = Users(name=user_info['name'],email=user_info['email'],password=None,picture=user_info['picture'])
        session.add(user)
        session.commit()
        session.refresh(user)
    
    aToken = create_access_token({"sub": user_info['email']})
    rToken = create_refresh_token({"sub": user_info['email']})
    
    existing_rToken = session.exec(select(RefreshToken).where(RefreshToken.email == user_info['email'])).first()
    if existing_rToken:
        existing_rToken.token = hash_password(rToken)
        session.add(existing_rToken)
        session.commit()
        session.refresh(existing_rToken)
    else:
        newRToken = RefreshToken(email=user_info['email'], token=hash_password(rToken))
        session.add(newRToken)
        session.commit()
        session.refresh(newRToken)
    response.set_cookie(
        key="access_token",
        value=aToken,
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=15 * 60,
    )
    response.set_cookie(
        key="refresh_token",
        value=rToken,
        httponly=True,
        secure=True,
        path="/refresh",
        samesite="strict",
        max_age=60 * 60 * 24 * 7,
    )
            
    return {
        "message": "Login successful",
        "data": {"name": user_info['name'], "email": user_info['email']},
    }


@router.post("/refresh")
def refresh(
    request: Request, response: Response, session: Session = Depends(getSession)
):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token missing")

    email = verify_token(refresh_token)

    existing_rToken = session.exec(
        select(RefreshToken).where(RefreshToken.email == email)
    ).first()

    if not verify_password(refresh_token, existing_rToken.token):
        raise HTTPException(status_code=401, detail="Unauthorised Refresh token")

    aToken = create_access_token({"sub": email})
    rToken = create_refresh_token({"sub": email})

    existing_rToken.token = hash_password(rToken)
    session.add(existing_rToken)
    session.commit()
    session.refresh(existing_rToken)

    response.set_cookie(
        key="access_token",
        value=aToken,
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=15 * 60,
    )

    response.set_cookie(
        key="refresh_token",
        value=rToken,
        httponly=True,
        secure=True,
        path="/refresh",
        samesite="strict",
        max_age=60 * 60 * 24 * 7,
    )

    return {"message": "Refreshing the token is Success"}


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")

    return {"message": "LogOut Success"}
