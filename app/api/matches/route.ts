import { NextResponse } from 'next/server';
import { getLiveMatches, getUpcomingMatches, getBasketballLiveMatches, getBasketballUpcomingMatches, UpcomingMatch, BasketballUpcomingMatch } from '../../../lib/data';
import { getPredictionForMatch, getPremiumPredictionForMatch } from '../../../lib/predict';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sport = searchParams.get('sport') || 'football';
  const country = searchParams.get('country');
  const league = searchParams.get('league');

  let liveMatches: any;
  let upcomingMatches: UpcomingMatch[] | BasketballUpcomingMatch[];

  if (sport === 'basketball') {
    liveMatches = getBasketballLiveMatches();
    upcomingMatches = getBasketballUpcomingMatches();
  } else {
    liveMatches = getLiveMatches();
    upcomingMatches = getUpcomingMatches();
  }

  // Filter matches by country and league if specified
  let filteredUpcomingMatches: UpcomingMatch[] | BasketballUpcomingMatch[] = upcomingMatches;

  if (country && country !== 'All') {
    // For football, we need to map leagues to countries
    if (sport === 'football') {
      // Import the leaguesByCountry mapping
      const leaguesByCountry: Record<string, string[]> = {
        'England': ['Premier League', 'Championship', 'League One', 'League Two', 'National League', 'FA Cup', 'League Cup', 'Community Shield'],
        'Spain': ['La Liga', 'La Liga 2', 'Copa del Rey', 'Supercopa de España'],
        'Italy': ['Serie A', 'Serie B', 'Coppa Italia', 'Supercoppa Italiana'],
        'Germany': ['Bundesliga', 'Bundesliga 2', 'DFB Pokal', 'DFL Supercup'],
        'France': ['Ligue 1', 'Ligue 2', 'Coupe de France', 'Trophée des Champions'],
        'Netherlands': ['Eredivisie', 'Eerste Divisie', 'KNVB Cup', 'Johan Cruijff Schaal'],
        'Portugal': ['Primeira Liga', 'Segunda Liga', 'Taça de Portugal', 'Supertaça Cândido de Oliveira'],
        'Turkey': ['Süper Lig', '1. Lig', 'Türkiye Kupası', 'Süper Kupa'],
        'Greece': ['Super League Greece', 'Greek Cup', 'Super Cup Greece'],
        'Belgium': ['Pro League', 'Challenger Pro League', 'Belgian Cup', 'Belgian Super Cup'],
        'Scotland': ['Scottish Premiership', 'Scottish Championship', 'Scottish League Cup', 'Scottish Cup'],
        'Russia': ['Russian Premier League', 'Russian Cup', 'Russian Super Cup'],
        'Ukraine': ['Ukrainian Premier League', 'Ukrainian Cup', 'Ukrainian Super Cup'],
        'Poland': ['Ekstraklasa', 'Polish Cup', 'Polish Super Cup'],
        'Czech Republic': ['Czech First League', 'Czech Cup', 'Czech Super Cup'],
        'Austria': ['Austrian Bundesliga', 'Austrian Cup', 'Austrian Super Cup'],
        'Switzerland': ['Swiss Super League', 'Swiss Cup', 'Swiss Super Cup'],
        'Croatia': ['Prva HNL', 'Croatian Cup', 'Croatian Super Cup'],
        'Serbia': ['Serbian SuperLiga', 'Serbian Cup', 'Serbian Super Cup'],
        'Sweden': ['Allsvenskan', 'Svenska Cupen', 'Svenska Supercupen'],
        'Norway': ['Eliteserien', 'Norwegian Cup', 'Norwegian Super Cup'],
        'Denmark': ['Danish Superliga', 'Danish Cup', 'Danish Super Cup'],
        'Finland': ['Veikkausliiga', 'Finnish Cup', 'Finnish League Cup'],
        'Iceland': ['Úrvalsdeild', 'Icelandic Cup', 'Icelandic Super Cup'],
        'Ireland': ['League of Ireland Premier Division', 'FAI Cup', 'President\'s Cup'],
        'Wales': ['Cymru Premier', 'Welsh Cup', 'Welsh League Cup'],
        'Northern Ireland': ['NIFL Premiership', 'Irish Cup', 'Northern Ireland Football League Cup'],
        'Slovakia': ['Slovak Super Liga', 'Slovak Cup', 'Slovak Super Cup'],
        'Slovenia': ['Slovenian PrvaLiga', 'Slovenian Cup', 'Slovenian Super Cup'],
        'Hungary': ['Nemzeti Bajnokság I', 'Magyar Kupa', 'Magyar Szuperkupa'],
        'Romania': ['Liga I', 'Cupa României', 'Supercupa României'],
        'Bulgaria': ['First Professional Football League', 'Bulgarian Cup', 'Bulgarian Supercup'],
        'Bosnia and Herzegovina': ['Premier League of Bosnia and Herzegovina', 'Bosnian Cup', 'Bosnian Supercup'],
        'Montenegro': ['Montenegrin First League', 'Montenegrin Cup', 'Montenegrin Supercup'],
        'Kosovo': ['Superliga e Kosovës', 'Kosovar Cup', 'Kosovar Supercup'],
        'Albania': ['Kategoria Superiore', 'Albanian Cup', 'Albanian Supercup'],
        'North Macedonia': ['Macedonian First Football League', 'Macedonian Cup', 'Macedonian Supercup'],
        'Luxembourg': ['National Division', 'Luxembourg Cup', 'Luxembourg Super Cup'],
        'Malta': ['Maltese Premier League', 'Maltese FA Trophy', 'Maltese Super Cup'],
        'Cyprus': ['Cypriot First Division', 'Cypriot Cup', 'Cypriot Super Cup'],
        'Estonia': ['Meistriliiga', 'Estonian Cup', 'Estonian Supercup'],
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

      const countryLeagues = leaguesByCountry[country] || [];
      filteredUpcomingMatches = (filteredUpcomingMatches as UpcomingMatch[]).filter(match =>
        countryLeagues.includes(match.tournament)
      );
    } else if (sport === 'basketball') {
      // For basketball, we need to map leagues to countries
      const basketballLeaguesByCountry: Record<string, string[]> = {
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

      const countryLeagues = basketballLeaguesByCountry[country] || [];
      filteredUpcomingMatches = (filteredUpcomingMatches as BasketballUpcomingMatch[]).filter(match =>
        countryLeagues.includes(match.league)
      );
    }
  }

  if (league && league !== 'All') {
    if (sport === 'football') {
      filteredUpcomingMatches = (filteredUpcomingMatches as UpcomingMatch[]).filter(match =>
        match.tournament === league
      );
    } else if (sport === 'basketball') {
      filteredUpcomingMatches = (filteredUpcomingMatches as BasketballUpcomingMatch[]).filter(match =>
        match.league === league
      );
    }
  }

  // Sort by premium and consistency for "All" selections, then limit to 10 matches
  if ((country === 'All' || !country) && (league === 'All' || !league)) {
    if (sport === 'football') {
      filteredUpcomingMatches = (filteredUpcomingMatches as UpcomingMatch[])
        .sort((a, b) => {
          if (a.isPremium && !b.isPremium) return -1;
          if (!a.isPremium && b.isPremium) return 1;
          return a.tournament.localeCompare(b.tournament);
        })
        .slice(0, 10);
    } else {
      filteredUpcomingMatches = (filteredUpcomingMatches as BasketballUpcomingMatch[])
        .sort((a, b) => {
          if (a.isPremium && !b.isPremium) return -1;
          if (!a.isPremium && b.isPremium) return 1;
          return a.league.localeCompare(b.league);
        })
        .slice(0, 10);
    }
  }

  const processedUpcomingMatches = filteredUpcomingMatches.map((match) => {
    if (match.isPremium && match.premiumMarket) {
      // Premium matches get only one high-confidence prediction
      return {
        ...match,
        predictions: [getPremiumPredictionForMatch(match.homeTeam, match.awayTeam, match.premiumMarket, sport as 'football' | 'basketball')]
      };
    } else {
      // Regular matches get full prediction suite
      return {
        ...match,
        predictions: getPredictionForMatch(match.homeTeam, match.awayTeam, sport as 'football' | 'basketball')
      };
    }
  });

  return NextResponse.json({ liveMatches, upcomingMatches: processedUpcomingMatches });
}
