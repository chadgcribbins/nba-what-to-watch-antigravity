"use client";

import type { DragEvent } from "react";
import { useEffect, useMemo, useState } from "react";

type Conference = "East" | "West";
type Division =
  | "Atlantic"
  | "Central"
  | "Southeast"
  | "Northwest"
  | "Pacific"
  | "Southwest";

type Team = {
  id: string;
  name: string;
  conference: Conference;
  division: Division;
};

type Player = {
  id: string;
  name: string;
  teamId: string;
};

type CalendarCell = {
  day: number;
  games: number;
  date: string;
};

type BucketId = "must-see" | "hooper" | "villain";
type TeamView = "league" | "conference" | "division";

const teamOptions: Team[] = [
  { id: "ATL", name: "Hawks", conference: "East", division: "Southeast" },
  { id: "BOS", name: "Celtics", conference: "East", division: "Atlantic" },
  { id: "BKN", name: "Nets", conference: "East", division: "Atlantic" },
  { id: "CHA", name: "Hornets", conference: "East", division: "Southeast" },
  { id: "CHI", name: "Bulls", conference: "East", division: "Central" },
  { id: "CLE", name: "Cavaliers", conference: "East", division: "Central" },
  { id: "DET", name: "Pistons", conference: "East", division: "Central" },
  { id: "IND", name: "Pacers", conference: "East", division: "Central" },
  { id: "MIA", name: "Heat", conference: "East", division: "Southeast" },
  { id: "MIL", name: "Bucks", conference: "East", division: "Central" },
  { id: "NYK", name: "Knicks", conference: "East", division: "Atlantic" },
  { id: "ORL", name: "Magic", conference: "East", division: "Southeast" },
  { id: "PHI", name: "76ers", conference: "East", division: "Atlantic" },
  { id: "TOR", name: "Raptors", conference: "East", division: "Atlantic" },
  { id: "WAS", name: "Wizards", conference: "East", division: "Southeast" },
  { id: "DAL", name: "Mavericks", conference: "West", division: "Southwest" },
  { id: "DEN", name: "Nuggets", conference: "West", division: "Northwest" },
  { id: "GSW", name: "Warriors", conference: "West", division: "Pacific" },
  { id: "HOU", name: "Rockets", conference: "West", division: "Southwest" },
  { id: "LAC", name: "Clippers", conference: "West", division: "Pacific" },
  { id: "LAL", name: "Lakers", conference: "West", division: "Pacific" },
  { id: "MEM", name: "Grizzlies", conference: "West", division: "Southwest" },
  { id: "MIN", name: "Timberwolves", conference: "West", division: "Northwest" },
  { id: "NOP", name: "Pelicans", conference: "West", division: "Southwest" },
  { id: "OKC", name: "Thunder", conference: "West", division: "Northwest" },
  { id: "PHX", name: "Suns", conference: "West", division: "Pacific" },
  { id: "POR", name: "Trail Blazers", conference: "West", division: "Northwest" },
  { id: "SAC", name: "Kings", conference: "West", division: "Pacific" },
  { id: "SAS", name: "Spurs", conference: "West", division: "Southwest" },
  { id: "UTA", name: "Jazz", conference: "West", division: "Northwest" },
];

const teamMap = new Map(teamOptions.map((team) => [team.id, team]));

const defaultStandingsIds = [
  "BOS",
  "OKC",
  "DEN",
  "MIN",
  "LAC",
  "NYK",
  "MIL",
  "CLE",
  "NOP",
  "DAL",
  "ORL",
  "PHX",
  "IND",
  "LAL",
  "PHI",
  "GSW",
  "MIA",
  "CHI",
  "SAC",
  "ATL",
  "BKN",
  "HOU",
  "TOR",
  "UTA",
  "MEM",
  "POR",
  "CHA",
  "WAS",
  "SAS",
  "DET",
] as const;

const defaultTeamOrder = defaultStandingsIds
  .map((id) => teamMap.get(id))
  .filter((team): team is Team => Boolean(team));

const initialTeamOrder =
  defaultTeamOrder.length === teamOptions.length
    ? defaultTeamOrder
    : teamOptions;

const players: Player[] = [
  { id: "sga", name: "Shai Gilgeous-Alexander", teamId: "OKC" },
  { id: "tatum", name: "Jayson Tatum", teamId: "BOS" },
  { id: "brunson", name: "Jalen Brunson", teamId: "NYK" },
  { id: "bam", name: "Bam Adebayo", teamId: "MIA" },
  { id: "embiid", name: "Joel Embiid", teamId: "PHI" },
  { id: "edwards", name: "Anthony Edwards", teamId: "MIN" },
  { id: "jokic", name: "Nikola Jokic", teamId: "DEN" },
  { id: "luka", name: "Luka Doncic", teamId: "DAL" },
  { id: "lebron", name: "LeBron James", teamId: "LAL" },
  { id: "steph", name: "Stephen Curry", teamId: "GSW" },
];

const buckets: { id: BucketId; title: string; description: string }[] = [
  {
    id: "must-see",
    title: "Must-See TV",
    description: "I tune in on purpose.",
  },
  {
    id: "hooper",
    title: "Hooper",
    description: "Respect it, fun to watch.",
  },
  {
    id: "villain",
    title: "Villain",
    description: "Great, but I root against you.",
  },
];

const styleSliders = [
  {
    title: "Offense-first",
    left: "Defense-first",
    right: "Offense-first",
    defaultValue: 65,
  },
  {
    title: "Fast pace",
    left: "Slow pace",
    right: "Fast pace",
    defaultValue: 70,
  },
  {
    title: "Ball movement",
    left: "Isolation",
    right: "Ball movement",
    defaultValue: 58,
  },
  {
    title: "Star duels",
    left: "Team system",
    right: "Star duels",
    defaultValue: 62,
  },
  {
    title: "Chaos swings",
    left: "Steady control",
    right: "Chaos swings",
    defaultValue: 55,
  },
  {
    title: "Rivalry weight",
    left: "Low",
    right: "High",
    defaultValue: 48,
  },
] as const;

const teamViewOptions: { id: TeamView; label: string }[] = [
  { id: "league", label: "League" },
  { id: "conference", label: "Conference" },
  { id: "division", label: "Division" },
];

const watchDateOptions = [
  { label: "Last Night", date: "21 Dec 25", value: "2025-12-21" },
  { label: "Friday", date: "20 Dec 25", value: "2025-12-20" },
  { label: "Thursday", date: "19 Dec 25", value: "2025-12-19" },
  { label: "Wednesday", date: "18 Dec 25", value: "2025-12-18" },
  { label: "Tuesday", date: "17 Dec 25", value: "2025-12-17" },
  { label: "Monday", date: "16 Dec 25", value: "2025-12-16" },
  { label: "Sunday", date: "15 Dec 25", value: "2025-12-15" },
] as const;

const monthLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const profileStorageKey = "nba-watchability-profile-v1";

const defaultConferenceOrder: Conference[] = ["East", "West"];
const defaultDivisionOrder: Division[] = [
  "Atlantic",
  "Central",
  "Southeast",
  "Northwest",
  "Pacific",
  "Southwest",
];

const reorderList = <T,>(items: T[], fromIndex: number, toIndex: number) => {
  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
};

const reorderWithinGroup = (
  items: Team[],
  groupPredicate: (team: Team) => boolean,
  draggedId: string,
  targetId: string,
) => {
  const groupTeams = items.filter(groupPredicate);
  const fromIndex = groupTeams.findIndex((team) => team.id === draggedId);
  const toIndex = groupTeams.findIndex((team) => team.id === targetId);
  if (fromIndex < 0 || toIndex < 0) {
    return items;
  }

  const nextGroup = reorderList(groupTeams, fromIndex, toIndex);
  let groupIndex = 0;

  return items.map((team) =>
    groupPredicate(team) ? nextGroup[groupIndex++] : team,
  );
};

const dataTransferKeys = {
  team: "application/x-team-id",
  player: "application/x-player-id",
  group: "application/x-group-id",
  text: "text/plain",
};

const applyGroupOrder = <T extends string>(
  items: Team[],
  groupOrder: T[],
  getGroup: (team: Team) => T,
) => {
  return groupOrder.flatMap((group) =>
    items.filter((team) => getGroup(team) === group),
  );
};

const conferenceLogos: Record<Conference, string> = {
  East: "/logos/conferences/east.svg",
  West: "/logos/conferences/west.svg",
};

const divisionStyles: Record<
  Division,
  { label: string; accent: string; glow: string }
> = {
  Atlantic: {
    label: "Atlantic",
    accent: "linear-gradient(135deg, #0f2a4d, #1f7a8c)",
    glow: "rgba(31, 122, 140, 0.4)",
  },
  Central: {
    label: "Central",
    accent: "linear-gradient(135deg, #3a2c6e, #f5c15a)",
    glow: "rgba(245, 193, 90, 0.4)",
  },
  Southeast: {
    label: "Southeast",
    accent: "linear-gradient(135deg, #e56b2b, #f5c15a)",
    glow: "rgba(229, 107, 43, 0.4)",
  },
  Northwest: {
    label: "Northwest",
    accent: "linear-gradient(135deg, #1f7a8c, #0f2a4d)",
    glow: "rgba(15, 42, 77, 0.4)",
  },
  Pacific: {
    label: "Pacific",
    accent: "linear-gradient(135deg, #f5c15a, #e56b2b)",
    glow: "rgba(245, 193, 90, 0.4)",
  },
  Southwest: {
    label: "Southwest",
    accent: "linear-gradient(135deg, #6c2d49, #0f2a4d)",
    glow: "rgba(108, 45, 73, 0.4)",
  },
};

const TeamLogo = ({ team }: { team: Team }) => {
  const [failed, setFailed] = useState(false);
  const src = `/logos/teams/${team.id}.svg`;

  if (failed) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--navy)]/20 bg-white/80 text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--navy)]">
        {team.id}
      </div>
    );
  }

  return (
    <img
      alt={`${team.name} logo`}
      className="h-10 w-10 rounded-full border border-[color:var(--navy)]/20 bg-white/90 object-contain p-1"
      draggable={false}
      src={src}
      onError={() => setFailed(true)}
    />
  );
};

const ConferenceBadge = ({ conference }: { conference: Conference }) => {
  return (
    <div className="flex items-center gap-3">
      <img
        alt={`${conference} All-Star logo`}
        className="h-10 w-10 rounded-full border border-[color:var(--navy)]/10 bg-white/80 p-1"
        draggable={false}
        src={conferenceLogos[conference]}
      />
      <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--navy)]/70">
        {conference} Conference
      </span>
    </div>
  );
};

const DivisionBadge = ({ division }: { division: Division }) => {
  const style = divisionStyles[division];
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-2xl text-[10px] font-semibold uppercase tracking-[0.2em] text-white shadow"
        style={{
          backgroundImage: style.accent,
          boxShadow: `0 10px 30px -16px ${style.glow}`,
        }}
      >
        {division.slice(0, 2)}
      </div>
      <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--navy)]/70">
        {style.label} Division
      </span>
    </div>
  );
};

export default function PreferencesPage() {
  const [teamOrder, setTeamOrder] = useState(initialTeamOrder);
  const [teamView, setTeamView] = useState<TeamView>("league");
  const [conferenceOrder, setConferenceOrder] = useState(
    defaultConferenceOrder,
  );
  const [divisionOrder, setDivisionOrder] =
    useState<Division[]>(defaultDivisionOrder);
  const [useStandings, setUseStandings] = useState(true);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [calendarState, setCalendarState] = useState({
    monthIndex: 11,
    year: 2025,
  });
  const [activeTeamId, setActiveTeamId] = useState("all");
  const [search, setSearch] = useState("");
  const [assignments, setAssignments] = useState<Record<string, BucketId | "available">>({
    sga: "must-see",
    tatum: "must-see",
    brunson: "hooper",
    bam: "hooper",
    embiid: "villain",
    edwards: "available",
    jokic: "available",
    luka: "available",
    lebron: "available",
    steph: "available",
  });

  const overallRankMap = useMemo(
    () =>
      new Map(teamOrder.map((team, index) => [team.id, index + 1] as const)),
    [teamOrder],
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const raw = window.localStorage.getItem(profileStorageKey);
    if (!raw) {
      return;
    }
    try {
      const stored = JSON.parse(raw) as {
        teamOrderIds?: string[];
        conferenceOrder?: Conference[];
        divisionOrder?: Division[];
        useStandings?: boolean;
        assignments?: Record<string, BucketId | "available">;
        activeTeamId?: string;
      };

      if (typeof stored.useStandings === "boolean") {
        setUseStandings(stored.useStandings);
      }

      if (stored.useStandings === false && stored.teamOrderIds) {
        const mapped = stored.teamOrderIds
          .map((id) => teamMap.get(id))
          .filter((team): team is Team => Boolean(team));
        if (mapped.length === teamOptions.length) {
          setTeamOrder(mapped);
        }
      }

      if (stored.conferenceOrder?.length === defaultConferenceOrder.length) {
        setConferenceOrder(stored.conferenceOrder);
      }
      if (stored.divisionOrder?.length === defaultDivisionOrder.length) {
        setDivisionOrder(stored.divisionOrder);
      }
      if (stored.assignments) {
        setAssignments(stored.assignments);
      }
      if (stored.activeTeamId) {
        setActiveTeamId(stored.activeTeamId);
      }
    } catch {
      window.localStorage.removeItem(profileStorageKey);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const payload = {
      teamOrderIds: teamOrder.map((team) => team.id),
      conferenceOrder,
      divisionOrder,
      useStandings,
      assignments,
      activeTeamId,
    };
    window.localStorage.setItem(profileStorageKey, JSON.stringify(payload));
  }, [teamOrder, conferenceOrder, divisionOrder, useStandings, assignments, activeTeamId]);

  const calendarMonthLabel = `${monthLabels[
    calendarState.monthIndex
  ].toUpperCase()} ${String(calendarState.year).slice(-2)}`;

  const calendarCells = useMemo(() => {
    const daysInMonth = new Date(
      calendarState.year,
      calendarState.monthIndex + 1,
      0,
    ).getDate();
    const offset = new Date(
      calendarState.year,
      calendarState.monthIndex,
      1,
    ).getDay();
    const cells: Array<CalendarCell | null> = Array.from(
      { length: offset },
      () => null,
    );

    for (let day = 1; day <= daysInMonth; day += 1) {
      const games =
        day % 6 === 0 ? 10 : day % 5 === 0 ? 7 : day % 4 === 0 ? 5 : 2;
      const date = `${calendarState.year}-${String(
        calendarState.monthIndex + 1,
      ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      cells.push({ day, games, date });
    }

    return cells;
  }, [calendarState]);

  const shiftCalendarMonth = (delta: number) => {
    setCalendarState((prev) => {
      let monthIndex = prev.monthIndex + delta;
      let year = prev.year;
      if (monthIndex < 0) {
        monthIndex = 11;
        year -= 1;
      }
      if (monthIndex > 11) {
        monthIndex = 0;
        year += 1;
      }
      return { monthIndex, year };
    });
    setDatePickerOpen(true);
  };

  const teamGroups = useMemo(() => {
    if (teamView === "league") {
      return [
        {
          id: "league",
          label: "League",
          teams: teamOrder,
        },
      ];
    }

    if (teamView === "conference") {
      return conferenceOrder.map((conference) => ({
        id: conference,
        label: `${conference} Conference`,
        teams: teamOrder.filter((team) => team.conference === conference),
      }));
    }

    return divisionOrder.map((division) => ({
      id: division,
      label: `${division} Division`,
      teams: teamOrder.filter((team) => team.division === division),
    }));
  }, [conferenceOrder, divisionOrder, teamOrder, teamView]);

  const visiblePlayers = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return players.filter((player) => {
      const inTeam = activeTeamId === "all" || player.teamId === activeTeamId;
      const matches = player.name.toLowerCase().includes(needle);
      return inTeam && matches;
    });
  }, [activeTeamId, search]);

  const availablePlayers = visiblePlayers.filter(
    (player) => assignments[player.id] === "available",
  );

  const handleTeamDrop =
    (targetTeam: Team) => (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const draggedId =
        event.dataTransfer.getData(dataTransferKeys.team) ||
        event.dataTransfer.getData(dataTransferKeys.text);
      if (!draggedId || draggedId === targetTeam.id) {
        return;
      }
      if (!teamMap.has(draggedId)) {
        return;
      }

      setUseStandings(false);
      setTeamOrder((prev) => {
        if (teamView === "league") {
          const fromIndex = prev.findIndex((team) => team.id === draggedId);
          const toIndex = prev.findIndex((team) => team.id === targetTeam.id);
          if (fromIndex < 0 || toIndex < 0) {
            return prev;
          }
          return reorderList(prev, fromIndex, toIndex);
        }

        if (teamView === "conference") {
          return reorderWithinGroup(
            prev,
            (team) => team.conference === targetTeam.conference,
            draggedId,
            targetTeam.id,
          );
        }

        return reorderWithinGroup(
          prev,
          (team) => team.division === targetTeam.division,
          draggedId,
          targetTeam.id,
        );
      });
    };

  const handleConferenceDrop =
    (target: Conference) => (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const dragged =
        event.dataTransfer.getData(dataTransferKeys.group) ||
        event.dataTransfer.getData(dataTransferKeys.text);
      if (!dragged || dragged === target) {
        return;
      }
      if (!conferenceOrder.includes(dragged as Conference)) {
        return;
      }

      setUseStandings(false);
      setConferenceOrder((prev) => {
        const fromIndex = prev.indexOf(dragged as Conference);
        const toIndex = prev.indexOf(target);
        if (fromIndex < 0 || toIndex < 0) {
          return prev;
        }
        const next = reorderList(prev, fromIndex, toIndex);
        setTeamOrder((teams) =>
          applyGroupOrder(teams, next, (team) => team.conference),
        );
        return next;
      });
    };

  const handleDivisionDrop =
    (target: Division) => (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const dragged =
        event.dataTransfer.getData(dataTransferKeys.group) ||
        event.dataTransfer.getData(dataTransferKeys.text);
      if (!dragged || dragged === target) {
        return;
      }
      if (!divisionOrder.includes(dragged as Division)) {
        return;
      }

      setUseStandings(false);
      setDivisionOrder((prev) => {
        const fromIndex = prev.indexOf(dragged as Division);
        const toIndex = prev.indexOf(target);
        if (fromIndex < 0 || toIndex < 0) {
          return prev;
        }
        const next = reorderList(prev, fromIndex, toIndex);
        setTeamOrder((teams) =>
          applyGroupOrder(teams, next, (team) => team.division),
        );
        return next;
      });
    };

  const handleStandingsToggle = (checked: boolean) => {
    setUseStandings(checked);
    if (checked) {
      setTeamOrder(initialTeamOrder);
      setConferenceOrder(defaultConferenceOrder);
      setDivisionOrder(defaultDivisionOrder);
    }
  };

  const handlePlayerDrop =
    (bucketId: BucketId | "available") =>
    (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const playerId =
      event.dataTransfer.getData(dataTransferKeys.player) ||
      event.dataTransfer.getData(dataTransferKeys.text);
    if (!playerId) {
      return;
    }
    if (!players.some((player) => player.id === playerId)) {
      return;
    }

    setAssignments((prev) => ({
      ...prev,
      [playerId]: bucketId,
    }));
  };

  return (
    <div className="app-shell">
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-12 md:px-12">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--navy)]/60">
              Edit profile
            </p>
            <h1 className="font-display text-5xl text-[color:var(--ink)]">
              Build your watchability DNA.
            </h1>
            <p className="mt-2 text-sm text-[color:var(--navy)]/70">
              Preferences are stored locally and can be tweaked anytime.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <details className="relative">
              <summary className="card-shadow inline-flex cursor-pointer items-center justify-between gap-3 rounded-full bg-[color:var(--navy)] px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--paper)]">
                What to watch?
                <span aria-hidden className="text-[10px]">
                  ▼
                </span>
              </summary>
              <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-[color:var(--navy)]/20 bg-white/95 p-3 text-xs shadow-lg">
                <div className="space-y-2">
                  {watchDateOptions.map((option) => (
                    <a
                      key={option.label}
                      className="flex w-full items-center justify-between rounded-xl border border-transparent px-3 py-2 text-left text-[color:var(--ink)] hover:border-[color:var(--navy)]/20 hover:bg-[color:var(--paper)]"
                      href={`/results?date=${option.value}`}
                    >
                      <span className="flex flex-col">
                        <span className="text-sm font-semibold uppercase tracking-[0.2em]">
                          {option.label}
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--navy)]/60">
                          ({option.date})
                        </span>
                      </span>
                    </a>
                  ))}
                </div>
                <div className="my-3 h-px bg-[color:var(--navy)]/10" />
                <div className="flex items-center justify-between rounded-xl border border-[color:var(--navy)]/20 px-3 py-2 text-[color:var(--navy)]">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-[color:var(--navy)]/20 text-xs"
                      onClick={() => shiftCalendarMonth(-1)}
                    >
                      {"<"}
                    </button>
                    <button
                      type="button"
                      className="text-sm font-semibold uppercase tracking-[0.2em]"
                      onClick={() => setDatePickerOpen((open) => !open)}
                    >
                      {calendarMonthLabel}
                    </button>
                    <button
                      type="button"
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-[color:var(--navy)]/20 text-xs"
                      onClick={() => shiftCalendarMonth(1)}
                    >
                      {">"}
                    </button>
                  </div>
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-[color:var(--navy)]/20"
                    onClick={() => setDatePickerOpen((open) => !open)}
                  >
                    <svg
                      aria-hidden
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <path d="M16 2v4M8 2v4M3 10h18" />
                    </svg>
                  </button>
                </div>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    datePickerOpen
                      ? "mt-3 max-h-[520px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="rounded-2xl border border-[color:var(--navy)]/10 bg-[color:var(--paper)] p-3">
                    <div className="grid grid-cols-7 gap-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[color:var(--navy)]/50">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                        (day) => (
                          <span key={day} className="text-center">
                            {day}
                          </span>
                        ),
                      )}
                    </div>
                    <div className="mt-2 grid grid-cols-7 gap-2 text-[11px] text-[color:var(--ink)]">
                      {calendarCells.map((cell, index) =>
                        cell ? (
                          <a
                            key={`${cell.day}-${index}`}
                            className="rounded-2xl border border-transparent bg-white/80 px-1 py-2 text-center text-[color:var(--ink)] hover:border-[color:var(--navy)]/20 hover:bg-white"
                            href={`/results?date=${cell.date}`}
                          >
                            <div className="text-sm font-semibold">
                              {cell.day}
                            </div>
                            <div className="text-[8px] font-semibold uppercase tracking-[0.2em] text-[color:var(--navy)]/60">
                              {cell.games}G
                            </div>
                          </a>
                        ) : (
                          <div
                            key={`blank-${index}`}
                            className="rounded-2xl border border-transparent bg-transparent px-1 py-2"
                          />
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </details>
            <span className="self-center text-[10px] font-semibold uppercase tracking-[0.25em] text-[color:var(--navy)]/60">
              Auto-saving
            </span>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="card-shadow rounded-3xl border border-[color:var(--navy)]/10 bg-[color:var(--paper)] p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--navy)]/60">
                  Teams
                </p>
                <h2 className="font-display text-3xl text-[color:var(--ink)]">
                  Rank the squads you want to see.
                </h2>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex rounded-full border border-[color:var(--navy)]/20 bg-white/70 p-1 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--navy)]/70">
                  {teamViewOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setTeamView(option.id)}
                      className={`rounded-full px-4 py-2 ${
                        teamView === option.id
                          ? "bg-[color:var(--navy)] text-[color:var(--paper)]"
                          : ""
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[color:var(--navy)]/70">
                  <label className="flex items-center gap-2 font-semibold uppercase tracking-[0.2em]">
                    <input
                      type="checkbox"
                      checked={useStandings}
                      onChange={(event) =>
                        handleStandingsToggle(event.target.checked)
                      }
                    />
                    Use current standings (snapshot)
                  </label>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--navy)]/50">
                    Uncheck to customize
                  </span>
                </div>
                <p className="text-xs text-[color:var(--navy)]/60">
                  Editing this view reorders the canonical league list.
                </p>
              </div>
            </div>

            <div
              className={`mt-6 grid gap-4 ${
                teamView === "division"
                  ? "md:grid-cols-2 xl:grid-cols-3"
                  : teamView === "conference"
                    ? "md:grid-cols-2"
                    : "grid-cols-1"
              }`}
            >
              {teamGroups.map((group) => (
                <div key={group.id} className="space-y-3">
                  {teamView === "league" ? null : (
                    <div
                      className="flex items-center justify-between rounded-2xl border border-[color:var(--navy)]/10 bg-white/70 px-3 py-2"
                      draggable
                      onDragStart={(event) => {
                        event.dataTransfer.setData(
                          dataTransferKeys.group,
                          String(group.id),
                        );
                        event.dataTransfer.setData(
                          dataTransferKeys.text,
                          String(group.id),
                        );
                        event.dataTransfer.effectAllowed = "move";
                      }}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={
                        teamView === "conference"
                          ? handleConferenceDrop(group.id as Conference)
                          : handleDivisionDrop(group.id as Division)
                      }
                    >
                      <span className="rounded-full border border-[color:var(--navy)]/20 bg-[color:var(--paper)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--navy)]/60">
                        #{teamView === "conference"
                          ? conferenceOrder.indexOf(group.id as Conference) + 1
                          : divisionOrder.indexOf(group.id as Division) + 1}
                      </span>
                      {teamView === "conference" ? (
                        <ConferenceBadge conference={group.id as Conference} />
                      ) : (
                        <DivisionBadge division={group.id as Division} />
                      )}
                      <span className="flex flex-col items-center text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--navy)]/50">
                        <span className="rounded-full border border-[color:var(--navy)]/20 bg-[color:var(--paper)] px-2 py-1 font-mono text-[10px] tracking-[0.3em]">
                          |||
                        </span>
                        <span className="mt-1">Drag</span>
                      </span>
                    </div>
                  )}
                  {group.teams.map((team, index) => {
                    const overallRank = overallRankMap.get(team.id) ?? index + 1;
                    const displayRank =
                      teamView === "league" ? overallRank : index + 1;
                    return (
                      <div
                        key={team.id}
                        className="flex items-center justify-between rounded-2xl border border-[color:var(--navy)]/10 bg-white/70 px-4 py-3 text-sm font-semibold text-[color:var(--ink)]"
                        draggable
                        onDragStart={(event) => {
                          event.dataTransfer.setData(
                            dataTransferKeys.team,
                            team.id,
                          );
                          event.dataTransfer.setData(
                            dataTransferKeys.text,
                            team.id,
                          );
                          event.dataTransfer.effectAllowed = "move";
                        }}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={handleTeamDrop(team)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-display text-2xl text-[color:var(--orange)]">
                            {displayRank}
                          </span>
                          <TeamLogo team={team} />
                          <div>
                            <span>{team.name}</span>
                            {teamView === "league" ? null : (
                              <p className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--navy)]/50">
                                Overall #{overallRank}
                              </p>
                            )}
                          </div>
                        </div>
                        <span className="flex flex-col items-center text-[10px] uppercase tracking-[0.2em] text-[color:var(--navy)]/50">
                          <span className="rounded-full border border-[color:var(--navy)]/20 bg-[color:var(--paper)] px-2 py-1 font-mono text-[10px] tracking-[0.3em]">
                            |||
                          </span>
                          <span className="mt-1">Drag</span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-[color:var(--navy)]/10 bg-[color:var(--paper)]/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--navy)]/60">
                Team weight
              </p>
              <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--navy)]/70">
                {["Light", "Medium", "Strong"].map((label, index) => (
                  <label
                    key={label}
                    className={`cursor-pointer rounded-full border border-[color:var(--navy)]/20 px-4 py-2 ${
                      index === 0 ? "bg-[color:var(--navy)] text-[color:var(--paper)]" : "bg-white/70"
                    }`}
                  >
                    <input
                      className="sr-only"
                      type="radio"
                      name="team-weight"
                      defaultChecked={index === 0}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card-shadow rounded-3xl border border-[color:var(--navy)]/10 bg-[color:var(--paper)] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--navy)]/60">
                Player picks
              </p>
              <h2 className="font-display mt-2 text-3xl text-[color:var(--ink)]">
                Drag players into buckets.
              </h2>
              <div className="mt-4 grid gap-3 text-sm text-[color:var(--navy)]/70">
                <div className="rounded-2xl border border-[color:var(--navy)]/10 bg-white/70 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--navy)]/60">
                    Team dropdown
                  </p>
                  <select
                    className="mt-2 w-full rounded-full border border-[color:var(--navy)]/20 bg-white/80 px-4 py-2 text-sm font-semibold text-[color:var(--ink)]"
                    onChange={(event) => setActiveTeamId(event.target.value)}
                    value={activeTeamId}
                  >
                    <option value="all">All teams</option>
                    {teamOptions.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="rounded-2xl border border-[color:var(--navy)]/10 bg-white/70 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--navy)]/60">
                    Player search
                  </p>
                  <input
                    className="mt-2 w-full rounded-full border border-[color:var(--navy)]/20 bg-white/80 px-4 py-2 text-sm text-[color:var(--ink)]"
                    placeholder="Search by player name"
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-[color:var(--navy)]/10 bg-white/70 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--orange)]">
                Leaders tray
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--navy)]/70">
                {[
                  "Points",
                  "Rebounds",
                  "Assists",
                  "Steals",
                  "Blocks",
                  "3PT made",
                  "FG%",
                  "FT%",
                  "Minutes",
                ].map((category) => (
                  <span
                    key={category}
                    className="rounded-full border border-[color:var(--navy)]/20 bg-[color:var(--paper)] px-3 py-1"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            <div
              className="rounded-3xl border border-dashed border-[color:var(--navy)]/30 bg-[color:var(--paper)] p-6"
              onDragOver={(event) => event.preventDefault()}
              onDrop={handlePlayerDrop("available")}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--navy)]/60">
                Available players
              </p>
              <p className="mt-2 text-sm text-[color:var(--navy)]/70">
                Drag players from here into buckets or back again.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {availablePlayers.map((player) => (
                  <span
                    key={player.id}
                    className="rounded-full border border-[color:var(--navy)]/20 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--navy)]/70"
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.setData(
                        dataTransferKeys.player,
                        player.id,
                      );
                      event.dataTransfer.setData(
                        dataTransferKeys.text,
                        player.id,
                      );
                      event.dataTransfer.effectAllowed = "move";
                    }}
                  >
                    {player.name}
                  </span>
                ))}
                {availablePlayers.length === 0 ? (
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--navy)]/40">
                    No players in this view
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {buckets.map((bucket) => {
            const bucketPlayers = players.filter(
              (player) => assignments[player.id] === bucket.id,
            );
            return (
              <div
                key={bucket.title}
                className="card-shadow rounded-3xl border border-[color:var(--navy)]/10 bg-[color:var(--paper)] p-6"
                onDragOver={(event) => event.preventDefault()}
                onDrop={handlePlayerDrop(bucket.id)}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--navy)]/60">
                  {bucket.title}
                </p>
                <p className="mt-2 text-sm text-[color:var(--navy)]/70">
                  {bucket.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {bucketPlayers.map((player) => (
                    <span
                      key={player.id}
                      className="rounded-full border border-[color:var(--navy)]/20 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--navy)]/70"
                      draggable
                    onDragStart={(event) => {
                      event.dataTransfer.setData(
                        dataTransferKeys.player,
                        player.id,
                      );
                      event.dataTransfer.setData(
                        dataTransferKeys.text,
                        player.id,
                      );
                      event.dataTransfer.effectAllowed = "move";
                    }}
                    >
                      {player.name}
                    </span>
                  ))}
                  <span className="rounded-full border border-dashed border-[color:var(--navy)]/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--navy)]/40">
                    Drop player
                  </span>
                </div>
              </div>
            );
          })}
        </section>

        <section className="card-shadow rounded-3xl border border-[color:var(--navy)]/10 bg-[color:var(--paper)] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--navy)]/60">
            Style sliders
          </p>
          <h2 className="font-display mt-2 text-3xl text-[color:var(--ink)]">
            Tune the vibe of basketball you crave.
          </h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {styleSliders.map((slider) => (
              <div key={slider.title} className="rounded-2xl bg-white/70 p-4">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--navy)]/60">
                  <span>{slider.left}</span>
                  <span>{slider.right}</span>
                </div>
                <input
                  className="mt-3 w-full accent-[color:var(--orange)]"
                  type="range"
                  min={0}
                  max={100}
                  defaultValue={slider.defaultValue}
                />
                <p className="mt-2 text-sm font-semibold text-[color:var(--ink)]">
                  {slider.title}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
