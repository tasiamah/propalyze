from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


# Auth & User


class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(min_length=8)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(UserBase):
    id: int
    is_active: bool
    is_subscribed: bool
    analysis_count: int
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: Optional[int] = None


# Property analysis


class PropertyAnalysisInput(BaseModel):
    title: str
    analysis_type: str = Field(pattern="^(buy_to_let|flip|hybrid)$")

    funda_url: Optional[str] = None
    address_line: Optional[str] = None
    postal_code: Optional[str] = None
    city: Optional[str] = None

    asking_price: Optional[float] = None
    expected_rent: Optional[float] = None
    expected_sale_price: Optional[float] = None
    renovation_cost: Optional[float] = 0
    purchase_costs: Optional[float] = 0
    service_costs_monthly: Optional[float] = 0


class PropertyAnalysisOut(BaseModel):
    id: int
    title: str
    funda_url: Optional[str]
    address_line: Optional[str]
    postal_code: Optional[str]
    city: Optional[str]
    asking_price: Optional[float]
    expected_rent: Optional[float]
    expected_sale_price: Optional[float]
    renovation_cost: Optional[float]
    purchase_costs: Optional[float]
    service_costs_monthly: Optional[float]
    analysis_type: str
    gross_rental_yield: Optional[float]
    net_rental_yield: Optional[float]
    annual_cashflow: Optional[float]
    flip_roi: Optional[float]
    recommendation: Optional[str]
    summary: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class PropertyAnalysisListItem(BaseModel):
    id: int
    title: str
    city: Optional[str]
    analysis_type: str
    gross_rental_yield: Optional[float]
    flip_roi: Optional[float]
    created_at: datetime

    class Config:
        from_attributes = True


# Consultation


class ConsultationCreate(BaseModel):
    analysis_id: int
    preferred_datetime: str
    message: Optional[str] = None


class ConsultationOut(BaseModel):
    id: int
    analysis_id: int
    preferred_datetime: str
    message: Optional[str]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


# Payments / Stripe


class CheckoutSessionCreate(BaseModel):
    success_url: str
    cancel_url: str


class CheckoutSessionOut(BaseModel):
    checkout_url: str


class PublicStripeConfig(BaseModel):
    publishable_key: Optional[str]


