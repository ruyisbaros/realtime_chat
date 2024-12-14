from pydantic import BaseModel, EmailStr, FilePath
from datetime import datetime
from typing import Optional
from fastapi import UploadFile, File


class UserBase(BaseModel):
    full_name: str
    email: EmailStr
    prof_img: Optional[UploadFile] = None
    password: str
    role: Optional[str] = "USER"


class UserCreate(UserBase):
    pass


class UserOut(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    prof_img_url: Optional[str] = ""
    created_at: datetime

    class Config:
        from_attributes = True


class MessageUserOut(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    prof_img_url: Optional[str] = ""

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str
