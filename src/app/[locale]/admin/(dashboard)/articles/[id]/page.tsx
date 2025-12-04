"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Upload, X, Eye, Save } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ArticleEditorPage() {
    const router = useRouter();
    const params = useParams();
    const isNew = params.id === "new";
    const articleId = isNew ? null : params.id as string;

    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
    const [imageUploading, setImageUploading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        featured_image: "",
        category: "",
        tags: [] as string[],
        status: "draft",
        published_at: "",
        reading_time: 5,
        is_featured: false,
        meta_title: "",
        meta_description: "",
    });

    const [tagInput, setTagInput] = useState("");

    useEffect(() => {
        fetchCategories();
        if (!isNew) {
            fetchArticle();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchCategories = async () => {
        const supabase = createClient();
        const { data } = await supabase
            .from("article_categories")
            .select("*")
            .order("display_order");
        setCategories(data || []);
    };

    const fetchArticle = async () => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("articles")
            .select("*")
            .eq("id", articleId)
            .single();

        if (error) {
            toast.error("Error loading article");
            router.push("/admin/articles");
        } else {
            setFormData({
                title: data.title || "",
                slug: data.slug || "",
                excerpt: data.excerpt || "",
                content: data.content || "",
                featured_image: data.featured_image || "",
                category: data.category || "",
                tags: data.tags || [],
                status: data.status || "draft",
                published_at: data.published_at ? new Date(data.published_at).toISOString().slice(0, 16) : "",
                reading_time: data.reading_time || 5,
                is_featured: data.is_featured || false,
                meta_title: data.meta_title || "",
                meta_description: data.meta_description || "",
            });
        }
        setLoading(false);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            toast.error("Please upload an image file");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size should be less than 5MB");
            return;
        }

        setImageUploading(true);
        const supabase = createClient();

        try {
            // Try to upload to Supabase Storage first
            const fileExt = file.name.split(".").pop();
            const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
            const filePath = `articles/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("articles")
                .upload(filePath, file);

            if (!uploadError) {
                // Success - get public URL
                const { data: { publicUrl } } = supabase.storage
                    .from("articles")
                    .getPublicUrl(filePath);

                setFormData({ ...formData, featured_image: publicUrl });
                toast.success("Image uploaded successfully");
                setImageUploading(false);
                return;
            }

            // If storage fails, fall back to base64
            console.log("Storage upload failed, using base64:", uploadError);

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setFormData({ ...formData, featured_image: base64String });
                toast.success("Image uploaded successfully (using base64)");
                setImageUploading(false);
            };

            reader.onerror = () => {
                toast.error("Failed to read image file");
                setImageUploading(false);
            };

            reader.readAsDataURL(file);
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload image. Please try again.");
            setImageUploading(false);
        }
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData({
                ...formData,
                tags: [...formData.tags, tagInput.trim()],
            });
            setTagInput("");
        }
    };

    const handleRemoveTag = (tag: string) => {
        setFormData({
            ...formData,
            tags: formData.tags.filter((t) => t !== tag),
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const supabase = createClient();

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();

        const articleData = {
            ...formData,
            author_id: user?.id,
            published_at: formData.status === "published" && formData.published_at
                ? formData.published_at
                : formData.status === "published"
                    ? new Date().toISOString()
                    : null,
        };

        try {
            if (isNew) {
                const { error } = await supabase
                    .from("articles")
                    .insert([articleData]);

                if (error) throw error;
                toast.success("Article created successfully");
            } else {
                const { error } = await supabase
                    .from("articles")
                    .update(articleData)
                    .eq("id", articleId);

                if (error) throw error;
                toast.success("Article updated successfully");
            }

            router.push("/admin/articles");
        } catch (error) {
            console.error("Save error:", error);
            toast.error("Failed to save article");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/articles">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold font-heading">
                            {isNew ? "Create New Article" : "Edit Article"}
                        </h1>
                        <p className="text-muted-foreground">
                            {isNew ? "Write and publish a new article" : "Update article content"}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {!isNew && formData.slug && (
                        <Link href={`/articles/${formData.slug}`} target="_blank">
                            <Button variant="outline">
                                <Eye className="mr-2 h-4 w-4" />
                                Preview
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Title */}
                        <Card className="border-none shadow-lg">
                            <CardHeader>
                                <CardTitle>Article Content</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title *</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) =>
                                            setFormData({ ...formData, title: e.target.value })
                                        }
                                        placeholder="Enter article title"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="slug">Slug (URL)</Label>
                                    <Input
                                        id="slug"
                                        value={formData.slug}
                                        onChange={(e) =>
                                            setFormData({ ...formData, slug: e.target.value })
                                        }
                                        placeholder="auto-generated-from-title"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Leave empty to auto-generate from title
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="excerpt">Excerpt</Label>
                                    <Textarea
                                        id="excerpt"
                                        value={formData.excerpt}
                                        onChange={(e) =>
                                            setFormData({ ...formData, excerpt: e.target.value })
                                        }
                                        placeholder="Brief description of the article"
                                        rows={3}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Content Editor */}
                        <Card className="border-none shadow-lg">
                            <CardHeader>
                                <CardTitle>Article Body</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Write your article content. You can use HTML for formatting.
                                </p>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    value={formData.content}
                                    onChange={(e) =>
                                        setFormData({ ...formData, content: e.target.value })
                                    }
                                    placeholder="Write your article content here... You can use HTML tags for formatting."
                                    className="min-h-[400px] font-mono text-sm"
                                />
                                <div className="mt-2 text-xs text-muted-foreground">
                                    <p>Tip: Use HTML tags like &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;, &lt;a&gt;, &lt;img&gt; for formatting</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* SEO Settings */}
                        <Card className="border-none shadow-lg">
                            <CardHeader>
                                <CardTitle>SEO Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="meta_title">Meta Title</Label>
                                    <Input
                                        id="meta_title"
                                        value={formData.meta_title}
                                        onChange={(e) =>
                                            setFormData({ ...formData, meta_title: e.target.value })
                                        }
                                        placeholder="SEO title (defaults to article title)"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="meta_description">Meta Description</Label>
                                    <Textarea
                                        id="meta_description"
                                        value={formData.meta_description}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                meta_description: e.target.value,
                                            })
                                        }
                                        placeholder="SEO description (defaults to excerpt)"
                                        rows={2}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Publish Settings */}
                        <Card className="border-none shadow-lg">
                            <CardHeader>
                                <CardTitle>Publish</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(value) =>
                                            setFormData({ ...formData, status: value })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="draft">Draft</SelectItem>
                                            <SelectItem value="published">Published</SelectItem>
                                            <SelectItem value="archived">Archived</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {formData.status === "published" && (
                                    <div className="space-y-2">
                                        <Label htmlFor="published_at">Publish Date</Label>
                                        <Input
                                            id="published_at"
                                            type="datetime-local"
                                            value={formData.published_at}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    published_at: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                )}

                                <div className="flex items-center justify-between">
                                    <Label htmlFor="is_featured">Featured Article</Label>
                                    <Switch
                                        id="is_featured"
                                        checked={formData.is_featured}
                                        onCheckedChange={(checked) =>
                                            setFormData({ ...formData, is_featured: checked })
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="reading_time">Reading Time (minutes)</Label>
                                    <Input
                                        id="reading_time"
                                        type="number"
                                        value={formData.reading_time}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                reading_time: parseInt(e.target.value) || 0,
                                            })
                                        }
                                        min="1"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Featured Image */}
                        <Card className="border-none shadow-lg">
                            <CardHeader>
                                <CardTitle>Featured Image *</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {formData.featured_image ? (
                                    <div className="relative">
                                        <div className="relative w-full h-48">
                                            <Image
                                                src={formData.featured_image}
                                                alt="Featured"
                                                fill
                                                className="object-cover rounded-lg"
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2"
                                            onClick={() =>
                                                setFormData({ ...formData, featured_image: "" })
                                            }
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Upload featured image
                                        </p>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            disabled={imageUploading}
                                            className="cursor-pointer"
                                        />
                                        {imageUploading && (
                                            <p className="text-xs text-muted-foreground mt-2">
                                                Uploading...
                                            </p>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Category */}
                        <Card className="border-none shadow-lg">
                            <CardHeader>
                                <CardTitle>Category</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Select
                                    value={formData.category}
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, category: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.slug}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </CardContent>
                        </Card>

                        {/* Tags */}
                        <Card className="border-none shadow-lg">
                            <CardHeader>
                                <CardTitle>Tags</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                handleAddTag();
                                            }
                                        }}
                                        placeholder="Add tag"
                                    />
                                    <Button type="button" onClick={handleAddTag}>
                                        Add
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.tags.map((tag) => (
                                        <Badge key={tag} variant="secondary">
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTag(tag)}
                                                className="ml-2"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Save Button */}
                        <Button type="submit" className="w-full" disabled={saving}>
                            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <Save className="mr-2 h-4 w-4" />
                            {isNew ? "Create Article" : "Update Article"}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
