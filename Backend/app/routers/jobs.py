from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.deps import get_current_user_id

from app.schemas.job_description import (
    JobCreate,
    JobUpdate,
    JobResponse
)

from app.services.job_service import *

router = APIRouter(
    prefix="/jobs",
    tags=["Job Descriptions"]
)


@router.post("", response_model=JobResponse)
def create_job_api(
    job: JobCreate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    if user_id is None:
        raise HTTPException(
            status_code=401,
            detail="Authentication required. Please log in."
        )
    return create_job(job, user_id, db)


@router.get("", response_model=list[JobResponse])
def get_jobs(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    return get_all_jobs(db, user_id=user_id)


@router.get("/{job_id}", response_model=JobResponse)
def get_job_api(
    job_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):

    job = get_job(job_id, db, user_id=user_id)

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    return job


@router.put("/{job_id}", response_model=JobResponse)
def update_job_api(
    job_id: int,
    updated_job: JobUpdate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):

    job = update_job(job_id, updated_job, db, user_id=user_id)

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    return job


@router.delete("/{job_id}")
def delete_job_api(
    job_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):

    success = delete_job(job_id, db, user_id=user_id)

    if not success:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    return {
        "message": "Job deleted successfully"
    }