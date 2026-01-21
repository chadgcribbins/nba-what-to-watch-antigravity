/**
 * ESPN API to Canonical Schema Mapper
 *
 * Converts ESPN API responses to our internal canonical schema
 * ESPN provides real-time data with comprehensive game information
 */

import type {
  Team,
  Player,
  Game,
  GameDetails,
  InternalGameStats,
  QuarterScore,
} from '../types';
import type {
  ESPNEvent,
  ESPNCompetition,
  ESPNCompetitor,
  ESPNScoreboardResponse,
} from './client';

/**
 * ESPN Team ID to canonical Team ID/info mapping
 * ESPN uses different IDs than NBA Stats, so we normalize them
 */
const ESPN_TEAM_MAP: Record<string, { abbreviation: string; conference: 'East' | 'West'; division: string }> = {
  '1': { abbreviation: 'ATL', conference: 'East', division: 'Southeast' },
  '2': { abbreviation: 'BOS', conference: 'East', division: 'Atlantic' },
  '3': { abbreviation: 'BKN', conference: 'East', division: 'Atlantic' },
  '4': { abbreviation: 'CHA', conference: 'East', division: 'Southeast' },
  '5': { abbreviation: 'CHI', conference: 'East', division: 'Central' },
  '6': { abbreviation: 'CLE', conference: 'East', division: 'Central' },
  '7': { abbreviation: 'DAL', conference: 'West', division: 'Southwest' },
  '8': { abbreviation: 'DEN', conference: 'West', division: 'Northwest' },
  '9': { abbreviation: 'DET', conference: 'East', division: 'Central' },
  '10': { abbreviation: 'GSW', conference: 'West', division: 'Pacific' },
  '11': { abbreviation: 'HOU', conference: 'West', division: 'Southwest' },
  '12': { abbreviation: 'IND', conference: 'East', division: 'Central' },
  '13': { abbreviation: 'LAC', conference: 'West', division: 'Pacific' },
  '14': { abbreviation: 'LAL', conference: 'West', division: 'Pacific' },
  '15': { abbreviation: 'MEM', conference: 'West', division: 'Southwest' },
  '16': { abbreviation: 'MIA', conference: 'East', division: 'Southeast' },
  '17': { abbreviation: 'MIL', conference: 'East', division: 'Central' },
  '18': { abbreviation: 'MIN', conference: 'West', division: 'Northwest' },
  '19': { abbreviation: 'NOP', conference: 'West', division: 'Southwest' },
  '20': { abbreviation: 'NYK', conference: 'East', division: 'Atlantic' },
  '21': { abbreviation: 'OKC', conference: 'West', division: 'Northwest' },
  '22': { abbreviation: 'ORL', conference: 'East', division: 'Southeast' },
  '23': { abbreviation: 'PHI', conference: 'East', division: 'Atlantic' },
  '24': { abbreviation: 'PHX', conference: 'West', division: 'Pacific' },
  '25': { abbreviation: 'POR', conference: 'West', division: 'Northwest' },
  '26': { abbreviation: 'SAC', conference: 'West', division: 'Pacific' },
  '27': { abbreviation: 'SAS', conference: 'West', division: 'Southwest' },
  '28': { abbreviation: 'TOR', conference: 'East', division: 'Atlantic' },
  '29': { abbreviation: 'UTA', conference: 'West', division: 'Northwest' },
  '30': { abbreviation: 'WAS', conference: 'East', division: 'Southeast' },
};

/**
 * Maps ESPN team data to canonical Team
 */
export function mapTeam(espnTeam: ESPNCompetitor['team']): Team & { logo?: string } {
  const teamInfo = ESPN_TEAM_MAP[espnTeam.id] || {
    abbreviation: espnTeam.abbreviation,
    conference: 'East' as const,
    division: 'Unknown',
  };

  return {
    id: espnTeam.id,
    name: espnTeam.name,
    abbreviation: espnTeam.abbreviation || teamInfo.abbreviation,
    city: espnTeam.location,
    conference: teamInfo.conference,
    division: teamInfo.division,
    fullName: espnTeam.displayName,
    logo: espnTeam.logo, // ESPN provides logo URL
  };
}

/**
 * Maps ESPN event to canonical Game
 */
export function mapGame(event: ESPNEvent): Game {
  const competition = event.competitions[0];
  if (!competition) {
    throw new Error(`Event ${event.id} has no competition data`);
  }

  // Find home and away teams
  const homeCompetitor = competition.competitors.find(c => c.homeAway === 'home');
  const awayCompetitor = competition.competitors.find(c => c.homeAway === 'away');

  if (!homeCompetitor || !awayCompetitor) {
    throw new Error(`Event ${event.id} missing home or away team`);
  }

  // Determine game status
  let status: 'scheduled' | 'in_progress' | 'final';
  const statusState = event.status.type.state;
  
  if (statusState === 'post' || event.status.type.completed) {
    status = 'final';
  } else if (statusState === 'in') {
    status = 'in_progress';
  } else {
    status = 'scheduled';
  }

  // Calculate internal stats
  const internalStats = calculateInternalStats(competition, status);

  return {
    id: event.id,
    startTime: new Date(event.date),
    finalTime: status === 'final' ? new Date(event.date) : null,
    awayTeamId: awayCompetitor.team.id,
    homeTeamId: homeCompetitor.team.id,
    status,
    internalStats,
  };
}

/**
 * Maps ESPN scoreboard response to array of Games
 */
export function mapScoreboardToGames(response: ESPNScoreboardResponse): Game[] {
  console.log('[ESPN Mapper] Processing scoreboard:', {
    eventCount: response.events?.length || 0,
    season: response.season,
  });

  if (!response.events || response.events.length === 0) {
    console.log('[ESPN Mapper] No events found in response');
    return [];
  }

  const games = response.events.map(event => {
    try {
      return mapGame(event);
    } catch (error) {
      console.error(`[ESPN Mapper] Failed to map event ${event.id}:`, error);
      return null;
    }
  }).filter((game): game is Game => game !== null);

  console.log('[ESPN Mapper] Mapped games:', {
    count: games.length,
    gameIds: games.map(g => g.id),
  });

  return games;
}

/**
 * Maps ESPN event to canonical GameDetails
 */
export function mapGameDetails(event: ESPNEvent): GameDetails {
  const game = mapGame(event);
  const competition = event.competitions[0];

  const homeCompetitor = competition.competitors.find(c => c.homeAway === 'home')!;
  const awayCompetitor = competition.competitors.find(c => c.homeAway === 'away')!;

  // Extract players from leaders if available
  const players: Player[] = [];
  if (competition.leaders) {
    for (const leaderCategory of competition.leaders) {
      for (const leader of leaderCategory.leaders) {
        const playerId = leader.athlete.id;
        
        // Avoid duplicates
        if (!players.find(p => p.id === playerId)) {
          players.push({
            id: playerId,
            firstName: leader.athlete.fullName.split(' ')[0] || '',
            lastName: leader.athlete.fullName.split(' ').slice(1).join(' ') || '',
            fullName: leader.athlete.fullName,
            teamId: leader.athlete.team.id,
            position: leader.athlete.position?.abbreviation,
            jerseyNumber: leader.athlete.jersey,
          });
        }
      }
    }
  }

  return {
    ...game,
    awayTeam: mapTeam(awayCompetitor.team),
    homeTeam: mapTeam(homeCompetitor.team),
    participants: players,
  };
}

/**
 * Calculate internal stats from ESPN competition data
 * These stats are used for ranking but NEVER displayed to users
 */
function calculateInternalStats(
  competition: ESPNCompetition,
  status: 'scheduled' | 'in_progress' | 'final'
): InternalGameStats {
  const internalStats: InternalGameStats = {
    quarterScores: [],
  };

  // Only calculate for finished or in-progress games
  if (status === 'scheduled') {
    return internalStats;
  }

  const homeCompetitor = competition.competitors.find(c => c.homeAway === 'home');
  const awayCompetitor = competition.competitors.find(c => c.homeAway === 'away');

  if (!homeCompetitor || !awayCompetitor) {
    return internalStats;
  }

  // Parse scores
  const homeScore = parseInt(homeCompetitor.score, 10) || 0;
  const awayScore = parseInt(awayCompetitor.score, 10) || 0;

  // Calculate final margin and total points
  internalStats.finalMargin = Math.abs(homeScore - awayScore);
  internalStats.totalPoints = homeScore + awayScore;

  // Extract quarter scores from linescores
  if (homeCompetitor.linescores && awayCompetitor.linescores) {
    const quarterScores: QuarterScore[] = [];
    
    const numPeriods = Math.min(
      homeCompetitor.linescores.length,
      awayCompetitor.linescores.length
    );

    for (let i = 0; i < numPeriods; i++) {
      quarterScores.push({
        period: i + 1,
        homeScore: homeCompetitor.linescores[i].value,
        awayScore: awayCompetitor.linescores[i].value,
      });
    }

    internalStats.quarterScores = quarterScores;

    // Calculate lead changes and ties from quarter scores
    if (quarterScores.length > 0) {
      const { leadChanges, ties } = calculateLeadChangesAndTies(quarterScores);
      internalStats.leadChanges = leadChanges;
      internalStats.tiesCount = ties;
    }
  }

  return internalStats;
}

/**
 * Calculate lead changes and ties from quarter scores
 */
function calculateLeadChangesAndTies(quarterScores: QuarterScore[]): {
  leadChanges: number;
  ties: number;
} {
  let homeTotal = 0;
  let awayTotal = 0;
  let leadChanges = 0;
  let ties = 0;
  let currentLeader: 'home' | 'away' | 'tied' = 'tied';

  for (const quarter of quarterScores) {
    homeTotal += quarter.homeScore;
    awayTotal += quarter.awayScore;

    let newLeader: 'home' | 'away' | 'tied';
    if (homeTotal > awayTotal) {
      newLeader = 'home';
    } else if (awayTotal > homeTotal) {
      newLeader = 'away';
    } else {
      newLeader = 'tied';
      ties++;
    }

    // Count lead change if leader changed and wasn't tied before
    if (newLeader !== currentLeader && currentLeader !== 'tied' && newLeader !== 'tied') {
      leadChanges++;
    }

    currentLeader = newLeader;
  }

  return { leadChanges, ties };
}

