from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.deps import get_current_user_id
from app.schemas.screening_result import (
    ScreeningResultResponse,
    RankingResponse,
    AnalyticsResponse
)

from app.services.screening_service import (
    get_screening_result,
    get_job_ranking,
    get_job_analytics,get_all_candidates
)

router = APIRouter(
    prefix="/screening",
    tags=["Screening"]
)


# ---------- Ranking ----------
@router.get(
    "/jobs/{job_id}/ranking",
    response_model=list[RankingResponse]
)
def ranking(
    job_id: int,
    db: Session = Depends(get_db)
):
    return get_job_ranking(job_id, db)



# ---------- All Candidates ----------
@router.get(
    "/candidates"
)
def all_candidates(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    return get_all_candidates(db, user_id=user_id)


# ---------- Candidate Details ----------
@router.get(
    "/{resume_id}",
    response_model=ScreeningResultResponse
)
def get_screening(
    resume_id: int,
    db: Session = Depends(get_db)
):

    result = get_screening_result(
        resume_id,
        db
    )

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Result not found"
        )

    return result