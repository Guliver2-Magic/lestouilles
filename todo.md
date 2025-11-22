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
