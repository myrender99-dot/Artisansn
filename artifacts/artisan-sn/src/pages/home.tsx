import { useGetStats, useGetTopRatedArtisans, useListServices } from "@workspace/api-client-react";
import { Link, useLocation } from "wouter";
import { Search, Users, Calendar, MapPin, Wrench } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArtisanCard } from "@/components/ui/artisan-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CategoryIcon } from "@/lib/category-icon";
import { useState } from "react";

export default function Home() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: stats, isLoading: isStatsLoading } = useGetStats();
  const { data: topArtisans, isLoading: isTopArtisansLoading } = useGetTopRatedArtisans({ limit: 4 });
  const { data: servicesData, isLoading: isServicesLoading } = useListServices();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/artisans?search=${encodeURIComponent(searchQuery)}`);
    } else {
      setLocation("/artisans");
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh]">
      {/* Section Héro */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-bg.png" 
            alt="Marché de Dakar" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-primary/40" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center">
          <Badge className="mb-6 bg-secondary text-secondary-foreground hover:bg-secondary/90 border-none px-4 py-1 text-sm font-medium">
            La Marketplace de Confiance au Sénégal
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl max-w-4xl mb-6 text-white font-serif leading-tight">
            Trouvez l'artisan idéal pour votre projet
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mb-10 leading-relaxed">
            Plombiers, couturiers, électriciens et bien plus. Connectez-vous avec des professionnels qualifiés et vérifiés de votre communauté.
          </p>
          
          <form onSubmit={handleSearch} className="w-full max-w-2xl flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Quel service recherchez-vous ?" 
                className="pl-10 h-14 bg-background text-foreground text-lg rounded-xl shadow-lg border-none focus-visible:ring-secondary"
              />
            </div>
            <Button type="submit" size="lg" className="h-14 px-8 text-lg rounded-xl shadow-lg bg-secondary text-secondary-foreground hover:bg-secondary/90">
              Rechercher
            </Button>
          </form>
        </div>
      </section>

      {/* Section Statistiques */}
      <section className="py-12 bg-muted/30 border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
            <StatCard 
              icon={<Users className="h-6 w-6 text-secondary" />}
              value={isStatsLoading ? <Skeleton className="h-8 w-16 mx-auto" /> : stats?.totalArtisans.toString()}
              label="Artisans Inscrits"
            />
            <StatCard 
              icon={<Calendar className="h-6 w-6 text-green-500" />}
              value={isStatsLoading ? <Skeleton className="h-8 w-16 mx-auto" /> : stats?.completedJobs.toString()}
              label="Réservations Confirmées"
            />
            <StatCard 
              icon={<MapPin className="h-6 w-6 text-accent" />}
              value={isStatsLoading ? <Skeleton className="h-8 w-16 mx-auto" /> : stats?.totalCities.toString()}
              label="Villes Couvertes"
            />
            <StatCard 
              icon={<Wrench className="h-6 w-6 text-primary" />}
              value={isStatsLoading || !servicesData ? <Skeleton className="h-8 w-16 mx-auto" /> : servicesData.services.length.toString()}
              label="Catégories de Services"
            />
          </div>
        </div>
      </section>

      {/* Services Populaires */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-serif text-foreground mb-2">Services Populaires</h2>
              <p className="text-muted-foreground">Trouvez exactement ce que vous cherchez</p>
            </div>
            <Button variant="outline" asChild className="hidden md:inline-flex">
              <Link href="/categories">Voir Toutes les Catégories</Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {isServicesLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))
            ) : (
              servicesData?.services.slice(0, 6).map((category) => (
                <Link key={category.id} href={`/artisans?category=${encodeURIComponent(category.name)}`}>
                  <Card className="h-full hover-elevate transition-all cursor-pointer group border-primary/10">
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full gap-3">
                      <div className="p-3 rounded-full bg-primary/5 text-primary group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors">
                        <CategoryIcon name={category.name} className="h-6 w-6" />
                      </div>
                      <span className="font-medium text-sm">{category.name}</span>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Button variant="outline" asChild>
              <Link href="/categories">Voir Toutes les Catégories</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Artisans Mieux Notés */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-serif text-foreground mb-2">Artisans les Mieux Notés</h2>
              <p className="text-muted-foreground">Les meilleurs professionnels de notre communauté</p>
            </div>
            <Button variant="outline" asChild className="hidden md:inline-flex">
              <Link href="/artisans">Voir Tous</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isTopArtisansLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-[300px] rounded-xl" />
              ))
            ) : topArtisans && topArtisans.artisans.length > 0 ? (
              topArtisans.artisans.map((artisan) => (
                <ArtisanCard key={artisan.id} artisan={artisan} />
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-muted-foreground">
                Aucun artisan trouvé.
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Section Appel à l'Action */}
      <section className="py-24 bg-primary text-primary-foreground text-center px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-serif mb-6">Vous êtes un artisan qualifié ?</h2>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-10">
            Rejoignez des milliers de professionnels qui développent leur activité sur Teranga Services. Inscrivez-vous gratuitement et commencez à recevoir des demandes de clients dans votre ville.
          </p>
          <Button asChild size="lg" className="h-14 px-8 text-lg rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg">
            <Link href="/register-artisan">Rejoindre la Plateforme</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode, value: React.ReactNode, label: string }) {
  return (
    <div className="flex flex-col items-center text-center p-4">
      <div className="p-3 bg-background rounded-full shadow-sm mb-4">
        {icon}
      </div>
      <div className="text-3xl font-bold font-serif mb-1 text-foreground">
        {value}
      </div>
      <div className="text-sm font-medium text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
