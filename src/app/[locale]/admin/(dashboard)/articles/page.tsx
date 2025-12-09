"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Search, Eye, Edit, Trash2, FileText, TrendingUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { PORTAL_KEY } from "@/lib/constants/portal";

export default function ArticlesAdminPage() {
    const [articles, setArticles] = useState<{ id: string; title: string; slug: string; status: string; views: number; published_at: string; featured_image: string; category: string; is_featured: boolean }[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        const supabase = createClient();

        const { data, error } = await supabase
            .from("articles")
            .select("*")
            .eq("portal_key", PORTAL_KEY)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching articles:", error);
            toast.error("Error fetching articles. Please make sure the database migration has been run.");
            setArticles([]);
        } else {
            setArticles(data || []);
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this article?")) return;

        const supabase = createClient();
        const { error } = await supabase
            .from("articles")
            .delete()
            .eq("id", id);

        if (error) {
            toast.error("Error deleting article");
        } else {
            toast.success("Article deleted");
            fetchArticles();
        }
    };

    const filteredArticles = articles.filter((article) => {
        const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || article.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: articles.length,
        published: articles.filter(a => a.status === "published").length,
        draft: articles.filter(a => a.status === "draft").length,
        views: articles.reduce((sum, a) => sum + (a.views || 0), 0),
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-heading">Articles</h1>
                    <p className="text-muted-foreground">Manage blog posts and resources</p>
                </div>
                <Link href="/admin/articles/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> New Article
                    </Button>
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-4">
                <Card className="border-none shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
                        <FileText className="h-5 w-5 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats.total}</div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Published</CardTitle>
                        <TrendingUp className="h-5 w-5 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats.published}</div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Drafts</CardTitle>
                        <Edit className="h-5 w-5 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats.draft}</div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                        <Eye className="h-5 w-5 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats.views.toLocaleString()}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="border-none shadow-lg">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search articles..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full md:w-[200px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Articles Table */}
            <Card className="border-none shadow-lg">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Views</TableHead>
                                <TableHead>Published</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        Loading articles...
                                    </TableCell>
                                </TableRow>
                            ) : filteredArticles.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No articles found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredArticles.map((article) => (
                                    <TableRow key={article.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                {article.featured_image && (
                                                    <div className="relative h-10 w-16">
                                                        <Image
                                                            src={article.featured_image}
                                                            alt={article.title}
                                                            fill
                                                            className="object-cover rounded"
                                                        />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium">{article.title}</p>
                                                    {article.is_featured && (
                                                        <Badge variant="secondary" className="mt-1">Featured</Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {article.category || "Uncategorized"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    article.status === "published"
                                                        ? "default"
                                                        : article.status === "draft"
                                                            ? "secondary"
                                                            : "outline"
                                                }
                                            >
                                                {article.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{article.views || 0}</TableCell>
                                        <TableCell>
                                            {article.published_at
                                                ? new Date(article.published_at).toLocaleDateString()
                                                : "-"}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/articles/${article.slug}`} target="_blank">
                                                    <Button variant="ghost" size="icon">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={`/admin/articles/${article.id}`}>
                                                    <Button variant="ghost" size="icon" title="Edit article">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(article.id)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-600" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
