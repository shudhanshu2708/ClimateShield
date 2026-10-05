from fastapi import APIRouter

from app.services.weather import get_current_weather

router = APIRouter()


@router.get("/current")
def current_weather():
    return get_current_weather()