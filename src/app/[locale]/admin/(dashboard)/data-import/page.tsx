"use client";

import { useState, useRef, useCallback } from "react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Upload,
  Database,
  CheckCircle2,
  Loader2,
  Building2,
  GraduationCap,
  ArrowRight,
  RefreshCcw,
  Search,
  Sparkles,
  Wrench,
  MessageSquareText,
  ExternalLink,
} from "lucide-react";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* Types                                                     */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

interface UniversitySummary {
  name: string;
  programCount: number;
  levels: string[];
  languages: string[];
  location: string;
  existsInDb: boolean;
  dbId: string | null;
}

interface ParseSummary {
  totalRows: number;
  totalUniversities: number;
  newUniversities: number;
  existingUniversities: number;
  universities: UniversitySummary[];
}

interface LogEntry {
  id: number;
  type: "info" | "success" | "error" | "warning" | "progress";
  message: string;
  timestamp: Date;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* Main Component                                            */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function DataImportPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [parseSummary, setParseSummary] = useState<ParseSummary | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [uniProgress, setUniProgress] = useState({ processed: 0, created: 0, skipped: 0, errors: 0, total: 0 });
  const [progProgress, setProgProgress] = useState({ created: 0, skipped: 0, errors: 0, total: 0 });
  const [importComplete, setImportComplete] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [showFilter, setShowFilter] = useState<"all" | "new" | "existing">("all");
  const [selectedUnis, setSelectedUnis] = useState<Set<string>>(new Set());
  const [resumeFromUniversity, setResumeFromUniversity] = useState("");
  const [onlyEmptyUniversities, setOnlyEmptyUniversities] = useState(false);
  const [isBackfilling, setIsBackfilling] = useState(false);
  const [backfillResume, setBackfillResume] = useState("");
  const [isBulkFixing, setIsBulkFixing] = useState(false);
  const [bulkFixResume, setBulkFixResume] = useState("");
  const [bulkFixForceAll, setBulkFixForceAll] = useState(false);
  const [bulkFixProgress, setBulkFixProgress] = useState({ fixed: 0, skipped: 0, errors: 0, scanned: 0, uniProcessed: 0, totalUnis: 0 });
  const logEndRef = useRef<HTMLDivElement>(null);
  const logIdCounter = useRef(0);

  const addLog = useCallback((type: LogEntry["type"], message: string) => {
    logIdCounter.current++;
    setLogs(prev => [...prev, { id: logIdCounter.current, type, message, timestamp: new Date() }]);
    setTimeout(() => logEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }, []);

  /* ── Step 1: Parse Excel ──────────────────────────────── */
  const handleParse = async () => {
    setIsParsing(true);
    setLogs([]);
    addLog("info", "📄 Parsing Excel file...");

    try {
      const res = await fetch("/api/import/parse", { method: "POST" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Parse failed");
      }
      const data: ParseSummary = await res.json();
      setParseSummary(data);
      // Pre-select all new universities
      setSelectedUnis(new Set(data.universities.filter(u => !u.existsInDb).map(u => u.name)));
      addLog("success", `✅ Found ${data.totalUniversities} universities, ${data.totalRows} programs`);
      addLog("info", `  📌 ${data.newUniversities} new • ${data.existingUniversities} already in database`);
    } catch (error: any) {
      addLog("error", `❌ Parse failed: ${error.message}`);
    } finally {
      setIsParsing(false);
    }
  };

  /* ── Step 2: Import Universities ──────────────────────── */
  const handleImportUniversities = async () => {
    if (!parseSummary) return;
    setIsImporting(true);
    setImportComplete(false);
    setStep(2);

    const newUnis = parseSummary.universities.filter(
      u => selectedUnis.has(u.name) && !u.existsInDb
    );

    if (newUnis.length === 0) {
      addLog("info", "⏭️ No new universities to import. Proceeding to programs...");
      setStep(3);
      setIsImporting(false);
      return;
    }

    setUniProgress({ processed: 0, created: 0, skipped: 0, errors: 0, total: newUnis.length });
    addLog("info", `🏫 Importing ${newUnis.length} new universities with AI enrichment...`);

    try {
      const res = await fetch("/api/import/universities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          universities: newUnis.map(u => ({
            name: u.name,
            location: u.location,
            programCount: u.programCount,
          })),
        }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No response stream");

      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));

            if (data.type === "progress") {
              setUniProgress({
                processed: data.processed,
                created: data.created,
                skipped: data.skipped,
                errors: data.errors,
                total: newUnis.length,
              });
              const logType = data.status === "error" ? "error" : data.status === "skipped" ? "warning" : "success";
              addLog(logType, data.message);
            } else if (data.type === "complete") {
              addLog("success", data.message);
            } else if (data.type === "error") {
              addLog("error", data.message);
            }
          } catch {}
        }
      }
    } catch (error: any) {
      addLog("error", `❌ University import error: ${error.message}`);
    } finally {
      setIsImporting(false);
    }
  };

  /* ── Step 3: Import Programs ──────────────────────────── */
  const handleImportPrograms = async () => {
    if (!parseSummary) return;
    setIsImporting(true);
    setImportComplete(false);
    setStep(3);

    const targetUnis = parseSummary.universities.filter(u => selectedUnis.has(u.name) || u.existsInDb);
    const totalProgs = targetUnis.reduce((sum, u) => sum + u.programCount, 0);

    setProgProgress({ created: 0, skipped: 0, errors: 0, total: totalProgs });
    addLog("info", `📚 Importing programs for ${targetUnis.length} universities (${totalProgs} total)...`);

    try {
      const res = await fetch("/api/import/programs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          universityNames: targetUnis.map(u => u.name),
          ...(resumeFromUniversity.trim() ? { startFromUniversity: resumeFromUniversity.trim() } : {}),
          ...(onlyEmptyUniversities ? { onlyEmptyUniversities: true } : {}),
        }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No response stream");

      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));

            if (data.created !== undefined) {
              setProgProgress({
                created: data.created,
                skipped: data.skipped,
                errors: data.errors,
                total: data.totalPrograms || totalProgs,
              });
            }

            if (data.type === "info") {
              addLog("info", data.message);
            } else if (data.type === "incomplete-preview") {
              // Show the summary
              addLog("info", data.message);
              // Log each incomplete university
              if (data.universities && Array.isArray(data.universities)) {
                for (const uni of data.universities) {
                  addLog("warning", `  📌 ${uni.name}: Excel=${uni.excelCount}, DB=${uni.dbCount}, Missing=${uni.missing}`);
                }
              }
              // Update progress total
              setProgProgress(prev => ({ ...prev, total: data.totalPrograms || prev.total }));
            } else if (data.type === "uni-skip") {
              addLog("warning", data.message);
            } else if (data.type === "uni-start" || data.type === "uni-done") {
              addLog(data.type === "uni-done" ? "success" : "info", data.message);
            } else if (data.type === "uni-error" || data.type === "program-error") {
              addLog("error", data.message);
            } else if (data.type === "batch-done") {
              addLog("success", data.message);
            } else if (data.type === "batch-skip") {
              addLog("warning", data.message);
            } else if (data.type === "complete") {
              addLog("success", data.message);
              setImportComplete(true);
            } else if (data.type === "error") {
              addLog("error", data.message);
            }
          } catch {}
        }
      }
    } catch (error: any) {
      addLog("error", `❌ Program import error: ${error.message}`);
    } finally {
      setIsImporting(false);
      setImportComplete(true);
    }
  };

  /* ── Backfill Entry Requirements ────────────────────── */
  const handleBackfillRequirements = async () => {
    setIsBackfilling(true);
    addLog("info", "🔧 Starting entry requirements backfill...");

    try {
      const res = await fetch("/api/import/backfill-requirements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(backfillResume.trim() ? { startFromUniversity: backfillResume.trim() } : {}),
        }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No response stream");

      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === "complete") {
              addLog("success", data.message);
            } else if (data.type === "error") {
              addLog("error", data.message);
            } else if (data.type === "uni-start" || data.type === "uni-done") {
              addLog(data.type === "uni-done" ? "success" : "info", data.message);
            } else if (data.type === "warning" || data.type === "resume") {
              addLog("warning", data.message);
            } else {
              addLog("info", data.message);
            }
          } catch {}
        }
      }
    } catch (error: any) {
      addLog("error", `❌ Backfill error: ${error.message}`);
    } finally {
      setIsBackfilling(false);
    }
  };

  /* ── Bulk Fix All Entry Requirements (DB only) ─────── */
  const handleBulkFixRequirements = async () => {
    setIsBulkFixing(true);
    setBulkFixProgress({ fixed: 0, skipped: 0, errors: 0, scanned: 0, uniProcessed: 0, totalUnis: 0 });
    addLog("info", `🔧 Starting bulk fix all entry requirements${bulkFixForceAll ? " (force re-process all)" : ""}...`);

    try {
      const res = await fetch("/api/import/bulk-fix-requirements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          forceAll: bulkFixForceAll,
          ...(bulkFixResume.trim() ? { startFromUniversity: bulkFixResume.trim() } : {}),
        }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No response stream");

      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));

            // Update progress counters
            if (data.totalFixed !== undefined || data.totalScanned !== undefined) {
              setBulkFixProgress(prev => ({
                fixed: data.totalFixed ?? prev.fixed,
                skipped: data.totalSkipped ?? prev.skipped,
                errors: data.totalErrors ?? prev.errors,
                scanned: data.totalScanned ?? prev.scanned,
                uniProcessed: data.uniProcessed ?? prev.uniProcessed,
                totalUnis: data.totalUnis ?? prev.totalUnis,
              }));
            }

            if (data.type === "complete") {
              addLog("success", data.message);
            } else if (data.type === "error") {
              addLog("error", data.message);
            } else if (data.type === "uni-start") {
              addLog("info", data.message);
            } else if (data.type === "uni-done") {
              addLog("success", data.message);
            } else if (data.type === "resume") {
              addLog("warning", data.message);
            } else {
              addLog("info", data.message);
            }
          } catch {}
        }
      }
    } catch (error: any) {
      addLog("error", `❌ Bulk fix error: ${error.message}`);
    } finally {
      setIsBulkFixing(false);
    }
  };



  /* ── Filter logic ─────────────────────────────────────── */
  const filteredUniversities = parseSummary?.universities.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(searchFilter.toLowerCase());
    const matchFilter =
      showFilter === "all" ? true :
      showFilter === "new" ? !u.existsInDb :
      u.existsInDb;
    return matchSearch && matchFilter;
  }) || [];

  const toggleSelectAll = () => {
    const names = filteredUniversities.filter(u => !u.existsInDb).map(u => u.name);
    const allSelected = names.every(n => selectedUnis.has(n));
    const next = new Set(selectedUnis);
    names.forEach(n => allSelected ? next.delete(n) : next.add(n));
    setSelectedUnis(next);
  };

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* Render                                                  */
  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
            Data Import
          </h1>
          <p className="text-muted-foreground mt-1">
            Import universities and programs from the Excel spreadsheet
          </p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2 p-4 bg-card rounded-xl border">
        {[
          { n: 1, icon: Upload, label: "Parse & Review" },
          { n: 2, icon: Building2, label: "Import Universities" },
          { n: 3, icon: GraduationCap, label: "Import Programs" },
        ].map(({ n, icon: Icon, label }, i) => (
          <div key={n} className="flex items-center gap-2">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                step === n
                  ? "bg-primary/10 text-primary font-semibold border border-primary/20"
                  : step > n
                  ? "bg-green-500/10 text-green-600 dark:text-green-400"
                  : "text-muted-foreground"
              }`}
            >
              {step > n ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <Icon className="h-5 w-5" />
              )}
              <span className="text-sm">{label}</span>
            </div>
            {i < 2 && <ArrowRight className="h-4 w-4 text-muted-foreground/40" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Controls */}
        <div className="space-y-4">
          {/* Step 1: Parse */}
          <div className="bg-card rounded-xl border p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Step 1: Parse Excel</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Read <code className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">
                combined_data_2026-03-0.xlsx
              </code> and analyze contents.
            </p>

            <Button
              onClick={handleParse}
              disabled={isParsing || isImporting}
              className="w-full"
              size="lg"
            >
              {isParsing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Parsing...
                </>
              ) : parseSummary ? (
                <>
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Re-Parse File
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  Parse Excel File
                </>
              )}
            </Button>

            {/* Summary Stats */}
            {parseSummary && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-muted/30 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-foreground">{parseSummary.totalRows.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Total Programs</div>
                </div>
                <div className="bg-muted/30 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-foreground">{parseSummary.totalUniversities}</div>
                  <div className="text-xs text-muted-foreground">Universities</div>
                </div>
                <div className="bg-green-500/10 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{parseSummary.existingUniversities}</div>
                  <div className="text-xs text-muted-foreground">Already in DB</div>
                </div>
                <div className="bg-yellow-500/10 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{parseSummary.newUniversities}</div>
                  <div className="text-xs text-muted-foreground">New to Import</div>
                </div>
              </div>
            )}
          </div>

          {/* Step 2/3: Import Actions */}
          {parseSummary && (
            <div className="bg-card rounded-xl border p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Import Actions</h2>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleImportUniversities}
                  disabled={isImporting || selectedUnis.size === 0}
                  className="w-full"
                  variant={step >= 2 ? "outline" : "default"}
                  size="lg"
                >
                  {isImporting && step === 2 ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Importing Universities...
                    </>
                  ) : (
                    <>
                      <Building2 className="h-4 w-4 mr-2" />
                      Import Universities ({selectedUnis.size} selected)
                    </>
                  )}
                </Button>

                {/* Resume from university input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Resume from university (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. University of Science and Technology of China"
                    value={resumeFromUniversity}
                    onChange={e => setResumeFromUniversity(e.target.value)}
                    disabled={isImporting}
                    className="w-full px-3 py-2 text-sm bg-muted/30 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                  {resumeFromUniversity.trim() && (
                    <p className="text-[11px] text-yellow-600 dark:text-yellow-400">
                      ⏭️ Will skip all universities before &quot;{resumeFromUniversity.trim()}&quot;
                    </p>
                  )}
                </div>

                {/* Only incomplete universities toggle */}
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-muted/30 transition-colors">
                  <input
                    type="checkbox"
                    checked={onlyEmptyUniversities}
                    onChange={(e) => setOnlyEmptyUniversities(e.target.checked)}
                    disabled={isImporting}
                    className="rounded"
                  />
                  <div>
                    <span className="text-sm text-foreground font-medium">
                      Only incomplete universities
                    </span>
                    <p className="text-[11px] text-muted-foreground">
                      Resume import — only process universities where DB has fewer programs than the Excel sheet
                    </p>
                  </div>
                </label>

                <Button
                  onClick={handleImportPrograms}
                  disabled={isImporting}
                  className="w-full"
                  variant={step === 3 ? "default" : "outline"}
                  size="lg"
                >
                  {isImporting && step === 3 ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Importing Programs...
                    </>
                  ) : (
                    <>
                      <GraduationCap className="h-4 w-4 mr-2" />
                      {resumeFromUniversity.trim() ? "Resume Programs Import" : "Import Programs"}
                    </>
                  )}
                </Button>
              </div>

              {/* Progress Bars */}
              {(step === 2 && uniProgress.total > 0) && (
                <ProgressBar
                  label="Universities"
                  processed={uniProgress.processed}
                  total={uniProgress.total}
                  created={uniProgress.created}
                  skipped={uniProgress.skipped}
                  errors={uniProgress.errors}
                />
              )}

              {(step === 3 && progProgress.total > 0) && (
                <ProgressBar
                  label="Programs"
                  processed={progProgress.created + progProgress.skipped + progProgress.errors}
                  total={progProgress.total}
                  created={progProgress.created}
                  skipped={progProgress.skipped}
                  errors={progProgress.errors}
                />
              )}

              {importComplete && (
                <div className="flex items-center gap-2 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    Import completed successfully!
                  </span>
                </div>
              )}
            </div>
          )}

          {/* University List (when parsed) */}
          {parseSummary && (
            <div className="bg-card rounded-xl border p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Universities</h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleSelectAll}
                    className="text-xs"
                  >
                    Toggle All
                  </Button>
                </div>
              </div>

              {/* Search & Filter */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search universities..."
                    value={searchFilter}
                    onChange={e => setSearchFilter(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-muted/30 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                <div className="flex rounded-lg border overflow-hidden">
                  {(["all", "new", "existing"] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setShowFilter(f)}
                      className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                        showFilter === f
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* University List */}
              <ScrollArea className="h-[400px]">
                <div className="space-y-1">
                  {filteredUniversities.map(uni => (
                    <label
                      key={uni.name}
                      className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors hover:bg-muted/30 ${
                        selectedUnis.has(uni.name) ? "bg-primary/5" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedUnis.has(uni.name) || uni.existsInDb}
                        disabled={uni.existsInDb}
                        onChange={e => {
                          const next = new Set(selectedUnis);
                          e.target.checked ? next.add(uni.name) : next.delete(uni.name);
                          setSelectedUnis(next);
                        }}
                        className="rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium truncate">{uni.name}</span>
                          {uni.existsInDb ? (
                            <Badge variant="secondary" className="text-[10px] bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
                              In DB
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-[10px] bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20">
                              New
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {uni.programCount} programs • {uni.location || "No location"}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        {/* Right Column: Logs */}
        <div className="bg-card rounded-xl border overflow-hidden flex flex-col" style={{ minHeight: 600 }}>
          <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/20">
            <h2 className="text-sm font-semibold">Import Log</h2>
            {logs.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLogs([])}
                className="text-xs h-7"
              >
                Clear
              </Button>
            )}
          </div>
          <ScrollArea className="flex-1 p-4">
            {logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-20">
                <Database className="h-10 w-10 mb-3 opacity-30" />
                <p className="text-sm">Import logs will appear here</p>
              </div>
            ) : (
              <div className="space-y-1 font-mono text-xs">
                {logs.map(log => (
                  <div
                    key={log.id}
                    className={`flex gap-2 py-1 px-2 rounded ${
                      log.type === "error"
                        ? "bg-red-500/5 text-red-600 dark:text-red-400"
                        : log.type === "success"
                        ? "text-green-600 dark:text-green-400"
                        : log.type === "warning"
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  >
                    <span className="text-muted-foreground/50 shrink-0">
                      {log.timestamp.toLocaleTimeString("en-US", { hour12: false })}
                    </span>
                    <span className="break-all">{log.message}</span>
                  </div>
                ))}
                <div ref={logEndRef} />
              </div>
            )}
          </ScrollArea>
        </div>
      </div>

      {/* ── Fix Entry Requirements Cards ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Excel-based Backfill (original) */}
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <div className="p-6 border-b bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Wrench className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">Fix Requirements (Excel)</h2>
                <p className="text-sm text-muted-foreground">
                  Re-process using Excel file as source
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              Matches programs against Excel data to fill missing or raw entry requirements. Uses AI to clean up formatting.
            </p>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Resume from university (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. North China Electric Power University"
                  value={backfillResume}
                  onChange={(e) => setBackfillResume(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-background"
                />
              </div>
              <Button
                onClick={handleBackfillRequirements}
                disabled={isBackfilling || isBulkFixing}
                variant="outline"
                className="w-full border-amber-500/30 text-amber-600 hover:bg-amber-500/10"
              >
                {isBackfilling ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Running...</>
                ) : (
                  <><Wrench className="h-4 w-4 mr-2" /> Fix from Excel</>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Card 2: Bulk Fix All (DB only) */}
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <div className="p-6 border-b bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">Fix All Requirements (DB)</h2>
                <p className="text-sm text-muted-foreground">
                  Re-process all programs directly from database
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              Scans all programs in the database and rewrites raw entry requirements text with AI. No Excel file needed.
            </p>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Resume from university (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Beijing Language and Culture University"
                  value={bulkFixResume}
                  onChange={(e) => setBulkFixResume(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-background"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bulkFixForceAll}
                  onChange={(e) => setBulkFixForceAll(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-muted-foreground">
                  Force re-process all (including already-clean programs)
                </span>
              </label>
              <Button
                onClick={handleBulkFixRequirements}
                disabled={isBulkFixing || isBackfilling}
                variant="outline"
                className="w-full border-blue-500/30 text-blue-600 hover:bg-blue-500/10"
              >
                {isBulkFixing ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Processing...</>
                ) : (
                  <><Sparkles className="h-4 w-4 mr-2" /> Fix All (DB Only)</>
                )}
              </Button>

              {/* Progress */}
              {isBulkFixing && bulkFixProgress.totalUnis > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Universities</span>
                    <span className="text-muted-foreground">
                      {bulkFixProgress.uniProcessed} / {bulkFixProgress.totalUnis}
                    </span>
                  </div>
                  <div className="h-3 bg-muted/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                      style={{ width: `${bulkFixProgress.totalUnis > 0 ? Math.round((bulkFixProgress.uniProcessed / bulkFixProgress.totalUnis) * 100) : 0}%` }}
                    />
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span className="text-green-600 dark:text-green-400">✅ {bulkFixProgress.fixed} fixed</span>
                    <span className="text-yellow-600 dark:text-yellow-400">⏭️ {bulkFixProgress.skipped} skipped</span>
                    {bulkFixProgress.errors > 0 && (
                      <span className="text-red-600 dark:text-red-400">❌ {bulkFixProgress.errors} errors</span>
                    )}
                    <span>📊 {bulkFixProgress.scanned} scanned</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── FAQ Generator Link Card ────────────────────── */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <MessageSquareText className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">FAQ Generator</h2>
                <p className="text-sm text-muted-foreground">
                  Multi-language AI FAQ generation has moved to its own page
                </p>
              </div>
            </div>
            <Link
              href="/en/admin/faq-generator"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-purple-500/30 text-purple-600 hover:bg-purple-500/10 transition-colors text-sm font-medium"
            >
              Open FAQ Generator
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* ProgressBar sub-component                                 */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function ProgressBar({
  label,
  processed,
  total,
  created,
  skipped,
  errors,
}: {
  label: string;
  processed: number;
  total: number;
  created: number;
  skipped: number;
  errors: number;
}) {
  const pct = total > 0 ? Math.round((processed / total) * 100) : 0;

  return (
    <div className="space-y-2 pt-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">
          {processed} / {total} ({pct}%)
        </span>
      </div>
      <div className="h-3 bg-muted/30 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex gap-4 text-xs text-muted-foreground">
        <span className="text-green-600 dark:text-green-400">✅ {created} created</span>
        <span className="text-yellow-600 dark:text-yellow-400">🔄 {skipped} updated</span>
        {errors > 0 && <span className="text-red-600 dark:text-red-400">❌ {errors} errors</span>}
      </div>
    </div>
  );
}
