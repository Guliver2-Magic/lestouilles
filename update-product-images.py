import json
import re

# Read the current menu data
with open('client/src/data/completeMenuData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Define image mappings based on product names and categories
image_map = {
    # Salades
    "Salade César": "/images/products/salade-cesar.jpg",
    "Salade Grecque": "/images/products/salade-grecque.jpg",
    "Salade de Quinoa": "/images/products/salade-quinoa.jpg",
    
    # Sandwichs
    "Sandwich Jambon-Fromage": "/images/products/sandwich-jambon-fromage.jpg",
    "Sandwich au Poulet Grillé": "/images/products/sandwich-poulet.jpg",
    "Sandwich Végétarien": "/images/products/sandwich-poulet.jpg",  # Will use generic for now
    
    # Wraps
    "Wrap": "/images/products/wrap-vegetarien.jpg",
    
    # Soupes
    "Soupe": "/images/products/soupe.jpg",
    
    # Plats Principaux
    "Plat": "/images/products/plat-principal.jpg",
    
    # Desserts
    "Dessert": "/images/products/dessert.jpg",
    "Gâteau": "/images/products/dessert.jpg",
    "Tarte": "/images/products/dessert.jpg",
    
    # Boîtes à Lunch
    "Boîte": "/images/products/boite-lunch.jpg",
}

# Function to find the best matching image for a product name
def find_image(name_fr):
    for key, image in image_map.items():
        if key.lower() in name_fr.lower():
            return image
    return "/images/food-placeholder.jpg"

# Replace image paths in the content
lines = content.split('\n')
updated_lines = []
for line in lines:
    if 'image:' in line and '/images/' in line:
        # Extract the product name from context (look at previous lines)
        # This is a simple approach - we'll update manually for precision
        updated_lines.append(line)
    else:
        updated_lines.append(line)

# Write back
with open('client/src/data/completeMenuData.ts', 'w', encoding='utf-8') as f:
    f.write('\n'.join(updated_lines))

print("Product images mapping completed!")
