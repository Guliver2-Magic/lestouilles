import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary
const translations: Record<string, Record<Language, string>> = {
  // Navigation
  'nav.home': { fr: 'Accueil', en: 'Home' },
  'nav.menu': { fr: 'Menu', en: 'Menu' },
  'nav.about': { fr: 'À Propos', en: 'About' },
  'nav.contact': { fr: 'Contact', en: 'Contact' },
  'nav.cart': { fr: 'Panier', en: 'Cart' },
  
  // Hero section
  'hero.title': { fr: 'Les Touillés', en: 'Les Touillés' },
  'hero.subtitle': { fr: 'Service de Traiteur Premium', en: 'Premium Catering Service' },
  'hero.cta.menu': { fr: 'Voir le Menu', en: 'View Menu' },
  'hero.cta.contact': { fr: 'Nous Contacter', en: 'Contact Us' },
  'hero.cta.ubereats': { fr: 'Commander sur Uber Eats', en: 'Order on Uber Eats' },
  
  // Menu categories
  'category.soups': { fr: 'Soupes', en: 'Soups' },
  'category.prepared': { fr: 'Plats Préparés', en: 'Prepared Dishes' },
  'category.meats': { fr: 'Viandes', en: 'Meats' },
  'category.vegetables': { fr: 'Légumes', en: 'Vegetables' },
  'category.appetizers': { fr: 'Bouchées', en: 'Appetizers' },
  'category.desserts': { fr: 'Desserts', en: 'Desserts' },
  'category.lunchboxes': { fr: 'Boîtes à Lunch', en: 'Lunch Boxes' },
  'category.sauces': { fr: 'Sauces', en: 'Sauces' },
  'category.beverages': { fr: 'Boissons', en: 'Beverages' },
  
  // Cart
  'cart.title': { fr: 'Votre Panier', en: 'Your Cart' },
  'cart.empty': { fr: 'Votre panier est vide', en: 'Your cart is empty' },
  'cart.total': { fr: 'Total', en: 'Total' },
  'cart.clear': { fr: 'Vider le panier', en: 'Clear cart' },
  'cart.checkout': { fr: 'Commander', en: 'Checkout' },
  'cart.add': { fr: 'Ajouter au panier', en: 'Add to cart' },
  'cart.remove': { fr: 'Retirer', en: 'Remove' },
  
  // Order configuration
  'order.type': { fr: 'Type de commande', en: 'Order type' },
  'order.pickup': { fr: 'Ramassage', en: 'Pickup' },
  'order.delivery': { fr: 'Livraison', en: 'Delivery' },
  'order.ubereats': { fr: 'Uber Eats', en: 'Uber Eats' },
  'order.date': { fr: 'Date', en: 'Date' },
  'order.time': { fr: 'Heure', en: 'Time' },
  
  // Contact form
  'contact.title': { fr: 'Contactez-nous', en: 'Contact Us' },
  'contact.name': { fr: 'Nom', en: 'Name' },
  'contact.email': { fr: 'Courriel', en: 'Email' },
  'contact.phone': { fr: 'Téléphone', en: 'Phone' },
  'contact.subject': { fr: 'Sujet', en: 'Subject' },
  'contact.message': { fr: 'Message', en: 'Message' },
  'contact.eventType': { fr: 'Type d\'événement', en: 'Event type' },
  'contact.eventDate': { fr: 'Date de l\'événement', en: 'Event date' },
  'contact.guestCount': { fr: 'Nombre d\'invités', en: 'Guest count' },
  'contact.submit': { fr: 'Envoyer', en: 'Submit' },
  'contact.success': { fr: 'Message envoyé avec succès!', en: 'Message sent successfully!' },
  'contact.error': { fr: 'Erreur lors de l\'envoi du message', en: 'Error sending message' },
  
  // Event types
  'event.wedding': { fr: 'Mariage', en: 'Wedding' },
  'event.corporate': { fr: 'Événement corporatif', en: 'Corporate event' },
  'event.private': { fr: 'Fête privée', en: 'Private party' },
  'event.general': { fr: 'Demande générale', en: 'General inquiry' },
  
  // Dietary tags
  'diet.vegan': { fr: 'Végan', en: 'Vegan' },
  'diet.vegetarian': { fr: 'Végétarien', en: 'Vegetarian' },
  'diet.glutenfree': { fr: 'Sans Gluten', en: 'Gluten-Free' },
  'diet.organic': { fr: 'Biologique', en: 'Organic' },
  'diet.lowsugar': { fr: 'Faible en Sucre', en: 'Low Sugar' },
  'diet.dairyfree': { fr: 'Sans Produits Laitiers', en: 'Dairy-Free' },
  
  // Nutritional info
  'nutrition.calories': { fr: 'Calories', en: 'Calories' },
  'nutrition.protein': { fr: 'Protéines', en: 'Protein' },
  'nutrition.carbs': { fr: 'Glucides', en: 'Carbs' },
  'nutrition.fat': { fr: 'Lipides', en: 'Fat' },
  'nutrition.servingSize': { fr: 'Portion', en: 'Serving Size' },
  
  // Testimonials
  'testimonials.title': { fr: 'Témoignages de Clients', en: 'Customer Testimonials' },
  
  // About
  'about.title': { fr: 'À Propos de Nous', en: 'About Us' },
  'about.story': { fr: 'Notre Histoire', en: 'Our Story' },
  'about.team': { fr: 'Notre Équipe', en: 'Our Team' },
  
  // Footer
  'footer.hours': { fr: 'Heures d\'ouverture', en: 'Opening Hours' },
  'footer.address': { fr: 'Adresse', en: 'Address' },
  'footer.followUs': { fr: 'Suivez-nous', en: 'Follow Us' },
  'footer.newsletter': { fr: 'Infolettre', en: 'Newsletter' },
  'footer.subscribe': { fr: 'S\'abonner', en: 'Subscribe' },
  
  // Chatbot
  'chat.title': { fr: 'Discuter avec nous', en: 'Chat with us' },
  'chat.placeholder': { fr: 'Tapez votre message...', en: 'Type your message...' },
  'chat.send': { fr: 'Envoyer', en: 'Send' },
  
  // Common
  'common.loading': { fr: 'Chargement...', en: 'Loading...' },
  'common.error': { fr: 'Erreur', en: 'Error' },
  'common.close': { fr: 'Fermer', en: 'Close' },
  'common.save': { fr: 'Enregistrer', en: 'Save' },
  'common.cancel': { fr: 'Annuler', en: 'Cancel' },
  'common.confirm': { fr: 'Confirmer', en: 'Confirm' },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('fr');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'fr' ? 'en' : 'fr');
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
