import { useState } from "react";
import { X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface GalleryImage {
  id: string;
  src: string;
  category: string;
  title: {
    fr: string;
    en: string;
  };
  description: {
    fr: string;
    en: string;
  };
}

const galleryImages: GalleryImage[] = [
  {
    id: "wedding-1",
    src: "/images/events/wedding-1.jpg",
    category: "weddings",
    title: { fr: "Réception de Mariage Élégante", en: "Elegant Wedding Reception" },
    description: { fr: "Service de traiteur haut de gamme pour une célébration inoubliable", en: "High-end catering service for an unforgettable celebration" }
  },
  {
    id: "wedding-2",
    src: "/images/events/wedding-2.jpg",
    category: "weddings",
    title: { fr: "Buffet de Mariage Gourmet", en: "Gourmet Wedding Buffet" },
    description: { fr: "Présentation élégante avec une variété de mets raffinés", en: "Elegant presentation with a variety of refined dishes" }
  },
  {
    id: "corporate-1",
    src: "/images/events/corporate-1.jpg",
    category: "corporate",
    title: { fr: "Déjeuner d'Affaires", en: "Business Lunch" },
    description: { fr: "Service de traiteur professionnel pour événements corporatifs", en: "Professional catering service for corporate events" }
  },
  {
    id: "corporate-2",
    src: "/images/events/corporate-2.jpg",
    category: "corporate",
    title: { fr: "Cocktail d'Entreprise", en: "Corporate Cocktail Reception" },
    description: { fr: "Canapés et hors-d'œuvres pour networking professionnel", en: "Canapés and hors d'oeuvres for professional networking" }
  },
  {
    id: "private-1",
    src: "/images/events/private-party.jpg",
    category: "private",
    title: { fr: "Fête Privée", en: "Private Party" },
    description: { fr: "Célébration festive avec une table gourmande", en: "Festive celebration with a gourmet table" }
  }
];

const translations = {
  fr: {
    title: "Notre Portfolio",
    subtitle: "Découvrez nos événements passés",
    description: "Nous sommes fiers de créer des expériences culinaires mémorables pour tous types d'événements. Explorez notre galerie pour voir comment nous transformons vos occasions spéciales en moments inoubliables.",
    categories: {
      all: "Tous",
      weddings: "Mariages",
      corporate: "Corporatif",
      private: "Fêtes Privées"
    },
    cta: {
      title: "Prêt à Planifier Votre Événement?",
      description: "Contactez-nous dès aujourd'hui pour discuter de vos besoins en traiteur",
      button: "Demander un Devis"
    }
  },
  en: {
    title: "Our Portfolio",
    subtitle: "Discover our past events",
    description: "We take pride in creating memorable culinary experiences for all types of events. Explore our gallery to see how we transform your special occasions into unforgettable moments.",
    categories: {
      all: "All",
      weddings: "Weddings",
      corporate: "Corporate",
      private: "Private Parties"
    },
    cta: {
      title: "Ready to Plan Your Event?",
      description: "Contact us today to discuss your catering needs",
      button: "Request a Quote"
    }
  }
};

export default function Portfolio() {
  const { language } = useLanguage();
  const t = translations[language];
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);

  const filteredImages = selectedCategory === "all" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  const categories = [
    { id: "all", label: t.categories.all },
    { id: "weddings", label: t.categories.weddings },
    { id: "corporate", label: t.categories.corporate },
    { id: "private", label: t.categories.private }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.title}</h1>
            <p className="text-xl mb-2 opacity-90">{t.subtitle}</p>
            <p className="text-lg opacity-80">{t.description}</p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === cat.id
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map(image => (
              <div
                key={image.id}
                className="group relative overflow-hidden rounded-lg cursor-pointer aspect-[4/3] bg-muted"
                onClick={() => setLightboxImage(image)}
              >
                <img
                  src={image.src}
                  alt={image.title[language]}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">{image.title[language]}</h3>
                    <p className="text-sm opacity-90">{image.description[language]}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.cta.title}</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t.cta.description}
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
          >
            {t.cta.button}
          </a>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-white/80 transition-colors"
            onClick={() => setLightboxImage(null)}
          >
            <X className="h-8 w-8" />
          </button>
          <div className="max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightboxImage.src}
              alt={lightboxImage.title[language]}
              className="w-full h-auto rounded-lg"
            />
            <div className="text-white mt-6 text-center">
              <h3 className="text-2xl font-bold mb-2">{lightboxImage.title[language]}</h3>
              <p className="text-lg opacity-90">{lightboxImage.description[language]}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
