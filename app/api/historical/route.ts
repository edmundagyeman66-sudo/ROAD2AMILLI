import { NextRequest, NextResponse } from 'next/server';
import { getHistoricalMatches, getHistoricalMatchesBySport, getHistoricalMatchesByDateRange, getPredictionAccuracyStats } from '../../../lib/data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sport = searchParams.get('sport') as 'football' | 'basketball' | null;
  const limit = parseInt(searchParams.get('limit') || '50');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const stats = searchParams.get('stats') === 'true';

  try {
    if (stats) {
      const accuracyStats = getPredictionAccuracyStats();
      return NextResponse.json({
        stats: accuracyStats,
        message: 'Prediction accuracy statistics retrieved successfully.'
      });
    }

    let matches;

    if (startDate && endDate) {
      matches = getHistoricalMatchesByDateRange(startDate, endDate);
    } else if (sport) {
      matches = getHistoricalMatchesBySport(sport, limit);
    } else {
      matches = getHistoricalMatches(limit);
    }

    return NextResponse.json({
      matches,
      total: matches.length,
      message: 'Historical matches retrieved successfully.'
    });

  } catch (error) {
    console.error('Error fetching historical matches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch historical matches' },
      { status: 500 }
    );
  }
}