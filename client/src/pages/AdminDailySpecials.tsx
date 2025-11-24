import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Edit, Plus, Trash2, DollarSign, Image as ImageIcon, Sparkles, Upload } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { Switch } from "@/components/ui/switch";

interface DailySpecialForm {
  id?: number;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  price: string;
  originalPrice: string;
  image: string;
  imageAlt: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  displayOrder: string;
}

const emptyForm: DailySpecialForm = {
  name: "",
  nameEn: "",
  description: "",
  descriptionEn: "",
  price: "",
  originalPrice: "",
  image: "",
  imageAlt: "",
  startDate: new Date().toISOString().split("T")[0],
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  isActive: true,
  displayOrder: "0",
};

export default function AdminDailySpecials() {
  const { language } = useLanguage();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<DailySpecialForm>(emptyForm);
  const [isEditing, setIsEditing] = useState(false);
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const { data: products = [] } = trpc.products.listActive.useQuery();

  const utils = trpc.useUtils();
  const { data: specials = [], isLoading } = trpc.dailySpecials.getAll.useQuery();

  const createMutation = trpc.dailySpecials.create.useMutation({
    onSuccess: () => {
      toast.success(language === "fr" ? "Plat du jour créé avec succès" : "Daily special created successfully");
      utils.dailySpecials.getAll.invalidate();
      setIsDialogOpen(false);
      setFormData(emptyForm);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = trpc.dailySpecials.update.useMutation({
    onSuccess: () => {
      toast.success(language === "fr" ? "Plat du jour mis à jour" : "Daily special updated");
      utils.dailySpecials.getAll.invalidate();
      setIsDialogOpen(false);
      setFormData(emptyForm);
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = trpc.dailySpecials.delete.useMutation({
    onSuccess: () => {
      toast.success(language === "fr" ? "Plat du jour supprimé" : "Daily special deleted");
      utils.dailySpecials.getAll.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const price = Math.round(parseFloat(formData.price) * 100);
    const originalPrice = formData.originalPrice ? Math.round(parseFloat(formData.originalPrice) * 100) : undefined;
    const displayOrder = parseInt(formData.displayOrder);

    if (isNaN(price) || price <= 0) {
      toast.error(language === "fr" ? "Prix invalide" : "Invalid price");
      return;
    }

    const data = {
      name: formData.name,
      nameEn: formData.nameEn || undefined,
      description: formData.description,
      descriptionEn: formData.descriptionEn || undefined,
      price,
      originalPrice,
      image: formData.image,
      imageAlt: formData.imageAlt || undefined,
      startDate: formData.startDate,
      endDate: formData.endDate,
      isActive: formData.isActive,
      displayOrder,
    };

    if (isEditing && formData.id) {
      updateMutation.mutate({ id: formData.id, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (special: any) => {
    setFormData({
      id: special.id,
      name: special.name,
      nameEn: special.nameEn || "",
      description: special.description,
      descriptionEn: special.descriptionEn || "",
      price: (special.price / 100).toFixed(2),
      originalPrice: special.originalPrice ? (special.originalPrice / 100).toFixed(2) : "",
      image: special.image,
      imageAlt: special.imageAlt || "",
      startDate: new Date(special.startDate).toISOString().split("T")[0],
      endDate: new Date(special.endDate).toISOString().split("T")[0],
      isActive: special.isActive,
      displayOrder: special.displayOrder.toString(),
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm(language === "fr" ? "Êtes-vous sûr de vouloir supprimer ce plat du jour ?" : "Are you sure you want to delete this daily special?")) {
      deleteMutation.mutate({ id });
    }
  };

  const handleOpenDialog = () => {
    setFormData(emptyForm);
    setIsEditing(false);
    setImagePreview("");
    setIsDialogOpen(true);
  };

  const handleSelectProduct = (product: any) => {
    setFormData({
      ...formData,
      name: product.name,
      nameEn: product.nameEn || "",
      description: product.description,
      descriptionEn: product.descriptionEn || "",
      price: (product.price / 100).toFixed(2),
      image: product.image || "",
      imageAlt: product.imageAlt || "",
    });
    setImagePreview(product.image || "");
    setShowProductSelector(false);
    toast.success(language === "fr" ? "Produit sélectionné" : "Product selected");
  };

  const handleGenerateImage = async () => {
    if (!formData.name || !formData.description) {
      toast.error(language === "fr" ? "Veuillez remplir le nom et la description" : "Please fill in name and description");
      return;
    }

    setIsGeneratingImage(true);
    try {
      const result = await fetch("/api/trpc/products.generateImage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          json: {
            name: formData.name,
            description: formData.description,
          },
        }),
      });

      const data = await result.json();
      if (data.result?.data?.json?.url) {
        setFormData({ ...formData, image: data.result.data.json.url });
        setImagePreview(data.result.data.json.url);
        toast.success(language === "fr" ? "Image générée avec succès" : "Image generated successfully");
      }
    } catch (error) {
      toast.error(language === "fr" ? "Erreur lors de la génération" : "Generation error");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">{language === "fr" ? "Chargement..." : "Loading..."}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{language === "fr" ? "Plats du Jour" : "Daily Specials"}</h1>
          <p className="text-muted-foreground mt-2">
            {language === "fr" 
              ? "Gérez les plats spéciaux qui s'affichent sur la page d'accueil"
              : "Manage special dishes displayed on the homepage"}
          </p>
        </div>
        <Button onClick={handleOpenDialog}>
          <Plus className="mr-2 h-4 w-4" />
          {language === "fr" ? "Nouveau Plat" : "New Special"}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {specials.map((special) => {
          const now = new Date();
          const startDate = new Date(special.startDate);
          const endDate = new Date(special.endDate);
          const isCurrentlyActive = special.isActive && startDate <= now && endDate >= now;

          return (
            <Card key={special.id} className={!special.isActive ? "opacity-60" : ""}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{special.name}</CardTitle>
                    {special.nameEn && (
                      <CardDescription className="mt-1">{special.nameEn}</CardDescription>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(special)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(special.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {special.image && (
                  <img
                    src={special.image}
                    alt={special.imageAlt || special.name}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                )}
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{special.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">${(special.price / 100).toFixed(2)}</span>
                    {special.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${(special.originalPrice / 100).toFixed(2)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {new Date(special.startDate).toLocaleDateString()} - {new Date(special.endDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex gap-2 mt-4">
                    {isCurrentlyActive && <Badge variant="default">Active</Badge>}
                    {!special.isActive && <Badge variant="secondary">Inactive</Badge>}
                    {special.isActive && startDate > now && <Badge variant="outline">Scheduled</Badge>}
                    {special.isActive && endDate < now && <Badge variant="destructive">Expired</Badge>}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {specials.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              {language === "fr" 
                ? "Aucun plat du jour. Créez-en un pour commencer !"
                : "No daily specials yet. Create one to get started!"}
            </p>
          </CardContent>
        </Card>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing
                ? language === "fr" ? "Modifier le Plat du Jour" : "Edit Daily Special"
                : language === "fr" ? "Nouveau Plat du Jour" : "New Daily Special"}
            </DialogTitle>
            <DialogDescription>
              {language === "fr"
                ? "Remplissez les informations du plat spécial ou sélectionnez un produit existant"
                : "Fill in the special dish information or select an existing product"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isEditing && (
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowProductSelector(!showProductSelector)}
                  className="flex-1"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {language === "fr" ? "Sélectionner un produit" : "Select a product"}
                </Button>
              </div>
            )}

            {showProductSelector && (
              <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
                <p className="text-sm font-medium mb-2">
                  {language === "fr" ? "Choisissez un produit :" : "Choose a product:"}
                </p>
                <div className="space-y-2">
                  {products.map((product: any) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => handleSelectProduct(product)}
                      className="w-full text-left p-2 hover:bg-accent rounded-md transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {product.image && (
                          <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">${(product.price / 100).toFixed(2)}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">
                  {language === "fr" ? "Nom (FR)" : "Name (FR)"} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nameEn">{language === "fr" ? "Nom (EN)" : "Name (EN)"}</Label>
                <Input
                  id="nameEn"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="description">
                  {language === "fr" ? "Description (FR)" : "Description (FR)"} <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descriptionEn">{language === "fr" ? "Description (EN)" : "Description (EN)"}</Label>
                <Textarea
                  id="descriptionEn"
                  value={formData.descriptionEn}
                  onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                  rows={3}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="price">
                  {language === "fr" ? "Prix ($)" : "Price ($)"} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="originalPrice">{language === "fr" ? "Prix Original ($)" : "Original Price ($)"}</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  step="0.01"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  placeholder={language === "fr" ? "Optionnel" : "Optional"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="displayOrder">{language === "fr" ? "Ordre d'affichage" : "Display Order"}</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">
                {language === "fr" ? "Image du produit" : "Product Image"} <span className="text-destructive">*</span>
              </Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGenerateImage}
                  disabled={isGeneratingImage}
                  className="flex-1"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {isGeneratingImage
                    ? language === "fr" ? "Génération..." : "Generating..."
                    : language === "fr" ? "Générer avec l'IA" : "Generate with AI"}
                </Button>
              </div>
              <Input
                id="image"
                type="url"
                value={formData.image}
                onChange={(e) => {
                  setFormData({ ...formData, image: e.target.value });
                  setImagePreview(e.target.value);
                }}
                placeholder="https://..."
                required
              />
              {(imagePreview || formData.image) && (
                <img src={imagePreview || formData.image} alt="Preview" className="mt-2 w-full h-48 object-cover rounded-md" />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageAlt">{language === "fr" ? "Texte alternatif de l'image" : "Image Alt Text"}</Label>
              <Input
                id="imageAlt"
                value={formData.imageAlt}
                onChange={(e) => setFormData({ ...formData, imageAlt: e.target.value })}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">
                  {language === "fr" ? "Date de début" : "Start Date"} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">
                  {language === "fr" ? "Date de fin" : "End Date"} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="isActive" className="cursor-pointer">
                {language === "fr" ? "Actif" : "Active"}
              </Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                {language === "fr" ? "Annuler" : "Cancel"}
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending
                  ? language === "fr" ? "Enregistrement..." : "Saving..."
                  : language === "fr" ? "Enregistrer" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
