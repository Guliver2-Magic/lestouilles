# Comment Importer le Workflow n8n pour le Chatbot

## Méthode Rapide: Import JSON

### Étape 1: Télécharger le fichier workflow

Le fichier `n8n-chatbot-workflow.json` contient tout le workflow pré-configuré.

### Étape 2: Importer dans n8n

1. Ouvrez votre instance n8n: https://vps-e53ac5fb.vps.ovh.ca/
2. Cliquez sur le menu hamburger (☰) en haut à gauche
3. Sélectionnez **"Import from File"** ou **"Importer depuis un fichier"**
4. Sélectionnez le fichier `n8n-chatbot-workflow.json`
5. Le workflow sera créé automatiquement avec tous les nœuds connectés

### Étape 3: Configurer les Credentials OpenAI

Le workflow utilise OpenAI pour générer les réponses intelligentes.

1. Dans le workflow importé, cliquez sur le nœud **"OpenAI Chat"**
2. Cliquez sur **"Credential to connect with"**
3. Sélectionnez votre credential OpenAI existant OU créez-en un nouveau:
   - Cliquez sur **"+ Create New Credential"**
   - Entrez votre **API Key OpenAI** (obtenez-la sur https://platform.openai.com/api-keys)
   - Nommez le credential: "OpenAI - Les Touillés"
   - Cliquez sur **"Save"**

### Étape 4: Activer le Workflow

1. En haut à droite du workflow, basculez le switch de **"Inactive"** à **"Active"**
2. Le workflow est maintenant en écoute et prêt à recevoir des messages

### Étape 5: Copier l'URL du Webhook

1. Cliquez sur le nœud **"Webhook"** (premier nœud)
2. Vous verrez l'URL du webhook dans les paramètres:
   ```
   https://vps-e53ac5fb.vps.ovh.ca/webhook/chatbot-response
   ```
3. Copiez cette URL complète

### Étape 6: Configurer la Variable d'Environnement

#### Via l'interface Manus:

1. Ouvrez votre projet Les Touillés dans Manus
2. Cliquez sur l'icône de gestion (⚙️) en haut à droite
3. Allez dans **Settings** → **Secrets**
4. Cliquez sur **"Add Secret"** ou **"Ajouter un secret"**
5. Remplissez:
   - **Nom**: `N8N_CHATBOT_WEBHOOK_URL`
   - **Valeur**: `https://vps-e53ac5fb.vps.ovh.ca/webhook/chatbot-response`
6. Cliquez sur **"Save"**

### Étape 7: Tester le Chatbot

1. Ouvrez votre site web: https://3000-i3hp0ui1osmfusmdr96jq-6992b96c.manusvm.computer
2. Cliquez sur le bouton de chat flottant (coin inférieur droit)
3. Envoyez un message test: "Bonjour, je cherche un traiteur pour mon mariage"
4. L'agent IA devrait répondre de manière contextuelle et intelligente!

## Structure du Workflow

Le workflow importé contient 6 nœuds:

1. **Webhook** - Reçoit les messages du chatbot
2. **Prepare Messages** - Prépare le contexte et l'historique pour OpenAI
3. **Set Messages** - Formate les messages au bon format
4. **OpenAI Chat** - Génère la réponse intelligente avec GPT-4o-mini
5. **Format Response** - Détecte si on doit capturer un lead
6. **Respond to Webhook** - Retourne la réponse au site web

## Personnalisation (Optionnel)

### Changer le Modèle IA

Dans le nœud **"OpenAI Chat"**:
- `gpt-4o-mini` - Rapide et économique (recommandé)
- `gpt-4o` - Plus intelligent mais plus lent et coûteux
- `gpt-3.5-turbo` - Le plus économique

### Ajuster la Température

Dans le nœud **"OpenAI Chat"** → Options:
- **Temperature**: 0.7 (par défaut)
  - Plus bas (0.3) = Réponses plus prévisibles et cohérentes
  - Plus haut (0.9) = Réponses plus créatives et variées

### Modifier le System Prompt

Dans le nœud **"Prepare Messages"**, vous pouvez modifier le texte du `systemMessage` pour:
- Ajouter des informations sur vos produits spécifiques
- Changer le ton (plus formel, plus décontracté)
- Ajouter des instructions spécifiques

## Dépannage

### Le webhook ne fonctionne pas

**Vérifiez que:**
- Le workflow est bien **"Active"** (switch en haut à droite)
- L'URL du webhook est correctement copiée dans les secrets Manus
- Le credential OpenAI est bien configuré

### Erreur "Invalid API Key"

**Solution:**
- Vérifiez votre clé API OpenAI sur https://platform.openai.com/api-keys
- Assurez-vous d'avoir des crédits sur votre compte OpenAI

### Réponses lentes

**Solutions:**
- Utilisez `gpt-4o-mini` au lieu de `gpt-4o`
- Réduisez `maxTokens` à 300 dans les options OpenAI

## Monitoring

Pour voir les exécutions du workflow:
1. Dans n8n, cliquez sur l'onglet **"Executions"**
2. Vous verrez toutes les conversations passées
3. Cliquez sur une exécution pour voir les détails

## Support

Pour toute question:
- Documentation n8n: https://docs.n8n.io
- Documentation OpenAI: https://platform.openai.com/docs
- Support Les Touillés: info@lestouilles.ca
