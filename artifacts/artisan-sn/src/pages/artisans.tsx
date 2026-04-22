import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useListArtisans, useListServices } from "@workspace/api-client-react";
import { Search, Filter, SlidersHorizontal, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArtisanCard } from "@/components/ui/artisan-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function Artisans() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "";
  
  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [category, setCategory] = useState<string>(initialCategory === "all" ? "" : initialCategory);
  const [city, setCity] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: artisansData, isLoading: isArtisansLoading } = useListArtisans({
    search: debouncedSearch || undefined,
    category: category && category !== "all" ? category : undefined,
    city: city && city !== "all" ? city : undefined,
    limit: 50
  });

  const { data: servicesData } = useListServices();

  const cities = ["Dakar", "Thiès", "Saint-Louis", "Ziguinchor", "Touba", "Mbour", "Kaolack", "Rufisque", "Diourbel"];

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <label className="text-sm font-medium">Service Category</label>
        <Select value={category || "all"} onValueChange={setCategory}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {servicesData?.services.map(service => (
              <SelectItem key={service.id} value={service.name}>
                {service.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium">City</label>
        <Select value={city || "all"} onValueChange={setCity}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Any Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Location</SelectItem>
            {cities.map(c => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => {
          setCategory("");
          setCity("");
          setSearch("");
        }}
      >
        Clear Filters
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Find an Artisan</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Browse our community of skilled professionals ready to help.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block w-64 shrink-0 border-r pr-8">
          <div className="sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-lg flex items-center">
                <Filter className="mr-2 h-4 w-4" /> Filters
              </h2>
            </div>
            <FilterContent />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, skill, or keyword..."
                className="pl-9 h-11 bg-background shadow-sm"
              />
            </div>
            
            {/* Mobile Filter Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="h-11 lg:hidden flex items-center shrink-0 shadow-sm">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filters
                  {(category || city) && (
                    <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-primary text-primary-foreground">
                      {(category ? 1 : 0) + (city ? 1 : 0)}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>
                    Refine your search results
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Active Filters Display */}
          {(category || city || debouncedSearch) && (
            <div className="flex flex-wrap gap-2 items-center text-sm">
              <span className="text-muted-foreground mr-1">Showing results for:</span>
              {debouncedSearch && (
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 font-normal">
                  "{debouncedSearch}"
                </Badge>
              )}
              {category && (
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 font-normal">
                  {category}
                </Badge>
              )}
              {city && (
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 font-normal flex items-center">
                  <MapPin className="h-3 w-3 mr-1" /> {city}
                </Badge>
              )}
            </div>
          )}

          {/* Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {isArtisansLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-[300px] rounded-xl" />
              ))
            ) : artisansData && artisansData.artisans.length > 0 ? (
              artisansData.artisans.map((artisan) => (
                <ArtisanCard key={artisan.id} artisan={artisan} />
              ))
            ) : (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-muted/20 rounded-xl border border-dashed">
                <Search className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-xl font-medium mb-2">No artisans found</h3>
                <p className="text-muted-foreground max-w-md">
                  We couldn't find any artisans matching your current filters. Try adjusting your search criteria or removing some filters.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-6"
                  onClick={() => {
                    setCategory("");
                    setCity("");
                    setSearch("");
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
