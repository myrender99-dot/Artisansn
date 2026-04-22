import { useState } from "react";
import { useLocation } from "wouter";
import { useCreateArtisan, useListServices } from "@workspace/api-client-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Briefcase, MapPin, User, Phone, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const artisanSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  category: z.string().min(1, "Please select a profession"),
  city: z.string().min(2, "City is required"),
  phone: z.string().min(8, "Valid phone number is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  bio: z.string().min(20, "Please provide a brief description of your services").max(500),
  yearsExperience: z.coerce.number().min(0, "Experience cannot be negative").max(60).optional(),
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
      priceRange: "Negotiable",
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
            title: "Registration successful!",
            description: "Welcome to ArtisanSN. Your profile is now live.",
          });
          // Redirect after a brief delay
          setTimeout(() => {
            setLocation(`/artisans/${data.id}`);
          }, 3000);
        },
        onError: (err) => {
          toast({
            variant: "destructive",
            title: "Registration failed",
            description: "There was an error creating your profile. Please try again.",
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
        <h1 className="text-3xl font-serif font-bold text-foreground mb-4">Welcome to ArtisanSN!</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Your profile has been created successfully. You are being redirected to your new profile page...
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-serif font-bold text-foreground mb-4">Join the Platform</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Create your professional profile on ArtisanSN to connect with thousands of clients looking for your skills. Registration is free.
        </p>
      </div>

      <Card className="border-border shadow-md">
        <CardHeader className="bg-muted/30 border-b pb-6">
          <CardTitle className="text-2xl font-serif">Artisan Profile Details</CardTitle>
          <CardDescription>
            This information will be displayed publicly to potential clients.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Personal Info Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center text-foreground">
                  <User className="w-5 h-5 mr-2 text-primary" /> Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Moussa Ndiaye" {...field} />
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
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="77 XXX XX XX" type="tel" {...field} />
                        </FormControl>
                        <FormDescription>Clients will use this to contact you.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="moussa@example.com" type="email" {...field} />
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
                        <FormLabel>Primary City</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your city" />
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

              {/* Professional Info Section */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold flex items-center text-foreground">
                  <Briefcase className="w-5 h-5 mr-2 text-primary" /> Professional Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profession / Trade</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger disabled={isServicesLoading}>
                              <SelectValue placeholder="Select your trade" />
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
                        <FormLabel>Years of Experience (Optional)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" placeholder="e.g. 5" {...field} />
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
                        <FormLabel>Pricing Policy</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Negotiable, Fixed price, Hourly rate..." {...field} />
                        </FormControl>
                        <FormDescription>How do you typically charge for your services?</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Professional Bio</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell clients about your expertise, the services you offer, and why they should choose you..." 
                            className="h-32 resize-none"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>Minimum 20 characters.</FormDescription>
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
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createArtisan.isPending}
                  className="w-full sm:w-auto bg-primary text-primary-foreground min-w-[200px]"
                >
                  {createArtisan.isPending ? "Creating Profile..." : "Complete Registration"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
