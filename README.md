# Fushion

> **Every market. One place.**

Multi-vendor e-commerce marketplace for Nigeria and West Africa.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router, TypeScript, Tailwind CSS) |
| Backend | Fastify 5 (TypeScript, Prisma ORM, Zod) |
| Database | PostgreSQL 15 |
| Cache | Redis 7 |
| Search | Typesense |
| Payments | Paystack |
| Images | Cloudinary |
| Email | Resend |
| Hosting | Railway |
| CI/CD | GitHub Actions |

## Project Structure

```
FUSHION/
├── apps/
│   ├── web/          ← Next.js 14 frontend
│   └── api/          ← Fastify backend
├── packages/
│   └── shared/       ← Shared types, constants, validators
└── .github/
    └── workflows/    ← CI/CD pipelines
```

## Getting Started

### Prerequisites

- Node.js ≥ 20
- pnpm ≥ 9
- PostgreSQL 15
- Redis 7

### Setup

```bash
# Clone the repository
git clone <repo-url> && cd FUSHION

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env
# Edit .env with your credentials

# Generate Prisma client
pnpm db:generate

# Run database migrations
pnpm db:migrate

# Seed the database
pnpm db:seed

# Start development servers
pnpm dev
```

This starts:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- API Docs: http://localhost:3001/docs

### Development Accounts (Seed Data)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@fushion.dev | Admin@Fushion2026 |
| Vendor | vendor@fushion.dev | Vendor@Test2026 |
| Buyer | buyer@fushion.dev | Buyer@Test2026 |

> ⚠️ These are development credentials only. Never use in production.

## Brand Colours

| Token | Hex | Usage |
|-------|-----|-------|
| Ember | `#E8642A` | CTAs, prices, active states, primary |
| Coal | `#1A0E08` | Dark backgrounds, headings |
| Market Green | `#2C5F4A` | Vendor labels, success, trust |
| Gold Dust | `#C4A35A` | Ratings, premium badges |
| Paper | `#F9F7F3` | Page background (never white) |

## Scripts

```bash
pnpm dev          # Start all dev servers
pnpm build        # Build all packages
pnpm lint         # Lint all packages
pnpm typecheck    # TypeScript check
pnpm test         # Run all tests
pnpm db:generate  # Generate Prisma client
pnpm db:migrate   # Run database migrations
pnpm db:seed      # Seed database
pnpm db:studio    # Open Prisma Studio
```

## License

Proprietary — © 2026 Fushion. All rights reserved.
