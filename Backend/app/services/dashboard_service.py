from typing import Any
from sqlalchemy.orm import Session
from app.models.job_description import JobDescription
from app.models.resume import Resume
from sqlalchemy import func
from app.models.screening_result import ScreeningResult


def get_recent_jobs(db: Session, user_id: Any = None):

    query = db.query(JobDescription)
    if user_id is not None:
        try:
            uid = int(user_id)
            query = query.filter(JobDescription.created_by == uid)
        except (ValueError, TypeError):
            pass

    jobs = (
        query.order_by(JobDescription.created_at.desc())
        .limit(5)
        .all()
    )

    result = []

    for job in jobs:

        resume_count = (
            db.query(Resume)
            .filter(
                Resume.job_description_id == job.id,
                Resume.status == "Completed"
            )
            .count()
        )

        result.append({

            "id": job.id,

            "title": job.title,

            "resume_count": resume_count

        })

    return result



def get_screening_status(db: Session, user_id: Any = None):

    completed_q = db.query(Resume).filter(Resume.status == "Completed")
    screening_q = db.query(Resume).filter(Resume.status == "Screening")

    if user_id is not None:
        try:
            uid = int(user_id)
            completed_q = completed_q.join(JobDescription, Resume.job_description_id == JobDescription.id).filter(JobDescription.created_by == uid)
            screening_q = screening_q.join(JobDescription, Resume.job_description_id == JobDescription.id).filter(JobDescription.created_by == uid)
        except (ValueError, TypeError):
            pass

    completed = completed_q.count()
    screening = screening_q.count()

    return {
        "completed": completed,
        "screening": screening
    }




def get_top_candidates(db: Session, user_id: Any = None):

    query = (
        db.query(Resume)
        .filter(Resume.status != "Failed")
        .join(ScreeningResult, Resume.id == ScreeningResult.resume_id)
        .join(JobDescription, Resume.job_description_id == JobDescription.id)
    )

    if user_id is not None:
        try:
            uid = int(user_id)
            query = query.filter(JobDescription.created_by == uid)
        except (ValueError, TypeError):
            pass

    candidates = (
        query.order_by(ScreeningResult.overall_score.desc())
        .limit(5)
        .all()
    )

    result = []

    rank = 1

    for resume in candidates:

        result.append({

            "rank": rank,

            "resume_id": resume.id,

            "candidate_name": resume.candidate_name or resume.filename,

            "job_title": resume.job_description.title if resume.job_description else "N/A",

            "filename": resume.filename,

            "score": resume.screening_result.overall_score,

            "recommendation": resume.screening_result.recommendation

        })

        rank += 1

    return result


def get_average_score(db: Session, user_id: Any = None):

    query = (
        db.query(func.avg(ScreeningResult.overall_score))
        .join(Resume, ScreeningResult.resume_id == Resume.id)
        .join(JobDescription, Resume.job_description_id == JobDescription.id)
    )

    if user_id is not None:
        try:
            uid = int(user_id)
            query = query.filter(JobDescription.created_by == uid)
        except (ValueError, TypeError):
            pass

    average = query.scalar()

    return {
        "average_score": round(average, 2) if average else 0
    }