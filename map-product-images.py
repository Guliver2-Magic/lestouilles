import json
import re

# Image mapping by category
category_images = {
    "Salades": "/images/caesar-salad.jpg",  # Will vary by salad type
    "Sandwichs": "/images/sandwich.jpg",
    "Wraps": "/images/wrap.jpg",
    "Soupes": "/images/soup.jpg",
    "Plats Préparés": "/images/main-dish.jpg",
    "Plats Principaux": "/images/main-dish.jpg",
    "Viandes": "/images/meat.jpg",
    "Légumes": "/images/main-dish.jpg",
    "Desserts": "/images/dessert.jpg",
    "Boîtes à Lunch": "/images/lunch-box.jpg",
    "Boissons": "/images/soup.jpg",  # Placeholder
}

# Specific salad mappings
salad_mappings = {
    "césar": "/images/caesar-salad.jpg",
    "caesar": "/images/caesar-salad.jpg",
    "grecque": "/images/greek-salad.jpg",
    "greek": "/images/greek-salad.jpg",
    "quinoa": "/images/quinoa-salad.jpg",
}

print("Image mapping configuration created successfully!")
print(json.dumps(category_images, indent=2))
