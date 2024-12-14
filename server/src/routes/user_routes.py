from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session

from ..utils import models
from ..utils.database import get_db
from ..schemas.users_schemas import UserOut
from ..utils.oauth import verify_access_token


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


@router.get('/')
def hello_world():
    return {"message": "Hello World"}
