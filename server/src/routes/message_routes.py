from fastapi import APIRouter, Depends, HTTPException, status, Request
from typing import List
from sqlalchemy.orm import Session

from ..utils import models
from ..utils.database import get_db
from ..utils.oauth import verify_access_token
from ..schemas.messages_schema import CreateMessage, MessageOut
from ..schemas.users_schemas import UserOut
from ..utils.cloudinary_set import upload_cloud

router = APIRouter(prefix="/api/v1/messages",
                   tags=["Messages"])  # Tags for Swagger


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=MessageOut)
async def create_message(
        request: Request,
        payload: CreateMessage,
        db: Session = Depends(get_db)):
    """Create a new message"""
    token = request.cookies.get("jwt_token")
    # print(token)
    payload_ = verify_access_token(token)
    current_user = db.query(models.User).filter(
        models.User.email == payload_.get("email")).first()
    if payload.image:
        image_url, image_public_id = await upload_cloud(file=payload.image.file)
        new_message = models.Message({"sender_id": current_user.id, "recipient_id": payload.recipient_id, "body": payload.body,
                                      "image_url": image_url, "image_public_id": image_public_id})
    else:
        new_message = models.Message(
            **payload.model_dump(exclude=payload.image), sender_id=current_user.id)
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    # TODO FOR SOCKET IO
    # return new_message
    return new_message


@router.get("/gel_all", response_model=List[MessageOut])
def get_messages(
        request: Request,
        db: Session = Depends(get_db)):
    """Get all messages"""
    token = request.cookies.get("jwt_token")
    payload_ = verify_access_token(token)
    current_user = db.query(models.User).filter(
        models.User.email == payload_.get("email")).first()
    messages = db.query(models.Message).filter(
        (models.Message.sender_id == current_user.id) |
        (models.Message.recipient_id == current_user.id)).all()
    return messages


@router.get("/dialogues/{recipient_id}", response_model=List[MessageOut])
def get_bilateral_dialogues(
        request: Request,
        recipient_id: int,
        db: Session = Depends(get_db)):
    """Get my bilateral dialogues"""
    token = request.cookies.get("jwt_token")
    payload_ = verify_access_token(token)
    current_user = db.query(models.User).filter(
        models.User.email == payload_.get("email")).first()
    messages = db.query(models.Message).filter(((models.Message.sender_id == current_user.id) & (models.Message.recipient_id == recipient_id)) | (
        (models.Message.sender_id == recipient_id) & (models.Message.recipient_id == current_user.id))).all()
    return messages


@router.get("/{message_id}", response_model=MessageOut)
def get_message(
        message_id: int,
        request: Request,
        db: Session = Depends(get_db)):
    """Get a message by id"""
    token = request.cookies.get("jwt_token")
    payload_ = verify_access_token(token)
    current_user = db.query(models.User).filter(
        models.User.email == payload_.get("email")).first()
    message = db.query(models.Message).filter(
        (models.Message.id == message_id) &
        ((models.Message.sender_id == current_user.id) |
         (models.Message.recipient_id == current_user.id))).first()
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Message not found")
    return message


@router.put("/{message_id}", status_code=status.HTTP_200_OK, response_model=MessageOut)
def update_message(
        message_id: int,
        request: Request,
        db: Session = Depends(get_db)):
    """Update a message by id"""
    token = request.cookies.get("jwt_token")
    payload_ = verify_access_token(token)
    current_user = db.query(models.User).filter(
        models.User.email == payload_.get("email")).first()
    message = db.query(models.Message).filter(
        (models.Message.id == message_id) &
        ((models.Message.sender_id == current_user.id))).first()
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Message not found")
    updated_message = models.Message(**request.data, id=message_id)
    db.merge(updated_message)
    db.commit()
    return updated_message


@router.delete("/delete/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_message(
        message_id: int,
        request: Request,
        db: Session = Depends(get_db)):
    """Delete a message by id"""
    token = request.cookies.get("jwt_token")
    payload_ = verify_access_token(token)
    current_user = db.query(models.User).filter(
        models.User.email == payload_.get("email")).first()
    message = db.query(models.Message).filter(
        (models.Message.id == message_id) &
        ((models.Message.sender_id == current_user.id))).first()
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Message not found")
    db.delete(message)
    db.commit()
    return {"detail": "Message deleted"}


@router.get("/{message_id}/likes", response_model=List[UserOut])
def get_message_likes(
        message_id: int,
        db: Session = Depends(get_db)):
    """Get all users who liked a message"""
    message = db.query(models.Message).filter(
        models.Message.id == message_id).first()
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Message not found")
    likes = db.query(models.User).filter(
        models.User.id.in_(message.likers)).all()
    return likes


@router.post("/{message_id}/likes", status_code=status.HTTP_201_CREATED)
def like_message(
        message_id: int,
        request: Request,
        db: Session = Depends(get_db)):
    """Like a message"""
    token = request.cookies.get("jwt_token")
    payload_ = verify_access_token(token)
    current_user = db.query(models.User).filter(
        models.User.email == payload_.get("email")).first()
    message = db.query(models.Message).filter(
        models.Message.id == message_id).first()
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Message not found")
    if current_user.id in message.likers:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="User already liked the message")
    message.likers.append(current_user.id)
    db.commit()
    return {"detail": "Message liked"}
