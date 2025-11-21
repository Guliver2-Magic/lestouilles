import re

# Read the file
with open('client/src/data/completeMenuData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Nutritional tips by category
tips_by_category = {
    "Sandwichs": {
        "fr": "Riche en protéines et fibres. Parfait pour un déjeuner équilibré qui vous garde rassasié.",
        "en": "Rich in protein and fiber. Perfect for a balanced lunch that keeps you satisfied."
    },
    "Salades": {
        "fr": "Excellente source de vitamines et minéraux. Faible en calories, idéal pour une alimentation saine.",
        "en": "Excellent source of vitamins and minerals. Low in calories, ideal for healthy eating."
    },
    "Soupes": {
        "fr": "Réconfortante et nutritive. Aide à l'hydratation et favorise la digestion.",
        "en": "Comforting and nutritious. Helps with hydration and promotes digestion."
    },
    "Plats Préparés": {
        "fr": "Repas complet et équilibré. Contient tous les macronutriments essentiels pour votre énergie.",
        "en": "Complete and balanced meal. Contains all essential macronutrients for your energy."
    },
    "Viandes": {
        "fr": "Excellente source de protéines de haute qualité. Riche en fer et vitamines B.",
        "en": "Excellent source of high-quality protein. Rich in iron and B vitamins."
    },
    "Légumes": {
        "fr": "Riche en fibres et antioxydants. Favorise une bonne santé digestive et cardiovasculaire.",
        "en": "Rich in fiber and antioxidants. Promotes good digestive and cardiovascular health."
    },
    "Bouchées": {
        "fr": "Portions contrôlées parfaites pour les événements. Équilibre entre saveur et nutrition.",
        "en": "Perfect portion-controlled for events. Balance between flavor and nutrition."
    },
    "Desserts": {
        "fr": "À déguster avec modération. Source de plaisir et d'énergie rapide.",
        "en": "Enjoy in moderation. Source of pleasure and quick energy."
    },
    "Buffets": {
        "fr": "Variété équilibrée pour tous les goûts. Permet de composer un repas personnalisé et nutritif.",
        "en": "Balanced variety for all tastes. Allows you to compose a personalized and nutritious meal."
    },
    "Boîtes à Lunch": {
        "fr": "Repas complet et pratique. Portions calculées pour un apport nutritionnel optimal.",
        "en": "Complete and convenient meal. Portions calculated for optimal nutritional intake."
    }
}

# Process each category
for category, tips in tips_by_category.items():
    # Find all items in this category
    pattern = rf'(\{{[^}}]*category: "{re.escape(category)}"[^}}]*)\}}'
    
    def add_tips(match):
        item_content = match.group(1)
        # Check if nutritionalTips already exists
        if 'nutritionalTips' not in item_content:
            # Add nutritional tips before the closing brace
            tips_str = f',\n    nutritionalTips: {{ \n      fr: "{tips["fr"]}", \n      en: "{tips["en"]}" \n    }}'
            return item_content + tips_str + '}'
        return match.group(0)
    
    content = re.sub(pattern, add_tips, content, flags=re.DOTALL)

# Write back
with open('client/src/data/completeMenuData.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print('✅ Nutritional tips added to all menu items!')
