import { Router } from "express";
import { db, reviewsTable, artisansTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";
import { ListReviewsQueryParams, CreateReviewBody } from "@workspace/api-zod";

const router = Router();

router.get("/reviews", async (req, res) => {
  const query = ListReviewsQueryParams.safeParse(req.query);
  if (!query.success) {
    return res.status(400).json({ error: "Invalid query params" });
  }
  const { artisanId } = query.data;

  const reviews = await db
    .select()
    .from(reviewsTable)
    .where(eq(reviewsTable.artisanId, artisanId))
    .orderBy(desc(reviewsTable.createdAt));

  res.json({ reviews, total: reviews.length });
});

router.post("/reviews", async (req, res) => {
  const body = CreateReviewBody.safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({ error: "Invalid body" });
  }

  const [review] = await db.insert(reviewsTable).values(body.data).returning();

  const stats = await db
    .select({
      avg: sql<number>`avg(rating)`,
      count: sql<number>`count(*)`,
    })
    .from(reviewsTable)
    .where(eq(reviewsTable.artisanId, body.data.artisanId));

  await db
    .update(artisansTable)
    .set({
      averageRating: Number(stats[0]?.avg ?? 0),
      reviewCount: Number(stats[0]?.count ?? 0),
    })
    .where(eq(artisansTable.id, body.data.artisanId));

  res.status(201).json(review);
});

export default router;
