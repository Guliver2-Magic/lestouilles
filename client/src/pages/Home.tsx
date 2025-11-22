import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useMemo, useState as useReactState } from "react";
import { CartSidebar } from "@/components/CartSidebar";
import { Chatbot } from "@/components/Chatbot";
import { 
  ShoppingCart, 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Instagram,
  ChefHat,
  Users,
  Clock,
  Star,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { APP_LOGO, APP_TITLE } from "@/const";
import { Link } from "wouter";

const carouselImages = [
  "/images/carousel/catering1.jpg",
  "/images/carousel/catering2.jpg",
  "/images/carousel/catering3.jpg",
  "/images/carousel/catering4.jpg",
];

export default function Home() {
  const { language, toggleLanguage } = useLanguage();
  const { addItem, cartOpen, setCartOpen, items, itemCount } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [scrollY, setScrollY] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Load products from database
  const { data: dbProducts = [], isLoading } = trpc.products.listActive.useQuery();

  // Convert database products to MenuItem format
  const allProducts = dbProducts.map(product => ({
    id: String(product.id),
    name: { fr: product.name, en: product.nameEn || product.name },
    description: { fr: product.description, en: product.descriptionEn || product.description },
    price: product.price / 100, // Convert cents to dollars
    image: product.image,
    category: product.category,
    servingSize: product.servingSize || undefined,
    nutrition: product.calories ? {
      calories: product.calories,
      protein: product.protein || 0,
      carbs: product.carbs || 0,
      fat: product.fat || 0,
    } : undefined,
    dietaryTags: [
      ...(product.isVegan ? ['vegan' as const] : []),
      ...(product.isVegetarian ? ['vegetarian' as const] : []),
      ...(product.isGlutenFree ? ['glutenfree' as const] : []),
      ...(product.isDairyFree ? ['dairyfree' as const] : []),
    ],
    nutritionalTip: product.nutritionalTip,
  }));

  // Get unique categories from products
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(dbProducts.map(p => p.category)));
    return ["Tous", ...uniqueCategories.sort()];
  }, [dbProducts]);

  const filteredMenu = selectedCategory === "Tous" 
    ? allProducts 
    : allProducts.filter(item => item.category === selectedCategory);

  const cartItemCount = itemCount;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const content = {
    fr: {
      nav: {
        home: "Accueil",
        about: "À Propos",
        contact: "Contact",
        order: "Commander"
      },
      hero: {
        title: "Les Touillés",
        subtitle: "Traiteur & Repas Gourmands",
        description: "Découvrez notre menu de plats variés, parfaits pour une pause lunch conviviale ou un événement mémorable",
        cta1: "Voir le Menu",
        cta2: "Nous Contacter"
      },
      features: {
        title: "Pourquoi Choisir Les Touillés?",
        quality: {
          title: "Qualité Premium",
          desc: "Ingrédients frais et locaux"
        },
        experience: {
          title: "20+ Ans d'Expérience",
          desc: "Expertise en cuisine événementielle"
        },
        service: {
          title: "Service Personnalisé",
          desc: "Adapté à vos besoins"
        }
      },
      menu: {
        title: "Notre Menu",
        subtitle: "Découvrez notre variété",
        all: "Tous",
        addToCart: "Ajouter au panier",
        servings: "Portions"
      },
      testimonial: {
        quote: "Une bouffe hallucinante et une gang tellement agréable! Allez-y tous. Engagez-les!",
        author: "Guy Paolaggi",
        role: "Client"
      },
      catering: {
        title: "Traiteur & Évènementiel",
        subtitle: "La Saveur au Cœur de Votre Évènement",
        description: "Nous comprenons l'importance de chaque détail lors de vos événements. Notre menu traiteur est conçu pour ravir vos convives avec une variété de choix savoureux et adaptés à toutes les occasions.",
        cta: "Demander un Devis"
      },
      footer: {
        contact: "Contactez-nous",
        address: "650 Rue de Montbrun, Boucherville, QC J4B 8G9",
        hours: "Heures d'ouverture",
        schedule: "Lun-Ven: 8h-18h | Sam: 9h-17h",
        follow: "Suivez-nous",
        rights: "Tous droits réservés"
      }
    },
    en: {
      nav: {
        home: "Home",
        about: "About",
        contact: "Contact",
        order: "Order"
      },
      hero: {
        title: "Les Touillés",
        subtitle: "Catering & Gourmet Meals",
        description: "Discover our variety of dishes, perfect for a friendly lunch break or a memorable event",
        cta1: "View Menu",
        cta2: "Contact Us"
      },
      features: {
        title: "Why Choose Les Touillés?",
        quality: {
          title: "Premium Quality",
          desc: "Fresh and local ingredients"
        },
        experience: {
          title: "20+ Years Experience",
          desc: "Expertise in event catering"
        },
        service: {
          title: "Personalized Service",
          desc: "Tailored to your needs"
        }
      },
      menu: {
        title: "Our Menu",
        subtitle: "Discover our variety",
        all: "All",
        addToCart: "Add to Cart",
        servings: "Servings"
      },
      testimonial: {
        quote: "Amazing food and such a pleasant team! Everyone should go. Hire them!",
        author: "Guy Paolaggi",
        role: "Client"
      },
      catering: {
        title: "Catering & Events",
        subtitle: "Flavor at the Heart of Your Event",
        description: "We understand the importance of every detail at your events. Our catering menu is designed to delight your guests with a variety of tasty choices suited to all occasions.",
        cta: "Request a Quote"
      },
      footer: {
        contact: "Contact Us",
        address: "650 Rue de Montbrun, Boucherville, QC J4B 8G9",
        hours: "Opening Hours",
        schedule: "Mon-Fri: 8am-6pm | Sat: 9am-5pm",
        follow: "Follow Us",
        rights: "All rights reserved"
      }
    }
  };

  const t = content[language];

  return (
    <div className="min-h-screen">
      {/* Header with Parallax */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <img src={APP_LOGO} alt={APP_TITLE} className="h-10 w-10" />
            <span className="font-serif text-xl font-bold text-primary">Les Touillés</span>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-6">
            <a href="#home" className="hover:text-primary transition-colors">
              {t.nav.home}
            </a>
            <a href="#menu" className="hover:text-primary transition-colors">
              {language === "fr" ? "Menu" : "Menu"}
            </a>
            <a href="/about" className="hover:text-primary transition-colors">
              {t.nav.about}
            </a>
            <a href="/portfolio" className="hover:text-primary transition-colors">
              {language === "fr" ? "Portfolio" : "Portfolio"}
            </a>
            <a href="/reservations" className="hover:text-primary transition-colors">
              {language === "fr" ? "Réservations" : "Reservations"}
            </a>
            <a href="/contact" className="hover:text-primary transition-colors">
              {t.nav.contact}
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="font-medium"
            >
              {language === "fr" ? "EN" : "FR"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCartOpen(true)}
              className="relative"
            >
              <ShoppingCart className="h-4 w-4" />
              {itemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                  {itemCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-background border-t">
            <nav className="container flex flex-col py-4 space-y-3">
              <a href="#home" className="hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>
                {t.nav.home}
              </a>
              <a href="#menu" className="hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>
                {language === "fr" ? "Menu" : "Menu"}
              </a>
              <a href="/about" className="hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>
                {t.nav.about}
              </a>
              <a href="/portfolio" className="hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>
                {language === "fr" ? "Portfolio" : "Portfolio"}
              </a>
              <a href="/reservations" className="hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>
                {language === "fr" ? "Réservations" : "Reservations"}
              </a>
              <a href="/contact" className="hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>
                {t.nav.contact}
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section with Image Carousel */}
      <section 
        id="home"
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Carousel Images */}
        <div className="absolute inset-0">
          {carouselImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                transform: `translateY(${scrollY * 0.5}px)`,
              }}
            >
              <img 
                src={image} 
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />
        
        {/* Carousel Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Carousel Dots */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide 
                  ? 'bg-white w-8' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        {/* Content */}
        <div 
          className="relative z-10 text-center text-white px-4"
          style={{
            transform: `translateY(${scrollY * 0.3}px)`,
            opacity: 1 - scrollY / 500
          }}
        >
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4">
            {t.hero.title}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-2 font-light tracking-wide">
            {t.hero.subtitle}
          </p>
          <p className="text-base sm:text-lg md:text-xl mb-8 max-w-2xl mx-auto px-4">
            {t.hero.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90" onClick={() => {
              document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              {t.hero.cta1}
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white" asChild>
              <Link href="/contact">{t.hero.cta2}</Link>
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white rounded-full" />
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              {t.menu.title}
            </h2>
            <p className="text-lg text-muted-foreground">{t.menu.subtitle}</p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8 px-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="rounded-full"
              >
                {language === "fr" ? category : category}
              </Button>
            ))}
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredMenu.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-xl transition-shadow group">
                <div className="relative h-48 overflow-hidden bg-muted">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.name[language]}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.querySelector('.fallback-icon')?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className="fallback-icon hidden absolute inset-0 flex items-center justify-center">
                    <ChefHat className="h-16 w-16 text-muted-foreground/20" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  {item.dietaryTags && item.dietaryTags.length > 0 && (
                    <div className="absolute top-2 right-2 z-20 flex gap-1">
                      {item.dietaryTags.map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-1">
                    {item.name[language]}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {item.description[language]}
                  </p>
                  
                  {/* Servings */}
                  {item.servingSize && (
                    <div className="mb-2 text-sm">
                      <span className="font-medium text-primary">
                        👥 {item.servingSize}
                      </span>
                    </div>
                  )}

                  {/* Nutrition Information */}
                  {item.nutrition && (
                    <div className="mb-3 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-md border border-amber-200 dark:border-amber-800">
                      <div className="grid grid-cols-4 gap-1 text-xs text-center">
                        <div>
                          <div className="font-bold text-amber-700 dark:text-amber-300">{item.nutrition.calories}</div>
                          <div className="text-muted-foreground">cal</div>
                        </div>
                        <div>
                          <div className="font-bold text-amber-700 dark:text-amber-300">{item.nutrition.protein}g</div>
                          <div className="text-muted-foreground">prot</div>
                        </div>
                        <div>
                          <div className="font-bold text-amber-700 dark:text-amber-300">{item.nutrition.carbs}g</div>
                          <div className="text-muted-foreground">gluc</div>
                        </div>
                        <div>
                          <div className="font-bold text-amber-700 dark:text-amber-300">{item.nutrition.fat}g</div>
                          <div className="text-muted-foreground">lip</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Nutritional Tips */}
                  {item.nutritionalTip && (
                    <div className="mb-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
                      <p className="text-xs text-green-700 dark:text-green-300 flex items-start gap-1">
                        <span className="text-green-600 dark:text-green-400 font-bold">💡</span>
                        <span>{item.nutritionalTip}</span>
                      </p>
                    </div>
                  )}
                  
                  {/* Price */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-primary">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => {
                    const dbProduct = dbProducts.find(p => p.id === Number(item.id));
                    if (dbProduct) addItem(dbProduct);
                  }}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {t.menu.addToCart}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container text-center">
          <Star className="h-12 w-12 mx-auto mb-6 fill-current" />
          <blockquote className="text-2xl md:text-3xl font-serif italic mb-6 max-w-3xl mx-auto">
            "{t.testimonial.quote}"
          </blockquote>
          <p className="text-lg font-medium">{t.testimonial.author}</p>
          <p className="text-sm opacity-90">{t.testimonial.role}</p>
        </div>
      </section>

      {/* Catering CTA Section */}
      <section 
        className="py-32 relative"
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/1395964/pexels-photo-1395964.jpeg?auto=compress&cs=tinysrgb&w=1920')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed"
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="container relative z-10 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            {t.catering.title}
          </h2>
          <p className="text-xl mb-2">{t.catering.subtitle}</p>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            {t.catering.description}
          </p>
          <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-white/90" asChild>
            <Link href="/contact">{t.catering.cta}</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12">
            {t.features.title}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ChefHat className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{t.features.quality.title}</h3>
                <p className="text-muted-foreground">{t.features.quality.desc}</p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{t.features.experience.title}</h3>
                <p className="text-muted-foreground">{t.features.experience.desc}</p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{t.features.service.title}</h3>
                <p className="text-muted-foreground">{t.features.service.desc}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">{t.footer.contact}</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <span className="text-sm">{t.footer.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  <a href="tel:514-703-8678" className="text-sm hover:text-primary">514-703-8678</a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  <a href="mailto:info@lestouilles.ca" className="text-sm hover:text-primary">info@lestouilles.ca</a>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">{t.footer.hours}</h3>
              <p className="text-sm text-muted-foreground">{t.footer.schedule}</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">{t.footer.follow}</h3>
              <div className="flex gap-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  <Instagram className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 Les Touillés. {t.footer.rights}</p>
          </div>
        </div>
      </footer>

      {/* Cart Sidebar */}
      <CartSidebar />

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}
