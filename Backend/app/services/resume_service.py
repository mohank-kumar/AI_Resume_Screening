import os
import shutil

from typing import List

from fastapi import UploadFile, HTTPException
from sqlalchemy.orm import Session

from app.models.resume import Resume
from app.models.job_description import JobDescription


UPLOAD_DIR = "uploads/jobs"


# ----------------------------
# Save Single Resume
# ----------------------------
def save_resume(
    job_id: int,
    file: UploadFile,
    db: Session
):

    job = (
        db.query(JobDescription)
        .filter(JobDescription.id == job_id)
        .first()
    )

    if not job:
        return None

    # ----------------------------
    # Validate File Type
    # ----------------------------
    allowed_extensions = [".pdf", ".docx", ".doc"]

    extension = os.path.splitext(file.filename)[1].lower()

    if extension not in allowed_extensions:

        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '{extension}'. Only PDF, DOCX, and DOC files are allowed."
        )

    # ----------------------------
    # Create Job Folder
    # ----------------------------
    job_folder = os.path.join(
        UPLOAD_DIR,
        str(job_id)
    )

    os.makedirs(job_folder, exist_ok=True)

    file_path = os.path.join(
        job_folder,
        file.filename
    )

    # ----------------------------
    # Save Resume File
    # ----------------------------
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # ----------------------------
    # Save Database Record
    # ----------------------------
    resume = Resume(
        filename=file.filename,
        file_path=file_path,
        job_description_id=job_id,
        status="Uploaded"
    )

    db.add(resume)

    return resume


# ----------------------------
# Save Multiple Resumes
# ----------------------------
def save_multiple_resumes(
    job_id: int,
    files: List[UploadFile],
    db: Session
):

    uploaded_resumes = []

    for file in files:

        resume = save_resume(
            job_id,
            file,
            db
        )

        if resume:
            uploaded_resumes.append(resume)

    # Only ONE commit
    db.commit()

    for resume in uploaded_resumes:
        db.refresh(resume)

    return uploaded_resumes


# ----------------------------
# Get All Resumes
# ----------------------------
def get_job_resumes(
    job_id: int,
    db: Session
):

    return (
        db.query(Resume)
        .filter(
            Resume.job_description_id == job_id
        )
        .all()
    )


# ----------------------------
# Get Single Resume
# ----------------------------
def get_resume(
    resume_id: int,
    db: Session
):

    return (
        db.query(Resume)
        .filter(
            Resume.id == resume_id
        )
        .first()
    )


# ----------------------------
# Delete Resume
# ----------------------------
def delete_resume(
    resume_id: int,
    db: Session
):

    resume = get_resume(
        resume_id,
        db
    )

    if not resume:
        return False

    if os.path.exists(resume.file_path):
        os.remove(resume.file_path)

    db.delete(resume)

    db.commit()

    return True


# ----------------------------
# Resume Status
# ----------------------------
def get_resume_status(
    job_id: int,
    db: Session
):

    return (
        db.query(Resume)
        .filter(
            Resume.job_description_id == job_id
        )
        .all()
    )