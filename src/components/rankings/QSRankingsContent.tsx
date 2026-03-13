"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  qsRankings2026,
  getNumericRank,
  getUniqueCities,
  getTier,
  type QSUniversity,
  type RankingTier,
} from "@/data/qs-rankings-data";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Trophy, ChevronDown, ChevronUp, ArrowUpRight, Medal, Star, TrendingUp, Filter } from "lucide-react";

interface QSRankingsTranslations {
  topUniversitiesTitle: string;
  browseAllTitle: string;
  searchPlaceholder: string;
  allCities: string;
  showing: string;
  of: string;
  universities: string;
  university: string;
  inCity: string;
  matching: string;
  noResults: string;
  noResultsHint: string;
  overallScore: string;
  score: string;
  world: string;
  china: string;
  ctaTitle: string;
  ctaDescription: string;
  browseUniversities: string;
  explorePrograms: string;
  disclaimer: string;
  visitSite: string;
  viewProfile: string;
  tierTop50: string;
  tierTop200: string;
  tierTop500: string;
  tierRemaining: string;
}

/* ─── Score Bar ──────────────────────────────────────────── */
function ScoreBar({ score, maxScore = 100 }: { score: number; maxScore?: number }) {
  const pct = Math.round((score / maxScore) * 100);
  const color =
    pct >= 80 ? "bg-linear-to-r from-amber-500 to-yellow-400" :
    pct >= 60 ? "bg-linear-to-r from-sky-500 to-blue-400" :
    pct >= 40 ? "bg-linear-to-r from-emerald-500 to-green-400" :
    "bg-linear-to-r from-slate-400 to-gray-300";
  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm font-bold tabular-nums min-w-[42px] text-right">
        {score > 0 ? score.toFixed(1) : "—"}
      </span>
    </div>
  );
}

/* ─── Rank Badge ─────────────────────────────────────────── */
function RankBadge({ rank }: { rank: string }) {
  const num = getNumericRank(rank);
  const isTop5 = num <= 50;
  const isTop200 = num <= 200;
  return (
    <div
      className={`
        flex items-center justify-center rounded-xl font-bold text-lg min-w-[56px] h-14
        ${isTop5
          ? "bg-linear-to-br from-amber-400 to-yellow-500 text-white shadow-lg shadow-amber-200/50"
          : isTop200
            ? "bg-linear-to-br from-sky-400 to-blue-500 text-white shadow-lg shadow-sky-200/50"
            : "bg-linear-to-br from-slate-100 to-slate-200 text-slate-700 dark:from-slate-700 dark:to-slate-800 dark:text-slate-200"
        }
      `}
    >
      #{rank}
    </div>
  );
}


/* ─── Top 5 Spotlight Card ───────────────────────────────── */
function SpotlightCard({ uni, index, t }: { uni: QSUniversity; index: number; t: QSRankingsTranslations }) {
  const medalColors = [
    "from-amber-400 via-yellow-300 to-amber-500",
    "from-gray-300 via-slate-200 to-gray-400",
    "from-amber-600 via-amber-500 to-amber-700",
    "from-sky-400 via-blue-300 to-sky-500",
    "from-emerald-400 via-green-300 to-emerald-500",
  ];
  const medalIcons = [
    <Trophy key="t" className="w-6 h-6" />,
    <Medal key="m" className="w-6 h-6" />,
    <Medal key="m2" className="w-6 h-6" />,
    <Star key="s" className="w-5 h-5" />,
    <Star key="s2" className="w-5 h-5" />,
  ];

  const cardContent = (
    <div
      className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Background glow */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-linear-to-br ${medalColors[index]} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`} />

      <div className="relative z-10">
        {/* Rank + Medal */}
        <div className="flex items-center justify-between mb-4">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-linear-to-r ${medalColors[index]} text-white font-bold text-sm shadow-md`}>
            {medalIcons[index]}
            <span>#{uni.rank} {t.world}</span>
          </div>
          <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>

        {/* University name */}
        <h3 className="text-lg font-bold font-heading mb-2 group-hover:text-primary transition-colors line-clamp-2 min-h-[56px]">
          {uni.name}
        </h3>

        {/* City */}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
          <MapPin className="w-3.5 h-3.5" />
          {uni.city}, {t.china}
        </div>

        {/* Score */}
        <div className="mt-auto">
          <div className="text-xs text-muted-foreground mb-1.5 font-medium uppercase tracking-wider">{t.overallScore}</div>
          <ScoreBar score={uni.overallScore} />
        </div>
      </div>
    </div>
  );

  if (uni.slug) {
    return <Link href={`/universities/${uni.slug}`}>{cardContent}</Link>;
  }
  return cardContent;
}

/* ─── University Row Card ────────────────────────────────── */
function UniversityCard({ uni, t }: { uni: QSUniversity; t: QSRankingsTranslations }) {
  const inner = (
    <div className={`group flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-primary/30 hover:shadow-md transition-all duration-200 ${uni.slug ? "cursor-pointer" : ""}`}>
      {/* Rank */}
      <RankBadge rank={uni.rank} />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm md:text-base truncate group-hover:text-primary transition-colors">
          {uni.name}
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
          <MapPin className="w-3 h-3 shrink-0" />
          <span>{uni.city}</span>
        </div>
      </div>

      {/* Score bar */}
      <div className="hidden sm:block w-48">
        <ScoreBar score={uni.overallScore} />
      </div>

      {/* Mobile score */}
      <div className="sm:hidden text-right">
        <div className="text-xs text-muted-foreground">{t.score}</div>
        <div className="font-bold text-sm">{uni.overallScore > 0 ? uni.overallScore.toFixed(1) : "—"}</div>
      </div>

      {/* View Profile arrow for linked universities */}
      {uni.slug && (
        <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 hidden md:block" />
      )}
    </div>
  );

  if (uni.slug) {
    return <Link href={`/universities/${uni.slug}`}>{inner}</Link>;
  }
  return inner;
}

/* ─── Tier Section ───────────────────────────────────────── */
function TierSection({
  tier,
  universities,
  defaultOpen = false,
  t,
}: {
  tier: RankingTier;
  universities: QSUniversity[];
  defaultOpen?: boolean;
  t: QSRankingsTranslations;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const tierGradients: Record<RankingTier, string> = {
    top50: "from-amber-500/10 to-yellow-500/5 border-amber-200 dark:border-amber-800",
    top200: "from-sky-500/10 to-blue-500/5 border-sky-200 dark:border-sky-800",
    top500: "from-emerald-500/10 to-green-500/5 border-emerald-200 dark:border-emerald-800",
    remaining: "from-slate-500/10 to-gray-500/5 border-slate-200 dark:border-slate-800",
  };
  const tierIconColors: Record<RankingTier, string> = {
    top50: "text-amber-500",
    top200: "text-sky-500",
    top500: "text-emerald-500",
    remaining: "text-slate-500",
  };
  const localTierLabels: Record<RankingTier, string> = {
    top50: t.tierTop50,
    top200: t.tierTop200,
    top500: t.tierTop500,
    remaining: t.tierRemaining,
  };
  return (
    <div className={`rounded-2xl border bg-linear-to-r ${tierGradients[tier]} overflow-hidden`}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full p-5 text-left hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <TrendingUp className={`w-5 h-5 ${tierIconColors[tier]}`} />
          <span className="font-bold text-lg">{localTierLabels[tier]}</span>
          <Badge variant="secondary" className="ml-2">
            {universities.length} {universities.length === 1 ? t.university : t.universities}
          </Badge>
        </div>
        {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      {open && (
        <div className="p-4 pt-0 space-y-2 animate-fade-in">
          {universities.map((uni) => (
            <UniversityCard key={`${uni.rank}-${uni.name}`} uni={uni} t={t} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */
export function QSRankingsContent({ translations }: { translations: QSRankingsTranslations }) {
  const t = translations;
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const cities = useMemo(() => getUniqueCities(), []);

  const filtered = useMemo(() => {
    let list = qsRankings2026;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (u) => u.name.toLowerCase().includes(q) || u.city.toLowerCase().includes(q)
      );
    }
    if (selectedCity !== "all") {
      list = list.filter((u) => u.city === selectedCity);
    }
    return list.sort((a, b) => getNumericRank(a.rank) - getNumericRank(b.rank));
  }, [search, selectedCity]);

  const top5 = useMemo(
    () => qsRankings2026.filter((u) => getNumericRank(u.rank) <= 50).sort((a, b) => getNumericRank(a.rank) - getNumericRank(b.rank)),
    []
  );

  const grouped = useMemo(() => {
    const map: Record<RankingTier, QSUniversity[]> = {
      top50: [],
      top200: [],
      top500: [],
      remaining: [],
    };
    filtered.forEach((u) => {
      map[getTier(u.rank)].push(u);
    });
    return map;
  }, [filtered]);

  const isFiltering = search.trim() !== "" || selectedCity !== "all";

  return (
    <div className="space-y-12">
      {/* ── Top 5 Spotlight ─────────────────────────────────── */}
      {!isFiltering && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 p-2 rounded-lg">
              <Trophy className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold font-heading">{t.topUniversitiesTitle}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {top5.map((uni, i) => (
              <SpotlightCard key={uni.name} uni={uni} index={i} t={t} />
            ))}
          </div>
        </section>
      )}

      {/* ── Search & Filter ─────────────────────────────────── */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-primary/10 text-primary p-2 rounded-lg">
            <Filter className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold font-heading">{t.browseAllTitle}</h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-12 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus-visible:ring-primary"
            />
          </div>

          {/* City filter */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="h-12 pl-10 pr-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium appearance-none cursor-pointer focus:ring-2 focus:ring-primary focus:outline-none min-w-[160px]"
            >
              <option value="all">{t.allCities}</option>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground mb-4">
          {t.showing} <span className="font-bold text-foreground">{filtered.length}</span> {t.of} {qsRankings2026.length} {t.universities}
          {selectedCity !== "all" && <> {t.inCity} <span className="font-bold text-foreground">{selectedCity}</span></>}
          {search.trim() && <> {t.matching} &quot;<span className="font-bold text-foreground">{search}</span>&quot;</>}
        </div>

        {/* Tier accordions */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">{t.noResults}</p>
            <p className="text-sm mt-1">{t.noResultsHint}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {(["top50", "top200", "top500", "remaining"] as RankingTier[]).map((tier) =>
              grouped[tier].length > 0 ? (
                <TierSection
                  key={tier}
                  tier={tier}
                  universities={grouped[tier]}
                  defaultOpen={tier === "top50" || isFiltering}
                  t={t}
                />
              ) : null
            )}
          </div>
        )}
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-r from-primary via-primary/90 to-primary/80 text-white p-8 md:p-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold font-heading mb-4">
            {t.ctaTitle}
          </h2>
          <p className="text-white/80 mb-6 text-lg">
            {t.ctaDescription}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/universities"
              className="inline-flex items-center gap-2 bg-white text-primary font-bold px-6 py-3 rounded-xl hover:bg-white/90 transition-colors shadow-lg"
            >
              {t.browseUniversities}
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href="/programs"
              className="inline-flex items-center gap-2 bg-white/10 text-white border border-white/20 font-bold px-6 py-3 rounded-xl hover:bg-white/20 transition-colors"
            >
              {t.explorePrograms}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Disclaimer ──────────────────────────────────────── */}
      <div className="text-xs text-muted-foreground text-center py-4 border-t">
        {t.disclaimer}{" "}
        <a href="https://www.topuniversities.com/world-university-rankings" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
          {t.visitSite}
        </a>.
      </div>
    </div>
  );
}
