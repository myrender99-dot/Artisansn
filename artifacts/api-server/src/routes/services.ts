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
