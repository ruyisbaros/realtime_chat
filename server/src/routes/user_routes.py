from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from sqlalchemy.orm import Session

from ..utils import models
from ..utils import models
from ..utils.database import get_db
from ..schemas.users_schemas import UserCreate, UserOut, Token, UserLogin
from ..utils.pswds import hash_paswords, verify_password
from ..utils.oauth import create_access_token, get_current_user


router = APIRouter(prefix="/admin", tags=["Search"])  # Tags for Swagger


@router.post('/',  response_model=UserOut)
def get_admin(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("jwt_token")
    print(token)
    print(type(token))
    payload = get_current_user(token)
    current_user = db.query(models.User).filter(
        models.User.email == payload.get("email")).first()
    if not current_user or current_user.is_admin != True:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="You are not an admin")

    return current_user
