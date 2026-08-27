# Tripbook

Minimal itinerary app: create a private trip in a small admin panel, share the
public read-only page at `/t/<slug>`.

- **Frontend**: Next.js (App Router) + MUI, mobile-first
- **Data**: Postgres via Prisma (driver adapter `@prisma/adapter-pg`)
- **Admin**: single password, stored as a bcrypt hash (`ADMIN_PASSWORD_HASH` env var, no user accounts)

## Local development

1. Start a local Postgres (or point `DATABASE_URL` at any Postgres instance):

   ```bash
   docker run -d --name tripbook-db \
     -e POSTGRES_USER=tripbook -e POSTGRES_PASSWORD=tripbook -e POSTGRES_DB=tripbook \
     -p 55432:5432 postgres:16-alpine
   ```

2. Copy `.env.example` to `.env`, fill in `DATABASE_URL`, and generate a password hash:

   ```bash
   node scripts/hash-password.mjs "your password"
   ```

   Paste the printed `ADMIN_PASSWORD_HASH=...` line as-is into `.env` — it
   already escapes the `$` characters in the hash, which Next.js would
   otherwise try to expand as variable references and silently corrupt.

3. Install deps and run migrations:

   ```bash
   npm install
   npx prisma migrate dev
   ```

4. `npm run dev`, then visit `/admin` and log in with the password you hashed.

## Deploying to Vercel with a free database

1. **Database**: create a free Postgres database — either
   [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) (powered by Neon)
   from the Vercel dashboard, or a free [Neon](https://neon.tech) project directly.
   Copy the connection string.
2. In the Vercel project settings, add environment variables:
   - `DATABASE_URL` — the Postgres connection string
   - `ADMIN_PASSWORD_HASH` — output of `node scripts/hash-password.mjs "your password"`
3. Run `npx prisma migrate deploy` against that `DATABASE_URL` once (locally, with
   the env var set) to create the schema on the hosted database.
4. Deploy. The public trip pages live at `/t/<slug>`; the admin panel at `/admin`.

## Data model

- `Trip` — title, dates, unique public `slug`
- `Flight` — belongs to a trip
- `Activity` — belongs to a trip, optionally nested one level under another
  `Activity` (e.g. a park containing things to do, a street containing shops),
  with a `travelMode` + `travelMinsFromPrev` to render the "time to get here"
  segment before it.
