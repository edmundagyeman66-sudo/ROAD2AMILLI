'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface HistoricalPrediction {
  name: string;
  value: string;
  explanation: string;
  isTopPick?: boolean;
  winChance?: number;
  actualOutcome?: string;
  wasCorrect?: boolean;
}

interface HistoricalMatch {
  matchId: string;
  date: string;
  homeTeam: string;
  awayTeam: string;
  tournament: string;
  league?: string;
  country?: string;
  homeScore: number;
  awayScore: number;
  status: 'completed';
  predictions: HistoricalPrediction[];
  sport: 'football' | 'basketball';
  predictionAccuracy?: number;
}

interface AccuracyStats {
  totalMatches: number;
  averageAccuracy: number;
  accuracyBySport: { [key: string]: number };
  accuracyByLeague: { [key: string]: number };
}

export default function HistoricalMatchesPage() {
  const [matches, setMatches] = useState<HistoricalMatch[]>([]);
  const [stats, setStats] = useState<AccuracyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState<'all' | 'football' | 'basketball'>('all');
  const [showStats, setShowStats] = useState(false);
  const router = useRouter();

  const fetchHistoricalData = useCallback(async () => {
    setLoading(true);
    try {
      const sportParam = selectedSport === 'all' ? '' : `&sport=${selectedSport}`;
      const matchesResponse = await fetch(`/api/historical?limit=100${sportParam}`);
      const matchesData = await matchesResponse.json();
      setMatches(matchesData.matches);

      const statsResponse = await fetch('/api/historical?stats=true');
      const statsData = await statsResponse.json();
      setStats(statsData.stats);
    } catch (error) {
      console.error('Error fetching historical data:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedSport]);

  useEffect(() => {
    fetchHistoricalData();
  }, [fetchHistoricalData]);

  const getTeamInitials = (team: string): string => {
    return team.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getAccuracyColor = (accuracy: number): string => {
    if (accuracy >= 70) return 'text-green-600';
    if (accuracy >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="text-white mt-4">Loading historical matches...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Historical Matches</h1>
          <p className="text-gray-300">View past matches, predictions, and prediction accuracy</p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedSport('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedSport === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              All Sports
            </button>
            <button
              onClick={() => setSelectedSport('football')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedSport === 'football'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              ⚽ Football
            </button>
            <button
              onClick={() => setSelectedSport('basketball')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedSport === 'basketball'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              🏀 Basketball
            </button>
          </div>

          <button
            onClick={() => setShowStats(!showStats)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              showStats
                ? 'bg-green-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            📊 {showStats ? 'Hide' : 'Show'} Statistics
          </button>
        </div>

        {/* Statistics Panel */}
        {showStats && stats && (
          <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">Prediction Accuracy Statistics</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{stats.totalMatches}</div>
                <div className="text-gray-300">Total Matches</div>
              </div>

              <div className="text-center">
                <div className={`text-3xl font-bold ${getAccuracyColor(stats.averageAccuracy)}`}>
                  {stats.averageAccuracy}%
                </div>
                <div className="text-gray-300">Average Accuracy</div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">
                  {Object.keys(stats.accuracyBySport).length}
                </div>
                <div className="text-gray-300">Sports Tracked</div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Accuracy by Sport</h3>
                <div className="space-y-2">
                  {Object.entries(stats.accuracyBySport).map(([sport, accuracy]) => (
                    <div key={sport} className="flex justify-between items-center">
                      <span className="text-gray-300 capitalize">{sport}</span>
                      <span className={`font-semibold ${getAccuracyColor(accuracy)}`}>
                        {accuracy}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Top Leagues</h3>
                <div className="space-y-2">
                  {Object.entries(stats.accuracyByLeague)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 5)
                    .map(([league, accuracy]) => (
                      <div key={league} className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">{league}</span>
                        <span className={`font-semibold ${getAccuracyColor(accuracy)}`}>
                          {accuracy}%
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Matches List */}
        <div className="space-y-4">
          {matches.map((match) => (
            <div
              key={match.matchId}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors"
            >
              {/* Match Header */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                <div className="flex items-center gap-4 mb-2 lg:mb-0">
                  <div className="text-sm text-gray-400">{formatDate(match.date)}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">
                      {match.sport === 'football' ? '⚽' : '🏀'} {match.sport}
                    </span>
                    {match.country && (
                      <span className="text-xs bg-blue-900 px-2 py-1 rounded text-blue-300">
                        {match.country}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-400">{match.league}</div>
                  <div className={`text-sm font-semibold ${getAccuracyColor(match.predictionAccuracy || 0)}`}>
                    {match.predictionAccuracy}% Prediction Accuracy
                  </div>
                </div>
              </div>

              {/* Teams and Score */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="team-logo">{getTeamInitials(match.homeTeam)}</div>
                  <div>
                    <div className="text-white font-semibold">{match.homeTeam}</div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {match.homeScore} - {match.awayScore}
                  </div>
                  <div className="text-xs text-gray-400">Final Score</div>
                </div>

                <div className="flex items-center gap-3">
                  <div>
                    <div className="text-white font-semibold text-right">{match.awayTeam}</div>
                  </div>
                  <div className="team-logo">{getTeamInitials(match.awayTeam)}</div>
                </div>
              </div>

              {/* Predictions */}
              <div className="border-t border-gray-700 pt-4">
                <h3 className="text-lg font-semibold text-white mb-3">Predictions vs Actual Outcomes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {match.predictions.map((prediction, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        prediction.wasCorrect
                          ? 'bg-green-900/20 border-green-700'
                          : 'bg-red-900/20 border-red-700'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="text-white font-medium text-sm">{prediction.name}</div>
                        <div className={`text-xs px-2 py-1 rounded ${
                          prediction.wasCorrect
                            ? 'bg-green-600 text-white'
                            : 'bg-red-600 text-white'
                        }`}>
                          {prediction.wasCorrect ? '✓ Correct' : '✗ Wrong'}
                        </div>
                      </div>

                      <div className="text-sm text-gray-300 mb-1">
                        <span className="font-medium">Predicted:</span> {prediction.value}
                      </div>

                      <div className="text-sm text-gray-300">
                        <span className="font-medium">Actual:</span> {prediction.actualOutcome}
                      </div>

                      {prediction.winChance && (
                        <div className="text-xs text-gray-400 mt-1">
                          Confidence: {prediction.winChance}%
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {matches.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No historical matches found for the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}