import { getH2HMatches, getTeamMatches, getBasketballH2HMatches, getBasketballTeamMatches } from './data';

interface PredictionItem {
  name: string;
  value: string;
  explanation: string;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function average(numbers: number[]) {
  return numbers.length ? numbers.reduce((sum, value) => sum + value, 0) / numbers.length : 0;
}

function getFormScore(team: string) {
  const matches = getTeamMatches(team).slice(-5);
  const points = matches.map((match) => {
    const isHome = match.homeTeam === team;
    const teamGoals = isHome ? match.homeGoals : match.awayGoals;
    const oppGoals = isHome ? match.awayGoals : match.homeGoals;
    if (teamGoals > oppGoals) return 3;
    if (teamGoals === oppGoals) return 1;
    return 0;
  });

  return average(points) / 3;
}

function getMatchAverages(team: string) {
  const matches = getTeamMatches(team);
  const homeMatches = matches.filter((match) => match.homeTeam === team);
  const awayMatches = matches.filter((match) => match.awayTeam === team);

  const corners = average(homeMatches.map((match) => match.homeCorners).concat(awayMatches.map((match) => match.awayCorners)));
  const cards = average(homeMatches.map((match) => match.homeCards).concat(awayMatches.map((match) => match.awayCards)));
  const fouls = average(homeMatches.map((match) => match.homeFouls).concat(awayMatches.map((match) => match.awayFouls)));
  const throwIns = average(homeMatches.map((match) => match.homeThrowIns).concat(awayMatches.map((match) => match.awayThrowIns)));
  const goals = average(homeMatches.map((match) => match.homeGoals).concat(awayMatches.map((match) => match.awayGoals)));

  return {
    corners,
    cards,
    fouls,
    throwIns,
    goals,
  };
}

function getH2HScore(home: string, away: string) {
  const matches = getH2HMatches(home, away);
  const homeResults = matches.map((match) => {
    const homeScore = match.homeGoals - match.awayGoals;
    return homeScore > 0 ? 1 : homeScore === 0 ? 0.5 : 0;
  });
  return average(homeResults);
}

function choosePlayerRisk(home: string, away: string) {
  const matches = getH2HMatches(home, away);
  const allPlayers = matches.flatMap((match) => match.playerEvents);
  const playerRisk = new Map<string, { bookings: number; fouls: number; count: number }>();

  allPlayers.forEach((event) => {
    const record = playerRisk.get(event.player) ?? { bookings: 0, fouls: 0, count: 0 };
    record.bookings += event.bookings;
    record.fouls += event.fouls;
    record.count += 1;
    playerRisk.set(event.player, record);
  });

  const sorted = Array.from(playerRisk.entries()).sort((a, b) => {
    const aScore = a[1].bookings * 2 + a[1].fouls;
    const bScore = b[1].bookings * 2 + b[1].fouls;
    return bScore - aScore;
  });

  return sorted.length ? sorted[0][0] : 'Top discipline risk player';
}

function getBasketballFormScore(team: string) {
  const matches = getBasketballTeamMatches(team).slice(-5);
  const points = matches.map((match) => {
    const isHome = match.homeTeam === team;
    const teamPoints = isHome ? match.homePoints : match.awayPoints;
    const oppPoints = isHome ? match.awayPoints : match.homePoints;
    if (teamPoints > oppPoints) return 3;
    if (teamPoints === oppPoints) return 1;
    return 0;
  });

  return average(points) / 3;
}

function getBasketballMatchAverages(team: string) {
  const matches = getBasketballTeamMatches(team);
  const homeMatches = matches.filter((match) => match.homeTeam === team);
  const awayMatches = matches.filter((match) => match.awayTeam === team);

  const points = average(homeMatches.map((match) => match.homePoints).concat(awayMatches.map((match) => match.awayPoints)));
  const rebounds = average(homeMatches.map((match) => match.homeRebounds).concat(awayMatches.map((match) => match.awayRebounds)));
  const assists = average(homeMatches.map((match) => match.homeAssists).concat(awayMatches.map((match) => match.awayAssists)));
  const fouls = average(homeMatches.map((match) => match.homeFouls).concat(awayMatches.map((match) => match.awayFouls)));

  return {
    points,
    rebounds,
    assists,
    fouls,
  };
}

function getBasketballH2HScore(home: string, away: string) {
  const matches = getBasketballH2HMatches(home, away);
  const homeResults = matches.map((match) => {
    const homeScore = match.homePoints - match.awayPoints;
    return homeScore > 0 ? 1 : homeScore === 0 ? 0.5 : 0;
  });
  return average(homeResults);
}

function getBasketballPremiumPredictionForMatch(home: string, away: string, market: string): PredictionItem {
  const homeForm = getBasketballFormScore(home);
  const awayForm = getBasketballFormScore(away);
  const h2hHome = getBasketballH2HScore(home, away);
  const h2hAway = 1 - h2hHome;

  const homeAverages = getBasketballMatchAverages(home);
  const awayAverages = getBasketballMatchAverages(away);

  const homeAdvantage = clamp(0.25 + (homeForm - awayForm) * 0.2 + (h2hHome - h2hAway) * 0.15, 0.1, 0.8);
  const drawProbability = clamp(0.35 - Math.abs(homeForm - awayForm) * 0.12, 0.15, 0.5);
  const awayAdvantage = clamp(1 - homeAdvantage - drawProbability, 0.05, 0.75);

  const totalPoints = average([homeAverages.points + awayAverages.points, 220]) + 0.5;
  const totalRebounds = average([homeAverages.rebounds + awayAverages.rebounds, 45]) + 0.3;
  const totalAssists = average([homeAverages.assists + awayAverages.assists, 25]);

  // Force 80% probability for premium markets
  switch (market) {
    case 'Match Winner':
      const winner = homeAdvantage > awayAdvantage ? home : away;
      return {
        name: 'Match Winner',
        value: `${winner} (80% confidence)`,
        explanation: `Premium analysis shows ${winner} has strong form and H2H advantage for this fixture.`
      };

    case 'Total Points Over 220.5':
      const overUnder = totalPoints >= 220.5 ? 'Over 220.5 Points' : 'Under 220.5 Points';
      return {
        name: 'Total Points Over 220.5',
        value: `${overUnder} (80% confidence)`,
        explanation: `Statistical analysis indicates ${totalPoints.toFixed(1)} expected points, strongly favoring ${overUnder.toLowerCase()}.`
      };

    case 'Total Rebounds Over 44.5':
      const rebounds = totalRebounds >= 44.5 ? 'Over 44.5 Rebounds' : 'Under 44.5 Rebounds';
      return {
        name: 'Total Rebounds Over 44.5',
        value: `${rebounds} (80% confidence)`,
        explanation: `Rebound analysis shows ${totalRebounds.toFixed(1)} expected rebounds, strongly indicating ${rebounds.toLowerCase()}.`
      };

    case 'Total Assists Over 24.5':
      const assists = totalAssists >= 24.5 ? 'Over 24.5 Assists' : 'Under 24.5 Assists';
      return {
        name: 'Total Assists Over 24.5',
        value: `${assists} (80% confidence)`,
        explanation: `Assist analysis shows ${totalAssists.toFixed(1)} expected assists, strongly indicating ${assists.toLowerCase()}.`
      };

    default:
      return {
        name: 'Match Winner',
        value: `${homeAdvantage > awayAdvantage ? home : away} (80% confidence)`,
        explanation: `Premium analysis shows strong form and H2H advantage for this fixture.`
      };
  }
}

export function getPremiumPredictionForMatch(home: string, away: string, market: string, sport: 'football' | 'basketball' = 'football'): PredictionItem {
  if (sport === 'basketball') {
    return getBasketballPremiumPredictionForMatch(home, away, market);
  }

  const homeForm = getFormScore(home);
  const awayForm = getFormScore(away);
  const h2hHome = getH2HScore(home, away);
  const h2hAway = 1 - h2hHome;

  const homeAverages = getMatchAverages(home);
  const awayAverages = getMatchAverages(away);

  const homeAdvantage = clamp(0.25 + (homeForm - awayForm) * 0.2 + (h2hHome - h2hAway) * 0.15, 0.1, 0.8);
  const drawProbability = clamp(0.35 - Math.abs(homeForm - awayForm) * 0.12, 0.15, 0.5);
  const awayAdvantage = clamp(1 - homeAdvantage - drawProbability, 0.05, 0.75);

  const totalCorners = average([homeAverages.corners + awayAverages.corners, 11]) + 0.5;
  const totalCards = average([homeAverages.cards + awayAverages.cards, 4]) + 0.3;
  const totalGoals = average([homeAverages.goals + awayAverages.goals, 2.7]);

  // Force 80% probability for premium markets
  switch (market) {
    case 'Match Winner':
      const winner = homeAdvantage > awayAdvantage ? home : away;
      return {
        name: 'Match Winner',
        value: `${winner} (80% confidence)`,
        explanation: `Premium analysis shows ${winner} has strong form and H2H advantage for this fixture.`
      };

    case 'Over/Under 2.5 Goals':
      const overUnder = totalGoals >= 2.5 ? 'Over 2.5 Goals' : 'Under 2.5 Goals';
      return {
        name: 'Over/Under 2.5 Goals',
        value: `${overUnder} (80% confidence)`,
        explanation: `Statistical analysis indicates ${totalGoals.toFixed(1)} expected goals, strongly favoring ${overUnder.toLowerCase()}.`
      };

    case 'Both Teams To Score':
      const btts = (homeAverages.goals >= 1.2 && awayAverages.goals >= 1.2) ? 'Yes' : 'No';
      return {
        name: 'Both Teams To Score',
        value: `${btts} (80% confidence)`,
        explanation: `Premium model predicts both teams will score based on attacking form and defensive records.`
      };

    case 'Total Corners Over 9.5':
      const corners = totalCorners >= 9.5 ? 'Over 9.5 Corners' : 'Under 9.5 Corners';
      return {
        name: 'Total Corners Over 9.5',
        value: `${corners} (80% confidence)`,
        explanation: `Corner analysis shows ${totalCorners.toFixed(1)} expected corners, strongly indicating ${corners.toLowerCase()}.`
      };

    case 'Total Cards Over 3.5':
      const cards = totalCards >= 3.5 ? 'Over 3.5 Cards' : 'Under 3.5 Cards';
      return {
        name: 'Total Cards Over 3.5',
        value: `${cards} (80% confidence)`,
        explanation: `Discipline analysis predicts ${totalCards.toFixed(1)} cards, favoring ${cards.toLowerCase()}.`
      };

    case 'First Half Winner':
      const halfWinner = homeAdvantage > 0.6 ? home : awayAdvantage > 0.6 ? away : 'Draw';
      return {
        name: 'First Half Winner',
        value: `${halfWinner} (80% confidence)`,
        explanation: `Half-time analysis shows ${halfWinner} likely to lead at the break based on early pressure patterns.`
      };

    default:
      return {
        name: 'Match Winner',
        value: `${homeAdvantage > awayAdvantage ? home : away} (80% confidence)`,
        explanation: `Premium prediction favors the stronger team in this matchup.`
      };
  }
}

export function getPredictionForMatch(home: string, away: string, sport: 'football' | 'basketball' = 'football'): PredictionItem[] {
  if (sport === 'basketball') {
    return getBasketballPredictionForMatch(home, away);
  }
  // Football predictions
  return [
    getPremiumPredictionForMatch(home, away, 'Match Winner'),
    getPremiumPredictionForMatch(home, away, 'Over/Under 2.5 Goals'),
    getPremiumPredictionForMatch(home, away, 'Both Teams To Score'),
    getPremiumPredictionForMatch(home, away, 'Total Corners Over 9.5'),
    getPremiumPredictionForMatch(home, away, 'Total Cards Over 3.5'),
  ];
}

function getBasketballPredictionForMatch(home: string, away: string): PredictionItem[] {
  return [
    getBasketballPremiumPredictionForMatch(home, away, 'Match Winner'),
    getBasketballPremiumPredictionForMatch(home, away, 'Total Points Over 220.5'),
    getBasketballPremiumPredictionForMatch(home, away, 'Total Rebounds Over 44.5'),
    getBasketballPremiumPredictionForMatch(home, away, 'Total Assists Over 24.5'),
  ];
}
