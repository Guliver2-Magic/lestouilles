import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { CartSidebar } from "@/components/CartSidebar";
import { Chatbot } from "@/components/Chatbot";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Globe, Phone, Mail, MapPin, Facebook, Instagram } from "lucide-react";
import { APP_LOGO, APP_TITLE } from "@/const";
import { menuCategories, menuItems, MenuItem } from "@/data/menuData";
import { useState } from "react";

export default function Home() {
  const { language, setLanguage, t } = useLanguage();
  const { addItem } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredItems = selectedCategory
    ? menuItems.filter(item => item.category === selectedCategory)
    : menuItems;

  const getDietaryIcon = (tag: string) => {
    const icons: Record<string, string> = {
      vegan: '🌱',
      vegetarian: '🥬',
      glutenfree: '🌾',
      organic: '🍃',
      lowsugar: '🍬',
      dairyfree: '🥛',
    };
    return icons[tag] || '';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={APP_LOGO} alt={APP_TITLE} className="h-10 w-10" />
            <span className="text-xl font-bold">{APP_TITLE}</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#menu" className="text-sm font-medium hover:text-primary transition-colors">
              {t('nav.menu')}
            </a>
            <a href="/about" className="text-sm font-medium hover:text-primary transition-colors">
              {t('nav.about')}
            </a>
            <a href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
              {t('nav.contact')}
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
            >
              <Globe className="h-4 w-4 mr-2" />
              {language.toUpperCase()}
            </Button>
            <CartSidebar />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-secondary/20">
        <div className="container text-center space-y-6 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            {t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg">
              {t('hero.cta.menu')}
            </Button>
            <Button size="lg" variant="outline" className="text-lg">
              {t('hero.cta.contact')}
            </Button>
            <Button size="lg" variant="secondary" className="text-lg">
              {t('hero.cta.ubereats')}
            </Button>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-12">{t('nav.menu')}</h2>
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
            >
              Tous / All
            </Button>
            {menuCategories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name[language]}
              </Button>
            ))}
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <Card key={item.id} className="card-hover overflow-hidden">
                <div className="aspect-video bg-muted relative">
                  <img
                    src={item.image}
                    alt={item.name[language]}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/E5E7EB/6B7280?text=Les+Touilles';
                    }}
                  />
                </div>
                <CardHeader>
                  <CardTitle className="flex items-start justify-between">
                    <span>{item.name[language]}</span>
                    <span className="text-primary font-bold">${item.price.toFixed(2)}</span>
                  </CardTitle>
                  <CardDescription>{item.description[language]}</CardDescription>
                </CardHeader>
                <CardContent>
                  {item.dietaryTags && item.dietaryTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {item.dietaryTags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {getDietaryIcon(tag)} {t(`diet.${tag}`)}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {item.nutrition && (
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>{t('nutrition.calories')}: {item.nutrition.calories} kcal</p>
                      <p>
                        {t('nutrition.protein')}: {item.nutrition.protein}g | 
                        {t('nutrition.carbs')}: {item.nutrition.carbs}g | 
                        {t('nutrition.fat')}: {item.nutrition.fat}g
                      </p>
                      {item.servingSize && <p>{t('nutrition.servingSize')}: {item.servingSize}</p>}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => addItem(item)}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {t('cart.add')}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">{t('footer.hours')}</h3>
              <p className="text-sm text-muted-foreground">
                Lundi - Vendredi: 9h - 18h<br />
                Samedi: 10h - 16h<br />
                Dimanche: Fermé
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">{t('footer.address')}</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Montréal, QC
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  (514) 123-4567
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  info@lestouilles.ca
                </p>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">{t('footer.followUs')}</h3>
              <div className="flex gap-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Instagram className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2024 {APP_TITLE}. Tous droits réservés. / All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}
