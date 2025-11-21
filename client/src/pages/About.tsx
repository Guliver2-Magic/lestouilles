import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe } from "lucide-react";
import { APP_LOGO, APP_TITLE } from "@/const";
import { CartSidebar } from "@/components/CartSidebar";
import { Chatbot } from "@/components/Chatbot";

export default function About() {
  const { language, setLanguage, t } = useLanguage();

  const story = {
    fr: {
      title: "Notre Histoire",
      content: "Les Touillés est un service de traiteur premium basé à Montréal, spécialisé dans la cuisine française et québécoise authentique. Fondée avec la passion de partager des saveurs exceptionnelles, notre entreprise s'engage à offrir des plats préparés avec des ingrédients frais et de qualité supérieure.",
      mission: "Notre Mission",
      missionText: "Nous croyons que la bonne nourriture rassemble les gens. Notre mission est de créer des expériences culinaires mémorables pour tous vos événements, qu'il s'agisse de mariages, d'événements corporatifs ou de fêtes privées.",
      values: "Nos Valeurs",
      valuesText: "Qualité, fraîcheur, authenticité et service exceptionnel sont au cœur de tout ce que nous faisons.",
    },
    en: {
      title: "Our Story",
      content: "Les Touillés is a premium catering service based in Montreal, specializing in authentic French and Quebec cuisine. Founded with a passion for sharing exceptional flavors, our company is committed to offering dishes prepared with fresh, high-quality ingredients.",
      mission: "Our Mission",
      missionText: "We believe that good food brings people together. Our mission is to create memorable culinary experiences for all your events, whether weddings, corporate events or private parties.",
      values: "Our Values",
      valuesText: "Quality, freshness, authenticity and exceptional service are at the heart of everything we do.",
    },
  };

  const content = story[language];

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
            <a href="/" className="text-sm font-medium hover:text-primary transition-colors">
              {t('nav.home')}
            </a>
            <a href="/#menu" className="text-sm font-medium hover:text-primary transition-colors">
              {t('nav.menu')}
            </a>
            <a href="/about" className="text-sm font-medium text-primary">
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

      {/* Hero */}
      <section className="relative h-[400px] flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-secondary/20">
        <div className="container text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">
            {t('about.title')}
          </h1>
          <p className="text-xl text-muted-foreground">
            {language === 'fr' ? 'Découvrez notre passion pour la cuisine' : 'Discover our passion for cuisine'}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container max-w-4xl space-y-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">{content.title}</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <p className="text-lg leading-relaxed">{content.content}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">{content.mission}</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <p className="text-lg leading-relaxed">{content.missionText}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">{content.values}</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <p className="text-lg leading-relaxed">{content.valuesText}</p>
            </CardContent>
          </Card>

          <div className="text-center pt-8">
            <h3 className="text-2xl font-bold mb-4">
              {language === 'fr' ? 'Prêt à commander?' : 'Ready to order?'}
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="/#menu">{t('hero.cta.menu')}</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="/contact">{t('hero.cta.contact')}</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}
