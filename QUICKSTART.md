# Les Touillés - Quick Start Guide

## 🚀 Deploy in 5 Minutes

This guide will get your Les Touillés website running on your Ubuntu server quickly.

---

## Step 1: Prerequisites

Make sure you have:
- Ubuntu Server 20.04+ 
- Root or sudo access
- Domain name pointing to your server (optional, can use IP)

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

**Minimum required configuration:**
```bash
# Database
MYSQL_ROOT_PASSWORD=your_secure_password_123
MYSQL_DATABASE=lestouilles
MYSQL_USER=lestouilles_user
MYSQL_PASSWORD=your_db_password_456
DATABASE_URL=mysql://lestouilles_user:your_db_password_456@db:3306/lestouilles

# Application
NODE_ENV=production
JWT_SECRET=$(openssl rand -base64 32)

# Manus OAuth (get these from Manus dashboard)
VITE_APP_ID=your_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://auth.manus.im
OWNER_OPEN_ID=your_owner_id
OWNER_NAME=Your Name

# Branding
VITE_APP_TITLE=Les Touillés - Catering Service
VITE_APP_LOGO=/logo.png

# N8N Chatbot
N8N_CHATBOT_WEBHOOK_URL=https://your-n8n-instance.com/webhook/chatbot

# Manus Forge API
BUILT_IN_FORGE_API_URL=https://api.manus.im/forge
BUILT_IN_FORGE_API_KEY=your_forge_key
VITE_FRONTEND_FORGE_API_KEY=your_frontend_key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im/forge

# Stripe (use test keys for testing)
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key

# Analytics (optional)
VITE_ANALYTICS_ENDPOINT=
VITE_ANALYTICS_WEBSITE_ID=
```

**💡 Tip:** See `ENV_VARIABLES.md` for detailed explanations of each variable.

---

## Step 5: Deploy!

```bash
# Make deploy script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

The script will:
✅ Build Docker images  
✅ Start all services  
✅ Run database migrations  
✅ Show deployment status  

---

## Step 6: Access Your Website

Your website is now running at:
- **Local:** http://localhost:3000
- **Public:** http://your-server-ip:3000

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
