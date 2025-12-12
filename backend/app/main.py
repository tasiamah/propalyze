from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import auth, consultations, models, payments, property_analysis
from .config import get_settings
from .database import Base, engine


settings = get_settings()

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    description="Backend API for Propalyze – property analysis for buy-to-let and flips.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.backend_cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(property_analysis.router)
app.include_router(consultations.router)
app.include_router(payments.router)


@app.get("/health")
def health_check():
    return {"status": "ok"}


