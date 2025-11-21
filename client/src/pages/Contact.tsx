import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Mail, MapPin, Facebook, Instagram, Globe } from "lucide-react";
import { APP_LOGO, APP_TITLE } from "@/const";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { CartSidebar } from "@/components/CartSidebar";
import { Chatbot } from "@/components/Chatbot";

export default function Contact() {
  const { language, setLanguage, t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    eventType: "",
    eventDate: "",
    guestCount: "",
    message: "",
  });

  const submitMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      toast.success(t('contact.success'));
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        eventType: "",
        eventDate: "",
        guestCount: "",
        message: "",
      });
    },
    onError: () => {
      toast.error(t('contact.error'));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      subject: formData.subject || undefined,
      eventType: formData.eventType || undefined,
      eventDate: formData.eventDate || undefined,
      guestCount: formData.guestCount ? parseInt(formData.guestCount) : undefined,
      message: formData.message,
      language,
    });
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
            <a href="/" className="text-sm font-medium hover:text-primary transition-colors">
              {t('nav.home')}
            </a>
            <a href="#menu" className="text-sm font-medium hover:text-primary transition-colors">
              {t('nav.menu')}
            </a>
            <a href="/about" className="text-sm font-medium hover:text-primary transition-colors">
              {t('nav.about')}
            </a>
            <a href="/contact" className="text-sm font-medium text-primary">
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

      {/* Contact Section */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <h1 className="text-4xl font-bold text-center mb-4">{t('contact.title')}</h1>
          <p className="text-center text-muted-foreground mb-12">
            {language === 'fr' 
              ? 'Remplissez le formulaire ci-dessous et nous vous contacterons dans les plus brefs délais.'
              : 'Fill out the form below and we will contact you as soon as possible.'}
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>{t('contact.title')}</CardTitle>
                <CardDescription>
                  {language === 'fr'
                    ? 'Envoyez-nous un message'
                    : 'Send us a message'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">{t('contact.name')} *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">{t('contact.email')} *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">{t('contact.phone')}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="eventType">{t('contact.eventType')}</Label>
                    <Select
                      value={formData.eventType}
                      onValueChange={(value) => setFormData({ ...formData, eventType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={language === 'fr' ? 'Sélectionner' : 'Select'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wedding">{t('event.wedding')}</SelectItem>
                        <SelectItem value="corporate">{t('event.corporate')}</SelectItem>
                        <SelectItem value="private">{t('event.private')}</SelectItem>
                        <SelectItem value="general">{t('event.general')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="eventDate">{t('contact.eventDate')}</Label>
                      <Input
                        id="eventDate"
                        type="date"
                        value={formData.eventDate}
                        onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="guestCount">{t('contact.guestCount')}</Label>
                      <Input
                        id="guestCount"
                        type="number"
                        value={formData.guestCount}
                        onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message">{t('contact.message')} *</Label>
                    <Textarea
                      id="message"
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={submitMutation.isPending}>
                    {submitMutation.isPending ? t('common.loading') : t('contact.submit')}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'fr' ? 'Coordonnées' : 'Contact Information'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Montréal, QC</p>
                      <p className="text-sm text-muted-foreground">Canada</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">(514) 123-4567</p>
                      <p className="text-sm text-muted-foreground">
                        {language === 'fr' ? 'Lun-Ven: 9h-18h' : 'Mon-Fri: 9am-6pm'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">info@lestouilles.ca</p>
                      <p className="text-sm text-muted-foreground">
                        {language === 'fr' ? 'Réponse sous 24h' : 'Response within 24h'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('footer.followUs')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <a
                      href="#"
                      className="flex items-center justify-center h-12 w-12 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                    >
                      <Facebook className="h-6 w-6" />
                    </a>
                    <a
                      href="#"
                      className="flex items-center justify-center h-12 w-12 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                    >
                      <Instagram className="h-6 w-6" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}
