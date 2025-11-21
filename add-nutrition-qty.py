import json

# This script adds nutritional information, quantity, and servings to menu items
# Based on typical catering portions and nutritional values

menu_updates = {
    # Sandwichs - typically 200-250g each
    "sand": {
        "quantity": "250g",
        "nutrition": {"calories": 350, "protein": 15, "carbs": 45, "fat": 12}
    },
    # Salades - typically 300-400g per person
    "salad": {
        "quantity": "350g",
        "nutrition": {"calories": 280, "protein": 12, "carbs": 25, "fat": 15}
    },
    # Wraps - typically 200-250g each
    "wrap": {
        "quantity": "230g",
        "nutrition": {"calories": 380, "protein": 18, "carbs": 42, "fat": 14}
    },
    # Soupes - typically 300ml per person
    "soup": {
        "quantity": "300ml",
        "nutrition": {"calories": 180, "protein": 8, "carbs": 22, "fat": 6}
    },
    # Plats principaux - typically 350-450g per person
    "main": {
        "quantity": "400g",
        "nutrition": {"calories": 520, "protein": 35, "carbs": 48, "fat": 20}
    },
    # Viandes - typically 150-200g per person
    "meat": {
        "quantity": "180g",
        "nutrition": {"calories": 380, "protein": 42, "carbs": 5, "fat": 22}
    },
    # Desserts - typically 120-150g per person
    "dessert": {
        "quantity": "130g",
        "nutrition": {"calories": 320, "protein": 5, "carbs": 48, "fat": 14}
    },
    # Boîtes à lunch - complete meal
    "lunch-box": {
        "quantity": "600g",
        "nutrition": {"calories": 650, "protein": 28, "carbs": 68, "fat": 24}
    }
}

print("Nutritional data and quantities ready to add to menu items")
print(json.dumps(menu_updates, indent=2))
