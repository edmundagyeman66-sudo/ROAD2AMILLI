export interface PlayerEventStats {
  player: string;
  bookings: number;
  fouls: number;
}

export interface MatchStats {
  homeTeam: string;
  awayTeam: string;
  date: string;
  score: string;
  homeGoals: number;
  awayGoals: number;
  homeCorners: number;
  awayCorners: number;
  homeCards: number;
  awayCards: number;
  homeFouls: number;
  awayFouls: number;
  homeThrowIns: number;
  awayThrowIns: number;
  homeHalfWins: number;
  awayHalfWins: number;
  playerEvents: PlayerEventStats[];
}

export interface LiveMatch {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  status: string;
  minute: number;
  homeScore: number;
  awayScore: number;
  corners: number;
  cards: number;
  fouls: number;
  throwIns: number;
  lastEvent: string;
  country?: string;
  league?: string;
}

export interface UpcomingMatch {
  matchId: string;
  date: string;
  homeTeam: string;
  awayTeam: string;
  tournament: string;
  league?: string;
  country: string;
  isPremium?: boolean;
  premiumMarket?: string;
  premiumProbability?: number;
  predictions?: any[];
}

export interface BasketballPlayerEventStats {
  player: string;
  points: number;
  rebounds: number;
  assists: number;
  fouls: number;
}

export interface BasketballMatchStats {
  homeTeam: string;
  awayTeam: string;
  date: string;
  score: string;
  homePoints: number;
  awayPoints: number;
  homeRebounds: number;
  awayRebounds: number;
  homeAssists: number;
  awayAssists: number;
  homeFouls: number;
  awayFouls: number;
  homeThreePointers: number;
  awayThreePointers: number;
  homeBlocks: number;
  awayBlocks: number;
  homeSteals: number;
  awaySteals: number;
  playerEvents: BasketballPlayerEventStats[];
}

export interface BasketballLiveMatch {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  status: string;
  quarter: number;
  timeLeft: string;
  homeScore: number;
  awayScore: number;
  homeFouls: number;
  awayFouls: number;
  lastEvent: string;
  country?: string;
  league?: string;
}

export interface BasketballUpcomingMatch {
  matchId: string;
  date: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  country: string;
  isPremium?: boolean;
  premiumMarket?: string;
  premiumProbability?: number;
}

export const teamList = [
  'FC Solaris', 'Red Rapids', 'Blue Titans', 'Green City',
  'Golden Eagles', 'Silver Wolves', 'Bronze Bears', 'Crystal Lions',
  'Diamond Sharks', 'Emerald Falcons', 'Ruby Tigers', 'Sapphire Hawks',
  'Platinum Panthers', 'Titanium Wolves', 'Cobalt Bears', 'Amber Lions',
  'Pearl Sharks', 'Jade Falcons', 'Coral Tigers', 'Azure Hawks',
  'Ivory Panthers', 'Obsidian Wolves', 'Crimson Bears', 'Violet Lions',
  'Indigo Sharks', 'Onyx Falcons', 'Scarlet Tigers', 'Navy Hawks',
  'Maroon Panthers', 'Teal Wolves', 'Olive Bears', 'Slate Lions'
];

export const sampleMatches: MatchStats[] = [
  {
    date: '2026-04-05',
    homeTeam: 'FC Solaris',
    awayTeam: 'Red Rapids',
    score: '2-1',
    homeGoals: 2,
    awayGoals: 1,
    homeCorners: 9,
    awayCorners: 4,
    homeCards: 2,
    awayCards: 3,
    homeFouls: 12,
    awayFouls: 18,
    homeThrowIns: 16,
    awayThrowIns: 11,
    homeHalfWins: 1,
    awayHalfWins: 0,
    playerEvents: [
      { player: 'Sami Amiri', bookings: 1, fouls: 3 },
      { player: 'Levi Cruz', bookings: 0, fouls: 2 },
    ],
  },
  // Adding many more matches programmatically
  ...Array.from({ length: 500 }, (_, i) => {
    const date = new Date('2026-01-01');
    date.setDate(date.getDate() + (i % 100)); // Spread across 100 days
    const dateStr = date.toISOString().split('T')[0];

    const homeIdx = Math.floor(Math.random() * teamList.length);
    let awayIdx = Math.floor(Math.random() * teamList.length);
    while (awayIdx === homeIdx) awayIdx = Math.floor(Math.random() * teamList.length);

    const homeGoals = Math.floor(Math.random() * 5);
    const awayGoals = Math.floor(Math.random() * 5);
    const totalCorners = Math.floor(Math.random() * 16) + 4;
    const homeCorners = Math.floor(totalCorners * (0.4 + Math.random() * 0.4));
    const awayCorners = totalCorners - homeCorners;

    const totalCards = Math.floor(Math.random() * 6);
    const homeCards = Math.floor(totalCards * Math.random());
    const awayCards = totalCards - homeCards;

    const totalFouls = Math.floor(Math.random() * 30) + 20;
    const homeFouls = Math.floor(totalFouls * (0.4 + Math.random() * 0.2));
    const awayFouls = totalFouls - homeFouls;

    const totalThrowIns = Math.floor(Math.random() * 20) + 20;
    const homeThrowIns = Math.floor(totalThrowIns * (0.4 + Math.random() * 0.2));
    const awayThrowIns = totalThrowIns - homeThrowIns;

    const homeHalfWins = homeGoals > awayGoals ? 1 : homeGoals === awayGoals ? (Math.random() > 0.5 ? 1 : 0) : 0;
    const awayHalfWins = awayGoals > homeGoals ? 1 : awayGoals === homeGoals ? (Math.random() > 0.5 ? 1 : 0) : 0;

    return {
      date: dateStr,
      homeTeam: teamList[homeIdx],
      awayTeam: teamList[awayIdx],
      score: `${homeGoals}-${awayGoals}`,
      homeGoals,
      awayGoals,
      homeCorners,
      awayCorners,
      homeCards,
      awayCards,
      homeFouls,
      awayFouls,
      homeThrowIns,
      awayThrowIns,
      homeHalfWins,
      awayHalfWins,
      playerEvents: []
    };
  })
];

export const liveMatches: LiveMatch[] = [
  {
    matchId: 'live-001',
    homeTeam: 'FC Solaris',
    awayTeam: 'Green City',
    status: 'Second half',
    minute: 68,
    homeScore: 2,
    awayScore: 1,
    corners: 10,
    cards: 3,
    fouls: 14,
    throwIns: 17,
    lastEvent: 'Yellow card for Green City center back',
    country: 'England',
    league: 'Premier League',
  },
  {
    matchId: 'live-002',
    homeTeam: 'Red Rapids',
    awayTeam: 'Blue Titans',
    status: 'Half time',
    minute: 45,
    homeScore: 1,
    awayScore: 0,
    corners: 5,
    cards: 2,
    fouls: 11,
    throwIns: 9,
    lastEvent: 'Red Rapids lead after a set-piece goal',
    country: 'Spain',
    league: 'La Liga',
  },
];

export const upcomingMatches: UpcomingMatch[] = [
  // Generate matches for each country with their respective leagues
  ...(() => {
    const matches: UpcomingMatch[] = [];
    let matchCounter = 1;

    // Define country-league mappings (simplified for data generation)
    const countryLeagueMap: Record<string, string[]> = {
      'England': ['Premier League', 'Championship', 'FA Cup'],
      'Spain': ['La Liga', 'Copa del Rey'],
      'Italy': ['Serie A', 'Coppa Italia'],
      'Germany': ['Bundesliga', 'DFB Pokal'],
      'France': ['Ligue 1', 'Coupe de France'],
      'Netherlands': ['Eredivisie', 'KNVB Cup'],
      'Portugal': ['Primeira Liga', 'Taça de Portugal'],
      'Turkey': ['Süper Lig', 'Türkiye Kupası'],
      'Greece': ['Super League Greece', 'Greek Cup'],
      'Belgium': ['Pro League', 'Belgian Cup'],
      'Scotland': ['Scottish Premiership', 'Scottish Cup'],
      'Russia': ['Russian Premier League', 'Russian Cup'],
      'Ukraine': ['Ukrainian Premier League', 'Ukrainian Cup'],
      'Poland': ['Ekstraklasa', 'Polish Cup'],
      'Czech Republic': ['Czech First League', 'Czech Cup'],
      'Austria': ['Austrian Bundesliga', 'Austrian Cup'],
      'Switzerland': ['Swiss Super League', 'Swiss Cup'],
      'Croatia': ['Prva HNL', 'Croatian Cup'],
      'Serbia': ['Serbian SuperLiga', 'Serbian Cup'],
      'Sweden': ['Allsvenskan', 'Svenska Cupen'],
      'Norway': ['Eliteserien', 'Norwegian Cup'],
      'Denmark': ['Danish Superliga', 'Danish Cup'],
      'Finland': ['Veikkausliiga', 'Finnish Cup'],
      'Iceland': ['Úrvalsdeild', 'Icelandic Cup'],
      'Ireland': ['League of Ireland Premier Division', 'FAI Cup'],
      'Wales': ['Cymru Premier', 'Welsh Cup'],
      'Northern Ireland': ['NIFL Premiership', 'Irish Cup'],
      'Slovakia': ['Slovak Super Liga', 'Slovak Cup'],
      'Slovenia': ['Slovenian PrvaLiga', 'Slovenian Cup'],
      'Hungary': ['Nemzeti Bajnokság I', 'Magyar Kupa'],
      'Romania': ['Liga I', 'Cupa României'],
      'Bulgaria': ['First Professional Football League', 'Bulgarian Cup'],
      'Bosnia and Herzegovina': ['Premier League of Bosnia and Herzegovina', 'Bosnian Cup'],
      'Montenegro': ['Montenegrin First League', 'Montenegrin Cup'],
      'Kosovo': ['Superliga e Kosovës', 'Kosovar Cup'],
      'Albania': ['Kategoria Superiore', 'Albanian Cup'],
      'North Macedonia': ['Macedonian First Football League', 'Macedonian Cup'],
      'Luxembourg': ['National Division', 'Luxembourg Cup'],
      'Malta': ['Maltese Premier League', 'Maltese FA Trophy'],
      'Cyprus': ['Cypriot First Division', 'Cypriot Cup'],
      'Estonia': ['Meistriliiga', 'Estonian Cup'],
      'Latvia': ['Virslīga', 'Latvian Football Cup'],
      'Lithuania': ['A Lyga', 'Lithuanian Football Cup'],
      'Belarus': ['Belarusian Premier League', 'Belarusian Cup'],
      'Moldova': ['Divizia Națională', 'Moldovan Cup'],
      'Georgia': ['Erovnuli Liga', 'Georgian Cup'],
      'Armenia': ['Armenian Premier League', 'Armenian Cup'],
      'Azerbaijan': ['Azerbaijan Premier League', 'Azerbaijan Cup'],
      'Kazakhstan': ['Kazakhstan Premier League', 'Kazakhstan Cup'],
      'Israel': ['Israeli Premier League', 'Israel State Cup'],
      'Saudi Arabia': ['Saudi Professional League', 'King Cup'],
      'UAE': ['UAE Pro League', 'UAE President\'s Cup'],
      'Qatar': ['Qatar Stars League', 'Qatar Cup'],
      'Iran': ['Persian Gulf Pro League', 'Hazfi Cup'],
      'Iraq': ['Iraq Stars League', 'Iraq FA Cup'],
      'Jordan': ['Jordanian Pro League', 'Jordan FA Cup'],
      'Lebanon': ['Lebanese Premier League', 'Lebanese FA Cup'],
      'Syria': ['Syrian Premier League', 'Syrian Cup'],
      'Oman': ['Oman Professional League', 'Sultan Qaboos Cup'],
      'Kuwait': ['Kuwait Premier League', 'Kuwait Emir Cup'],
      'Bahrain': ['Bahrain Premier League', 'Bahrain King\'s Cup'],
      'Egypt': ['Egyptian Premier League', 'Egypt Cup'],
      'Morocco': ['Botola', 'Moroccan Throne Cup'],
      'Tunisia': ['Tunisian Ligue Professionnelle 1', 'Tunisian Cup'],
      'Algeria': ['Algerian Ligue Professionnelle 1', 'Algerian Cup'],
      'Libya': ['Libyan Premier League', 'Libyan Cup'],
      'Sudan': ['Sudanese Premier League', 'Sudan Cup'],
      'Ethiopia': ['Ethiopian Premier League', 'Ethiopian Cup'],
      'Kenya': ['Kenyan Premier League', 'Kenya Cup'],
      'South Africa': ['South African Premier Division', 'Nedbank Cup'],
      'Nigeria': ['Nigeria Professional Football League', 'Nigerian Cup'],
      'Ghana': ['Ghana Premier League', 'Ghana FA Cup'],
      'Ivory Coast': ['Ligue 1 (Ivory Coast)', 'Coupe de Côte d\'Ivoire'],
      'Cameroon': ['Elite One', 'Cameroon Cup'],
      'Senegal': ['Ligue 1 (Senegal)', 'Coupe du Sénégal'],
      'Mali': ['Malian Première Division', 'Malian Cup'],
      'Burkina Faso': ['Burkinabé Premier League', 'Burkina Faso Cup'],
      'Guinea': ['Guinea Championnat National', 'Guinea Cup'],
      'Sierra Leone': ['Sierra Leone National Premier League', 'Sierra Leone FA Cup'],
      'Liberia': ['Liberian First Division', 'Liberian Cup'],
      'Togo': ['Togolese Championnat National', 'Togo Cup'],
      'Benin': ['Benin Premier League', 'Benin Cup'],
      'Niger': ['Niger Premier League', 'Niger Cup'],
      'Chad': ['Chad Premier League', 'Chad Cup'],
      'Central African Republic': ['Central African Republic League', 'Central African Republic Cup'],
      'Gabon': ['Gabon Championnat National D1', 'Gabon Cup'],
      'Equatorial Guinea': ['Equatoguinean Primera División', 'Equatorial Guinea Cup'],
      'Congo': ['Congo Premier League', 'Congo Cup'],
      'DR Congo': ['Linafoot', 'Coupe du Congo'],
      'Angola': ['Girabola', 'Angola Cup'],
      'Zimbabwe': ['Zimbabwe Premier Soccer League', 'Zimbabwe Cup'],
      'Zambia': ['Zambian Premier League', 'Zambia Cup'],
      'Malawi': ['Malawi Premier Division', 'Malawi Cup'],
      'Mozambique': ['Moçambola', 'Mozambique Cup'],
      'Tanzania': ['Tanzania Premier League', 'Tanzania Cup'],
      'Uganda': ['Uganda Premier League', 'Uganda Cup'],
      'Rwanda': ['Rwanda Premier League', 'Rwanda Cup'],
      'Burundi': ['Burundi Premier League', 'Burundi Cup'],
      'Somalia': ['Somali First Division', 'Somali Cup'],
      'Djibouti': ['Djibouti Premier League', 'Djibouti Cup'],
      'Eritrea': ['Eritrean Premier League', 'Eritrea Cup'],
      'Argentina': ['Primera División', 'Copa Argentina'],
      'Brazil': ['Brasileirão', 'Copa do Brasil'],
      'Uruguay': ['Primera División', 'Copa Uruguay'],
      'Paraguay': ['Primera División', 'Copa Paraguay'],
      'Chile': ['Primera División', 'Copa Chile'],
      'Colombia': ['Categoría Primera A', 'Copa Colombia'],
      'Ecuador': ['Serie A', 'Copa Ecuador'],
      'Peru': ['Primera División', 'Copa Perú'],
      'Venezuela': ['Primera División', 'Copa Venezuela'],
      'Bolivia': ['División Profesional', 'Copa Bolivia'],
      'Mexico': ['Liga MX', 'Copa MX'],
      'USA': ['MLS', 'US Open Cup'],
      'Canada': ['Canadian Premier League', 'Canadian Championship'],
      'Costa Rica': ['Primera División', 'Copa Costa Rica'],
      'Panama': ['Liga Panameña de Fútbol', 'Copa Panamá'],
      'Honduras': ['Liga Nacional', 'Copa Honduras'],
      'El Salvador': ['Primera División', 'Copa El Salvador'],
      'Nicaragua': ['Primera División', 'Copa Nicaragua'],
      'Guatemala': ['Liga Nacional', 'Copa Guatemala'],
      'Belize': ['Premier League', 'Belize Cup'],
      'Jamaica': ['Premier League', 'Jamaica FA Cup'],
      'Trinidad and Tobago': ['TT Pro League', 'Trinidad and Tobago Cup'],
      'Barbados': ['Premier Division', 'Barbados FA Cup'],
      'Guyana': ['GFF Elite League', 'Guyana Mayors Cup'],
      'Suriname': ['SVB Eerste Divisie', 'Suriname Cup'],
      'French Guiana': ['French Guiana Régional 1', 'Coupe de Guyane'],
      'Australia': ['A-League', 'Australia Cup'],
      'New Zealand': ['New Zealand Football Championship', 'Chatham Cup'],
      'Japan': ['J1 League', 'Emperor\'s Cup'],
      'South Korea': ['K League 1', 'FA Cup'],
      'China': ['Chinese Super League', 'CFA Cup'],
      'Thailand': ['Thai League 1', 'Thai FA Cup'],
      'Vietnam': ['V.League 1', 'Vietnamese Cup'],
      'Indonesia': ['Liga 1', 'Piala Indonesia'],
      'Malaysia': ['Super League', 'Malaysia FA Cup'],
      'Singapore': ['Singapore Premier League', 'Singapore Cup'],
      'Philippines': ['Philippines Football League', 'PFF National Cup'],
      'India': ['Indian Super League', 'Indian Federation Cup'],
      'Pakistan': ['Pakistan Premier League', 'Pakistan Cup'],
      'Bangladesh': ['Bangladesh Premier League', 'Federation Cup'],
      'Sri Lanka': ['Sri Lanka Premier League', 'Sri Lanka FA Cup'],
    };

    // Generate matches for each country
    Object.entries(countryLeagueMap).forEach(([country, leagues]) => {
      // Generate 2-4 matches per country
      const numMatches = Math.floor(Math.random() * 3) + 2;

      for (let i = 0; i < numMatches; i++) {
        const league = leagues[Math.floor(Math.random() * leagues.length)];
        const isPremium = Math.random() < 0.3; // 30% premium matches

        const homeIdx = Math.floor(Math.random() * teamList.length);
        let awayIdx = Math.floor(Math.random() * teamList.length);
        while (awayIdx === homeIdx) awayIdx = Math.floor(Math.random() * teamList.length);

        const hour = 9 + Math.floor(Math.random() * 14); // 9 AM to 11 PM
        const minute = Math.floor(Math.random() * 4) * 15; // 00, 15, 30, 45
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

        let premiumMarket: string | undefined;
        let premiumProbability: number | undefined;

        if (isPremium) {
          const markets = [
            'Match Winner', 'Over/Under 2.5 Goals', 'Both Teams To Score',
            'Total Corners Over 9.5', 'Total Cards Over 3.5', 'First Half Winner'
          ];
          premiumMarket = markets[Math.floor(Math.random() * markets.length)];
          premiumProbability = 80; // Fixed at 80% for premium matches
        }

        matches.push({
          matchId: `match-${matchCounter.toString().padStart(4, '0')}`,
          date: `2026-04-16 ${timeStr}`,
          homeTeam: teamList[homeIdx],
          awayTeam: teamList[awayIdx],
          tournament: league,
          country,
          isPremium,
          premiumMarket,
          premiumProbability
        });

        matchCounter++;
      }
    });

    // Ensure we have at least 35 matches total by adding more random ones
    while (matches.length < 35) {
      const countries = Object.keys(countryLeagueMap);
      const randomCountry = countries[Math.floor(Math.random() * countries.length)];
      const leagues = countryLeagueMap[randomCountry];
      const league = leagues[Math.floor(Math.random() * leagues.length)];
      const isPremium = Math.random() < 0.3;

      const homeIdx = Math.floor(Math.random() * teamList.length);
      let awayIdx = Math.floor(Math.random() * teamList.length);
      while (awayIdx === homeIdx) awayIdx = Math.floor(Math.random() * teamList.length);

      const hour = 9 + Math.floor(Math.random() * 14);
      const minute = Math.floor(Math.random() * 4) * 15;
      const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

      let premiumMarket: string | undefined;
      let premiumProbability: number | undefined;

      if (isPremium) {
        const markets = [
          'Match Winner', 'Over/Under 2.5 Goals', 'Both Teams To Score',
          'Total Corners Over 9.5', 'Total Cards Over 3.5', 'First Half Winner'
        ];
        premiumMarket = markets[Math.floor(Math.random() * markets.length)];
        premiumProbability = 80;
      }

      matches.push({
        matchId: `match-${matchCounter.toString().padStart(4, '0')}`,
        date: `2026-04-16 ${timeStr}`,
        homeTeam: teamList[homeIdx],
        awayTeam: teamList[awayIdx],
        tournament: league,
        league,
        country: randomCountry,
        isPremium,
        premiumMarket,
        premiumProbability
      });

      matchCounter++;
    }

    return matches;
  })()
];

export function getTeamMatches(team: string) {
  return sampleMatches.filter((match) => match.homeTeam === team || match.awayTeam === team);
}

export function getH2HMatches(home: string, away: string) {
  return sampleMatches.filter(
    (match) =>
      (match.homeTeam === home && match.awayTeam === away) ||
      (match.homeTeam === away && match.awayTeam === home)
  );
}

export function getLiveMatches() {
  return liveMatches;
}

export const basketballTeamList = [
  'Lakers', 'Warriors', 'Celtics', 'Bulls', 'Heat', 'Spurs', 'Nets', 'Knicks',
  '76ers', 'Raptors', 'Bucks', 'Suns', 'Clippers', 'Mavericks', 'Jazz', 'Thunder',
  'Pelicans', 'Grizzlies', 'Kings', 'Hawks', 'Hornets', 'Wizards', 'Pistons', 'Magic',
  'Pacers', 'Cavaliers', 'Rockets', 'Nuggets', 'Timberwolves', 'Trail Blazers', 'Blazers', 'Kings'
];

export const basketballSampleMatches: BasketballMatchStats[] = [
  {
    date: '2026-04-05',
    homeTeam: 'Lakers',
    awayTeam: 'Warriors',
    score: '115-112',
    homePoints: 115,
    awayPoints: 112,
    homeRebounds: 45,
    awayRebounds: 42,
    homeAssists: 28,
    awayAssists: 25,
    homeFouls: 18,
    awayFouls: 22,
    homeThreePointers: 12,
    awayThreePointers: 15,
    homeBlocks: 5,
    awayBlocks: 3,
    homeSteals: 8,
    awaySteals: 6,
    playerEvents: [
      { player: 'LeBron James', points: 28, rebounds: 10, assists: 8, fouls: 2 },
      { player: 'Stephen Curry', points: 32, rebounds: 5, assists: 12, fouls: 1 },
    ],
  },
  // Adding many more basketball matches programmatically
  ...Array.from({ length: 400 }, (_, i) => {
    const date = new Date('2026-01-01');
    date.setDate(date.getDate() + (i % 80)); // Spread across 80 days
    const dateStr = date.toISOString().split('T')[0];

    const homeIdx = Math.floor(Math.random() * basketballTeamList.length);
    let awayIdx = Math.floor(Math.random() * basketballTeamList.length);
    while (awayIdx === homeIdx) awayIdx = Math.floor(Math.random() * basketballTeamList.length);

    const homePoints = Math.floor(Math.random() * 40) + 90; // 90-130 points
    const awayPoints = Math.floor(Math.random() * 40) + 85; // 85-125 points

    const totalRebounds = Math.floor(Math.random() * 20) + 70; // 70-90 total rebounds
    const homeRebounds = Math.floor(totalRebounds * (0.45 + Math.random() * 0.1));
    const awayRebounds = totalRebounds - homeRebounds;

    const totalAssists = Math.floor(Math.random() * 20) + 40; // 40-60 total assists
    const homeAssists = Math.floor(totalAssists * (0.45 + Math.random() * 0.1));
    const awayAssists = totalAssists - homeAssists;

    const totalFouls = Math.floor(Math.random() * 10) + 30; // 30-40 total fouls
    const homeFouls = Math.floor(totalFouls * (0.45 + Math.random() * 0.1));
    const awayFouls = totalFouls - homeFouls;

    const totalThreePointers = Math.floor(Math.random() * 15) + 20; // 20-35 total threes
    const homeThreePointers = Math.floor(totalThreePointers * (0.45 + Math.random() * 0.1));
    const awayThreePointers = totalThreePointers - homeThreePointers;

    const totalBlocks = Math.floor(Math.random() * 8) + 6; // 6-14 total blocks
    const homeBlocks = Math.floor(totalBlocks * (0.45 + Math.random() * 0.1));
    const awayBlocks = totalBlocks - homeBlocks;

    const totalSteals = Math.floor(Math.random() * 8) + 8; // 8-16 total steals
    const homeSteals = Math.floor(totalSteals * (0.45 + Math.random() * 0.1));
    const awaySteals = totalSteals - homeSteals;

    return {
      date: dateStr,
      homeTeam: basketballTeamList[homeIdx],
      awayTeam: basketballTeamList[awayIdx],
      score: `${homePoints}-${awayPoints}`,
      homePoints,
      awayPoints,
      homeRebounds,
      awayRebounds,
      homeAssists,
      awayAssists,
      homeFouls,
      awayFouls,
      homeThreePointers,
      awayThreePointers,
      homeBlocks,
      awayBlocks,
      homeSteals,
      awaySteals,
      playerEvents: []
    };
  })
];

export const basketballLiveMatches: BasketballLiveMatch[] = [
  {
    matchId: 'bb-live-001',
    homeTeam: 'Lakers',
    awayTeam: 'Warriors',
    status: 'Live',
    quarter: 3,
    timeLeft: '8:32',
    homeScore: 87,
    awayScore: 82,
    homeFouls: 4,
    awayFouls: 6,
    lastEvent: 'Stephen Curry hits a three-pointer',
  },
  {
    matchId: 'bb-live-002',
    homeTeam: 'Celtics',
    awayTeam: 'Bulls',
    status: 'Live',
    quarter: 2,
    timeLeft: '4:15',
    homeScore: 54,
    awayScore: 48,
    homeFouls: 3,
    awayFouls: 5,
    lastEvent: 'Jayson Tatum with a powerful dunk',
  },
];

export const basketballUpcomingMatches: BasketballUpcomingMatch[] = [
  // Generate basketball matches for each country with their respective leagues
  ...(() => {
    const matches: BasketballUpcomingMatch[] = [];
    let matchCounter = 1;

    // Define basketball country-league mappings
    const countryLeagueMap: Record<string, string[]> = {
      'USA': ['NBA', 'NBA G League', 'WNBA'],
      'Spain': ['ACB League', 'LEB Oro', 'LEB Plata'],
      'Greece': ['Greek Basket League', 'Greek A2 Basket League'],
      'Turkey': ['Basketbol Süper Ligi', 'TBL', 'Türkiye Kupası'],
      'France': ['LNB Pro A', 'LNB Pro B', 'Coupe de France'],
      'Germany': ['Basketball Bundesliga', 'ProA', 'ProB'],
      'Italy': ['Lega Basket Serie A', 'Serie A2', 'Coppa Italia'],
      'Russia': ['VTB United League', 'Super League 1', 'Russian Cup'],
      'Lithuania': ['LKL', 'NKL', 'Lithuanian Basketball Cup'],
      'Poland': ['PLK', 'I Liga', 'Polish Cup'],
      'Serbia': ['KLS', 'Druga Liga', 'Radivoj Korać Cup'],
      'Croatia': ['HT Premijer liga', 'Prva muška liga', 'Croatian Cup'],
      'Slovenia': ['Slovenian Basketball League', '2. SKL', 'Slovenian Cup'],
      'Israel': ['Israeli Basketball Premier League', 'Liga Leumit', 'State Cup'],
      'Lebanon': ['Lebanese Basketball League', 'Division 1', 'Lebanese Cup'],
      'Jordan': ['Jordanian Basketball League', 'Division 1', 'Jordan Cup'],
      'UAE': ['UAE National Basketball League', 'Division 1', 'UAE Cup'],
      'Qatar': ['Qatari Basketball League', 'Division 1', 'Qatar Cup'],
      'Saudi Arabia': ['Saudi Premier League', 'Division 1', 'Saudi Cup'],
      'China': ['CBA', 'NBL', 'Chinese Basketball Cup'],
      'Japan': ['B.League', 'B2 League', 'Emperor\'s Cup'],
      'South Korea': ['KBL', 'KCC', 'Korean Basketball Cup'],
      'Philippines': ['PBA', 'MPBL', 'Filbasket'],
      'Australia': ['NBL', 'NBL1', 'NBL Cup'],
      'Argentina': ['Liga Nacional de Básquet', 'Torneo Federal', 'Copa Argentina'],
      'Brazil': ['NBB', 'Liga Ouro', 'Copa Brasil'],
      'Mexico': ['LNBP', 'CIBACOPA', 'Copa Mexico'],
      'Canada': ['CBL', 'U Sports', 'Canadian Cup'],
      'Venezuela': ['LPB', 'Division 1', 'Copa Venezuela'],
      'Colombia': ['LPB', 'Division 1', 'Copa Colombia'],
      'Puerto Rico': ['BSN', 'Superior', 'Copa de Puerto Rico'],
      'Dominican Republic': ['LIDOBA', 'Division 1', 'Copa Dominicana'],
      'Cuba': ['LNB', 'Division 1', 'Copa Cuba'],
      'Panama': ['LPB', 'Division 1', 'Copa Panama'],
    };

    // Generate matches for each country
    Object.entries(countryLeagueMap).forEach(([country, leagues]) => {
      // Generate 1-3 matches per country
      const numMatches = Math.floor(Math.random() * 3) + 1;

      for (let i = 0; i < numMatches; i++) {
        const league = leagues[Math.floor(Math.random() * leagues.length)];
        const isPremium = Math.random() < 0.3; // 30% premium matches

        const homeIdx = Math.floor(Math.random() * basketballTeamList.length);
        let awayIdx = Math.floor(Math.random() * basketballTeamList.length);
        while (awayIdx === homeIdx) awayIdx = Math.floor(Math.random() * basketballTeamList.length);

        const hour = 19 + Math.floor(Math.random() * 6); // 7 PM to 1 AM
        const minute = Math.floor(Math.random() * 4) * 15; // 00, 15, 30, 45
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

        let premiumMarket: string | undefined;
        let premiumProbability: number | undefined;

        if (isPremium) {
          const markets = [
            'Match Winner', 'Total Points Over 220.5', 'Player Points Over 25.5',
            'Total Rebounds Over 45.5', 'Total Assists Over 25.5', 'First Quarter Winner'
          ];
          premiumMarket = markets[Math.floor(Math.random() * markets.length)];
          premiumProbability = 80; // Fixed at 80% for premium matches
        }

        matches.push({
          matchId: `bb-match-${matchCounter.toString().padStart(4, '0')}`,
          date: `2026-04-16 ${timeStr}`,
          homeTeam: basketballTeamList[homeIdx],
          awayTeam: basketballTeamList[awayIdx],
          league,
          country,
          isPremium,
          premiumMarket,
          premiumProbability
        });

        matchCounter++;
      }
    });

    // Ensure we have at least 30 matches total by adding more random ones
    while (matches.length < 30) {
      const countries = Object.keys(countryLeagueMap);
      const randomCountry = countries[Math.floor(Math.random() * countries.length)];
      const leagues = countryLeagueMap[randomCountry];
      const league = leagues[Math.floor(Math.random() * leagues.length)];
      const isPremium = Math.random() < 0.3;

      const homeIdx = Math.floor(Math.random() * basketballTeamList.length);
      let awayIdx = Math.floor(Math.random() * basketballTeamList.length);
      while (awayIdx === homeIdx) awayIdx = Math.floor(Math.random() * basketballTeamList.length);

      const hour = 19 + Math.floor(Math.random() * 6);
      const minute = Math.floor(Math.random() * 4) * 15;
      const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

      let premiumMarket: string | undefined;
      let premiumProbability: number | undefined;

      if (isPremium) {
        const markets = [
          'Match Winner', 'Total Points Over 220.5', 'Player Points Over 25.5',
          'Total Rebounds Over 45.5', 'Total Assists Over 25.5', 'First Quarter Winner'
        ];
        premiumMarket = markets[Math.floor(Math.random() * markets.length)];
        premiumProbability = 80;
      }

      matches.push({
        matchId: `bb-match-${matchCounter.toString().padStart(4, '0')}`,
        date: `2026-04-16 ${timeStr}`,
        homeTeam: basketballTeamList[homeIdx],
        awayTeam: basketballTeamList[awayIdx],
        league,
        country: randomCountry,
        isPremium,
        premiumMarket,
        premiumProbability
      });

      matchCounter++;
    }

    return matches;
  })()
];

export function getUpcomingMatches() {
  return upcomingMatches;
}

export function getBasketballTeamMatches(team: string) {
  return basketballSampleMatches.filter((match) => match.homeTeam === team || match.awayTeam === team);
}

export function getBasketballH2HMatches(home: string, away: string) {
  return basketballSampleMatches.filter(
    (match) =>
      (match.homeTeam === home && match.awayTeam === away) ||
      (match.homeTeam === away && match.awayTeam === home)
  );
}

export function getBasketballLiveMatches() {
  return basketballLiveMatches;
}

export function getBasketballUpcomingMatches() {
  return basketballUpcomingMatches;
}

export interface LeagueTableRow {
  position: number;
  team: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  points: number;
}

export function getLeagueTable(league: string, country = 'Global'): LeagueTableRow[] {
  const teams = [
    'Champions United',
    'City Falcons',
    'United Rangers',
    'Royal Strikers',
    'Victory Reds',
    'Golden Warriors',
    'Elite Stars',
    'Thunder FC',
    'Polar Knights',
    'Ocean Eagles',
  ];

  return teams.map((team, index) => {
    const position = index + 1;
    const played = 18;
    const wins = 10 + Math.max(0, 5 - index);
    const draws = 4 + Math.min(index, 3);
    const losses = played - wins - draws;
    const points = wins * 3 + draws;

    return {
      position,
      team,
      played,
      wins,
      draws,
      losses,
      points,
    };
  });
}
