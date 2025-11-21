import re

# Read the file
with open('client/src/data/completeMenuData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Available images
available_images = [
    '/images/menu/WgESo0WjYDzG.jpg',
    '/images/menu/6BnExjt67ce6.jpg',
    '/images/menu/WU23K8Mz4HXE.jpg',
    '/images/menu/xGkxjMaoLLlM.jpg',
    '/images/menu/X5oLMAlBg8Q1.jpg',
    '/images/menu/TOfmOflBRqDW.jpg',
    '/images/menu/JMDUTzf6D48y.jpg',
]

# Replace all image paths with available images in rotation
image_index = 0
def replace_image(match):
    global image_index
    img = available_images[image_index % len(available_images)]
    image_index += 1
    return f'image: "{img}"'

content = re.sub(r'image: "[^"]*"', replace_image, content)

# Write back
with open('client/src/data/completeMenuData.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print(f'✅ Updated all menu items with {image_index} images!')
