from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.database import Base


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)

    filename = Column(String(255), nullable=False)

    file_path = Column(String(500), nullable=False)

    resume_text = Column(Text, nullable=True)

    candidate_name = Column(String(255), nullable=True)

    email = Column(String(255), nullable=True)

    phone = Column(String(30), nullable=True)

    status = Column(String(30), default="Uploaded")

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    job_description_id = Column(
        Integer,
        ForeignKey(
            "job_descriptions.id",
            ondelete="CASCADE"
        ),
        nullable=False
    )

    job_description = relationship(
        "JobDescription",
        back_populates="resumes"
    )

    screening_result = relationship(
        "ScreeningResult",
        back_populates="resume",
        uselist=False,
        cascade="all, delete"
    )