from typing import List, Optional
from pydantic import BaseModel


class InterviewQuestion(BaseModel):
    focus_area: Optional[str] = None
    question: Optional[str] = None
    what_to_look_for: Optional[str] = None


class ScreeningResultResponse(BaseModel):
    overall_score: float
    technical_score: float
    experience_score: float
    education_score: float
    domain_score: float
    recommendation: str
    executive_summary: str
    strengths: List[str]
    weaknesses: List[str]
    interview_questions: List[InterviewQuestion]
    category_analysis: Optional[dict] = None
    candidate_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    filename: Optional[str] = None

    class Config:
        from_attributes = True


class RankingResponse(BaseModel):
    resume_id: int
    candidate_name: Optional[str] = None
    job_title: Optional[str] = None
    filename: Optional[str] = None
    overall_score: float
    recommendation: str

    class Config:
        from_attributes = True


class AnalyticsResponse(BaseModel):
    total_candidates: int
    average_score: Optional[float] = None
    highest_score: Optional[float] = None
    lowest_score: Optional[float] = None

    class Config:
        from_attributes = True