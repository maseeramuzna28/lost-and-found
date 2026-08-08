import os
import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from datetime import date

from app.database import get_db
from app import models, schemas

router = APIRouter()

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.get("/items", response_model=list[schemas.ItemOut])
def list_items(
    search: Optional[str] = None,
    type: Optional[str] = None,
    category: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(models.Item)
    if search:
        term = f"%{search}%"
        query = query.filter(
            models.Item.title.ilike(term) | models.Item.description.ilike(term)
        )
    if type:
        query = query.filter(models.Item.type == type.upper())
    if category:
        query = query.filter(models.Item.category == category)
    if status:
        query = query.filter(models.Item.status == status.upper())
    return query.order_by(models.Item.created_at.desc()).all()


@router.get("/items/{item_id}", response_model=schemas.ItemOut)
def get_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.Item).filter(models.Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@router.post("/items", response_model=schemas.ItemOut, status_code=201)
async def create_item(
    title: str = Form(...),
    type: str = Form(...),
    category: Optional[str] = Form(None),
    description: str = Form(...),
    location: str = Form(...),
    date: date = Form(...),
    contact: str = Form(...),
    status: str = Form("OPEN"),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    image_url = None
    if image and image.filename:
        ext = os.path.splitext(image.filename)[1]
        filename = f"{uuid.uuid4().hex}{ext}"
        filepath = os.path.join(UPLOAD_DIR, filename)
        content = await image.read()
        with open(filepath, "wb") as f:
            f.write(content)
        image_url = f"/uploads/{filename}"

    db_item = models.Item(
        title=title,
        type=type.upper(),
        category=category,
        description=description,
        location=location,
        date=date,
        image_url=image_url,
        contact=contact,
        status=status.upper(),
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


@router.put("/items/{item_id}", response_model=schemas.ItemOut)
async def update_item(
    item_id: int,
    title: Optional[str] = Form(None),
    type: Optional[str] = Form(None),
    category: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    location: Optional[str] = Form(None),
    date: Optional[date] = Form(None),
    contact: Optional[str] = Form(None),
    status: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    item = db.query(models.Item).filter(models.Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    if title is not None:
        item.title = title
    if type is not None:
        item.type = type.upper()
    if category is not None:
        item.category = category
    if description is not None:
        item.description = description
    if location is not None:
        item.location = location
    if date is not None:
        item.date = date
    if contact is not None:
        item.contact = contact
    if status is not None:
        item.status = status.upper()

    if image and image.filename:
        ext = os.path.splitext(image.filename)[1]
        filename = f"{uuid.uuid4().hex}{ext}"
        filepath = os.path.join(UPLOAD_DIR, filename)
        content = await image.read()
        with open(filepath, "wb") as f:
            f.write(content)
        item.image_url = f"/uploads/{filename}"

    db.commit()
    db.refresh(item)
    return item


@router.delete("/items/{item_id}", status_code=204)
def delete_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.Item).filter(models.Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(item)
    db.commit()


@router.patch("/items/{item_id}/claim", response_model=schemas.ItemOut)
def claim_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.Item).filter(models.Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    item.status = "CLAIMED"
    db.commit()
    db.refresh(item)
    return item
