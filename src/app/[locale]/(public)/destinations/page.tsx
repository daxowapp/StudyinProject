import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { PORTAL_KEY } from "@/lib/constants/portal";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building2, ArrowRight, GraduationCap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://studyatchina.com";

// City metadata with images and descriptions (keyed by lowercase city name)
const cityMeta: Record<string, { image: string; province: string }> = {
    // ── Major cities (Tier 1) ─────────────────────────────────────
    beijing:           { image: "/cities/beijing.png",           province: "Beijing" },
    shanghai:          { image: "/cities/shanghai.png",          province: "Shanghai" },
    guangzhou:         { image: "/cities/guangzhou.png",         province: "Guangdong" },
    shenzhen:          { image: "/cities/shenzhen.png",          province: "Guangdong" },
    wuhan:             { image: "/cities/wuhan.png",             province: "Hubei" },
    hangzhou:          { image: "/cities/hangzhou.png",          province: "Zhejiang" },
    nanjing:           { image: "/cities/nanjing.png",           province: "Jiangsu" },
    chengdu:           { image: "/cities/chengdu.png",           province: "Sichuan" },
    "xi'an":           { image: "/cities/xian.png",              province: "Shaanxi" },
    xian:              { image: "/cities/xian.png",              province: "Shaanxi" },
    chongqing:         { image: "/cities/chongqing.png",          province: "Chongqing" },

    // ── Cities with own generated images ──────────────────────────
    changchun:         { image: "/cities/changchun.png",         province: "Jilin" },
    changsha:          { image: "/cities/changsha.png",          province: "Hunan" },
    changzhou:         { image: "/cities/changzhou.png",         province: "Jiangsu" },
    dongguan:          { image: "/cities/dongguan.png",          province: "Guangdong" },
    fuzhou:            { image: "/cities/fuzhou.png",            province: "Fujian" },
    guiyang:           { image: "/cities/guiyang.png",           province: "Guizhou" },
    haikou:            { image: "/cities/haikou.png",            province: "Hainan" },
    hefei:             { image: "/cities/hefei.png",             province: "Anhui" },
    honghe:            { image: "/cities/honghe.png",            province: "Yunnan" },
    jinzhou:           { image: "/cities/jinzhou.png",           province: "Liaoning" },
    kaifeng:           { image: "/cities/kaifeng.png",           province: "Henan" },
    kunshan:           { image: "/cities/kunshan.png",           province: "Jiangsu" },
    leshan:            { image: "/cities/leshan.png",            province: "Sichuan" },
    luzhou:            { image: "/cities/luzhou.png",            province: "Sichuan" },
    mianyang:          { image: "/cities/mianyang.png",          province: "Sichuan" },
    nantong:           { image: "/cities/nantong.png",           province: "Jiangsu" },
    ningbo:            { image: "/cities/ningbo.png",            province: "Zhejiang" },
    "petaling jaya":   { image: "/cities/petaling_jaya.png",     province: "Selangor" },
    qinhuangdao:       { image: "/cities/qinhuangdao.png",       province: "Hebei" },
    "saint petersburg": { image: "/cities/saint_petersburg.png", province: "Russia" },
    shihezi:           { image: "/cities/shihezi.png",           province: "Xinjiang" },
    suzhou:            { image: "/cities/suzhou.png",            province: "Jiangsu" },
    taian:             { image: "/cities/taian.png",             province: "Shandong" },
    "tai'an":          { image: "/cities/taian.png",             province: "Shandong" },
    urumqi:            { image: "/cities/urumqi.png",            province: "Xinjiang" },
    wuxi:              { image: "/cities/wuxi.png",              province: "Jiangsu" },
    xiamen:            { image: "/cities/xiamen.png",            province: "Fujian" },
    xiangtan:          { image: "/cities/xiangtan.png",          province: "Hunan" },
    xinxiang:          { image: "/cities/xinxiang.png",          province: "Henan" },
    xinyang:           { image: "/cities/xinyang.png",           province: "Henan" },
    xuzhou:            { image: "/cities/xuzhou.png",            province: "Jiangsu" },
    yangling:          { image: "/cities/yangling.png",          province: "Shaanxi" },
    yantai:            { image: "/cities/yantai.png",            province: "Shandong" },
    yibin:             { image: "/cities/yibin.png",             province: "Sichuan" },
    yinchuan:          { image: "/cities/yinchuan.png",          province: "Ningxia" },
    yuxi:              { image: "/cities/yuxi.png",              province: "Yunnan" },
    zhoushan:          { image: "/cities/zhoushan.png",          province: "Zhejiang" },
    zhuhai:            { image: "/cities/zhuhai.png",            province: "Guangdong" },
    fuxin:             { image: "/cities/fuxin.png",             province: "Liaoning" },

    // ── Batch 4: Additional cities ──────────────────────────────────
    wenzhou:           { image: "/cities/wenzhou.png",           province: "Zhejiang" },
    nanchong:          { image: "/cities/nanchong.png",          province: "Sichuan" },
    jiamusi:           { image: "/cities/jiamusi.png",           province: "Heilongjiang" },
    huangshi:          { image: "/cities/huangshi.png",          province: "Hubei" },
    shantou:           { image: "/cities/shantou.png",           province: "Guangdong" },
    anshan:            { image: "/cities/anshan.png",            province: "Liaoning" },
    mudanjiang:        { image: "/cities/mudanjiang.png",        province: "Heilongjiang" },
    langfang:          { image: "/cities/langfang.png",          province: "Hebei" },
    taiyuan:           { image: "/cities/taiyuan.png",           province: "Shanxi" },
    zhuzhou:           { image: "/cities/zhuzhou.png",           province: "Hunan" },

    // ── Batch 5: More cities ─────────────────────────────────────
    linfen:            { image: "/cities/linfen.png",            province: "Shanxi" },
    wuhu:              { image: "/cities/wuhu.png",              province: "Anhui" },
    jiaxing:           { image: "/cities/jiaxing.png",           province: "Zhejiang" },
    binzhou:           { image: "/cities/binzhou.png",           province: "Shandong" },
    fushun:            { image: "/cities/fushun.png",            province: "Liaoning" },
    huaihua:           { image: "/cities/huaihua.png",           province: "Hunan" },
    jilin:             { image: "/cities/jilin.png",             province: "Jilin" },
    dali:              { image: "/cities/dali.png",              province: "Yunnan" },
    shaoxing:          { image: "/cities/shaoxing.png",          province: "Zhejiang" },
    chifeng:           { image: "/cities/chifeng.png",           province: "Inner Mongolia" },

    // ── Major cities (formerly fallback, now with own images) ─────
    harbin:            { image: "/cities/harbin.png",            province: "Heilongjiang" },
    dalian:            { image: "/cities/dalian.png",            province: "Liaoning" },
    tianjin:           { image: "/cities/tianjin.png",           province: "Tianjin" },
    jinan:             { image: "/cities/jinan.png",             province: "Shandong" },
    qingdao:           { image: "/cities/qingdao.png",           province: "Shandong" },
    kunming:           { image: "/cities/kunming.png",           province: "Yunnan" },
    zhengzhou:         { image: "/cities/zhengzhou.png",         province: "Henan" },
    shenyang:          { image: "/cities/shenyang.png",          province: "Liaoning" },

    // ── Batch 7: Cities the user identified as using fallback images ──
    jinhua:            { image: "/cities/jinhua.png",            province: "Zhejiang" },
    jiaozuo:           { image: "/cities/jiaozuo.png",           province: "Henan" },
    cangzhou:          { image: "/cities/cangzhou.png",          province: "Hebei" },
    yiwu:              { image: "/cities/yiwu.png",              province: "Zhejiang" },
    baoji:             { image: "/cities/baoji.png",             province: "Shaanxi" },
    zibo:              { image: "/cities/zibo.png",              province: "Shandong" },
    fuling:            { image: "/cities/fuling.png",            province: "Chongqing" },
    "kuala lumpur":    { image: "/cities/kuala_lumpur.png",      province: "Malaysia" },
    dezhou:            { image: "/cities/dezhou.png",            province: "Shandong" },
    xiangyang:         { image: "/cities/xiangyang.png",         province: "Hubei" },
    dongying:          { image: "/cities/dongying.png",          province: "Shandong" },
    "dongying and qingdao": { image: "/cities/dongying.png",    province: "Shandong" },
    karamay:           { image: "/cities/karamay.png",           province: "Xinjiang" },
    zhanjiang:         { image: "/cities/zhanjiang.png",         province: "Guangdong" },
    linyi:             { image: "/cities/linyi.png",             province: "Shandong" },
    "jilin city":      { image: "/cities/jilin.png",             province: "Jilin" },
    "st petersburg":   { image: "/cities/saint_petersburg.png",  province: "Russia" },
    zhenjiang:         { image: "/cities/zhenjiang.png",         province: "Jiangsu" },
    "zhenjiang, jiangsu": { image: "/cities/zhenjiang.png",     province: "Jiangsu" },
    guangyuan:         { image: "/cities/guangyuan.png",         province: "Sichuan" },
    luoyang:           { image: "/cities/luoyang.png",           province: "Henan" },
    baoding:           { image: "/cities/baoding.png",           province: "Hebei" },
    huaiyin:           { image: "/cities/huaiyin.png",           province: "Jiangsu" },
    lianyungang:       { image: "/cities/lianyungang.png",       province: "Jiangsu" },
    daqing:            { image: "/cities/daqing.png",            province: "Heilongjiang" },
    lishui:            { image: "/cities/lishui.png",            province: "Zhejiang" },
    guilin:            { image: "/cities/guilin.png",            province: "Guangxi" },
};

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;

    const title = "Study Destinations in China — Top Cities for International Students";
    const description =
        "Explore China's best cities for international students. Browse universities by city — Beijing, Shanghai, Guangzhou, Nanjing, Wuhan, and more.";

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: `${baseUrl}/${locale}/destinations`,
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        alternates: {
            canonical: `${baseUrl}/${locale}/destinations`,
            languages: {
                en: `${baseUrl}/en/destinations`,
                ar: `${baseUrl}/ar/destinations`,
                zh: `${baseUrl}/zh/destinations`,
            },
        },
    };
}

export default async function DestinationsPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const supabase = await createClient();
    const t = await getTranslations("Destinations");

    // Fetch all universities to aggregate by city
    const { data: universities } = await supabase
        .from("v_universities_listing")
        .select("city, province")
        .eq("portal_key", PORTAL_KEY);

    // Group by city and count
    const cityMap = new Map<string, { count: number; province: string }>();
    (universities || []).forEach((uni: { city: string; province: string }) => {
        if (!uni.city || uni.city === "N/A") return;
        const existing = cityMap.get(uni.city);
        if (existing) {
            existing.count++;
        } else {
            cityMap.set(uni.city, { count: 1, province: uni.province || "" });
        }
    });

    // Sort by count descending
    const cities = Array.from(cityMap.entries())
        .map(([name, data]) => {
            const meta = getCityMeta(name);
            return {
                name,
                count: data.count,
                province: data.province || meta.province,
                image: meta.image,
            };
        })
        .sort((a, b) => b.count - a.count);

    const totalCities = cities.length;
    const totalUniversities = cities.reduce((sum, c) => sum + c.count, 0);

    // Featured cities are the top 8 by university count
    const featuredCities = cities.slice(0, 8);
    const otherCities = cities.slice(8);

    return (
        <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
            <BreadcrumbJsonLd
                items={[
                    { name: "Home", url: baseUrl },
                    { name: t("pageTitle"), url: `${baseUrl}/destinations` },
                ]}
            />

            {/* ═══ HERO SECTION ═══════════════════════════════════════ */}
            <section className="relative overflow-hidden border-b">
                {/* Decorative background */}
                <div className="absolute inset-0 bg-linear-to-br from-primary/8 via-rose-500/5 to-background" />
                <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-rose-400/10 blur-3xl animate-orb-float" />
                <div className="absolute bottom-10 left-10 w-56 h-56 rounded-full bg-primary/10 blur-3xl animate-orb-float-delayed" />

                <div className="container mx-auto px-4 md:px-6 py-16 md:py-24 relative z-10">
                    <div className="max-w-4xl">
                        {/* Badge */}
                        <Badge className="mb-6 bg-rose-100 text-rose-700 hover:bg-rose-200 font-medium px-4 py-1.5 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800 gap-2">
                            <MapPin className="h-4 w-4" />
                            {t("badge")}
                        </Badge>

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6 leading-tight">
                            <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                {t("heroTitle")}
                            </span>{" "}
                            <br className="hidden md:block" />
                            <span className="text-foreground">{t("heroSubtitle")}</span>
                        </h1>

                        {/* Description */}
                        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
                            {t("heroDescription")}
                        </p>

                        {/* Stats Row */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 transition-all hover:shadow-md">
                                <div className="text-3xl font-bold text-primary mb-1 tabular-nums">
                                    {totalCities}
                                </div>
                                <div className="text-sm font-medium text-muted-foreground">
                                    {t("statCities")}
                                </div>
                            </div>
                            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 transition-all hover:shadow-md">
                                <div className="text-3xl font-bold text-rose-500 mb-1 tabular-nums">
                                    {totalUniversities}
                                </div>
                                <div className="text-sm font-medium text-muted-foreground">
                                    {t("statUniversities")}
                                </div>
                            </div>
                            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 transition-all hover:shadow-md col-span-2 md:col-span-1">
                                <div className="text-3xl font-bold text-amber-500 mb-1 tabular-nums">
                                    {featuredCities[0]?.count || 0}+
                                </div>
                                <div className="text-sm font-medium text-muted-foreground">
                                    {t("statTopCity", { city: featuredCities[0]?.name || "Beijing" })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ FEATURED CITIES ═══════════════════════════════════════ */}
            <section className="container mx-auto px-4 md:px-6 py-12 md:py-16">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold font-heading">
                            {t("featuredTitle")}
                        </h2>
                        <p className="text-muted-foreground mt-2">
                            {t("featuredSubtitle")}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featuredCities.map((city, index) => (
                        <Link
                            key={city.name}
                            href={`/${locale}/universities?city=${encodeURIComponent(city.name)}`}
                            className="group relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                            {/* City Image */}
                            <div className="relative h-48 overflow-hidden">
                                <Image
                                    src={city.image}
                                    alt={city.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    priority={index < 4}
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

                                {/* University count badge */}
                                <div className="absolute top-3 right-3">
                                    <Badge className="bg-white/90 dark:bg-slate-900/90 text-foreground backdrop-blur-sm border-0 shadow-md gap-1.5 px-3 py-1">
                                        <Building2 className="h-3.5 w-3.5" />
                                        {city.count} {city.count === 1 ? t("university") : t("universities")}
                                    </Badge>
                                </div>

                                {/* City name overlay */}
                                <div className="absolute bottom-3 left-4 right-4">
                                    <h3 className="text-xl font-bold text-white drop-shadow-lg">
                                        {city.name}
                                    </h3>
                                    <p className="text-white/80 text-sm">
                                        {city.province}
                                    </p>
                                </div>
                            </div>

                            {/* Card Footer */}
                            <div className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <GraduationCap className="h-4 w-4" />
                                    <span>{t("explorePrograms")}</span>
                                </div>
                                <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ═══ ALL OTHER CITIES ═══════════════════════════════════════ */}
            {otherCities.length > 0 && (
                <section className="container mx-auto px-4 md:px-6 pb-16">
                    <div className="mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold font-heading">
                            {t("allCitiesTitle")}
                        </h2>
                        <p className="text-muted-foreground mt-2">
                            {t("allCitiesSubtitle")}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {otherCities.map((city) => (
                            <Link
                                key={city.name}
                                href={`/${locale}/universities?city=${encodeURIComponent(city.name)}`}
                                className="group relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                            >
                                {/* City Image (smaller) */}
                                <div className="relative h-28 overflow-hidden">
                                    <Image
                                        src={city.image}
                                        alt={city.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                                    <div className="absolute bottom-2 left-3">
                                        <h3 className="text-sm font-bold text-white drop-shadow-lg">
                                            {city.name}
                                        </h3>
                                    </div>
                                </div>

                                {/* Card Footer */}
                                <div className="px-3 py-2.5 flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Building2 className="h-3 w-3" />
                                        {city.count} {city.count === 1 ? t("university") : t("universities")}
                                    </span>
                                    <ArrowRight className="h-3 w-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

function getCityMeta(cityName: string) {
    const key = cityName.toLowerCase().replace(/'/g, "'");
    const meta = cityMeta[key];
    if (meta) return meta;

    // Default fallback for cities without specific images
    return {
        image: "/cities/beijing.png",
        province: "",
    };
}
