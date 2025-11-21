import re

# Read the menu data file
with open('client/src/data/completeMenuData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Image mappings by category
category_images = {
    "Sandwichs": "/images/sandwich.jpg",
    "Salades": "/images/caesar-salad.jpg",  # Default, will be overridden for specific salads
    "Soupes": "/images/soup.jpg",
    "Plats Préparés": "/images/main-dish.jpg",
    "Plats Principaux": "/images/main-dish.jpg",
    "Viandes": "/images/meat.jpg",
    "Légumes": "/images/main-dish.jpg",
    "Bouchées": "/images/sandwich.jpg",
    "Desserts": "/images/dessert.jpg",
    "Buffets": "/images/main-dish.jpg",
    "Boîtes à Lunch": "/images/lunch-box.jpg",
    "Boissons": "/images/soup.jpg",
}

# Specific product mappings
specific_mappings = {
    "césar": "/images/caesar-salad.jpg",
    "caesar": "/images/caesar-salad.jpg",
    "grecque": "/images/greek-salad.jpg",
    "greek": "/images/greek-salad.jpg",
    "quinoa": "/images/quinoa-salad.jpg",
    "wrap": "/images/wrap.jpg",
}

# Update images based on category
for category, image_path in category_images.items():
    # Find all items in this category and update their image
    pattern = rf'(\{{[^}}]*category: "{re.escape(category)}"[^}}]*image: ")[^"]*(")'
    content = re.sub(pattern, rf'\1{image_path}\2', content)

# Update specific products
for keyword, image_path in specific_mappings.items():
    # Find items with this keyword in name and update image
    pattern = rf'(\{{[^}}]*name: \{{[^}}]*fr: "[^"]*{keyword}[^"]*"[^}}]*\}}[^}}]*image: ")[^"]*(")'
    content = re.sub(pattern, rf'\1{image_path}\2', content, flags=re.IGNORECASE)

# Write back
with open('client/src/data/completeMenuData.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print('✅ Menu images updated successfully!')
print(f'   - {len(category_images)} category mappings applied')
print(f'   - {len(specific_mappings)} specific product mappings applied')
