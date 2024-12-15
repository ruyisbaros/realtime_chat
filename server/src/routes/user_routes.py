from fastapi import APIRouter, Depends, HTTPException, status, Request, UploadFile
from sqlalchemy.orm import Session
from typing import Any
import base64
from io import BytesIO

from ..utils import models
from ..utils.database import get_db
from ..schemas.users_schemas import UserOut, Base64Image
from ..utils.oauth import verify_access_token
from ..utils.cloudinary_set import upload_cloud


router = APIRouter(prefix="/api/v1/users", tags=["Users"])  # Tags for Swagger


# response_model=UserOut
@router.get('/get_CU', status_code=status.HTTP_200_OK, response_model=UserOut)
async def current_user(request: Request, db: Session = Depends(get_db)):
    """Get current user"""
    # print(f"Headers: {request.headers}")
    try:
        token = request.cookies.get("jwt_token")
        if not token:
            print("No token available")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Token not found")
        # print(token)
        payload = verify_access_token(token)
        current_user = db.query(models.User).filter(
            models.User.email == payload.get("email")).first()
        if current_user:
            user_dict = dict(current_user.__dict__)  # Convert to dictionary
            # Remove any SQLAlchemy-specific attributes (e.g., '_sa_instance_state')
            user_dict.pop('_sa_instance_state', None)
            # print(user_dict)  # Now you have a dictionary you can send
            return user_dict
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/update", status_code=status.HTTP_200_OK, response_model=UserOut)
async def update_user(
    request: Request,
    file: Base64Image,
    db: Session = Depends(get_db),
):
    """Update user"""
    # print(file)
    try:
        image_data = base64.b64decode(file.image_data)
        file_io = BytesIO(image_data)
        token = request.cookies.get("jwt_token")
        if not token:
            print("No token available")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Token not found")
        # print(token)
        payload = verify_access_token(token)
        current_user = db.query(models.User).filter(
            models.User.email == payload.get("email")).first()
        if current_user:
            image_url, image_public_id = await upload_cloud(file=file_io, resource_type="image", format=file.image_mime_type.replace("image/", ""))
            current_user.prof_img_url = image_url
            current_user.prof_img_id = image_public_id
            db.add(current_user)
            db.commit()
            db.refresh(current_user)
            user_dict = dict(current_user.__dict__)  # Convert to dictionary
            # Remove any SQLAlchemy-specific attributes (e.g., '_sa_instance_state')
            user_dict.pop('_sa_instance_state', None)
            return user_dict
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
