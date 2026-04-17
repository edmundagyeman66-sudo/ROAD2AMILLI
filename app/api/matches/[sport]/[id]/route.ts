import { NextResponse } from 'next/server';
import {
  getUpcomingMatches,
  getBasketballUpcomingMatches,
} from '../../../../../lib/data';
import {
  getPredictionForMatch,
  getPremiumPredictionForMatch
} from '../../../../../lib/predict';

export async function GET(
  request: Request,
  { params }: { params: { sport: string; id: string } }
) {
  const { sport, id } = params;

  try {
    let matches;
    let matchData;

    if (sport === 'football') {
      matches = getUpcomingMatches();
      matchData = matches.find(m => m.matchId === id);
    } else if (sport === 'basketball') {
      matches = getBasketballUpcomingMatches();
      matchData = matches.find(m => m.matchId === id);
    } else {
      return NextResponse.json({ error: 'Invalid sport' }, { status: 400 });
    }

    if (!matchData) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    // Get predictions for this match
    let predictions;
    if (matchData.isPremium && matchData.premiumMarket) {
      predictions = [getPremiumPredictionForMatch(matchData.homeTeam, matchData.awayTeam, matchData.premiumMarket, sport)];
    } else {
      predictions = getPredictionForMatch(matchData.homeTeam, matchData.awayTeam, sport);
    }

    return NextResponse.json({
      ...matchData,
      predictions,
      sport
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}