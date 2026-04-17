'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Prediction {
  name: string;
  value: string;
  explanation: string;
  isTopPick?: boolean;
  winChance?: number;
}

interface H2HMatch {
  date: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
}

interface PlayerLineup {
  name: string;
  position: string;
  number: number;
}

interface MatchData {
  matchId: string;
  date: string;
  homeTeam: string;
  awayTeam: string;
  tournament: string;
  league?: string;
  isPremium?: boolean;
  premiumMarket?: string;
  premiumProbability?: number;
  predictions: Prediction[];
  sport: 'football' | 'basketball';
  h2hHistory?: H2HMatch[];
  homeLineup?: PlayerLineup[];
  awayLineup?: PlayerLineup[];
}

export default function MatchDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'predictions' | 'h2h' | 'lineups'>('predictions');

  const matchId = params?.id as string;
  const sport = params?.sport as 'football' | 'basketball';

  useEffect(() => {
    if (!matchId || !sport) return;

    // Fetch match details from API
    fetch(`/api/matches/${sport}/${matchId}`)
      .then((res) => res.json())
      .then((data) => {
        setMatchData(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [matchId, sport]);

  if (loading) {
    return (
      <main className="main">
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h2>Loading match details...</h2>
        </div>
      </main>
    );
  }

  if (!matchData) {
    return (
      <main className="main">
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h2>Match not found</h2>
          <button onClick={() => router.back()} style={{ marginTop: '1rem' }}>
            Go Back
          </button>
        </div>
      </main>
    );
  }

  const isBasketball = sport === 'basketball';
  const topPrediction = matchData.predictions.find(p => p.isTopPick) || matchData.predictions[0];

  return (
    <main className="main">
      <section className="header">
        <div className="card header-card">
          <div className="header-main">
            <div>
              <h1 className="logo">ROAD2AMILLI</h1>
              <p className="subtitle">{isBasketball ? '🏀 Basketball' : '⚽ Football'} Match Details</p>
            </div>
            <div>
              <button onClick={() => router.back()} style={{ padding: '0.75rem 1.5rem' }}>
                ← Back to Matches
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="card match-header-card">
        <div className="match-teams-header">
          <div className="team-section">
            <h2>{matchData.homeTeam}</h2>
          </div>
          <div className="vs-section">
            <span className="vs-text">vs</span>
          </div>
          <div className="team-section">
            <h2>{matchData.awayTeam}</h2>
          </div>
        </div>
        <div className="match-meta">
          <span className="tournament">{matchData.tournament || matchData.league}</span>
          <span className="date">{matchData.date}</span>
          {matchData.isPremium && <span className="premium-badge">PREMIUM</span>}
        </div>
      </section>

      <section className="card match-details-tabs">
        <div className="tabs-container">
          <button
            className={`tab-button ${activeTab === 'predictions' ? 'active' : ''}`}
            onClick={() => setActiveTab('predictions')}
          >
            📊 Predictions
          </button>
          <button
            className={`tab-button ${activeTab === 'h2h' ? 'active' : ''}`}
            onClick={() => setActiveTab('h2h')}
          >
            📈 H2H History
          </button>
          <button
            className={`tab-button ${activeTab === 'lineups' ? 'active' : ''}`}
            onClick={() => setActiveTab('lineups')}
          >
            👥 Lineups
          </button>
        </div>

        {activeTab === 'predictions' && (
          <div className="tab-content">
            <div className="predictions-container">
              {topPrediction && (
                <div className="top-prediction-card">
                  <div className="star-badge">★ TOP PICK</div>
                  <h3>{topPrediction.name}</h3>
                  <div className="prediction-value">{topPrediction.value}</div>
                  <div className="prediction-win-chance">
                    {topPrediction.winChance || 80}% Win Chance
                  </div>
                  <p className="prediction-reason">{topPrediction.explanation}</p>
                </div>
              )}

              <div className="predictions-grid">
                {matchData.predictions.map((prediction, index) => (
                  <div key={index} className="prediction-card">
                    <h4>{prediction.name}</h4>
                    <div className="card-value">{prediction.value}</div>
                    <div className="win-chance">{prediction.winChance || 75}% chance</div>
                    <p className="explanation">{prediction.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'h2h' && (
          <div className="tab-content">
            <div className="h2h-container">
              {matchData.h2hHistory && matchData.h2hHistory.length > 0 ? (
                <div className="h2h-list">
                  {matchData.h2hHistory.map((match, index) => (
                    <div key={index} className="h2h-match">
                      <div className="h2h-date">{match.date}</div>
                      <div className="h2h-teams">
                        <span className="team-left">{match.homeTeam} {match.homeScore}</span>
                        <span className="score-dash">-</span>
                        <span className="team-right">{match.awayScore} {match.awayTeam}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ textAlign: 'center', color: '#999999' }}>No H2H history available</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'lineups' && (
          <div className="tab-content">
            <div className="lineups-container">
              {(matchData.homeLineup || matchData.awayLineup) ? (
                <div className="lineups-grid">
                  {matchData.homeLineup && (
                    <div className="lineup-section">
                      <h3>{matchData.homeTeam} Lineup</h3>
                      <div className="players-list">
                        {matchData.homeLineup.map((player, index) => (
                          <div key={index} className="player-item">
                            <span className="player-number">{player.number}</span>
                            <span className="player-name">{player.name}</span>
                            <span className="player-position">{player.position}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {matchData.awayLineup && (
                    <div className="lineup-section">
                      <h3>{matchData.awayTeam} Lineup</h3>
                      <div className="players-list">
                        {matchData.awayLineup.map((player, index) => (
                          <div key={index} className="player-item">
                            <span className="player-number">{player.number}</span>
                            <span className="player-name">{player.name}</span>
                            <span className="player-position">{player.position}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p style={{ textAlign: 'center', color: '#999999' }}>Lineups not available yet</p>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}