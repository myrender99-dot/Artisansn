import { useState } from "react";
import { useParams, Link } from "wouter";
import { 
  useGetArtisan, 
  useListReviews, 
  useCreateReview, 
  useCreateBooking,
  useUpdateArtisan
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getListReviewsQueryKey, getGetArtisanQueryKey } from "@workspace/api-client-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Star, Phone, Mail, Clock, ShieldCheck, Wrench, Calendar as CalendarIcon, ChevronLeft, Edit, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const bookingSchema = z.object({
  clientName: z.string().min(2, "Le nom est obligatoire"),
  clientPhone: z.string().min(8, "Un numéro de téléphone valide est requis"),
  serviceDescription: z.string().min(10, "Veuillez décrire ce dont vous avez besoin"),
  scheduledDate: z.string().optional(),
  city: z.string().min(2, "La ville est obligatoire"),
});

const reviewSchema = z.object({
  clientName: z.string().min(2, "Le nom est obligatoire"),
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().optional(),
});

export default function ArtisanProfile() {
  const { id } = useParams<{ id: string }>();
  const artisanId = parseInt(id || "0", 10);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: artisan, isLoading: isArtisanLoading } = useGetArtisan(artisanId, {
    query: { enabled: !!artisanId }
  });

  const { data: reviewsData, isLoading: isReviewsLoading } = useListReviews(
    { artisanId },
    { query: { enabled: !!artisanId } }
  );

  const createBooking = useCreateBooking();
  const createReview = useCreateReview();
  const updateArtisan = useUpdateArtisan();

  const editProfileSchema = z.object({
    bio: z.string().min(20, "La présentation doit contenir au moins 20 caractères").max(500),
    priceRange: z.string().optional(),
    yearsExperience: z.coerce.number().min(0).max(60).optional(),
    phone: z.string().min(8, "Un numéro de téléphone valide est requis"),
    email: z.string().email("Adresse email invalide").optional().or(z.literal("")),
  });

  const editForm = useForm<z.infer<typeof editProfileSchema>>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      bio: artisan?.bio || "",
      priceRange: artisan?.priceRange || "",
      yearsExperience: artisan?.yearsExperience || 0,
      phone: artisan?.phone || "",
      email: artisan?.email || "",
    },
  });

  if (artisan && !editForm.getValues("phone") && artisan.phone) {
    editForm.reset({
      bio: artisan.bio || "",
      priceRange: artisan.priceRange || "",
      yearsExperience: artisan.yearsExperience || 0,
      phone: artisan.phone || "",
      email: artisan.email || "",
    });
  }

  const onEditSubmit = (values: z.infer<typeof editProfileSchema>) => {
    updateArtisan.mutate(
      { id: artisanId, data: values },
      {
        onSuccess: () => {
          toast({
            title: "Profil mis à jour",
            description: "Vos modifications ont été enregistrées avec succès.",
          });
          setIsEditDialogOpen(false);
          queryClient.invalidateQueries({ queryKey: getGetArtisanQueryKey(artisanId) });
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Échec de la mise à jour",
            description: "Impossible de mettre à jour le profil. Veuillez réessayer.",
          });
        }
      }
    );
  };

  const bookingForm = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      clientName: "",
      clientPhone: "",
      serviceDescription: "",
      scheduledDate: "",
      city: "",
    },
  });

  const reviewForm = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      clientName: "",
      rating: 5,
      comment: "",
    },
  });

  const onBookingSubmit = (values: z.infer<typeof bookingSchema>) => {
    createBooking.mutate(
      { data: { ...values, artisanId } },
      {
        onSuccess: () => {
          toast({
            title: "Demande envoyée !",
            description: "L'artisan vous contactera bientôt pour confirmer.",
          });
          bookingForm.reset();
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Échec de l'envoi",
            description: "Veuillez réessayer plus tard.",
          });
        }
      }
    );
  };

  const onReviewSubmit = (values: z.infer<typeof reviewSchema>) => {
    createReview.mutate(
      { data: { ...values, artisanId } },
      {
        onSuccess: () => {
          toast({
            title: "Avis soumis",
            description: "Merci pour votre retour !",
          });
          reviewForm.reset();
          queryClient.invalidateQueries({ queryKey: getListReviewsQueryKey({ artisanId }) });
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Échec de la soumission",
            description: "Veuillez réessayer plus tard.",
          });
        }
      }
    );
  };

  if (isArtisanLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
          <div>
            <Skeleton className="h-[500px] w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!artisan) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Artisan introuvable</h2>
        <Button asChild>
          <Link href="/artisans">Retour aux Artisans</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-6">
        <Link href="/artisans" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Retour à la Recherche
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Zone de contenu principale */}
        <div className="lg:col-span-2 space-y-8">
          {/* En-tête du profil */}
          <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shadow-md shrink-0">
                <AvatarImage src={artisan.photoUrl} alt={artisan.name} className="object-cover" />
                <AvatarFallback className="bg-primary/10 text-primary text-3xl font-serif">
                  {artisan.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-serif font-bold text-foreground">{artisan.name}</h1>
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Modifier le Profil</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Modifier le Profil</DialogTitle>
                          <DialogDescription>
                            Mettez à jour vos informations professionnelles et vos coordonnées.
                          </DialogDescription>
                        </DialogHeader>
                        <Form {...editForm}>
                          <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={editForm.control}
                                name="phone"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Téléphone</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={editForm.control}
                                name="email"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={editForm.control}
                                name="priceRange"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Tarifs</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={editForm.control}
                                name="yearsExperience"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Années d'Expérience</FormLabel>
                                    <FormControl>
                                      <Input type="number" min="0" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <FormField
                              control={editForm.control}
                              name="bio"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Présentation</FormLabel>
                                  <FormControl>
                                    <Textarea className="h-24 resize-none" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="flex justify-end pt-4">
                              <Button type="submit" disabled={updateArtisan.isPending}>
                                {updateArtisan.isPending ? "Enregistrement..." : "Enregistrer"}
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </div>
                  {artisan.isVerified && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100/80 border-green-200">
                      <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                      Professionnel Vérifié
                    </Badge>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center font-medium text-foreground">
                    <Wrench className="h-4 w-4 mr-1.5 text-primary" />
                    {artisan.category}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1.5 shrink-0" />
                    {artisan.city}
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1.5 text-accent fill-accent" />
                    <span className="font-medium text-foreground mr-1">{artisan.averageRating.toFixed(1)}</span>
                    <span>({artisan.reviewCount} avis)</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  {artisan.priceRange && (
                    <Badge variant="outline" className="text-xs font-normal bg-muted/30">
                      Tarif : {artisan.priceRange}
                    </Badge>
                  )}
                  {artisan.yearsExperience && (
                    <Badge variant="outline" className="text-xs font-normal bg-muted/30">
                      {artisan.yearsExperience} ans d'expérience
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 pt-3">
                  <Button
                    asChild
                    size="lg"
                    className="bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-sm"
                  >
                    <a
                      href={`https://wa.me/${artisan.phone.replace(/\D/g, "").replace(/^0+/, "221")}?text=${encodeURIComponent(`Bonjour ${artisan.name}, je vous contacte via Teranga Services pour un service de ${artisan.category.toLowerCase()}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Contacter sur WhatsApp
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <a href={`tel:${artisan.phone}`}>
                      <Phone className="h-5 w-5 mr-2" />
                      Appeler
                    </a>
                  </Button>
                </div>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div>
              <h3 className="text-lg font-semibold mb-3">À propos</h3>
              <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                {artisan.bio || "Cet artisan n'a pas encore renseigné sa présentation."}
              </p>
            </div>
          </div>

          {/* Onglets Avis & Infos */}
          <Tabs defaultValue="reviews" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/50 p-1">
              <TabsTrigger value="reviews" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Avis ({artisan.reviewCount})</TabsTrigger>
              <TabsTrigger value="contact" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Coordonnées</TabsTrigger>
            </TabsList>
            
            <TabsContent value="reviews" className="space-y-6">
              <div className="bg-card border rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-6 flex items-center">
                  Avis des Clients
                </h3>
                
                {isReviewsLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                ) : reviewsData?.reviews && reviewsData.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviewsData.reviews.map((review) => (
                      <div key={review.id} className="border-b last:border-0 pb-6 last:pb-0">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium">{review.clientName}</div>
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-3.5 w-3.5 ${i < review.rating ? "text-accent fill-accent" : "text-muted border-muted"}`} 
                              />
                            ))}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground mb-3">
                          {format(new Date(review.createdAt), "d MMMM yyyy", { locale: fr })}
                        </div>
                        {review.comment && (
                          <p className="text-sm text-foreground/90">{review.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Star className="h-8 w-8 text-muted mx-auto mb-3" />
                    <p>Aucun avis pour cet artisan pour le moment.</p>
                  </div>
                )}
              </div>

              {/* Formulaire d'avis */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Laisser un Avis</CardTitle>
                  <CardDescription>Partagez votre expérience avec {artisan.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...reviewForm}>
                    <form onSubmit={reviewForm.handleSubmit(onReviewSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={reviewForm.control}
                          name="clientName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Votre Nom</FormLabel>
                              <FormControl>
                                <Input placeholder="Amadou Diallo" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={reviewForm.control}
                          name="rating"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Note (1-5)</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Choisir une note" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="5">5 - Excellent</SelectItem>
                                  <SelectItem value="4">4 - Très bien</SelectItem>
                                  <SelectItem value="3">3 - Bien</SelectItem>
                                  <SelectItem value="2">2 - Passable</SelectItem>
                                  <SelectItem value="1">1 - Insuffisant</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={reviewForm.control}
                        name="comment"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Votre Avis (Optionnel)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Décrivez le travail effectué et comment cela s'est passé..." 
                                className="resize-none" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        disabled={createReview.isPending}
                        className="bg-primary"
                      >
                        {createReview.isPending ? "Envoi en cours..." : "Soumettre l'Avis"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="contact">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Coordonnées</CardTitle>
                  <CardDescription>Informations de contact directes pour cet artisan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <a
                    href={`https://wa.me/${artisan.phone.replace(/\D/g, "").replace(/^0+/, "221")}?text=${encodeURIComponent(`Bonjour ${artisan.name}, je vous contacte via Teranga Services pour un service de ${artisan.category.toLowerCase()}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-4 bg-[#25D366]/10 hover:bg-[#25D366]/20 rounded-lg border border-[#25D366]/30 transition-colors"
                  >
                    <MessageCircle className="h-5 w-5 mr-4 text-[#25D366]" />
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">WhatsApp</p>
                      <p className="text-lg font-medium">{artisan.phone}</p>
                    </div>
                    <span className="ml-auto text-xs font-medium text-[#25D366]">Discuter →</span>
                  </a>
                  <a
                    href={`tel:${artisan.phone}`}
                    className="flex items-center p-4 bg-muted/30 hover:bg-muted/50 rounded-lg border transition-colors"
                  >
                    <Phone className="h-5 w-5 mr-4 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">Appel Téléphonique</p>
                      <p className="text-lg font-medium">{artisan.phone}</p>
                    </div>
                    <span className="ml-auto text-xs font-medium text-primary">Appeler →</span>
                  </a>
                  {artisan.email && (
                    <div className="flex items-center p-4 bg-muted/30 rounded-lg border">
                      <Mail className="h-5 w-5 mr-4 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground font-medium">Adresse Email</p>
                        <p className="text-lg font-medium">{artisan.email}</p>
                      </div>
                    </div>
                  )}
                  <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20 text-secondary-foreground text-sm mt-4">
                    <strong>Conseil :</strong> Nous vous recommandons d'envoyer une demande de réservation via la plateforme pour conserver une trace de votre demande. Vous pouvez aussi appeler directement en cas d'urgence.
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Colonne latérale — Formulaire de Réservation */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <Card className="border-primary/20 shadow-md">
              <CardHeader className="bg-primary/5 border-b pb-4">
                <CardTitle className="text-xl font-serif">Demander un Service</CardTitle>
                <CardDescription>
                  Envoyez une demande directement à {artisan.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Form {...bookingForm}>
                  <form onSubmit={bookingForm.handleSubmit(onBookingSubmit)} className="space-y-4">
                    <FormField
                      control={bookingForm.control}
                      name="serviceDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>De quoi avez-vous besoin ?</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="ex. Mon évier de cuisine fuit et doit être réparé..." 
                              className="h-24 resize-none"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 gap-4">
                      <FormField
                        control={bookingForm.control}
                        name="clientName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Votre Nom Complet</FormLabel>
                            <FormControl>
                              <Input placeholder="Fatou Ndiaye" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={bookingForm.control}
                        name="clientPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Numéro de Téléphone</FormLabel>
                            <FormControl>
                              <Input placeholder="77 XXX XX XX" type="tel" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={bookingForm.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Votre Ville / Quartier</FormLabel>
                            <FormControl>
                              <Input placeholder="Dakar, Almadies" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={bookingForm.control}
                        name="scheduledDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date Souhaitée (Optionnel)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input type="date" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full h-12 text-lg font-medium mt-6 bg-secondary text-secondary-foreground hover:bg-secondary/90"
                      disabled={createBooking.isPending}
                    >
                      {createBooking.isPending ? "Envoi en cours..." : "Envoyer la Demande"}
                    </Button>
                    <p className="text-xs text-center text-muted-foreground mt-4">
                      Aucun paiement requis à cette étape. Vous discuterez du tarif directement avec l'artisan.
                    </p>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
