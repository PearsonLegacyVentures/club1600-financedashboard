# Club 1600 Treasury

A focused treasury dashboard for Toastmasters Club 1600.

The working **Google Sheet is the source of truth**. The app provides a cleaner, mobile-friendly view for budget oversight, dues, transactions, event performance, and Treasurer reports.

## Stack

- Vite + React + TypeScript
- Tailwind CSS
- Recharts
- Cloudflare Pages + Pages Functions
- Google Sheets + Google Apps Script

No Supabase project is required.

## Local development

```sh
npm install
npm run dev
```

Local Vite development uses the requested temporary credentials:

- Username: `amar`
- Password: `100in100`

Live financial data is not bundled into the public frontend. Without the Cloudflare/Google Sheets connection, the app uses only a local browser cache if one already exists.

## Google Sheets connection

Follow [GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md).

The flow is:

```
Club 1600 Google Sheet
        ↓
Google Apps Script
        ↓
Cloudflare Pages Function
        ↓
Treasury React App
```

The browser never receives the private Apps Script token.

## Cloudflare Pages

Build command:

```sh
npm run build
```

Output directory:

```
dist
```

Set these **server-side** Cloudflare variables/secrets:

- `TREASURY_USERNAME=amar`
- `TREASURY_PASSWORD=100in100`
- `TREASURY_SESSION_SECRET=<long random secret>`
- `TREASURY_API_URL=<Apps Script /exec URL>`
- `TREASURY_API_TOKEN=<same private token configured in Apps Script>`

Do not prefix them with `VITE_`.

The SPA rewrite is already provided in `public/_redirects`.

## Source sheets

The Apps Script reads:

- `Budget 26-27`
- `Notes`
- `Transactions`
- `Membership Listing`

It creates `Dues Payments` for new dues entries so members can make partial/multiple payments without overwriting history.

Monthly, quarterly, dashboard, and report totals are calculated by the app from source records rather than copied from summary cells.
