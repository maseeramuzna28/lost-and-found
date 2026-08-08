from sqlalchemy import Column, Integer, String, Text, Date, DateTime
from sqlalchemy.sql import func
from app.database import Base


class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    type = Column(String(10), nullable=False)          # LOST or FOUND
    category = Column(String(100), nullable=True)
    description = Column(Text, nullable=False)
    location = Column(String(255), nullable=False)
    date = Column(Date, nullable=False)
    image_url = Column(String(500), nullable=True)
    contact = Column(String(255), nullable=False)
    status = Column(String(10), nullable=False, default="OPEN")  # OPEN or CLAIMED
    created_at = Column(DateTime(timezone=True), server_default=func.now())
