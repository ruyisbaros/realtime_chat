from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ImageBase(BaseModel):
    image_url: str
    image_public_id: str


class ImageCreate(ImageBase):
    pass


class ImageOut(ImageBase):
    id: int
    image_url: str
    created_at: datetime
