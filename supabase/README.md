# Supabase

This directory contains the local Supabase backend for Franco Booking: Postgres
migrations, Rhön Park seed data, and placeholder Edge Functions.

## Prerequisites

- Docker Desktop or another Docker runtime must be running.
- Install workspace dependencies from the repository root:

```bash
corepack pnpm install
```

## Local Database

Start Supabase:

```bash
corepack pnpm db:start
```

Reset and apply all migrations:

```bash
corepack pnpm db:reset
```

Verify the seed data:

```bash
corepack pnpm exec supabase db query "select count(*) from properties where slug = 'rhoenpark';"
corepack pnpm exec supabase db query "select count(*) from rooms;"
corepack pnpm exec supabase db query "select count(*) from rate_plans;"
corepack pnpm exec supabase db query "select count(*) from availability;"
```

Expected counts after reset: 1 Rhön Park property, 4 rooms, 4 rate plans, and
1460 availability rows.

## Edge Functions

Serve functions locally:

```bash
corepack pnpm functions:serve
```

Check a placeholder function:

```bash
curl http://localhost:54321/functions/v1/inquiry-submit
```

Expected response:

```json
{"ok":true,"function":"inquiry-submit"}
```

Deploy functions after linking a hosted Supabase project:

```bash
corepack pnpm functions:deploy
```
