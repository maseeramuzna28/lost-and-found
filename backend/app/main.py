import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database import engine
from app import models
from app.routes.items import router as items_router

# Create tables on startup
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Campus Lost & Found API")

# CORS configuration for both local testing and Vercel deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "https://*.vercel.app",
        "*",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded images
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

app.include_router(items_router, prefix="/api")


@app.get("/")
def root():
    return {"message": "Campus Lost & Found API is running"}


@app.get("/health")
def health_check():
    return {
        "status": "OK",
        "message": "Backend is running successfully"
    }
