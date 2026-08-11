from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.deps import get_current_user_id

from app.services.dashboard_service import (
    get_recent_jobs, get_screening_status, get_top_candidates, get_average_score
)

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/recent-jobs")
def recent_jobs(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):

    return get_recent_jobs(db, user_id=user_id)

@router.get("/screening-status")
def screening_status(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):

    return get_screening_status(db, user_id=user_id)

@router.get("/top-candidates")
def top_candidates(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):

    return get_top_candidates(db, user_id=user_id)


@router.get("/average-score")
def average_score(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):

    return get_average_score(db, user_id=user_id)