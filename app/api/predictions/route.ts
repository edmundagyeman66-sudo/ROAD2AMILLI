import { NextRequest, NextResponse } from 'next/server';
import { getPredictionForMatch } from '../../../lib/predict';
import { teamList } from '../../../lib/data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const home = searchParams.get('home')?.trim() ?? '';
  const away = searchParams.get('away')?.trim() ?? '';
  const sport = (searchParams.get('sport')?.trim() ?? 'football') as 'football' | 'basketball';

  // If no teams provided, return sample predictions for the selected sport
  if (!home || !away) {
    const sampleTeams = sport === 'football' 
      ? ['FC Solaris', 'Red Rapids'] 
      : ['Lakers', 'Celtics'];
    
    const predictions = getPredictionForMatch(sampleTeams[0], sampleTeams[1], sport);
    return NextResponse.json({ 
      predictions, 
      message: `Sample ${sport} predictions loaded.` 
    });
  }

  if (home === away) {
    return NextResponse.json({
      predictions: [],
      message: 'Please select two different teams.',
    });
  }

  // For now, we'll use sample teams since we don't have basketball teams in teamList
  const sampleTeams = sport === 'football' 
    ? [home, away] 
    : ['Lakers', 'Celtics'];

  const predictions = getPredictionForMatch(sampleTeams[0], sampleTeams[1], sport);
  return NextResponse.json({ predictions, message: 'Prediction generated successfully.' });
}
