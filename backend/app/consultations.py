from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from . import models, schemas
from .auth import get_current_user
from .database import get_db


router = APIRouter(prefix="/consultations", tags=["consultations"])


@router.post("", response_model=schemas.ConsultationOut, status_code=201)
def create_consultation_request(
    payload: schemas.ConsultationCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    analysis = db.get(models.PropertyAnalysis, payload.analysis_id)
    if not analysis or analysis.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Analysis not found")

    existing = (
        db.query(models.ConsultationRequest)
        .filter(
            models.ConsultationRequest.analysis_id == payload.analysis_id,
            models.ConsultationRequest.user_id == current_user.id,
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Consultation already requested for this analysis",
        )

    consultation = models.ConsultationRequest(
        user_id=current_user.id,
        analysis_id=payload.analysis_id,
        preferred_datetime=payload.preferred_datetime,
        message=payload.message,
    )
    db.add(consultation)
    db.commit()
    db.refresh(consultation)
    return consultation


@router.get("", response_model=list[schemas.ConsultationOut])
def list_consultations(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    items = (
        db.query(models.ConsultationRequest)
        .filter(models.ConsultationRequest.user_id == current_user.id)
        .order_by(models.ConsultationRequest.created_at.desc())
        .all()
    )
    return items


