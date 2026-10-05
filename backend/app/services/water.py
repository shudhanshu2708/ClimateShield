def calculate_rainwater(
    roof_area: float,
    rainfall_mm: float,
    tank_capacity: float
):
    # 1 mm rain on 1 m² = 1 litre
    collected_liters = roof_area * rainfall_mm

    # 80% collection efficiency
    usable_liters = collected_liters * 0.80

    stored_liters = min(usable_liters, tank_capacity)
    overflow_liters = max(usable_liters - tank_capacity, 0)

    return {
        "roof_area_m2": roof_area,
        "rainfall_mm": rainfall_mm,
        "potential_collection_liters": round(usable_liters, 2),
        "tank_capacity_liters": tank_capacity,
        "stored_liters": round(stored_liters, 2),
        "overflow_liters": round(overflow_liters, 2),
        "recommendation": (
            "Route overflow to community storage"
            if overflow_liters > 0
            else "Tank can store the expected rainfall"
        )
    }


def calculate_community_storage(
    current_water: float,
    tank_capacity: float,
    incoming_water: float
):
    available_space = max(tank_capacity - current_water, 0)

    accepted_water = min(incoming_water, available_space)
    overflow = max(incoming_water - available_space, 0)

    new_level = current_water + accepted_water

    fill_percentage = (new_level / tank_capacity) * 100

    if fill_percentage >= 90:
        recommendation = (
            "Community tank nearly full. "
            "Prepare for controlled recharge or safe overflow."
        )
    elif fill_percentage >= 70:
        recommendation = (
            "Storage level high. "
            "Prioritize non-potable community use."
        )
    else:
        recommendation = "Storage available for additional rainwater."

    return {
        "previous_water_liters": round(current_water, 2),
        "incoming_water_liters": round(incoming_water, 2),
        "accepted_water_liters": round(accepted_water, 2),
        "current_water_liters": round(new_level, 2),
        "tank_capacity_liters": round(tank_capacity, 2),
        "fill_percentage": round(fill_percentage, 2),
        "overflow_liters": round(overflow, 2),
        "recommendation": recommendation
    }