import { useState, useRef } from "react";
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
import { Plus, Pencil, Trash2, ArrowLeft, Upload, Image as ImageIcon, Wand2, Loader2, Sparkles } from "lucide-react";
import { trpc } from "@/lib/trpc";

const GALLERY_CATEGORIES = [
  "Evenements",
  "Plats",
  "Desserts",
  "Equipe",
  "Ambiance",
  "Autre",
];

export default function AdminGallery() {
  const [, setLocation] = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<any | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: "",
    titleEn: "",
    description: "",
    descriptionEn: "",
    imageUrl: "",
    category: "Plats",
    isActive: true,
  });

  // AI Generation states
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiSize, setAiSize] = useState<"1024x1024" | "1792x1024" | "1024x1792">("1024x1024");
  const [aiQuality, setAiQuality] = useState<"standard" | "hd">("standard");
  const [aiStyle, setAiStyle] = useState<"vivid" | "natural">("vivid");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  // tRPC queries and mutations
  const { data: images = [], isLoading, refetch } = trpc.gallery.list.useQuery();
  const createMutation = trpc.gallery.create.useMutation({
    onSuccess: () => {
      toast.success("Image ajoutee avec succes");
      setIsDialogOpen(false);
      resetForm();
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de l ajout");
    },
  });
  const updateMutation = trpc.gallery.update.useMutation({
    onSuccess: () => {
      toast.success("Image mise a jour avec succes");
      setIsDialogOpen(false);
      resetForm();
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de la mise a jour");
    },
  });
  const deleteMutation = trpc.gallery.delete.useMutation({
    onSuccess: () => {
      toast.success("Image supprimee avec succes");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de la suppression");
    },
  });

  // AI mutations
  const generateImageMutation = trpc.ai.generateImage.useMutation({
    onSuccess: (data) => {
      setGeneratedImage(data.url);
      toast.success("Image generee avec succes!");
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de la generation");
    },
  });

  const { data: suggestedPrompts } = trpc.ai.getSuggestedPrompts.useQuery({
    category: formData.category.toLowerCase(),
  });

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
        toast.success("Image uploadee avec succes");
      } else {
        toast.error("Erreur lors de l upload");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Erreur lors de l upload");
    } finally {
      setUploading(false);
    }
  };

  const generateAIImage = () => {
    if (!aiPrompt.trim()) {
      toast.error("Veuillez entrer une description");
      return;
    }
    setGeneratedImage(null);
    generateImageMutation.mutate({
      prompt: aiPrompt,
      size: aiSize,
      quality: aiQuality,
      style: aiStyle,
    });
  };

  const useGeneratedImage = () => {
    if (generatedImage) {
      setFormData({ ...formData, imageUrl: generatedImage });
      setIsAIDialogOpen(false);
      setGeneratedImage(null);
      setAiPrompt("");
      toast.success("Image ajoutee au formulaire");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.imageUrl) {
      toast.error("Veuillez ajouter une image");
      return;
    }

    if (editingImage) {
      updateMutation.mutate({
        id: editingImage.id,
        ...formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm("Etes-vous sur de vouloir supprimer cette image?")) return;
    deleteMutation.mutate({ id });
  };

  const handleEdit = (image: any) => {
    setEditingImage(image);
    setFormData({
      title: image.title,
      titleEn: image.titleEn || "",
      description: image.description || "",
      descriptionEn: image.descriptionEn || "",
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
      titleEn: "",
      description: "",
      descriptionEn: "",
      imageUrl: "",
      category: "Plats",
      isActive: true,
    });
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Titre (FR)</Label>
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
                      <Label htmlFor="titleEn">Titre (EN)</Label>
                      <Input
                        id="titleEn"
                        value={formData.titleEn}
                        onChange={(e) =>
                          setFormData({ ...formData, titleEn: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description (FR)</Label>
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
                    <Label htmlFor="category">Categorie</Label>
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
                        <div className="grid grid-cols-2 gap-2">
                          <div
                            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="h-6 w-6 mx-auto text-gray-400 mb-1" />
                            <p className="text-xs text-gray-500">
                              {uploading ? "Upload..." : "Uploader"}
                            </p>
                          </div>
                          <div
                            className="border-2 border-dashed border-purple-300 rounded-lg p-4 text-center cursor-pointer hover:border-purple-400 transition-colors bg-purple-50 dark:bg-purple-900/20"
                            onClick={() => setIsAIDialogOpen(true)}
                          >
                            <Wand2 className="h-6 w-6 mx-auto text-purple-500 mb-1" />
                            <p className="text-xs text-purple-600 dark:text-purple-400">
                              Generer IA
                            </p>
                          </div>
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
                        placeholder="URL de l image"
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
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={uploading || createMutation.isPending || updateMutation.isPending}
                    >
                      {editingImage ? "Mettre a jour" : "Ajouter"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Chargement...</div>
            ) : images.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ImageIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p>Aucune image dans la galerie. Ajoutez votre premiere photo!</p>
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

      {/* AI Image Generator Dialog */}
      <Dialog open={isAIDialogOpen} onOpenChange={setIsAIDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              Generateur d Images IA (DALL-E 3)
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="aiPrompt">Description de l image</Label>
              <Textarea
                id="aiPrompt"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Ex: A beautifully plated gourmet dish with fresh herbs..."
                rows={3}
                className="mt-1"
              />
            </div>

            {suggestedPrompts?.prompts && suggestedPrompts.prompts.length > 0 && (
              <div>
                <Label className="text-sm text-gray-500">Suggestions pour {formData.category}</Label>
                <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                  {suggestedPrompts.prompts.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setAiPrompt(suggestion)}
                      className="w-full text-left p-2 rounded border hover:bg-gray-50 dark:hover:bg-gray-800 text-xs transition-colors"
                    >
                      {suggestion.substring(0, 80)}...
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Taille</Label>
                <Select value={aiSize} onValueChange={(v) => setAiSize(v as any)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1024x1024">Carre</SelectItem>
                    <SelectItem value="1792x1024">Paysage</SelectItem>
                    <SelectItem value="1024x1792">Portrait</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Qualite</Label>
                <Select value={aiQuality} onValueChange={(v) => setAiQuality(v as any)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="hd">HD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Style</Label>
                <Select value={aiStyle} onValueChange={(v) => setAiStyle(v as any)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vivid">Vivid</SelectItem>
                    <SelectItem value="natural">Natural</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              type="button"
              onClick={generateAIImage}
              disabled={generateImageMutation.isPending || !aiPrompt.trim()}
              className="w-full"
            >
              {generateImageMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generation en cours...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generer l image
                </>
              )}
            </Button>

            {generatedImage && (
              <div className="space-y-4">
                <div className="relative rounded-lg overflow-hidden border">
                  <img
                    src={generatedImage}
                    alt="Generated"
                    className="w-full h-auto"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={useGeneratedImage} className="flex-1">
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Utiliser cette image
                  </Button>
                  <Button
                    variant="outline"
                    onClick={generateAIImage}
                    disabled={generateImageMutation.isPending}
                  >
                    Regenerer
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
