import { useState } from "react";
import { useLocation } from "wouter";
import { useCreateArtisan, useListServices } from "@workspace/api-client-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Briefcase, User, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const artisanSchema = z.object({
  name: z.string().min(2, "Le nom complet doit contenir au moins 2 caractères"),
  category: z.string().min(1, "Veuillez sélectionner votre métier"),
  city: z.string().min(2, "La ville est obligatoire"),
  phone: z.string().min(8, "Un numéro de téléphone valide est requis"),
  email: z.string().email("Adresse email invalide").optional().or(z.literal("")),
  bio: z.string().min(20, "Veuillez décrire vos services en au moins 20 caractères").max(500),
  yearsExperience: z.coerce.number().min(0, "L'expérience ne peut pas être négative").max(60).optional(),
  priceRange: z.string().optional(),
});

export default function RegisterArtisan() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { data: servicesData, isLoading: isServicesLoading } = useListServices();
  const createArtisan = useCreateArtisan();

  const form = useForm<z.infer<typeof artisanSchema>>({
    resolver: zodResolver(artisanSchema),
    defaultValues: {
      name: "",
      category: "",
      city: "",
      phone: "",
      email: "",
      bio: "",
      priceRange: "Négociable",
    },
  });

  const cities = ["Dakar", "Thiès", "Saint-Louis", "Ziguinchor", "Touba", "Mbour", "Kaolack", "Rufisque", "Diourbel"];

  const onSubmit = (values: z.infer<typeof artisanSchema>) => {
    createArtisan.mutate(
      { data: values },
      {
        onSuccess: (data) => {
          setIsSuccess(true);
          toast({
            title: "Inscription réussie !",
            description: "Bienvenue sur Teranga Services. Votre profil est maintenant en ligne.",
          });
          setTimeout(() => {
            setLocation(`/artisans/${data.id}`);
          }, 3000);
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Échec de l'inscription",
            description: "Une erreur est survenue lors de la création de votre profil. Veuillez réessayer.",
          });
        }
      }
    );
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-md text-center">
        <div className="bg-primary/5 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-foreground mb-4">Bienvenue sur Teranga Services !</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Votre profil a été créé avec succès. Vous allez être redirigé vers votre nouvelle page de profil...
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-serif font-bold text-foreground mb-4">Rejoindre la Plateforme</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Créez votre profil professionnel sur Teranga Services pour vous connecter avec des milliers de clients qui recherchent vos compétences. L'inscription est gratuite.
        </p>
      </div>

      <Card className="border-border shadow-md">
        <CardHeader className="bg-muted/30 border-b pb-6">
          <CardTitle className="text-2xl font-serif">Informations du Profil</CardTitle>
          <CardDescription>
            Ces informations seront affichées publiquement aux clients potentiels.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Section Infos Personnelles */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center text-foreground">
                  <User className="w-5 h-5 mr-2 text-primary" /> Informations Personnelles
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom Complet</FormLabel>
                        <FormControl>
                          <Input placeholder="ex. Moussa Ndiaye" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Numéro de Téléphone</FormLabel>
                        <FormControl>
                          <Input placeholder="77 XXX XX XX" type="tel" {...field} />
                        </FormControl>
                        <FormDescription>Les clients utiliseront ce numéro pour vous contacter.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adresse Email (Optionnel)</FormLabel>
                        <FormControl>
                          <Input placeholder="moussa@exemple.com" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ville Principale</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Choisissez votre ville" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {cities.map((c) => (
                              <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Section Infos Professionnelles */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold flex items-center text-foreground">
                  <Briefcase className="w-5 h-5 mr-2 text-primary" /> Informations Professionnelles
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Métier / Spécialité</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger disabled={isServicesLoading}>
                              <SelectValue placeholder="Choisissez votre métier" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {servicesData?.services.map((service) => (
                              <SelectItem key={service.id} value={service.name}>
                                {service.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="yearsExperience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Années d'Expérience (Optionnel)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" placeholder="ex. 5" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="priceRange"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Politique Tarifaire</FormLabel>
                        <FormControl>
                          <Input placeholder="ex. Négociable, Prix fixe, Tarif horaire..." {...field} />
                        </FormControl>
                        <FormDescription>Comment facturez-vous généralement vos services ?</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Présentation Professionnelle</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Parlez de votre expertise, des services que vous proposez et pourquoi les clients devraient vous choisir..." 
                            className="h-32 resize-none"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>Minimum 20 caractères.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="pt-6 border-t flex flex-col sm:flex-row justify-end gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setLocation("/")}
                  className="w-full sm:w-auto"
                >
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  disabled={createArtisan.isPending}
                  className="w-full sm:w-auto bg-primary text-primary-foreground min-w-[200px]"
                >
                  {createArtisan.isPending ? "Création en cours..." : "Finaliser l'Inscription"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
