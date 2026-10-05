from fastapi import APIRouter
from pydantic import BaseModel

from app.services.heat import calculate_heat_risk

router = APIRouter()


class HeatRequest(BaseModel):
    temperature: float
    humidity: float
    tree_cover: float
    built_up: float


@router.post("/analyze")
def analyze_heat(data: HeatRequest):
    return calculate_heat_risk(
        temperature=data.temperature,
        humidity=data.humidity,
        tree_cover=data.tree_cover,
        built_up=data.built_up
    )


@router.get("/test")
def heat_test():
    return {
        "message": "Heat module working"
    }