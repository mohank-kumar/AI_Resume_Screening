from typing import List
from pydantic import BaseModel


class UploadResponse(BaseModel):
    message: str
    job_id: int
    uploaded: int
    resume_ids: List[int]
