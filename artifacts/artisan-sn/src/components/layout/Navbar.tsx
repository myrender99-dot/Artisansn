import { Link } from "wouter";
import { Hammer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Hammer className="h-6 w-6 text-primary" />
            <span className="font-serif font-bold text-xl inline-block text-primary">
              ArtisanSN
            </span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/artisans"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Find an Artisan
            </Link>
            <Link
              href="/categories"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Services
            </Link>
            <Link
              href="/bookings"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              My Bookings
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <Button asChild variant="outline" className="hidden sm:inline-flex">
            <Link href="/register-artisan">Become an Artisan</Link>
          </Button>
          <Button asChild>
            <Link href="/artisans">Book Now</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
