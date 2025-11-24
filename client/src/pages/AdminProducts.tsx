import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Search, Upload } from "lucide-react";

type Product = {
  id: number;
  name: string;
  nameEn: string | null;
  description: string;
  descriptionEn: string | null;
  category: string;
  subcategory: string | null;
  price: number;
  servingSize: string | null;
  image: string;
  imageAlt: string | null;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isDairyFree: boolean;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  nutritionalTip: string | null;
  nutritionalTipEn: string | null;
  isVisible: boolean;
  isCateringOnly: boolean;
  showDietaryTags: boolean;
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

const CATEGORIES = [
  { value: "sandwiches", label: "Sandwiches" },
  { value: "salades", label: "Salades" },
  { value: "plats-principaux", label: "Plats Principaux" },
  { value: "traiteur-bouchees", label: "Traiteur - Bouchées" },
  { value: "traiteur-buffets", label: "Traiteur - Buffets" },
  { value: "boites-lunch", label: "Boîtes à Lunch" },
  { value: "desserts", label: "Desserts" },
  { value: "boissons", label: "Boissons" },
];

export default function AdminProducts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);

  const utils = trpc.useUtils();
  const { data: products = [], isLoading } = trpc.products.listAll.useQuery();

  const createMutation = trpc.products.create.useMutation({
    onSuccess: () => {
      utils.products.listAll.invalidate();
      setIsDialogOpen(false);
      toast.success("Produit créé avec succès");
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const updateMutation = trpc.products.update.useMutation({
    onSuccess: () => {
      utils.products.listAll.invalidate();
      setIsDialogOpen(false);
      setEditingProduct(null);
      toast.success("Produit mis à jour avec succès");
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const deleteMutation = trpc.products.delete.useMutation({
    onSuccess: () => {
      utils.products.listAll.invalidate();
      toast.success("Produit supprimé avec succès");
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const suggestMutation = trpc.products.suggestAttributes.useMutation();
  const generateImageMutation = trpc.products.generateImage.useMutation();
  const uploadImageMutation = trpc.products.uploadImage.useMutation();
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const productData = {
      name: formData.get("name") as string,
      nameEn: formData.get("nameEn") as string || undefined,
      description: formData.get("description") as string,
      descriptionEn: formData.get("descriptionEn") as string || undefined,
      category: formData.get("category") as string,
      subcategory: formData.get("subcategory") as string || undefined,
      price: Math.round(parseFloat(formData.get("price") as string) * 100), // Convert dollars to cents
      servingSize: formData.get("servingSize") as string || undefined,
      image: formData.get("image") as string,
      imageAlt: formData.get("imageAlt") as string || undefined,
      isVegetarian: formData.get("isVegetarian") === "on",
      isVegan: formData.get("isVegan") === "on",
      isGlutenFree: formData.get("isGlutenFree") === "on",
      isDairyFree: formData.get("isDairyFree") === "on",
      calories: formData.get("calories") ? parseInt(formData.get("calories") as string) : undefined,
      protein: formData.get("protein") ? parseInt(formData.get("protein") as string) : undefined,
      carbs: formData.get("carbs") ? parseInt(formData.get("carbs") as string) : undefined,
      fat: formData.get("fat") ? parseInt(formData.get("fat") as string) : undefined,
      nutritionalTip: formData.get("nutritionalTip") as string || undefined,
      nutritionalTipEn: formData.get("nutritionalTipEn") as string || undefined,
      isVisible: formData.get("isVisible") === "on",
      isCateringOnly: formData.get("isCateringOnly") === "on",
      showDietaryTags: formData.get("showDietaryTags") === "on",
      isActive: formData.get("isActive") === "on",
      displayOrder: formData.get("displayOrder") ? parseInt(formData.get("displayOrder") as string) : 0,
    };

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, ...productData });
    } else {
      createMutation.mutate(productData);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setImagePreview(null); // Clear image preview when editing a different product
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce produit?")) {
      deleteMutation.mutate({ id });
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
    setImagePreview(null); // Clear image preview when closing dialog
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion des Produits</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingProduct(null); setImagePreview(null); }}>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Produit
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Modifier le produit" : "Nouveau produit"}
              </DialogTitle>
              <DialogDescription>
                Remplissez les informations du produit
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nom (FR) *</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={editingProduct?.name}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="nameEn">Nom (EN)</Label>
                  <Input
                    id="nameEn"
                    name="nameEn"
                    defaultValue={editingProduct?.nameEn || ""}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description (FR) *</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingProduct?.description}
                  required
                />
              </div>

              <div>
                <Label htmlFor="descriptionEn">Description (EN)</Label>
                <Textarea
                  id="descriptionEn"
                  name="descriptionEn"
                  defaultValue={editingProduct?.descriptionEn || ""}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Catégorie *</Label>
                  <Select name="category" defaultValue={editingProduct?.category} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="subcategory">Sous-catégorie</Label>
                  <Input
                    id="subcategory"
                    name="subcategory"
                    defaultValue={editingProduct?.subcategory || ""}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Prix ($) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={editingProduct ? (editingProduct.price / 100).toFixed(2) : ""}
                    required
                    placeholder="15.50"
                  />
                </div>
                <div>
                  <Label htmlFor="servingSize">Portion</Label>
                  <Input
                    id="servingSize"
                    name="servingSize"
                    defaultValue={editingProduct?.servingSize || ""}
                    placeholder="ex: 8-10 personnes"
                  />
                </div>
                <div>
                  <Label htmlFor="displayOrder">Ordre d'affichage</Label>
                  <Input
                    id="displayOrder"
                    name="displayOrder"
                    type="number"
                    defaultValue={editingProduct?.displayOrder || 0}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Image du produit *</Label>
                
                {/* Current image preview */}
                {(editingProduct?.image || imagePreview) && (
                  <div className="relative w-48 h-48 border rounded-lg overflow-hidden">
                    <img
                      src={imagePreview || (editingProduct?.image?.startsWith('http') ? editingProduct.image : `${window.location.origin}${editingProduct?.image || ''}`)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                {/* Hidden input for form submission */}
                <Input
                  id="image"
                  name="image"
                  type="hidden"
                  value={imagePreview || editingProduct?.image || ""}
                  required
                />
                
                <div className="flex gap-2">
                  {/* AI Generation Button */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={async () => {
                      const nameInput = (document.getElementById("name") as HTMLInputElement)?.value;
                      const descInput = (document.getElementById("description") as HTMLTextAreaElement)?.value;
                      
                      if (!nameInput || !descInput) {
                        toast.error("Veuillez remplir le nom et la description avant de générer une image");
                        return;
                      }
                      
                      setIsGeneratingImage(true);
                      try {
                        const result = await generateImageMutation.mutateAsync({
                          productName: nameInput,
                          description: descInput,
                        });
                        setImagePreview(result.url || null);
                        toast.success("Image générée avec succès!");
                      } catch (error) {
                        toast.error("Erreur lors de la génération de l'image");
                      } finally {
                        setIsGeneratingImage(false);
                      }
                    }}
                    disabled={isGeneratingImage}
                  >
                    {isGeneratingImage ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Génération...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Générer avec l'IA
                      </>
                    )}
                  </Button>
                  
                  {/* Manual Upload Button */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("imageFileInput")?.click()}
                    disabled={isUploadingImage}
                  >
                    {isUploadingImage ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Upload...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Uploader une image
                      </>
                    )}
                  </Button>
                  
                  {/* Hidden file input */}
                  <input
                    id="imageFileInput"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      
                      // Validate file size (5MB max)
                      if (file.size > 5 * 1024 * 1024) {
                        toast.error("L'image est trop grande (max 5MB)");
                        return;
                      }
                      
                      setIsUploadingImage(true);
                      try {
                        // Convert to base64
                        const reader = new FileReader();
                        reader.onloadend = async () => {
                          const base64Data = reader.result as string;
                          const result = await uploadImageMutation.mutateAsync({
                            filename: file.name,
                            contentType: file.type,
                            base64Data: base64Data.split(',')[1], // Remove data:image/...;base64, prefix
                          });
                          setImagePreview(result.url || null);
                          toast.success("Image uploadée avec succès!");
                        };
                        reader.readAsDataURL(file);
                      } catch (error) {
                        toast.error("Erreur lors de l'upload de l'image");
                      } finally {
                        setIsUploadingImage(false);
                      }
                    }}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="imageAlt">Texte alternatif de l'image</Label>
                <Input
                  id="imageAlt"
                  name="imageAlt"
                  defaultValue={editingProduct?.imageAlt || ""}
                />
              </div>

              <div className="space-y-2">
                <Label>Régimes alimentaires</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isVegetarian"
                      name="isVegetarian"
                      defaultChecked={editingProduct?.isVegetarian}
                    />
                    <Label htmlFor="isVegetarian" className="font-normal">
                      Végétarien
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isVegan"
                      name="isVegan"
                      defaultChecked={editingProduct?.isVegan}
                    />
                    <Label htmlFor="isVegan" className="font-normal">
                      Végétalien
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isGlutenFree"
                      name="isGlutenFree"
                      defaultChecked={editingProduct?.isGlutenFree}
                    />
                    <Label htmlFor="isGlutenFree" className="font-normal">
                      Sans gluten
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isDairyFree"
                      name="isDairyFree"
                      defaultChecked={editingProduct?.isDairyFree}
                    />
                    <Label htmlFor="isDairyFree" className="font-normal">
                      Sans produits laitiers
                    </Label>
                  </div>
                </div>
              </div>

              {/* AI Suggestion Button */}
              <div className="border-t pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={async () => {
                    const nameInput = document.getElementById("name") as HTMLInputElement;
                    const descInput = document.getElementById("description") as HTMLTextAreaElement;
                    
                    if (!nameInput?.value || !descInput?.value) {
                      toast.error("Veuillez remplir le nom et la description d'abord");
                      return;
                    }

                    setIsGeneratingSuggestions(true);

                    try {
                      const suggestions = await suggestMutation.mutateAsync({
                        name: nameInput.value,
                        description: descInput.value,
                      });

                      // Fill in the form fields
                      (document.getElementById("calories") as HTMLInputElement).value = String(suggestions.calories || "");
                      (document.getElementById("protein") as HTMLInputElement).value = String(suggestions.protein || "");
                      (document.getElementById("carbs") as HTMLInputElement).value = String(suggestions.carbs || "");
                      (document.getElementById("fat") as HTMLInputElement).value = String(suggestions.fat || "");
                      (document.getElementById("nutritionalTip") as HTMLTextAreaElement).value = suggestions.nutritionalTip || "";
                      
                      // Set checkboxes
                      (document.getElementById("isVegetarian") as HTMLInputElement).checked = suggestions.isVegetarian || false;
                      (document.getElementById("isVegan") as HTMLInputElement).checked = suggestions.isVegan || false;
                      (document.getElementById("isGlutenFree") as HTMLInputElement).checked = suggestions.isGlutenFree || false;
                      (document.getElementById("isDairyFree") as HTMLInputElement).checked = suggestions.isDairyFree || false;

                      toast.success("Suggestions générées avec succès!");
                    } catch (error) {
                      console.error(error);
                      toast.error("Erreur lors de la génération des suggestions");
                    } finally {
                      setIsGeneratingSuggestions(false);
                    }
                  }}
                  disabled={isGeneratingSuggestions}
                >
                  {isGeneratingSuggestions ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Suggérer avec l'IA
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  L'IA analysera le nom et la description pour suggérer les valeurs nutritionnelles et les régimes alimentaires
                </p>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="calories">Calories</Label>
                  <Input
                    id="calories"
                    name="calories"
                    type="number"
                    defaultValue={editingProduct?.calories || ""}
                  />
                </div>
                <div>
                  <Label htmlFor="protein">Protéines (g)</Label>
                  <Input
                    id="protein"
                    name="protein"
                    type="number"
                    defaultValue={editingProduct?.protein || ""}
                  />
                </div>
                <div>
                  <Label htmlFor="carbs">Glucides (g)</Label>
                  <Input
                    id="carbs"
                    name="carbs"
                    type="number"
                    defaultValue={editingProduct?.carbs || ""}
                  />
                </div>
                <div>
                  <Label htmlFor="fat">Lipides (g)</Label>
                  <Input
                    id="fat"
                    name="fat"
                    type="number"
                    defaultValue={editingProduct?.fat || ""}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="nutritionalTip">Conseil nutritionnel (FR)</Label>
                <Textarea
                  id="nutritionalTip"
                  name="nutritionalTip"
                  defaultValue={editingProduct?.nutritionalTip || ""}
                />
              </div>

              <div>
                <Label htmlFor="nutritionalTipEn">Conseil nutritionnel (EN)</Label>
                <Textarea
                  id="nutritionalTipEn"
                  name="nutritionalTipEn"
                  defaultValue={editingProduct?.nutritionalTipEn || ""}
                />
              </div>

              <div className="space-y-2 border-t pt-4">
                <Label>Options de disponibilité</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isVisible"
                      name="isVisible"
                      defaultChecked={editingProduct?.isVisible ?? true}
                    />
                    <Label htmlFor="isVisible" className="font-normal">
                      Afficher le produit (décocher en cas de rupture de stock ou hors saison)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isCateringOnly"
                      name="isCateringOnly"
                      defaultChecked={editingProduct?.isCateringOnly ?? false}
                    />
                    <Label htmlFor="isCateringOnly" className="font-normal">
                      Commande spéciale uniquement (non commandable en ligne)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="showDietaryTags"
                      name="showDietaryTags"
                      defaultChecked={editingProduct?.showDietaryTags ?? true}
                    />
                    <Label htmlFor="showDietaryTags" className="font-normal">
                      Afficher les tags de régime alimentaire
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isActive"
                      name="isActive"
                      defaultChecked={editingProduct?.isActive ?? true}
                    />
                    <Label htmlFor="isActive" className="font-normal">
                      Produit actif (système interne)
                    </Label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Annuler
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingProduct ? "Mettre à jour" : "Créer"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Chargement...</div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <img
                      src={product.image.startsWith('http') ? product.image : `${window.location.origin}${product.image}`}
                      alt={product.imageAlt || product.name}
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect width="64" height="64" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    {CATEGORIES.find((c) => c.value === product.category)?.label}
                  </TableCell>
                  <TableCell>${(product.price / 100).toFixed(2)}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        product.isActive
                          ? "bg-gray-100 text-gray-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {product.isActive ? "Actif" : "Inactif"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(product)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
