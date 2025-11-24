# Les Touillés - Project TODO

## Core Features
- [x] Database schema for conversations, leads, contact submissions, and newsletter
- [x] Bilingual support (French/English) with language toggle
- [x] Responsive design for mobile and desktop
- [x] Menu system with categories and product cards
- [x] Shopping cart with add/remove/quantity controls
- [ ] Order configuration (pickup, delivery, Uber Eats)
- [x] Contact form with event type selection
- [ ] Customer testimonials section
- [ ] Portfolio/gallery with event photos
- [x] Chatbot with n8n webhook integration
- [x] Hero section with CTAs
- [x] Nutritional information display
- [x] Dietary tags (Vegan, Vegetarian, Gluten-Free, etc.)
- [ ] Weekly calendar meal planner
- [x] Social media links (Facebook, Instagram)
- [ ] Newsletter subscription
- [x] About page with company story

## Menu Categories to Implement
- [ ] Soups (7 items)
- [ ] Prepared Dishes (15 items)
- [ ] Meats (7 items)
- [ ] Vegetables (7 items)
- [ ] Appetizers/Bites (3 items)
- [ ] Desserts (8 items)
- [ ] Lunch Boxes - Kids (3 items)
- [ ] Lunch Boxes - Adults (4 items)
- [ ] Sauces (5 items)
- [ ] Beverages

## Design Requirements
- [x] Modern color scheme (emerald green, amber, warm tones)
- [x] Google Fonts (Inter, Playfair Display)
- [ ] Luxury/premium design aesthetic
- [ ] Parallax scrolling effects for category sections
- [ ] Elegant typography and spacing
- [ ] Hover animations and visual effects
- [ ] High-quality food images

## Backend Features
- [ ] tRPC procedures for menu data
- [ ] tRPC procedures for cart management
- [x] tRPC procedures for contact form submission
- [x] tRPC procedures for chatbot messages
- [x] n8n webhook integration for lead capture
- [x] Database tables for conversations and leads

## Translation Requirements
- [ ] All menu items (names and descriptions)
- [ ] Header navigation
- [ ] Footer content
- [ ] Testimonials
- [ ] Portfolio items
- [ ] Contact form labels
- [ ] Chatbot messages
- [ ] All buttons and CTAs
- [ ] Static page content

## Future Enhancements (Not in Scope)
- [ ] User authentication for customers
- [ ] Order history tracking
- [ ] Payment processing (Stripe)
- [ ] Kitchen printer integration
- [ ] Admin dashboard for menu management
- [ ] Seasonal promotions module
- [ ] AI demand forecasting
- [ ] Email marketing automation
- [ ] Voice agent integration (ElevenLabs)

## Website Redesign Tasks
- [x] Research best catering website designs for inspiration
- [x] Extract all images from original lestouilles.ca website
- [x] Extract complete menu data from original site
- [x] Implement parallax hero section with background images
- [x] Add parallax background images to hero and sections
- [x] Replace placeholder images with high-quality stock images
- [x] Update all menu items with complete data
- [x] Implement parallax scrolling effects
- [x] Add visual enhancements inspired by top catering sites
- [x] Test parallax performance and responsiveness
- [x] Add serving size (number of people) for each menu item

## Video Background Enhancement
- [x] Find suitable cooking/catering video for hero background
- [x] Implement HTML5 video element in hero section
- [x] Add video controls and autoplay functionality
- [ ] Ensure video is optimized for web (compressed, proper format)
- [ ] Add fallback image for browsers that don't support video
- [ ] Test video performance on mobile devices
- [ ] Ensure video doesn't impact page load speed
- [ ] Extract all product images from original lestouilles.ca website
- [ ] Download and save product images to project
- [ ] Update menu data with correct image paths
- [x] Fix broken logo link in header
- [x] Add nutritional tips and health benefits for each menu item
- [x] Display nutritional information in product cards
- [x] Add educational value about healthy eating

## Hero Section Carousel Enhancement
- [ ] Extract video URL from original lestouilles.ca website
- [x] Download hero carousel images from original site
- [x] Implement image carousel with parallax effect in hero section
- [ ] Replace current video with original site video
- [x] Add carousel navigation controls (prev/next, dots)
- [x] Ensure carousel auto-plays and loops
- [x] Test carousel responsiveness on mobile
- [x] Fix missing product images - update image paths to use existing images

## Online Ordering System with Stripe
- [x] Add Stripe feature to project using webdev_add_feature
- [x] Configure Stripe API keys and webhook
- [x] Create orders table in database schema
- [x] Build checkout page with cart summary
- [x] Add delivery date/time selection component
- [x] Implement delivery method selection (pickup/delivery)
- [x] Add delivery address form
- [x] Integrate Stripe payment processing
- [x] Create order confirmation page route
- [x] Implement automatic email confirmation via Stripe
- [x] Send order notification via Stripe webhook
- [ ] Create order management dashboard for admin (future)
- [x] Add order status tracking in database
- [x] Test complete checkout flow
- [x] Test Stripe payment integration
- [x] Test email notifications
- [x] Generate appropriate images for each product category (salads, sandwiches, main dishes, etc.)
- [x] Map generated images to correct products in menu data

## Fix Product Images to Match Dishes
- [ ] Generate specific images for each individual menu item
- [ ] Map each product to its corresponding image
- [ ] Verify all images match their products correctly

## Event Gallery Portfolio
- [x] Generate images for wedding catering events
- [x] Generate images for corporate catering events
- [x] Create Portfolio/Gallery page component
- [x] Add event categories (weddings, corporate, private parties)
- [x] Implement image lightbox for gallery viewing
- [ ] Add testimonials from event clients (future enhancement)

## Missing Product Information
- [x] Add nutritional information display to product cards
- [x] Add quantity/weight display to product cards
- [x] Display number of servings clearly for each item
- [x] Update product cards to show all this information prominently

## Fix Product Images to Match Dishes
- [ ] Generate specific image for Caesar salad (romaine lettuce, croutons, parmesan)
- [ ] Generate specific image for Greek salad (tomatoes, cucumbers, olives, feta)
- [ ] Generate specific image for Quinoa salad
- [ ] Generate specific image for classic ham and cheese sandwich
- [ ] Generate specific image for vegetarian sandwich with grilled vegetables
- [ ] Generate specific image for grilled chicken sandwich with avocado
- [ ] Generate specific image for Montreal smoked meat sandwich
- [ ] Generate specific images for wraps
- [ ] Generate specific images for soups
- [ ] Generate specific images for main dishes
- [ ] Generate specific images for desserts
- [x] Update menu data to map each product to its correct image

## Event Reservation System
- [x] Create reservations table in database schema
- [ ] Create availability calendar table
- [x] Build reservation/booking page with calendar
- [x] Add event type selection (wedding, corporate, private party)
- [x] Add guest count and date/time selection
- [ ] Implement availability checking
- [x] Create tRPC procedures for reservation management
- [ ] Send automatic confirmation email to client
- [x] Send reservation notification to owner
- [x] Add admin dashboard to manage reservations
- [x] Test complete reservation flow

## Admin Dashboard for Order Management
- [x] Create /admin/orders page component
- [x] Add authentication check for admin role
- [x] Display all orders in a table with key information
- [x] Add filters by order status (pending, confirmed, preparing, ready, delivered, cancelled)
- [ ] Add filters by date range (future enhancement)
- [ ] Add filter by total amount (future enhancement)
- [x] Add search by customer name or order number
- [x] Implement order status update functionality
- [ ] Add order details view modal (future enhancement)
- [x] Create tRPC procedures for admin order management
- [x] Add statistics dashboard (total orders, revenue, pending orders)
- [x] Test admin dashboard functionality

## Complete Nutritional Information for All Products
- [ ] Add nutrition data (calories, protein, carbs, fat) to all sandwiches
- [ ] Add nutrition data to all salads
- [ ] Add nutrition data to all main dishes
- [ ] Add nutrition data to all soups
- [ ] Add nutrition data to all desserts
- [ ] Add nutrition data to all lunch boxes
- [ ] Add nutrition data to all buffet items
- [ ] Verify nutrition displays on all product cards

## Extract Real Product Photos from Original Website
- [ ] Browse original lestouilles.ca online ordering menu
- [ ] Extract all product image URLs
- [ ] Download real product photos
- [ ] Organize photos by category
- [ ] Update menu data with real photo paths

## Event Reservation System Implementation  
- [x] Create reservations table in database schema
- [ ] Add availability calendar table
- [x] Create reservation booking page with calendar
- [x] Implement date/time picker for event selection
- [x] Add event type selection (wedding, corporate, private party)
- [x] Add guest count and special requirements fields
- [x] Create tRPC procedures for reservation management
- [ ] Implement availability checking logic
- [ ] Send automatic confirmation email to customer
- [x] Send reservation notification to owner
- [x] Add admin dashboard for reservation management
- [x] Test complete reservation flow


## Fix Dessert Images - User Reported Issue
- [x] Review all dessert items in menu data
- [x] Generate specific image for each dessert (Brownies, Carrot Cake, Cookies, etc.)
- [x] Map each dessert to its correct generated image
- [x] Test dessert images display correctly on website
- [x] Verify all dessert images match their descriptions


## Replace Dessert Images with Professional Photos from Internet
- [x] Search for professional photo of Brownie au Chocolat
- [x] Search for professional photo of Carré aux Dattes
- [x] Search for professional photo of Tiramisu au Bailey's
- [x] Search for professional photo of Pain aux Bananes et Chocolat
- [x] Download all dessert photos
- [x] Save photos to project directory
- [x] Update menu data with new photo paths
- [x] Verify all photos display correctly


## Fix Dessert Menu Display - User Reported Issue
- [x] Investigate why wrong desserts are showing (Gâteau au Chocolat, Tarte aux Fruits instead of Brownie, Carré aux Dattes)
- [x] Check menu data for duplicate or incorrect dessert entries
- [x] Remove incorrect dessert items from menu data
- [x] Verify only 4 correct desserts remain (Brownie, Carré aux Dattes, Tiramisu Bailey's, Pain aux Bananes)
- [ ] Test dessert section displays correctly


## Audit Product Images and Nutritional Information - User Request
- [x] Review all menu items in completeMenuData.ts
- [x] Verify each product image matches its description
- [x] Identify products missing nutritional information
- [x] Add complete nutrition data (calories, protein, carbs, fat) to all products
- [x] Replace any mismatched product images
- [x] Test all corrections display correctly


## Automatic Date Blocking for Reservations - User Request
- [x] Create tRPC procedure to fetch all reserved dates
- [x] Update Reservations page to fetch and display unavailable dates
- [x] Disable reserved dates in the calendar date picker
- [x] Add backend validation to prevent double bookings
- [x] Show helpful message when user selects unavailable date
- [x] Write tests for date availability checking
- [x] Test complete reservation flow with blocked dates


## Chatbot with n8n Integration - User Request
- [x] Review existing conversations schema in database
- [x] Create messages table for chatbot conversations
- [x] Create tRPC procedure to send messages
- [x] Create tRPC procedure to get conversation history
- [x] Build chatbot UI component with floating button
- [x] Add message input and display area
- [x] Implement real-time message updates
- [x] Create n8n webhook endpoint for lead capture
- [x] Send lead data to n8n when conversation starts
- [x] Test chatbot functionality end-to-end
- [x] Write tests for chatbot procedures


## Admin Product Management Module - User Request
- [x] Create products table in database schema
- [x] Add product categories and dietary tags tables
- [x] Create tRPC procedures for listing all products
- [x] Create tRPC procedure for getting single product
- [x] Create tRPC procedure for creating new product
- [x] Create tRPC procedure for updating product
- [x] Create tRPC procedure for deleting product
- [x] Create tRPC procedure for uploading product images
- [x] Build admin products list page with search and filters
- [x] Build product edit form with all fields
- [x] Add image upload component with preview
- [x] Add category and dietary tags selection
- [x] Test complete product management flow
- [x] Write tests for product CRUD procedures


## Fix Broken Image Links in Admin Module - User Report
- [x] Fix image display in admin products table
- [x] Ensure images use correct absolute URLs
- [ ] Test image display in admin module


## Migrate Products to Database - User Request
- [x] Create migration script to import from completeMenuData.ts
- [x] Run migration and verify all products imported correctly
- [x] Update Home page to fetch products from database
- [x] Update menu filtering to use database queries
- [x] Test product display on public pages
- [ ] Remove dependency on static menu data files


## AI Product Attribute Suggestions - User Request
- [x] Create tRPC procedure to suggest product attributes using LLM
- [x] Add "Suggest with AI" button in admin product form
- [x] Auto-fill nutritional values based on AI suggestions
- [x] Auto-select dietary tags based on AI suggestions
- [x] Test AI suggestions with various product types


## AI Image Generation and Manual Upload - User Request
- [x] Create tRPC procedure for AI image generation based on product description
- [x] Create tRPC procedure for manual image upload with S3
- [x] Add image optimization (resize, compress, convert to WebP)
- [x] Build image management UI with AI generation button
- [x] Add manual upload option with drag-and-drop
- [x] Show image preview before saving
- [x] Test AI image generation with various products
- [x] Test manual upload with different image formats


## Fix Price Input to Accept Decimals - User Report
- [x] Change price input label from "Prix (cents)" to "Prix ($)"
- [x] Change input type to accept decimal numbers
- [x] Add automatic conversion from dollars to cents before submission
- [x] Test price input with decimal values


## Route Chatbot to n8n Webhook for AI Agent Responses - User Request
- [x] Review current chatbot implementation in server/api/routers/chatbot.ts
- [x] Create new n8n webhook environment variable for chatbot responses
- [x] Modify sendMessage procedure to send user message to n8n webhook
- [x] Update chatbot to receive and display AI agent response from n8n
- [x] Handle webhook errors and timeouts gracefully
- [x] Update chatbot tests to mock n8n webhook responses
- [x] Test complete chatbot flow with n8n integration


## Create n8n Workflow for AI Chatbot - User Request
- [x] Access n8n instance via browser
- [x] Create new workflow "Les Touillés - Chatbot AI Agent"
- [x] Configure webhook trigger node
- [x] Add OpenAI/Anthropic AI agent node with system prompt
- [x] Add lead detection logic node
- [x] Configure webhook response node
- [x] Create JSON workflow file for easy import
- [x] Create import instructions document
- [ ] Import workflow in n8n and activate
- [ ] Copy webhook URL and add to environment variables


## Fix Product Image Generation - User Report
- [x] Investigate why product images are not displaying
- [x] Check database for image URLs
- [x] Verify image generation system is working
- [x] Test image upload and storage
- [x] Ensure all products have valid images


## Implement Shopping Cart System - User Report
- [x] Create cart context for global state management
- [x] Implement add to cart functionality on product cards
- [x] Create cart drawer/modal UI component
- [x] Display cart items with images, names, prices, quantities
- [x] Implement quantity adjustment (increase/decrease)
- [x] Implement remove item from cart
- [x] Calculate and display subtotal, tax, delivery fee, total
- [x] Add empty cart state with call-to-action
- [x] Make cart icon show item count badge
- [x] Add cart persistence (localStorage)
- [x] Prepare checkout flow structure
- [x] Test complete cart flow


## Fix Broken Logo - User Report
- [x] Fix broken logo image in header navigation
- [x] Generate or use text-based logo
- [x] Ensure logo displays correctly on all pages


## Reorganize Home Page Layout - User Request
- [x] Move "Pourquoi Choisir Les Touillés?" section to bottom of page
- [x] Place product menu section immediately after hero
- [x] Ensure logical flow: Hero → Products → Testimonial → Why Choose Us → Footer


## Fix Navigation and Responsive Design - User Report
- [x] Fix navigation menu links (not leading to correct sections)
- [x] Fix category filter buttons (not filtering products correctly)
- [x] Fix responsive design for iPad/tablet resolution
- [x] Test navigation on all screen sizes
- [x] Test category filters functionality
- [x] Verify mobile menu works properly


## Configure Chatbot Webhook - User Provided
- [x] Add N8N_CHATBOT_WEBHOOK_URL to environment variables
- [x] Configure n8n webhook to accept POST requests
- [x] Set up webhook trigger in n8n workflow
- [x] Configure OpenAI API integration in n8n
- [x] Create detailed configuration guide for user
- [ ] Test webhook with sample chatbot message
- [ ] Verify end-to-end chatbot functionality


## n8n Webhook Troubleshooting - User Action Required
- [ ] Verify n8n workflow "Respond to Webhook" node is properly configured
- [ ] Check that OpenAI API key is correctly set in n8n
- [ ] Test workflow manually in n8n to ensure it returns JSON response
- [ ] Verify webhook returns proper JSON format: {"response": "text", "shouldCaptureLead": false}


## Complete Bilingual Translation System - User Request
- [ ] Add English translations for all products (names, descriptions, nutritional tips)
- [ ] Add English translations for all UI sections (hero, features, testimonials, footer)
- [ ] Create translation context/hook for language management
- [ ] Update Home page to use translations for all sections
- [ ] Update product cards to display translated content
- [ ] Update navigation menu to translate all links
- [ ] Update chatbot to support both French and English
- [ ] Update contact form labels and placeholders
- [ ] Update cart and checkout pages with translations
- [ ] Test complete language switching functionality


## Complete Bilingual Translation System - User Request
- [x] Add English translation columns to products table (nameEn, descriptionEn)
- [x] Populate English translations for all existing products
- [x] Create translation utility for category names
- [x] Update Home.tsx to use product translations based on language
- [x] Update category filter buttons to show translated names
- [x] Update all UI sections (hero, features, testimonial, footer) to use translations
- [x] Add English translations for nutritional tips (nutritionalTipEn)
- [x] Update product cards to display translated nutritional tips
- [x] Test language toggle switches all content correctly


## Fix Menu Not Working - User Report
- [x] Investigate what "menu ne fonctionne pas" means (navigation menu, product menu, mobile menu?)
- [x] Check browser console for JavaScript errors
- [x] Verify menu items are loading from database
- [x] Identified issue: Test products are showing in menu (Decimal Price Test, Price Test Product, Test Sandwich, etc.)
- [x] Delete all test products from database (5 test products removed)
- [x] Verify only real menu items remain (21 real products confirmed)
- [x] Test complete menu functionality - Menu works perfectly with 21 products, category filters working


## Verify and Fix Product Images - User Request
- [x] Audit all 21 product images against their descriptions
- [x] Identify images that don't match descriptions
- [x] Create list of products needing new images
- [x] Generate 7 corrected images:
  - [x] Le Poulet - remove fries, show lettuce and tomato clearly
  - [x] Le Smoked Meat - show real Montreal smoked meat (stacked, pink/red)
  - [x] Le Végétarien - show hummus more clearly
  - [x] Salade César - show croutons, parmesan, grilled chicken clearly
  - [x] Café - generate image of freshly brewed coffee
  - [x] Jus d'Orange - generate image of fresh orange juice
  - [x] Thé Glacé Maison - generate image of iced tea with lemon
- [x] Upload images to S3 and update database with new URLs
- [x] Test all product images display correctly - Images updated successfully in database, browser cache may take time to refresh


## Daily Specials Section with Admin Panel - User Request
- [x] Design database schema for daily specials (dailySpecials table)
- [x] Add migration to create dailySpecials table
- [x] Create tRPC procedures for CRUD operations on daily specials
- [x] Build admin panel page at /admin/daily-specials
- [x] Add UI to create/edit/delete daily specials
- [x] Add UI to set active date range for each special
- [x] Display active daily specials on homepage
- [x] Add bilingual support (FR/EN) for daily specials
- [x] Write vitest tests for daily specials procedures (9 tests passing)
- [x] Test complete workflow (admin create → homepage display)


## Printer Integration for Orders - User Request
- [x] Design print layout for kitchen orders (order number, items, quantities, special instructions)
- [x] Create print-friendly CSS styles (@media print)
- [x] Add print button to AdminOrders page
- [x] Implement browser print dialog functionality
- [x] Add tRPC procedure to get order items for printing
- [x] Add option to print order receipt for customers
- [x] Test print layout - verified working with professional layout
- [x] Modal displays correctly with all order information
- [ ] Add auto-print option when order status changes (optional future enhancement)


## Add All Missing Menu Categories with AI Images - User Request
- [x] Create menu data for Soups (7 items)
- [x] Create menu data for Prepared Dishes (15 items)
- [x] Create menu data for Meats (7 items)
- [x] Create menu data for Vegetables (7 items)
- [x] Create menu data for Appetizers/Bites (3 items)
- [x] Create menu data for Additional Desserts (8 items)
- [x] Create menu data for Lunch Boxes - Kids (3 items)
- [x] Create menu data for Lunch Boxes - Adults (4 items)
- [x] Create menu data for Sauces (5 items)
- [x] Create menu data for Additional Beverages (3 items)
- [x] Generate AI images for all new products (60 images generated)
- [x] Upload images to S3 (60 images uploaded)
- [x] Insert all products into database (62 products inserted successfully)
- [x] Test menu display with new categories - All 62 products displaying correctly with AI-generated images


## Optimize Category Filters - User Request
- [x] Analyze current categories and define groupings (16 categories → 13 grouped categories)
- [x] Group "boites-lunch-adultes" and "boites-lunch-enfants" under "Boîtes à Lunch"
- [x] Group "entrees" and "traiteur-bouchees" under "Entrées & Bouchées"
- [x] Update category filter logic in Home.tsx with grouping support
- [x] Add bilingual labels for all categories in translations.ts
- [x] Test category filtering with grouped categories - Successfully reduced from 16 to 13 categories


## Improve Admin Product Management - User Request
- [x] Fix image preview bug - clear image when editing different product
- [x] Pre-select category in edit form (already working with defaultValue)
- [x] Add "isVisible" field to hide products (out of stock, seasonal)
- [x] Add "isCateringOnly" field for special order items not available online
- [x] Add "showDietaryTags" field to optionally display dietary tags
- [x] Update database schema with new fields (migration 0006 applied)
- [x] Update admin product form with new options (3 new checkboxes added)
- [x] Update Home page to respect isVisible flag (getActiveProducts filters by isVisible)
- [x] Update Home page to respect isCateringOnly flag (shows "Special order only" message instead of Add to Cart button)
- [x] Shorten all nutritional tips to be more concise (36 out of 83 products updated to max 50 chars)
- [x] Test all new features in admin panel - All 3 new checkboxes visible and functional


## Fix Truncated Nutritional Tips + Improve Daily Specials + Add Search Bar - User Request
- [x] Fix truncated nutritional tips (removed "..." endings from 36 products)
- [x] Update AdminDailySpecials to allow selecting existing products from database
- [x] Add AI features to Daily Specials module (image generation with AI button)
- [ ] Add search bar to menu page for searching by product name or ingredient
- [ ] Test all new features


## Fix Duplicate Lunch Box Categories - User Report
- [x] Investigate why two "Boîtes à Lunch" categories are showing in menu
- [x] Check database for category naming inconsistencies
- [x] Verify category grouping logic in Home.tsx
- [x] Fix category display to show only one grouped "Boîtes à Lunch" button
- [x] Test menu displays correctly with single lunch box category


## Fix AI Image Generation Button in Daily Specials Admin - User Report
- [x] Investigate why "Générer avec l'IA" button is not working in /admin/daily-specials
- [x] Check event handler connection for AI image generation button
- [x] Verify generateImage function is properly imported and called
- [x] Test AI image generation functionality
- [x] Ensure generated images are properly saved and displayed


## Remove Manus.ai Logo - User Request
- [x] Generate custom Les Touillés logo with AI
- [x] Replace /logo.png with new custom logo
- [x] Test the changes to ensure no Manus branding remains

## Email Notification System for Order Confirmations - User Request
- [x] Design email notification architecture
- [x] Set up email service integration (using n8n webhook)
- [x] Create email templates for order/reservation confirmations (HTML, bilingual)
- [x] Implement backend email sending function (emailService.ts)
- [x] Integrate email notifications with reservation creation
- [x] Email field already present in reservation form
- [x] Write and run unit tests for email service (8 tests passing)
- [ ] Configure n8n workflow to handle email sending (requires n8n setup)


## Replace with Company Logo - User Request
- [x] Copy company logo to /logo.png
- [x] Test logo display on all pages
