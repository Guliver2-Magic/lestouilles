# Les Touillés - Environment Variables Configuration

## Required Environment Variables for Docker Deployment

⚠️ **Important Changes:**
- **OpenAI API** now used for image generation (replaces Manus Forge)
- **Local Authentication** system (email/password) replaces OAuth Manus
- Run `MIGRATION_LOCAL_AUTH.sql` on your database before deployment

### Database Configuration
```bash
MYSQL_ROOT_PASSWORD=your_secure_root_password_here
MYSQL_DATABASE=lestouilles
MYSQL_USER=lestouilles_user
MYSQL_PASSWORD=your_secure_database_password_here
DATABASE_URL=mysql://lestouilles_user:your_secure_database_password_here@db:3306/lestouilles
```

### Application Configuration
```bash
NODE_ENV=production
JWT_SECRET=your_jwt_secret_key_min_32_characters_long
```

### OpenAI Configuration (for AI image generation)
```bash
OPENAI_API_KEY=sk-your_openai_api_key_here
```
**How to get:** Sign up at https://platform.openai.com/api-keys
**Cost:** ~$0.04 per image with DALL-E 3

### Application Branding
```bash
VITE_APP_TITLE=Les Touillés - Catering Service
VITE_APP_LOGO=/logo.png
```

### N8N Chatbot Webhook
```bash
N8N_CHATBOT_WEBHOOK_URL=https://your-n8n-instance.com/webhook/chatbot-response
```

### Optional: Legacy Manus Configuration (not required)
```bash
# These are no longer required but kept for reference
# VITE_APP_ID=your_manus_app_id
# OAUTH_SERVER_URL=https://api.manus.im
# OWNER_OPEN_ID=your_owner_open_id
# OWNER_NAME=Your Name
```

### Stripe Payment Configuration
```bash
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
```

### Analytics (Optional)
```bash
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com
VITE_ANALYTICS_WEBSITE_ID=your_website_id
```

## How to Configure

1. Create a `.env` file in the project root
2. Copy all variables from this document
3. Replace placeholder values with your actual credentials
4. **NEVER commit the .env file to version control**

## Security Notes

- Generate strong passwords for `MYSQL_ROOT_PASSWORD` and `MYSQL_PASSWORD`
- `JWT_SECRET` should be at least 32 characters long and randomly generated
- For production, use Stripe live keys (`sk_live_*`, `pk_live_*`)
- Keep all API keys and secrets confidential
