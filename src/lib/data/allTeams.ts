import { Team } from "@/types/schema";

export const ALL_TEAMS: Team[] = [
    { id: 1, abbreviation: 'ATL', city: 'Atlanta', conference: 'East', division: 'Southeast', full_name: 'Atlanta Hawks', name: 'Hawks', logoUrl: 'https://a.espncdn.com/i/teamlogos/nba/500/atl.png', colors: { primary: '#E03A3E', secondary: '#C1D32F' } },
    { id: 2, abbreviation: 'BOS', city: 'Boston', conference: 'East', division: 'Atlantic', full_name: 'Boston Celtics', name: 'Celtics', logoUrl: 'https://a.espncdn.com/i/teamlogos/nba/500/bos.png', colors: { primary: '#007A33', secondary: '#BA9653' } },
    { id: 3, abbreviation: 'BKN', city: 'Brooklyn', conference: 'East', division: 'Atlantic', full_name: 'Brooklyn Nets', name: 'Nets', logoUrl: 'https://a.espncdn.com/i/teamlogos/nba/500/bkn.png', colors: { primary: '#000000', secondary: '#FFFFFF' } },
    { id: 4, abbreviation: 'CHA', city: 'Charlotte', conference: 'East', division: 'Southeast', full_name: 'Charlotte Hornets', name: 'Hornets', logoUrl: 'https://a.espncdn.com/i/teamlogos/nba/500/cha.png', colors: { primary: '#1D1160', secondary: '#00788C' } },
    { id: 5, abbreviation: 'CHI', city: 'Chicago', conference: 'East', division: 'Central', full_name: 'Chicago Bulls', name: 'Bulls', logoUrl: 'https://a.espncdn.com/i/teamlogos/nba/500/chi.png', colors: { primary: '#CE1141', secondary: '#000000' } },
    { id: 6, abbreviation: 'CLE', city: 'Cleveland', conference: 'East', division: 'Central', full_name: 'Cleveland Cavaliers', name: 'Cavaliers', logoUrl: 'https://a.espncdn.com/i/teamlogos/nba/500/cle.png', colors: { primary: '#860038', secondary: '#FDBB30' } },
    { id: 7, abbreviation: 'DAL', city: 'Dallas', conference: 'West', division: 'Southwest', full_name: 'Dallas Mavericks', name: 'Mavericks', logoUrl: 'https://a.espncdn.com/i/teamlogos/nba/500/dal.png', colors: { primary: '#00538C', secondary: '#B8C4CA' } },
    { id: 8, abbreviation: 'DEN', city: 'Denver', conference: 'West', division: 'Northwest', full_name: 'Denver Nuggets', name: 'Nuggets', logoUrl: 'https://a.espncdn.com/i/teamlogos/nba/500/den.png', colors: { primary: '#0E2240', secondary: '#FEC524' } },
    { id: 9, abbreviation: 'DET', city: 'Detroit', conference: 'East', division: 'Central', full_name: 'Detroit Pistons', name: 'Pistons', logoUrl: 'https://a.espncdn.com/i/teamlogos/nba/500/det.png', colors: { primary: '#C8102E', secondary: '#1D428A' } },
    { id: 10, abbreviation: 'GSW', city: 'Golden State', conference: 'West', division: 'Pacific', full_name: 'Golden State Warriors', name: 'Warriors', logoUrl: 'https://a.espncdn.com/i/teamlogos/nba/500/gsw.png', colors: { primary: '#1D428A', secondary: '#FFC72C' } },
    { id: 11, abbreviation: 'HOU', city: 'Houston', conference: 'West', division: 'Southwest', full_name: 'Houston Rockets', name: 'Rockets', logoUrl: 'https://a.espncdn.com/i/teamlogos/nba/500/hou.png', colors: { primary: '#CE1141', secondary: '#000000' } },
    { id: 12, abbreviation: 'IND', city: 'Indiana', conference: 'East', division: 'Central', full_name: 'Indiana Pacers', name: 'Pacers', logoUrl: 'https://a.espncdn.com/i/teamlogos/nba/500/ind.png', colors: { primary: '#002D62', secondary: '#FDBB30' } },
    { id: 13, abbreviation: 'LAC', city: 'Los Angeles', conference: 'West', division: 'Pacific', full_name: 'LA Clippers', name: 'Clippers', logoUrl: 'https://a.espncdn.com/i/teamlogos/nba/500/lac.png', colors: { primary: '#C8102E', secondary: '#1D428A' } },
    { id: 14, abbreviation: 'LAL', city: 'Los Angeles', conference: 'West', division: 'Pacific', full_name: 'Los Angeles Lakers', name: 'Lakers', logoUrl: 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png', colors: { primary: '#552583', secondary: '#FDB927' } },
    { id: 15, abbreviation: 'MEM', city: 'Memphis', conference: 'West', division: 'Southwest', full_name: 'Memphis Grizzlies', name: 'Grizzlies', logoUrl: 'https://a.espncdn.com/i/teamlogos/nba/500/mem.png', colors: { primary: '#5D76A9', secondary: '#12173F' } },
    { id: 16, abbreviation: 'MIA', city: 'Miami', conference: 'East', division: 'Southeast', full_name: 'Miami Heat', name: 'Heat', logoUrl: 'https://a.espncdn.com/i/teamlogos/nba/500/mia.png', colors: { primary: '#98002E', secondary: '#F9A01B' } },
    { id: 17, abbreviation: 'MIL', city: 'Milwaukee', conference: 'East', division: 'Central', full_name: 'Milwaukee Bucks', name: 'Bucks', logoUrl: 'https://a.espncdn.com/i/teamlogos/nba/500/mil.png', colors: { primary: '#00471B', secondary: '#EEE1C6' } },
    { id: 18, abbreviation: 'MIN', city: 'Minnesota', conference: 'West', division: 'Northwest', full_name: 'Minnesota Timberwolves', name: 'Timberwolves', logoUrl: 'https://a.espncdn.com/i/teamlogos/nba/500/min.png', colors: { primary: '#0C2340', secondary: '#236192' } },
    { id: 19, abbreviation: 'NOP', city: 'New Orleans', conference: 'West', division: 'Southwest', full_name: 'New Orleans Pelicans', name: 'Pelicans', logoUrl: 'https://a.espncdn.com/i/teamlogos/nba/500/no.png', colors: { primary: '#0C2340', secondary: '#C8102E' } },
    { id: 20, abbreviation: 'NYK', city: 'New York', conference: 'East', division: 'Atlantic', full_name: 'New York Knicks', name: 'Knicks', logoUrl: 'https://a.espncdn.com/i/teamlogos/nba/500/nyk.png', colors: { primary: '#006BB6', secondary: '#F58426' } },
    { id: 21, abbreviation: 'OKC', city: 'Oklahoma City', conference: 'West', division: 'Northwest', full_name: 'Oklahoma City Thunder', name: 'Thunder', logoUrl: 'https://a.espncdn.com/i/teamlogos/nba/500/okc.png', colors: { primary: '#007AC1', secondary: '#EF3B24' } },
    { id: 22, abbreviation: 'ORL', city: 'Orlando', conference: 'East', division: 'Southeast', full_name: 'Orlando Magic', name: 'Magic', logoUrl: 'https://a.espncdn.com/i/teamlogos/nba/500/orl.png', colors: { primary: '#0077C0', secondary: '#C4CED4' } },
    { id: 23, abbreviation: 'PHI', city: 'Philadelphia', conference: 'East', division: 'Atlantic', full_name: 'Philadelphia 76ers', name: '76ers', logoUrl: 'https://a.espncdn.com/i/teamlogos/nba/500/phi.png', colors: { primary: '#006BB6', secondary: '#ED174C' } },
    { id: 24, abbreviation: 'PHX', city: 'Phoenix', conference: 'West', division: 'Pacific', full_name: 'Phoenix Suns', name: 'Suns', logoUrl: 'https://a.espncdn.com/i/teamlogos/nba/500/phx.png', colors: { primary: '#1D1160', secondary: '#E56020' } },
    { id: 25, abbreviation: 'POR', city: 'Portland', conference: 'West', division: 'Northwest', full_name: 'Portland Trail Blazers', name: 'Trail Blazers', logoUrl: 'https://a.espncdn.com/i/teamlogos/nba/500/por.png', colors: { primary: '#E03A3E', secondary: '#000000' } },
    { id: 26, abbreviation: 'SAC', city: 'Sacramento', conference: 'West', division: 'Pacific', full_name: 'Sacramento Kings', name: 'Kings', logoUrl: 'https://a.espncdn.com/i/teamlogos/nba/500/sac.png', colors: { primary: '#5A2D81', secondary: '#63727A' } },
    { id: 27, abbreviation: 'SAS', city: 'San Antonio', conference: 'West', division: 'Southwest', full_name: 'San Antonio Spurs', name: 'Spurs', logoUrl: 'https://a.espncdn.com/i/teamlogos/nba/500/sas.png', colors: { primary: '#C4CED4', secondary: '#000000' } },
    { id: 28, abbreviation: 'TOR', city: 'Toronto', conference: 'East', division: 'Atlantic', full_name: 'Toronto Raptors', name: 'Raptors', logoUrl: 'https://a.espncdn.com/i/teamlogos/nba/500/tor.png', colors: { primary: '#CE1141', secondary: '#000000' } },
    { id: 29, abbreviation: 'UTA', city: 'Utah', conference: 'West', division: 'Northwest', full_name: 'Utah Jazz', name: 'Jazz', logoUrl: 'https://a.espncdn.com/i/teamlogos/nba/500/utah.png', colors: { primary: '#002B5C', secondary: '#F9A01B' } },
    { id: 30, abbreviation: 'WAS', city: 'Washington', conference: 'East', division: 'Southeast', full_name: 'Washington Wizards', name: 'Wizards', logoUrl: 'https://a.espncdn.com/i/teamlogos/nba/500/was.png', colors: { primary: '#002B5C', secondary: '#E31837' } },
];

export const TEAM_STANDINGS_2024 = {
    21: 68, // OKC
    6: 64, // CLE
    2: 61, // BOS
    11: 52, // HOU
    20: 51, // NYK
    8: 50, // DEN
    12: 50, // IND
    13: 50, // LAC
    14: 50, // LAL
    18: 49, // MIN
    10: 48, // GSW
    15: 48, // MEM
    17: 48, // MIL
    23: 47, // PHI
    9: 44, // DET
    22: 41, // ORL
    1: 40, // ATL
    26: 40, // SAC
    5: 39, // CHI
    7: 39, // DAL
    16: 37, // MIA
    24: 36, // PHX
    25: 36, // POR
    27: 34, // SAS
    3: 32, // BKN
    28: 30, // TOR
    29: 28, // UTA
    4: 21, // CHA
    19: 21, // NOP
    30: 15, // WAS
};
