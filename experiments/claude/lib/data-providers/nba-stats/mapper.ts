/**
 * NBA Stats API to Canonical Schema Mapper
 *
 * Converts NBA Stats API tabular format to our internal canonical schema
 */

import type {
  Team,
  Player,
  Game,
  GameDetails,
  InternalGameStats,
  QuarterScore,
} from '../types';
import type { NBAStatsResponse } from './client';

/**
 * Helper: Convert NBA Stats API row to object using headers
 */
function rowToObject<T = any>(headers: string[], row: any[]): T {
  const obj: any = {};
  headers.forEach((header, index) => {
    obj[header] = row[index];
  });
  return obj as T;
}

/**
 * Maps NBA Stats team to canonical Team
 */
export function mapTeam(teamData: any): Team {
  return {
    id: teamData.TEAM_ID?.toString() || teamData.TeamID?.toString(),
    name: teamData.NICKNAME || teamData.TEAM_NAME || teamData.TeamName,
    abbreviation: teamData.ABBREVIATION || teamData.TeamAbbreviation,
    city: teamData.CITY || teamData.TeamCity || '',
    conference: (teamData.CONFERENCE || 'East') as 'East' | 'West',
    division: teamData.DIVISION || '',
    fullName: `${teamData.CITY || ''} ${teamData.NICKNAME || teamData.TEAM_NAME || ''}`.trim(),
  };
}

/**
 * Maps NBA Stats player to canonical Player
 */
export function mapPlayer(playerData: any): Player {
  const firstName = playerData.PLAYER_FIRST_NAME || playerData.PLAYER?.split(' ')[0] || '';
  const lastName = playerData.PLAYER_LAST_NAME || playerData.PLAYER?.split(' ').slice(1).join(' ') || '';

  return {
    id: playerData.PLAYER_ID?.toString(),
    firstName,
    lastName,
    fullName: playerData.PLAYER || `${firstName} ${lastName}`.trim(),
    teamId: playerData.TEAM_ID?.toString() || '',
    position: playerData.POSITION || playerData.POS,
    jerseyNumber: playerData.NUM || playerData.JERSEY_NUMBER,
  };
}

/**
 * Maps NBA Stats scoreboard game to canonical Game
 */
export function mapGameFromScoreboard(
  gameData: any,
  lineScore?: any[]
): Game {
  // Determine status
  let status: 'scheduled' | 'in_progress' | 'final';
  const gameStatus = gameData.GAME_STATUS_TEXT || gameData.GameStatusText || '';

  if (gameStatus.includes('Final') || gameData.GAME_STATUS_ID === 3) {
    status = 'final';
  } else if (gameStatus.includes('PM') || gameStatus.includes('AM')) {
    status = 'scheduled';
  } else {
    status = 'in_progress';
  }

  // Parse game ID
  const gameId = gameData.GAME_ID || gameData.GameID;

  // Parse date
  const gameDate = new Date(gameData.GAME_DATE_EST || gameData.GAME_DATE || gameData.GameDate);

  // Calculate internal stats
  const internalStats = calculateInternalStatsFromLineScore(
    lineScore,
    gameData.HOME_TEAM_ID,
    gameData.VISITOR_TEAM_ID
  );

  return {
    id: gameId?.toString(),
    startTime: gameDate,
    finalTime: status === 'final' ? gameDate : null,
    awayTeamId: (gameData.VISITOR_TEAM_ID || gameData.AwayTeamID)?.toString(),
    homeTeamId: (gameData.HOME_TEAM_ID || gameData.HomeTeamID)?.toString(),
    status,
    internalStats,
  };
}

/**
 * Calculate internal stats from line score data
 * Line score includes quarter-by-quarter scores
 */
function calculateInternalStatsFromLineScore(
  lineScore: any[] | undefined,
  homeTeamId: number,
  visitorTeamId: number
): InternalGameStats {
  const stats: InternalGameStats = {
    quarterScores: [],
  };

  if (!lineScore || lineScore.length === 0) {
    return stats;
  }

  // Find home and visitor team data
  const homeData = lineScore.find((ls: any) => ls.TEAM_ID === homeTeamId);
  const visitorData = lineScore.find((ls: any) => ls.TEAM_ID === visitorTeamId);

  if (!homeData || !visitorData) {
    return stats;
  }

  // Extract quarter scores
  const quarters: QuarterScore[] = [];
  for (let i = 1; i <= 4; i++) {
    const homePts = homeData[`PTS_QTR${i}`];
    const visitorPts = visitorData[`PTS_QTR${i}`];

    if (homePts !== null && visitorPts !== null) {
      quarters.push({
        period: i,
        homeScore: homePts,
        awayScore: visitorPts,
      });
    }
  }

  stats.quarterScores = quarters;

  // Calculate final scores and margin
  const homeFinal = homeData.PTS || 0;
  const visitorFinal = visitorData.PTS || 0;

  stats.totalPoints = homeFinal + visitorFinal;
  stats.finalMargin = Math.abs(homeFinal - visitorFinal);

  // Calculate lead changes and ties from quarter scores
  if (quarters.length > 0) {
    let homeTotal = 0;
    let visitorTotal = 0;
    let leadChanges = 0;
    let ties = 0;
    let currentLeader: 'home' | 'visitor' | 'tied' = 'tied';

    for (const quarter of quarters) {
      homeTotal += quarter.homeScore;
      visitorTotal += quarter.awayScore;

      let newLeader: 'home' | 'visitor' | 'tied';
      if (homeTotal > visitorTotal) {
        newLeader = 'home';
      } else if (visitorTotal > homeTotal) {
        newLeader = 'visitor';
      } else {
        newLeader = 'tied';
        ties++;
      }

      if (newLeader !== currentLeader && currentLeader !== 'tied') {
        leadChanges++;
      }

      currentLeader = newLeader;
    }

    stats.leadChanges = leadChanges;
    stats.tiesCount = ties;
  }

  return stats;
}

/**
 * Maps scoreboard response to games
 */
export function mapScoreboardToGames(response: NBAStatsResponse): Game[] {
  const games: Game[] = [];

  // Find GameHeader and LineScore result sets
  const gameHeaderSet = response.resultSets.find(rs => rs.name === 'GameHeader');
  const lineScoreSet = response.resultSets.find(rs => rs.name === 'LineScore');

  console.log('[mapScoreboardToGames] Processing response:', {
    resultSets: response.resultSets.map(rs => rs.name),
    hasGameHeader: !!gameHeaderSet,
    gameHeaderRowCount: gameHeaderSet?.rowSet.length || 0,
  });

  if (!gameHeaderSet) {
    console.log('[mapScoreboardToGames] No GameHeader found in response');
    return games;
  }

  // Parse line scores
  const lineScores = lineScoreSet
    ? lineScoreSet.rowSet.map(row => rowToObject(lineScoreSet.headers, row))
    : [];

  // Parse games
  for (const row of gameHeaderSet.rowSet) {
    const gameData = rowToObject(gameHeaderSet.headers, row);

    console.log('[mapScoreboardToGames] Processing game:', {
      gameId: gameData.GAME_ID,
      statusText: gameData.GAME_STATUS_TEXT,
      statusId: gameData.GAME_STATUS_ID,
      homeTeam: gameData.HOME_TEAM_ID,
      awayTeam: gameData.VISITOR_TEAM_ID,
    });

    // Get line scores for this game
    const gameLineScores = lineScores.filter(
      (ls: any) => ls.GAME_ID === gameData.GAME_ID
    );

    const game = mapGameFromScoreboard(gameData, gameLineScores);
    
    console.log('[mapScoreboardToGames] Mapped game:', {
      gameId: game.id,
      status: game.status,
      startTime: game.startTime,
    });
    
    games.push(game);
  }

  console.log('[mapScoreboardToGames] Total games mapped:', games.length);
  return games;
}

/**
 * Maps box score response to GameDetails
 */
export function mapBoxScoreToGameDetails(
  game: Game,
  boxScoreResponse: NBAStatsResponse
): GameDetails {
  // Find team stats
  const teamStatsSet = boxScoreResponse.resultSets.find(
    rs => rs.name === 'TeamStats' || rs.name === 'TeamStarterBenchStats'
  );

  const playerStatsSet = boxScoreResponse.resultSets.find(
    rs => rs.name === 'PlayerStats'
  );

  // Parse teams
  let awayTeam: Team | undefined;
  let homeTeam: Team | undefined;

  if (teamStatsSet) {
    const teamStats = teamStatsSet.rowSet.map(row =>
      rowToObject(teamStatsSet.headers, row)
    );

    awayTeam = mapTeam(teamStats[0]);
    homeTeam = mapTeam(teamStats[1]);
  }

  // Parse players
  const players: Player[] = [];
  if (playerStatsSet) {
    for (const row of playerStatsSet.rowSet) {
      const playerData = rowToObject(playerStatsSet.headers, row);
      if (playerData.PLAYER_ID) {
        players.push(mapPlayer(playerData));
      }
    }
  }

  return {
    ...game,
    awayTeam: awayTeam || {
      id: game.awayTeamId,
      name: '',
      abbreviation: '',
      city: '',
      conference: 'East',
      division: '',
      fullName: '',
    },
    homeTeam: homeTeam || {
      id: game.homeTeamId,
      name: '',
      abbreviation: '',
      city: '',
      conference: 'East',
      division: '',
      fullName: '',
    },
    participants: players,
  };
}
