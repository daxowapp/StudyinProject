import { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/badge";
import { QSRankingsContent } from "@/components/rankings/QSRankingsContent";
import { qsRankings2026, getNumericRank } from "@/data/qs-rankings-data";
import { getTranslations } from "next-intl/server";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://studyatchina.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "QSRankings" });

  const title = t("meta.title");
  const description = t("meta.description");

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/qs-rankings`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/qs-rankings`,
      languages: {
        en: `${baseUrl}/en/qs-rankings`,
        ar: `${baseUrl}/ar/qs-rankings`,
        fa: `${baseUrl}/fa/qs-rankings`,
        tr: `${baseUrl}/tr/qs-rankings`,
      },
    },
  };
}

export default async function QSRankingsPage() {
  const t = await getTranslations("QSRankings");

  const totalUniversities = qsRankings2026.length;
  const bestRank = Math.min(...qsRankings2026.map((u) => getNumericRank(u.rank)));
  const top50Count = qsRankings2026.filter(
    (u) => getNumericRank(u.rank) <= 50
  ).length;
  const uniqueCities = new Set(qsRankings2026.map((u) => u.city)).size;

  const translations = {
    topUniversitiesTitle: t("content.topUniversitiesTitle"),
    browseAllTitle: t("content.browseAllTitle"),
    searchPlaceholder: t("content.searchPlaceholder"),
    allCities: t("content.allCities"),
    showing: t("content.showing"),
    of: t("content.of"),
    universities: t("content.universities"),
    university: t("content.university"),
    inCity: t("content.inCity"),
    matching: t("content.matching"),
    noResults: t("content.noResults"),
    noResultsHint: t("content.noResultsHint"),
    overallScore: t("content.overallScore"),
    score: t("content.score"),
    world: t("content.world"),
    china: t("content.china"),
    ctaTitle: t("content.ctaTitle"),
    ctaDescription: t("content.ctaDescription"),
    browseUniversities: t("content.browseUniversities"),
    explorePrograms: t("content.explorePrograms"),
    disclaimer: t("content.disclaimer"),
    visitSite: t("content.visitSite"),
    viewProfile: t("content.viewProfile"),
    tierTop50: t("content.tierTop50"),
    tierTop200: t("content.tierTop200"),
    tierTop500: t("content.tierTop500"),
    tierRemaining: t("content.tierRemaining"),
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: baseUrl },
          { name: t("hero.breadcrumb"), url: `${baseUrl}/qs-rankings` },
        ]}
      />

      {/* ═══ HERO SECTION ═══════════════════════════════════════ */}
      <section className="relative overflow-hidden border-b">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-linear-to-br from-primary/8 via-amber-500/5 to-background" />
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-amber-400/10 blur-3xl animate-orb-float" />
        <div className="absolute bottom-10 left-10 w-56 h-56 rounded-full bg-primary/10 blur-3xl animate-orb-float-delayed" />

        <div className="container mx-auto px-4 md:px-6 py-16 md:py-24 relative z-10">
          <div className="max-w-4xl">
            {/* Badge */}
            <Badge className="mb-6 bg-amber-100 text-amber-700 hover:bg-amber-200 font-medium px-4 py-1.5 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800 gap-2">
              <span className="text-base">🏆</span>
              {t("hero.badge")}
            </Badge>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6 leading-tight">
              <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {t("hero.titleHighlight")}
              </span>{" "}
              <br className="hidden md:block" />
              <span className="text-foreground">{t("hero.titleRest")}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
              {t("hero.subtitle")}
            </p>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 transition-all hover:shadow-md group">
                <div className="text-3xl font-bold text-primary mb-1 tabular-nums">
                  {totalUniversities}
                </div>
                <div className="text-sm font-medium text-muted-foreground">
                  {t("hero.statRanked")}
                </div>
              </div>
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 transition-all hover:shadow-md group">
                <div className="text-3xl font-bold text-amber-500 mb-1 tabular-nums">
                  #{bestRank}
                </div>
                <div className="text-sm font-medium text-muted-foreground">
                  {t("hero.statHighest")}
                </div>
              </div>
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 transition-all hover:shadow-md group">
                <div className="text-3xl font-bold text-sky-500 mb-1 tabular-nums">
                  {top50Count}
                </div>
                <div className="text-sm font-medium text-muted-foreground">
                  {t("hero.statTop50")}
                </div>
              </div>
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 transition-all hover:shadow-md group">
                <div className="text-3xl font-bold text-emerald-500 mb-1 tabular-nums">
                  {uniqueCities}
                </div>
                <div className="text-sm font-medium text-muted-foreground">
                  {t("hero.statCities")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ MAIN CONTENT ═══════════════════════════════════════ */}
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <QSRankingsContent translations={translations} />
      </div>
    </div>
  );
}
