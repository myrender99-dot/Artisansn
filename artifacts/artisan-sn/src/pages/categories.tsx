import { useListServices } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Wrench, ArrowRight, Home, Zap, Scissors, Car, Paintbrush, Briefcase } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const getIconForCategory = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('plomb')) return <Wrench className="h-8 w-8" />;
  if (lowerName.includes('electr') || lowerName.includes('électr')) return <Zap className="h-8 w-8" />;
  if (lowerName.includes('coutur') || lowerName.includes('taill')) return <Scissors className="h-8 w-8" />;
  if (lowerName.includes('mécan') || lowerName.includes('auto')) return <Car className="h-8 w-8" />;
  if (lowerName.includes('peint')) return <Paintbrush className="h-8 w-8" />;
  if (lowerName.includes('menuis') || lowerName.includes('bois')) return <Home className="h-8 w-8" />;
  return <Briefcase className="h-8 w-8" />;
};

export default function Categories() {
  const { data: servicesData, isLoading } = useListServices();

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-serif font-bold text-foreground mb-4">Catégories de Services</h1>
        <p className="text-lg text-muted-foreground">
          Parcourez notre répertoire complet de professionnels qualifiés dans tout le Sénégal. Quels que soient vos besoins, nous avons le bon expert pour vous.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))
        ) : servicesData?.services.length ? (
          servicesData.services.map((category) => (
            <Link key={category.id} href={`/artisans?category=${encodeURIComponent(category.name)}`}>
              <Card className="h-full hover-elevate transition-all duration-300 cursor-pointer group border-primary/10 overflow-hidden">
                <CardContent className="p-6 h-full flex flex-col items-center text-center justify-center relative">
                  <div className="mb-4 p-4 rounded-full bg-primary/5 text-primary group-hover:bg-secondary group-hover:text-secondary-foreground transition-all duration-300">
                    {getIconForCategory(category.name)}
                  </div>
                  <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {category.artisanCount} {category.artisanCount === 1 ? 'professionnel disponible' : 'professionnels disponibles'}
                  </p>
                  
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                    <ArrowRight className="h-5 w-5 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-muted-foreground bg-muted/20 rounded-xl">
            Aucune catégorie trouvée.
          </div>
        )}
      </div>

      <div className="mt-20 bg-primary/5 border border-primary/10 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <h2 className="text-2xl font-serif font-bold mb-2">Vous ne trouvez pas ce que vous cherchez ?</h2>
          <p className="text-muted-foreground max-w-md">
            Notre marketplace est en constante croissance. Essayez de rechercher des mots-clés spécifiques ou parcourez tous nos artisans.
          </p>
        </div>
        <Button asChild size="lg" className="shrink-0 bg-primary">
          <Link href="/artisans">Rechercher tous les Artisans</Link>
        </Button>
      </div>
    </div>
  );
}
