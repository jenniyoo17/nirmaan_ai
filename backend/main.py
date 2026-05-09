from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
import os
import datetime
import shutil
import uuid

from . import models, schemas, database, ai_engine

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Nirmaan AI API")

# Allow CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("backend/static/images", exist_ok=True)
app.mount("/static", StaticFiles(directory="backend/static"), name="static")

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/projects", response_model=list[schemas.Project])
def read_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    projects = db.query(models.Project).offset(skip).limit(limit).all()
    return projects

@app.post("/projects", response_model=schemas.Project)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_db)):
    db_project = models.Project(**project.model_dump())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@app.get("/projects/{project_id}", response_model=schemas.Project)
def read_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@app.get("/alerts", response_model=list[schemas.Alert])
def read_alerts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    alerts = db.query(models.Alert).order_by(models.Alert.date.desc()).offset(skip).limit(limit).all()
    return alerts

@app.post("/analyze-custom")
async def analyze_custom(file1: UploadFile = File(...), file2: UploadFile = File(...)):
    """Live Model Testing endpoint"""
    f1_path = f"backend/static/images/tmp_{uuid.uuid4()}.png"
    f2_path = f"backend/static/images/tmp_{uuid.uuid4()}.png"
    
    with open(f1_path, "wb") as buffer:
        shutil.copyfileobj(file1.file, buffer)
    with open(f2_path, "wb") as buffer:
        shutil.copyfileobj(file2.file, buffer)
        
    result = ai_engine.calculate_progress(f1_path, f2_path)
    return result

@app.post("/seed")
def seed_database(db: Session = Depends(get_db)):
    """Seed the database with 5 sample projects"""
    if db.query(models.Project).count() > 0:
        # Clear existing data for fresh seed
        db.query(models.Alert).delete()
        db.query(models.DailyProgress).delete()
        db.query(models.Project).delete()
        db.commit()

    import glob
    day_1_img = glob.glob("backend/static/images/day_1_satellite_*.png")
    day_2_img = glob.glob("backend/static/images/day_2_satellite_*.png")
    day_3_img = glob.glob("backend/static/images/day_3_satellite_*.png")
    
    d1_path = os.path.basename(day_1_img[0]) if day_1_img else "dummy.png"
    d2_path = os.path.basename(day_2_img[0]) if day_2_img else "dummy.png"
    d3_path = os.path.basename(day_3_img[0]) if day_3_img else "dummy.png"

    # Project 1: Normal Road
    p1 = models.Project(name="ORR Bellandur Road Repair", amenity_type="Road", latitude=12.9279, longitude=77.6271, budget=5000000.0, deadline=datetime.datetime.utcnow() + datetime.timedelta(days=30), monitoring_frequency=7, status="Active")
    
    # Project 2: Cubbon Park (No progress flag)
    p2 = models.Project(name="Cubbon Park Pathway", amenity_type="Park", latitude=12.9766, longitude=77.5993, budget=1200000.0, deadline=datetime.datetime.utcnow() + datetime.timedelta(days=15), monitoring_frequency=3, status="Flagged")
    
    # Project 3: Building Demolition Anomaly
    p3 = models.Project(name="Community Hall Construction", amenity_type="Building", latitude=12.9345, longitude=77.6123, budget=8000000.0, deadline=datetime.datetime.utcnow() + datetime.timedelta(days=60), monitoring_frequency=14, status="Flagged")
    
    # Project 4: Hospital Foundation
    p4 = models.Project(name="Govt Hospital New Wing", amenity_type="Hospital", latitude=12.9456, longitude=77.5899, budget=25000000.0, deadline=datetime.datetime.utcnow() + datetime.timedelta(days=180), monitoring_frequency=30, status="Active")

    # Project 5: Water Tank Setup
    p5 = models.Project(name="HSR Layout Water Reservoir", amenity_type="Water Tank", latitude=12.9121, longitude=77.6446, budget=3000000.0, deadline=datetime.datetime.utcnow() + datetime.timedelta(days=45), monitoring_frequency=7, status="Active")
    
    db.add_all([p1, p2, p3, p4, p5])
    db.commit()

    # Progress P1 (Normal)
    images_p1 = [f"backend/static/images/{d1_path}", f"backend/static/images/{d2_path}", f"backend/static/images/{d3_path}"]
    prog_p1 = ai_engine.analyze_timeline(images_p1)
    db.add(models.DailyProgress(project_id=p1.id, date=datetime.datetime.utcnow() - datetime.timedelta(days=14), image_path=f"/static/images/{d1_path}", progress_percentage=0.0, notes="Survey Complete"))
    db.add(models.DailyProgress(project_id=p1.id, date=datetime.datetime.utcnow() - datetime.timedelta(days=7), image_path=f"/static/images/{d2_path}", progress_percentage=prog_p1[0]["progress_percentage"], notes=prog_p1[0]["notes"]))
    db.add(models.DailyProgress(project_id=p1.id, date=datetime.datetime.utcnow(), image_path=f"/static/images/{d3_path}", progress_percentage=prog_p1[1]["progress_percentage"], notes=prog_p1[1]["notes"]))

    # Progress P2 (Stagnant)
    db.add(models.DailyProgress(project_id=p2.id, date=datetime.datetime.utcnow() - datetime.timedelta(days=3), image_path=f"/static/images/{d1_path}", progress_percentage=0.0, notes="Initial"))
    db.add(models.DailyProgress(project_id=p2.id, date=datetime.datetime.utcnow(), image_path=f"/static/images/{d1_path}", progress_percentage=0.0, notes="No structural change detected."))
    db.add(models.Alert(project_id=p2.id, message="No progress detected in recent monitoring cycle. Image matches previous state.", severity="Medium"))

    # Progress P3 (Demolition Anomaly)
    res_p3 = ai_engine.calculate_progress("backend/static/images/building_intact.png", "backend/static/images/building_destroyed.png")
    db.add(models.DailyProgress(project_id=p3.id, date=datetime.datetime.utcnow() - datetime.timedelta(days=14), image_path=f"/static/images/building_intact.png", progress_percentage=0.0, notes="Site identified."))
    db.add(models.DailyProgress(project_id=p3.id, date=datetime.datetime.utcnow(), image_path=f"/static/images/building_destroyed.png", progress_percentage=res_p3["progress_percentage"], notes=res_p3["notes"]))
    if res_p3["anomaly"]:
        db.add(models.Alert(project_id=p3.id, message="CRITICAL: Building demolition detected instead of construction. Potential misuse of funds.", severity="High"))

    # Progress P4 (Hospital)
    db.add(models.DailyProgress(project_id=p4.id, date=datetime.datetime.utcnow(), image_path=f"/static/images/{d2_path}", progress_percentage=12.5, notes="Excavation phase."))

    # Progress P5 (Water Tank)
    db.add(models.DailyProgress(project_id=p5.id, date=datetime.datetime.utcnow(), image_path=f"/static/images/{d1_path}", progress_percentage=5.0, notes="Site cleared."))

    db.commit()
    return {"message": "Database seeded successfully with 5 projects"}
