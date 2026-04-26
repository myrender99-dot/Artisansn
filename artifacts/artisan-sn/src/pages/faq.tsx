import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const FAQ_SECTIONS: { title: string; questions: { q: string; a: string }[] }[] = [
  {
    title: "Pour les Clients",
    questions: [
      {
        q: "Teranga Services est-il gratuit pour les clients ?",
        a: "Oui, l'utilisation de Teranga Services est entièrement gratuite pour les clients. Vous pouvez parcourir l'annuaire, contacter les artisans et réserver des services sans aucun frais.",
      },
      {
        q: "Comment puis-je payer l'artisan ?",
        a: "Le paiement se fait directement entre vous et l'artisan, selon le mode que vous convenez ensemble : espèces, Wave, Orange Money ou virement. Teranga Services n'intervient pas dans la transaction.",
      },
      {
        q: "Que faire si l'artisan ne se présente pas ?",
        a: "Contactez d'abord l'artisan par WhatsApp ou par téléphone pour vous assurer qu'il n'y a pas de malentendu. Si le problème persiste, laissez un avis honnête sur son profil pour informer la communauté, et choisissez un autre professionnel.",
      },
      {
        q: "Comment vérifier qu'un artisan est sérieux ?",
        a: "Regardez son badge « Professionnel Vérifié » (vert), lisez les avis laissés par les clients précédents, vérifiez sa note moyenne, et n'hésitez pas à demander des photos de ses réalisations avant de confirmer.",
      },
      {
        q: "Mes coordonnées sont-elles partagées ?",
        a: "Vos coordonnées (nom, téléphone) ne sont visibles que par l'artisan que vous contactez, pour qu'il puisse vous répondre. Elles ne sont jamais affichées publiquement sur le site.",
      },
    ],
  },
  {
    title: "Pour les Artisans",
    questions: [
      {
        q: "L'inscription est-elle vraiment gratuite ?",
        a: "Oui, l'inscription et l'utilisation de Teranga Services sont 100 % gratuites pour les artisans. Aucun frais d'abonnement, aucune commission sur vos prestations.",
      },
      {
        q: "Comment être mieux référencé ?",
        a: "Trois leviers : 1) Complétez bien votre profil (photo, biographie, tarifs, expérience). 2) Répondez rapidement aux demandes. 3) Demandez à vos clients satisfaits de laisser un avis sur votre profil.",
      },
      {
        q: "Comment obtenir le badge « Professionnel Vérifié » ?",
        a: "Le badge est attribué par notre équipe d'administration après vérification de vos informations professionnelles. Plus vous êtes actif et bien noté, plus vous serez prioritaire pour la vérification.",
      },
      {
        q: "Comment modifier mon profil ?",
        a: "Rendez-vous sur votre page de profil (lien partagé après votre inscription) et cliquez sur l'icône « Modifier » à côté de votre nom. Vous pouvez mettre à jour votre biographie, vos tarifs et vos coordonnées à tout moment.",
      },
      {
        q: "Puis-je supprimer mon profil ?",
        a: "Oui, contactez l'administration via la page d'accueil et nous procéderons à la suppression de votre profil sous 48 heures.",
      },
    ],
  },
  {
    title: "À propos de la Plateforme",
    questions: [
      {
        q: "Qu'est-ce que Teranga Services ?",
        a: "Teranga Services est la marketplace de confiance qui connecte les familles sénégalaises aux artisans et professionnels qualifiés de leur quartier. Notre mission est de valoriser le savoir-faire local et de simplifier l'accès aux services à domicile.",
      },
      {
        q: "Dans quelles villes la plateforme est-elle disponible ?",
        a: "Nous couvrons actuellement Dakar, Thiès, Rufisque, Touba, Saint-Louis et plusieurs autres villes du Sénégal. La couverture s'élargit chaque semaine grâce à de nouveaux artisans qui rejoignent la plateforme.",
      },
      {
        q: "Quels services sont proposés ?",
        a: "Plus de 30 catégories : plomberie, électricité, menuiserie, couture, mécanique, coiffure, peinture, maçonnerie, jardinage, climatisation, informatique, développement web, cours particuliers, photographie, événementiel, traiteur, beauté, ménage, transport, déménagement, soudure, carrelage, vitrerie, électroménager, cordonnerie, décoration, traduction et bien plus.",
      },
      {
        q: "Puis-je installer l'application sur mon téléphone ?",
        a: "Oui ! Teranga Services est une application web installable. Sur Android, ouvrez le site dans Chrome, puis menu ⋮ → « Installer l'application ». Sur iPhone, ouvrez le site dans Safari, bouton Partager → « Sur l'écran d'accueil ».",
      },
    ],
  },
];

export default function Faq() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="text-center mb-12">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-4">
          <HelpCircle className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-4xl font-serif font-bold text-foreground mb-3">
          Questions Fréquentes
        </h1>
        <p className="text-lg text-muted-foreground">
          Tout ce que vous devez savoir sur Teranga Services.
        </p>
      </div>

      <div className="space-y-10">
        {FAQ_SECTIONS.map((section) => (
          <div key={section.title}>
            <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
              {section.title}
            </h2>
            <Accordion type="single" collapsible className="bg-card border rounded-xl shadow-sm">
              {section.questions.map((item, idx) => (
                <AccordionItem key={idx} value={`${section.title}-${idx}`} className="px-6 last:border-0">
                  <AccordionTrigger className="text-left hover:no-underline font-medium py-4">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>

      <div className="mt-16 bg-primary/5 border border-primary/10 rounded-2xl p-8 text-center">
        <h3 className="text-xl font-serif font-semibold mb-3">Vous ne trouvez pas votre réponse ?</h3>
        <p className="text-muted-foreground mb-6">
          Contactez-nous via WhatsApp ou par email, nous vous répondrons rapidement.
        </p>
        <Button asChild size="lg">
          <Link href="/how-it-works">Comment ça marche</Link>
        </Button>
      </div>
    </div>
  );
}
