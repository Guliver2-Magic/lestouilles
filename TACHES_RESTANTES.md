# Tâches Restantes à Implémenter - Les Touillés

## 📋 Fonctionnalités Principales Non Terminées

### Menu & Produits
- [ ] Ajouter catégorie Soupes (7 items)
- [ ] Ajouter catégorie Plats Préparés (15 items)
- [ ] Ajouter catégorie Viandes (7 items)
- [ ] Ajouter catégorie Légumes (7 items)
- [ ] Ajouter catégorie Entrées/Bouchées (3 items)
- [ ] Ajouter plus de Desserts (8 items)
- [ ] Ajouter Boîtes à Lunch - Enfants (3 items)
- [ ] Ajouter Boîtes à Lunch - Adultes (4 items)
- [ ] Ajouter catégorie Sauces (5 items)
- [ ] Compléter catégorie Boissons

### Informations Nutritionnelles
- [ ] Ajouter données nutritionnelles complètes pour tous les sandwiches
- [ ] Ajouter données nutritionnelles pour toutes les salades
- [ ] Ajouter données nutritionnelles pour tous les plats principaux
- [ ] Ajouter données nutritionnelles pour toutes les soupes
- [ ] Ajouter données nutritionnelles pour tous les desserts
- [ ] Ajouter données nutritionnelles pour toutes les boîtes à lunch
- [ ] Ajouter données nutritionnelles pour tous les items de buffet

### Images Produits
- [ ] Extraire toutes les images produits du site original lestouilles.ca
- [ ] Télécharger et sauvegarder les photos réelles des produits
- [ ] Organiser les photos par catégorie
- [ ] Mettre à jour les données menu avec les chemins des vraies photos
- [ ] Générer images spécifiques pour chaque item de menu individuel
- [ ] Vérifier que toutes les images correspondent correctement aux produits

### Images Spécifiques Manquantes
- [ ] Salade César (laitue romaine, croûtons, parmesan)
- [ ] Salade Grecque (tomates, concombres, olives, feta)
- [ ] Salade Quinoa
- [ ] Sandwich jambon-fromage classique
- [ ] Sandwich végétarien avec légumes grillés
- [ ] Sandwich poulet grillé avec avocat
- [ ] Sandwich smoked meat de Montréal
- [ ] Images pour les wraps
- [ ] Images pour les soupes
- [ ] Images pour les plats principaux
- [ ] Images pour les desserts

## 🎨 Design & UX

### Améliorations Visuelles
- [ ] Améliorer l'esthétique luxe/premium du design
- [ ] Ajouter effets de parallaxe pour les sections de catégories
- [ ] Améliorer la typographie et l'espacement
- [ ] Ajouter animations au survol et effets visuels
- [ ] Remplacer par des images haute qualité

### Vidéo Hero
- [ ] Extraire l'URL de la vidéo du site original lestouilles.ca
- [ ] Remplacer la vidéo actuelle par la vidéo originale
- [ ] Optimiser la vidéo pour le web (compression, format approprié)
- [ ] Ajouter image de secours pour navigateurs sans support vidéo
- [ ] Tester performance vidéo sur appareils mobiles
- [ ] S'assurer que la vidéo n'impacte pas la vitesse de chargement

## 🌐 Traductions

### Traductions Anglaises Manquantes
- [ ] Tous les items du menu (noms et descriptions)
- [ ] Navigation header
- [ ] Contenu footer
- [ ] Témoignages clients
- [ ] Items du portfolio
- [ ] Labels du formulaire de contact
- [ ] Messages du chatbot
- [ ] Tous les boutons et CTAs
- [ ] Contenu des pages statiques

## 🛠️ Backend & Fonctionnalités

### Procédures tRPC
- [ ] Procédures tRPC pour données menu
- [ ] Procédures tRPC pour gestion du panier

### Configuration Commandes
- [ ] Configuration des options de commande (ramassage, livraison, Uber Eats)

### Système de Réservation
- [ ] Créer table calendrier de disponibilité
- [ ] Implémenter logique de vérification de disponibilité
- [ ] Envoyer email de confirmation automatique au client

### Dashboard Admin
- [ ] Ajouter filtres par plage de dates
- [ ] Ajouter filtre par montant total
- [ ] Ajouter modal de vue détaillée des commandes
- [ ] Dashboard admin pour gestion du menu

## 📧 Communications

### Emails & Notifications
- [ ] Envoyer email de confirmation automatique aux clients (réservations)

## 📱 Contenu & Marketing

### Sections Manquantes
- [ ] Section témoignages clients
- [ ] Section portfolio/galerie avec photos d'événements
- [ ] Planificateur de repas hebdomadaire (calendrier)
- [ ] Inscription à la newsletter

### Portfolio
- [ ] Ajouter témoignages de clients d'événements

## 🔧 Chatbot n8n

### Configuration n8n
- [ ] Importer le workflow dans n8n et l'activer
- [ ] Copier l'URL webhook et l'ajouter aux variables d'environnement
- [ ] Tester webhook avec message chatbot exemple
- [ ] Vérifier fonctionnalité chatbot de bout en bout
- [ ] Vérifier que le nœud "Respond to Webhook" est correctement configuré
- [ ] Vérifier que la clé API OpenAI est correctement définie dans n8n
- [ ] Tester le workflow manuellement dans n8n pour s'assurer qu'il retourne une réponse JSON
- [ ] Vérifier que le webhook retourne le bon format JSON: {"response": "text", "shouldCaptureLead": false}

## 🚀 Améliorations Futures (Hors Scope Initial)

### Fonctionnalités Avancées
- [ ] Authentification utilisateur pour clients
- [ ] Historique des commandes
- [ ] Intégration paiement Stripe (déjà fait)
- [ ] Intégration imprimante cuisine
- [ ] Module promotions saisonnières
- [ ] Prévision de demande par IA
- [ ] Automatisation marketing par email
- [ ] Intégration agent vocal (ElevenLabs)

## 📊 Résumé

**Total des tâches restantes:** ~100+ tâches

**Catégories prioritaires:**
1. **Menu complet** - Ajouter toutes les catégories manquantes (~50 produits)
2. **Images réelles** - Remplacer images IA par photos professionnelles
3. **Traductions** - Compléter support bilingue FR/EN
4. **Informations nutritionnelles** - Données complètes pour tous les produits
5. **Configuration n8n** - Activer le chatbot intelligent

**Fonctionnalités déjà implémentées:**
- ✅ Système de commande en ligne avec Stripe
- ✅ Dashboard admin pour commandes
- ✅ Système de réservation d'événements
- ✅ Portfolio/galerie d'événements
- ✅ Plats du jour avec panneau admin
- ✅ Système d'impression des commandes
- ✅ Support bilingue partiel (structure en place)
- ✅ Chatbot avec webhook n8n (nécessite configuration)
