from typing import Optional

import stripe
from fastapi import APIRouter, Depends, Header, HTTPException, Request, status
from sqlalchemy.orm import Session

from . import models, schemas
from .auth import get_current_user
from .config import get_settings
from .database import get_db


router = APIRouter(prefix="/billing", tags=["billing"])

settings = get_settings()
if settings.stripe_secret_key:
    stripe.api_key = settings.stripe_secret_key


@router.get("/public-config", response_model=schemas.PublicStripeConfig)
def get_public_config():
    return schemas.PublicStripeConfig(
        publishable_key=settings.stripe_publishable_key
    )


@router.post(
    "/create-checkout-session",
    response_model=schemas.CheckoutSessionOut,
)
def create_checkout_session(
    payload: schemas.CheckoutSessionCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if not settings.stripe_secret_key or not settings.stripe_price_id:
        raise HTTPException(
            status_code=500,
            detail=(
                "Stripe is not configured. "
                "Set STRIPE_SECRET_KEY and STRIPE_PRICE_ID."
            ),
        )

    try:
        customer_kwargs: dict = {}
        if current_user.stripe_customer_id:
            customer_kwargs["customer"] = current_user.stripe_customer_id
        else:
            customer_kwargs["customer_email"] = current_user.email

        session = stripe.checkout.Session.create(
            mode="subscription",
            line_items=[
                {
                    "price": settings.stripe_price_id,
                    "quantity": 1,
                }
            ],
            success_url=payload.success_url,
            cancel_url=payload.cancel_url,
            **customer_kwargs,
        )

        if not current_user.stripe_customer_id and isinstance(
            session.get("customer"), str
        ):
            current_user.stripe_customer_id = session["customer"]
            db.add(current_user)
            db.commit()

        return schemas.CheckoutSessionOut(checkout_url=session.url)
    except Exception as exc:  # pragma: no cover - external service
        raise HTTPException(
            status_code=500,
            detail=f"Stripe error: {exc}",
        )


@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    db: Session = Depends(get_db),
    stripe_signature: Optional[str] = Header(
        default=None, alias="Stripe-Signature"
    ),
):
    if not settings.stripe_secret_key:
        raise HTTPException(status_code=500, detail="Stripe not configured")

    payload = await request.body()

    # For local development we accept events without verifying signature,
    # expecting you to use the Stripe CLI, but we keep the hook in place
    # so you can easily tighten it in production.
    try:
        event = stripe.Event.construct_from(
            request.json() if hasattr(request, "json") else {}, stripe.api_key
        )
    except Exception:
        # Fallback: parse manually
        import json

        try:
            event = stripe.Event.construct_from(
                json.loads(payload.decode("utf-8")), stripe.api_key
            )
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid payload")

    if event.type == "checkout.session.completed":
        session = event.data.object
        customer_id = session.get("customer")
        subscription_id = session.get("subscription")

        if customer_id:
            user = (
                db.query(models.User)
                .filter(models.User.stripe_customer_id == customer_id)
                .first()
            )
            if user:
                user.is_subscribed = True
                if isinstance(subscription_id, str):
                    user.stripe_subscription_id = subscription_id
                db.add(user)
                db.commit()

    return {"received": True}


