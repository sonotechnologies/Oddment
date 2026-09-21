# Oddment

A fully working online store for **Oddment**, a fictional independent boutique
in Manchester's Northern Quarter. Built as a portfolio concept piece to show UK
boutique owners what an online shop for their own business could look like.

> Oddment is a fictional concept store designed and built by Sono Technologies.
> Nothing here is a real business, no card is ever charged, and no email is sent.

## What it does

- **Shop** — 34 products across Women, Men and Accessories, with filters for
  category, size and price, and sorting by new in or price.
- **Product pages** — image gallery, per-size stock, sold-out sizes shown but
  disabled, a low-stock label at three or fewer, size guide, staff notes.
- **Bag** — persists across refreshes, and shows the real delivery cost of every
  option *before* you reach checkout.
- **Checkout** — click & collect or one of three delivery speeds, a clearly
  labelled demo payment step, and a confirmed order written to Postgres with
  stock decremented atomically.
- **Admin** — password-gated dashboard listing real submitted orders, filtered
  by fulfilment type, with status transitions and per-size stock editing.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Prisma 7 · Postgres
(Neon in production) · deployed on Vercel.

## Running it locally

```bash
npm install
cp .env.example .env.local     # then fill in the values below
npm run db:migrate             # create the schema
npm run db:seed                # load the 34 products
npm run dev
```

The shop is at http://localhost:3000, the admin at `/admin`.

### Environment variables

| Variable | What it's for |
| --- | --- |
| `DATABASE_URL` | Postgres connection string. Neon in production. |
| `SHADOW_DATABASE_URL` | Only needed to *create* migrations locally, never to deploy. |
| `ADMIN_EMAIL` | The one account that can reach the dashboard. |
| `ADMIN_PASSWORD_HASH` | scrypt hash — generate with `npm run hash-password -- 'your-password'`. |
| `SESSION_SECRET` | Signs the admin session cookie. 32+ random characters. |
| `PEXELS_API_KEY` | Used *only* by the image script. Never read at runtime. |

> **Note on the hash format.** `ADMIN_PASSWORD_HASH` is colon-separated
> (`scrypt:salt:hash`) rather than the more usual `$`-separated form, because
> Next.js expands `$NAME` inside `.env` files and would silently eat half of it.

## Photography

Product and lifestyle shots come from [Pexels](https://www.pexels.com) and are
downloaded once by a local script, then committed. **The deployed site never
calls the Pexels API** — it only serves files from `/public`.

```bash
npm run fetch-images
```

This reads `PEXELS_API_KEY` from `.env.local`, searches for each product's
`imageQuery`, downloads two to three portrait shots per product into
`public/products/<slug>/` plus eight lifestyle shots into `public/lifestyle/`,
and records each photographer and source URL in
`src/data/images.generated.json` for the credits. It is safe to re-run: files
already on disk are never downloaded twice.

Commit `public/products/`, `public/lifestyle/` and
`src/data/images.generated.json` afterwards so Vercel has them to serve.

**Until the script has run, every image slot falls back to a labelled
placeholder** describing the shot that belongs there. The site is fully usable
in that state.

### Key handling

The Pexels key is used in exactly one file, `scripts/fetch-images.ts`, and only
ever comes from the environment. It is never imported by a page, component,
API route or client bundle, and never hardcoded. `.env.local` is gitignored.

## Deploying

1. Create a Postgres database on [Neon](https://neon.tech) and copy the
   connection string.
2. Import this repository into Vercel.
3. Set `DATABASE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` and
   `SESSION_SECRET` in the Vercel project's environment variables.
   `PEXELS_API_KEY` is **not** needed in production.
4. Run the migrations and seed against the Neon database once:
   ```bash
   DATABASE_URL='<neon-url>' npm run db:deploy
   DATABASE_URL='<neon-url>' npm run db:seed
   ```
5. Deploy. `prisma generate` runs automatically on install and build.

## Admin

The dashboard lives at `/admin` and is deliberately **not linked from anywhere
public**. Access is a single set of credentials held in the environment:

- The password is verified with scrypt and a timing-safe comparison.
- The session is a signed JWT in an httpOnly, same-site cookie, valid 8 hours.
- `src/proxy.ts` keeps signed-out visitors off admin routes, and every admin
  page and server action re-checks the session before touching data — the proxy
  is an optimisation, not the security boundary.

## Scripts

| Command | Does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and serve |
| `npm run lint` / `npm run typecheck` | ESLint / TypeScript |
| `npm run db:migrate` | Create and apply a migration (development) |
| `npm run db:deploy` | Apply existing migrations (production) |
| `npm run db:seed` | Load the 34-product catalogue |
| `npm run fetch-images` | Download photography from Pexels |
| `npm run hash-password -- 'pw'` | Generate an `ADMIN_PASSWORD_HASH` |

## Repository layout

```
prisma/          schema, migrations and the catalogue seed
scripts/         local-only tooling (image fetch, password hashing)
src/app/(store)/ the public shop
src/app/admin/   the gated dashboard
src/lib/         pricing, stock, sessions, shop constants
src/data/        the 34-product catalogue and the image manifest
design/          the original Claude Design prototype, kept for reference
```

## Deliberately out of scope

No live payment gateway, no shopper accounts, no real email, no returns flow,
discount codes or gift cards, and no Pexels calls at runtime.
