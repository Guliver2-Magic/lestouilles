import json
import re

# Read the menu data file
with open('client/src/data/completeMenuData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Define realistic nutritional values for different food categories
nutrition_data = {
    # Sandwiches (per serving)
    'sandwich': {'calories': 450, 'protein': 25, 'carbs': 45, 'fat': 18},
    'wrap': {'calories': 380, 'protein': 22, 'carbs': 38, 'fat': 14},
    
    # Salads (per serving)
    'salade': {'calories': 280, 'protein': 15, 'carbs': 20, 'fat': 16},
    
    # Main dishes (per serving)
    'poulet': {'calories': 420, 'protein': 35, 'carbs': 25, 'fat': 20},
    'boeuf': {'calories': 480, 'protein': 38, 'carbs': 22, 'fat': 26},
    'porc': {'calories': 450, 'protein': 32, 'carbs': 24, 'fat': 24},
    'poisson': {'calories': 350, 'protein': 30, 'carbs': 20, 'fat': 15},
    
    # Soups (per serving)
    'soupe': {'calories': 180, 'protein': 8, 'carbs': 22, 'fat': 6},
    
    # Desserts (per serving)
    'dessert': {'calories': 320, 'protein': 4, 'carbs': 48, 'fat': 14},
    
    # Lunch boxes (per serving)
    'boite': {'calories': 520, 'protein': 28, 'carbs': 52, 'fat': 22},
    
    # Buffets (per person)
    'buffet': {'calories': 650, 'protein': 35, 'carbs': 60, 'fat': 28},
}

print("Nutritional data script created successfully")
