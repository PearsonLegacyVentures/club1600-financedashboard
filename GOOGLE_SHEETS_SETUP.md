# Connect the Club 1600 Google Sheet

The app is built so the working Google Sheet remains the source of truth. The browser never receives the spreadsheet URL or the private API token.

## 1. Add the Apps Script to the working sheet

Open the Club 1600 treasury Google Sheet, then:

1. **Extensions → Apps Script**
2. Replace the default code with the contents of `google-apps-script/Code.gs`
3. Save
4. Run `configureTreasuryApiToken`
5. Enter a long private token (20+ characters)
6. Approve the Google permissions when prompted

The setup function keeps the existing workbook intact. It only:
- adds support columns to the existing **Transactions** sheet if they are missing
- creates a **Dues Payments** sheet for new multi-payment dues records

Existing data stays in place.

## 2. Deploy the script

In Apps Script:

1. **Deploy → New deployment**
2. Type: **Web app**
3. Execute as: **Me**
4. Who has access: **Anyone**
5. Deploy
6. Copy the `/exec` URL

The endpoint is still protected by the private token. The Cloudflare proxy supplies that token server-side.

## 3. Add two Cloudflare secrets

In the Cloudflare Pages project for this repo, add:

- `TREASURY_API_URL` = the Apps Script `/exec` URL
- `TREASURY_API_TOKEN` = the exact token entered in Apps Script

These are **server-side variables**. Do not name them `VITE_...`.

Redeploy the site.

## 4. Verify

When the site opens, the header should show **Live Google Sheet** instead of **Local fallback**.

Use **Refresh data** to force a new read.

Test one small transaction first. Confirm that it appears in the Google Sheet and then in the app after refresh.

## Data ownership

The webapp reads these existing source sheets:

- Budget 26-27
- Notes
- Transactions
- Membership Listing

The app calculates monthly, quarterly, dashboard, and annual views itself.

New dues payments are written to **Dues Payments** so partial/multiple payments never overwrite older payment history.
