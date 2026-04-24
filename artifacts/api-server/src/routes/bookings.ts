import { Router } from "express";
import { db, bookingsTable, artisansTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { ListBookingsQueryParams, CreateBookingBody, UpdateBookingParams, UpdateBookingBody } from "@workspace/api-zod";

const router = Router();

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.length > 9 ? digits.slice(-9) : digits;
}

router.get("/bookings", async (req, res) => {
  const query = ListBookingsQueryParams.safeParse(req.query);
  if (!query.success) {
    return res.status(400).json({ error: "Invalid query params" });
  }
  const { artisanId, status } = query.data;

  const conditions = [];
  if (artisanId) conditions.push(eq(bookingsTable.artisanId, artisanId));
  if (status) conditions.push(eq(bookingsTable.status, status as "pending" | "confirmed" | "completed" | "cancelled"));

  const where = conditions.length > 0 ? and(...conditions) : undefined;
  const bookings = await db.select().from(bookingsTable).where(where);

  res.json({ bookings, total: bookings.length });
});

router.post("/bookings", async (req, res) => {
  const body = CreateBookingBody.safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({ error: "Invalid body" });
  }

  const [artisan] = await db
    .select()
    .from(artisansTable)
    .where(eq(artisansTable.id, body.data.artisanId));

  if (!artisan) {
    return res.status(404).json({ error: "Artisan introuvable" });
  }

  if (normalizePhone(artisan.phone) === normalizePhone(body.data.clientPhone)) {
    return res.status(400).json({
      error:
        "Vous ne pouvez pas réserver vos propres services. Le numéro de téléphone du client est identique à celui de l'artisan.",
    });
  }

  const [booking] = await db.insert(bookingsTable).values(body.data).returning();
  res.status(201).json(booking);
});

router.put("/bookings/:id", async (req, res) => {
  const params = UpdateBookingParams.safeParse({ id: Number(req.params.id) });
  const body = UpdateBookingBody.safeParse(req.body);
  if (!params.success || !body.success) {
    return res.status(400).json({ error: "Invalid request" });
  }
  const [booking] = await db
    .update(bookingsTable)
    .set({ status: body.data.status as "pending" | "confirmed" | "completed" | "cancelled" })
    .where(eq(bookingsTable.id, params.data.id))
    .returning();
  if (!booking) return res.status(404).json({ error: "Booking not found" });
  res.json(booking);
});

export default router;
