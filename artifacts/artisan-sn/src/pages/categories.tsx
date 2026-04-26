import { useState, useMemo } from "react";
import { useListServices } from "@workspace/api-client-react";
import { Link } from "wouter";
import { ArrowRight, Search, X } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryIcon } from "@/lib/category-icon";

export default function Categories() {
  const { data: servicesData, isLoading } = useListServices();
  const [search, setSearch] = useState("");

  const filteredServices = useMemo(() => {
    if (!servicesData?.services) return [];
    const q = search.trim().toLowerCase();
    if (!q) return servicesData.services;
    return servicesData.services.filter((s) =>
      s.name.toLowerCase().includes(q) ||
      (s.description ?? "").toLowerCase().includes(q)
    );
  }, [servicesData, search]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-4xl font-serif font-bold text-foreground mb-4">Catégories de Services</h1>
        <p className="text-lg text-muted-foreground">
          Parcourez notre répertoire complet de professionnels qualifiés dans tout le Sénégal. Quels que soient vos besoins, nous avons le bon expert pour vous.
        </p>
      </div>

      <div className="max-w-xl mx-auto mb-10 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher une catégorie (ex. plomberie, photo, traiteur...)"
          className="pl-10 pr-10 h-12 text-base"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Effacer la recherche"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {!isLoading && servicesData && (
        <p className="text-sm text-muted-foreground text-center mb-6">
          {filteredServices.length} {filteredServices.length === 1 ? "catégorie" : "catégories"}
          {search && ` correspondent à « ${search} »`}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))
        ) : filteredServices.length ? (
          filteredServices.map((category) => (
            <Link key={category.id} href={`/artisans?category=${encodeURIComponent(category.name)}`}>
              <Card className="h-full hover-elevate transition-all duration-300 cursor-pointer group border-primary/10 overflow-hidden">
                <CardContent className="p-6 h-full flex flex-col items-center text-center justify-center relative">
                  <div className="mb-4 p-4 rounded-full bg-primary/5 text-primary group-hover:bg-secondary group-hover:text-secondary-foreground transition-all duration-300">
                    <CategoryIcon name={category.name} className="h-8 w-8" />
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
          <div className="col-span-full py-20 text-center bg-muted/20 rounded-xl">
            <Search className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Aucune catégorie ne correspond à « {search} ».
            </p>
            <Button variant="outline" onClick={() => setSearch("")}>
              Effacer la recherche
            </Button>
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
