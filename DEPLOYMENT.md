# Les Touillés - Deployment Guide

Complete guide for deploying Les Touillés website on your Ubuntu server using Docker.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Configuration](#configuration)
4. [Deployment](#deployment)
5. [SSL/HTTPS Setup](#sslhttps-setup)
6. [Maintenance](#maintenance)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### System Requirements

- **Ubuntu Server** 20.04 LTS or newer
- **Minimum Resources:**
  - 2 CPU cores
  - 4 GB RAM
  - 20 GB disk space
- **Root or sudo access**

### Required Software

1. **Docker** (version 20.10 or newer)
2. **Docker Compose** (version 2.0 or newer)
3. **Git** (for cloning the repository)

---

## Initial Setup

### 1. Install Docker

```bash
# Update package index
sudo apt update

# Install required packages
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Add your user to docker group (optional, to run docker without sudo)
sudo usermod -aG docker $USER
newgrp docker

# Verify installation
docker --version
```

### 2. Install Docker Compose

```bash
# Download Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make it executable
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version
```

### 3. Transfer Project Files

**Option A: Using Git (if you have a repository)**
```bash
git clone https://github.com/your-username/les-touilles.git
cd les-touilles
```

**Option B: Using SCP (from your local machine)**
```bash
# Create a zip of the project
zip -r les-touilles.zip les-touilles/

# Transfer to server
scp les-touilles.zip user@your-server-ip:/home/user/

# On the server, extract the files
ssh user@your-server-ip
unzip les-touilles.zip
cd les-touilles
```

**Option C: Using rsync (recommended for large projects)**
```bash
rsync -avz --progress les-touilles/ user@your-server-ip:/home/user/les-touilles/
```

---

## Configuration

### 1. Create Environment File

Create a `.env` file in the project root with all required environment variables:

```bash
cd /home/user/les-touilles
nano .env
```

Copy the contents from `ENV_VARIABLES.md` and fill in your actual values:

```bash
# Database Configuration
MYSQL_ROOT_PASSWORD=your_secure_root_password_here
MYSQL_DATABASE=lestouilles
MYSQL_USER=lestouilles_user
MYSQL_PASSWORD=your_secure_database_password_here
DATABASE_URL=mysql://lestouilles_user:your_secure_database_password_here@db:3306/lestouilles

# Application Configuration
NODE_ENV=production
JWT_SECRET=your_jwt_secret_key_min_32_characters_long

# ... (copy all other variables from ENV_VARIABLES.md)
```

**Important:** 
- Generate strong passwords for database credentials
- Use at least 32 characters for JWT_SECRET
- Never commit the `.env` file to version control

### 2. Generate Secure Secrets

```bash
# Generate a secure JWT secret
openssl rand -base64 32

# Generate secure database passwords
openssl rand -base64 24
```

---

## Deployment

### Quick Deployment

Use the automated deployment script:

```bash
./deploy.sh
```

This script will:
1. Check for required dependencies
2. Stop existing containers
3. Build Docker images
4. Start all services
5. Run database migrations
6. Display deployment status

### Manual Deployment

If you prefer manual control:

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f app

# Run database migrations
docker-compose exec app pnpm db:push
```

### Verify Deployment

1. **Check if containers are running:**
   ```bash
   docker-compose ps
   ```

2. **Test the application:**
   ```bash
   curl http://localhost:3000
   ```

3. **Check application logs:**
   ```bash
   docker-compose logs -f app
   ```

4. **Check database logs:**
   ```bash
   docker-compose logs -f db
   ```

---

## SSL/HTTPS Setup

### Option 1: Using Let's Encrypt with Certbot

1. **Install Certbot:**
   ```bash
   sudo apt install -y certbot
   ```

2. **Obtain SSL certificate:**
   ```bash
   sudo certbot certonly --standalone -d lestouilles.ca -d www.lestouilles.ca
   ```

3. **Copy certificates to project:**
   ```bash
   sudo mkdir -p ssl
   sudo cp /etc/letsencrypt/live/lestouilles.ca/fullchain.pem ssl/
   sudo cp /etc/letsencrypt/live/lestouilles.ca/privkey.pem ssl/
   sudo chown -R $USER:$USER ssl/
   ```

4. **Enable nginx in docker-compose.yml:**
   ```bash
   # Uncomment the nginx service in docker-compose.yml
   nano docker-compose.yml
   ```

5. **Restart services:**
   ```bash
   docker-compose down
   docker-compose up -d
   ```

6. **Setup auto-renewal:**
   ```bash
   sudo crontab -e
   # Add this line:
   0 0 * * * certbot renew --quiet && cp /etc/letsencrypt/live/lestouilles.ca/*.pem /home/user/les-touilles/ssl/ && docker-compose restart nginx
   ```

### Option 2: Using Cloudflare (Recommended for beginners)

1. Add your domain to Cloudflare
2. Point your domain to your server IP
3. Enable Cloudflare's SSL/TLS (Full or Full Strict mode)
4. Cloudflare will handle SSL termination

---

## Maintenance

### Database Backups

**Automated Backup:**
```bash
# Run backup script
./backup.sh

# Setup automatic daily backups with cron
crontab -e
# Add this line for daily backup at 2 AM:
0 2 * * * cd /home/user/les-touilles && ./backup.sh
```

**Manual Backup:**
```bash
docker-compose exec db mysqldump -u lestouilles_user -p lestouilles > backup_$(date +%Y%m%d).sql
```

**Restore from Backup:**
```bash
docker-compose exec -T db mysql -u lestouilles_user -p lestouilles < backup_20240123.sql
```

### Updating the Application

```bash
# Pull latest changes (if using Git)
git pull

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Run migrations if needed
docker-compose exec app pnpm db:push
```

### Viewing Logs

```bash
# All services
docker-compose logs -f

# Application only
docker-compose logs -f app

# Database only
docker-compose logs -f db

# Last 100 lines
docker-compose logs --tail=100 app
```

### Restarting Services

```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart app

# Stop all services
docker-compose down

# Start all services
docker-compose up -d
```

### Monitoring Resources

```bash
# View resource usage
docker stats

# View disk usage
docker system df

# Clean up unused resources
docker system prune -a
```

---

## Troubleshooting

### Application Won't Start

1. **Check logs:**
   ```bash
   docker-compose logs app
   ```

2. **Verify environment variables:**
   ```bash
   docker-compose config
   ```

3. **Check if port 3000 is available:**
   ```bash
   sudo netstat -tulpn | grep 3000
   ```

### Database Connection Issues

1. **Check database status:**
   ```bash
   docker-compose ps db
   docker-compose logs db
   ```

2. **Verify DATABASE_URL in .env file**

3. **Test database connection:**
   ```bash
   docker-compose exec db mysql -u lestouilles_user -p
   ```

### Out of Memory

1. **Check memory usage:**
   ```bash
   free -h
   docker stats
   ```

2. **Increase swap space:**
   ```bash
   sudo fallocate -l 2G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   ```

### Port Already in Use

```bash
# Find process using port 3000
sudo lsof -i :3000

# Kill the process
sudo kill -9 <PID>
```

### SSL Certificate Issues

1. **Verify certificate files exist:**
   ```bash
   ls -la ssl/
   ```

2. **Check nginx logs:**
   ```bash
   docker-compose logs nginx
   ```

3. **Test SSL configuration:**
   ```bash
   openssl s_client -connect lestouilles.ca:443
   ```

### Database Migration Fails

```bash
# Access the container
docker-compose exec app sh

# Run migration manually
pnpm db:push

# Check database schema
pnpm drizzle-kit studio
```

---

## Security Best Practices

1. **Firewall Configuration:**
   ```bash
   sudo ufw allow 22/tcp  # SSH
   sudo ufw allow 80/tcp  # HTTP
   sudo ufw allow 443/tcp # HTTPS
   sudo ufw enable
   ```

2. **Regular Updates:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

3. **Secure SSH:**
   - Disable root login
   - Use SSH keys instead of passwords
   - Change default SSH port

4. **Monitor Logs:**
   ```bash
   # Setup log rotation
   sudo nano /etc/logrotate.d/docker
   ```

5. **Regular Backups:**
   - Automate database backups
   - Store backups off-site
   - Test restore procedures

---

## Support

For issues or questions:
- Check the logs: `docker-compose logs -f`
- Review this documentation
- Contact the development team

---

## Quick Reference

```bash
# Start application
docker-compose up -d

# Stop application
docker-compose down

# View logs
docker-compose logs -f app

# Restart application
docker-compose restart app

# Backup database
./backup.sh

# Update application
git pull && docker-compose up -d --build

# Check status
docker-compose ps
```
