/**
 * Team Hierarchy Utilities
 * 
 * Calculates final league rankings from hierarchical structure:
 * Conference (1-2) → Division (1-3 per conference) → Team (1-5 per division)
 */

export interface ConferenceRanking {
  name: 'East' | 'West';
  rank: number; // 1-2
}

export interface DivisionRanking {
  name: string;
  conference: 'East' | 'West';
  rank: number; // 1-3 within conference
}

export interface TeamRanking {
  teamId: string;
  teamName: string;
  division: string;
  conference: 'East' | 'West';
  rank: number; // 1-5 within division
}

/**
 * Calculate final league rank (1-30) from hierarchical position
 */
export function calculateLeagueRank(
  team: TeamRanking,
  conferenceRanking: ConferenceRanking[],
  divisionRankings: Record<string, Array<{ name: string; rank: number }>>
): number {
  // Find conference rank (1 or 2)
  const confRank = conferenceRanking.find(c => c.name === team.conference)?.rank ?? 2;
  
  // Find division rank within conference (1-3)
  const divRanks = divisionRankings[team.conference] ?? [];
  const divRank = divRanks.find(d => d.name === team.division)?.rank ?? 3;
  
  // Team rank within division (1-5)
  const teamRank = team.rank;
  
  // Calculate final position:
  // Conference offset: (confRank - 1) * 15 = 0 or 15
  // Division offset: (divRank - 1) * 5 = 0, 5, or 10
  // Team position: teamRank = 1-5
  const finalRank = ((confRank - 1) * 15) + ((divRank - 1) * 5) + teamRank;
  
  return finalRank;
}

/**
 * Get conference logo URL
 */
export function getConferenceLogo(conference: 'East' | 'West'): string {
  // Using ESPN All-Star logos
  if (conference === 'East') {
    return 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/nba.png&h=200&w=200';
  }
  return 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/nba.png&h=200&w=200';
}

/**
 * Get division badge/icon
 */
export function getDivisionBadge(division: string, conference: 'East' | 'West'): string {
  // For now, return a color-coded emoji or initial
  const badges: Record<string, string> = {
    'Atlantic': '🌊',
    'Central': '⭐',
    'Southeast': '☀️',
    'Pacific': '🌅',
    'Northwest': '🏔️',
    'Southwest': '🌵',
  };
  
  return badges[division] ?? '🏀';
}

/**
 * Get division color for UI
 */
export function getDivisionColor(division: string): string {
  const colors: Record<string, string> = {
    'Atlantic': 'blue',
    'Central': 'red',
    'Southeast': 'orange',
    'Pacific': 'purple',
    'Northwest': 'green',
    'Southwest': 'yellow',
  };
  
  return colors[division] ?? 'gray';
}





