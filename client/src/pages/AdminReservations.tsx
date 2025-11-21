import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Calendar, Users, MapPin, DollarSign, Search } from "lucide-react";
import { Link, useLocation } from "wouter";
import { APP_LOGO, APP_TITLE } from "@/const";

type ReservationStatus = "pending" | "confirmed" | "cancelled" | "completed";

export default function AdminReservations() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: reservations, isLoading, refetch } = trpc.reservations.listAll.useQuery(undefined, {
    enabled: user?.role === "admin",
  });

  const updateStatus = trpc.reservations.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Reservation status updated successfully");
      refetch();
    },
    onError: (error: { message: string }) => {
      toast.error(error.message);
    },
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    navigate("/");
    return null;
  }

  const filteredReservations = reservations?.filter((reservation) => {
    const matchesStatus = statusFilter === "all" || reservation.status === statusFilter;
    const matchesSearch =
      searchQuery === "" ||
      reservation.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.customerPhone.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default";
      case "pending":
        return "secondary";
      case "cancelled":
        return "destructive";
      case "completed":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case "wedding":
        return "Mariage";
      case "corporate":
        return "Corporatif";
      case "private_party":
        return "Fête privée";
      default:
        return type;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-CA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (cents: number | null) => {
    if (!cents) return "N/A";
    return new Intl.NumberFormat("fr-CA", {
      style: "currency",
      currency: "CAD",
    }).format(cents / 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center space-x-3 cursor-pointer">
                <img src={APP_LOGO} alt={APP_TITLE} className="h-12 w-12 object-contain" />
                <span className="text-2xl font-bold text-emerald-600">{APP_TITLE}</span>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/admin/orders">
                <Button variant="outline">Commandes</Button>
              </Link>
              <Link href="/">
                <Button variant="outline">Retour au site</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Réservations</h1>
          <p className="text-gray-600">Gérez toutes les réservations d'événements</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reservations?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">En attente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">
                {reservations?.filter((r) => r.status === "pending").length || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Confirmées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                {reservations?.filter((r) => r.status === "confirmed").length || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Complétées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {reservations?.filter((r) => r.status === "completed").length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtres</CardTitle>
            <CardDescription>Filtrer et rechercher les réservations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher par nom, email ou téléphone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ReservationStatus | "all")}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="confirmed">Confirmées</SelectItem>
                  <SelectItem value="cancelled">Annulées</SelectItem>
                  <SelectItem value="completed">Complétées</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Reservations Table */}
        <Card>
          <CardHeader>
            <CardTitle>Réservations</CardTitle>
            <CardDescription>
              {filteredReservations?.length || 0} réservation(s) trouvée(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
              </div>
            ) : filteredReservations && filteredReservations.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Type d'événement</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Heure</TableHead>
                      <TableHead>Invités</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReservations.map((reservation) => (
                      <TableRow key={reservation.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{reservation.customerName}</span>
                            <span className="text-sm text-gray-500">{reservation.customerEmail}</span>
                            <span className="text-sm text-gray-500">{reservation.customerPhone}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{getEventTypeLabel(reservation.eventType)}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {formatDate(reservation.eventDate)}
                          </div>
                        </TableCell>
                        <TableCell>{reservation.eventTime}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-400" />
                            {reservation.guestCount}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            {formatCurrency(reservation.estimatedBudget)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(reservation.status)}>
                            {reservation.status === "pending" && "En attente"}
                            {reservation.status === "confirmed" && "Confirmée"}
                            {reservation.status === "cancelled" && "Annulée"}
                            {reservation.status === "completed" && "Complétée"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={reservation.status}
                            onValueChange={(value) =>
                              updateStatus.mutate({
                                id: reservation.id,
                                status: value as ReservationStatus,
                              })
                            }
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">En attente</SelectItem>
                              <SelectItem value="confirmed">Confirmée</SelectItem>
                              <SelectItem value="cancelled">Annulée</SelectItem>
                              <SelectItem value="completed">Complétée</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Aucune réservation trouvée
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reservation Details Section */}
        {filteredReservations && filteredReservations.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Détails supplémentaires</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredReservations.map((reservation) => (
                  <div key={reservation.id} className="border-b pb-4 last:border-b-0">
                    <div className="font-medium mb-2">{reservation.customerName}</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {reservation.venue && (
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                          <div>
                            <span className="font-medium">Lieu:</span> {reservation.venue}
                          </div>
                        </div>
                      )}
                      {reservation.specialRequirements && (
                        <div>
                          <span className="font-medium">Exigences spéciales:</span>{" "}
                          {reservation.specialRequirements}
                        </div>
                      )}
                      {reservation.dietaryRestrictions && (
                        <div>
                          <span className="font-medium">Restrictions alimentaires:</span>{" "}
                          {reservation.dietaryRestrictions}
                        </div>
                      )}
                      {reservation.adminNotes && (
                        <div className="md:col-span-2">
                          <span className="font-medium">Notes admin:</span> {reservation.adminNotes}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
