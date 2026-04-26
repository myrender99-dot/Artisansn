import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Home from "@/pages/home";
import Artisans from "@/pages/artisans";
import ArtisanProfile from "@/pages/artisan-profile";
import Categories from "@/pages/categories";
import RegisterArtisan from "@/pages/register-artisan";
import Bookings from "@/pages/bookings";
import Admin from "@/pages/admin";
import HowItWorks from "@/pages/how-it-works";
import Faq from "@/pages/faq";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location]);
  return null;
}

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/artisans" component={Artisans} />
          <Route path="/artisans/:id" component={ArtisanProfile} />
          <Route path="/categories" component={Categories} />
          <Route path="/register-artisan" component={RegisterArtisan} />
          <Route path="/bookings" component={Bookings} />
          <Route path="/how-it-works" component={HowItWorks} />
          <Route path="/faq" component={Faq} />
          <Route path="/admin" component={Admin} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
