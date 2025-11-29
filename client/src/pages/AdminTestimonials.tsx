import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Plus, Pencil, Trash2, ArrowLeft, Star } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function AdminTestimonials() {
  const [, setLocation] = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    customerName: "",
    customerTitle: "",
    content: "",
    contentEn: "",
    rating: 5,
    imageUrl: "",
    isActive: true,
    isFeatured: false,
  });

  // tRPC queries and mutations
  const { data: testimonials = [], isLoading, refetch } = trpc.testimonials.list.useQuery();
  const createMutation = trpc.testimonials.create.useMutation({
    onSuccess: () => {
      toast.success("Temoignage cree avec succes");
      setIsDialogOpen(false);
      resetForm();
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de la creation");
    },
  });
  const updateMutation = trpc.testimonials.update.useMutation({
    onSuccess: () => {
      toast.success("Temoignage mis a jour avec succes");
      setIsDialogOpen(false);
      resetForm();
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de la mise a jour");
    },
  });
  const deleteMutation = trpc.testimonials.delete.useMutation({
    onSuccess: () => {
      toast.success("Temoignage supprime avec succes");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de la suppression");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTestimonial) {
      updateMutation.mutate({
        id: editingTestimonial.id,
        ...formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm("Etes-vous sur de vouloir supprimer ce temoignage?")) return;
    deleteMutation.mutate({ id });
  };

  const handleEdit = (testimonial: any) => {
    setEditingTestimonial(testimonial);
    setFormData({
      customerName: testimonial.customerName,
      customerTitle: testimonial.customerTitle || "",
      content: testimonial.content,
      contentEn: testimonial.contentEn || "",
      rating: testimonial.rating,
      imageUrl: testimonial.imageUrl || "",
      isActive: testimonial.isActive,
      isFeatured: testimonial.isFeatured,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingTestimonial(null);
    setFormData({
      customerName: "",
      customerTitle: "",
      content: "",
      contentEn: "",
      rating: 5,
      imageUrl: "",
      isActive: true,
      isFeatured: false,
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
      />
    ));
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
            Gestion des Temoignages
          </h1>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Temoignages Clients</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau Temoignage
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>
                    {editingTestimonial ? "Modifier le Temoignage" : "Nouveau Temoignage"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="customerName">Nom du client</Label>
                      <Input
                        id="customerName"
                        value={formData.customerName}
                        onChange={(e) =>
                          setFormData({ ...formData, customerName: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="customerTitle">Titre/Fonction</Label>
                      <Input
                        id="customerTitle"
                        value={formData.customerTitle}
                        onChange={(e) =>
                          setFormData({ ...formData, customerTitle: e.target.value })
                        }
                        placeholder="Ex: Chef cuisinier"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="content">Temoignage (FR)</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) =>
                        setFormData({ ...formData, content: e.target.value })
                      }
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contentEn">Temoignage (EN)</Label>
                    <Textarea
                      id="contentEn"
                      value={formData.contentEn}
                      onChange={(e) =>
                        setFormData({ ...formData, contentEn: e.target.value })
                      }
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="rating">Note</Label>
                      <Select
                        value={String(formData.rating)}
                        onValueChange={(value) =>
                          setFormData({ ...formData, rating: parseInt(value) })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map((num) => (
                            <SelectItem key={num} value={String(num)}>
                              {num} etoile{num > 1 ? "s" : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="imageUrl">Photo URL</Label>
                      <Input
                        id="imageUrl"
                        value={formData.imageUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, imageUrl: e.target.value })
                        }
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
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
                    <div className="flex items-center gap-2">
                      <Switch
                        id="isFeatured"
                        checked={formData.isFeatured}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, isFeatured: checked })
                        }
                      />
                      <Label htmlFor="isFeatured">En vedette</Label>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createMutation.isPending || updateMutation.isPending}
                    >
                      {editingTestimonial ? "Mettre a jour" : "Creer"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Chargement...</div>
            ) : testimonials.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Aucun temoignage trouve. Ajoutez votre premier temoignage!
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Temoignage</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testimonials.map((testimonial) => (
                    <TableRow key={testimonial.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{testimonial.customerName}</div>
                          {testimonial.customerTitle && (
                            <div className="text-sm text-gray-500">{testimonial.customerTitle}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {testimonial.content}
                      </TableCell>
                      <TableCell>
                        <div className="flex">{renderStars(testimonial.rating)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span
                            className={`px-2 py-1 rounded-full text-xs inline-block w-fit ${
                              testimonial.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {testimonial.isActive ? "Actif" : "Inactif"}
                          </span>
                          {testimonial.isFeatured && (
                            <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 inline-block w-fit">
                              Vedette
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(testimonial)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(testimonial.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
