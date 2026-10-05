from fastapi import APIRouter
from pydantic import BaseModel
from app.services.water import (
    calculate_rainwater,
    calculate_community_storage
)
from app.services.water import calculate_rainwater

router = APIRouter()
class CommunityWaterRequest(BaseModel):
    current_water: float
    tank_capacity: float
    incoming_water: float

class WaterRequest(BaseModel):
    roof_area: float
    rainfall_mm: float
    tank_capacity: float


@router.post("/calculate")
def calculate_water(data: WaterRequest):
    return calculate_rainwater(
        roof_area=data.roof_area,
        rainfall_mm=data.rainfall_mm,
        tank_capacity=data.tank_capacity
    )


@router.get("/test")
def water_test():
    return {
        "message": "Water module working"
    }

@router.post("/community")
def community_storage(data: CommunityWaterRequest):
    return calculate_community_storage(
        current_water=data.current_water,
        tank_capacity=data.tank_capacity,
        incoming_water=data.incoming_water
    )