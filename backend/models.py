from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime
from sqlalchemy.orm import relationship
import datetime
from .database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    amenity_type = Column(String) # e.g., Road, Park, Hospital
    latitude = Column(Float)
    longitude = Column(Float)
    budget = Column(Float)
    deadline = Column(DateTime)
    monitoring_frequency = Column(Integer, default=7) # Days
    status = Column(String, default="Active") # Active, Flagged, Completed
    
    progress = relationship("DailyProgress", back_populates="project")
    alerts = relationship("Alert", back_populates="project")

class DailyProgress(Base):
    __tablename__ = "daily_progress"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    date = Column(DateTime, default=datetime.datetime.utcnow)
    image_path = Column(String) # Path to satellite image for that day
    progress_percentage = Column(Float) # AI calculated percentage
    notes = Column(String, nullable=True)

    project = relationship("Project", back_populates="progress")

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    date = Column(DateTime, default=datetime.datetime.utcnow)
    message = Column(String)
    severity = Column(String) # Low, Medium, High

    project = relationship("Project", back_populates="alerts")
