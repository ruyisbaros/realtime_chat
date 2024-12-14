from .database import Base, engine
from sqlalchemy import Column, Integer, String, ForeignKey, ARRAY, Float, Boolean, DateTime, Enum
from sqlalchemy.sql.sqltypes import TIMESTAMP, DATETIME
from sqlalchemy.sql.expression import text
from sqlalchemy.orm import relationship
import enum


class UserRole(enum.Enum):
    ADMIN = "ADMIN"
    USER = "USER"
    MODERATOR = "MODERATOR"
    GUEST = "GUEST"


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    prof_img_url = Column(String, nullable=True)
    prof_img_id = Column(String, nullable=True)
    email = Column(String, unique=True, index=True, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.USER)
    password = Column(String, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True),
                        nullable=False, server_default=text("now()"))


class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True, index=True, nullable=False)
    sender_id = Column(Integer, ForeignKey(
        "users.id", ondelete="CASCADE"), nullable=False)
    recipient_id = Column(Integer, ForeignKey(
        "users.id", ondelete="CASCADE"), nullable=False)
    body = Column(String, nullable=False)
    image_url = Column(String, nullable=True)
    image_public_id = Column(String, nullable=True)
    created_at = Column(TIMESTAMP(timezone=True),
                        nullable=False, server_default=text("now()"))
    sender = relationship("User", foreign_keys=[sender_id])
    receiver = relationship("User", foreign_keys=[recipient_id])
