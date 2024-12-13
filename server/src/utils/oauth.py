import os
from datetime import datetime, timedelta
from .models import User
from .database import get_db
from dotenv import load_dotenv
from fastapi import HTTPException, status, Request, Depends
from sqlalchemy.orm import Session
import jwt

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

SECRET_KEY = os.getenv("SECRET_KEY")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM")


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now() + timedelta(minutes=300)
    to_encode.update({"expire": expire.strftime("%Y-%m-%d %H:%M:%S")})

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, JWT_ALGORITHM)

    return encoded_jwt


def verify_access_token(token: str):
    # print("token in function", token)
    # print(JWT_ALGORITHM, SECRET_KEY)
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=JWT_ALGORITHM)

        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


def get_current_user(request: Request, db: Session = Depends(get_db)):
    """Get current user"""
    try:
        token = request.cookies.get("jwt_token")
        # print(token)
        payload = verify_access_token(token)
        current_user = db.query(User).filter(
            User.email == payload.get("email")).first()
        return current_user
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
