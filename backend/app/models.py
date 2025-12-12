from datetime import datetime

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_subscribed = Column(Boolean, default=False)
    analysis_count = Column(Integer, default=0)

    stripe_customer_id = Column(String, nullable=True)
    stripe_subscription_id = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    analyses = relationship(
        "PropertyAnalysis", back_populates="user", cascade="all, delete-orphan"
    )
    consultations = relationship(
        "ConsultationRequest",
        back_populates="user",
        cascade="all, delete-orphan",
    )


class PropertyAnalysis(Base):
    __tablename__ = "property_analyses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    title = Column(String, nullable=False)
    funda_url = Column(String, nullable=True)
    address_line = Column(String, nullable=True)
    postal_code = Column(String, nullable=True)
    city = Column(String, nullable=True)

    asking_price = Column(Float, nullable=True)
    expected_rent = Column(Float, nullable=True)
    expected_sale_price = Column(Float, nullable=True)
    renovation_cost = Column(Float, nullable=True)
    purchase_costs = Column(Float, nullable=True)
    service_costs_monthly = Column(Float, nullable=True)

    analysis_type = Column(String, nullable=False)  # buy_to_let / flip / hybrid

    gross_rental_yield = Column(Float, nullable=True)
    net_rental_yield = Column(Float, nullable=True)
    annual_cashflow = Column(Float, nullable=True)
    flip_roi = Column(Float, nullable=True)

    recommendation = Column(Text, nullable=True)
    summary = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="analyses")
    consultation = relationship(
        "ConsultationRequest",
        back_populates="analysis",
        uselist=False,
    )


class ConsultationRequest(Base):
    __tablename__ = "consultation_requests"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    analysis_id = Column(
        Integer, ForeignKey("property_analyses.id"), nullable=False
    )

    preferred_datetime = Column(String, nullable=False)
    message = Column(Text, nullable=True)
    status = Column(
        String, default="pending"
    )  # pending / confirmed / completed / cancelled

    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="consultations")
    analysis = relationship("PropertyAnalysis", back_populates="consultation")


