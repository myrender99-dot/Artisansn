import { Link } from "wouter";
import { Hammer, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const navLinks = [
  { href: "/artisans", label: "Trouver un Artisan" },
  { href: "/categories", label: "Services" },
  { href: "/bookings", label: "Mes Réservations" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Hammer className="h-6 w-6 text-primary" />
            <span className="font-serif font-bold text-xl inline-block text-primary">
              Teranga Services
            </span>
          </Link>
          <nav className="hidden lg:flex gap-6">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden sm:flex items-center space-x-2 md:space-x-4">
          <Button asChild variant="outline" className="hidden md:inline-flex">
            <Link href="/register-artisan">Devenir Artisan</Link>
          </Button>
          <Button asChild>
            <Link href="/artisans">Réserver</Link>
          </Button>
        </div>

        <div className="sm:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Ouvrir le menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px]">
              <SheetHeader>
                <SheetTitle className="text-left flex items-center gap-2">
                  <Hammer className="h-5 w-5 text-primary" />
                  Teranga Services
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1 px-2">
                {navLinks.map((l) => (
                  <SheetClose key={l.href} asChild>
                    <Link
                      href={l.href}
                      className="block px-3 py-3 rounded-md text-base font-medium hover:bg-muted"
                    >
                      {l.label}
                    </Link>
                  </SheetClose>
                ))}
                <div className="border-t my-4" />
                <SheetClose asChild>
                  <Link
                    href="/register-artisan"
                    className="block px-3 py-3 rounded-md text-base font-medium hover:bg-muted"
                  >
                    Devenir Artisan
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Button asChild className="mt-4 w-full">
                    <Link href="/artisans">Réserver</Link>
                  </Button>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
