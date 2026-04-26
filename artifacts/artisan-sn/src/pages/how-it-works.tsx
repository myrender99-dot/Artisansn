import { Link } from "wouter";
import { Search, MessageCircle, Star, UserPlus, Briefcase, BadgeCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function HowItWorks() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
          Comment ça marche ?
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Teranga Services connecte les familles sénégalaises aux meilleurs artisans de leur quartier en 3 étapes simples.
        </p>
      </div>

      <section className="mb-20">
        <h2 className="text-3xl font-serif font-bold text-center mb-10">Pour les Clients</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <StepCard
            number="1"
            icon={<Search className="h-6 w-6" />}
            title="Trouvez l'artisan"
            description="Parcourez notre annuaire de plus de 30 catégories : plomberie, couture, informatique, traiteur, photographie et bien plus. Filtrez par ville et lisez les avis."
          />
          <StepCard
            number="2"
            icon={<MessageCircle className="h-6 w-6" />}
            title="Contactez directement"
            description="Cliquez sur WhatsApp, appelez ou envoyez une demande. La discussion et la négociation se font directement entre vous et l'artisan."
          />
          <StepCard
            number="3"
            icon={<Star className="h-6 w-6" />}
            title="Évaluez le service"
            description="Une fois le travail terminé, laissez un avis honnête. Vous aidez la communauté à reconnaître les meilleurs professionnels."
          />
        </div>
        <div className="text-center mt-10">
          <Button asChild size="lg" className="h-12 px-8">
            <Link href="/artisans">Trouver un Artisan <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      <section className="bg-primary/5 rounded-3xl p-8 md:p-12">
        <h2 className="text-3xl font-serif font-bold text-center mb-10">Pour les Artisans</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <StepCard
            number="1"
            icon={<UserPlus className="h-6 w-6" />}
            title="Inscrivez-vous gratuitement"
            description="Créez votre profil professionnel en moins de 5 minutes. Indiquez votre métier, votre ville, vos tarifs et ajoutez une photo."
          />
          <StepCard
            number="2"
            icon={<Briefcase className="h-6 w-6" />}
            title="Recevez des demandes"
            description="Les clients vous contactent directement par WhatsApp, par téléphone ou via le formulaire de réservation. Aucune commission prélevée."
          />
          <StepCard
            number="3"
            icon={<BadgeCheck className="h-6 w-6" />}
            title="Construisez votre réputation"
            description="Plus vos clients sont satisfaits, plus vous montez dans les résultats de recherche. Devenez « Professionnel Vérifié » et gagnez la confiance de nouveaux clients."
          />
        </div>
        <div className="text-center mt-10">
          <Button asChild size="lg" className="h-12 px-8 bg-secondary text-secondary-foreground hover:bg-secondary/90">
            <Link href="/register-artisan">Devenir Artisan <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      <section className="mt-20 text-center">
        <h2 className="text-2xl font-serif font-bold mb-4">Une question ?</h2>
        <p className="text-muted-foreground mb-6">Consultez notre FAQ pour les réponses aux questions les plus fréquentes.</p>
        <Button asChild variant="outline" size="lg">
          <Link href="/faq">Voir la FAQ</Link>
        </Button>
      </section>
    </div>
  );
}

function StepCard({ number, icon, title, description }: { number: string; icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="h-full border-primary/10 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary text-primary-foreground font-serif font-bold text-xl">
            {number}
          </div>
          <div className="text-primary">{icon}</div>
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}
