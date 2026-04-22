import { Router } from "express";
import { db, artisansTable, reviewsTable, bookingsTable } from "@workspace/db";
import { eq, like, ilike, and, desc, sql } from "drizzle-orm";
import {
  ListArtisansQueryParams,
  CreateArtisanBody,
  GetArtisanParams,
  UpdateArtisanParams,
  UpdateArtisanBody,
  GetTopRatedArtisansQueryParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/artisans", async (req, res) => {
  const query = ListArtisansQueryParams.safeParse(req.query);
  if (!query.success) {
    return res.status(400).json({ error: "Invalid query params" });
  }
  const { category, city, search, limit, offset } = query.data;

  const conditions = [];
  if (category) conditions.push(eq(artisansTable.category, category));
  if (city) conditions.push(ilike(artisansTable.city, `%${city}%`));
  if (search) conditions.push(ilike(artisansTable.name, `%${search}%`));

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [artisans, countResult] = await Promise.all([
    db.select().from(artisansTable).where(where).orderBy(desc(artisansTable.averageRating)).limit(limit).offset(offset),
    db.select({ count: sql<number>`count(*)` }).from(artisansTable).where(where),
  ]);

  res.json({ artisans, total: Number(countResult[0]?.count ?? 0) });
});

router.post("/artisans", async (req, res) => {
  const body = CreateArtisanBody.safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({ error: "Invalid body" });
  }
  const [artisan] = await db.insert(artisansTable).values(body.data).returning();
  res.status(201).json(artisan);
});

router.get("/artisans/top-rated", async (req, res) => {
  const query = GetTopRatedArtisansQueryParams.safeParse(req.query);
  const limit = query.success ? query.data.limit : 6;

  const artisans = await db.select().from(artisansTable).orderBy(desc(artisansTable.averageRating)).limit(limit);

  res.json({ artisans, total: artisans.length });
});

router.get("/artisans/:id", async (req, res) => {
  const params = GetArtisanParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    return res.status(400).json({ error: "Invalid params" });
  }
  const [artisan] = await db.select().from(artisansTable).where(eq(artisansTable.id, params.data.id));
  if (!artisan) return res.status(404).json({ error: "Artisan not found" });
  res.json(artisan);
});

router.put("/artisans/:id", async (req, res) => {
  const params = UpdateArtisanParams.safeParse({ id: Number(req.params.id) });
  const body = UpdateArtisanBody.safeParse(req.body);
  if (!params.success || !body.success) {
    return res.status(400).json({ error: "Invalid request" });
  }
  const [artisan] = await db
    .update(artisansTable)
    .set(body.data)
    .where(eq(artisansTable.id, params.data.id))
    .returning();
  if (!artisan) return res.status(404).json({ error: "Artisan not found" });
  res.json(artisan);
});

router.get("/stats/summary", async (req, res) => {
  const [artisanStats, bookingStats, cityCount] = await Promise.all([
    db.select({
      total: sql<number>`count(*)`,
      avgRating: sql<number>`avg(average_rating)`,
      categories: sql<number>`count(distinct category)`,
    }).from(artisansTable),
    db.select({
      total: sql<number>`count(*)`,
      completed: sql<number>`count(*) filter (where status = 'completed')`,
    }).from(bookingsTable),
    db.select({ count: sql<number>`count(distinct city)` }).from(artisansTable),
  ]);

  res.json({
    totalArtisans: Number(artisanStats[0]?.total ?? 0),
    totalBookings: Number(bookingStats[0]?.total ?? 0),
    totalCities: Number(cityCount[0]?.count ?? 0),
    totalCategories: Number(artisanStats[0]?.categories ?? 0),
    completedJobs: Number(bookingStats[0]?.completed ?? 0),
    averageRating: Number(artisanStats[0]?.avgRating ?? 0),
  });
});

export default router;
