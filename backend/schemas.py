from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ProjectBase(BaseModel):
    name: str
    amenity_type: str
    latitude: float
    longitude: float
    budget: float
    deadline: datetime
    monitoring_frequency: int = 7

class ProjectCreate(ProjectBase):
    pass

class DailyProgressBase(BaseModel):
    date: datetime
    image_path: str
    progress_percentage: float
    notes: Optional[str] = None

class DailyProgress(DailyProgressBase):
    id: int
    project_id: int

    class Config:
        from_attributes = True

class AlertBase(BaseModel):
    date: datetime
    message: str
    severity: str

class Alert(AlertBase):
    id: int
    project_id: int

    class Config:
        from_attributes = True

class Project(ProjectBase):
    id: int
    status: str
    progress: List[DailyProgress] = []
    alerts: List[Alert] = []

    class Config:
        from_attributes = True
