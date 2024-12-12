from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from sqlalchemy.orm import Session

from ..utils import models
from ..utils import models
from ..utils.database import get_db
from ..schemas.users_schemas import UserCreate, UserOut, Token, UserLogin
from ..utils.pswds import hash_paswords, verify_password
from ..utils.oauth import create_access_token, get_current_user


router = APIRouter(prefix="/users", tags=["Users"])  # Tags for Swagger


# response_model=UserOut
@router.get('/get', status_code=status.HTTP_200_OK, response_model=UserOut)
def current_user(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("jwt_token")
    print(token)
    payload = get_current_user(token)
    current_user = db.query(models.User).filter(
        models.User.email == payload.get("email")).first()
    return current_user
