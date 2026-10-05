from fastapi import APIRouter
from pydantic import BaseModel

from app.services.climate import calculate_climate_status
from app.services.weather import get_current_weather

router = APIRouter()


class ClimateRequest(BaseModel):
    tree_cover: float
    built_up: float


@router.post("/status")
def climate_status(data: ClimateRequest):

    weather = get_current_weather()

    result = calculate_climate_status(
        temperature=weather["temperature_c"],
        humidity=weather["humidity_percent"],
        rainfall=weather["rain_mm"],
        tree_cover=data.tree_cover,
        built_up=data.built_up
    )

    return {
        "location": weather["location"],
        "weather": weather,
        **result
    }