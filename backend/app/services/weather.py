import requests


KANPUR_LAT = 26.4499
KANPUR_LON = 80.3319


def get_current_weather():
    url = "https://api.open-meteo.com/v1/forecast"

    params = {
        "latitude": KANPUR_LAT,
        "longitude": KANPUR_LON,
        "current": "temperature_2m,relative_humidity_2m,rain",
        "timezone": "Asia/Kolkata",
    }

    response = requests.get(url, params=params, timeout=10)
    response.raise_for_status()

    data = response.json()
    current = data["current"]

    return {
        "location": "Kanpur",
        "temperature_c": current["temperature_2m"],
        "humidity_percent": current["relative_humidity_2m"],
        "rain_mm": current["rain"],
    }