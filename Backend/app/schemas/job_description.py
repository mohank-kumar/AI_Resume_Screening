from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class JobCreate(BaseModel):
    title: str
    description: str
    location: Optional[str] = None


class JobUpdate(BaseModel):
    title: str
    description: str
    location: Optional[str] = None


class JobResponse(BaseModel):
    id: int
    title: str
    description: str
    location: Optional[str]
    resume_count: int
    created_at: datetime

    class Config:
        from_attributes = True