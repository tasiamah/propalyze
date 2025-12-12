from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from . import models, schemas
from .auth import get_current_user
from .database import get_db


router = APIRouter(prefix="/analyses", tags=["property-analyses"])

FREE_ANALYSIS_LIMIT = 2


def _compute_metrics(payload: schemas.PropertyAnalysisInput) -> dict:
    asking_price = payload.asking_price or 0
    expected_rent = payload.expected_rent or 0
    expected_sale_price = payload.expected_sale_price or 0
    renovation_cost = payload.renovation_cost or 0
    purchase_costs = payload.purchase_costs or 0
    service_costs_monthly = payload.service_costs_monthly or 0

    total_investment = asking_price + renovation_cost + purchase_costs
    annual_gross_rent = expected_rent * 12

    vacancy_rate = 0.05
    maintenance_rate = 0.10

    annual_effective_rent = annual_gross_rent * (1 - vacancy_rate)
    annual_maintenance = annual_effective_rent * maintenance_rate
    annual_service_costs = service_costs_monthly * 12

    annual_expenses = annual_maintenance + annual_service_costs
    annual_cashflow = annual_effective_rent - annual_expenses

    gross_yield = (
        (annual_gross_rent / total_investment * 100)
        if total_investment > 0 and annual_gross_rent > 0
        else None
    )
    net_yield = (
        (annual_cashflow / total_investment * 100)
        if total_investment > 0 and annual_cashflow
        else None
    )

    flip_profit = (
        expected_sale_price - total_investment if expected_sale_price else None
    )
    flip_roi = (
        (flip_profit / total_investment * 100)
        if flip_profit is not None and total_investment > 0
        else None
    )

    # Simple recommendation engine
    recommendation_parts: list[str] = []

    if payload.analysis_type in ("buy_to_let", "hybrid"):
        if net_yield is not None and net_yield >= 6 and annual_cashflow > 0:
            recommendation_parts.append(
                "Strong candidate for buy-to-let based on net yield and cashflow."
            )
        elif net_yield is not None and net_yield >= 4:
            recommendation_parts.append(
                "Acceptable buy-to-let candidate, but consider negotiating on price or improving rent."
            )
        else:
            recommendation_parts.append(
                "Weak buy-to-let profile; yields and cashflow look tight."
            )

    if payload.analysis_type in ("flip", "hybrid"):
        if flip_roi is not None and flip_roi >= 20:
            recommendation_parts.append(
                "Excellent flip potential with strong projected ROI."
            )
        elif flip_roi is not None and flip_roi >= 12:
            recommendation_parts.append(
                "Reasonable flip potential; detailed cost validation is recommended."
            )
        else:
            recommendation_parts.append(
                "Flip economics look modest; be cautious with renovation scope."
            )

    if not recommendation_parts:
        recommendation_parts.append(
            "Provide more financial inputs to get a richer analysis."
        )

    summary = (
        " ".join(recommendation_parts)
        + " Figures are based on simplified assumptions (5% vacancy, 10% maintenance)."
    )

    return {
        "total_investment": total_investment,
        "annual_cashflow": annual_cashflow,
        "gross_yield": gross_yield,
        "net_yield": net_yield,
        "flip_roi": flip_roi,
        "recommendation": " ".join(recommendation_parts),
        "summary": summary,
    }


@router.post("", response_model=schemas.PropertyAnalysisOut, status_code=201)
def create_analysis(
    payload: schemas.PropertyAnalysisInput,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if (
        not current_user.is_subscribed
        and current_user.analysis_count >= FREE_ANALYSIS_LIMIT
    ):
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail="Free analysis limit reached. Please subscribe to continue.",
        )

    metrics = _compute_metrics(payload)

    analysis = models.PropertyAnalysis(
        user_id=current_user.id,
        title=payload.title,
        funda_url=payload.funda_url,
        address_line=payload.address_line,
        postal_code=payload.postal_code,
        city=payload.city,
        asking_price=payload.asking_price,
        expected_rent=payload.expected_rent,
        expected_sale_price=payload.expected_sale_price,
        renovation_cost=payload.renovation_cost,
        purchase_costs=payload.purchase_costs,
        service_costs_monthly=payload.service_costs_monthly,
        analysis_type=payload.analysis_type,
        gross_rental_yield=metrics["gross_yield"],
        net_rental_yield=metrics["net_yield"],
        annual_cashflow=metrics["annual_cashflow"],
        flip_roi=metrics["flip_roi"],
        recommendation=metrics["recommendation"],
        summary=metrics["summary"],
    )

    db.add(analysis)
    current_user.analysis_count += 1
    db.commit()
    db.refresh(analysis)
    db.refresh(current_user)

    return analysis


@router.get("", response_model=list[schemas.PropertyAnalysisListItem])
def list_analyses(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    items = (
        db.query(models.PropertyAnalysis)
        .filter(models.PropertyAnalysis.user_id == current_user.id)
        .order_by(models.PropertyAnalysis.created_at.desc())
        .all()
    )
    return items


@router.get("/{analysis_id}", response_model=schemas.PropertyAnalysisOut)
def get_analysis(
    analysis_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    analysis = db.get(models.PropertyAnalysis, analysis_id)
    if not analysis or analysis.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return analysis


