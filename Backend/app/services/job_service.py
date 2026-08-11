from sqlalchemy.orm import Session
from app.models.job_description import JobDescription
from app.schemas.job_description import JobCreate, JobUpdate


def create_job(job: JobCreate, user_id: int, db: Session):

    new_job = JobDescription(
        title=job.title,
        description=job.description,
        location=job.location,
        created_by=user_id
    )

    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    return new_job


def get_all_jobs(db: Session, user_id: int = None):
    query = db.query(JobDescription)
    if user_id is not None:
        query = query.filter(JobDescription.created_by == user_id)
    return query.order_by(JobDescription.created_at.desc()).all()


def get_job(job_id: int, db: Session, user_id: int = None):
    query = db.query(JobDescription).filter(JobDescription.id == job_id)
    if user_id is not None:
        query = query.filter(JobDescription.created_by == user_id)
    return query.first()


def update_job(job_id: int, job: JobUpdate, db: Session, user_id: int = None):

    db_job = get_job(job_id, db, user_id=user_id)

    if not db_job:
        return None

    db_job.title = job.title
    db_job.description = job.description
    db_job.location = job.location

    db.commit()
    db.refresh(db_job)

    return db_job


def delete_job(job_id: int, db: Session, user_id: int = None):

    db_job = get_job(job_id, db, user_id=user_id)

    if not db_job:
        return False

    db.delete(db_job)
    db.commit()

    return True