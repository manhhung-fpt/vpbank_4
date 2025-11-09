"""
AI/ML Enhanced Credit Scoring System - FastAPI Backend
Main application entry point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from api.routes import router as api_router
from database.db import init_db
from core.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database on startup"""
    print("🚀 Starting AI Credit Scoring System...")
    await init_db()
    print("✅ Database initialized")
    yield
    print("👋 Shutting down...")


app = FastAPI(
    title="AI Credit Scoring API",
    description="AI/ML Enhanced Credit Scoring System with XGBoost and OpenAI GPT",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix="/api/v1")


@app.get("/")
async def root():
    return {
        "message": "AI Credit Scoring API",
        "version": "1.0.0",
        "status": "operational",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "credit-scoring-api"}


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=True if settings.ENVIRONMENT == "development" else False
    )
