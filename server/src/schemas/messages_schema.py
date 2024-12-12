from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional


class Message(BaseModel):
    sender_id: int
    recipient_id: int
    subject: str
    body: str
