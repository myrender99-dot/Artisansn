import { pgTable, text, serial, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { artisansTable } from "./artisans";

export const bookingStatusEnum = pgEnum("booking_status", ["pending", "confirmed", "completed", "cancelled"]);

export const bookingsTable = pgTable("bookings", {
  id: serial("id").primaryKey(),
  artisanId: integer("artisan_id").notNull().references(() => artisansTable.id),
  clientName: text("client_name").notNull(),
  clientPhone: text("client_phone").notNull(),
  serviceDescription: text("service_description").notNull(),
  scheduledDate: timestamp("scheduled_date"),
  status: bookingStatusEnum("status").notNull().default("pending"),
  city: text("city"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBookingSchema = createInsertSchema(bookingsTable).omit({ id: true, createdAt: true });
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookingsTable.$inferSelect;
