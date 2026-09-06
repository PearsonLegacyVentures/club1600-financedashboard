# Club 1600 Treasury

A focused treasury and budget management application for Toastmasters Club 1600. It uses a July–June program year and keeps ordinary transactions, member dues payments, budget lines, and audit history as distinct source records.

## Local development

```sh
npm install
npm run dev
```

Set these variables in `.env.local` to enable Supabase Auth:

```sh
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Apply `supabase/migrations/202609060001_initial_treasury.sql`, then `supabase/seed.sql` to a Supabase project. The migration creates private receipt storage and role-based Row Level Security policies. Without environment variables, use the clearly labelled demonstration workspace; its sample records are kept in browser memory only.

## Production

```sh
npm run build
```

Cloudflare Pages output directory: `dist`. The SPA rewrite is provided in `public/_redirects`.
