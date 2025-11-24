import { drizzle } from "drizzle-orm/mysql2";
import { faqs } from "./drizzle/schema.ts";

const db = drizzle(process.env.DATABASE_URL);

const faqData = [
  // Hours
  {
    questionFr: "Quels sont vos horaires d'ouverture ?",
    questionEn: "What are your opening hours?",
    answerFr: "Nous sommes ouverts du lundi au vendredi de 8h à 18h, et le samedi de 9h à 17h. Fermé le dimanche. Pour les commandes en ligne, vous pouvez commander 24/7 !",
    answerEn: "We are open Monday to Friday from 8am to 6pm, and Saturday from 9am to 5pm. Closed on Sunday. For online orders, you can order 24/7!",
    keywordsFr: "horaire,heure,ouvert,fermeture,ouverture,quand,jour,semaine",
    keywordsEn: "hours,open,close,schedule,when,day,week,opening",
    category: "hours",
    displayOrder: 1,
  },
  
  // Delivery
  {
    questionFr: "Quelles sont les options de livraison ?",
    questionEn: "What are the delivery options?",
    answerFr: "Nous offrons 3 options : (1) Ramassage gratuit en magasin, (2) Livraison à domicile (frais de 8$), et (3) Commande via Uber Eats. La livraison est disponible dans un rayon de 15km.",
    answerEn: "We offer 3 options: (1) Free store pickup, (2) Home delivery ($8 fee), and (3) Order via Uber Eats. Delivery is available within a 15km radius.",
    keywordsFr: "livraison,delivery,ramassage,pickup,uber,eats,frais,coût,gratuit",
    keywordsEn: "delivery,pickup,uber,eats,fee,cost,free,shipping",
    category: "delivery",
    displayOrder: 2,
  },
  
  {
    questionFr: "Quel est le délai de livraison ?",
    questionEn: "What is the delivery time?",
    answerFr: "Pour le ramassage, votre commande est prête en 2-4 heures. Pour la livraison à domicile, comptez 4-6 heures. Vous pouvez aussi planifier une livraison future lors du checkout.",
    answerEn: "For pickup, your order is ready in 2-4 hours. For home delivery, allow 4-6 hours. You can also schedule a future delivery at checkout.",
    keywordsFr: "délai,temps,combien,rapide,quand,prêt,attendre",
    keywordsEn: "time,how,long,fast,when,ready,wait,delivery",
    category: "delivery",
    displayOrder: 3,
  },
  
  // Allergens
  {
    questionFr: "Comment savoir si un plat contient des allergènes ?",
    questionEn: "How do I know if a dish contains allergens?",
    answerFr: "Chaque plat sur notre menu indique les allergènes principaux (gluten, produits laitiers, noix, fruits de mer, etc.). Pour des questions spécifiques, contactez-nous au moment de la commande.",
    answerEn: "Each dish on our menu indicates major allergens (gluten, dairy, nuts, seafood, etc.). For specific questions, contact us when ordering.",
    keywordsFr: "allergène,allergie,gluten,lactose,noix,arachide,fruits de mer,intolérance",
    keywordsEn: "allergen,allergy,gluten,lactose,nuts,peanut,seafood,intolerance",
    category: "allergens",
    displayOrder: 4,
  },
  
  // Pricing
  {
    questionFr: "Quels sont vos prix ?",
    questionEn: "What are your prices?",
    answerFr: "Nos plats varient entre 11$ et 32$ selon le type. Les boîtes à lunch pour enfants sont à partir de 11$, les plats principaux entre 15$ et 32$. Consultez notre menu complet pour voir tous les prix.",
    answerEn: "Our dishes range from $11 to $32 depending on the type. Kids' lunch boxes start at $11, main dishes range from $15 to $32. Check our full menu to see all prices.",
    keywordsFr: "prix,coût,combien,tarif,cher,budget,argent",
    keywordsEn: "price,cost,how,much,rate,expensive,budget,money",
    category: "pricing",
    displayOrder: 5,
  },
  
  {
    questionFr: "Offrez-vous des rabais ou promotions ?",
    questionEn: "Do you offer discounts or promotions?",
    answerFr: "Oui ! Consultez notre section 'Plats du Jour' pour des spéciaux quotidiens avec jusqu'à 33% de rabais. Inscrivez-vous à notre infolettre pour recevoir des codes promo exclusifs.",
    answerEn: "Yes! Check our 'Daily Specials' section for daily deals with up to 33% off. Sign up for our newsletter to receive exclusive promo codes.",
    keywordsFr: "rabais,promotion,spécial,réduction,code,promo,économiser",
    keywordsEn: "discount,promotion,special,deal,code,promo,save",
    category: "pricing",
    displayOrder: 6,
  },
  
  // Sous-vide preparation
  {
    questionFr: "Comment préparer les plats sous-vide ?",
    questionEn: "How do I prepare the sous-vide dishes?",
    answerFr: "C'est très simple ! Déposez le sachet sous-vide dans une casserole d'eau chaude (frémissante, pas bouillante). Laissez réchauffer 10-15 minutes. C'est prêt ! Pas besoin de décongeler au préalable.",
    answerEn: "It's very simple! Drop the vacuum-sealed bag in a pot of hot water (simmering, not boiling). Let it heat for 10-15 minutes. It's ready! No need to defrost beforehand.",
    keywordsFr: "préparer,préparation,cuire,cuisson,réchauffer,sous-vide,sachet,comment",
    keywordsEn: "prepare,preparation,cook,cooking,heat,sous-vide,bag,how",
    category: "preparation",
    displayOrder: 7,
  },
  
  // Reservations
  {
    questionFr: "Comment réserver pour un événement ?",
    questionEn: "How do I book for an event?",
    answerFr: "Visitez notre page 'Réservations' et remplissez le formulaire avec les détails de votre événement (type, nombre d'invités, date). Nous vous contacterons dans les 24h pour confirmer et personnaliser votre menu.",
    answerEn: "Visit our 'Reservations' page and fill out the form with your event details (type, number of guests, date). We will contact you within 24 hours to confirm and customize your menu.",
    keywordsFr: "réservation,réserver,événement,mariage,corporatif,fête,traiteur,buffet",
    keywordsEn: "reservation,book,event,wedding,corporate,party,catering,buffet",
    category: "reservations",
    displayOrder: 8,
  },
  
  // Contact
  {
    questionFr: "Comment vous contacter ?",
    questionEn: "How do I contact you?",
    answerFr: "Vous pouvez nous joindre via le formulaire de contact sur notre site web, ou directement par ce chatbot. Pour les urgences, appelez-nous pendant nos heures d'ouverture.",
    answerEn: "You can reach us via the contact form on our website, or directly through this chatbot. For emergencies, call us during our opening hours.",
    keywordsFr: "contact,contacter,joindre,téléphone,email,message,aide,support",
    keywordsEn: "contact,reach,phone,email,message,help,support",
    category: "contact",
    displayOrder: 9,
  },
  
  // Minimum order
  {
    questionFr: "Y a-t-il un montant minimum de commande ?",
    questionEn: "Is there a minimum order amount?",
    answerFr: "Pour le ramassage, il n'y a pas de minimum. Pour la livraison à domicile, le minimum est de 30$ avant taxes. Pas de minimum pour les commandes Uber Eats (selon leurs conditions).",
    answerEn: "For pickup, there is no minimum. For home delivery, the minimum is $30 before taxes. No minimum for Uber Eats orders (subject to their terms).",
    keywordsFr: "minimum,commande,montant,combien,moins",
    keywordsEn: "minimum,order,amount,how,much,least",
    category: "ordering",
    displayOrder: 10,
  },
];

async function seedFAQ() {
  console.log("🌱 Seeding FAQ data...");
  
  try {
    for (const faq of faqData) {
      await db.insert(faqs).values(faq);
      console.log(`✅ Added FAQ: ${faq.questionFr}`);
    }
    
    console.log(`\n🎉 Successfully seeded ${faqData.length} FAQs!`);
  } catch (error) {
    console.error("❌ Error seeding FAQ:", error);
    throw error;
  }
}

seedFAQ()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
