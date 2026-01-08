'use client';

import type { ReactNode } from 'react';
import { useMemo, useState, useEffect } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useDroppable,
    useSensor,
    useSensors,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableTeamItem } from '@/components/ui/SortableTeamItem';
import { SortableAccordion } from '@/components/ui/SortableAccordion';
import { ArcadeTickSlider } from '@/components/ui/ArcadeTickSlider';
import { DraggablePlayer } from '@/components/ui/DraggablePlayer';
import { DroppableBucket } from '@/components/ui/DroppableBucket';
import { usePreferences } from '@/lib/state/usePreferences';
import type { Team, UserPreferences } from '@/types/schema';
import { ALL_TEAMS, TEAM_STANDINGS_2024 } from '@/lib/data/allTeams';
import { ALL_PLAYERS } from '@/lib/data/allPlayers';
import { MOCK_STATS, PlayerStats } from '@/lib/data/mockStats';
import { createPortal } from 'react-dom';
import { Info, UserCircle, Users, Sliders } from 'lucide-react';

function DroppableTray({ children, id }: { children: ReactNode; id: string }) {
    const { setNodeRef } = useDroppable({
        id,
        data: { type: 'TRAY' },
    });
    const setRef = (el: HTMLDivElement | null) => setNodeRef(el);
    return <div ref={setRef} className="flex gap-2 min-w-full">{children}</div>;
}

type StatFilter = 'pts' | 'reb' | 'ast' | 'stl' | 'blk' | '3pm' | 'min' | 'fg%' | '3p%' | 'ft%' | 'tov';

type ActiveDragPlayer = {
    id: string;
    name: string;
    headshotUrl: string;
};

const statKeyByFilter: Record<StatFilter, keyof PlayerStats> = {
    pts: 'pts',
    reb: 'reb',
    ast: 'ast',
    stl: 'stl',
    blk: 'blk',
    min: 'min',
    tov: 'tov',
    '3pm': 'three_pm',
    'fg%': 'fg_pct',
    '3p%': 'three_pct',
    'ft%': 'ft_pct',
};

export default function PreferencesPage() {
    const { prefs, setPrefs, isLoaded } = usePreferences();
    const [viewMode, setViewMode] = useState<'LEAGUE' | 'CONFERENCE' | 'DIVISION'>('LEAGUE');
    const sortedTeams = useMemo(() => {
        if (!isLoaded) return [];
        return prefs.teamRanks
            .map((id) => ALL_TEAMS.find((t) => t.id === id))
            .filter((t): t is (typeof ALL_TEAMS)[number] => !!t);
    }, [isLoaded, prefs.teamRanks]);

    // Player Filter State
    const [playerSearch, setPlayerSearch] = useState('');
    const [playerTeamFilter, setPlayerTeamFilter] = useState('');
    const [statFilter, setStatFilter] = useState<StatFilter>('pts');
    const [trayMode, setTrayMode] = useState<'DISCOVERY' | 'STATS'>('DISCOVERY');
    const [stats, setStats] = useState<Record<string, PlayerStats>>(MOCK_STATS);

    const [activeDragPlayer, setActiveDragPlayer] = useState<ActiveDragPlayer | null>(null); // For Overlay

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), // Add distance to prevent accidental drags
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    useEffect(() => {
        // Fetch Real Stats
        fetch('/api/stats')
            .then(res => res.json())
            .then(data => {
                if (data && !data.error) {
                    setStats(data as Record<string, PlayerStats>);
                    console.log('Real-time stats loaded');
                }
            })
            .catch(err => console.error('Failed to load real stats, using mock data', err));
    }, []);

    if (!isLoaded) return <div className="p-8 text-center text-arcade-green font-mono animate-pulse">LOADING...</div>;

    // Logic: In "Lookup View", we only show players not already in a bucket.
    // In "Stats View", we show everyone to maintain league integrity.
    const traySource = trayMode === 'STATS'
        ? ALL_PLAYERS
        : ALL_PLAYERS.filter(p =>
            !prefs.playerBuckets.mustSee.includes(p.id) &&
            !prefs.playerBuckets.villain.includes(p.id) &&
            !prefs.playerBuckets.hooper.includes(p.id) &&
            p.id !== prefs.goatId
        );

    const filteredTrayPlayers = traySource.filter(p => {
        // Search Filter
        const matchesSearch = p.name.toLowerCase().includes(playerSearch.toLowerCase());
        // Team Filter
        const matchesTeam = p.teamId === parseInt(playerTeamFilter);
        return matchesSearch && (playerTeamFilter ? matchesTeam : true);
    });

    const getHighlightColor = (playerId: string) => {
        if (prefs.goatId === playerId) return '#ffe600';
        if (prefs.playerBuckets.mustSee.includes(playerId)) return '#ffe600';
        if (prefs.playerBuckets.hooper.includes(playerId)) return '#4f93ff';
        if (prefs.playerBuckets.villain.includes(playerId)) return '#ff4b4b';
        return undefined;
    };

    // Sort Logic based on Mode
    const sortedAvailablePlayers = [...filteredTrayPlayers].sort((a, b) => {
        if (trayMode === 'STATS') {
            const key = statKeyByFilter[statFilter];
            const statA = stats[a.id]?.[key] ?? 0;
            const statB = stats[b.id]?.[key] ?? 0;

            return statB - statA;
        }
        // Discovery Mode: Sort by Minutes (Importance Proxy)
        return b.minutes - a.minutes;
    });

    const topTalent = sortedAvailablePlayers.slice(0, 50);
    const depthChart = sortedAvailablePlayers.slice(50, 150);

    function handleDragStart(event: DragStartEvent) {
        const activeData = event.active.data.current;
        if (activeData?.type === 'PLAYER') {
            setActiveDragPlayer({
                id: String(event.active.id),
                name: activeData.name as string,
                headshotUrl: activeData.headshotUrl as string,
            });
        }
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        setActiveDragPlayer(null);

        if (!over) return;

        const activeData = active.data.current;
        const overData = over.data.current;

        // --- PLAYER DROP LOGIC ---
        if (activeData?.type === 'PLAYER') {
            const playerId = active.id as string;

            // 1. If dropped into GOAT slot
            if (over.id === 'goat') {
                setPrefs({
                    ...prefs,
                    goatId: playerId,
                    playerBuckets: {
                        mustSee: prefs.playerBuckets.mustSee.filter(id => id !== playerId),
                        villain: prefs.playerBuckets.villain.filter(id => id !== playerId),
                        hooper: prefs.playerBuckets.hooper.filter(id => id !== playerId),
                    }
                });
                return;
            }

            // 2. Remove from current buckets
            const newBuckets = {
                mustSee: prefs.playerBuckets.mustSee.filter(id => id !== playerId),
                villain: prefs.playerBuckets.villain.filter(id => id !== playerId),
                hooper: prefs.playerBuckets.hooper.filter(id => id !== playerId),
            };

            // 3. Update goatId if player was goat
            const newGoatId = prefs.goatId === playerId ? null : prefs.goatId;

            // 4. Add to target bucket if applicable
            if (overData?.type === 'BUCKET') {
                const targetBucket = over.id as 'mustSee' | 'villain' | 'hooper';
                newBuckets[targetBucket].push(playerId);
            }

            setPrefs({ ...prefs, playerBuckets: newBuckets, goatId: newGoatId });
            return;
        }

        // --- TEAM/GROUP REORDER LOGIC ---
        if (active.id === over.id) return;

        // FOR NOW: If we are in LEAGUE mode, we handle team reorder here.
        if (viewMode === 'LEAGUE') {
            const currentOrder = [...prefs.teamRanks];
            const oldIndex = currentOrder.indexOf(active.id as number);
            const newIndex = currentOrder.indexOf(over.id as number);

            if (oldIndex !== -1 && newIndex !== -1) {
                const newOrder = arrayMove(currentOrder, oldIndex, newIndex);
                setPrefs({ ...prefs, teamRanks: newOrder, isSyncingToStandings: false });
            }
        }
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="max-w-md mx-auto p-4 pb-4 font-sans text-gray-100">
                <div className="mb-8 space-y-2 text-left">
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter text-shadow-arcade">
                        <span className="text-arcade-yellow"># The</span> <span className="text-arcade-red">Algo</span>
                    </h2>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        Fine-tune the model to watch the NBA action you care about!
                    </p>
                </div>


                {/* 1. SCORE CARD (THE SCORER'S TABLE) */}

                {/* The Scorer's Table: 50/30/20 Infographic */}
                <div className="bg-arcade-card border-2 border-arcade-yellow rounded-sm relative overflow-hidden group mb-8 box-shadow-arcade p-1">
                    <div className="bg-black/40 absolute inset-0 z-0"></div>
                    <div className="relative z-10 p-5">
                        <div className="flex justify-between items-start mb-4 border-b-2 border-dashed border-gray-700 pb-3">
                            <div>
                                        <h2 className="text-xl font-black italic uppercase text-arcade-yellow text-shadow-arcade leading-none mb-1">
                                            The Scorer’s Table
                                        </h2>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                    The recipe for a perfect game
                                </p>
                            </div>
                            <Info className="w-5 h-5 text-arcade-yellow animate-pulse" />
                        </div>

                        <div className="space-y-4 mb-5">
                            {/* 50% Drama */}
                            <div>
                                <div className="flex justify-between text-[10px] uppercase font-black mb-1">
                                    <span className="text-arcade-red">50% Drama</span>
                                    <span className="text-gray-500">Clutch / OT / Lead Changes</span>
                                </div>
                                <div className="w-full h-3 bg-gray-900 rounded-sm overflow-hidden border border-gray-800">
                                    <div className="h-full bg-arcade-red w-1/2 stripe-pattern"></div>
                                </div>
                            </div>

                            {/* 30% Matchup */}
                            <div>
                                <div className="flex justify-between text-[10px] uppercase font-black mb-1">
                                    <span className="text-arcade-blue">30% Matchup</span>
                                    <span className="text-gray-500">Star Power / Team Quality</span>
                                </div>
                                <div className="w-full h-3 bg-gray-900 rounded-sm overflow-hidden border border-gray-800">
                                    <div className="h-full bg-arcade-blue w-[30%] stripe-pattern"></div>
                                </div>
                            </div>

                            {/* 20% Story */}
                            <div>
                                <div className="flex justify-between text-[10px] uppercase font-black mb-1">
                                    <span className="text-arcade-green">20% Story</span>
                                    <span className="text-gray-500">Rivalries / Implications</span>
                                </div>
                                <div className="w-full h-3 bg-gray-900 rounded-sm overflow-hidden border border-gray-800">
                                    <div className="h-full bg-arcade-green stripe-pattern" style={{ width: '20%' }}></div>
                                </div>
                            </div>
                        </div>

                        {/* Personalization Bonus - Enriched */}
                        <div className="bg-gray-900/80 p-3 rounded border border-dashed border-gray-700">
                            <div className="flex justify-between items-center mb-3">
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Your Bias Multiplier</p>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-arcade-yellow text-shadow-sm leading-none">
                                        +{Math.round((prefs.playerBuckets.mustSee.length * 8) + (((prefs.style?.vibe ?? 3) - 3) * 5))}%
                                    </p>
                                    <p className="text-[8px] text-gray-500 uppercase font-bold">Total Boost</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 mb-3">
                                {/* Team Bias */}
                                <div className="bg-black/50 p-2 rounded border border-gray-800 flex flex-col items-center justify-center text-center">
                                    <div className="w-6 h-6 rounded-full border border-gray-600 overflow-hidden mb-1">
                                        {ALL_TEAMS.find(t => t.id === prefs.teamRanks[0])?.logoUrl ? (
                                            <img
                                                src={ALL_TEAMS.find(t => t.id === prefs.teamRanks[0])!.logoUrl}
                                                alt={`${ALL_TEAMS.find(t => t.id === prefs.teamRanks[0])!.name} logo`}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : <div className="w-full h-full bg-arcade-yellow" />}
                                    </div>
                                    <p className="text-[9px] font-bold text-gray-300 leading-tight">My Team</p>
                                </div>

                                {/* Player Bias */}
                                <div className="bg-black/50 p-2 rounded border border-gray-800 flex flex-col items-center justify-center text-center">
                                    <Users className="w-6 h-6 text-arcade-blue mb-1" />
                                    <p className="text-[9px] font-bold text-gray-300 leading-tight">{prefs.playerBuckets.mustSee.length} Stars</p>
                                </div>

                                {/* Style Bias */}
                                <div className="bg-black/50 p-2 rounded border border-gray-800 flex flex-col items-center justify-center text-center">
                                    <Sliders className="w-6 h-6 text-arcade-red mb-1" />
                                    <p className="text-[9px] font-bold text-gray-300 leading-tight">{(prefs.style?.vibe ?? 3) > 3 ? 'High' : (prefs.style?.vibe ?? 3) < 3 ? 'Low' : 'Mid'} Chaos</p>
                                </div>
                            </div>

                            <p className="text-[10px] text-gray-500 italic leading-tight text-center">
                                &ldquo;Your unique blend of loyalty, star power, and vibe preference tips the scale for what’s watchable.&rdquo;
                            </p>
                        </div>
                    </div>
                </div>

                <h2 className="text-xl font-black italic uppercase text-arcade-yellow text-shadow-arcade text-left mb-6">
                    Your Adjustments
                </h2>
                {/* 2. PLAYERS SECTION */}
                <section className="mb-12">
                    <div className="mb-4">
                        <h2 className="text-arcade-blue text-sm font-black uppercase tracking-widest flex items-center gap-2">
                            <Users className="w-4 h-4" /> <span>Players</span>
                        </h2>
                        <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">
                            Build your watchlist of favorite stars and heated rivals.
                        </p>
                    </div>

                    {/* 1. GOAT SLOT (The Hero Area) - MOVED TO TOP */}
                    <div className="mb-8 p-1 bg-gradient-to-r from-arcade-yellow via-white to-arcade-yellow rounded-xl box-shadow-arcade">
                        <DroppableBucket id="goat" label="The G.O.A.T." description="Massive Priority Bonus" color="yellow" darkText>
                            {prefs.goatId ? (
                                <DraggablePlayer
                                    {...ALL_PLAYERS.find(p => p.id === prefs.goatId)!}
                                    onRemove={() => setPrefs({ ...prefs, goatId: null })}
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center p-4 h-24 border-2 border-dashed border-gray-400 rounded-lg opacity-40">
                                    <p className="text-[10px] uppercase font-black text-white/60">Drop Your Favorite Here</p>
                                </div>
                            )}
                        </DroppableBucket>
                    </div>

                    {/* 2. Leaders Tray / Search */}
                    <div className="mb-8">
                        {/* Leaders Tray Controls */}
                        <div className="bg-arcade-card p-3 rounded-t-xl border-x border-t border-gray-700 mx-1 mb-0 relative z-10 box-shadow-arcade-sm">
                            <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
                                <h3 className="text-arcade-yellow text-sm font-black uppercase italic tracking-widest text-shadow-arcade">
                                    {trayMode === 'STATS' ? 'LEAGUE LEADERS' : 'PLAYER LOOKUP'}
                                </h3>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setTrayMode(trayMode === 'DISCOVERY' ? 'STATS' : 'DISCOVERY')}
                                        className={`
                                            px-2 py-1 rounded text-[10px] font-bold uppercase border 
                                            ${trayMode === 'STATS'
                                                ? 'bg-arcade-yellow text-black border-arcade-yellow'
                                                : 'bg-black/40 text-gray-400 border-gray-600 hover:text-white'
                                            }
                                        `}
                                    >
                                        {trayMode === 'STATS' ? '📊 Stats View' : '🔍 Lookup View'}
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-2 mb-3">
                                <select
                                    value={playerTeamFilter}
                                    onChange={(e) => setPlayerTeamFilter(e.target.value)}
                                    className="bg-black/50 text-white px-2 py-1.5 rounded text-[10px] border border-gray-600 focus:border-arcade-blue outline-none max-w-[100px]"
                                >
                                    <option value="">All Teams</option>
                                    {prefs.teamRanks.map(tid => {
                                        const team = ALL_TEAMS.find(t => t.id === tid);
                                        if (!team) return null;
                                        return <option key={team.id} value={team.id}>{team.name}</option>;
                                    })}
                                </select>

                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        placeholder={playerTeamFilter
                                            ? `Find your favorite ${ALL_TEAMS.find(t => t.id === parseInt(playerTeamFilter))?.name ?? 'team'} player...`
                                            : "Find your favorite hooper..."
                                        }
                                        value={playerSearch}
                                        onChange={(e) => setPlayerSearch(e.target.value)}
                                        className="w-full bg-black/50 text-white pl-2 pr-8 py-1.5 rounded text-[10px] border border-gray-600 focus:border-arcade-blue outline-none"
                                    />
                                    {playerSearch && (
                                        <button
                                            onClick={() => setPlayerSearch('')}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            </div>

                            {trayMode === 'STATS' && (
                                <div className="flex flex-wrap gap-2 justify-center border-t border-gray-700 pt-3">
                                    {(['pts', 'reb', 'ast', '3pm', 'stl', 'blk', 'min', 'fg%', '3p%', 'ft%', 'tov'] as StatFilter[]).map((stat) => (
                                        <button
                                            key={stat}
                                            onClick={() => setStatFilter(stat)}
                                            className={`
                                                px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all border-2
                                                ${statFilter === stat
                                                    ? 'bg-arcade-yellow text-black border-black transform -translate-y-0.5 box-shadow-arcade-xs'
                                                    : 'bg-black/40 text-gray-400 border-gray-600 hover:border-arcade-yellow hover:text-arcade-yellow'
                                                }
                                            `}
                                        >
                                            {stat === 'min' ? 'Minutes' : stat === '3pm' ? '3PM' : stat === 'fg%' ? 'FG%' : stat === '3p%' ? '3P%' : stat === 'ft%' ? 'FT%' : stat.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Actual Tray */}
                        {trayMode === 'STATS' ? (
                            <div className="bg-gray-900/80 p-2 border-x border-b border-gray-700 min-h-[140px] mx-1 rounded-b-xl relative z-0">
                                <div className="overflow-x-auto pb-2 custom-scrollbar">
                                    <DroppableTray id="TRAY_TOP">
                                        {topTalent.map(p => {
                                            const playerStats = stats[p.id];
                                            const key = statKeyByFilter[statFilter];
                                            const val = playerStats?.[key] ?? 0;
                                            return (
                                                <DraggablePlayer
                                                    key={p.id}
                                                    {...p}
                                                    statValue={val?.toString()}
                                                    highlightColor={getHighlightColor(p.id)}
                                                />
                                            );
                                        })}
                                    </DroppableTray>
                                </div>
                                <p className="text-[9px] text-gray-500 text-center mt-2 uppercase font-bold tracking-widest opacity-50">
                                    Showing top 50 {statFilter.toUpperCase()} leaders
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="bg-gray-900/80 p-2 rounded-none border-x border-gray-700 border-b border-gray-800 min-h-[120px] mx-1">
                                    <p className="text-[10px] text-gray-400 font-bold mb-2 uppercase tracking-wide ml-1 flex justify-between">
                                        <span>Top Talent (Rotation)</span>
                                        <span className="text-gray-600">{topTalent.length}</span>
                                    </p>
                                    <div className="overflow-x-auto pb-2 custom-scrollbar">
                                        <DroppableTray id="TRAY_TOP">
                                            {topTalent.map(p => (
                                                <DraggablePlayer
                                                    key={p.id}
                                                    {...p}
                                                    highlightColor={getHighlightColor(p.id)}
                                                />
                                            ))}
                                        </DroppableTray>
                                    </div>
                                </div>
                                <div className="bg-gray-900/50 p-2 rounded-b-xl border-x border-b border-gray-700 min-h-[120px] mx-1">
                                    <p className="text-[10px] text-gray-500 font-bold mb-2 uppercase tracking-wide ml-1 flex justify-between">
                                        <span>Depth Chart</span>
                                        <span className="text-gray-600">{depthChart.length}</span>
                                    </p>
                                    <div className="overflow-x-auto pb-2 custom-scrollbar">
                                        <DroppableTray id="TRAY_DEPTH">
                                            {depthChart.map(p => (
                                                <DraggablePlayer
                                                    key={p.id}
                                                    {...p}
                                                    highlightColor={getHighlightColor(p.id)}
                                                />
                                            ))}
                                        </DroppableTray>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* 3. Buckets THIRD */}
                    <div className="flex flex-col gap-6">
                        <DroppableBucket id="mustSee" label="Must See" description="The Main Event" color="yellow">
                            {prefs.playerBuckets.mustSee.map(pid => {
                                const p = ALL_PLAYERS.find(s => s.id === pid);
                                return p ? (
                                    <DraggablePlayer
                                        key={p.id}
                                        {...p}
                                        onRemove={() => setPrefs({
                                            ...prefs,
                                            playerBuckets: {
                                                ...prefs.playerBuckets,
                                                mustSee: prefs.playerBuckets.mustSee.filter(id => id !== p.id)
                                            }
                                        })}
                                    />
                                ) : null;
                            })}
                        </DroppableBucket>

                        <DroppableBucket id="hooper" label="Hooper" description="Pure Craft" color="blue">
                            {prefs.playerBuckets.hooper.map(pid => {
                                const p = ALL_PLAYERS.find(s => s.id === pid);
                                return p ? (
                                    <DraggablePlayer
                                        key={p.id}
                                        {...p}
                                        onRemove={() => setPrefs({
                                            ...prefs,
                                            playerBuckets: {
                                                ...prefs.playerBuckets,
                                                hooper: prefs.playerBuckets.hooper.filter(id => id !== p.id)
                                            }
                                        })}
                                    />
                                ) : null;
                            })}
                        </DroppableBucket>

                        <DroppableBucket id="villain" label="Villain" description="The Antagonists" color="red">
                            {prefs.playerBuckets.villain.map(pid => {
                                const p = ALL_PLAYERS.find(s => s.id === pid);
                                return p ? (
                                    <DraggablePlayer
                                        key={p.id}
                                        {...p}
                                        onRemove={() => setPrefs({
                                            ...prefs,
                                            playerBuckets: {
                                                ...prefs.playerBuckets,
                                                villain: prefs.playerBuckets.villain.filter(id => id !== p.id)
                                            }
                                        })}
                                    />
                                ) : null;
                            })}
                        </DroppableBucket>
                    </div>
                </section>

                {/* 3. TEAMS SECTION */}
                <section className="mb-12">
                    <div className="mb-4">
                        <h2 className="text-arcade-blue text-sm font-black uppercase tracking-widest flex items-center gap-2">
                            <UserCircle className="w-4 h-4" /> <span>Teams</span>
                        </h2>
                        <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">
                            Rank the league by your favorite local squads and heavy hitters.
                        </p>
                    </div>

                    <div className="flex bg-gray-900 rounded p-1 mb-4 border border-gray-700">
                        {(['LEAGUE', 'CONFERENCE', 'DIVISION'] as const).map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setViewMode(mode)}
                                className={`flex-1 py-2 text-[10px] font-bold uppercase rounded ${viewMode === mode
                                    ? 'bg-arcade-blue text-white'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>

                    {/* Sync Toggle */}
                    <div className="mb-6 flex items-center gap-3 bg-gray-900 p-3 rounded border border-gray-700">
                        <input
                            type="checkbox"
                            id="syncStandings"
                            checked={prefs.isSyncingToStandings}
                            onChange={(e) => {
                                const isChecked = e.target.checked;
                                if (isChecked) {
                                    const standingsOrder = [...ALL_TEAMS]
                                        .sort((a, b) => (TEAM_STANDINGS_2024[b.id] ?? 0) - (TEAM_STANDINGS_2024[a.id] ?? 0))
                                        .map((t) => t.id);
                                    setPrefs({ ...prefs, teamRanks: standingsOrder, isSyncingToStandings: true });
                                } else {
                                    setPrefs({ ...prefs, isSyncingToStandings: false });
                                }
                            }}
                            className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-arcade-yellow focus:ring-arcade-blue"
                        />
                        <label htmlFor="syncStandings" className="text-sm text-gray-300 font-bold select-none cursor-pointer">
                            Sync to Live Standings (2024-25)
                        </label>
                    </div>

                    {viewMode === 'LEAGUE' ? (
                        <SortableContext
                            items={sortedTeams.map(t => t.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <ul className="space-y-2">
                                {sortedTeams.map((team, index) => (
                                    <SortableTeamItem
                                        key={team.id}
                                        id={team.id}
                                        name={team.name}
                                        rank={index + 1}
                                        logoUrl={team.logoUrl}
                                    />
                                ))}
                            </ul>
                        </SortableContext>
                    ) : (
                        <GroupAccordionView
                            groupBy={viewMode}
                            prefs={prefs}
                            setPrefs={setPrefs}
                            allTeams={ALL_TEAMS}
                        />
                    )}
                </section>

                {/* 4. STYLE TUNING (NBA JAM VIBES) */}
                <section className="mb-12">
                    <div className="mb-4">
                        <h2 className="text-arcade-blue text-sm font-black uppercase tracking-widest flex items-center gap-2">
                            <Sliders className="w-4 h-4" /> <span>Style Tuning (NBA Jam Vibes)</span>
                        </h2>
                        <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">
                            Tune the engine: emphasize pace, ball movement, or chaos tolerance.
                        </p>
                    </div>

                    {/* NEW: POWER-UP TOGGLES */}
                    <div className="bg-arcade-card p-4 border border-gray-700 rounded mb-6 space-y-4 shadow-xl">
                        <h3 className="text-arcade-yellow text-[11px] font-black uppercase italic tracking-widest mb-2 border-b border-gray-700 pb-2">
                            Gameplay Power-ups
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                            <div className="flex items-center justify-between bg-black/40 p-3 rounded border border-gray-800 hover:border-arcade-blue transition-colors">
                                <div className="flex-1">
                                    <p className="text-[10px] font-black uppercase text-white leading-tight">Rivalries Matter</p>
                                    <p className="text-[8px] text-gray-500 uppercase font-bold mt-0.5">Boosts heated rematches & division duels</p>
                                </div>
                                <button
                                    onClick={() => setPrefs({ ...prefs, powerups: { ...prefs.powerups, rivalriesMatter: !prefs.powerups.rivalriesMatter } })}
                                    className={`w-10 h-5 rounded-full relative transition-colors ${prefs.powerups.rivalriesMatter ? 'bg-arcade-blue' : 'bg-gray-700'}`}
                                >
                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${prefs.powerups.rivalriesMatter ? 'left-6' : 'left-1'}`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between bg-black/40 p-3 rounded border border-gray-800 hover:border-arcade-blue transition-colors">
                                <div className="flex-1">
                                    <p className="text-[10px] font-black uppercase text-white leading-tight">Superstar Showcases</p>
                                    <p className="text-[8px] text-gray-500 uppercase font-bold mt-0.5">Boosts games with elite head-to-head star power</p>
                                </div>
                                <button
                                    onClick={() => setPrefs({ ...prefs, powerups: { ...prefs.powerups, superstarShowcases: !prefs.powerups.superstarShowcases } })}
                                    className={`w-10 h-5 rounded-full relative transition-colors ${prefs.powerups.superstarShowcases ? 'bg-arcade-blue' : 'bg-gray-700'}`}
                                >
                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${prefs.powerups.superstarShowcases ? 'left-6' : 'left-1'}`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between bg-black/40 p-3 rounded border border-gray-800 hover:border-arcade-blue transition-colors">
                                <div className="flex-1">
                                    <p className="text-[10px] font-black uppercase text-white leading-tight">Discovery Mode</p>
                                    <p className="text-[8px] text-gray-500 uppercase font-bold mt-0.5">Adds evocative teasers (no spoilers)</p>
                                </div>
                                <button
                                    onClick={() => setPrefs({ ...prefs, powerups: { ...prefs.powerups, discoveryMode: !prefs.powerups.discoveryMode } })}
                                    className={`w-10 h-5 rounded-full relative transition-colors ${prefs.powerups.discoveryMode ? 'bg-arcade-blue' : 'bg-gray-700'}`}
                                >
                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${prefs.powerups.discoveryMode ? 'left-6' : 'left-1'}`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-arcade-card p-6 border border-gray-700 rounded space-y-6 shadow-2xl">
                        {/* 1. PACE */}
                        <ArcadeTickSlider
                            label="Pace"
                            leftLabel="Half-court chess"
                            rightLabel="Run and gun"
                            value={prefs.style?.pace ?? 3}
                            onChange={(v) => setPrefs({ ...prefs, style: { ...prefs.style, pace: v } })}
                            tickLabels={["Half-court chess", "Slow burners", "No preference", "Push the tempo", "Run and gun"]}
                            microcopy={[
                                "Set the table, call the set, win the possession.",
                                "I like my hoops with a little simmer.",
                                "Pace is pace. Surprise me.",
                                "Let’s get moving, I want possessions.",
                                "If it’s not flying, I’m not buying."
                            ]}
                        />

                        {/* 2. BALL MOVEMENT */}
                        <ArcadeTickSlider
                            label="Ball Movement"
                            leftLabel="ISO cooking"
                            rightLabel="Everybody eats"
                            value={prefs.style?.ballMovement ?? 3}
                            onChange={(v) => setPrefs({ ...prefs, style: { ...prefs.style, ballMovement: v } })}
                            tickLabels={["ISO cooking", "Two-man game", "No preference", "Extra pass", "Everybody eats"]}
                            color="purple"
                            microcopy={[
                                "Give it to the star and clear the side.",
                                "I want to see the best player cook.",
                                "A healthy mix of sets and stars.",
                                "Keep that rock zipping around.",
                                "The open man is the best man."
                            ]}
                        />

                        {/* 3. POINTS VIBE */}
                        <ArcadeTickSlider
                            label="Points Vibe"
                            leftLabel="Clamp city"
                            rightLabel="Bucket festival"
                            value={prefs.style?.pointsVibe ?? 3}
                            onChange={(v) => setPrefs({ ...prefs, style: { ...prefs.style, pointsVibe: v } })}
                            tickLabels={["Clamp city", "Defensive edge", "No preference", "Shots falling", "Bucket festival"]}
                            color="red"
                            microcopy={[
                                "I want a 92-88 final score. Every point earned.",
                                "Physical, defensive, and tough.",
                                "Balanced play on both ends.",
                                "Let's put some numbers on the board.",
                                "Turn off the lights, it's a shootout."
                            ]}
                        />

                        {/* 4. SHOT PROFILE */}
                        <ArcadeTickSlider
                            label="Shot Profile"
                            leftLabel="Rim pressure"
                            rightLabel="3-point barrage"
                            value={prefs.style?.shotProfile ?? 3}
                            onChange={(v) => setPrefs({ ...prefs, style: { ...prefs.style, shotProfile: v } })}
                            tickLabels={["Rim pressure", "Paint first", "No preference", "Splash range", "3-point barrage"]}
                            color="yellow"
                            microcopy={[
                                "If it's not a dunk or layup, why shoot?",
                                "Pressure the rim, everything flows out.",
                                "Take what the defense gives you.",
                                "The math says take the three.",
                                "Launch them from the logo."
                            ]}
                        />

                        {/* 5. VIBE / CHAOS */}
                        <ArcadeTickSlider
                            label="Vibe"
                            leftLabel="Clean execution"
                            rightLabel="Pure chaos"
                            value={prefs.style?.vibe ?? 3}
                            onChange={(v) => setPrefs({ ...prefs, style: { ...prefs.style, vibe: v } })}
                            tickLabels={["Clean execution", "Controlled heat", "No preference", "Momentum swings", "Pure chaos"]}
                            color="purple"
                            microcopy={[
                                "Execution and discipline above all.",
                                "Controlled bursts of energy.",
                                "I like a little movement.",
                                "Things are starting to get weird.",
                                "I live for the absolute madness."
                            ]}
                        />
                        <ArcadeTickSlider
                            label="Bang Meter (Broadcast)"
                            leftLabel="Just hoops"
                            rightLabel="Double BANG energy"
                            value={prefs.style?.bangMeter ?? 3}
                            onChange={(v) => setPrefs({ ...prefs, style: { ...prefs.style, bangMeter: v } })}
                            tickLabels={["Just hoops", "A little spice", "Crowd’s alive", "Call of the night", "Double BANG energy"]}
                            microcopy={[
                                "I’m here for basketball, not the broadcast.",
                                "If it pops, it pops.",
                                "Give me some atmosphere.",
                                "If the call was legendary, I want it.",
                                "I want the kind of moment that shakes the mic."
                            ]}
                            color="blue"
                        />

                        {/* 7. DESK HEAT */}
                        <ArcadeTickSlider
                            label="Desk Heat (Studio)"
                            leftLabel="Skip the panel"
                            rightLabel="Breaking down tape"
                            value={prefs.style?.deskHeat ?? 3}
                            onChange={(v) => setPrefs({ ...prefs, style: { ...prefs.style, deskHeat: v } })}
                            tickLabels={["Skip the panel", "Mild takes", "Some debate", "Heated arguments", "Breaking down tape"]}
                            microcopy={[
                                "No desk needed. Next game.",
                                "A little chatter is fine.",
                                "If there’s debate, I’ll listen.",
                                "I want takes flying.",
                                "Run it back, freeze it, circle it."
                            ]}
                            color="yellow"
                        />
                    </div>

                    <p className="text-[10px] text-gray-500 text-center italic mt-4">
                        These are tiebreakers, not magic. A snoozer stays a snoozer.
                    </p>
                </section>
            </div>
            {/* Drag Overlay Portal */}
            {
                isLoaded && typeof document !== 'undefined' && createPortal(
                    <DragOverlay>
                        {activeDragPlayer ? (
                            <DraggablePlayer
                                id={activeDragPlayer.id}
                                name={activeDragPlayer.name}
                                headshotUrl={activeDragPlayer.headshotUrl}
                                isOverlay
                                statValue={(stats[activeDragPlayer.id]?.[statKeyByFilter[statFilter]] ?? 0).toString()}
                            />
                        ) : null}
                    </DragOverlay>,
                    document.body
                )
            }
        </DndContext >
    );
}

type GroupAccordionViewProps = {
    groupBy: 'LEAGUE' | 'CONFERENCE' | 'DIVISION';
    prefs: UserPreferences;
    setPrefs: (prefs: UserPreferences) => void;
    allTeams: Team[];
};

function GroupAccordionView({ groupBy, prefs, setPrefs, allTeams }: GroupAccordionViewProps) {
    const [openGroups, setOpenGroups] = useState<string[]>([]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const groups = groupBy === 'CONFERENCE' ? ['West', 'East'] :
        groupBy === 'DIVISION' ? ['Northwest', 'Pacific', 'Southwest', 'Atlantic', 'Central', 'Southeast'] : [];

    if (groupBy === 'LEAGUE' || groups.length === 0) return null;

    // 1. Determine Group Order (Macro)
    const groupIndices = groups.map((g) => {
        const bestRank = prefs.teamRanks.findIndex((tid) => {
            const team = allTeams.find((t) => t.id === tid);
            if (!team) return false;
            return groupBy === 'CONFERENCE' ? team.conference === g : team.division === g;
        });
        return { name: g, index: bestRank === -1 ? 999 : bestRank };
    });

    const sortedGroups = groupIndices.sort((a, b) => a.index - b.index).map((x) => x.name);

    // 2. Helper to get teams for a group
    const getTeamsInGroup = (groupName: string) => {
        // Filter master list for this group to preserve relative order
        return prefs.teamRanks
            .map((id) => allTeams.find((t) => t.id === id))
            .filter((t): t is Team => !!t)
            .filter((t) => (groupBy === 'CONFERENCE' ? t.conference === groupName : t.division === groupName));
    };

    const toggleGroup = (group: string) => {
        if (openGroups.includes(group)) {
            setOpenGroups(openGroups.filter(g => g !== group));
        } else {
            setOpenGroups([...openGroups, group]);
        }
    };

    // Asset Map for Group Headers
    const GROUP_ASSETS: Record<string, { logo?: string, icon?: string }> = {
        'West': { logo: 'https://mediacentral.nba.com/wp-content/uploads/logos/nba/Western_Conference.png' },
        'East': { logo: 'https://mediacentral.nba.com/wp-content/uploads/logos/nba/Eastern_Conference.png' },
        'Pacific': { icon: '🌊' },
        'Northwest': { icon: '🏔️' },
        'Southwest': { icon: '🌵' },
        'Atlantic': { icon: '🗽' },
        'Central': { icon: '🏭' },
        'Southeast': { icon: '🌴' },
    };

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const newPrefs = { ...prefs, isSyncingToStandings: false };

        const activeData = active.data.current;

        // CASE A: Reordering Groups
        if (activeData?.type === 'GROUP') {
            const oldIndex = sortedGroups.indexOf(active.id as string);
            const newIndex = sortedGroups.indexOf(over.id as string);
            if (oldIndex !== -1 && newIndex !== -1) {
                const newGroupOrder = arrayMove(sortedGroups, oldIndex, newIndex);

                // Rebuild Master List based on new Group Order
                let newMasterList: number[] = [];
                newGroupOrder.forEach((g) => {
                    const teamIds = getTeamsInGroup(g).map((t) => t.id);
                    newMasterList = newMasterList.concat(teamIds);
                });
                newPrefs.teamRanks = newMasterList;
                setPrefs(newPrefs);
            }
        }
        // CASE B: Reordering Teams
        else {
            // Standard reorder logic
            const currentOrder = [...prefs.teamRanks];
            const oldIndex = currentOrder.indexOf(active.id as number);
            const newIndex = currentOrder.indexOf(over.id as number);

            if (oldIndex !== -1 && newIndex !== -1) {
                const newOrder = arrayMove(currentOrder, oldIndex, newIndex);
                newPrefs.teamRanks = newOrder;
                setPrefs(newPrefs);
            }
        }
    }

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={sortedGroups} strategy={verticalListSortingStrategy}>
                {sortedGroups.map((g, i) => {
                    const teams = getTeamsInGroup(g);
                    const asset = GROUP_ASSETS[g] || {};
                    return (
                        <SortableAccordion
                            key={g}
                            id={g}
                            label={g}
                            rank={i + 1}
                            isOpen={openGroups.includes(g)}
                            onToggle={() => toggleGroup(g)}
                            logoUrl={asset.logo}
                            icon={asset.icon}
                        >
                            <SortableContext items={teams.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                                {teams.map((t) => (
                                    <SortableTeamItem
                                        key={t.id}
                                        id={t.id}
                                        name={t.name}
                                        rank={prefs.teamRanks.indexOf(t.id) + 1}
                                        logoUrl={t.logoUrl}
                                    />
                                ))}
                            </SortableContext>
                        </SortableAccordion>
                    );
                })}
            </SortableContext>
        </DndContext>
    );
}
