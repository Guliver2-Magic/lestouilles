# Les Touillés - Standalone Deployment Guide

This guide explains how to deploy Les Touillés on your own server **without Manus platform dependencies**.

## 🎯 What Changed

Your website has been modified to work independently:

### ✅ Replaced Manus Dependencies

| Feature | Before | After |
|---------|--------|-------|
| **Image Generation** | Manus Forge API | OpenAI DALL-E 3 |
| **User Authentication** | Manus OAuth | Local email/password |
| **Chatbot** | n8n webhook | ✅ Still works (your n8n) |
| **Payments** | Stripe | ✅ Still works |
| **Email Notifications** | n8n webhook | ✅ Still works (your n8n) |

---

## 📋 Prerequisites

Before deploying, you need:

1. **Ubuntu Server** (20.04 or newer)
2. **Docker & Docker Compose** installed (see installation below)
3. **OpenAI API Key** (for image generation)
   - Sign up at: https://platform.openai.com/signup
   - Get API key: https://platform.openai.com/api-keys
   - Cost: ~$0.04 per image generated
4. **Your existing n8n instance** (already configured)
5. **Stripe account** (for payments)

**✅ What's INCLUDED in Docker (no installation needed):**
- MySQL database server
- Node.js runtime
- All application dependencies

**❌ What you DON'T need to install:**
- MySQL Server (`apt install mysql-server`) - NOT needed!
- Node.js/npm/pnpm - NOT needed!
- Any application dependencies - NOT needed!

### Installing Docker (if not already installed)

```bash
# Install Docker (one command)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to docker group (avoid sudo)
sudo usermod -aG docker $USER

# Reload group membership
newgrp docker

# Verify installation
docker --version
docker-compose --version
```

---

## 🚀 Quick Start

### Step 1: Transfer Files to Server

```bash
# On your local machine, create a zip
zip -r les-touilles.zip les-touilles/

# Transfer to server
scp les-touilles.zip user@your-server-ip:/home/user/

# On server, extract
ssh user@your-server-ip
unzip les-touilles.zip
cd les-touilles
```

### Step 2: Configure Environment Variables

**Create a `.env` file with your configuration:**

```bash
cd les-touilles
nano .env
```

**Paste this configuration (update the values):**

```bash
# Database (used by MySQL container)
MYSQL_ROOT_PASSWORD=YourSecureRootPassword123!
MYSQL_DATABASE=lestouilles
MYSQL_USER=lestouilles_user
MYSQL_PASSWORD=YourSecureUserPassword456!

# Application (connects to MySQL container)
DATABASE_URL=mysql://lestouilles_user:YourSecureUserPassword456!@db:3306/lestouilles
NODE_ENV=production
JWT_SECRET=$(openssl rand -base64 32)

# OpenAI (for image generation)
OPENAI_API_KEY=sk-your_openai_api_key_here

# n8n Chatbot (your existing instance)
N8N_CHATBOT_WEBHOOK_URL=https://vps-e53ac5fb.vps.ovh.ca/webhook/chatbot-response

# Stripe
STRIPE_SECRET_KEY=sk_live_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key

# Branding
VITE_APP_TITLE=Les Touillés - Catering Service
VITE_APP_LOGO=/logo.png
```

**Generate secure secrets:**
```bash
# For JWT_SECRET
openssl rand -base64 32

# For database passwords
openssl rand -base64 24
```

### Step 3: Start Docker Containers

**This will start both MySQL and your application:**

```bash
# Start all services in background
docker-compose up -d

# Wait for MySQL to be ready (15-20 seconds)
sleep 20

# Check that both containers are running
docker-compose ps
# Should show: les-touilles-db-1 (mysql) and les-touilles-app-1 (node)

# View logs if needed
docker-compose logs -f
```

**What just happened:**
- ✅ Docker downloaded MySQL image
- ✅ Created MySQL container with your database
- ✅ Built your application image
- ✅ Started your application container
- ✅ Connected app to MySQL via Docker network



### Step 4: Run Database Migration

**⚠️ IMPORTANT:** Run this AFTER Docker is started!

**The migration runs INSIDE the MySQL container:**

```bash
# Option A: Run migration from file
docker-compose exec -T db mysql -u lestouilles_user -p"YourSecureUserPassword456!" lestouilles < MIGRATION_LOCAL_AUTH.sql

# Option B: Interactive migration
docker-compose exec db mysql -u lestouilles_user -p lestouilles
# Enter password when prompted
# Then paste the SQL commands from MIGRATION_LOCAL_AUTH.sql

# Option C: Copy file into container first
docker cp MIGRATION_LOCAL_AUTH.sql $(docker-compose ps -q db):/tmp/migration.sql
docker-compose exec db mysql -u lestouilles_user -p lestouilles < /tmp/migration.sql
```

**What this migration does:**
- Removes the `openId` column (OAuth identifier)
- Adds `password`, `isVerified`, `verificationToken`, `resetToken`, `resetTokenExpiry` columns
- Makes `email` unique and required
- Updates schema for local authentication

**Verify migration succeeded:**
```bash
docker-compose exec db mysql -u lestouilles_user -p lestouilles -e "DESCRIBE users;"
# Should show columns: id, email, password, name, role, isVerified, etc.
```

### Step 5: Create Your Admin Account

After deployment, you need to create an admin user:

**Option A: Via SQL**
```sql
-- Generate password hash first (use bcrypt online tool or Node.js)
-- Example for password "Admin123!":
INSERT INTO users (email, password, name, role, isVerified, loginMethod)
VALUES (
  'admin@lestouilles.ca',
  '$2a$10$your_bcrypt_hash_here',
  'Administrator',
  'admin',
  TRUE,
  'local'
);
```

**Option B: Via Registration Page**
1. Go to `http://your-server-ip:3000/register`
2. Create an account
3. Manually update the role in database:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

---

## 🔐 Authentication System

### How It Works

1. **Registration** (`/register`):
   - User provides name, email, password
   - Password is hashed with bcrypt (10 rounds)
   - JWT token is generated and stored in cookie
   - User is automatically logged in

2. **Login** (`/login`):
   - User provides email and password
   - Password is verified against hash
   - JWT token is generated (7-day expiry)
   - Token stored in HTTP-only cookie

3. **Protected Routes**:
   - JWT token is verified on each request
   - User object is attached to request context
   - Admin routes check for `role === 'admin'`

### Password Requirements

- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number

---

## 🖼️ Image Generation

### OpenAI DALL-E 3

The admin panel uses OpenAI's DALL-E 3 for generating product images.

**Configuration:**
```bash
OPENAI_API_KEY=sk-your_key_here
```

**Usage:**
- Go to Admin → Products
- Click "Generate Image with AI"
- Enter a description
- Image is generated and saved to S3

**Costs:**
- DALL-E 3: ~$0.04 per image (1024x1024, standard quality)
- Images are cached in S3, so you only pay once per image

**Alternative:** If you don't want to use OpenAI, you can:
1. Disable the "Generate Image" button in admin
2. Upload images manually
3. Use a different AI service (modify `server/_core/imageGeneration.ts`)

---

## 🤖 Chatbot (n8n)

Your chatbot continues to work with your existing n8n instance!

**Configuration:**
```bash
N8N_CHATBOT_WEBHOOK_URL=https://vps-e53ac5fb.vps.ovh.ca/webhook/chatbot-response
```

**No changes needed** - the chatbot integration remains the same.

---

## 💳 Payments (Stripe)

Stripe integration works independently.

**Configuration:**
```bash
STRIPE_SECRET_KEY=sk_live_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_key
```

**Setup:**
1. Get keys from https://dashboard.stripe.com/apikeys
2. Configure webhook endpoint: `https://your-domain.com/api/stripe/webhook`
3. Select events: `checkout.session.completed`, `payment_intent.succeeded`

---

## 📊 Monitoring & Maintenance

### View Logs

```bash
# All services
docker-compose logs -f

# Application only
docker-compose logs -f app

# Database only
docker-compose logs -f db
```

### Backup Database

```bash
# Run backup script
./backup.sh

# Setup automatic daily backups
crontab -e
# Add: 0 2 * * * cd /home/user/les-touilles && ./backup.sh
```

### Update Application

```bash
# Pull latest changes (if using Git)
git pull

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

## 🔧 Troubleshooting

### Authentication Not Working

1. Check JWT_SECRET is set:
```bash
docker-compose exec app printenv | grep JWT_SECRET
```

2. Check database migration:
```sql
DESCRIBE users;
-- Should show: email, password, isVerified, etc.
```

3. Check cookies are being set:
- Open browser DevTools → Application → Cookies
- Should see cookie named `manus_session`

### Image Generation Fails

1. Verify OpenAI API key:
```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

2. Check logs:
```bash
docker-compose logs app | grep "Image generation"
```

3. Common issues:
- Invalid API key
- Insufficient OpenAI credits
- Rate limit exceeded

### Database Connection Error

1. Check DATABASE_URL format:
```bash
mysql://user:password@host:port/database
```

2. Test connection:
```bash
docker-compose exec app node -e "
  const mysql = require('mysql2/promise');
  mysql.createConnection(process.env.DATABASE_URL)
    .then(() => console.log('Connected!'))
    .catch(err => console.error('Error:', err));
"
```

---

## 🔒 Security Checklist

- [ ] Change default admin password
- [ ] Use strong database passwords
- [ ] Generate secure JWT_SECRET (32+ characters)
- [ ] Enable firewall (ports 80, 443, 22 only)
- [ ] Setup SSL/HTTPS (Let's Encrypt or Cloudflare)
- [ ] Regular database backups
- [ ] Keep Docker images updated
- [ ] Monitor logs for suspicious activity

---

## 📚 Additional Resources

- **Full Deployment Guide:** `DEPLOYMENT.md`
- **Environment Variables:** `ENV_VARIABLES.md`
- **Database Migration:** `MIGRATION_LOCAL_AUTH.sql`
- **Quick Start:** `QUICKSTART.md`

---

## 💡 Cost Estimate

Monthly costs for running independently:

| Service | Cost |
|---------|------|
| **Server** (2 CPU, 4GB RAM) | $10-20/month |
| **OpenAI API** (50 images/month) | ~$2/month |
| **Stripe** | 2.9% + $0.30 per transaction |
| **Domain** | ~$12/year |
| **SSL Certificate** | Free (Let's Encrypt) |
| **n8n** | Already running |

**Total:** ~$15-25/month (excluding transaction fees)

---

## ✅ Success Checklist

After deployment, verify:

- [ ] Website loads at `http://your-server-ip:3000`
- [ ] Can register a new account at `/register`
- [ ] Can login at `/login`
- [ ] Admin panel accessible (after promoting user to admin)
- [ ] Chatbot responds to messages
- [ ] Products display correctly
- [ ] Checkout process works
- [ ] Image generation works in admin (if OpenAI configured)

---

## 🆘 Need Help?

If you encounter issues:

1. Check logs: `docker-compose logs -f app`
2. Review `DEPLOYMENT.md` for detailed troubleshooting
3. Verify all environment variables are set correctly
4. Ensure database migration was run successfully

---

**Your website is now fully independent and ready for production! 🎉**
