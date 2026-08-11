from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.database import Base


class ScreeningResult(Base):
    __tablename__ = "screening_results"

    id = Column(Integer, primary_key=True, index=True)

    overall_score = Column(Float, nullable=True)
    technical_score = Column(Float, nullable=True)
    experience_score = Column(Float, nullable=True)
    education_score = Column(Float, nullable=True)
    domain_score = Column(Float, nullable=True)
    category_analysis = Column(JSON, nullable=True) 
    recommendation = Column(String(100), nullable=True)
    executive_summary = Column(Text, nullable=True)
    strengths = Column(JSON, nullable=True)
    weaknesses = Column(JSON, nullable=True)
    interview_questions = Column(JSON, nullable=True)

    status = Column(String(50), default="Completed")

    resume_id = Column(
        Integer,
        ForeignKey("resumes.id", ondelete="CASCADE"),
        nullable=False,
        unique=True
    )
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    resume = relationship("Resume", back_populates="screening_result")
