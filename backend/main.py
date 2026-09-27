import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database.db import Base, engine, SessionLocal
from models.refill_case import RefillCase
from models.audit_event import AuditEvent
from models.prescription import PrescriptionExtraction

from api.refill_routes import router as refill_router
from api.prescription_routes import router as prescription_router


app = FastAPI(
    title="RefillFlow",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://frontend-pi-weld-64.vercel.app",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routes
app.include_router(refill_router)
app.include_router(prescription_router)

# Create database tables
Base.metadata.create_all(bind=engine)

def seed_db_if_empty():
    db = SessionLocal()
    try:
        case_count = db.query(RefillCase).count()
        if case_count == 0:
            c1 = RefillCase(
                case_id="RF-001",
                patient_name="Ananya Sharma",
                medication="Metformin 500mg",
                status="PROVIDER_REVIEW",
                blocker="NO_REFILLS_REMAINING",
                owner="Clinical Team",
                priority="HIGH",
                confidence=0.95,
            )
            c2 = RefillCase(
                case_id="RF-002",
                patient_name="Rajesh Patel",
                medication="Lipitor 20mg",
                status="INSURANCE_BLOCKED",
                blocker="INSURANCE_DENIAL",
                owner="Insurance Team",
                priority="HIGH",
                confidence=0.92,
            )
            db.add(c1)
            db.add(c2)
            db.commit()

            events = [
                AuditEvent(case_id="RF-001", event_type="REQUEST_RECEIVED", description="Pharmacy refill request received", actor="PHARMACY_SYSTEM"),
                AuditEvent(case_id="RF-001", event_type="AI_ANALYSIS", description="AI extracted: Zero refills remaining on active prescription", actor="GROQ_AI"),
                AuditEvent(case_id="RF-001", event_type="BLOCKER_IDENTIFIED", description="Operational blocker: NO_REFILLS_REMAINING", actor="WORKFLOW_ENGINE"),
                AuditEvent(case_id="RF-001", event_type="ROUTED_TO_PROVIDER", description="Routed to Practice Staff / Provider Review queue", actor="WORKFLOW_ENGINE"),
                AuditEvent(case_id="RF-002", event_type="REQUEST_RECEIVED", description="Pharmacy refill request received for Lipitor 20mg", actor="PHARMACY_SYSTEM"),
                AuditEvent(case_id="RF-002", event_type="AI_ANALYSIS", description="AI identified insurance denial code 50 (Prior Authorization Required)", actor="GROQ_AI"),
                AuditEvent(case_id="RF-002", event_type="BLOCKER_IDENTIFIED", description="Operational blocker: INSURANCE_DENIAL", actor="WORKFLOW_ENGINE"),
            ]
            db.add_all(events)
            db.commit()
    except Exception as e:
        print(f"Seed warning: {e}")
        db.rollback()
    finally:
        db.close()

seed_db_if_empty()

@app.get("/")
def root():
    return {
        "message": "RefillFlow Backend Running",
        "system": "Online",
        "features": ["Refill Control Tower", "AI Prescription Assistant"]
    }