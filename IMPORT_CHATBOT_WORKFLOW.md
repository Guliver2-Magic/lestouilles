# Guide d'Importation du Workflow Chatbot n8n

## Fichier à Importer
`n8n-chatbot-workflow-complete.json`

## Instructions d'Importation

### Étape 1: Télécharger le Fichier
1. Téléchargez le fichier `n8n-chatbot-workflow-complete.json` depuis le projet

### Étape 2: Importer dans n8n
1. Connectez-vous à votre instance n8n: https://vps-e53ac5fb.vps.ovh.ca/
2. Cliquez sur le menu **☰** en haut à gauche
3. Sélectionnez **"Import from File"** ou **"Importer depuis un fichier"**
4. Sélectionnez le fichier `n8n-chatbot-workflow-complete.json`
5. Cliquez sur **"Import"**

### Étape 3: Configurer les Credentials OpenAI
1. Une fois le workflow importé, cliquez sur le nœud **"OpenAI Chat"**
2. Dans le panneau de droite, sous **"Credentials"**, cliquez sur **"Create New"**
3. Entrez votre clé API OpenAI:
   - **Name**: `OpenAI API`
   - **API Key**: Votre clé API OpenAI (commençant par `sk-...`)
4. Cliquez sur **"Save"**

### Étape 4: Vérifier la Configuration du Webhook
1. Cliquez sur le nœud **"Webhook"** (premier nœud)
2. Vérifiez que:
   - **HTTP Method**: `POST` ✓
   - **Path**: `chatbot-response` ✓
   - **Response Mode**: `Using 'Respond to Webhook' Node` ✓

3. Copiez l'URL du webhook affichée (devrait être: `https://vps-e53ac5fb.vps.ovh.ca/webhook/chatbot-response`)

### Étape 5: Activer le Workflow
1. Cliquez sur le bouton **"Inactive"** en haut à droite pour l'activer
2. Le bouton devrait passer à **"Active"** avec une couleur verte

### Étape 6: Tester le Workflow
Testez avec curl:
```bash
curl -X POST https://vps-e53ac5fb.vps.ovh.ca/webhook/chatbot-response \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-123",
    "message": "Bonjour, quels sont vos services?",
    "language": "fr",
    "conversationHistory": []
  }'
```

Vous devriez recevoir une réponse JSON:
```json
{
  "response": "Bonjour! Les Touillés offre...",
  "shouldCaptureLead": false
}
```

### Étape 7: Tester depuis le Site Web
1. Allez sur votre site: https://3000-i3hp0ui1osmfusmdr96jq-6992b96c.manusvm.computer
2. Cliquez sur l'icône du chatbot (en bas à droite)
3. Envoyez un message test
4. Vous devriez recevoir une réponse de l'IA!

## Structure du Workflow

Le workflow contient 4 nœuds:

1. **Webhook** - Reçoit les requêtes POST du site web
2. **OpenAI Chat** - Envoie le message à GPT-4 avec le contexte Les Touillés
3. **Format Response** - Formate la réponse et détecte si c'est un lead potentiel
4. **Respond to Webhook** - Retourne la réponse au site web

## Dépannage

### Le workflow ne s'active pas
- Vérifiez que vous avez bien configuré les credentials OpenAI
- Vérifiez qu'il n'y a pas d'erreurs dans les nœuds (icône rouge)

### Erreur 401 (Unauthorized)
- Votre clé API OpenAI est invalide ou expirée
- Vérifiez votre clé sur https://platform.openai.com/api-keys

### Erreur 404
- Le workflow n'est pas activé
- Le path du webhook est incorrect

### Le chatbot ne répond pas
- Vérifiez les logs d'exécution dans n8n (onglet "Executions")
- Vérifiez que l'URL du webhook dans les variables d'environnement correspond exactement

## Personnalisation

### Changer le Modèle OpenAI
Dans le nœud "OpenAI Chat", modifiez le JSON:
```json
"model": "gpt-4o-mini"  // ou "gpt-4", "gpt-3.5-turbo"
```

### Modifier le Prompt Système
Dans le nœud "OpenAI Chat", éditez le champ `content` du message système pour personnaliser le comportement de l'IA.

### Ajuster la Détection de Leads
Dans le nœud "Format Response", modifiez la regex pour détecter d'autres mots-clés:
```javascript
const shouldCaptureLead = /contact|coordonnées|réserver|VOTRE_MOT_CLÉ/i.test(aiMessage);
```

## Support
Si vous rencontrez des problèmes, vérifiez:
1. Les logs d'exécution dans n8n
2. Que votre clé OpenAI est valide et a du crédit
3. Que le workflow est bien activé (bouton vert)
