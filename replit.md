# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## ArtisanSN — Marketplace de Services

Application principale: plateforme de mise en relation entre artisans sénégalais et clients.

### Features
- Homepage with hero, search, categories, top-rated artisans, platform stats
- Browse artisans with filter by category and city
- Artisan profile pages with reviews, booking form
- Register as artisan form
- Booking management with status tracking

### DB Schema
- `artisans` — artisan profiles (name, bio, category, city, phone, email, photoUrl, priceRange, yearsExperience, isVerified, averageRating, reviewCount)
- `reviews` — client reviews (artisanId, clientName, rating, comment)
- `bookings` — booking requests (artisanId, clientName, clientPhone, serviceDescription, scheduledDate, status, city)

### API Routes
- `GET /api/artisans` — list artisans with filters (category, city, search, limit, offset)
- `POST /api/artisans` — register new artisan
- `GET /api/artisans/top-rated` — top rated artisans
- `GET /api/artisans/:id` — artisan profile
- `PUT /api/artisans/:id` — update artisan
- `GET /api/services` — service categories with artisan counts
- `GET /api/reviews?artisanId=` — reviews for an artisan
- `POST /api/reviews` — create review (auto-updates artisan rating)
- `GET /api/bookings` — list bookings
- `POST /api/bookings` — create booking
- `PUT /api/bookings/:id` — update booking status
- `GET /api/stats/summary` — platform statistics
