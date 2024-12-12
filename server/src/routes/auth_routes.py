from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from sqlalchemy.orm import Session

from ..utils import models
from ..utils.database import get_db
from ..schemas.users_schemas import UserCreate, UserOut, Token, UserLogin
from ..utils.pswds import hash_paswords, verify_password
from ..utils.oauth import create_access_token, get_current_user


router = APIRouter(prefix="/users/auth", tags=["Auth"])  # Tags for swagger


@ router.post("/register", status_code=status.HTTP_201_CREATED, response_model=UserOut)
def register_user(
        response: Response,
        payload: UserCreate,
        db: Session = Depends(get_db)):
    """Create a new user."""
    # print(payload.email)
    try:
        is_email_exist = db.query(models.User).filter(
            models.User.email == payload.email).first()
        if is_email_exist:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Email already exists")
        # hash the password
        payload.password = hash_paswords(payload.password)
        new_user = models.User(**payload.model_dump())
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        token = create_access_token({"email": new_user.email})
        response.set_cookie(key="jwt_token", value=token, httponly=True)
        return new_user
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@ router.post("/login", response_model=Token)
def login_user(response: Response, payload: UserLogin, db: Session = Depends(get_db)):
    """Authenticate a user and return an access token."""
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
    response.set_cookie(key="jwt_token", value=token, httponly=True)
    return {"access_token": token, "token_type": "bearer"}
