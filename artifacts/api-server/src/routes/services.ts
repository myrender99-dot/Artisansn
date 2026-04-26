import { Router } from "express";
import { db, artisansTable } from "@workspace/db";
import { sql } from "drizzle-orm";

const router = Router();

const CATEGORIES = [
  { id: 1, name: "Plomberie", icon: "droplets", description: "Réparation et installation de plomberie" },
  { id: 2, name: "Électricité", icon: "zap", description: "Travaux électriques et dépannage" },
  { id: 3, name: "Menuiserie", icon: "hammer", description: "Fabrication et réparation de meubles" },
  { id: 4, name: "Couture", icon: "scissors", description: "Tenues personnalisées et retouches" },
  { id: 5, name: "Mécanique", icon: "wrench", description: "Réparation et entretien de véhicules" },
  { id: 6, name: "Coiffure", icon: "sparkles", description: "Coiffure et soins capillaires" },
  { id: 7, name: "Peinture", icon: "paintbrush", description: "Peinture intérieure et extérieure" },
  { id: 8, name: "Maçonnerie", icon: "building", description: "Construction et rénovation" },
  { id: 9, name: "Jardinage", icon: "leaf", description: "Entretien des jardins et espaces verts" },
  { id: 10, name: "Climatisation", icon: "wind", description: "Installation et entretien de climatiseurs" },
  { id: 11, name: "Informatique", icon: "laptop", description: "Réparation PC, smartphones et installation logiciels" },
  { id: 12, name: "Développement Web & Mobile", icon: "code", description: "Création de sites web et applications" },
  { id: 13, name: "Cours Particuliers", icon: "book", description: "Soutien scolaire et tutorat à domicile" },
  { id: 14, name: "Formation Professionnelle", icon: "graduation", description: "Langues, bureautique et formations métier" },
  { id: 15, name: "Photographie & Vidéo", icon: "camera", description: "Photos d'événements, mariages et reportages" },
  { id: 16, name: "Événementiel", icon: "party", description: "Organisation de mariages, baptêmes et cérémonies" },
  { id: 17, name: "Traiteur & Cuisine", icon: "chef", description: "Repas pour événements et restauration" },
  { id: 18, name: "Pâtisserie", icon: "cake", description: "Gâteaux, desserts et pâtisseries sur commande" },
  { id: 19, name: "Beauté & Esthétique", icon: "heart", description: "Manucure, maquillage et soins du visage" },
  { id: 20, name: "Ménage & Nettoyage", icon: "spray", description: "Nettoyage maison, bureau et après-fête" },
  { id: 21, name: "Aide à Domicile", icon: "hand-heart", description: "Garde d'enfants, accompagnement personnes âgées" },
  { id: 22, name: "Transport & Livraison", icon: "truck", description: "Livraison de colis et courses" },
  { id: 23, name: "Déménagement", icon: "package", description: "Déménagement de maison ou bureau" },
  { id: 24, name: "Soudure & Métallerie", icon: "flame", description: "Portails, grilles et structures métalliques" },
  { id: 25, name: "Carrelage", icon: "grid", description: "Pose de carreaux sols et murs" },
  { id: 26, name: "Vitrerie & Miroiterie", icon: "square", description: "Pose de vitres, miroirs et baies vitrées" },
  { id: 27, name: "Réparation Électroménager", icon: "refrigerator", description: "Frigos, machines à laver, fours" },
  { id: 28, name: "Cordonnerie", icon: "footprints", description: "Réparation de chaussures et maroquinerie" },
  { id: 29, name: "Décoration d'Intérieur", icon: "sofa", description: "Aménagement et décoration de votre espace" },
  { id: 30, name: "Traduction & Rédaction", icon: "languages", description: "Traduction de documents et rédaction professionnelle" },
];

router.get("/services", async (req, res) => {
  const counts = await db
    .select({
      category: artisansTable.category,
      count: sql<number>`count(*)`,
    })
    .from(artisansTable)
    .groupBy(artisansTable.category);

  const countMap = Object.fromEntries(counts.map((c) => [c.category, Number(c.count)]));

  const services = CATEGORIES.map((cat) => ({
    ...cat,
    artisanCount: countMap[cat.name] ?? 0,
  }));

  res.json({ services });
});

export default router;
