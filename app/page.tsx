'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

const teams = [
  'FC Solaris',
  'Red Rapids',
  'Blue Titans',
  'Green City',
];

const countries = [
  'Albania',
  'Algeria',
  'Angola',
  'Argentina',
  'Armenia',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bolivia',
  'Bosnia and Herzegovina',
  'Brazil',
  'Bulgaria',
  'Burkina Faso',
  'Burundi',
  'Cameroon',
  'Canada',
  'Central African Republic',
  'Chad',
  'Chile',
  'China',
  'Colombia',
  'Congo',
  'Costa Rica',
  'Croatia',
  'Czech Republic',
  'Denmark',
  'Djibouti',
  'DR Congo',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'Equatorial Guinea',
  'Eritrea',
  'Estonia',
  'Ethiopia',
  'Finland',
  'France',
  'Gabon',
  'Georgia',
  'Germany',
  'Ghana',
  'Greece',
  'Guatemala',
  'Guinea',
  'Guyana',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Israel',
  'Italy',
  'Jamaica',
  'Japan',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kosovo',
  'Kuwait',
  'Latvia',
  'Lebanon',
  'Liberia',
  'Libya',
  'Lithuania',
  'Luxembourg',
  'Malawi',
  'Malaysia',
  'Malta',
  'Mexico',
  'Moldova',
  'Morocco',
  'Mozambique',
  'New Zealand',
  'Nicaragua',
  'Nigeria',
  'North Macedonia',
  'Northern Ireland',
  'Norway',
  'Oman',
  'Panama',
  'Paraguay',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Qatar',
  'Romania',
  'Russia',
  'Rwanda',
  'Saudi Arabia',
  'Scotland',
  'Senegal',
  'Serbia',
  'Sierra Leone',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'South Africa',
  'South Korea',
  'Spain',
  'Sri Lanka',
  'Sudan',
  'Sweden',
  'Switzerland',
  'Syria',
  'Tanzania',
  'Thailand',
  'Togo',
  'Tunisia',
  'Turkey',
  'Uganda',
  'UAE',
  'Ukraine',
  'USA',
  'Uruguay',
  'Venezuela',
  'Vietnam',
  'Wales',
  'Zambia',
  'Zimbabwe',
];

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
  'Latvia': ['Virslīga', 'Latvian Football Cup', 'Latvian Supercup'],
  'Lithuania': ['A Lyga', 'Lithuanian Football Cup', 'Lithuanian Supercup'],
  'Belarus': ['Belarusian Premier League', 'Belarusian Cup', 'Belarusian Super Cup'],
  'Moldova': ['Divizia Națională', 'Moldovan Cup', 'Moldovan Super Cup'],
  'Georgia': ['Erovnuli Liga', 'Georgian Cup', 'Georgian Super Cup'],
  'Armenia': ['Armenian Premier League', 'Armenian Cup', 'Armenian Super Cup'],
  'Azerbaijan': ['Azerbaijan Premier League', 'Azerbaijan Cup', 'Azerbaijan Super Cup'],
  'Kazakhstan': ['Kazakhstan Premier League', 'Kazakhstan Cup', 'Kazakhstan Super Cup'],
  'Israel': ['Israeli Premier League', 'Israel State Cup', 'Israel Super Cup'],
  'Saudi Arabia': ['Saudi Professional League', 'King Cup', 'Saudi Super Cup'],
  'UAE': ['UAE Pro League', 'UAE President\'s Cup', 'UAE Super Cup'],
  'Qatar': ['Qatar Stars League', 'Qatar Cup', 'Qatar Super Cup'],
  'Iran': ['Persian Gulf Pro League', 'Hazfi Cup', 'Iran Super Cup'],
  'Iraq': ['Iraq Stars League', 'Iraq FA Cup', 'Iraq Super Cup'],
  'Jordan': ['Jordanian Pro League', 'Jordan FA Cup', 'Jordan Super Cup'],
  'Lebanon': ['Lebanese Premier League', 'Lebanese FA Cup', 'Lebanese Super Cup'],
  'Syria': ['Syrian Premier League', 'Syrian Cup', 'Syrian Super Cup'],
  'Oman': ['Oman Professional League', 'Sultan Qaboos Cup', 'Oman Super Cup'],
  'Kuwait': ['Kuwait Premier League', 'Kuwait Emir Cup', 'Kuwait Super Cup'],
  'Bahrain': ['Bahrain Premier League', 'Bahrain King\'s Cup', 'Bahrain Super Cup'],
  'Egypt': ['Egyptian Premier League', 'Egypt Cup', 'Egypt Super Cup'],
  'Morocco': ['Botola', 'Moroccan Throne Cup', 'Moroccan Super Cup'],
  'Tunisia': ['Tunisian Ligue Professionnelle 1', 'Tunisian Cup', 'Tunisian Super Cup'],
  'Algeria': ['Algerian Ligue Professionnelle 1', 'Algerian Cup', 'Algerian Super Cup'],
  'Libya': ['Libyan Premier League', 'Libyan Cup', 'Libyan Super Cup'],
  'Sudan': ['Sudanese Premier League', 'Sudan Cup', 'Sudan Super Cup'],
  'Ethiopia': ['Ethiopian Premier League', 'Ethiopian Cup', 'Ethiopian Super Cup'],
  'Kenya': ['Kenyan Premier League', 'Kenya Cup', 'Kenya Super Cup'],
  'South Africa': ['South African Premier Division', 'Nedbank Cup', 'MTN 8'],
  'Nigeria': ['Nigeria Professional Football League', 'Nigerian Cup', 'Nigerian Super Cup'],
  'Ghana': ['Ghana Premier League', 'Ghana FA Cup', 'Ghana Super Cup'],
  'Ivory Coast': ['Ligue 1 (Ivory Coast)', 'Coupe de Côte d\'Ivoire', 'Super Coupe de Côte d\'Ivoire'],
  'Cameroon': ['Elite One', 'Cameroon Cup', 'Cameroon Super Cup'],
  'Senegal': ['Ligue 1 (Senegal)', 'Coupe du Sénégal', 'Super Coupe du Sénégal'],
  'Mali': ['Malian Première Division', 'Malian Cup', 'Malian Super Cup'],
  'Burkina Faso': ['Burkinabé Premier League', 'Burkina Faso Cup', 'Burkina Faso Super Cup'],
  'Guinea': ['Guinea Championnat National', 'Guinea Cup', 'Guinea Super Cup'],
  'Sierra Leone': ['Sierra Leone National Premier League', 'Sierra Leone FA Cup', 'Sierra Leone Super Cup'],
  'Liberia': ['Liberian First Division', 'Liberian Cup', 'Liberian Super Cup'],
  'Togo': ['Togolese Championnat National', 'Togo Cup', 'Togo Super Cup'],
  'Benin': ['Benin Premier League', 'Benin Cup', 'Benin Super Cup'],
  'Niger': ['Niger Premier League', 'Niger Cup', 'Niger Super Cup'],
  'Chad': ['Chad Premier League', 'Chad Cup', 'Chad Super Cup'],
  'Central African Republic': ['Central African Republic League', 'Central African Republic Cup', 'Central African Republic Super Cup'],
  'Gabon': ['Gabon Championnat National D1', 'Gabon Cup', 'Gabon Super Cup'],
  'Equatorial Guinea': ['Equatoguinean Primera División', 'Equatorial Guinea Cup', 'Equatorial Guinea Super Cup'],
  'Congo': ['Congo Premier League', 'Congo Cup', 'Congo Super Cup'],
  'DR Congo': ['Linafoot', 'Coupe du Congo', 'Super Coupe du Congo'],
  'Angola': ['Girabola', 'Angola Cup', 'Angola Super Cup'],
  'Zimbabwe': ['Zimbabwe Premier Soccer League', 'Zimbabwe Cup', 'Zimbabwe Super Cup'],
  'Zambia': ['Zambian Premier League', 'Zambia Cup', 'Zambia Super Cup'],
  'Malawi': ['Malawi Premier Division', 'Malawi Cup', 'Malawi Super Cup'],
  'Mozambique': ['Moçambola', 'Mozambique Cup', 'Mozambique Super Cup'],
  'Tanzania': ['Tanzania Premier League', 'Tanzania Cup', 'Tanzania Super Cup'],
  'Uganda': ['Uganda Premier League', 'Uganda Cup', 'Uganda Super Cup'],
  'Rwanda': ['Rwanda Premier League', 'Rwanda Cup', 'Rwanda Super Cup'],
  'Burundi': ['Burundi Premier League', 'Burundi Cup', 'Burundi Super Cup'],
  'Somalia': ['Somali First Division', 'Somali Cup', 'Somali Super Cup'],
  'Djibouti': ['Djibouti Premier League', 'Djibouti Cup', 'Djibouti Super Cup'],
  'Eritrea': ['Eritrean Premier League', 'Eritrea Cup', 'Eritrea Super Cup'],
  'Argentina': ['Argentine Primera División', 'Copa Argentina', 'Supercopa Argentina'],
  'Brazil': ['Campeonato Brasileiro Série A', 'Copa do Brasil', 'Supercopa do Brasil'],
  'Uruguay': ['Uruguayan Primera División', 'Copa Uruguay', 'Supercopa Uruguaya'],
  'Paraguay': ['Paraguayan Primera División', 'Copa Paraguay', 'Supercopa Paraguay'],
  'Chile': ['Chilean Primera División', 'Copa Chile', 'Supercopa de Chile'],
  'Colombia': ['Categoría Primera A', 'Copa Colombia', 'Superliga Colombiana'],
  'Ecuador': ['Serie A (Ecuador)', 'Copa Ecuador', 'Supercopa Ecuador'],
  'Peru': ['Liga 1 (Peru)', 'Copa Perú', 'Supercopa Peruana'],
  'Venezuela': ['Venezuelan Primera División', 'Copa Venezuela', 'Supercopa Venezolana'],
  'Bolivia': ['División Profesional', 'Copa Bolivia', 'Supercopa Bolivia'],
  'Mexico': ['Liga MX', 'Copa MX', 'Supercopa MX'],
  'USA': ['Major League Soccer', 'U.S. Open Cup', 'MLS Cup'],
  'Canada': ['Canadian Premier League', 'Canadian Championship', 'Canadian Super Cup'],
  'Costa Rica': ['Liga FPD', 'Copa Costa Rica', 'Supercopa Costa Rica'],
  'Panama': ['Liga Panameña de Fútbol', 'Copa Panamá', 'Supercopa Panamá'],
  'Honduras': ['Liga Nacional de Fútbol de Honduras', 'Copa Honduras', 'Supercopa Honduras'],
  'El Salvador': ['Primera División de El Salvador', 'Copa El Salvador', 'Supercopa El Salvador'],
  'Nicaragua': ['Primera División de Nicaragua', 'Copa Nicaragua', 'Supercopa Nicaragua'],
  'Guatemala': ['Liga Nacional de Guatemala', 'Copa Guatemala', 'Supercopa Guatemala'],
  'Belize': ['Belize Premier Football League', 'Belize Cup', 'Belize Super Cup'],
  'Jamaica': ['Jamaican Premier League', 'Jamaican Cup', 'Jamaican Super Cup'],
  'Trinidad and Tobago': ['TT Premier Football League', 'Trinidad and Tobago Cup', 'Trinidad and Tobago Super Cup'],
  'Barbados': ['Barbados Premier League', 'Barbados FA Cup', 'Barbados Super Cup'],
  'Guyana': ['Guyana Elite League', 'Guyana Cup', 'Guyana Super Cup'],
  'Suriname': ['Suriname Major League', 'Suriname Cup', 'Suriname Super Cup'],
  'French Guiana': ['French Guiana Honor Division', 'French Guiana Cup', 'French Guiana Super Cup'],
  'Australia': ['A-League', 'Australia Cup', 'A-League Grand Final'],
  'New Zealand': ['New Zealand Football Championship', 'New Zealand Cup', 'New Zealand Super Cup'],
  'Japan': ['J1 League', 'Emperor\'s Cup', 'J.League Cup'],
  'South Korea': ['K League 1', 'Korean FA Cup', 'K League Cup'],
  'China': ['Chinese Super League', 'Chinese FA Cup', 'Chinese FA Super Cup'],
  'Thailand': ['Thai League 1', 'Thai FA Cup', 'Thai League Cup'],
  'Vietnam': ['V.League 1', 'Vietnamese Cup', 'Vietnamese Super Cup'],
  'Indonesia': ['Liga 1 (Indonesia)', 'Piala Indonesia', 'Piala Presiden'],
  'Malaysia': ['Malaysia Super League', 'Malaysia FA Cup', 'Malaysia Cup'],
  'Singapore': ['Singapore Premier League', 'Singapore Cup', 'Singapore Community Shield'],
  'Philippines': ['Philippines Football League', 'Philippines Cup', 'Philippines Super Cup'],
  'India': ['Indian Super League', 'Indian Federation Cup', 'Indian Super Cup'],
  'Pakistan': ['Pakistan Premier League', 'Pakistan Cup', 'Pakistan Super Cup'],
  'Bangladesh': ['Bangladesh Premier League', 'Federation Cup', 'Bangladesh Super Cup'],
  'Sri Lanka': ['Sri Lanka Premier League', 'Sri Lanka FA Cup', 'Sri Lanka Super Cup'],
};

const basketballCountries = [
  'USA',
  'Spain',
  'Greece',
  'Turkey',
  'France',
  'Germany',
  'Italy',
  'Russia',
  'Lithuania',
  'Poland',
  'Serbia',
  'Croatia',
  'Slovenia',
  'Israel',
  'Lebanon',
  'Jordan',
  'UAE',
  'Qatar',
  'Saudi Arabia',
  'China',
  'Japan',
  'South Korea',
  'Philippines',
  'Australia',
  'Argentina',
  'Brazil',
  'Mexico',
  'Canada',
  'Venezuela',
  'Colombia',
  'Puerto Rico',
  'Dominican Republic',
  'Cuba',
  'Panama',
];

const basketballLeaguesByCountry: Record<string, string[]> = {
  'USA': ['NBA', 'NBA G League', 'WNBA', 'NCAA Division I'],
  'Spain': ['ACB League', 'LEB Oro', 'LEB Plata', 'Liga EBA'],
  'Greece': ['Greek Basket League', 'Greek A2 Basket League', 'Greek Cup'],
  'Turkey': ['Basketbol Süper Ligi', 'TBL', 'Türkiye Kupası'],
  'France': ['LNB Pro A', 'LNB Pro B', 'Coupe de France'],
  'Germany': ['Basketball Bundesliga', 'ProA', 'ProB', 'BBL Pokal'],
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

interface Prediction {
  name: string;
  value: string;
  explanation: string;
}

interface LiveMatch {
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
}

interface UpcomingMatch {
  matchId: string;
  date: string;
  homeTeam: string;
  awayTeam: string;
  tournament: string;
  isPremium?: boolean;
  premiumMarket?: string;
  premiumProbability?: number;
  predictions: Prediction[];
}

interface HotPick {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  tournament: string;
  market: string;
  value: string;
  winChance: number;
  coefficient: string;
  rationale: string;
}

export default function HomePage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedLeague, setSelectedLeague] = useState('All');
  const [countrySearch, setCountrySearch] = useState('');
  const [leagueSearch, setLeagueSearch] = useState('');
  const [selectedSport, setSelectedSport] = useState<'football' | 'basketball'>('football');
  const [showCountrySuggestions, setShowCountrySuggestions] = useState(false);
  const [showLeagueSuggestions, setShowLeagueSuggestions] = useState(false);
  const [upcomingMatches, setUpcomingMatches] = useState<UpcomingMatch[]>([]);

  // Get current sport's data
  const currentCountries = selectedSport === 'football' ? countries : basketballCountries;
  const currentLeaguesByCountry = selectedSport === 'football' ? leaguesByCountry : basketballLeaguesByCountry;

  const filteredCountries = useMemo(
    () => currentCountries.filter((country) => country.toLowerCase().includes(countrySearch.toLowerCase())).slice(0, 10),
    [countrySearch, currentCountries]
  );

  const filteredLeagues = useMemo(() => {
    if (selectedCountry === 'All') return [];
    const leagues = selectedCountry && currentLeaguesByCountry[selectedCountry] ? currentLeaguesByCountry[selectedCountry] : [];
    return leagues.filter((league) => league.toLowerCase().includes(leagueSearch.toLowerCase())).slice(0, 10);
  }, [selectedCountry, leagueSearch, currentLeaguesByCountry]);

  const hotPicks = useMemo<HotPick[]>(() => {
    const baseMatches = upcomingMatches.slice(0, 3);
    return baseMatches.map((match, index) => {
      if (selectedSport === 'football') {
        const footballHotPicks = [
          {
            market: 'Match Winner',
            value: `${match.homeTeam} to win`,
            winChance: 82,
            coefficient: '1.55',
            rationale: 'Strong home form and superior head-to-head performance this season.',
          },
          {
            market: 'Over/Under 2.5 Goals',
            value: 'Over 2.5 Goals',
            winChance: 80,
            coefficient: '1.72',
            rationale: 'Both teams average over 2 goals per game and attack aggressively.',
          },
          {
            market: 'Both Teams To Score',
            value: 'Yes',
            winChance: 81,
            coefficient: '1.68',
            rationale: 'Both sides keep clean sheets rarely and attack from open play.',
          },
        ];
        return {
          matchId: match.matchId,
          homeTeam: match.homeTeam,
          awayTeam: match.awayTeam,
          tournament: match.tournament,
          ...footballHotPicks[index % footballHotPicks.length],
        };
      }

      const basketballHotPicks = [
        {
          market: 'Match Winner',
          value: `${match.homeTeam} to win`,
          winChance: 83,
          coefficient: '1.48',
          rationale: 'Strong offense and high pace advantage against this opponent.',
        },
        {
          market: 'Total Points Over 220.5',
          value: 'Over 220.5 Points',
          winChance: 80,
          coefficient: '1.80',
          rationale: 'Both teams average over 110 points per game with weak defenses.',
        },
        {
          market: 'Total Rebounds Over 44.5',
          value: 'Over 44.5 Rebounds',
          winChance: 81,
          coefficient: '1.96',
          rationale: 'High tempo matchup with strong rebounders on both sides.',
        },
      ];
      return {
        matchId: match.matchId,
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        tournament: match.tournament,
        ...basketballHotPicks[index % basketballHotPicks.length],
      };
    });
  }, [upcomingMatches, selectedSport]);

  useEffect(() => {
    // Reset selections when sport changes
    setSelectedCountry('All');
    setCountrySearch('');
    setLeagueSearch('');
    setShowCountrySuggestions(false);
    setShowLeagueSuggestions(false);
  }, [selectedSport, currentCountries]);

  useEffect(() => {
    if (selectedCountry === 'All') {
      setSelectedLeague('All');
    } else if (selectedCountry && currentLeaguesByCountry[selectedCountry]) {
      setSelectedLeague('All'); // Default to All leagues for the selected country
    }
  }, [selectedCountry, currentLeaguesByCountry]);

  useEffect(() => {
    // Load upcoming matches for the selected sport, country, and league
    let url = `/api/matches?sport=${selectedSport}`;
    if (selectedCountry && selectedCountry !== 'All') {
      url += `&country=${encodeURIComponent(selectedCountry)}`;
    }
    if (selectedLeague && selectedLeague !== 'All') {
      url += `&league=${encodeURIComponent(selectedLeague)}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((payload) => {
        setUpcomingMatches(payload.upcomingMatches || []);
      })
      .catch(() => {
        setUpcomingMatches([]);
      });
  }, [selectedSport, selectedCountry, selectedLeague]);

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="card sidebar-card">
          <h3>Sport Selection</h3>
          <div className="sport-toggle">
            <button
              type="button"
              className={`sport-button ${selectedSport === 'football' ? 'active' : ''}`}
              onClick={() => setSelectedSport('football')}
            >
              ⚽ Football
            </button>
            <button
              type="button"
              className={`sport-button ${selectedSport === 'basketball' ? 'active' : ''}`}
              onClick={() => setSelectedSport('basketball')}
            >
              🏀 Basketball
            </button>
          </div>
        </div>

        <div className="card sidebar-card">
          <h3>Country & League</h3>
          <div className="selector-group">
            <label>
              Search country
              <div className="search-input-wrapper">
                <input
                  className="search-input"
                  type="text"
                  placeholder="Search country"
                  value={countrySearch}
                  onChange={(event) => {
                    setCountrySearch(event.target.value);
                    setShowCountrySuggestions(true);
                  }}
                  onFocus={() => setShowCountrySuggestions(true)}
                  onBlur={() => setTimeout(() => setShowCountrySuggestions(false), 200)}
                />
                {showCountrySuggestions && countrySearch && (
                  <div className="suggestions-dropdown">
                    {filteredCountries.length > 0 ? (
                      filteredCountries.map((country) => (
                        <div
                          key={country}
                          className="suggestion-item"
                          onClick={() => {
                            // Select the country
                            setSelectedCountry(country);
                            // Clear the search
                            setCountrySearch('');
                            setLeagueSearch('');
                            setShowCountrySuggestions(false);
                          }}
                        >
                          {country}
                        </div>
                      ))
                    ) : (
                      <div className="suggestion-item disabled">No countries found</div>
                    )}
                  </div>
                )}
              </div>
            </label>
            <label>
              Country
              <select
                value={selectedCountry}
                onChange={(event) => {
                  setSelectedCountry(event.target.value);
                  setLeagueSearch('');
                }}
              >
                <option value="All">All Countries</option>
                {currentCountries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Search league
              <div className="search-input-wrapper">
                <input
                  className="search-input"
                  type="text"
                  placeholder="Search league"
                  value={leagueSearch}
                  onChange={(event) => {
                    setLeagueSearch(event.target.value);
                    setShowLeagueSuggestions(true);
                  }}
                  onFocus={() => setShowLeagueSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowLeagueSuggestions(false), 200)}
                  disabled={selectedCountry === 'All'}
                />
                {showLeagueSuggestions && leagueSearch && selectedCountry && selectedCountry !== 'All' && (
                  <div className="suggestions-dropdown">
                    {filteredLeagues.length > 0 ? (
                      filteredLeagues.map((league) => (
                        <div
                          key={league}
                          className="suggestion-item"
                          onClick={() => {
                            setSelectedLeague(league);
                            setLeagueSearch('');
                            setShowLeagueSuggestions(false);
                          }}
                        >
                          {league}
                        </div>
                      ))
                    ) : (
                      <div className="suggestion-item disabled">No leagues found</div>
                    )}
                  </div>
                )}
              </div>
            </label>
            <label>
              League
              <select
                value={selectedLeague}
                onChange={(event) => setSelectedLeague(event.target.value)}
                disabled={selectedCountry === 'All'}
              >
                <option value="All">All Leagues</option>
                {selectedCountry !== 'All' && currentLeaguesByCountry[selectedCountry]?.map((league) => (
                  <option key={league} value={league}>
                    {league}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <section className="header">
          <div className="card header-card">
            <div className="header-main">
              <div>
                <h1 className="logo">ROAD2AMILLI</h1>
                <p className="subtitle">insight, not guesses. own the game.</p>
              </div>
              <div className="header-actions">
                <button
                  type="button"
                  onClick={() => router.push('/historical')}
                  className="nav-button"
                >
                  📊 Historical Matches
                </button>
                <div className="auth-section">
                  {session ? (
                    <>
                      <p>Welcome, <strong>{session.user?.name ?? session.user?.email}</strong></p>
                      <button type="button" onClick={() => signOut()}>Sign out</button>
                    </>
                  ) : (
                    <button type="button" onClick={() => router.push('/login')}>Sign in</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="card dashboard-card">
          <h2>Dashboard - {selectedSport === 'football' ? '⚽ Football' : '🏀 Basketball'}</h2>
          <div className="dashboard-content dashboard-with-hotpicks">
            <div className="win-rate-section">
              <h3>Prediction Win Rate</h3>
              <div className="win-rate-display">
                <div className="win-rate-percentage">
                  {selectedSport === 'football' ? '87%' : '82%'}
                </div>
                <div className="win-rate-details">
                  {selectedSport === 'football' 
                    ? '156 wins out of 180 predictions' 
                    : '94 wins out of 115 predictions'
                  }
                </div>
              </div>
            </div>

            <div className="hot-picks-section">
              <h3>Hot Picks</h3>
              <div className="hot-picks-grid">
                {hotPicks.length > 0 ? (
                  hotPicks.map((pick) => (
                    <button
                      key={pick.matchId}
                      type="button"
                      className="hot-pick-card"
                      onClick={() => {
                        router.push(`/match/${selectedSport}/${pick.matchId}`);
                      }}
                    >
                      <div className="hot-pick-header">
                        <strong>{pick.homeTeam} vs {pick.awayTeam}</strong>
                        <span className="hot-tag">HOT</span>
                      </div>
                      <div className="hot-pick-market">{pick.market}</div>
                      <div className="hot-pick-value">{pick.value}</div>
                      <div className="hot-pick-meta">
                        <span>{pick.winChance}% Chance</span>
                        <span>Coeff: {pick.coefficient}</span>
                      </div>
                      <p className="hot-pick-rationale">{pick.rationale}</p>
                    </button>
                  ))
                ) : (
                  <p>No hot picks available yet.</p>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="card matches-section">
          <h2>
            Upcoming Matches - {selectedSport === 'football' ? '⚽ Football' : '🏀 Basketball'}
            {selectedCountry !== 'All' && ` • ${selectedCountry}`}
            {selectedLeague !== 'All' && ` • ${selectedLeague}`}
          </h2>
          <div className="matches-list">
            {upcomingMatches.length > 0 ? (
              upcomingMatches.map((match) => (
                <button
                  key={match.matchId}
                  type="button"
                  className="match-card-button"
                  onClick={() => {
                    router.push(`/match/${selectedSport}/${match.matchId}`);
                  }}
                >
                  <div className="match-card">
                    <div className="match-teams">
                      <span className="team-name">{match.homeTeam}</span>
                      <span className="vs">vs</span>
                      <span className="team-name">{match.awayTeam}</span>
                    </div>
                    <div className="match-info">
                      <span className="tournament">{match.tournament}</span>
                      <span className="date">{match.date}</span>
                    </div>
                    {match.isPremium && <span className="premium-badge">PREMIUM</span>}
                  </div>
                </button>
              ))
            ) : (
              <div className="no-matches">
                <p>No matches available for {selectedCountry} • {selectedLeague}</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
