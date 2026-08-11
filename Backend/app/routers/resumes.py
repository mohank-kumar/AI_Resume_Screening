import os
from typing import List
from fastapi.responses import FileResponse

from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File,
    HTTPException,
    BackgroundTasks
)

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.schemas.resume import ResumeResponse
from app.schemas.upload_response import UploadResponse

from app.services.resume_service import (
    save_multiple_resumes,
    get_job_resumes,
    get_resume,
    delete_resume,
    get_resume_status
)

from app.services.screening_service import screen_uploaded_resume

router = APIRouter(
    prefix="/resumes",
    tags=["Resumes"]
)


@router.post(
    "/jobs/{job_id}/upload",
    response_model=UploadResponse
)
def upload_resumes(
    job_id: int,
    background_tasks: BackgroundTasks,
    files: list[UploadFile] = File(...),
    db: Session = Depends(get_db)
):

    resumes = save_multiple_resumes(
        job_id,
        files,
        db
    )

    if resumes is None:
        raise HTTPException(
            status_code=404,
            detail="Job Description not found"
        )

    # Start AI screening in background
    for resume in resumes:
        background_tasks.add_task(
            screen_uploaded_resume,
            resume.id
        )

    return {
        "message": "Upload Successful",
        "job_id": job_id,
        "uploaded": len(resumes),
        "resume_ids": [resume.id for resume in resumes]
    }


# -----------------------------
# Get all resumes for a Job
# -----------------------------
@router.get(
    "/jobs/{job_id}",
    response_model=List[ResumeResponse]
)
def get_resumes(
    job_id: int,
    db: Session = Depends(get_db)
):

    return get_job_resumes(
        job_id,
        db
    )


# -----------------------------
# Get one Resume
# -----------------------------
@router.get(
    "/{resume_id}",
    response_model=ResumeResponse
)
def get_resume_api(
    resume_id: int,
    db: Session = Depends(get_db)
):

    resume = get_resume(
        resume_id,
        db
    )

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    return resume


# -----------------------------
# View Resume File (Inline)
# -----------------------------
@router.get("/{resume_id}/view")
def view_resume_api(
    resume_id: int,
    db: Session = Depends(get_db)
):

    resume = get_resume(
        resume_id,
        db
    )

    if not resume or not resume.file_path or not os.path.exists(resume.file_path):
        raise HTTPException(
            status_code=404,
            detail="Resume file not found"
        )

    ext = os.path.splitext(resume.filename)[1].lower()
    media_type = "application/pdf"
    if ext == ".docx":
        media_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    elif ext == ".doc":
        media_type = "application/msword"

    return FileResponse(
        path=resume.file_path,
        filename=resume.filename,
        media_type=media_type,
        headers={"Content-Disposition": f'inline; filename="{resume.filename}"'}
    )


# -----------------------------
# Download Resume File
# -----------------------------
@router.get("/{resume_id}/download")
def download_resume_api(
    resume_id: int,
    db: Session = Depends(get_db)
):

    resume = get_resume(
        resume_id,
        db
    )

    if not resume or not resume.file_path or not os.path.exists(resume.file_path):
        raise HTTPException(
            status_code=404,
            detail="Resume file not found"
        )

    return FileResponse(
        path=resume.file_path,
        filename=resume.filename,
        media_type="application/octet-stream"
    )


# -----------------------------
# Delete Resume
# -----------------------------
@router.delete("/{resume_id}")
def delete_resume_api(
    resume_id: int,
    db: Session = Depends(get_db)
):

    success = delete_resume(
        resume_id,
        db
    )

    if not success:
        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    return {
        "message": "Resume deleted successfully"
    }


# -----------------------------
# Resume Status for a Job
# -----------------------------
@router.get(
    "/jobs/{job_id}/status",
    response_model=List[ResumeResponse]
)
def get_resume_status_api(
    job_id: int,
    db: Session = Depends(get_db)
):

    return get_resume_status(
        job_id,
        db
    )