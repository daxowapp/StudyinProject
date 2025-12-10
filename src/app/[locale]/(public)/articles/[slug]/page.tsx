import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { PORTAL_KEY } from "@/lib/constants/portal";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Eye, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin, Building2, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { detectUniversitiesInArticle } from "@/lib/utils/articleUniversityDetector";
import "../article.css";

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const supabase = await createClient();
    const { slug } = await params;

    // Fetch article
    const { data: article, error } = await supabase
        .from("v_published_articles")
        .select("*")
        .eq("slug", slug)
        .eq("portal_key", PORTAL_KEY)
        .single();

    if (error || !article) {
        notFound();
    }

    // Increment view count
    await supabase.rpc("increment_article_views", { article_slug: slug });

    // Fetch related articles (same category)
    const { data: relatedArticles } = await supabase
        .from("v_published_articles")
        .select("*")
        .eq("category", article.category)
        .eq("portal_key", PORTAL_KEY)
        .neq("id", article.id)
        .limit(3);

    // Detect mentioned universities in article
    const mentionedUniversities = await detectUniversitiesInArticle(
        article.content || "",
        article.title || ""
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            {/* Hero Section with Featured Image */}
            {article.featured_image && (
                <div className="relative h-[400px] w-full overflow-hidden">
                    <Image
                        src={article.featured_image}
                        alt={article.title}
                        fill
                        className="object-cover"
                        unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                        <div className="container mx-auto">
                            <Link href="/articles">
                                <Button variant="ghost" size="sm" className="text-white hover:text-white/80 mb-4">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Articles
                                </Button>
                            </Link>
                            {article.category_name && (
                                <Badge
                                    className="mb-4"
                                    style={{ backgroundColor: article.category_color }}
                                >
                                    {article.category_name}
                                </Badge>
                            )}
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 max-w-4xl">
                                {article.title}
                            </h1>
                            <div className="flex items-center gap-6 text-white/80 text-sm">
                                {article.author_name && (
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        {article.author_name}
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    {new Date(article.published_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    {article.reading_time} min read
                                </div>
                                <div className="flex items-center gap-2">
                                    <Eye className="h-4 w-4" />
                                    {article.views} views
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-8">
                        <Card className="border-none shadow-lg">
                            <CardContent className="p-8 md:p-12">
                                {/* Excerpt */}
                                {article.excerpt && (
                                    <div className="text-xl text-muted-foreground mb-8 pb-8 border-b italic">
                                        {article.excerpt}
                                    </div>
                                )}

                                {/* Article Content */}
                                <div
                                    className="prose prose-lg max-w-none"
                                    dangerouslySetInnerHTML={{ __html: article.content }}
                                />

                                {/* Tags */}
                                {article.tags && article.tags.length > 0 && (
                                    <div className="mt-12 pt-8 border-t">
                                        <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Tags</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {article.tags.map((tag: string) => (
                                                <Badge key={tag} variant="secondary">
                                                    #{tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Share Section */}
                                <div className="mt-8 pt-8 border-t">
                                    <h3 className="text-sm font-semibold mb-4">Share this article</h3>
                                    <div className="flex gap-3">
                                        <Button variant="outline" size="sm">
                                            <Facebook className="h-4 w-4 mr-2" />
                                            Facebook
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            <Twitter className="h-4 w-4 mr-2" />
                                            Twitter
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            <Linkedin className="h-4 w-4 mr-2" />
                                            LinkedIn
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            <Share2 className="h-4 w-4 mr-2" />
                                            Copy Link
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Mentioned Universities */}
                        {mentionedUniversities && mentionedUniversities.length > 0 && (
                            <div className="mt-12">
                                <div className="flex items-center gap-2 mb-6">
                                    <Building2 className="h-6 w-6 text-primary" />
                                    <h2 className="text-2xl font-bold">Universities Mentioned in This Article</h2>
                                </div>
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {mentionedUniversities.map((university) => (
                                        <Link key={university.id} href={`/universities/${university.slug}`}>
                                            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-primary/20 hover:border-primary h-full group">
                                                <CardContent className="p-6">
                                                    <div className="flex items-start gap-4 mb-4">
                                                        {university.logo_url ? (
                                                            <div className="relative w-16 h-16 rounded-lg border overflow-hidden shrink-0">
                                                                <Image
                                                                    src={university.logo_url}
                                                                    alt={university.name}
                                                                    fill
                                                                    className="object-contain"
                                                                    unoptimized
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                                                                <Building2 className="h-8 w-8 text-primary" />
                                                            </div>
                                                        )}
                                                        <div className="flex-1">
                                                            <h3 className="font-bold text-lg mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                                                                {university.name}
                                                            </h3>
                                                            {university.name_local && (
                                                                <p className="text-sm text-muted-foreground mb-2">
                                                                    {university.name_local}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <MapPin className="h-4 w-4" />
                                                        {university.city}, {university.province}
                                                    </div>
                                                    <Button className="w-full mt-4 bg-primary hover:bg-primary/90">
                                                        View University
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Related Articles */}
                        {relatedArticles && relatedArticles.length > 0 && (
                            <div className="mt-12">
                                <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
                                <div className="grid gap-6 md:grid-cols-3">
                                    {relatedArticles.map((related) => (
                                        <Link key={related.id} href={`/articles/${related.slug}`}>
                                            <Card className="overflow-hidden hover:shadow-lg transition-all h-full group">
                                                {related.featured_image && (
                                                    <div className="relative h-32 overflow-hidden">
                                                        <Image
                                                            src={related.featured_image}
                                                            alt={related.title}
                                                            fill
                                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                            unoptimized
                                                        />
                                                    </div>
                                                )}
                                                <CardContent className="p-4">
                                                    <h3 className="font-bold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                                        {related.title}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <Clock className="h-3 w-3" />
                                                        {related.reading_time} min read
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-24 space-y-6">
                            {/* Author Card */}
                            {article.author_name && (
                                <Card className="border-none shadow-lg">
                                    <CardContent className="p-6">
                                        <h3 className="font-bold mb-4">About the Author</h3>
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                                <User className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-semibold">{article.author_name}</p>
                                                <p className="text-xs text-muted-foreground">Content Writer</p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Passionate about helping international students achieve their dreams of studying in China.
                                        </p>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Newsletter Signup */}
                            <Card className="border-none shadow-lg bg-gradient-to-br from-primary/10 to-primary/5">
                                <CardContent className="p-6">
                                    <h3 className="font-bold mb-2">Stay Updated</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Get the latest articles and resources delivered to your inbox.
                                    </p>
                                    <div className="space-y-2">
                                        <input
                                            type="email"
                                            placeholder="Your email"
                                            className="w-full px-4 py-2 rounded-lg border bg-background"
                                        />
                                        <Button className="w-full">Subscribe</Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Popular Articles */}
                            <Card className="border-none shadow-lg">
                                <CardContent className="p-6">
                                    <h3 className="font-bold mb-4">Popular Articles</h3>
                                    <div className="space-y-4">
                                        {/* Placeholder for popular articles */}
                                        <p className="text-sm text-muted-foreground">
                                            Check back soon for popular articles!
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
