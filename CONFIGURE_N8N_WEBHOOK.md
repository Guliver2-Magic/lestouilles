# Guide: Configurer le Webhook n8n pour le Chatbot

## Problème Actuel
Le webhook `https://vps-e53ac5fb.vps.ovh.ca/webhook/chatbot-response` retourne une erreur 404 car il n'est pas configuré pour accepter les requêtes POST.

## Solution: Configuration du Workflow n8n

### Étape 1: Ouvrir le Workflow
1. Allez sur https://vps-e53ac5fb.vps.ovh.ca/home/workflows
2. Cliquez sur **"Les Touillés - Chatbot AI Agent"**

### Étape 2: Configurer le Nœud Webhook
1. Dans l'éditeur de workflow, cliquez sur le premier nœud (Webhook)
2. Dans le panneau de droite, configurez:
   - **HTTP Method**: `POST` (très important!)
   - **Path**: `chatbot-response`
   - **Response Mode**: `Respond to Webhook`
   - **Response Code**: `200`

### Étape 3: Vérifier la Structure des Données
Le webhook doit recevoir ces données du site web:
```json
{
  "sessionId": "string",
  "message": "string",
  "language": "fr" ou "en",
  "conversationHistory": [
    {
      "role": "user" ou "assistant",
      "content": "string"
    }
  ]
}
```

### Étape 4: Configurer OpenAI (si pas déjà fait)
1. Ajoutez un nœud **HTTP Request** après le Webhook
2. Configurez:
   - **Method**: `POST`
   - **URL**: `https://api.openai.com/v1/chat/completions`
   - **Authentication**: `Generic Credential Type`
   - **Headers**:
     ```
     Authorization: Bearer YOUR_OPENAI_API_KEY
     Content-Type: application/json
     ```
   - **Body** (JSON):
     ```json
     {
       "model": "gpt-4",
       "messages": [
         {
           "role": "system",
           "content": "Tu es l'assistant virtuel de Les Touillés, un service traiteur québécois. Spécialités: plats préparés, sandwiches, desserts, traiteur pour événements (mariages, corporatifs, fêtes). Contact: (514) 123-4567, info@lestouilles.ca. Sois chaleureux, professionnel et orienté service client. Réponds en français ou anglais selon la langue du client."
         },
         {{ $json.conversationHistory }},
         {
           "role": "user",
           "content": {{ $json.message }}
         }
       ],
       "temperature": 0.7,
       "max_tokens": 500
     }
     ```

### Étape 5: Formater la Réponse
1. Ajoutez un nœud **Set** ou **Code** pour formater la réponse
2. Extrayez le texte de la réponse OpenAI:
   ```javascript
   return {
     response: $input.item.json.choices[0].message.content,
     shouldCaptureLead: false
   };
   ```

### Étape 6: Répondre au Webhook
1. Ajoutez un nœud **Respond to Webhook**
2. Configurez:
   - **Response Body**: `{{ $json }}`
   - **Response Code**: `200`

### Étape 7: Activer le Workflow
1. Cliquez sur le bouton **Active** en haut à droite
2. Le workflow doit passer de "Inactive" à "Active"

### Étape 8: Tester
1. Copiez l'URL du webhook affichée dans le nœud Webhook
2. Vérifiez qu'elle correspond à: `https://vps-e53ac5fb.vps.ovh.ca/webhook/chatbot-response`
3. Testez depuis le site web en ouvrant le chatbot et en envoyant un message

## Vérification Rapide
Pour tester manuellement le webhook:
```bash
curl -X POST https://vps-e53ac5fb.vps.ovh.ca/webhook/chatbot-response \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-123",
    "message": "Bonjour",
    "language": "fr",
    "conversationHistory": []
  }'
```

Vous devriez recevoir une réponse JSON avec un champ `response`.

## Dépannage

### Erreur 404
- Vérifiez que le workflow est **Active**
- Vérifiez que le nœud Webhook est configuré pour **POST**
- Vérifiez que le path est exactement `chatbot-response`

### Erreur 500
- Vérifiez que votre clé API OpenAI est valide
- Vérifiez les logs d'exécution dans n8n (onglet "Executions")

### Pas de réponse
- Vérifiez que le nœud "Respond to Webhook" est bien connecté
- Vérifiez que le workflow se termine correctement

## Support
Si vous rencontrez des problèmes, vérifiez les logs d'exécution dans n8n pour voir où le workflow échoue.
