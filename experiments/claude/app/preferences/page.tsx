'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserProfile } from '@/lib/schemas/profile';
import { loadProfile, saveProfile } from '@/lib/storage/profile-storage';
import { calculateLeagueRank, getDivisionBadge } from '@/lib/utils/team-hierarchy';

export default function PreferencesPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'teams' | 'players' | 'style'>('teams');

  useEffect(() => {
    setProfile(loadProfile());
  }, []);

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-2xl">Loading preferences...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Preferences
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Fine-tune the watchability algorithm to match your taste
              </p>
            </div>
            <Link
              href="/"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('teams')}
              className={`border-b-2 px-1 py-4 text-sm font-medium ${
                activeTab === 'teams'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              Teams
            </button>
            <button
              onClick={() => setActiveTab('players')}
              className={`border-b-2 px-1 py-4 text-sm font-medium ${
                activeTab === 'players'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              Players
            </button>
            <button
              onClick={() => setActiveTab('style')}
              className={`border-b-2 px-1 py-4 text-sm font-medium ${
                activeTab === 'style'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              Style
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {activeTab === 'teams' && <TeamsTab profile={profile} setProfile={setProfile} />}
        {activeTab === 'players' && <PlayersTab profile={profile} setProfile={setProfile} />}
        {activeTab === 'style' && <StyleTab profile={profile} setProfile={setProfile} />}
      </main>
    </div>
  );
}

function TeamsTab({
  profile,
  setProfile,
}: {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
}) {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rankings, setRankings] = useState<any[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [view, setView] = useState<'league' | 'conference' | 'division' | 'hierarchy'>('hierarchy');
  const [selectedConference, setSelectedConference] = useState<'East' | 'West'>('East');
  const [selectedDivision, setSelectedDivision] = useState<string>('Atlantic');
  
  // Hierarchical structure
  const [conferenceRankings, setConferenceRankings] = useState<Array<{name: 'East' | 'West', rank: number}>>([
    { name: 'West', rank: 1 },
    { name: 'East', rank: 2 },
  ]);
  
  const [divisionRankings, setDivisionRankings] = useState<Record<string, Array<{name: string, rank: number}>>>({
    West: [
      { name: 'Pacific', rank: 1 },
      { name: 'Northwest', rank: 2 },
      { name: 'Southwest', rank: 3 },
    ],
    East: [
      { name: 'Atlantic', rank: 1 },
      { name: 'Central', rank: 2 },
      { name: 'Southeast', rank: 3 },
    ],
  });

  // Load teams on mount
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch('/api/teams');
        const data = await response.json();
        
        if (data.teams) {
          // Initialize rankings from profile or use default order
          if (profile.teamRankings && profile.teamRankings.length === 30) {
            // Use existing rankings
            const rankedTeams = profile.teamRankings
              .sort((a, b) => a.rank - b.rank)
              .map(ranking => {
                const team = data.teams.find((t: any) => t.id === ranking.teamId);
                return { ...team, rank: ranking.rank };
              });
            setRankings(rankedTeams);
          } else {
            // Default: assign rank within division (1-5)
            const defaultRankings = data.teams.map((team: any) => {
              // Count how many teams from same division we've seen
              const sameDiv = data.teams.filter((t: any) => 
                t.division === team.division && 
                data.teams.indexOf(t) <= data.teams.indexOf(team)
              );
              return {
                ...team,
                rank: sameDiv.length, // Rank within division
              };
            });
            setRankings(defaultRankings);
          }
          setTeams(data.teams);
        }
      } catch (error) {
        console.error('Failed to fetch teams:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [profile.teamRankings]);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === index) return;

    const newRankings = [...rankings];
    const draggedItem = newRankings[draggedIndex];
    
    // Remove dragged item
    newRankings.splice(draggedIndex, 1);
    // Insert at new position
    newRankings.splice(index, 0, draggedItem);
    
    // Update ranks
    const updatedRankings = newRankings.map((team, idx) => ({
      ...team,
      rank: idx + 1,
    }));
    
    setRankings(updatedRankings);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    
    // Save to profile
    const teamRankings = rankings.map(team => ({
      teamId: team.id,
      teamName: `${team.city} ${team.name}`,
      rank: team.rank,
    }));
    
    const updated = {
      ...profile,
      teamRankings,
      favoriteTeam: teamRankings[0].teamId,
    };
    
    setProfile(updated);
    saveProfile(updated);
  };

  // Filter teams based on current view
  const getFilteredTeams = () => {
    if (view === 'league') {
      return rankings;
    } else if (view === 'conference') {
      return rankings.filter(team => team.conference === selectedConference);
    } else {
      return rankings.filter(team => team.division === selectedDivision);
    }
  };

  const filteredTeams = getFilteredTeams();

  // Get unique divisions for dropdown
  const divisions = ['Atlantic', 'Central', 'Southeast', 'Northwest', 'Pacific', 'Southwest'];

  if (loading) {
    return (
      <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-950">
        <div className="text-center py-12">
          <div className="text-lg text-gray-600 dark:text-gray-400">
            Loading teams...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-950">
      <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
        Team Rankings
      </h2>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Drag and drop to rank teams from your favorite (#1) to least favorite (#30).
        <br />
        <span className="font-medium text-amber-600 dark:text-amber-400">
          Note: This is a tiebreaker only - objective game quality always comes first.
        </span>
      </p>

      {/* View toggle buttons */}
      <div className="mb-6 flex flex-wrap gap-3">
        <div className="flex gap-2">
          <button
            onClick={() => setView('hierarchy')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              view === 'hierarchy'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            🏗️ Hierarchy
          </button>
          <button
            onClick={() => setView('league')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              view === 'league'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            League (30)
          </button>
          <button
            onClick={() => setView('conference')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              view === 'conference'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Conference (15)
          </button>
          <button
            onClick={() => setView('division')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              view === 'division'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Division (5)
          </button>
        </div>

        {/* Conference selector */}
        {view === 'conference' && (
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedConference('East')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedConference === 'East'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Eastern
            </button>
            <button
              onClick={() => setSelectedConference('West')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedConference === 'West'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Western
            </button>
          </div>
        )}

        {/* Division selector */}
        {view === 'division' && (
          <select
            value={selectedDivision}
            onChange={(e) => setSelectedDivision(e.target.value)}
            className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-0 font-medium"
          >
            {divisions.map(div => (
              <option key={div} value={div}>{div}</option>
            ))}
          </select>
        )}
      </div>

      {/* Info box */}
      <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          💡 <strong>How it works:</strong> Your #1 team gets +15 points, #2-5 get +10-12, and so on. 
          Even your favorite team's blowout won't beat an exciting game.
        </p>
      </div>

      {/* Hierarchical View */}
      {view === 'hierarchy' && (
        <HierarchicalRankings 
          teams={rankings}
          conferenceRankings={conferenceRankings}
          divisionRankings={divisionRankings}
          setConferenceRankings={setConferenceRankings}
          setDivisionRankings={setDivisionRankings}
          setTeams={setRankings}
          profile={profile}
          setProfile={setProfile}
        />
      )}

      {/* Drag and drop list - flat views */}
      {view !== 'hierarchy' && (
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {filteredTeams.map((team, index) => (
          <div
            key={team.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all cursor-move ${
              draggedIndex === index
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 opacity-50 scale-105'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300 hover:shadow-md'
            }`}
          >
            {/* Rank */}
            <div className="flex-shrink-0 w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-gray-700 dark:text-gray-300">
                {team.rank}
              </span>
            </div>

            {/* Team info */}
            <div className="flex-1">
              <div className="font-semibold text-gray-900 dark:text-white">
                {team.city} {team.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {team.abbreviation} • {team.conference} • {team.division}
              </div>
            </div>

            {/* Drag handle */}
            <div className="flex-shrink-0 text-gray-400">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 5h2v2H9V5zm0 4h2v2H9V9zm0 4h2v2H9v-2zm0 4h2v2H9v-2zm4-12h2v2h-2V5zm0 4h2v2h-2V9zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2z"/>
              </svg>
            </div>
          </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Hierarchical Rankings Component
function HierarchicalRankings({
  teams,
  conferenceRankings,
  divisionRankings,
  setConferenceRankings,
  setDivisionRankings,
  setTeams,
  profile,
  setProfile,
}: {
  teams: any[];
  conferenceRankings: Array<{name: 'East' | 'West', rank: number}>;
  divisionRankings: Record<string, Array<{name: string, rank: number}>>;
  setConferenceRankings: (rankings: Array<{name: 'East' | 'West', rank: number}>) => void;
  setDivisionRankings: (rankings: Record<string, Array<{name: string, rank: number}>>) => void;
  setTeams: (teams: any[]) => void;
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
}) {
  const [expandedConferences, setExpandedConferences] = useState<Set<string>>(new Set(['West', 'East']));
  const [expandedDivisions, setExpandedDivisions] = useState<Set<string>>(new Set());

  const toggleConference = (conf: string) => {
    const newExpanded = new Set(expandedConferences);
    if (newExpanded.has(conf)) {
      newExpanded.delete(conf);
    } else {
      newExpanded.add(conf);
    }
    setExpandedConferences(newExpanded);
  };

  const toggleDivision = (div: string) => {
    const newExpanded = new Set(expandedDivisions);
    if (newExpanded.has(div)) {
      newExpanded.delete(div);
    } else {
      newExpanded.add(div);
    }
    setExpandedDivisions(newExpanded);
  };

  // Swap conferences
  const swapConferences = () => {
    const swapped = conferenceRankings.map(c => ({
      ...c,
      rank: c.rank === 1 ? 2 : 1,
    }));
    setConferenceRankings(swapped);
    saveHierarchy(swapped, divisionRankings, teams);
  };

  const saveHierarchy = (confRanks: any[], divRanks: any, teamList: any[]) => {
    // Calculate final rankings and save to profile
    const finalRankings = teamList.map(team => {
      const rank = calculateLeagueRank(
        { teamId: team.id, teamName: team.fullName, division: team.division, conference: team.conference, rank: team.rank },
        confRanks,
        divRanks
      );
      return {
        teamId: team.id,
        teamName: `${team.city} ${team.name}`,
        rank,
      };
    });

    const updated = {
      ...profile,
      teamRankings: finalRankings,
      favoriteTeam: finalRankings.find(t => t.rank === 1)?.teamId,
    };
    
    setProfile(updated);
    saveProfile(updated);
  };

  return (
    <div className="space-y-4">
      {/* Instructions */}
      <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-900 dark:bg-purple-950">
        <p className="text-sm text-purple-800 dark:text-purple-200">
          🏗️ <strong>Hierarchical Ranking:</strong> Click conferences to swap their order (1-2). 
          Expand to see divisions (1-3 per conference) and teams (1-5 per division). 
          Your final league rank auto-calculates from the hierarchy!
        </p>
      </div>

      {/* Conference Level */}
      {conferenceRankings.sort((a, b) => a.rank - b.rank).map((conf) => {
        const confTeams = teams.filter(t => t.conference === conf.name);
        const divs = divisionRankings[conf.name] || [];
        const isExpanded = expandedConferences.has(conf.name);
        
        return (
          <div key={conf.name} className="border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            {/* Conference Header */}
            <div 
              className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => toggleConference(conf.name)}
            >
              <div className="flex-shrink-0 w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-xl">
                {conf.rank}
              </div>
              
              <div className="flex-1">
                <div className="font-bold text-lg text-gray-900 dark:text-white">
                  {conf.name}ern Conference
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {confTeams.length} teams • Ranks {(conf.rank - 1) * 15 + 1}-{conf.rank * 15}
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  swapConferences();
                }}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm font-medium"
              >
                Swap ↕️
              </button>

              <div className="text-gray-400">
                {isExpanded ? '▼' : '▶'}
              </div>
            </div>

            {/* Divisions (when expanded) */}
            {isExpanded && divs.sort((a, b) => a.rank - b.rank).map((div) => {
              const divTeams = confTeams.filter(t => t.division === div.name);
              const isDivExpanded = expandedDivisions.has(`${conf.name}-${div.name}`);
              const badge = getDivisionBadge(div.name, conf.name);
              
              return (
                <div key={div.name} className="ml-8 border-l-4 border-gray-300 dark:border-gray-600">
                  {/* Division Header */}
                  <div 
                    className="flex items-center gap-3 p-3 bg-white dark:bg-gray-950 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900"
                    onClick={() => toggleDivision(`${conf.name}-${div.name}`)}
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-sm font-bold">
                      {div.rank}
                    </div>
                    
                    <div className="text-2xl">{badge}</div>
                    
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {div.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {divTeams.length} teams
                      </div>
                    </div>

                    <div className="text-gray-400 text-sm">
                      {isDivExpanded ? '▼' : '▶'}
                    </div>
                  </div>

                  {/* Teams (when division expanded) */}
                  {isDivExpanded && divTeams.map((team) => {
                    const leagueRank = calculateLeagueRank(
                      { teamId: team.id, teamName: team.fullName, division: team.division, conference: team.conference, rank: team.rank },
                      conferenceRankings,
                      divisionRankings
                    );
                    
                    return (
                      <div key={team.id} className="ml-8 flex items-center gap-3 p-2 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex-shrink-0 w-6 h-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-xs font-bold">
                          {team.rank}
                        </div>
                        
                        {team.logo && (
                          <img src={team.logo} alt={team.name} className="w-8 h-8" />
                        )}
                        
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {team.city} {team.name}
                          </div>
                        </div>

                        <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                          #{leagueRank}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function PlayersTab({
  profile,
  setProfile,
}: {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
}) {
  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-950">
      <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
        Player Buckets
      </h2>
      <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
        Organize players into emotional buckets that affect game rankings:
      </p>

      <div className="space-y-4">
        {/* Must-See */}
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950">
          <h3 className="mb-2 font-medium text-green-900 dark:text-green-100">
            ⭐ Must-See TV
          </h3>
          <p className="mb-3 text-sm text-green-700 dark:text-green-300">
            Players you tune in on purpose. Games with notable performances get +15 points.
          </p>
          <div className="text-xs text-green-600 dark:text-green-400">
            Coming soon: Add your favorite players here
          </div>
        </div>

        {/* Hooper */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
          <h3 className="mb-2 font-medium text-blue-900 dark:text-blue-100">
            🏀 Hooper
          </h3>
          <p className="mb-3 text-sm text-blue-700 dark:text-blue-300">
            Players you respect and enjoy watching. Games with notable performances get +8 points.
          </p>
          <div className="text-xs text-blue-600 dark:text-blue-400">
            Coming soon: Add players you respect here
          </div>
        </div>

        {/* Villain */}
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
          <h3 className="mb-2 font-medium text-red-900 dark:text-red-100">
            😈 Villain
          </h3>
          <p className="mb-3 text-sm text-red-700 dark:text-red-300">
            Players you root against. Games featuring these players get -15 points, even if objectively good.
          </p>
          <div className="text-xs text-red-600 dark:text-red-400">
            Coming soon: Add players you dislike here
          </div>
        </div>

        {/* GOAT */}
        <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-900 dark:bg-purple-950">
          <h3 className="mb-2 font-medium text-purple-900 dark:text-purple-100">
            🐐 GOAT (Optional)
          </h3>
          <p className="mb-3 text-sm text-purple-700 dark:text-purple-300">
            Your all-time favorite. Games featuring this player get +20 points.
          </p>
          <div className="text-xs text-purple-600 dark:text-purple-400">
            Coming soon: Pick your GOAT
          </div>
        </div>
      </div>
    </div>
  );
}

function StyleTab({
  profile,
  setProfile,
}: {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
}) {
  const handleSliderChange = (key: keyof typeof profile.stylePreferences, value: number) => {
    const updated = {
      ...profile,
      stylePreferences: {
        ...profile.stylePreferences,
        [key]: value,
      },
    };
    setProfile(updated);
    saveProfile(updated);
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-950">
      <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
        Style Preferences
      </h2>
      <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
        Fine-tune what types of games you enjoy watching. These are tiebreakers when games have similar quality.
      </p>

      <div className="space-y-8">
        {/* Offense vs Defense */}
        <StyleSlider
          label="Offense vs Defense"
          leftLabel="Love defensive battles"
          rightLabel="Love shootouts"
          value={profile.stylePreferences.offenseDefenseBalance}
          onChange={(val) => handleSliderChange('offenseDefenseBalance', val)}
        />

        {/* Pace */}
        <StyleSlider
          label="Game Pace"
          leftLabel="Slow & methodical"
          rightLabel="Fast & frenetic"
          value={profile.stylePreferences.pacePreference}
          onChange={(val) => handleSliderChange('pacePreference', val)}
        />

        {/* Ball Movement */}
        <StyleSlider
          label="Ball Movement"
          leftLabel="Don't care about assists"
          rightLabel="Love team basketball"
          value={profile.stylePreferences.ballMovementPreference}
          onChange={(val) => handleSliderChange('ballMovementPreference', val)}
        />

        {/* Star Power */}
        <StyleSlider
          label="Star Power"
          leftLabel="Love balanced efforts"
          rightLabel="Love individual shows"
          value={profile.stylePreferences.starPowerPreference}
          onChange={(val) => handleSliderChange('starPowerPreference', val)}
        />

        {/* Physicality */}
        <StyleSlider
          label="Physicality"
          leftLabel="Prefer finesse"
          rightLabel="Love physical/chippy"
          value={profile.stylePreferences.physicalityPreference}
          onChange={(val) => handleSliderChange('physicalityPreference', val)}
        />
      </div>

      <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          💡 <strong>Tip:</strong> These preferences are subtle tiebreakers (±5 points max). A boring game won't suddenly become must-watch just because it matches your style. Start with all neutral (3) and adjust based on your viewing experience.
        </p>
      </div>
    </div>
  );
}

function StyleSlider({
  label,
  leftLabel,
  rightLabel,
  value,
  onChange,
}: {
  label: string;
  leftLabel: string;
  rightLabel: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
        {label}
      </label>
      
      {/* Left/Right Labels */}
      <div className="mb-3 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
        <span className="font-medium">{leftLabel}</span>
        <span className="font-medium">{rightLabel}</span>
      </div>

      {/* Slider container */}
      <div className="relative px-2 py-4">
        {/* Track background */}
        <div className="absolute top-1/2 left-2 right-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full -translate-y-1/2" />
        
        {/* Active track (fills from left to current position) */}
        <div 
          className="absolute top-1/2 left-2 h-2 bg-blue-500 rounded-full -translate-y-1/2 transition-all duration-150"
          style={{ width: `${((value - 1) / 4) * 100}%` }}
        />

        {/* Tick marks */}
        <div className="absolute top-1/2 left-2 right-2 flex justify-between pointer-events-none -translate-y-1/2">
          {[1, 2, 3, 4, 5].map((tick) => (
            <div
              key={tick}
              className={`w-4 h-4 rounded-full border-2 transition-all duration-150 ${
                value === tick
                  ? 'bg-blue-500 border-blue-500 scale-125 shadow-lg'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
              }`}
            />
          ))}
        </div>

        {/* Range input (invisible but draggable) */}
        <input
          type="range"
          min="1"
          max="5"
          step="1"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full relative z-10 cursor-grab active:cursor-grabbing appearance-none bg-transparent"
          style={{
            WebkitAppearance: 'none',
            height: '40px',
          }}
        />
      </div>

      {/* Value labels */}
      <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 px-2 -mt-2">
        <span className={value === 1 ? 'text-blue-500 font-bold' : ''}>1</span>
        <span className={value === 2 ? 'text-blue-500 font-bold' : ''}>2</span>
        <span className={value === 3 ? 'text-blue-500 font-bold' : ''}>3</span>
        <span className={value === 4 ? 'text-blue-500 font-bold' : ''}>4</span>
        <span className={value === 5 ? 'text-blue-500 font-bold' : ''}>5</span>
      </div>

      {/* Current selection text - updates in real-time */}
      <div className="mt-3 text-center transition-all duration-150">
        <span className="inline-block px-4 py-2 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium">
          {value === 1 && `Strongly prefer ${leftLabel.toLowerCase()}`}
          {value === 2 && `Prefer ${leftLabel.toLowerCase()}`}
          {value === 3 && 'No preference'}
          {value === 4 && `Prefer ${rightLabel.toLowerCase()}`}
          {value === 5 && `Strongly prefer ${rightLabel.toLowerCase()}`}
        </span>
      </div>
    </div>
  );
}

