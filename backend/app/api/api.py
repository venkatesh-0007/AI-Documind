from fastapi import APIRouter
from app.api.endpoints import analyze, auth

api_router = APIRouter()
api_router.include_router(analyze.router, tags=["analyze"])
api_router.include_router(auth.router, tags=["auth"])
