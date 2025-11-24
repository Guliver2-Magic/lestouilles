# 🤖 Guide d'Intégration du Chatbot n8n pour Les Touillés

Ce guide explique comment configurer et activer le chatbot AI pour répondre automatiquement aux clients sur le site web.

---

## 📋 Vue d'Ensemble

Le système de chatbot utilise :
- **n8n** : Workflow automation pour gérer l'agent AI
- **OpenRouter** : Service LLM pour les réponses intelligentes
- **Webhook** : Communication entre le site web et n8n
- **Base de données** : Stockage des conversations et leads

---

## 🚀 Étapes d'Installation

### 1. Importer le Workflow dans n8n

1. **Téléchargez le fichier** : `LesTouillés-ChatbotAIAgent-v2.json`
2. **Connectez-vous à n8n** : Accédez à votre instance n8n
3. **Importez le workflow** :
   - Cliquez sur le menu (☰) en haut à gauche
   - Sélectionnez **"Import from File"**
   - Choisissez le fichier `LesTouillés-ChatbotAIAgent-v2.json`
   - Cliquez sur **"Import"**

### 2. Configurer les Credentials

Le workflow nécessite un compte **OpenRouter** pour fonctionner.

1. **Vérifiez les credentials** :
   - Ouvrez le workflow importé
   - Cliquez sur le nœud **"OpenRouter Chat Model"**
   - Vérifiez que le credential "OpenRouter account" est bien configuré
   
2. **Si le credential n'existe pas** :
   - Créez un compte sur [OpenRouter](https://openrouter.ai/)
   - Obtenez une clé API
   - Dans n8n, ajoutez un nouveau credential "OpenRouter API"
   - Entrez votre clé API

### 3. Activer le Workflow

1. **Activez le workflow** :
   - En haut à droite du workflow, cliquez sur le toggle **"Active"**
   - Le workflow doit passer à l'état "Active" (vert)

2. **Vérifiez le webhook URL** :
   - Cliquez sur le nœud **"Webhook"**
   - Notez l'URL du webhook (devrait être : `https://vps-e53ac5fb.vps.ovh.ca/webhook/chatbot-response`)
   - Cette URL doit correspondre à la variable d'environnement `N8N_CHATBOT_WEBHOOK_URL`

---

## 🧪 Tester le Chatbot

### Test 1 : Webhook Direct

Utilisez le script de test fourni :

```bash
cd /home/ubuntu/les-touilles
node test-webhook.mjs
```

**Résultat attendu** :
```
✅ Response data: {
  "response": "Bonjour! Nous avons plusieurs excellentes options végétariennes...",
  "shouldCaptureLead": false
}
```

### Test 2 : Sur le Site Web

1. **Ouvrez le site** : https://3000-i3hp0ui1osmfusmdr96jq-6992b96c.manusvm.computer
2. **Cliquez sur l'icône de chat** (coin inférieur droit)
3. **Envoyez un message** : "Bonjour, quels sont vos plats végétariens ?"
4. **Vérifiez la réponse** : Le bot devrait répondre avec des informations sur les plats végétariens

---

## 📊 Structure du Workflow

### Nœuds du Workflow

1. **Webhook** : Reçoit les messages du site web
2. **Edit Fields** : Extrait et formate les données (message, sessionId, language, history)
3. **AI Agent** : Agent intelligent avec instructions spécifiques pour Les Touillés
4. **OpenRouter Chat Model** : Modèle LLM pour générer les réponses
5. **Window Buffer Memory** : Mémoire de conversation par session
6. **Respond to Webhook** : Renvoie la réponse au site web

### Format du Payload (Site → n8n)

```json
{
  "message": "Bonjour, quels sont vos plats végétariens?",
  "sessionId": "session-1234567890-abc123",
  "language": "fr",
  "conversationHistory": [
    {
      "role": "user",
      "content": "Message précédent..."
    },
    {
      "role": "assistant",
      "content": "Réponse précédente..."
    }
  ]
}
```

### Format de la Réponse (n8n → Site)

```json
{
  "response": "Bonjour! Nous avons plusieurs excellentes options végétariennes...",
  "shouldCaptureLead": false
}
```

---

## 🎯 Capacités de l'Agent AI

L'agent AI est spécialisé pour Les Touillés et peut :

### 1. Informations sur le Menu
- Décrire les plats disponibles
- Fournir les prix et portions
- Suggérer des plats selon les préférences
- Expliquer les Plats du Jour et promotions

### 2. Réservations et Événements
- Expliquer le processus de réservation
- Informer sur les services traiteur
- Orienter vers la page de réservation
- Mentionner les devis personnalisés

### 3. Commandes et Livraison
- Guider pour passer commande
- Expliquer les options de livraison
- Informer sur les délais de préparation
- Rediriger vers le panier

### 4. Informations Générales
- Horaires d'ouverture
- Coordonnées de contact
- Politique d'annulation
- Allergènes et informations diététiques

### 5. Capture de Leads
- Détecte l'intérêt pour réservations/devis
- Demande poliment nom et email
- Envoie les leads à l'équipe

---

## 🔧 Personnalisation de l'Agent

Pour modifier le comportement de l'agent :

1. **Ouvrez le workflow dans n8n**
2. **Cliquez sur le nœud "AI Agent"**
3. **Modifiez le "System Message"** dans les options
4. **Sauvegardez le workflow**

### Exemples de Modifications

**Ajouter un nouveau type de plat** :
```markdown
## Menu Principal

- **Boîtes à Lunch** : Repas complets ($11-$22)
- **Plats Principaux** : Poulet, boeuf, poisson ($15-$32)
- **Nouveau : Plats Végans** : Options 100% végétales ($14-$20)
```

**Modifier le ton** :
```markdown
# Ton

- **Très chaleureux et amical** : Utilisez des émojis 😊
- **Décontracté** : Tutoiement autorisé
- **Enthousiaste** : Montrez votre passion pour la cuisine
```

---

## 📈 Monitoring et Logs

### Voir les Exécutions dans n8n

1. **Accédez à l'onglet "Executions"** dans n8n
2. **Consultez les logs** de chaque exécution
3. **Vérifiez les erreurs** éventuelles

### Logs du Backend

Les logs du backend sont disponibles dans la console du serveur :

```bash
cd /home/ubuntu/les-touilles
pnpm dev
```

Recherchez les messages :
- `"Error calling n8n chatbot webhook:"` (erreurs)
- `"N8N_CHATBOT_WEBHOOK_URL not configured"` (configuration manquante)

---

## 🐛 Dépannage

### Problème : Le chatbot ne répond pas

**Solutions** :
1. Vérifiez que le workflow est **actif** dans n8n
2. Vérifiez que le credential OpenRouter est configuré
3. Testez le webhook directement avec `node test-webhook.mjs`
4. Consultez les logs d'exécution dans n8n

### Problème : Réponses génériques/fallback

**Cause** : Le webhook n8n ne répond pas correctement

**Solutions** :
1. Vérifiez que l'URL du webhook est correcte
2. Vérifiez que le workflow n'a pas d'erreurs
3. Testez avec le script `test-webhook.mjs`

### Problème : "Unexpected end of JSON input"

**Cause** : Le workflow retourne une réponse vide

**Solutions** :
1. Vérifiez que le nœud "Respond to Webhook" est bien connecté
2. Vérifiez le format de la réponse dans "Respond to Webhook"
3. Assurez-vous que l'agent AI génère bien une sortie

---

## 📞 Support

Pour toute question ou problème :

1. **Consultez les logs** dans n8n et le backend
2. **Testez avec le script** `test-webhook.mjs`
3. **Vérifiez la documentation** n8n : https://docs.n8n.io/

---

## 🎉 Félicitations !

Une fois le workflow activé, votre chatbot AI est opérationnel et prêt à assister vos clients 24/7 ! 🚀
