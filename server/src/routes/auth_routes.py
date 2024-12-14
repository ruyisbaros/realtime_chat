from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from typing import Dict, Any

from ..utils import models
from ..utils.database import get_db
from ..schemas.users_schemas import UserCreate, UserOut, UserLogin
from ..utils.pswds import hash_paswords, verify_password
from ..utils.oauth import create_access_token
from ..utils.cloudinary_set import upload_cloud
import json

router = APIRouter(prefix="/api/v1/users/auth",
                   tags=["Auth"])  # Tags for swagger


@ router.post("/register", status_code=status.HTTP_201_CREATED, response_model=UserOut)
async def register_user(
        response: Response,
        payload: UserCreate,
        db: Session = Depends(get_db)):
    """Create a new user."""
    print(payload)
    try:
        is_email_exist = db.query(models.User).filter(
            models.User.email == payload.email).first()
        if is_email_exist:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Email already exists")
        # hash the password
        hashed_password = hash_paswords(payload.password)
        # upload profile image to cloud storage
        if payload.prof_img:
            image_url, image_public_id = await upload_cloud(file=payload.prof_img)

            new_user = models.User({"full_name": payload.full_name, "email": payload.email, "password": hashed_password,
                                    "role": payload.role, "prof_img_url": image_url, "prof_img_id": image_public_id})
        else:
            payload.password = hashed_password
            new_user = models.User(
                **payload.model_dump(exclude_none=True))
        print(new_user)
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        token = create_access_token({"email": new_user.email})
        response.set_cookie(key="jwt_token", value=token,
                            httponly=True, samesite='lax', secure=False)
        if new_user:
            user_dict = dict(new_user.__dict__)  # Convert to dictionary
            # Remove any SQLAlchemy-specific attributes (e.g., '_sa_instance_state')
            user_dict.pop('_sa_instance_state', None)
            # print(user_dict)  # Now you have a dictionary you can send
            return user_dict

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@ router.post("/login", response_model=UserOut)
def login_user(response: Response, payload: UserLogin, db: Session = Depends(get_db)):
    """Authenticate a user and return an access token."""
    try:
        user = db.query(models.User).filter(
            models.User.email == payload.email).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Wrong credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        # Check if password is correct
        if not verify_password(payload.password, user.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Wrong credentials",)
        token = create_access_token({"email": user.email})
        response.set_cookie(key="jwt_token", value=token,
                            httponly=True, samesite='lax', secure=False)
        if user:
            user_dict = dict(user.__dict__)  # Convert to dictionary
            # Remove any SQLAlchemy-specific attributes (e.g., '_sa_instance_state')
            user_dict.pop('_sa_instance_state', None)
            return user_dict

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@ router.get("/logout", response_model=str)
def logout_user(response: Response):
    """Logout a user and delete the access token."""
    response.delete_cookie(key="jwt_token")
    return "Logged out successfully"
