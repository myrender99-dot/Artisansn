import { Artisan } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ArtisanCardProps {
  artisan: Artisan;
}

export function ArtisanCard({ artisan }: ArtisanCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-200 hover-elevate hover:-translate-y-1">
      <CardHeader className="flex flex-row items-start gap-4 pb-2">
        <Avatar className="h-16 w-16 border-2 border-primary/10">
          <AvatarImage src={artisan.photoUrl} alt={artisan.name} />
          <AvatarFallback className="bg-primary/5 text-primary text-lg font-serif">
            {getInitials(artisan.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col flex-1 gap-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg leading-none truncate pr-2" title={artisan.name}>
                {artisan.name}
              </h3>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <Wrench className="h-3 w-3 mr-1" />
                {artisan.category}
              </div>
            </div>
            {artisan.isVerified && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100/80 border-green-200 shrink-0">
                Vérifié
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1.5 shrink-0 text-secondary" />
            <span className="truncate">{artisan.city}</span>
          </div>
          <div className="flex items-center text-sm">
            <Star className="h-4 w-4 mr-1.5 shrink-0 fill-accent text-accent" />
            <span className="font-medium mr-1">{artisan.averageRating.toFixed(1)}</span>
            <span className="text-muted-foreground">({artisan.reviewCount} avis)</span>
          </div>
          {artisan.priceRange && (
            <div className="text-sm font-medium mt-2 bg-muted/50 inline-flex w-fit px-2 py-0.5 rounded text-foreground/80">
              {artisan.priceRange}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button asChild className="w-full font-semibold">
          <Link href={`/artisans/${artisan.id}`}>Voir le Profil</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
