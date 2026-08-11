from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.user import (
    UserRegister,
    UserLogin,
    UserResponse
)

from app.services.auth_service import (
    register_user,
    login_user
)   

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register", response_model=UserResponse)
def register(
    user: UserRegister,
    db: Session = Depends(get_db)
):

    new_user = register_user(user, db)

    if not new_user:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    return new_user


@router.post("/login", response_model=UserResponse)
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    db_user = login_user(user, db)

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    return db_user