import { Link } from "wouter";
import { Hammer, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40 py-12 md:py-16">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between gap-8">
        <div className="max-w-xs">
          <Link href="/" className="flex items-center space-x-2 mb-4">
            <Hammer className="h-6 w-6 text-primary" />
            <span className="font-serif font-bold text-xl inline-block text-primary">
              ArtisanSN
            </span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The trusted digital bridge between everyday Senegalese families and skilled local artisans. Connecting communities, building trust.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Explore</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/artisans" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Find an Artisan
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  All Services
                </Link>
              </li>
              <li>
                <Link href="/bookings" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Manage Bookings
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">For Artisans</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/register-artisan" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Join the Platform
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} ArtisanSN. Crafted with <Heart className="inline h-3 w-3 text-destructive mx-1" /> in Senegal.
        </p>
      </div>
    </footer>
  );
}
