import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ArrowLeft, Save, Store, Clock, Mail, CreditCard, Bell } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface Settings {
  siteName: string;
  siteDescription: string;
  logo: string;
  favicon: string;
  email: string;
  phone: string;
  address: string;
  googleMapsUrl: string;
  businessHours: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };
  facebook: string;
  instagram: string;
  twitter: string;
  enableReservations: boolean;
  enableOnlineOrders: boolean;
  enableDelivery: boolean;
  minimumOrderAmount: number;
  deliveryFee: number;
  taxRate: number;
  orderNotificationEmail: string;
  reservationNotificationEmail: string;
}

const DEFAULT_SETTINGS: Settings = {
  siteName: "Les Touilles",
  siteDescription: "Service de traiteur haut de gamme",
  logo: "/logo.png",
  favicon: "/favicon.ico",
  email: "contact@lestouilles.ca",
  phone: "",
  address: "",
  googleMapsUrl: "",
  businessHours: {
    monday: { open: "09:00", close: "17:00", closed: false },
    tuesday: { open: "09:00", close: "17:00", closed: false },
    wednesday: { open: "09:00", close: "17:00", closed: false },
    thursday: { open: "09:00", close: "17:00", closed: false },
    friday: { open: "09:00", close: "17:00", closed: false },
    saturday: { open: "10:00", close: "14:00", closed: false },
    sunday: { open: "00:00", close: "00:00", closed: true },
  },
  facebook: "",
  instagram: "",
  twitter: "",
  enableReservations: true,
  enableOnlineOrders: true,
  enableDelivery: true,
  minimumOrderAmount: 25,
  deliveryFee: 5,
  taxRate: 14.975,
  orderNotificationEmail: "",
  reservationNotificationEmail: "",
};

const DAYS = [
  { key: "monday", label: "Lundi" },
  { key: "tuesday", label: "Mardi" },
  { key: "wednesday", label: "Mercredi" },
  { key: "thursday", label: "Jeudi" },
  { key: "friday", label: "Vendredi" },
  { key: "saturday", label: "Samedi" },
  { key: "sunday", label: "Dimanche" },
] as const;

export default function AdminSettings() {
  const [, setLocation] = useLocation();
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  // tRPC queries and mutations
  const { data: savedSettings, isLoading } = trpc.siteSettings.get.useQuery();
  const updateMutation = trpc.siteSettings.update.useMutation({
    onSuccess: () => {
      toast.success("Parametres sauvegardes avec succes");
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de la sauvegarde");
    },
  });

  // Load settings when data arrives
  useEffect(() => {
    if (savedSettings) {
      setSettings({ ...DEFAULT_SETTINGS, ...savedSettings });
    }
  }, [savedSettings]);

  const handleSave = () => {
    updateMutation.mutate(settings);
  };

  const updateBusinessHours = (
    day: keyof Settings["businessHours"],
    field: "open" | "close" | "closed",
    value: string | boolean
  ) => {
    setSettings({
      ...settings,
      businessHours: {
        ...settings.businessHours,
        [day]: {
          ...settings.businessHours[day],
          [field]: value,
        },
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/admin/products")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Parametres
            </h1>
          </div>
          <Button onClick={handleSave} disabled={updateMutation.isPending}>
            <Save className="h-4 w-4 mr-2" />
            {updateMutation.isPending ? "Sauvegarde..." : "Sauvegarder"}
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-2">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              <span className="hidden sm:inline">General</span>
            </TabsTrigger>
            <TabsTrigger value="hours" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Horaires</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">Contact</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Commandes</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Informations Generales</CardTitle>
                <CardDescription>
                  Configurez les informations de base de votre site
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="siteName">Nom du Site</Label>
                    <Input
                      id="siteName"
                      value={settings.siteName}
                      onChange={(e) =>
                        setSettings({ ...settings, siteName: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="logo">URL du Logo</Label>
                    <Input
                      id="logo"
                      value={settings.logo}
                      onChange={(e) =>
                        setSettings({ ...settings, logo: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="siteDescription">Description du Site</Label>
                  <Textarea
                    id="siteDescription"
                    value={settings.siteDescription}
                    onChange={(e) =>
                      setSettings({ ...settings, siteDescription: e.target.value })
                    }
                    rows={3}
                  />
                </div>
                <Separator />
                <div>
                  <h3 className="text-lg font-medium mb-4">Reseaux Sociaux</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="facebook">Facebook</Label>
                      <Input
                        id="facebook"
                        value={settings.facebook}
                        onChange={(e) =>
                          setSettings({ ...settings, facebook: e.target.value })
                        }
                        placeholder="https://facebook.com/..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input
                        id="instagram"
                        value={settings.instagram}
                        onChange={(e) =>
                          setSettings({ ...settings, instagram: e.target.value })
                        }
                        placeholder="https://instagram.com/..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="twitter">Twitter</Label>
                      <Input
                        id="twitter"
                        value={settings.twitter}
                        onChange={(e) =>
                          setSettings({ ...settings, twitter: e.target.value })
                        }
                        placeholder="https://twitter.com/..."
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hours">
            <Card>
              <CardHeader>
                <CardTitle>Heures d Ouverture</CardTitle>
                <CardDescription>
                  Definissez vos heures d operation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {DAYS.map(({ key, label }) => (
                    <div
                      key={key}
                      className="flex flex-col sm:flex-row sm:items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                    >
                      <div className="w-28 font-medium">{label}</div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={!settings.businessHours[key].closed}
                          onCheckedChange={(checked) =>
                            updateBusinessHours(key, "closed", !checked)
                          }
                        />
                        <span className="text-sm text-gray-500">
                          {settings.businessHours[key].closed ? "Ferme" : "Ouvert"}
                        </span>
                      </div>
                      {!settings.businessHours[key].closed && (
                        <div className="flex items-center gap-2 flex-1">
                          <Input
                            type="time"
                            value={settings.businessHours[key].open}
                            onChange={(e) =>
                              updateBusinessHours(key, "open", e.target.value)
                            }
                            className="w-32"
                          />
                          <span>a</span>
                          <Input
                            type="time"
                            value={settings.businessHours[key].close}
                            onChange={(e) =>
                              updateBusinessHours(key, "close", e.target.value)
                            }
                            className="w-32"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Informations de Contact</CardTitle>
                <CardDescription>
                  Comment vos clients peuvent vous joindre
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.email}
                      onChange={(e) =>
                        setSettings({ ...settings, email: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telephone</Label>
                    <Input
                      id="phone"
                      value={settings.phone}
                      onChange={(e) =>
                        setSettings({ ...settings, phone: e.target.value })
                      }
                      placeholder="(514) 555-1234"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Adresse</Label>
                  <Textarea
                    id="address"
                    value={settings.address}
                    onChange={(e) =>
                      setSettings({ ...settings, address: e.target.value })
                    }
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="googleMapsUrl">Lien Google Maps</Label>
                  <Input
                    id="googleMapsUrl"
                    value={settings.googleMapsUrl}
                    onChange={(e) =>
                      setSettings({ ...settings, googleMapsUrl: e.target.value })
                    }
                    placeholder="https://maps.google.com/..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Parametres des Commandes</CardTitle>
                <CardDescription>
                  Configurez les options de commande et livraison
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Reservations en ligne</Label>
                      <p className="text-sm text-gray-500">
                        Permettre aux clients de faire des reservations
                      </p>
                    </div>
                    <Switch
                      checked={settings.enableReservations}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, enableReservations: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Commandes en ligne</Label>
                      <p className="text-sm text-gray-500">
                        Permettre aux clients de commander en ligne
                      </p>
                    </div>
                    <Switch
                      checked={settings.enableOnlineOrders}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, enableOnlineOrders: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Service de livraison</Label>
                      <p className="text-sm text-gray-500">
                        Offrir la livraison a domicile
                      </p>
                    </div>
                    <Switch
                      checked={settings.enableDelivery}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, enableDelivery: checked })
                      }
                    />
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="minimumOrderAmount">Commande Minimum ($)</Label>
                    <Input
                      id="minimumOrderAmount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={settings.minimumOrderAmount}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          minimumOrderAmount: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="deliveryFee">Frais de Livraison ($)</Label>
                    <Input
                      id="deliveryFee"
                      type="number"
                      min="0"
                      step="0.01"
                      value={settings.deliveryFee}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          deliveryFee: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="taxRate">Taux de Taxe (%)</Label>
                    <Input
                      id="taxRate"
                      type="number"
                      min="0"
                      step="0.001"
                      value={settings.taxRate}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          taxRate: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Configurez ou envoyer les notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="orderNotificationEmail">
                    Email pour les Notifications de Commande
                  </Label>
                  <Input
                    id="orderNotificationEmail"
                    type="email"
                    value={settings.orderNotificationEmail}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        orderNotificationEmail: e.target.value,
                      })
                    }
                    placeholder="commandes@lestouilles.ca"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Recevez un email a chaque nouvelle commande
                  </p>
                </div>
                <div>
                  <Label htmlFor="reservationNotificationEmail">
                    Email pour les Notifications de Reservation
                  </Label>
                  <Input
                    id="reservationNotificationEmail"
                    type="email"
                    value={settings.reservationNotificationEmail}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        reservationNotificationEmail: e.target.value,
                      })
                    }
                    placeholder="reservations@lestouilles.ca"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Recevez un email a chaque nouvelle reservation
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
