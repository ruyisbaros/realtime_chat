from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional


class UserBase(BaseModel):
    full_name: str
    email: EmailStr
    prof_img: Optional[str] = ""
    password: str
    role: Optional[str] = "USER"


class UserCreate(UserBase):
    pass


class UserOut(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    prof_img: str
    created_at: datetime

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    user_id: str
    email: str
