import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ArrowLeft, Upload, Image as ImageIcon } from "lucide-react";

interface GalleryImage {
  id: number;
  title: string;
  description?: string;
  imageUrl: string;
  category: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

const GALLERY_CATEGORIES = [
  "Événements",
  "Plats",
  "Desserts",
  "Équipe",
  "Ambiance",
  "Autre",
];

export default function AdminGallery() {
  const [, setLocation] = useLocation();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    category: "Plats",
    isActive: true,
  });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch("/api/gallery");
      if (response.ok) {
        const data = await response.json();
        setImages(data);
      }
    } catch (error) {
      console.error("Error fetching gallery:", error);
      toast.error("Erreur lors du chargement de la galerie");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData({ ...formData, imageUrl: data.url });
        toast.success("Image uploadée avec succès");
      } else {
        toast.error("Erreur lors de l'upload");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.imageUrl) {
      toast.error("Veuillez ajouter une image");
      return;
    }

    try {
      const url = editingImage
        ? `/api/gallery/${editingImage.id}`
        : "/api/gallery";
      const method = editingImage ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(
          editingImage
            ? "Image mise à jour avec succès"
            : "Image ajoutée avec succès"
        );
        setIsDialogOpen(false);
        resetForm();
        fetchImages();
      } else {
        toast.error("Erreur lors de la sauvegarde");
      }
    } catch (error) {
      console.error("Error saving image:", error);
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette image?")) return;

    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Image supprimée avec succès");
        fetchImages();
      } else {
        toast.error("Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleEdit = (image: GalleryImage) => {
    setEditingImage(image);
    setFormData({
      title: image.title,
      description: image.description || "",
      imageUrl: image.imageUrl,
      category: image.category,
      isActive: image.isActive,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingImage(null);
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      category: "Plats",
      isActive: true,
    });
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/admin/products")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestion de la Galerie
          </h1>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Photos de la Galerie</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle Photo
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>
                    {editingImage ? "Modifier la Photo" : "Nouvelle Photo"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Titre</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description (optionnel)</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Catégorie</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData({ ...formData, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {GALLERY_CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Image</Label>
                    <div className="mt-2 space-y-2">
                      {formData.imageUrl ? (
                        <div className="relative">
                          <img
                            src={formData.imageUrl}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => setFormData({ ...formData, imageUrl: "" })}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div
                          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">
                            {uploading ? "Upload en cours..." : "Cliquez pour uploader une image"}
                          </p>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                      <div className="text-center text-sm text-gray-500">ou</div>
                      <Input
                        placeholder="URL de l'image"
                        value={formData.imageUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, imageUrl: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isActive: checked })
                      }
                    />
                    <Label htmlFor="isActive">Actif</Label>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={handleDialogClose}>
                      Annuler
                    </Button>
                    <Button type="submit" disabled={uploading}>
                      {editingImage ? "Mettre à jour" : "Ajouter"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Chargement...</div>
            ) : images.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ImageIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p>Aucune image dans la galerie. Ajoutez votre première photo!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className="relative group rounded-lg overflow-hidden bg-gray-100"
                  >
                    <img
                      src={image.imageUrl}
                      alt={image.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                      <div>
                        <h3 className="text-white font-medium truncate">
                          {image.title}
                        </h3>
                        <span className="text-xs text-gray-300">{image.category}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            image.isActive
                              ? "bg-green-500 text-white"
                              : "bg-gray-500 text-white"
                          }`}
                        >
                          {image.isActive ? "Actif" : "Inactif"}
                        </span>
                        <div className="flex gap-1">
                          <Button
                            variant="secondary"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEdit(image)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleDelete(image.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
