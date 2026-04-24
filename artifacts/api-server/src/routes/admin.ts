import { Router, type Request, type Response, type NextFunction } from "express";
import { db, artisansTable, bookingsTable, reviewsTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";

const router = Router();

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const password = req.header("x-admin-password");
  const expected = process.env["ADMIN_PASSWORD"];
  if (!expected || password !== expected) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

router.post("/admin/login", (req, res) => {
  const { email, password } = req.body ?? {};
  const expectedEmail = process.env["ADMIN_EMAIL"];
  const expectedPassword = process.env["ADMIN_PASSWORD"];
  if (!expectedPassword) {
    return res.status(500).json({ error: "Admin not configured" });
  }
  if (email !== expectedEmail || password !== expectedPassword) {
    return res.status(401).json({ error: "Identifiants invalides" });
  }
  res.json({ token: expectedPassword, email: expectedEmail });
});

router.get("/admin/overview", requireAdmin, async (_req, res) => {
  const [artisanCount, bookingCount, reviewCount, pendingArtisans, pendingBookings] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(artisansTable),
    db.select({ count: sql<number>`count(*)` }).from(bookingsTable),
    db.select({ count: sql<number>`count(*)` }).from(reviewsTable),
    db.select({ count: sql<number>`count(*)` }).from(artisansTable).where(eq(artisansTable.isVerified, false)),
    db.select({ count: sql<number>`count(*)` }).from(bookingsTable).where(eq(bookingsTable.status, "pending")),
  ]);
  res.json({
    totalArtisans: Number(artisanCount[0]?.count ?? 0),
    totalBookings: Number(bookingCount[0]?.count ?? 0),
    totalReviews: Number(reviewCount[0]?.count ?? 0),
    pendingArtisans: Number(pendingArtisans[0]?.count ?? 0),
    pendingBookings: Number(pendingBookings[0]?.count ?? 0),
  });
});

router.get("/admin/artisans", requireAdmin, async (_req, res) => {
  const artisans = await db.select().from(artisansTable).orderBy(desc(artisansTable.createdAt));
  res.json({ artisans });
});

router.post("/admin/artisans/:id/verify", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const { isVerified } = req.body ?? {};
  const [artisan] = await db
    .update(artisansTable)
    .set({ isVerified: Boolean(isVerified) })
    .where(eq(artisansTable.id, id))
    .returning();
  if (!artisan) return res.status(404).json({ error: "Not found" });
  res.json(artisan);
});

router.delete("/admin/artisans/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(reviewsTable).where(eq(reviewsTable.artisanId, id));
  await db.delete(bookingsTable).where(eq(bookingsTable.artisanId, id));
  await db.delete(artisansTable).where(eq(artisansTable.id, id));
  res.json({ ok: true });
});

router.get("/admin/bookings", requireAdmin, async (_req, res) => {
  const bookings = await db.select().from(bookingsTable).orderBy(desc(bookingsTable.createdAt));
  res.json({ bookings });
});

router.post("/admin/bookings/:id/status", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body ?? {};
  if (!["pending", "confirmed", "completed", "cancelled"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }
  const [booking] = await db
    .update(bookingsTable)
    .set({ status })
    .where(eq(bookingsTable.id, id))
    .returning();
  if (!booking) return res.status(404).json({ error: "Not found" });
  res.json(booking);
});

router.delete("/admin/bookings/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(bookingsTable).where(eq(bookingsTable.id, id));
  res.json({ ok: true });
});

router.get("/admin/reviews", requireAdmin, async (_req, res) => {
  const reviews = await db.select().from(reviewsTable).orderBy(desc(reviewsTable.createdAt));
  res.json({ reviews });
});

router.delete("/admin/reviews/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const [review] = await db.select().from(reviewsTable).where(eq(reviewsTable.id, id));
  await db.delete(reviewsTable).where(eq(reviewsTable.id, id));
  if (review) {
    const stats = await db
      .select({ avg: sql<number>`coalesce(avg(rating), 0)`, count: sql<number>`count(*)` })
      .from(reviewsTable)
      .where(eq(reviewsTable.artisanId, review.artisanId));
    await db
      .update(artisansTable)
      .set({ averageRating: Number(stats[0]?.avg ?? 0), reviewCount: Number(stats[0]?.count ?? 0) })
      .where(eq(artisansTable.id, review.artisanId));
  }
  res.json({ ok: true });
});

export default router;
