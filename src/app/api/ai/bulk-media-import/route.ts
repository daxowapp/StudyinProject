import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { PORTAL_KEY } from "@/lib/constants/portal";

export const maxDuration = 300;

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const UA_BOT = "StudyinBot/1.0 (educational; https://studyin.com)";

// ─── Utility helpers ────────────────────────────────────────────

function extractDomain(url: string): string | null {
    try {
        const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
        return parsed.hostname.replace(/^www\./, "");
    } catch {
        return null;
    }
}

function resolveUrl(href: string, baseUrl: string): string {
    try {
        if (href.startsWith("http://") || href.startsWith("https://")) return href;
        if (href.startsWith("//")) return `https:${href}`;
        const base = new URL(baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`);
        if (href.startsWith("/")) return `${base.protocol}//${base.host}${href}`;
        return `${base.protocol}//${base.host}/${href}`;
    } catch {
        return href;
    }
}

async function downloadImage(
    url: string,
    minBytes = 1024,
    timeoutMs = 15000
): Promise<{ buffer: ArrayBuffer; contentType: string } | null> {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), timeoutMs);

        const res = await fetch(url, {
            signal: controller.signal,
            headers: { "User-Agent": UA, Accept: "image/*,*/*" },
            redirect: "follow",
        });
        clearTimeout(timeout);

        if (!res.ok) return null;

        const contentType = res.headers.get("content-type") || "";
        if (!contentType.startsWith("image/")) return null;
        if (contentType.includes("svg")) return null;

        const buffer = await res.arrayBuffer();
        if (buffer.byteLength < minBytes) return null;
        if (buffer.byteLength > 5 * 1024 * 1024) return null;

        return { buffer, contentType };
    } catch {
        return null;
    }
}

function getExtension(contentType: string): string {
    if (contentType.includes("png")) return "png";
    if (contentType.includes("webp")) return "webp";
    if (contentType.includes("gif")) return "gif";
    if (contentType.includes("ico")) return "png"; // treat ico as png
    return "jpg";
}

async function uploadToStorage(
    supabase: Awaited<ReturnType<typeof createAdminClient>>,
    buffer: ArrayBuffer,
    contentType: string,
    storagePath: string
): Promise<string | null> {
    const { error } = await supabase.storage
        .from("universities")
        .upload(storagePath, buffer, { contentType, upsert: true });

    if (error) {
        console.error(`Storage upload error for ${storagePath}:`, error.message);
        return null;
    }

    const { data } = supabase.storage.from("universities").getPublicUrl(storagePath);
    return data.publicUrl;
}

// ─── Scrape university website ──────────────────────────────────
/**
 * Fetches the university's homepage HTML and extracts logo + cover candidates.
 * Returns parsed candidates so callers can pick what they need.
 */
interface WebsiteScrapeResult {
    // Logo candidates (ordered by reliability)
    appleTouchIcons: string[];   // <link rel="apple-touch-icon">
    faviconLinks: string[];     // <link rel="icon" type="image/png|ico">
    logoImages: string[];       // <img> with logo in class/id/alt/src
    directFavicon: string | null; // /favicon.ico

    // Cover candidates (ordered by reliability)
    ogImage: string | null;
    twitterImage: string | null;
    heroImages: string[];       // large <img> tags from the page
}

async function scrapeUniversityWebsite(
    website: string | null
): Promise<WebsiteScrapeResult | null> {
    if (!website) return null;

    const baseUrl = website.startsWith("http") ? website : `https://${website}`;

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 12000);

        const res = await fetch(baseUrl, {
            signal: controller.signal,
            headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml" },
            redirect: "follow",
        });
        clearTimeout(timeout);

        if (!res.ok) return null;

        // Only read first 200KB to avoid huge pages
        const html = (await res.text()).slice(0, 200_000);
        const domain = extractDomain(website);

        const result: WebsiteScrapeResult = {
            appleTouchIcons: [],
            faviconLinks: [],
            logoImages: [],
            directFavicon: domain ? `https://${domain}/favicon.ico` : null,
            ogImage: null,
            twitterImage: null,
            heroImages: [],
        };

        // ── Apple touch icons ──
        const touchIconRegex = /<link[^>]+rel=["']apple-touch-icon(?:-precomposed)?["'][^>]*>/gi;
        let match;
        while ((match = touchIconRegex.exec(html)) !== null) {
            const hrefMatch = match[0].match(/href=["']([^"']+)["']/i);
            if (hrefMatch?.[1]) {
                result.appleTouchIcons.push(resolveUrl(hrefMatch[1], baseUrl));
            }
        }

        // ── Favicon link tags (PNG, ICO) ──
        const faviconRegex = /<link[^>]+rel=["'](?:shortcut\s+)?icon["'][^>]*>/gi;
        while ((match = faviconRegex.exec(html)) !== null) {
            const hrefMatch = match[0].match(/href=["']([^"']+)["']/i);
            if (hrefMatch?.[1]) {
                const href = hrefMatch[1];
                // Skip SVG favicons
                if (!href.toLowerCase().endsWith(".svg")) {
                    result.faviconLinks.push(resolveUrl(href, baseUrl));
                }
            }
        }

        // ── Logo images: <img> with logo in class/id/alt/src ──
        const imgRegex = /<img[^>]+>/gi;
        while ((match = imgRegex.exec(html)) !== null) {
            const tag = match[0];
            const tagLower = tag.toLowerCase();

            // Check if this img is logo-related
            const isLogo =
                /class=["'][^"']*logo[^"']*["']/i.test(tag) ||
                /id=["'][^"']*logo[^"']*["']/i.test(tag) ||
                /alt=["'][^"']*logo[^"']*["']/i.test(tag) ||
                /src=["'][^"']*logo[^"']*["']/i.test(tag) ||
                /class=["'][^"']*brand[^"']*["']/i.test(tag) ||
                /alt=["'][^"']*badge[^"']*["']/i.test(tag) ||
                /alt=["'][^"']*emblem[^"']*["']/i.test(tag) ||
                /alt=["'][^"']*校徽[^"']*["']/i.test(tag) ||
                /alt=["'][^"']*校标[^"']*["']/i.test(tag);

            if (isLogo) {
                const srcMatch = tag.match(/src=["']([^"']+)["']/i);
                if (srcMatch?.[1] && !srcMatch[1].toLowerCase().endsWith(".svg")) {
                    result.logoImages.push(resolveUrl(srcMatch[1], baseUrl));
                }
            }

            // Check for large hero images (potential covers)
            // Look for images with width > 500 or in hero/banner sections
            const isHero =
                /class=["'][^"']*hero[^"']*["']/i.test(tag) ||
                /class=["'][^"']*banner[^"']*["']/i.test(tag) ||
                /class=["'][^"']*slider[^"']*["']/i.test(tag) ||
                /class=["'][^"']*carousel[^"']*["']/i.test(tag) ||
                /class=["'][^"']*cover[^"']*["']/i.test(tag);

            // Also check for large width/height attributes
            const widthMatch = tag.match(/width=["']?(\d+)/i);
            const isLargeByAttr = widthMatch && parseInt(widthMatch[1]) >= 600;

            if ((isHero || isLargeByAttr) && !tagLower.includes("logo") && !tagLower.includes("icon")) {
                const srcMatch = tag.match(/src=["']([^"']+)["']/i);
                if (srcMatch?.[1] && !srcMatch[1].toLowerCase().endsWith(".svg")) {
                    result.heroImages.push(resolveUrl(srcMatch[1], baseUrl));
                }
            }
        }

        // ── OG image ──
        const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
            || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
        if (ogMatch?.[1]) {
            result.ogImage = resolveUrl(ogMatch[1], baseUrl);
        }

        // ── Twitter image ──
        const twMatch = html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i)
            || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i);
        if (twMatch?.[1]) {
            result.twitterImage = resolveUrl(twMatch[1], baseUrl);
        }

        // ── Background images from inline styles (hero sections) ──
        const bgRegex = /background(?:-image)?:\s*url\(["']?([^"')]+)["']?\)/gi;
        while ((match = bgRegex.exec(html)) !== null) {
            if (match[1] && !match[1].toLowerCase().endsWith(".svg")) {
                result.heroImages.push(resolveUrl(match[1], baseUrl));
            }
        }

        return result;
    } catch {
        return null;
    }
}

// ─── Wikipedia helpers ──────────────────────────────────────────

async function getWikipediaImage(
    name: string,
    type: "logo" | "cover"
): Promise<{ buffer: ArrayBuffer; contentType: string } | null> {
    const wikis = [
        { lang: "en", query: name },
        { lang: "zh", query: name },
    ];

    for (const wiki of wikis) {
        try {
            const searchUrl = `https://${wiki.lang}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(wiki.query + " university")}&srlimit=3&format=json&origin=*`;
            const searchRes = await fetch(searchUrl, { headers: { "User-Agent": UA_BOT } });
            if (!searchRes.ok) continue;
            const searchData = await searchRes.json();
            const articles = searchData?.query?.search || [];

            for (const article of articles) {
                const title = article.title as string;
                if (!title) continue;

                const imagesUrl = `https://${wiki.lang}.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=images&imlimit=20&format=json&origin=*`;
                const imagesRes = await fetch(imagesUrl, { headers: { "User-Agent": UA_BOT } });
                if (!imagesRes.ok) continue;
                const imagesData = await imagesRes.json();
                const pages = imagesData?.query?.pages;
                if (!pages) continue;

                for (const pageId of Object.keys(pages)) {
                    const images = pages[pageId]?.images || [];
                    for (const img of images) {
                        const imgTitle = img.title as string;
                        if (!imgTitle) continue;

                        const lower = imgTitle.toLowerCase();
                        if (type === "logo") {
                            if (!lower.includes("logo") && !lower.includes("seal") && !lower.includes("emblem") && !lower.includes("badge") && !lower.includes("crest")) continue;
                        } else {
                            if (lower.includes("logo") || lower.includes("seal") || lower.includes("icon") || lower.includes("flag") || lower.includes("map") || lower.includes(".svg")) continue;
                        }

                        const fileUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(imgTitle)}&prop=imageinfo&iiprop=url|mime|size&format=json&origin=*`;
                        const fileRes = await fetch(fileUrl, { headers: { "User-Agent": UA_BOT } });
                        if (!fileRes.ok) continue;
                        const fileData = await fileRes.json();
                        const filePages = fileData?.query?.pages;
                        if (!filePages) continue;

                        for (const fPageId of Object.keys(filePages)) {
                            const info = filePages[fPageId]?.imageinfo?.[0];
                            if (!info) continue;
                            const mime = info.mime as string;
                            const width = info.width as number;
                            const height = info.height as number;

                            if (!mime?.startsWith("image/") || mime.includes("svg")) continue;
                            if (type === "cover" && (width < 400 || height < 200)) continue;
                            if (type === "logo" && (width < 50 || height < 50)) continue;

                            const downloaded = await downloadImage(info.url as string, type === "logo" ? 512 : 2048);
                            if (downloaded) return downloaded;
                        }
                    }
                }
            }
        } catch (e) {
            console.error(`Wikipedia ${wiki.lang} error:`, e);
        }
    }
    return null;
}

// ─── Wikimedia Commons search ───────────────────────────────────

async function searchWikimediaCommons(
    queries: string[],
    type: "logo" | "cover" = "cover"
): Promise<{ buffer: ArrayBuffer; contentType: string } | null> {
    for (const query of queries) {
        try {
            const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&srlimit=5&format=json&origin=*`;
            const searchRes = await fetch(apiUrl, { headers: { "User-Agent": UA_BOT } });
            if (!searchRes.ok) continue;

            const searchData = await searchRes.json();
            const results = searchData?.query?.search || [];

            for (const result of results) {
                const title = result.title as string;
                if (!title) continue;
                const lower = title.toLowerCase();

                if (type === "cover") {
                    if (lower.includes("logo") || lower.includes("seal") || lower.includes("flag") || lower.includes("map") || lower.includes(".svg")) continue;
                } else {
                    // For logo type, we WANT logo/seal/emblem
                    if (!lower.includes("logo") && !lower.includes("seal") && !lower.includes("emblem") && !lower.includes("badge") && !lower.includes("crest")) continue;
                }

                const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url|mime|size&format=json&origin=*`;
                const infoRes = await fetch(infoUrl, { headers: { "User-Agent": UA_BOT } });
                if (!infoRes.ok) continue;

                const infoData = await infoRes.json();
                const pages = infoData?.query?.pages;
                if (!pages) continue;

                for (const pageId of Object.keys(pages)) {
                    const imageInfo = pages[pageId]?.imageinfo?.[0];
                    if (!imageInfo) continue;

                    const mime = imageInfo.mime as string;
                    const width = imageInfo.width as number;
                    const height = imageInfo.height as number;

                    if (!mime?.startsWith("image/") || mime.includes("svg")) continue;
                    if (type === "cover" && (width < 400 || height < 200)) continue;
                    if (type === "logo" && (width < 50 || height < 50)) continue;

                    const downloaded = await downloadImage(imageInfo.url as string, type === "logo" ? 512 : 2048);
                    if (downloaded) return downloaded;
                }
            }
        } catch (e) {
            console.error("Wikimedia search error:", e);
        }
    }
    return null;
}

// ─── Logo search: scrape website directly ───────────────────────

async function fetchLogo(
    name: string,
    website: string | null,
    scraped: WebsiteScrapeResult | null
): Promise<{ buffer: ArrayBuffer; contentType: string } | null> {
    // Layer 1: Apple touch icon from university website (BEST — high-res, set by the university)
    if (scraped) {
        for (const url of scraped.appleTouchIcons) {
            const img = await downloadImage(url, 2048);
            if (img) return img;
        }
    }

    // Layer 2: Favicon <link> tags from the website (PNG/ICO set by university)
    if (scraped) {
        for (const url of scraped.faviconLinks) {
            const img = await downloadImage(url, 1024);
            if (img) return img;
        }
    }

    // Layer 3: <img> tags with logo in class/id/alt/src
    if (scraped) {
        for (const url of scraped.logoImages) {
            const img = await downloadImage(url, 2048);
            if (img) return img;
        }
    }

    // Layer 4: Direct /favicon.ico from the domain
    if (scraped?.directFavicon) {
        const img = await downloadImage(scraped.directFavicon, 1024);
        if (img) return img;
    }

    // Layer 5: Wikipedia logo/seal/emblem (fallback for universities without website)
    const wikiLogo = await getWikipediaImage(name, "logo");
    if (wikiLogo) return wikiLogo;

    // Layer 6: Wikimedia Commons logo/seal search
    const commons = await searchWikimediaCommons([
        `${name} logo`,
        `${name} seal`,
        `${name} emblem`,
    ], "logo");
    if (commons) return commons;

    // If no website was provided, try guessing common Chinese .edu.cn patterns
    if (!website) {
        const slug = name
            .toLowerCase()
            .replace(/university|of|the|and|&|,|-|'|"/g, "")
            .trim()
            .replace(/\s+/g, "");

        if (slug) {
            const guessedDomains = [`${slug}.edu.cn`, `${slug}.cn`];
            for (const d of guessedDomains) {
                // Try scraping the guessed domain too
                const guessedScrape = await scrapeUniversityWebsite(`https://${d}`);
                if (guessedScrape) {
                    for (const url of guessedScrape.appleTouchIcons) {
                        const img = await downloadImage(url, 2048);
                        if (img) return img;
                    }
                    for (const url of guessedScrape.faviconLinks) {
                        const img = await downloadImage(url, 1024);
                        if (img) return img;
                    }
                    if (guessedScrape.directFavicon) {
                        const img = await downloadImage(guessedScrape.directFavicon, 1024);
                        if (img) return img;
                    }
                }
            }
        }
    }

    return null;
}

// ─── Cover photo search: scrape website directly ────────────────

async function fetchCoverPhoto(
    name: string,
    scraped: WebsiteScrapeResult | null
): Promise<{ buffer: ArrayBuffer; contentType: string } | null> {
    // Layer 1: OG image from university website (usually a campus hero photo)
    if (scraped?.ogImage) {
        const img = await downloadImage(scraped.ogImage, 5120);
        if (img) return img;
    }

    // Layer 2: Twitter image
    if (scraped?.twitterImage) {
        const img = await downloadImage(scraped.twitterImage, 5120);
        if (img) return img;
    }

    // Layer 3: Hero/banner images from the homepage
    if (scraped) {
        for (const url of scraped.heroImages.slice(0, 5)) {
            const img = await downloadImage(url, 10240); // At least 10KB for covers
            if (img) return img;
        }
    }

    // Layer 4: Wikipedia article images (non-logo campus photos)
    const wikiCover = await getWikipediaImage(name, "cover");
    if (wikiCover) return wikiCover;

    // Layer 5: Wikimedia Commons — multiple search queries
    const commonsResult = await searchWikimediaCommons([
        name,
        `${name} university`,
        `${name} campus`,
        `${name} building`,
        `${name} gate`,
    ], "cover");
    if (commonsResult) return commonsResult;

    return null;
}

// ─── Main handler ───────────────────────────────────────────────

export async function POST(request: NextRequest) {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start(controller) {
            const send = (data: Record<string, unknown>) => {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
            };

            try {
                const body = await request.json().catch(() => ({}));
                const onlyEmpty = body.onlyEmpty !== false;

                const supabase = await createAdminClient();

                // Fetch universities
                const selectCols = "id, name, website, logo_url, cover_photo_url";
                const universities: Record<string, unknown>[] = [];
                const PAGE_SIZE = 500;
                let page = 0;
                let hasMore = true;

                while (hasMore) {
                    const from = page * PAGE_SIZE;
                    const to = from + PAGE_SIZE - 1;
                    const { data, error } = await supabase
                        .from("universities")
                        .select(selectCols)
                        .eq("portal_key", PORTAL_KEY)
                        .order("name")
                        .range(from, to);

                    if (error) {
                        send({ type: "error", message: `Failed to fetch universities: ${error.message}` });
                        controller.close();
                        return;
                    }

                    if (data && data.length > 0) {
                        universities.push(...data);
                        hasMore = data.length === PAGE_SIZE;
                        page++;
                    } else {
                        hasMore = false;
                    }
                }

                if (universities.length === 0) {
                    send({ type: "error", message: "No universities found" });
                    controller.close();
                    return;
                }

                const toProcess = onlyEmpty
                    ? universities.filter(uni => {
                        const logoUrl = uni.logo_url as string | null;
                        const coverUrl = uni.cover_photo_url as string | null;
                        return !logoUrl || !coverUrl;
                    })
                    : universities;

                send({
                    type: "start",
                    total: toProcess.length,
                    totalAll: universities.length,
                    skippedAlreadyFilled: universities.length - toProcess.length,
                    message: `Starting media import for ${toProcess.length} universities (${universities.length - toProcess.length} already have media)...`,
                });

                let processed = 0;
                let logosImported = 0;
                let coversImported = 0;
                let errors = 0;

                for (const uni of toProcess) {
                    processed++;
                    const uniName = uni.name as string;
                    const uniId = uni.id as string;
                    const uniWebsite = uni.website as string | null;
                    const existingLogo = uni.logo_url as string | null;
                    const existingCover = uni.cover_photo_url as string | null;

                    send({
                        type: "progress",
                        processed,
                        total: toProcess.length,
                        logosImported,
                        coversImported,
                        errors,
                        current: uniName,
                        status: "searching",
                        message: `🔍 [${processed}/${toProcess.length}] Scraping: ${uniName}...`,
                    });

                    // Scrape website ONCE and reuse for both logo + cover
                    const scraped = await scrapeUniversityWebsite(uniWebsite);

                    const updateData: Record<string, unknown> = {};

                    // --- Logo ---
                    if (!existingLogo) {
                        try {
                            const logoResult = await fetchLogo(uniName, uniWebsite, scraped);
                            if (logoResult) {
                                const ext = getExtension(logoResult.contentType);
                                const storagePath = `logos/${uniId}.${ext}`;
                                const publicUrl = await uploadToStorage(supabase, logoResult.buffer, logoResult.contentType, storagePath);
                                if (publicUrl) {
                                    updateData.logo_url = publicUrl;
                                    logosImported++;
                                }
                            }
                        } catch (e) {
                            console.error(`Logo error for ${uniName}:`, e);
                        }
                    }

                    // --- Cover photo ---
                    if (!existingCover) {
                        try {
                            const coverResult = await fetchCoverPhoto(uniName, scraped);
                            if (coverResult) {
                                const ext = getExtension(coverResult.contentType);
                                const storagePath = `covers/${uniId}.${ext}`;
                                const publicUrl = await uploadToStorage(supabase, coverResult.buffer, coverResult.contentType, storagePath);
                                if (publicUrl) {
                                    updateData.cover_photo_url = publicUrl;
                                    coversImported++;
                                }
                            }
                        } catch (e) {
                            console.error(`Cover error for ${uniName}:`, e);
                        }
                    }

                    // --- Save to DB ---
                    if (Object.keys(updateData).length > 0) {
                        const { error: updateError } = await supabase
                            .from("universities")
                            .update(updateData)
                            .eq("id", uniId);

                        if (updateError) {
                            errors++;
                            send({
                                type: "progress",
                                processed,
                                total: toProcess.length,
                                logosImported,
                                coversImported,
                                errors,
                                current: uniName,
                                status: "error",
                                message: `❌ DB error for ${uniName}: ${updateError.message}`,
                            });
                        } else {
                            const fields = Object.keys(updateData).join(", ");
                            send({
                                type: "progress",
                                processed,
                                total: toProcess.length,
                                logosImported,
                                coversImported,
                                errors,
                                current: uniName,
                                status: "imported",
                                message: `✅ Imported: ${uniName} (${fields})`,
                            });
                        }
                    } else {
                        send({
                            type: "progress",
                            processed,
                            total: toProcess.length,
                            logosImported,
                            coversImported,
                            errors,
                            current: uniName,
                            status: "notfound",
                            message: `⚠️ No media found for: ${uniName}`,
                        });
                    }

                    // Small delay between universities to avoid rate limiting
                    await new Promise(resolve => setTimeout(resolve, 200));
                }

                send({
                    type: "complete",
                    processed,
                    logosImported,
                    coversImported,
                    errors,
                    message: `✅ Media import complete! Logos: ${logosImported}, Covers: ${coversImported}, Not found/errors: ${errors}`,
                });
            } catch (error: unknown) {
                const msg = error instanceof Error ? error.message : "Unknown error";
                send({ type: "error", message: msg });
            } finally {
                controller.close();
            }
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        },
    });
}
