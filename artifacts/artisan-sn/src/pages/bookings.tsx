import { useState } from "react";
import { useListBookings, useUpdateBooking, useListArtisans } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getListBookingsQueryKey } from "@workspace/api-client-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, MapPin, User, Phone, CheckCircle2, Clock, XCircle, FileText } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function Bookings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedArtisanId, setSelectedArtisanId] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const { data: artisans } = useListArtisans({ limit: 100 });
  
  const { data: bookingsData, isLoading } = useListBookings({
    artisanId: selectedArtisanId !== "all" ? parseInt(selectedArtisanId) : undefined,
  });

  const updateBooking = useUpdateBooking();

  const handleStatusUpdate = (id: number, newStatus: "pending" | "confirmed" | "completed" | "cancelled") => {
    const labels: Record<string, string> = {
      pending: "en attente",
      confirmed: "confirmée",
      completed: "terminée",
      cancelled: "annulée",
    };
    updateBooking.mutate(
      { id, data: { status: newStatus } },
      {
        onSuccess: () => {
          toast({
            title: "Statut mis à jour",
            description: `La réservation est maintenant ${labels[newStatus]}.`,
          });
          queryClient.invalidateQueries({ queryKey: getListBookingsQueryKey() });
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Échec de la mise à jour",
            description: "Impossible de mettre à jour le statut de la réservation.",
          });
        }
      }
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200"><Clock className="w-3 h-3 mr-1"/> En attente</Badge>;
      case "confirmed":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200"><CheckCircle2 className="w-3 h-3 mr-1"/> Confirmée</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200"><CheckCircle2 className="w-3 h-3 mr-1"/> Terminée</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200"><XCircle className="w-3 h-3 mr-1"/> Annulée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getArtisanName = (id: number) => {
    if (!artisans) return `Artisan #${id}`;
    const artisan = artisans.artisans.find(a => a.id === id);
    return artisan ? artisan.name : `Artisan #${id}`;
  };

  const filteredBookings = bookingsData?.bookings.filter(b => 
    filterStatus === "all" ? true : b.status === filterStatus
  ) || [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Gestion des Réservations</h1>
        <p className="text-muted-foreground">
          Consultez et gérez les demandes de service
        </p>
      </div>

      {/* Contrôles de filtrage */}
      <div className="bg-muted/40 p-4 rounded-xl mb-8 flex flex-col sm:flex-row gap-4 border">
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium">Voir les réservations de :</label>
          <Select value={selectedArtisanId} onValueChange={setSelectedArtisanId}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Choisir un artisan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les Artisans (Vue Admin)</SelectItem>
              {artisans?.artisans.map(a => (
                <SelectItem key={a.id} value={String(a.id)}>{a.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium">Filtrer par statut :</label>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="confirmed">Confirmée</SelectItem>
              <SelectItem value="completed">Terminée</SelectItem>
              <SelectItem value="cancelled">Annulée</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))
        ) : filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden border-border/80 shadow-sm">
              <div className="flex flex-col md:flex-row">
                <div className="flex-1 p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 font-medium px-3 py-1">
                        #{booking.id}
                      </Badge>
                      {getStatusBadge(booking.status)}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center">
                      <Calendar className="w-4 h-4 mr-1.5" />
                      Demandé le {format(new Date(booking.createdAt), "d MMM yyyy", { locale: fr })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Infos Client</h4>
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <User className="w-4 h-4 mr-2 mt-0.5 text-muted-foreground shrink-0" />
                          <span className="font-medium text-foreground">{booking.clientName}</span>
                        </div>
                        <div className="flex items-start">
                          <Phone className="w-4 h-4 mr-2 mt-0.5 text-muted-foreground shrink-0" />
                          <span>{booking.clientPhone}</span>
                        </div>
                        {booking.city && (
                          <div className="flex items-start">
                            <MapPin className="w-4 h-4 mr-2 mt-0.5 text-muted-foreground shrink-0" />
                            <span>{booking.city}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Détails du Travail</h4>
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <User className="w-4 h-4 mr-2 mt-0.5 text-muted-foreground shrink-0" />
                          <span>Artisan : <span className="font-medium">{getArtisanName(booking.artisanId)}</span></span>
                        </div>
                        {booking.scheduledDate && (
                          <div className="flex items-start">
                            <Clock className="w-4 h-4 mr-2 mt-0.5 text-muted-foreground shrink-0" />
                            <span>Date souhaitée : {booking.scheduledDate}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                    <div className="flex items-start">
                      <FileText className="w-4 h-4 mr-2 mt-0.5 text-muted-foreground shrink-0" />
                      <p className="text-sm text-foreground/90 whitespace-pre-line">{booking.serviceDescription}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/20 md:w-64 border-t md:border-t-0 md:border-l border-border/50 p-6 flex flex-col justify-center">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 text-center">Mettre à Jour</h4>
                  
                  {booking.status === "pending" && (
                    <div className="space-y-2">
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                        onClick={() => handleStatusUpdate(booking.id, "confirmed")}
                        disabled={updateBooking.isPending}
                      >
                        Confirmer
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full text-destructive hover:bg-destructive/10" 
                        onClick={() => handleStatusUpdate(booking.id, "cancelled")}
                        disabled={updateBooking.isPending}
                      >
                        Refuser
                      </Button>
                    </div>
                  )}

                  {booking.status === "confirmed" && (
                    <div className="space-y-2">
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700 text-white" 
                        onClick={() => handleStatusUpdate(booking.id, "completed")}
                        disabled={updateBooking.isPending}
                      >
                        Marquer Terminé
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full text-destructive hover:bg-destructive/10" 
                        onClick={() => handleStatusUpdate(booking.id, "cancelled")}
                        disabled={updateBooking.isPending}
                      >
                        Annuler
                      </Button>
                    </div>
                  )}

                  {(booking.status === "completed" || booking.status === "cancelled") && (
                    <div className="text-center text-sm text-muted-foreground py-4 flex flex-col items-center">
                      <CheckCircle2 className="w-8 h-8 mb-2 opacity-50" />
                      Cette réservation est clôturée.
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-medium mb-2">Aucune réservation trouvée</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Il n'y a aucune demande de service correspondant à vos filtres actuels.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
