import { useState, useEffect } from "react";
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
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ArrowLeft, GripVertical } from "lucide-react";

interface MenuCategory {
  id: number;
  name: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

export default function AdminMenu() {
  const [, setLocation] = useLocation();
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/menu-categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Erreur lors du chargement des categories");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingCategory
        ? `/api/menu-categories/${editingCategory.id}`
        : "/api/menu-categories";
      const method = editingCategory ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(
          editingCategory
            ? "Categorie mise a jour avec succes"
            : "Categorie creee avec succes"
        );
        setIsDialogOpen(false);
        resetForm();
        fetchCategories();
      } else {
        toast.error("Erreur lors de la sauvegarde");
      }
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Etes-vous sur de vouloir supprimer cette categorie?")) return;

    try {
      const response = await fetch(`/api/menu-categories/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Categorie supprimee avec succes");
        fetchCategories();
      } else {
        toast.error("Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleEdit = (category: MenuCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      isActive: category.isActive,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      description: "",
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
            Gestion du Menu
          </h1>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Categories du Menu</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle Categorie
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingCategory ? "Modifier la Categorie" : "Nouvelle Categorie"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nom</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      rows={3}
                    />
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
                    <Button type="submit">
                      {editingCategory ? "Mettre a jour" : "Creer"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Chargement...</div>
            ) : categories.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Aucune categorie trouvee. Creez votre premiere categorie!
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <GripVertical className="h-4 w-4 text-gray-400 cursor-grab" />
                      </TableCell>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {category.description}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            category.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {category.isActive ? "Actif" : "Inactif"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(category)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(category.id)}
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
