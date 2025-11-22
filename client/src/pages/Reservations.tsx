import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2, Calendar as CalendarIcon, Users, MapPin, DollarSign } from "lucide-react";
import { Link } from "wouter";
import { APP_LOGO, APP_TITLE } from "@/const";

export default function Reservations() {
  const { language, toggleLanguage } = useLanguage();
  const [date, setDate] = useState<Date | undefined>(undefined);
  
  // Fetch reserved dates
  const { data: reservedDates = [] } = trpc.reservations.getReservedDates.useQuery();
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    eventType: "",
    eventTime: "",
    guestCount: "",
    venue: "",
    specialRequirements: "",
    dietaryRestrictions: "",
    estimatedBudget: "",
  });

  const createReservation = trpc.reservations.create.useMutation({
    onSuccess: () => {
      toast.success(
        language === "fr"
          ? "Réservation envoyée avec succès! Nous vous contacterons bientôt."
          : "Reservation submitted successfully! We will contact you soon."
      );
      // Reset form
      setDate(undefined);
      setFormData({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        eventType: "",
        eventTime: "",
        guestCount: "",
        venue: "",
        specialRequirements: "",
        dietaryRestrictions: "",
        estimatedBudget: "",
      });
    },
    onError: (error: { message: string }) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date) {
      toast.error(language === "fr" ? "Veuillez sélectionner une date" : "Please select a date");
      return;
    }

    createReservation.mutate({
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      eventType: formData.eventType as "wedding" | "corporate" | "private_party" | "other",
      eventDate: date.toISOString(),
      eventTime: formData.eventTime,
      guestCount: parseInt(formData.guestCount),
      venue: formData.venue || undefined,
      specialRequirements: formData.specialRequirements || undefined,
      dietaryRestrictions: formData.dietaryRestrictions || undefined,
      estimatedBudget: formData.estimatedBudget ? parseInt(formData.estimatedBudget) * 100 : undefined,
      language,
    });
  };

  const translations = {
    title: {
      fr: "Réserver un Événement",
      en: "Book an Event",
    },
    description: {
      fr: "Réservez nos services de traiteur pour votre mariage, événement corporatif ou fête privée",
      en: "Book our catering services for your wedding, corporate event, or private party",
    },
    selectDate: {
      fr: "Sélectionnez une Date",
      en: "Select a Date",
    },
    eventDetails: {
      fr: "Détails de l'Événement",
      en: "Event Details",
    },
    name: {
      fr: "Nom complet",
      en: "Full name",
    },
    email: {
      fr: "Adresse email",
      en: "Email address",
    },
    phone: {
      fr: "Numéro de téléphone",
      en: "Phone number",
    },
    eventType: {
      fr: "Type d'événement",
      en: "Event type",
    },
    wedding: {
      fr: "Mariage",
      en: "Wedding",
    },
    corporate: {
      fr: "Événement corporatif",
      en: "Corporate event",
    },
    privateParty: {
      fr: "Fête privée",
      en: "Private party",
    },
    other: {
      fr: "Autre",
      en: "Other",
    },
    eventTime: {
      fr: "Heure de l'événement",
      en: "Event time",
    },
    guestCount: {
      fr: "Nombre d'invités",
      en: "Number of guests",
    },
    venue: {
      fr: "Lieu de l'événement (optionnel)",
      en: "Event venue (optional)",
    },
    specialRequirements: {
      fr: "Exigences spéciales (optionnel)",
      en: "Special requirements (optional)",
    },
    dietaryRestrictions: {
      fr: "Restrictions alimentaires (optionnel)",
      en: "Dietary restrictions (optional)",
    },
    estimatedBudget: {
      fr: "Budget estimé (CAD, optionnel)",
      en: "Estimated budget (CAD, optional)",
    },
    submit: {
      fr: "Envoyer la Demande",
      en: "Submit Request",
    },
    backToHome: {
      fr: "Retour à l'accueil",
      en: "Back to home",
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center space-x-3 cursor-pointer">
                <img src={APP_LOGO} alt={APP_TITLE} className="h-12 w-12 object-contain" />
                <span className="text-2xl font-bold text-emerald-600">{APP_TITLE}</span>
              </div>
            </Link>
            <Button variant="outline" onClick={toggleLanguage}>
              {language === "fr" ? "EN" : "FR"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {translations.title[language]}
            </h1>
            <p className="text-lg text-gray-600">
              {translations.description[language]}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
            {/* Calendar Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  {translations.selectDate[language]}
                </CardTitle>
                <CardDescription>
                  {language === "fr"
                    ? "Choisissez la date de votre événement"
                    : "Choose your event date"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                  disabled={(date) => {
                    // Disable past dates
                    if (date < new Date()) return true;
                    // Disable already reserved dates
                    const dateStr = date.toISOString().split('T')[0];
                    return reservedDates.includes(dateStr);
                  }}
                />
                {reservedDates.length > 0 && (
                  <p className="text-sm text-muted-foreground text-center">
                    {language === "fr"
                      ? "Les dates grisées sont déjà réservées"
                      : "Grayed out dates are already reserved"}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Form Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {translations.eventDetails[language]}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{translations.name[language]} *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{translations.email[language]} *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">{translations.phone[language]} *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventType">{translations.eventType[language]} *</Label>
                  <Select
                    value={formData.eventType}
                    onValueChange={(value) => setFormData({ ...formData, eventType: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={language === "fr" ? "Sélectionner..." : "Select..."} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wedding">{translations.wedding[language]}</SelectItem>
                      <SelectItem value="corporate">{translations.corporate[language]}</SelectItem>
                      <SelectItem value="private_party">{translations.privateParty[language]}</SelectItem>
                      <SelectItem value="other">{translations.other[language]}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="eventTime">{translations.eventTime[language]} *</Label>
                    <Input
                      id="eventTime"
                      type="time"
                      required
                      value={formData.eventTime}
                      onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guestCount">{translations.guestCount[language]} *</Label>
                    <Input
                      id="guestCount"
                      type="number"
                      min="1"
                      required
                      value={formData.guestCount}
                      onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="venue" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {translations.venue[language]}
                  </Label>
                  <Input
                    id="venue"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    {translations.estimatedBudget[language]}
                  </Label>
                  <Input
                    id="budget"
                    type="number"
                    min="0"
                    value={formData.estimatedBudget}
                    onChange={(e) => setFormData({ ...formData, estimatedBudget: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialRequirements">{translations.specialRequirements[language]}</Label>
                  <Textarea
                    id="specialRequirements"
                    rows={3}
                    value={formData.specialRequirements}
                    onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dietaryRestrictions">{translations.dietaryRestrictions[language]}</Label>
                  <Textarea
                    id="dietaryRestrictions"
                    rows={2}
                    value={formData.dietaryRestrictions}
                    onChange={(e) => setFormData({ ...formData, dietaryRestrictions: e.target.value })}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    disabled={createReservation.isPending}
                  >
                    {createReservation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {translations.submit[language]}
                  </Button>
                  <Link href="/">
                    <Button type="button" variant="outline">
                      {translations.backToHome[language]}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 {APP_TITLE}. {language === "fr" ? "Tous droits réservés." : "All rights reserved."}</p>
        </div>
      </footer>
    </div>
  );
}
