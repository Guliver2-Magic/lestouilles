import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { CalendarIcon, Loader2, ShoppingCart, Truck, Store } from "lucide-react";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const { language } = useLanguage();
  const [, setLocation] = useLocation();
  
  // Form state
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "delivery">("pickup");
  const [deliveryDate, setDeliveryDate] = useState<Date>();
  const [deliveryTime, setDeliveryTime] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [notes, setNotes] = useState("");

  const createCheckoutMutation = trpc.orders.createCheckout.useMutation({
    onSuccess: (data) => {
      // Open Stripe checkout in new tab
      window.open(data.checkoutUrl, "_blank");
      toast.success(t.checkout.redirecting);
      
      // Clear cart and redirect to order confirmation
      clearCart();
      setLocation(`/order-confirmation?session_id=${data.sessionId}`);
    },
    onError: (error) => {
      toast.error(error.message || t.checkout.error);
    },
  });

  const content = {
    fr: {
      title: "Finaliser la Commande",
      cart: {
        title: "Votre Panier",
        empty: "Votre panier est vide",
        item: "article",
        items: "articles",
      },
      customer: {
        title: "Informations Client",
        name: "Nom complet",
        email: "Email",
        phone: "Téléphone",
      },
      delivery: {
        title: "Livraison",
        method: "Méthode de livraison",
        pickup: "Ramassage en magasin",
        deliveryOption: "Livraison à domicile",
        date: "Date de livraison",
        time: "Heure de livraison",
        address: "Adresse de livraison",
        instructions: "Instructions de livraison",
        notes: "Notes spéciales",
        selectDate: "Sélectionner une date",
      },
      summary: {
        title: "Résumé",
        subtotal: "Sous-total",
        delivery: "Frais de livraison",
        tax: "Taxes (TPS + TVQ)",
        total: "Total",
      },
      checkout: {
        button: "Procéder au paiement",
        processing: "Traitement...",
        redirecting: "Redirection vers le paiement sécurisé...",
        error: "Erreur lors de la création de la commande",
      },
      validation: {
        fillFields: "Veuillez remplir tous les champs requis",
        selectDate: "Veuillez sélectionner une date de livraison",
        selectTime: "Veuillez sélectionner une heure de livraison",
        addressRequired: "L'adresse de livraison est requise",
      },
    },
    en: {
      title: "Checkout",
      cart: {
        title: "Your Cart",
        empty: "Your cart is empty",
        item: "item",
        items: "items",
      },
      customer: {
        title: "Customer Information",
        name: "Full Name",
        email: "Email",
        phone: "Phone",
      },
      delivery: {
        title: "Delivery",
        method: "Delivery Method",
        pickup: "Store Pickup",
        deliveryOption: "Home Delivery",
        date: "Delivery Date",
        time: "Delivery Time",
        address: "Delivery Address",
        instructions: "Delivery Instructions",
        notes: "Special Notes",
        selectDate: "Select a date",
      },
      summary: {
        title: "Summary",
        subtotal: "Subtotal",
        delivery: "Delivery Fee",
        tax: "Tax (GST + QST)",
        total: "Total",
      },
      checkout: {
        button: "Proceed to Payment",
        processing: "Processing...",
        redirecting: "Redirecting to secure payment...",
        error: "Error creating order",
      },
      validation: {
        fillFields: "Please fill in all required fields",
        selectDate: "Please select a delivery date",
        selectTime: "Please select a delivery time",
        addressRequired: "Delivery address is required",
      },
    },
  };

  const t = content[language];

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = deliveryMethod === "delivery" ? 10 : 0;
  const tax = (subtotal + deliveryFee) * 0.14975; // Quebec tax rate
  const total = subtotal + deliveryFee + tax;

  const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00"
  ];

  const handleCheckout = async () => {
    // Validation
    if (!customerName || !customerEmail || !customerPhone) {
      toast.error(t.validation.fillFields);
      return;
    }

    if (!deliveryDate) {
      toast.error(t.validation.selectDate);
      return;
    }

    if (!deliveryTime) {
      toast.error(t.validation.selectTime);
      return;
    }

    if (deliveryMethod === "delivery" && !deliveryAddress) {
      toast.error(t.validation.addressRequired);
      return;
    }

    // Create checkout session
    createCheckoutMutation.mutate({
      customerName,
      customerEmail,
      customerPhone,
      deliveryMethod,
      deliveryDate: deliveryDate.toISOString(),
      deliveryTime,
      deliveryAddress: deliveryMethod === "delivery" ? deliveryAddress : undefined,
      deliveryInstructions,
      notes,
      items: cart.map(item => ({
        productId: item.id,
        productName: item.name[language],
        productCategory: item.category,
        productImage: item.image,
        unitPrice: Math.round(item.price * 100), // Convert to cents
        quantity: item.quantity,
      })),
      language,
    });
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-20 pb-12">
        <div className="container max-w-2xl">
          <Card>
            <CardContent className="pt-6 text-center">
              <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">{t.cart.empty}</h2>
              <Button onClick={() => setLocation("/")} className="mt-4">
                {language === "fr" ? "Retour au Menu" : "Back to Menu"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-muted/30">
      <div className="container max-w-6xl">
        <h1 className="text-3xl font-serif font-bold mb-8">{t.title}</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>{t.customer.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">{t.customer.name} *</Label>
                  <Input
                    id="name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">{t.customer.email} *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">{t.customer.phone} *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Delivery Information */}
            <Card>
              <CardHeader>
                <CardTitle>{t.delivery.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Delivery Method */}
                <div>
                  <Label>{t.delivery.method} *</Label>
                  <RadioGroup value={deliveryMethod} onValueChange={(value: any) => setDeliveryMethod(value)}>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                      <RadioGroupItem value="pickup" id="pickup" />
                      <Label htmlFor="pickup" className="flex items-center gap-2 cursor-pointer flex-1">
                        <Store className="h-5 w-5" />
                        {t.delivery.pickup}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                      <RadioGroupItem value="delivery" id="delivery" />
                      <Label htmlFor="delivery" className="flex items-center gap-2 cursor-pointer flex-1">
                        <Truck className="h-5 w-5" />
                        {t.delivery.deliveryOption} (+${deliveryFee.toFixed(2)})
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Delivery Date */}
                <div>
                  <Label>{t.delivery.date} *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {deliveryDate ? format(deliveryDate, "PPP", { locale: language === "fr" ? fr : enUS }) : t.delivery.selectDate}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={deliveryDate}
                        onSelect={setDeliveryDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Delivery Time */}
                <div>
                  <Label htmlFor="time">{t.delivery.time} *</Label>
                  <select
                    id="time"
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    required
                  >
                    <option value="">-- {language === "fr" ? "Sélectionner" : "Select"} --</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>

                {/* Delivery Address (if delivery selected) */}
                {deliveryMethod === "delivery" && (
                  <>
                    <div>
                      <Label htmlFor="address">{t.delivery.address} *</Label>
                      <Textarea
                        id="address"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        rows={3}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="instructions">{t.delivery.instructions}</Label>
                      <Textarea
                        id="instructions"
                        value={deliveryInstructions}
                        onChange={(e) => setDeliveryInstructions(e.target.value)}
                        rows={2}
                      />
                    </div>
                  </>
                )}

                {/* Special Notes */}
                <div>
                  <Label htmlFor="notes">{t.delivery.notes}</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>{t.cart.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3 pb-3 border-b">
                      {item.image && (
                        <img src={item.image} alt={item.name[language]} className="w-16 h-16 object-cover rounded" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name[language]}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="font-bold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between">
                    <span>{t.summary.subtotal}</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {deliveryMethod === "delivery" && (
                    <div className="flex justify-between">
                      <span>{t.summary.delivery}</span>
                      <span>${deliveryFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{t.summary.tax}</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>{t.summary.total}</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={createCheckoutMutation.isPending}
                >
                  {createCheckoutMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t.checkout.processing}
                    </>
                  ) : (
                    t.checkout.button
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
