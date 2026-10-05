def calculate_heat_risk(
    temperature: float,
    humidity: float,
    tree_cover: float,
    built_up: float
):
    score = 0

    # Temperature
    if temperature >= 45:
        score += 40
    elif temperature >= 42:
        score += 30
    elif temperature >= 38:
        score += 20
    else:
        score += 10

    # Humidity
    if humidity >= 70:
        score += 25
    elif humidity >= 50:
        score += 15
    else:
        score += 5

    # Low tree cover increases risk
    if tree_cover < 10:
        score += 20
    elif tree_cover < 25:
        score += 10

    # High built-up area increases risk
    if built_up >= 80:
        score += 15
    elif built_up >= 60:
        score += 10

    score = min(score, 100)

    if score >= 75:
        risk = "HIGH"
    elif score >= 50:
        risk = "MODERATE"
    else:
        risk = "LOW"

    recommendations = []

    if tree_cover < 25:
        recommendations.append("Increase tree or shaded areas")

    if built_up >= 60:
        recommendations.append("Consider reflective or cool roofing")

    if temperature >= 40:
        recommendations.append("Increase shaded public spaces")

    if humidity >= 60:
        recommendations.append("Provide heat and hydration warnings")

    if not recommendations:
        recommendations.append("Continue existing heat mitigation measures")

    return {
        "temperature_c": temperature,
        "humidity_percent": humidity,
        "tree_cover_percent": tree_cover,
        "built_up_percent": built_up,
        "heat_risk_score": score,
        "risk_level": risk,
        "recommendations": recommendations
    }