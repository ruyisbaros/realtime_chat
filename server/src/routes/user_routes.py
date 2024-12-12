from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session

from ..utils import models
from ..utils import models
from ..utils.database import get_db
from ..schemas.users_schemas import UserOut
from ..utils.oauth import verify_access_token


router = APIRouter(prefix="/users", tags=["Users"])  # Tags for Swagger


# response_model=UserOut
@router.get('/get', status_code=status.HTTP_200_OK, response_model=UserOut)
def current_user(request: Request, db: Session = Depends(get_db)):
    """Get current user"""
    try:
        token = request.cookies.get("jwt_token")
        # print(token)
        payload = verify_access_token(token)
        current_user = db.query(models.User).filter(
            models.User.email == payload.get("email")).first()
        return current_user
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
