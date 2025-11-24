import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Loader2, Plus, Pencil, Trash2, MessageCircleQuestion } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminFAQ() {
  const { user, loading: authLoading } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<any>(null);

  // Form state
  const [questionFr, setQuestionFr] = useState("");
  const [questionEn, setQuestionEn] = useState("");
  const [answerFr, setAnswerFr] = useState("");
  const [answerEn, setAnswerEn] = useState("");
  const [keywordsFr, setKeywordsFr] = useState("");
  const [keywordsEn, setKeywordsEn] = useState("");
  const [category, setCategory] = useState("general");

  const { data: faqs, isLoading, refetch } = trpc.faq.list.useQuery();

  const createMutation = trpc.faq.create.useMutation({
    onSuccess: () => {
      toast.success("FAQ créée avec succès");
      refetch();
      closeDialog();
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const updateMutation = trpc.faq.update.useMutation({
    onSuccess: () => {
      toast.success("FAQ mise à jour avec succès");
      refetch();
      closeDialog();
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const deleteMutation = trpc.faq.delete.useMutation({
    onSuccess: () => {
      toast.success("FAQ supprimée avec succès");
      refetch();
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const openCreateDialog = () => {
    setEditingFAQ(null);
    setQuestionFr("");
    setQuestionEn("");
    setAnswerFr("");
    setAnswerEn("");
    setKeywordsFr("");
    setKeywordsEn("");
    setCategory("general");
    setIsDialogOpen(true);
  };

  const openEditDialog = (faq: any) => {
    setEditingFAQ(faq);
    setQuestionFr(faq.questionFr);
    setQuestionEn(faq.questionEn);
    setAnswerFr(faq.answerFr);
    setAnswerEn(faq.answerEn);
    setKeywordsFr(faq.keywordsFr);
    setKeywordsEn(faq.keywordsEn);
    setCategory(faq.category);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingFAQ(null);
  };

  const handleSubmit = () => {
    if (!questionFr || !questionEn || !answerFr || !answerEn || !keywordsFr || !keywordsEn) {
      toast.error("Veuillez remplir tous les champs requis");
      return;
    }

    const data = {
      questionFr,
      questionEn,
      answerFr,
      answerEn,
      keywordsFr,
      keywordsEn,
      category,
      isActive: 1,
      displayOrder: 0,
    };

    if (editingFAQ) {
      updateMutation.mutate({ id: editingFAQ.id, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette FAQ ?")) {
      deleteMutation.mutate({ id });
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardHeader>
            <CardTitle>Accès Refusé</CardTitle>
            <CardDescription>Vous devez être administrateur pour accéder à cette page.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const categories = [
    { value: "general", label: "Général" },
    { value: "hours", label: "Horaires" },
    { value: "delivery", label: "Livraison" },
    { value: "allergens", label: "Allergènes" },
    { value: "pricing", label: "Prix" },
    { value: "preparation", label: "Préparation" },
    { value: "reservations", label: "Réservations" },
    { value: "contact", label: "Contact" },
    { value: "ordering", label: "Commande" },
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gestion des FAQ</h1>
          <p className="text-muted-foreground mt-2">
            Gérez les questions fréquentes pour des réponses instantanées du chatbot
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle FAQ
        </Button>
      </div>

      {faqs && faqs.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageCircleQuestion className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Aucune FAQ pour le moment</p>
            <Button onClick={openCreateDialog} className="mt-4">
              Créer la première FAQ
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {faqs?.map((faq) => (
          <Card key={faq.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded">
                      {categories.find((c) => c.value === faq.category)?.label || faq.category}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{faq.questionFr}</CardTitle>
                  <CardDescription className="mt-1">{faq.questionEn}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(faq)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(faq.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium mb-1">Réponse (FR):</p>
                  <p className="text-sm text-muted-foreground">{faq.answerFr}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Réponse (EN):</p>
                  <p className="text-sm text-muted-foreground">{faq.answerEn}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Mots-clés (FR):</p>
                  <p className="text-xs text-muted-foreground">{faq.keywordsFr}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Mots-clés (EN):</p>
                  <p className="text-xs text-muted-foreground">{faq.keywordsEn}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingFAQ ? "Modifier la FAQ" : "Nouvelle FAQ"}</DialogTitle>
            <DialogDescription>
              Remplissez les champs en français et en anglais pour créer une FAQ bilingue
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="category">Catégorie</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="questionFr">Question (Français) *</Label>
              <Input
                id="questionFr"
                value={questionFr}
                onChange={(e) => setQuestionFr(e.target.value)}
                placeholder="Ex: Quels sont vos horaires d'ouverture ?"
              />
            </div>

            <div>
              <Label htmlFor="questionEn">Question (English) *</Label>
              <Input
                id="questionEn"
                value={questionEn}
                onChange={(e) => setQuestionEn(e.target.value)}
                placeholder="Ex: What are your opening hours?"
              />
            </div>

            <div>
              <Label htmlFor="answerFr">Réponse (Français) *</Label>
              <Textarea
                id="answerFr"
                value={answerFr}
                onChange={(e) => setAnswerFr(e.target.value)}
                placeholder="Réponse détaillée en français..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="answerEn">Réponse (English) *</Label>
              <Textarea
                id="answerEn"
                value={answerEn}
                onChange={(e) => setAnswerEn(e.target.value)}
                placeholder="Detailed answer in English..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="keywordsFr">Mots-clés (Français) *</Label>
              <Input
                id="keywordsFr"
                value={keywordsFr}
                onChange={(e) => setKeywordsFr(e.target.value)}
                placeholder="horaire,heure,ouvert,fermeture (séparés par des virgules)"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Mots-clés pour la détection automatique, séparés par des virgules
              </p>
            </div>

            <div>
              <Label htmlFor="keywordsEn">Mots-clés (English) *</Label>
              <Input
                id="keywordsEn"
                value={keywordsEn}
                onChange={(e) => setKeywordsEn(e.target.value)}
                placeholder="hours,open,close,schedule (comma-separated)"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Keywords for automatic detection, comma-separated
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {(createMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {editingFAQ ? "Mettre à jour" : "Créer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
