import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { completeMenu, categories } from "@/data/completeMenuData";
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
  Star
} from "lucide-react";
import { APP_LOGO, APP_TITLE } from "@/const";
import { Link } from "wouter";

export default function Home() {
  const { language, toggleLanguage } = useLanguage();
  const { addToCart, cartOpen, setCartOpen, cart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [scrollY, setScrollY] = useState(0);

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredMenu = selectedCategory === "Tous" 
    ? completeMenu 
    : completeMenu.filter(item => item.category === selectedCategory);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

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
          <div className="flex items-center gap-2">
            <img src={APP_LOGO} alt={APP_TITLE} className="h-10 w-10" />
            <span className="font-serif text-xl font-bold text-primary">Les Touillés</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#home" className="hover:text-primary transition-colors">{t.nav.home}</a>
            <Link href="/about" className="hover:text-primary transition-colors">{t.nav.about}</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">{t.nav.contact}</Link>
          </nav>

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
              {cartItemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                  {cartItemCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section with Parallax Effect */}
      <section 
        id="home"
        className="relative h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1920')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed"
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />
        
        {/* Content */}
        <div 
          className="relative z-10 text-center text-white px-4"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
            opacity: 1 - scrollY / 500
          }}
        >
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-4">
            {t.hero.title}
          </h1>
          <p className="text-xl md:text-2xl mb-2 font-light tracking-wide">
            {t.hero.subtitle}
          </p>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
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
          <div className="flex flex-wrap justify-center gap-2 mb-8">
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMenu.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-xl transition-shadow group">
                <div className="relative h-48 overflow-hidden bg-muted">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ChefHat className="h-16 w-16 text-muted-foreground/20" />
                  </div>
                  {item.dietary && (
                    <div className="absolute top-2 right-2 z-20 flex gap-1">
                      {item.dietary.map((tag) => (
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
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {item.description[language]}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-primary">
                      ${item.price.toFixed(2)}
                    </span>
                    {item.servings && (
                      <span className="text-sm text-muted-foreground">
                        {t.menu.servings}: {item.servings}
                      </span>
                    )}
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => addToCart(item)}
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
