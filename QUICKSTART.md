# Les Touillés - Quick Start Guide

## 🚀 Deploy in 5 Minutes

This guide will get your Les Touillés website running on your Ubuntu server quickly.

---

## Step 1: Prerequisites

Make sure you have:
- Ubuntu Server 20.04+ 
- Root or sudo access
- Domain name pointing to your server (optional, can use IP)

**✅ What's INCLUDED in Docker (no installation needed):**
- MySQL database server
- Node.js runtime
- All dependencies

**❌ What you DON'T need to install:**
- MySQL Server - NOT needed!
- Node.js/npm - NOT needed!

---

## Step 2: Install Docker

```bash
# Run this one-liner to install Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

---

## Step 3: Transfer Project Files

**Option A: Using SCP (from your local machine)**
```bash
# Zip the project
zip -r les-touilles.zip les-touilles/

# Transfer to server
scp les-touilles.zip user@your-server-ip:/home/user/

# On server: extract
ssh user@your-server-ip
unzip les-touilles.zip
cd les-touilles
```

**Option B: Using Git**
```bash
git clone https://github.com/your-username/les-touilles.git
cd les-touilles
```

---

## Step 4: Configure Environment

```bash
# Create .env file
nano .env
```

**Configuration for standalone deployment:**
```bash
# Database (used by MySQL container)
MYSQL_ROOT_PASSWORD=YourSecureRootPassword123!
MYSQL_DATABASE=lestouilles
MYSQL_USER=lestouilles_user
MYSQL_PASSWORD=YourSecureUserPassword456!
DATABASE_URL=mysql://lestouilles_user:YourSecureUserPassword456!@db:3306/lestouilles

# Application
NODE_ENV=production
JWT_SECRET=$(openssl rand -base64 32)

# OpenAI (for image generation - replaces Manus Forge)
OPENAI_API_KEY=sk-your_openai_api_key_here

# Branding
VITE_APP_TITLE=Les Touillés - Catering Service
VITE_APP_LOGO=/logo.png

# N8N Chatbot (your existing instance)
N8N_CHATBOT_WEBHOOK_URL=https://vps-e53ac5fb.vps.ovh.ca/webhook/chatbot-response

# Stripe
STRIPE_SECRET_KEY=sk_live_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key

# Analytics (optional)
VITE_ANALYTICS_ENDPOINT=
VITE_ANALYTICS_WEBSITE_ID=
```

**💡 Generate secure secrets:**
```bash
openssl rand -base64 32  # For JWT_SECRET
openssl rand -base64 24  # For database passwords
```

**💡 Tip:** See `ENV_VARIABLES.md` for detailed explanations of each variable.

---

## Step 5: Start Docker Containers

```bash
# Start all services (MySQL + App)
docker-compose up -d

# Wait for MySQL to be ready
sleep 20

# Check status
docker-compose ps
```

**What just happened:**
✅ MySQL container started  
✅ Application container built and started  
✅ Services connected via Docker network

---

## Step 6: Run Database Migration

**⚠️ IMPORTANT:** Run AFTER Docker is started!

```bash
# Run migration inside MySQL container
docker-compose exec -T db mysql -u lestouilles_user -p"YourSecureUserPassword456!" lestouilles < MIGRATION_LOCAL_AUTH.sql

# Verify migration
docker-compose exec db mysql -u lestouilles_user -p lestouilles -e "DESCRIBE users;"
```

---

## Step 7: Create Admin Account

```bash
# Go to registration page
http://your-server-ip:3000/register

# After creating account, promote to admin:
docker-compose exec db mysql -u lestouilles_user -p lestouilles
# Run: UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```  

---

## Step 8: Access Your Website

Your website is now running at:
- **Local:** http://localhost:3000
- **Public:** http://your-server-ip:3000

**Test the following:**
✅ Homepage loads
✅ Can register at `/register`
✅ Can login at `/login`
✅ Products display correctly
✅ Chatbot responds
✅ Checkout works

---

## 🔒 Optional: Setup HTTPS with Cloudflare (Easiest)

1. Go to [Cloudflare](https://cloudflare.com) and add your domain
2. Point your domain A record to your server IP
3. Enable SSL/TLS in Cloudflare (Full mode)
4. Done! Cloudflare handles SSL automatically

---

## 📊 Useful Commands

```bash
# View logs
docker-compose logs -f app

# Restart application
docker-compose restart app

# Stop application
docker-compose down

# Start application
docker-compose up -d

# Backup database
./backup.sh

# Check status
docker-compose ps
```

---

## 🆘 Troubleshooting

**Application won't start?**
```bash
docker-compose logs app
```

**Database connection error?**
```bash
docker-compose logs db
# Check DATABASE_URL in .env
```

**Port 3000 already in use?**
```bash
sudo lsof -i :3000
sudo kill -9 <PID>
```

---

## 📚 Need More Help?

- Read the full `DEPLOYMENT.md` for detailed instructions
- Check `ENV_VARIABLES.md` for environment variable details
- Review logs: `docker-compose logs -f`

---

## 🎉 You're Done!

Your Les Touillés website is now live and ready to accept orders!

**Next Steps:**
1. Test the website thoroughly
2. Setup automatic backups (cron job)
3. Configure your domain and SSL
4. Monitor logs regularly
