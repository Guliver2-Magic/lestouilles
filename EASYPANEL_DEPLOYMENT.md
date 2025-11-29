# Déploiement sur Easypanel - Les Touillés

Guide complet pour déployer Les Touillés sur Easypanel.

---

## 📋 Prérequis

1. **Compte Easypanel** avec accès à un serveur
2. **Dépôt GitHub** : https://github.com/Guliver2-Magic/lestouilles
3. **Clés API** :
   - OpenAI API Key (pour génération d'images)
   - Stripe Keys (pour paiements)
   - n8n Webhook URL (pour chatbot)

---

## 🚀 Étapes de déploiement

### **Étape 1 : Créer le projet**

1. Dans Easypanel, cliquez sur **"Create Project"**
2. Nom du projet : `les_touilles`
3. Cliquez sur **"Create"**

---

### **Étape 2 : Ajouter le service MySQL**

**Important :** Créez la base de données AVANT l'application !

1. Dans votre projet, cliquez sur **"+ Service"**
2. Sélectionnez **"MySQL"** dans les templates
3. Configuration :
   - **Service Name** : `lestouilles-db`
   - **MySQL Root Password** : Générez un mot de passe sécurisé
   - **MySQL Database** : `lestouilles`
   - **MySQL User** : `lestouilles_user`
   - **MySQL Password** : Générez un mot de passe sécurisé
4. Cliquez sur **"Deploy"**
5. **Attendez** que MySQL soit démarré (statut "Running")

**⚠️ Notez ces informations pour l'étape suivante !**

---

### **Étape 3 : Configurer la source GitHub**

1. Dans votre projet, cliquez sur **"+ Service"** → **"App"**
2. Nom du service : `lestouilles`
3. Onglet **"Source"** :
   - Sélectionnez **"Github"**
   - **Repository URL** : `https://github.com/Guliver2-Magic/lestouilles`
   - **Branch** : `main`
   - **Build Path** : `/` (laisser vide ou mettre `/`)

**Si dépôt privé :**
- Cliquez sur **"Generate SSH Key"**
- Copiez la clé SSH
- Ajoutez-la dans GitHub : Settings → Deploy keys → Add deploy key
- Collez la clé et cochez "Allow write access"

4. Cliquez sur **"Save"**

---

### **Étape 4 : Configurer les variables d'environnement**

Dans l'onglet **"Environment"** de votre service `lestouilles`, ajoutez :

```bash
# Database (connexion au service MySQL)
DATABASE_URL=mysql://lestouilles_user:VOTRE_MYSQL_PASSWORD@lestouilles-db:3306/lestouilles
MYSQL_ROOT_PASSWORD=VOTRE_MYSQL_ROOT_PASSWORD
MYSQL_DATABASE=lestouilles
MYSQL_USER=lestouilles_user
MYSQL_PASSWORD=VOTRE_MYSQL_PASSWORD

# Application
NODE_ENV=production
PORT=3000

# JWT Secret (générer avec: openssl rand -base64 32)
JWT_SECRET=VOTRE_JWT_SECRET_ICI

# OpenAI (pour génération d'images)
OPENAI_API_KEY=sk-votre_cle_openai

# Branding
VITE_APP_TITLE=Les Touillés - Catering Service
VITE_APP_LOGO=/logo.png

# n8n Chatbot
N8N_CHATBOT_WEBHOOK_URL=https://vps-e53ac5fb.vps.ovh.ca/webhook/chatbot-response

# Stripe
STRIPE_SECRET_KEY=sk_live_votre_cle
STRIPE_WEBHOOK_SECRET=whsec_votre_secret
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_votre_cle_publique

# Analytics (optionnel)
VITE_ANALYTICS_ENDPOINT=
VITE_ANALYTICS_WEBSITE_ID=
```

**💡 Générer des secrets sécurisés :**
```bash
openssl rand -base64 32  # Pour JWT_SECRET
openssl rand -base64 24  # Pour mots de passe
```

---

### **Étape 5 : Configurer le build**

Dans l'onglet **"Build"** :

**Build Command** :
```bash
pnpm install && pnpm build
```

**Start Command** :
```bash
node server/_core/index.js
```

**Port** : `3000`

---

### **Étape 6 : Configurer le domaine**

Dans l'onglet **"Domains"** :

1. Cliquez sur **"Add Domain"**
2. Options :
   - **Sous-domaine Easypanel** : `lestouilles.votre-serveur.easypanel.host`
   - **Domaine personnalisé** : `lestouilles.ca` (si vous en avez un)
3. Easypanel génère automatiquement un certificat SSL

---

### **Étape 7 : Déployer l'application**

1. Vérifiez que MySQL est **Running**
2. Dans le service `lestouilles`, cliquez sur **"Deploy"**
3. Easypanel va :
   - Cloner le dépôt GitHub
   - Installer les dépendances
   - Builder l'application
   - Démarrer le serveur
4. Attendez que le statut passe à **"Running"**

---

### **Étape 8 : Exécuter la migration SQL**

**⚠️ IMPORTANT : Après le premier déploiement !**

1. Dans Easypanel, allez dans le service **"lestouilles-db"** (MySQL)
2. Cliquez sur **"Terminal"** ou **"Console"**
3. Exécutez :

```bash
mysql -u lestouilles_user -p lestouilles
# Entrez le mot de passe MySQL
```

4. Copiez-collez le contenu de `MIGRATION_LOCAL_AUTH.sql` :

```sql
-- Supprimer la colonne openId (OAuth)
ALTER TABLE users DROP COLUMN IF EXISTS openId;

-- Ajouter les colonnes pour authentification locale
ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS password VARCHAR(255),
  ADD COLUMN IF NOT EXISTS isVerified BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS verificationToken VARCHAR(255),
  ADD COLUMN IF NOT EXISTS resetToken VARCHAR(255),
  ADD COLUMN IF NOT EXISTS resetTokenExpiry TIMESTAMP NULL;

-- Rendre l'email unique et requis
ALTER TABLE users 
  MODIFY COLUMN email VARCHAR(320) NOT NULL UNIQUE;

-- Ajouter loginMethod si pas présent
ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS loginMethod VARCHAR(64) DEFAULT 'local';
```

5. Tapez `exit;` pour quitter MySQL

**Alternative : Via l'interface Easypanel**

Si Easypanel a une interface phpMyAdmin ou Adminer :
1. Accédez à l'interface de gestion MySQL
2. Sélectionnez la base `lestouilles`
3. Allez dans l'onglet "SQL"
4. Collez le contenu de `MIGRATION_LOCAL_AUTH.sql`
5. Cliquez sur "Exécuter"

---

### **Étape 9 : Créer votre compte administrateur**

1. Accédez à votre site : `https://lestouilles.votre-serveur.easypanel.host/register`
2. Créez un compte avec votre email
3. Retournez dans le terminal MySQL :

```bash
mysql -u lestouilles_user -p lestouilles
# Promouvoir votre compte en admin :
UPDATE users SET role = 'admin' WHERE email = 'votre@email.com';
exit;
```

---

### **Étape 10 : Vérifier le déploiement**

Testez ces fonctionnalités :

- ✅ Page d'accueil charge correctement
- ✅ Connexion à `/login` fonctionne
- ✅ Inscription à `/register` fonctionne
- ✅ Produits s'affichent avec images
- ✅ Panier fonctionne
- ✅ Chatbot répond
- ✅ Checkout Stripe fonctionne

---

## 🔧 Configuration avancée

### **Activer les logs**

Dans Easypanel, onglet **"Logs"** :
- Activez les logs pour déboguer
- Surveillez les erreurs de démarrage

### **Redémarrer l'application**

Si vous modifiez les variables d'environnement :
1. Cliquez sur **"Restart"** dans le service `lestouilles`
2. Attendez que le statut repasse à "Running"

### **Mettre à jour le code**

Quand vous poussez des changements sur GitHub :
1. Dans Easypanel, cliquez sur **"Redeploy"**
2. Easypanel va pull les derniers changements et rebuild

### **Backup de la base de données**

1. Accédez au terminal MySQL
2. Exécutez :

```bash
mysqldump -u lestouilles_user -p lestouilles > backup-$(date +%Y%m%d).sql
```

3. Téléchargez le fichier de backup

---

## 🆘 Dépannage

### **L'application ne démarre pas**

1. Vérifiez les logs dans Easypanel
2. Vérifiez que MySQL est "Running"
3. Vérifiez `DATABASE_URL` dans les variables d'environnement
4. Format correct : `mysql://user:password@lestouilles-db:3306/lestouilles`

### **Erreur de connexion à la base de données**

1. Vérifiez que le service MySQL est démarré
2. Vérifiez que `DATABASE_URL` pointe vers `lestouilles-db` (nom du service)
3. Vérifiez les credentials MySQL

### **Build échoue**

1. Vérifiez que `pnpm` est installé dans le Dockerfile
2. Vérifiez les logs de build
3. Essayez de redéployer

### **Port 3000 non accessible**

1. Vérifiez que le port 3000 est exposé dans les settings
2. Vérifiez le domaine configuré
3. Vérifiez les logs de l'application

---

## 📊 Architecture Easypanel

```
┌─────────────────────────────────────┐
│         Easypanel Server            │
├─────────────────────────────────────┤
│                                     │
│  ┌──────────────┐  ┌─────────────┐ │
│  │ lestouilles  │  │lestouilles- │ │
│  │   (App)      │──│   db        │ │
│  │  Port 3000   │  │  (MySQL)    │ │
│  └──────────────┘  └─────────────┘ │
│         │                           │
│         │                           │
│  ┌──────▼──────────────────────┐   │
│  │   Reverse Proxy (nginx)     │   │
│  │   SSL/HTTPS automatique     │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
              │
              ▼
        Internet
```

---

## ✅ Checklist de déploiement

- [ ] Projet créé dans Easypanel
- [ ] Service MySQL créé et démarré
- [ ] Service application créé
- [ ] GitHub repository configuré
- [ ] Variables d'environnement ajoutées
- [ ] Build et start commands configurés
- [ ] Domaine configuré
- [ ] Application déployée
- [ ] Migration SQL exécutée
- [ ] Compte admin créé
- [ ] Toutes les fonctionnalités testées

---

## 🎉 Félicitations !

Votre site Les Touillés est maintenant déployé sur Easypanel !

**Prochaines étapes :**
1. Configurez votre domaine personnalisé
2. Testez tous les flux (commande, paiement, chatbot)
3. Configurez les backups automatiques
4. Surveillez les logs régulièrement

---

## 📚 Ressources

- [Documentation Easypanel](https://easypanel.io/docs)
- [GitHub Repository](https://github.com/Guliver2-Magic/lestouilles)
- [QUICKSTART.md](QUICKSTART.md) - Guide général
- [ENV_VARIABLES.md](ENV_VARIABLES.md) - Variables d'environnement
