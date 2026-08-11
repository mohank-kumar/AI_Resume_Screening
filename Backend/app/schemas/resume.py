from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class ResumeResponse(BaseModel):
    id: int
    candidate_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    filename: str
    status: Optional[str] = "Uploaded"
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True