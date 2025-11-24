import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { 
  Calendar, 
  Plus, 
  ShoppingCart, 
  Save, 
  Trash2,
  UtensilsCrossed,
  Coffee,
  Sun,
  Moon
} from "lucide-react";
import { Link } from "wouter";
import { APP_LOGO, APP_TITLE } from "@/const";

type MealType = "breakfast" | "lunch" | "dinner" | "snack";
type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

interface MealSlot {
  dayOfWeek: DayOfWeek;
  mealType: MealType;
  productId?: number;
  productName?: string;
  productPrice?: number;
  productCalories?: number;
  quantity: number;
}

export default function MealPlanner() {
  const { language, toggleLanguage } = useLanguage();
  const [selectedSlot, setSelectedSlot] = useState<{ day: DayOfWeek; meal: MealType } | null>(null);
  const [mealSlots, setMealSlots] = useState<MealSlot[]>([]);
  
  // Fetch products for selection
  const { data: products = [] } = trpc.products.listAll.useQuery();

  const translations = {
    title: {
      fr: "Planificateur de Repas Hebdomadaire",
      en: "Weekly Meal Planner",
    },
    description: {
      fr: "Planifiez vos repas pour la semaine et ajoutez tout au panier en un clic",
      en: "Plan your meals for the week and add everything to cart in one click",
    },
    days: {
      fr: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"],
      en: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    },
    meals: {
      breakfast: { fr: "Petit-déjeuner", en: "Breakfast", icon: Coffee },
      lunch: { fr: "Déjeuner", en: "Lunch", icon: Sun },
      dinner: { fr: "Dîner", en: "Dinner", icon: Moon },
      snack: { fr: "Collation", en: "Snack", icon: UtensilsCrossed },
    },
    addDish: {
      fr: "Ajouter un plat",
      en: "Add dish",
    },
    selectDish: {
      fr: "Sélectionner un plat",
      en: "Select a dish",
    },
    addToCart: {
      fr: "Ajouter tout au panier",
      en: "Add all to cart",
    },
    savePlan: {
      fr: "Sauvegarder le plan",
      en: "Save plan",
    },
    clearAll: {
      fr: "Tout effacer",
      en: "Clear all",
    },
    totalCost: {
      fr: "Coût total",
      en: "Total cost",
    },
    totalCalories: {
      fr: "Calories totales",
      en: "Total calories",
    },
    backToHome: {
      fr: "Retour à l'accueil",
      en: "Back to home",
    },
  };

  const handleAddDish = (productId: number) => {
    if (!selectedSlot) return;

    const product = products.find((p: any) => p.id === productId);
    if (!product) return;

    const newSlot: MealSlot = {
      dayOfWeek: selectedSlot.day,
      mealType: selectedSlot.meal,
      productId: product.id,
      productName: language === "fr" ? product.name : (product.nameEn || product.name),
      productPrice: product.price,
      productCalories: product.calories || 0,
      quantity: 1,
    };

    // Remove existing slot for this day/meal if any
    const filtered = mealSlots.filter(
      s => !(s.dayOfWeek === selectedSlot.day && s.mealType === selectedSlot.meal)
    );
    
    setMealSlots([...filtered, newSlot]);
    setSelectedSlot(null);
    toast.success(language === "fr" ? "Plat ajouté !" : "Dish added!");
  };

  const handleRemoveDish = (day: DayOfWeek, meal: MealType) => {
    setMealSlots(mealSlots.filter(s => !(s.dayOfWeek === day && s.mealType === meal)));
    toast.success(language === "fr" ? "Plat retiré" : "Dish removed");
  };

  const handleAddAllToCart = () => {
    if (mealSlots.length === 0) {
      toast.error(language === "fr" ? "Aucun plat sélectionné" : "No dishes selected");
      return;
    }

    // Group by product and sum quantities
    const cartItems = mealSlots.reduce((acc, slot) => {
      if (!slot.productId) return acc;
      
      const existing = acc.find(item => item.productId === slot.productId);
      if (existing) {
        existing.quantity += slot.quantity;
      } else {
        acc.push({
          productId: slot.productId,
          quantity: slot.quantity,
        });
      }
      return acc;
    }, [] as { productId: number; quantity: number }[]);

    // Add to cart (using localStorage for now)
    const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const updatedCart = [...currentCart];

    cartItems.forEach(item => {
      const existingIndex = updatedCart.findIndex((c: any) => c.productId === item.productId);
      if (existingIndex >= 0) {
        updatedCart[existingIndex].quantity += item.quantity;
      } else {
        updatedCart.push(item);
      }
    });

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success(
      language === "fr" 
        ? `${cartItems.length} plat(s) ajouté(s) au panier !` 
        : `${cartItems.length} dish(es) added to cart!`
    );
  };

  const handleClearAll = () => {
    setMealSlots([]);
    toast.success(language === "fr" ? "Plan effacé" : "Plan cleared");
  };

  const getMealSlot = (day: DayOfWeek, meal: MealType) => {
    return mealSlots.find(s => s.dayOfWeek === day && s.mealType === meal);
  };

  const totalCost = mealSlots.reduce((sum, slot) => sum + (slot.productPrice || 0) * slot.quantity, 0);
  const totalCalories = mealSlots.reduce((sum, slot) => sum + (slot.productCalories || 0) * slot.quantity, 0);

  const mealTypes: MealType[] = ["breakfast", "lunch", "dinner", "snack"];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center space-x-3 cursor-pointer">
                <img src={APP_LOGO} alt={APP_TITLE} className="h-12 w-12 object-contain" />
                <span className="text-2xl font-bold text-black">{APP_TITLE}</span>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={toggleLanguage}>
                {language === "fr" ? "EN" : "FR"}
              </Button>
              <Link href="/">
                <Button variant="outline">
                  {translations.backToHome[language]}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Title and Actions */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                  <Calendar className="h-10 w-10" />
                  {translations.title[language]}
                </h1>
                <p className="text-lg text-gray-600">
                  {translations.description[language]}
                </p>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {translations.totalCost[language]}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-black">
                    ${totalCost.toFixed(2)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {translations.totalCalories[language]}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-black">
                    {totalCalories.toLocaleString()}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {language === "fr" ? "Plats sélectionnés" : "Selected dishes"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-black">
                    {mealSlots.length}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleAddAllToCart}
                className="bg-black hover:bg-gray-800"
                disabled={mealSlots.length === 0}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {translations.addToCart[language]}
              </Button>
              <Button
                variant="outline"
                onClick={handleClearAll}
                disabled={mealSlots.length === 0}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {translations.clearAll[language]}
              </Button>
            </div>
          </div>

          {/* Weekly Calendar Grid */}
          <Card>
            <CardHeader>
              <CardTitle>{language === "fr" ? "Votre Semaine" : "Your Week"}</CardTitle>
              <CardDescription>
                {language === "fr" 
                  ? "Cliquez sur + pour ajouter un plat à chaque repas"
                  : "Click + to add a dish to each meal"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  {/* Header Row - Days */}
                  <div className="grid grid-cols-8 gap-2 mb-2">
                    <div className="font-semibold text-sm text-gray-600"></div>
                    {translations.days[language].map((day, index) => (
                      <div key={index} className="font-semibold text-center text-sm text-gray-900">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Meal Rows */}
                  {mealTypes.map((mealType) => {
                    const MealIcon = translations.meals[mealType].icon;
                    return (
                      <div key={mealType} className="grid grid-cols-8 gap-2 mb-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <MealIcon className="h-4 w-4" />
                          {translations.meals[mealType][language]}
                        </div>
                        {[0, 1, 2, 3, 4, 5, 6].map((day) => {
                          const slot = getMealSlot(day as DayOfWeek, mealType);
                          return (
                            <div key={day} className="min-h-[80px]">
                              {slot ? (
                                <Card className="h-full relative group">
                                  <CardContent className="p-2">
                                    <div className="text-xs font-medium line-clamp-2 mb-1">
                                      {slot.productName}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                      ${slot.productPrice?.toFixed(2)}
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                      onClick={() => handleRemoveDish(day as DayOfWeek, mealType)}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </CardContent>
                                </Card>
                              ) : (
                                <Button
                                  variant="outline"
                                  className="h-full w-full border-dashed"
                                  onClick={() => setSelectedSlot({ day: day as DayOfWeek, meal: mealType })}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Dish Selection Dialog */}
      <Dialog open={selectedSlot !== null} onOpenChange={() => setSelectedSlot(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{translations.selectDish[language]}</DialogTitle>
            <DialogDescription>
              {selectedSlot && (
                <>
                  {translations.days[language][selectedSlot.day]} - {translations.meals[selectedSlot.meal][language]}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[500px] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((product: any) => (
                <Card
                  key={product.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleAddDish(product.id)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {language === "fr" ? product.name : (product.nameEn || product.name)}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {language === "fr" ? product.description : (product.descriptionEn || product.description)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-black">
                        ${(product.price / 100).toFixed(2)}
                      </div>
                      {product.calories && (
                        <Badge variant="secondary">
                          {product.calories} cal
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
