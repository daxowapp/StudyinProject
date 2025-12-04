import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Calendar, Clock, Eye, TrendingUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function ArticlesPage() {
    const supabase = await createClient();

    // Fetch published articles
    const { data: articles } = await supabase
        .from("v_published_articles")
        .select("*")
        .order("published_at", { ascending: false });

    // Fetch categories
    const { data: categories } = await supabase
        .from("article_categories")
        .select("*")
        .order("display_order");

    // Get featured articles
    const featuredArticles = articles?.filter(a => a.is_featured).slice(0, 3) || [];
    const regularArticles = articles?.filter(a => !a.is_featured) || [];

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
                <div className="container mx-auto px-4 md:px-6 py-16">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            Articles & Resources
                        </h1>
                        <p className="text-lg text-muted-foreground mb-8">
                            Guides, tips, and insights for international students studying in China
                        </p>

                        {/* Search Bar */}
                        <div className="relative max-w-2xl mx-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder="Search articles..."
                                className="pl-12 h-14 text-lg bg-background/80 backdrop-blur-sm border-2"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 py-12">
                {/* Categories */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
                    <div className="flex flex-wrap gap-3">
                        <Link href="/articles">
                            <Badge variant="default" className="px-4 py-2 text-sm cursor-pointer hover:bg-primary/90">
                                All Articles
                            </Badge>
                        </Link>
                        {categories?.map((category) => (
                            <Link key={category.id} href={`/articles?category=${category.slug}`}>
                                <Badge
                                    variant="outline"
                                    className="px-4 py-2 text-sm cursor-pointer hover:bg-muted"
                                    style={{ borderColor: category.color }}
                                >
                                    {category.name}
                                </Badge>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Featured Articles */}
                {featuredArticles.length > 0 && (
                    <div className="mb-16">
                        <div className="flex items-center gap-2 mb-6">
                            <TrendingUp className="h-6 w-6 text-primary" />
                            <h2 className="text-2xl font-bold">Featured Articles</h2>
                        </div>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {featuredArticles.map((article) => (
                                <Link key={article.id} href={`/articles/${article.slug}`}>
                                    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-none shadow-lg h-full group">
                                        {article.featured_image && (
                                            <div className="relative h-48 overflow-hidden">
                                                <Image
                                                    src={article.featured_image}
                                                    alt={article.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                    unoptimized
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                                {article.category_name && (
                                                    <Badge
                                                        className="absolute top-3 left-3"
                                                        style={{ backgroundColor: article.category_color }}
                                                    >
                                                        {article.category_name}
                                                    </Badge>
                                                )}
                                            </div>
                                        )}
                                        <CardContent className="p-6">
                                            <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                                {article.title}
                                            </h3>
                                            <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                                                {article.excerpt}
                                            </p>
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(article.published_at).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {article.reading_time} min read
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Eye className="h-3 w-3" />
                                                    {article.views}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* All Articles */}
                <div>
                    <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {regularArticles.map((article) => (
                            <Link key={article.id} href={`/articles/${article.slug}`}>
                                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full group">
                                    {article.featured_image && (
                                        <div className="relative h-40 overflow-hidden">
                                            <Image
                                                src={article.featured_image}
                                                alt={article.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                unoptimized
                                            />
                                            {article.category_name && (
                                                <Badge
                                                    className="absolute top-2 left-2 text-xs"
                                                    style={{ backgroundColor: article.category_color }}
                                                >
                                                    {article.category_name}
                                                </Badge>
                                            )}
                                        </div>
                                    )}
                                    <CardContent className="p-5">
                                        <h3 className="font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                            {article.title}
                                        </h3>
                                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                                            {article.excerpt}
                                        </p>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(article.published_at).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {article.reading_time} min
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>

                    {regularArticles.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            <p>No articles found. Check back soon!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
