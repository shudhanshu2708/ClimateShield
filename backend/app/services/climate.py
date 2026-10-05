def calculate_climate_status(
    temperature: float,
    humidity: float,
    rainfall: float,
    tree_cover: float,
    built_up: float
):
    # -------------------------
    # HEAT RISK
    # -------------------------

    heat_score = 0

    if temperature >= 45:
        heat_score += 45
    elif temperature >= 42:
        heat_score += 35
    elif temperature >= 38:
        heat_score += 25
    elif temperature >= 35:
        heat_score += 15
    else:
        heat_score += 5

    if humidity >= 70:
        heat_score += 20
    elif humidity >= 50:
        heat_score += 10

    if tree_cover < 10:
        heat_score += 20
    elif tree_cover < 25:
        heat_score += 10

    if built_up >= 80:
        heat_score += 15
    elif built_up >= 60:
        heat_score += 10

    heat_score = min(heat_score, 100)

    if heat_score >= 75:
        heat_risk = "HIGH"
    elif heat_score >= 50:
        heat_risk = "MODERATE"
    else:
        heat_risk = "LOW"

    # -------------------------
    # RAIN RISK
    # -------------------------

    if rainfall >= 50:
        rain_score = 90
        rain_risk = "HIGH"
    elif rainfall >= 20:
        rain_score = 65
        rain_risk = "MODERATE"
    elif rainfall >= 5:
        rain_score = 35
        rain_risk = "LOW"
    else:
        rain_score = 10
        rain_risk = "LOW"

    # -------------------------
    # ACTIONS
    # -------------------------

    actions = []

    if heat_risk == "HIGH":
        actions.append("Increase shaded public areas")
        actions.append("Prepare hydration points")

    elif heat_risk == "MODERATE":
        actions.append("Monitor heat exposure in outdoor areas")

    if tree_cover < 25:
        actions.append("Prioritize tree or shade interventions")

    if built_up >= 60:
        actions.append("Consider reflective or cool roofing")

    if rain_risk == "HIGH":
        actions.append("Check community tank capacity")
        actions.append("Prepare safe overflow routes")
        actions.append("Inspect drainage and waterlogging points")

    elif rain_risk == "MODERATE":
        actions.append("Check rainwater storage readiness")

    if not actions:
        actions.append("Continue normal climate preparedness")

    # -------------------------
    # OVERALL READINESS
    # -------------------------

    risk_average = (heat_score + rain_score) / 2

    readiness_score = round(100 - risk_average)

    if readiness_score >= 70:
        readiness_status = "READY"
    elif readiness_score >= 40:
        readiness_status = "NEEDS ACTION"
    else:
        readiness_status = "HIGH PRIORITY"

    return {
        "heat": {
            "score": heat_score,
            "risk": heat_risk
        },
        "rain": {
            "score": rain_score,
            "risk": rain_risk
        },
        "climate_readiness": {
            "score": readiness_score,
            "status": readiness_status
        },
        "actions": actions
    }