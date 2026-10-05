from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import water, heat, weather, climate


app = FastAPI(
    title="ClimateShield API",
    description="Water and heat resilience platform",
    version="1.0.0"
)
app.include_router(
    weather.router,
    prefix="/weather",
    tags=["Weather"]
)
app.include_router(
    climate.router,
    prefix="/climate",
    tags=["Climate"]
)
# Allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    water.router,
    prefix="/water",
    tags=["Water"]
)

app.include_router(
    heat.router,
    prefix="/heat",
    tags=["Heat"]
)


@app.get("/")
def root():
    return {
        "message": "ClimateShield API is running"
    }