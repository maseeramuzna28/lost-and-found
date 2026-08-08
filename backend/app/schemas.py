from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import date, datetime


class ItemCreate(BaseModel):
    title: str
    type: str
    category: Optional[str] = None
    description: str
    location: str
    date: date
    image_url: Optional[str] = None
    contact: str
    status: Optional[str] = "OPEN"

    @field_validator("type")
    @classmethod
    def type_must_be_valid(cls, v: str) -> str:
        if v not in ("LOST", "FOUND"):
            raise ValueError("type must be LOST or FOUND")
        return v

    @field_validator("status")
    @classmethod
    def status_must_be_valid(cls, v: str) -> str:
        if v not in ("OPEN", "CLAIMED"):
            raise ValueError("status must be OPEN or CLAIMED")
        return v


class ItemUpdate(BaseModel):
    title: Optional[str] = None
    type: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    date: Optional[date] = None
    image_url: Optional[str] = None
    contact: Optional[str] = None
    status: Optional[str] = None


class ItemOut(BaseModel):
    id: int
    title: str
    type: str
    category: Optional[str]
    description: str
    location: str
    date: date
    image_url: Optional[str]
    contact: str
    status: str
    created_at: Optional[datetime]

    model_config = {"from_attributes": True}
