from typing import TypedDict, Optional
from typing import Optional

class ResumeScreeningState(TypedDict):
    job_description: str
    resume: str
    extracted_jd: Optional[str]
    parsed_resume: Optional[dict]
    match_evaluation: Optional[str]
    review: str
    final_score: Optional[str]
