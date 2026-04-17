# ROAD2AMILLI

AI-powered football prediction platform inspired by leading sports analytics sites. Get live match tracking, detailed market predictions, and comprehensive football insights.

## Features

- **Live Match Tracker**: Real-time scores, corners, cards, fouls, and match events
- **AI Predictions**: Advanced algorithms analyzing team form, H2H stats, and historical data
- **Market Coverage**: Corners, bookings, goals, fouls, throw-ins, half/full-time outcomes
- **User Authentication**: Secure login with Google and Apple accounts
- **Responsive Design**: Modern interface optimized for all devices

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: CSS with modern gradients and animations
- **Authentication**: NextAuth.js with Google/Apple providers
- **Data**: Sample football match data (ready for real API integration)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables in `.env.local`:
   ```
   NEXTAUTH_SECRET=your-secret-here
   NEXTAUTH_URL=http://localhost:3000
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   APPLE_ID=your-apple-id
   APPLE_SECRET=your-apple-secret
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Data Sources

The platform is designed to aggregate data from multiple football analytics sources:
- Flashscore
- FootMob
- SofaScore
- ESPN
- And other major sports platforms

## API Routes

- `GET /api/matches` - Live and upcoming match data
- `GET /api/predictions?home=TeamA&away=TeamB` - AI predictions for match
- `GET/POST /api/auth/[...nextauth]` - Authentication

## Deployment

### Vercel

1. Go to https://vercel.com and sign in with GitHub.
2. Import the repository `edmundagyeman66-sudo/ROAD2AMILLI`.
3. Use the following settings:
   - Framework preset: `Next.js`
   - Build command: `npm run build`
   - Output directory: leave blank
4. Add the required environment variables in Vercel:
   - `NEXTAUTH_URL=https://<your-deployment>.vercel.app`
   - `NEXTAUTH_SECRET=your-secret-here`
   - `GOOGLE_CLIENT_ID=your-google-client-id`
   - `GOOGLE_CLIENT_SECRET=your-google-client-secret`
   - `APPLE_ID=your-apple-id`
   - `APPLE_TEAM_ID=your-apple-team-id`
   - `APPLE_KEY_ID=your-apple-key-id`
   - `APPLE_PRIVATE_KEY=your-apple-private-key`

### dotenv example

Copy `.env.example` to `.env.local` for local development:

```bash
cp .env.example .env.local
```

Then update the values to match your provider credentials.

### GitHub Actions

A GitHub Actions workflow is included at `.github/workflows/deploy.yml` to validate the build on every push to `main`.

## License

This project is for educational and demonstration purposes.
