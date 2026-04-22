import { pgTable, text, serial, integer, boolean, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const artisansTable = pgTable("artisans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  bio: text("bio"),
  category: text("category").notNull(),
  city: text("city").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  photoUrl: text("photo_url"),
  priceRange: text("price_range"),
  yearsExperience: integer("years_experience"),
  isVerified: boolean("is_verified").notNull().default(false),
  averageRating: real("average_rating").notNull().default(0),
  reviewCount: integer("review_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertArtisanSchema = createInsertSchema(artisansTable).omit({ id: true, createdAt: true, averageRating: true, reviewCount: true });
export type InsertArtisan = z.infer<typeof insertArtisanSchema>;
export type Artisan = typeof artisansTable.$inferSelect;
