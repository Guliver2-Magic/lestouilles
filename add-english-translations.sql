-- Add English translations for all products

-- Sandwiches
UPDATE products SET 
  nameEn = 'The Vegetarian',
  descriptionEn = 'Vegetarian sandwich with grilled vegetables and hummus',
  nutritionalTipEn = 'Rich in fiber and plant-based protein'
WHERE name = 'Le Végétarien';

UPDATE products SET 
  nameEn = 'The Chicken',
  descriptionEn = 'Grilled chicken sandwich with lettuce and tomato',
  nutritionalTipEn = 'Excellent source of lean protein'
WHERE name = 'Le Poulet';

UPDATE products SET 
  nameEn = 'The Smoked Meat',
  descriptionEn = 'Montreal smoked meat sandwich with mustard',
  nutritionalTipEn = 'High in protein, consume in moderation'
WHERE name = 'Le Smoked Meat';

-- Salads
UPDATE products SET 
  nameEn = 'Caesar Salad',
  descriptionEn = 'Classic Caesar salad with grilled chicken',
  nutritionalTipEn = 'To reduce fat content, ask for Caesar dressing on the side and use only a small amount'
WHERE name = 'Salade César';

UPDATE products SET 
  nameEn = 'Greek Salad',
  descriptionEn = 'Greek salad with feta, olives and cucumber',
  nutritionalTipEn = 'Rich in antioxidants and healthy fats'
WHERE name = 'Salade Grecque';

-- Main Dishes
UPDATE products SET 
  nameEn = 'Lasagna',
  descriptionEn = 'Homemade lasagna with bolognese sauce',
  nutritionalTipEn = 'Complete and comforting dish'
WHERE name = 'Lasagne';

UPDATE products SET 
  nameEn = 'Roasted Chicken',
  descriptionEn = 'Roasted chicken with seasonal vegetables',
  nutritionalTipEn = 'Excellent source of lean protein'
WHERE name = 'Poulet Rôti';

-- Catering Bites
UPDATE products SET 
  nameEn = 'Assorted Canapés',
  descriptionEn = 'Assortment of varied canapés',
  nutritionalTipEn = 'Perfect for cocktails'
WHERE name = 'Canapés Assortis';

UPDATE products SET 
  nameEn = 'Mini Quiches',
  descriptionEn = 'Mini quiches lorraine',
  nutritionalTipEn = 'Rich in protein'
WHERE name = 'Mini Quiches';

UPDATE products SET 
  nameEn = 'Chicken Skewers',
  descriptionEn = 'Marinated chicken skewers',
  nutritionalTipEn = 'Prefer grilling or baking to minimize added fat and increase lean protein intake'
WHERE name = 'Brochettes de Poulet';

-- Catering Buffets
UPDATE products SET 
  nameEn = 'Cold Buffet',
  descriptionEn = 'Cold buffet with cold cuts and cheeses',
  nutritionalTipEn = 'Varied and balanced'
WHERE name = 'Buffet Froid';

UPDATE products SET 
  nameEn = 'Hot Buffet',
  descriptionEn = 'Hot buffet with braised dishes',
  nutritionalTipEn = 'Comforting and hearty'
WHERE name = 'Buffet Chaud';

-- Lunch Boxes
UPDATE products SET 
  nameEn = 'Classic Lunch Box',
  descriptionEn = 'Sandwich, salad, dessert and beverage',
  nutritionalTipEn = 'For better balance, opt for a whole grain sandwich, light dressing for the salad, and a fresh fruit dessert'
WHERE name = 'Boîte à Lunch Classique';

UPDATE products SET 
  nameEn = 'Vegetarian Lunch Box',
  descriptionEn = 'Veggie sandwich, salad, dessert and beverage',
  nutritionalTipEn = 'Healthy and tasty option'
WHERE name = 'Boîte à Lunch Végétarienne';

-- Desserts
UPDATE products SET 
  nameEn = 'Chocolate Brownie',
  descriptionEn = 'Fudgy dark chocolate brownie',
  nutritionalTipEn = 'Rich in dark chocolate'
WHERE name = 'Brownie au Chocolat';

UPDATE products SET 
  nameEn = 'Date Squares',
  descriptionEn = 'Traditional date squares',
  nutritionalTipEn = 'Natural source of fiber'
WHERE name = 'Carré aux Dattes';

UPDATE products SET 
  nameEn = 'Bailey''s Tiramisu',
  descriptionEn = 'Creamy Bailey''s tiramisu',
  nutritionalTipEn = 'Smooth and refined dessert'
WHERE name = 'Tiramisu au Bailey''s';

UPDATE products SET 
  nameEn = 'Banana Chocolate Bread',
  descriptionEn = 'Moist banana bread with chocolate chips',
  nutritionalTipEn = 'Good for morale'
WHERE name = 'Pain aux Bananes et Chocolat';

-- Beverages
UPDATE products SET 
  nameEn = 'Coffee',
  descriptionEn = 'Freshly brewed coffee',
  nutritionalTipEn = 'Natural stimulant'
WHERE name = 'Café';

UPDATE products SET 
  nameEn = 'Orange Juice',
  descriptionEn = 'Freshly squeezed orange juice',
  nutritionalTipEn = 'Rich in vitamin C'
WHERE name = 'Jus d''Orange';

UPDATE products SET 
  nameEn = 'Homemade Iced Tea',
  descriptionEn = 'Homemade lemon iced tea',
  nutritionalTipEn = 'Refreshing and thirst-quenching'
WHERE name = 'Thé Glacé Maison';
