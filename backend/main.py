from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database.db import Base, engine
from models.refill_case import RefillCase
from models.audit_event import AuditEvent
from models.prescription import PrescriptionExtraction

from api.refill_routes import router as refill_router
from api.prescription_routes import router as prescription_router


app = FastAPI(
    title="RefillFlow",
    version="1.0.0"
)


# Allow Next.js frontend to access FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register API routes
app.include_router(refill_router)
app.include_router(prescription_router)


# Create database tables
Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {
        "message": "RefillFlow Backend Running",
        "system": "Online",
        "features": ["Refill Control Tower", "AI Prescription Assistant"]
    }