# CupVault — FIFA World Cup 2026 Ticket Marketplace

Professional Next.js ticket marketplace for FIFA World Cup 2026, inspired by [viagogo](https://www.viagogo.com/ww) UX and [FIFA hospitality packages](https://fifaworldcup26.hospitality.fifa.com/us/en/).

## Features

- **Live fixtures** — All 104 matches fetched from the official openfootball World Cup 2026 schedule (mirrors FIFA data), refreshed hourly
- **10 ticket tiers** — Category 1–3, VIP, Trophy Lounge, Pitchside Lounge, Champions Club, FIFA Pavilion, Private Suite, Platinum Access
- **Professional checkout** — Customer selects tier → enters details → receives admin-configured payment instructions
- **Admin dashboard** (`/admin`) — Manage payment methods, set prices per match or globally, force fixture sync

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home with countdown, hot tickets, hospitality showcase |
| `/world-cup` | All matches with filters (live data) |
| `/events/[slug]` | Match detail with all ticket/hospitality tiers |
| `/hospitality` | VIP & hospitality package overview |
| `/checkout/[slug]?tier=` | Checkout with admin payment config |
| `/admin` | Admin dashboard (password protected) |
| `/guarantee`, `/faq`, `/how-it-works` | Support pages |

## Setup

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

### Environment variables

```env
ADMIN_PASSWORD=your-secure-password
ADMIN_SECRET=random-secret-for-sessions
NEXT_PUBLIC_FIFA_TICKET_URL=https://your-partner-link  # optional
```

## Admin dashboard

1. Go to **http://localhost:3000/admin**
2. Login with `ADMIN_PASSWORD` (default: `admin123`)
3. **Payment tab** — Configure bank transfer, PayPal, crypto, card payment details shown at checkout
4. **Ticket Prices tab** — Set default prices for all tiers, or override per match
5. **Live Fixtures tab** — Force sync from openfootball World Cup 2026 JSON

## Live fixtures

Fixtures are fetched from:
`https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json`

This is the community-maintained mirror of the FIFA World Cup 2026 schedule. FIFA does not expose a public developer API — this source is updated from official schedule data. Reference: [FIFA World Cup 2026](https://www.fifa.com/fifaplus/en/tournaments/mens/worldcup/canadamexicousa2026).

## Production

```bash
npm run build
npm start
```

Change `ADMIN_PASSWORD` before deploying. Payment details in `data/store.json` are managed via the admin UI.
