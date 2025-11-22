# Configuration du Chatbot avec n8n

Ce document explique comment configurer le workflow n8n pour que votre chatbot réponde intelligemment avec un agent IA.

## Architecture

Le chatbot envoie maintenant tous les messages utilisateurs à un webhook n8n qui utilise un agent IA (OpenAI, Anthropic, etc.) pour générer des réponses contextuelles et intelligentes.

**Flux de données:**
1. Utilisateur envoie un message via le chatbot
2. Le site web envoie le message + historique de conversation au webhook n8n
3. n8n traite le message avec un agent IA
4. L'agent IA génère une réponse personnalisée
5. n8n retourne la réponse au site web
6. Le chatbot affiche la réponse à l'utilisateur

## Étape 1: Créer le Workflow n8n

### 1.1 Créer un nouveau workflow dans n8n

1. Connectez-vous à votre instance n8n: `${N8N_INSTANCE_URL}`
2. Cliquez sur "New Workflow"
3. Nommez le workflow: "Les Touillés - Chatbot AI Agent"

### 1.2 Ajouter le Webhook Trigger

1. Ajoutez un nœud **Webhook**
2. Configurez:
   - **HTTP Method**: POST
   - **Path**: `/chatbot-response` (ou votre choix)
   - **Response Mode**: "When Last Node Finishes"
   - **Response Data**: "First Entry JSON"

3. Copiez l'URL du webhook générée (vous en aurez besoin plus tard)

### 1.3 Ajouter l'Agent IA (OpenAI ou Anthropic)

#### Option A: OpenAI Chat Model

1. Ajoutez un nœud **OpenAI Chat Model**
2. Configurez vos credentials OpenAI
3. Paramètres:
   - **Model**: `gpt-4o` ou `gpt-4o-mini` (recommandé pour le coût/performance)
   - **Messages**: Utilisez le code suivant dans l'expression:

```javascript
// System message avec le contexte de l'entreprise
const systemMessage = {
  role: 'system',
  content: `Tu es l'assistant virtuel de Les Touillés, un service traiteur québécois de qualité.

CONTEXTE DE L'ENTREPRISE:
- Spécialités: plats préparés, sandwiches, salades, desserts, traiteur pour événements
- Services: mariages, événements corporatifs, fêtes privées, commandes individuelles
- Contact: (514) 123-4567, info@lestouilles.ca
- Localisation: Québec, Canada

TON RÔLE:
- Répondre aux questions sur le menu, les prix, les services de traiteur
- Aider à planifier des événements (nombre d'invités, type d'événement, budget)
- Suggérer des plats appropriés selon les besoins du client
- Capturer les informations de contact pour un suivi personnalisé
- Être chaleureux, professionnel et orienté service client
- Répondre en français ou anglais selon la langue du client

INSTRUCTIONS:
- Si le client pose des questions sur des produits spécifiques, donne des détails sur les ingrédients, portions, prix
- Si le client veut organiser un événement, pose des questions sur: date, nombre d'invités, type d'événement, budget, restrictions alimentaires
- Si le client exprime un intérêt sérieux, demande poliment ses coordonnées (nom, email, téléphone) pour qu'un membre de l'équipe le contacte
- Sois concis mais informatif (2-3 phrases maximum par réponse)
- Utilise un ton amical et professionnel`
};

// Conversation history from webhook
const history = $json.conversationHistory || [];

// Current user message
const userMessage = {
  role: 'user',
  content: $json.message
};

// Combine all messages
return [systemMessage, ...history, userMessage];
```

#### Option B: Anthropic Claude

1. Ajoutez un nœud **Anthropic**
2. Configurez vos credentials Anthropic
3. Utilisez le même système de messages que pour OpenAI

### 1.4 Ajouter la Logique de Détection de Lead

1. Ajoutez un nœud **Code** après l'agent IA
2. Nommez-le "Detect Lead Intent"
3. Code JavaScript:

```javascript
// Get the AI response
const aiResponse = $json.choices?.[0]?.message?.content || $json.content || '';

// Check if the response suggests capturing lead info
const shouldCaptureLead = 
  aiResponse.toLowerCase().includes('coordonnées') ||
  aiResponse.toLowerCase().includes('contact') ||
  aiResponse.toLowerCase().includes('email') ||
  aiResponse.toLowerCase().includes('téléphone') ||
  aiResponse.toLowerCase().includes('phone') ||
  aiResponse.toLowerCase().includes('reach out') ||
  aiResponse.toLowerCase().includes('get in touch');

return {
  response: aiResponse,
  shouldCaptureLead: shouldCaptureLead
};
```

### 1.5 Configurer la Réponse

1. Ajoutez un nœud **Respond to Webhook**
2. Configurez:
   - **Response Mode**: "Using Respond to Webhook Node"
   - **Response Body**: Expression

```javascript
{
  "response": "{{ $json.response }}",
  "shouldCaptureLead": {{ $json.shouldCaptureLead }}
}
```

## Étape 2: Tester le Workflow

1. Activez le workflow dans n8n
2. Testez avec curl:

```bash
curl -X POST "VOTRE_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-123",
    "message": "Bonjour, je cherche un traiteur pour mon mariage",
    "language": "fr",
    "conversationHistory": []
  }'
```

3. Vous devriez recevoir une réponse JSON:

```json
{
  "response": "Bonjour! Félicitations pour votre mariage! Nous serions ravis de vous aider...",
  "shouldCaptureLead": true
}
```

## Étape 3: Configurer la Variable d'Environnement

### Via l'interface Manus (Recommandé)

1. Ouvrez le panneau de gestion du projet
2. Allez dans **Settings** → **Secrets**
3. Ajoutez une nouvelle variable:
   - **Nom**: `N8N_CHATBOT_WEBHOOK_URL`
   - **Valeur**: L'URL du webhook copiée depuis n8n
4. Sauvegardez

### Via fichier .env (Développement local uniquement)

```bash
N8N_CHATBOT_WEBHOOK_URL=https://votre-instance-n8n.app.n8n.cloud/webhook/chatbot-response
```

## Étape 4: Tester le Chatbot

1. Ouvrez votre site web Les Touillés
2. Cliquez sur le bouton de chat flottant (coin inférieur droit)
3. Envoyez un message: "Bonjour, je cherche un traiteur"
4. L'agent IA devrait répondre de manière contextuelle

## Fonctionnalités Avancées (Optionnel)

### Ajouter la Recherche de Produits

Vous pouvez enrichir l'agent IA avec l'accès à la base de données de produits:

1. Ajoutez un nœud **HTTP Request** qui appelle votre API tRPC
2. URL: `https://votre-site.manus.space/api/trpc/products.listActive`
3. Injectez les résultats dans le contexte de l'agent IA

### Ajouter la Création Automatique de Réservations

1. Détectez quand le client veut réserver (date, nombre d'invités)
2. Ajoutez un nœud **HTTP Request** vers votre API de réservations
3. Créez automatiquement une réservation préliminaire

### Monitoring et Analytics

1. Ajoutez un nœud **Google Sheets** ou **Airtable** pour logger les conversations
2. Suivez les métriques: nombre de conversations, taux de conversion en leads, sujets populaires

## Dépannage

### Le chatbot utilise les réponses de secours

**Problème**: Vous voyez "N8N_CHATBOT_WEBHOOK_URL not configured" dans les logs

**Solution**: Vérifiez que la variable d'environnement est bien configurée dans Settings → Secrets

### Erreur 500 du webhook

**Problème**: Le webhook n8n retourne une erreur

**Solutions**:
- Vérifiez que le workflow est activé dans n8n
- Vérifiez les credentials de l'agent IA (OpenAI/Anthropic)
- Consultez les logs d'exécution dans n8n

### Réponses lentes

**Problème**: Le chatbot met plus de 5 secondes à répondre

**Solutions**:
- Utilisez un modèle plus rapide (gpt-4o-mini au lieu de gpt-4)
- Réduisez la longueur du system prompt
- Limitez l'historique de conversation à 5-10 messages

## Support

Pour toute question sur la configuration:
- Documentation n8n: https://docs.n8n.io
- Support Les Touillés: info@lestouilles.ca
