from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional

from ..schemas.users_schemas import MessageUserOut, Base64Image


class MessageBase(BaseModel):
    recipient_id: int
    body: str
    image: Optional[Base64Image] = None


class CreateMessage(MessageBase):
    pass


class MessageOut(BaseModel):
    id: int
    sender: Optional[MessageUserOut]
    receiver: Optional[MessageUserOut]
    body: str
    image_url: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
