"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect, use } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Loader2,
    Trash2,
    Globe,
    MapPin,
    Users,
    Calendar,
    Building2,
    GraduationCap,
    Eye,
    Edit,
    Upload,
    X,
    Image as ImageIcon
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { ProgramDialog } from "../../programs/components/ProgramDialog";
import { AiGeneratorButton } from "@/components/admin/AiGeneratorButton";

export default function EditUniversityPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [programs, setPrograms] = useState<any[]>([]);
    const [logoPreview, setLogoPreview] = useState<string>("");
    const [coverPhotoPreview, setCoverPhotoPreview] = useState<string>("");
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
    const [videoUrl, setVideoUrl] = useState<string>("");
    const [mapLocation, setMapLocation] = useState({ lat: 39.9042, lng: 116.4074 }); // Default: Beijing
    const [featureInput, setFeatureInput] = useState<string>("");
    const [languages, setLanguages] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        name: "",
        name_local: "",
        slug: "",
        city: "",
        province: "",
        description: "",
        website: "",
        logo_url: "",
        cover_photo_url: "",
        video_url: "",
        gallery_images: [] as string[],
        latitude: "",
        longitude: "",
        founded: "",
        total_students: "",
        international_students: "",
        ranking: "",
        features: [] as string[],
    });

    useEffect(() => {
        const fetchUniversity = async () => {
            const supabase = createClient();

            // Fetch university
            const { data, error } = await supabase
                .from("universities")
                .select("*")
                .eq("id", id)
                .single();

            // Fetch programs from the new university_programs table via view
            const { data: programsData } = await supabase
                .from("v_university_programs_full")
                .select("*")
                .eq("university_id", id);

            // Fetch languages for ProgramDialog
            const { data: languagesData } = await supabase
                .from("languages")
                .select("*")
                .order("name");

            if (error) {
                toast.error("Error fetching university");
                router.push("/admin/universities");
            } else {
                setFormData({
                    name: data.name || "",
                    name_local: data.name_local || "",
                    slug: data.slug || "",
                    city: data.city || "",
                    province: data.province || "",
                    description: data.description || "",
                    website: data.website || "",
                    logo_url: data.logo_url || "",
                    cover_photo_url: data.cover_photo_url || "",
                    video_url: data.video_url || "",
                    gallery_images: data.gallery_images || [],
                    latitude: data.latitude || "",
                    longitude: data.longitude || "",
                    founded: data.founded || "",
                    total_students: data.total_students || "",
                    international_students: data.international_students || "",
                    ranking: data.ranking || "",
                    features: data.features || [],
                });
                setLogoPreview(data.logo_url || "");
                setCoverPhotoPreview(data.cover_photo_url || "");
                setVideoUrl(data.video_url || "");
                setGalleryPreviews(data.gallery_images || []);
                if (data.latitude && data.longitude) {
                    setMapLocation({ lat: parseFloat(data.latitude), lng: parseFloat(data.longitude) });
                }
                // Set programs from the view data
                setPrograms(programsData || []);
                setLanguages(languagesData || []);
            }
            setLoading(false);
        };
        fetchUniversity();
    }, [id, router]);

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please upload an image file');
                return;
            }
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            toast.success('Logo uploaded successfully');
        }
    };

    const handleCoverPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please upload an image file');
                return;
            }
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverPhotoPreview(reader.result as string);
                setFormData({ ...formData, cover_photo_url: reader.result as string });
            };
            reader.readAsDataURL(file);
            toast.success('Cover photo uploaded successfully');
        }
    };

    const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        // Validate total images (max 10)
        if (galleryPreviews.length + files.length > 10) {
            toast.error('Maximum 10 images allowed in gallery');
            return;
        }

        files.forEach(file => {
            if (!file.type.startsWith('image/')) {
                toast.error(`${file.name} is not an image file`);
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error(`${file.name} is too large (max 5MB)`);
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setGalleryPreviews(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
        toast.success(`${files.length} image(s) added to gallery`);
    };

    const removeGalleryImage = (index: number) => {
        setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
        toast.success('Image removed from gallery');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        // Prepare data with images
        const updateData = {
            ...formData,
            logo_url: logoPreview || formData.logo_url,
            gallery_images: galleryPreviews.length > 0 ? galleryPreviews : formData.gallery_images,
        };

        const supabase = createClient();
        const { error } = await supabase
            .from("universities")
            .update(updateData)
            .eq("id", id);

        if (error) {
            toast.error("Error updating university: " + error.message);
            setSaving(false);
        } else {
            toast.success("University updated successfully");
            router.push("/admin/universities");
            router.refresh();
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this university? This action cannot be undone.")) return;

        setSaving(true);
        const supabase = createClient();
        const { error } = await supabase
            .from("universities")
            .delete()
            .eq("id", id);

        if (error) {
            toast.error("Error deleting university: " + error.message);
            setSaving(false);
        } else {
            toast.success("University deleted");
            router.push("/admin/universities");
            router.refresh();
        }
    };

    const handleAiDataReceived = (data: any) => {
        setFormData(prev => ({
            ...prev,
            name: data.name || prev.name,
            name_local: data.name_local || prev.name_local,
            city: data.city || prev.city,
            province: data.province || prev.province,
            description: data.description || prev.description,
            website: data.website || prev.website,
            founded: data.founded || prev.founded,
            total_students: data.total_students || prev.total_students,
            international_students: data.international_students || prev.international_students,
            ranking: data.ranking || prev.ranking,
            features: data.features && Array.isArray(data.features) ? [...new Set([...prev.features, ...data.features])] : prev.features,
            latitude: data.latitude || prev.latitude,
            longitude: data.longitude || prev.longitude,
        }));

        if (data.latitude && data.longitude) {
            setMapLocation({ lat: parseFloat(data.latitude), lng: parseFloat(data.longitude) });
        }
    };

    if (loading) {
        return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/universities">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold font-heading">{formData.name}</h1>
                        <p className="text-muted-foreground">{formData.city}, {formData.province}</p>
                    </div>
                    <div className="ml-4">
                        <AiGeneratorButton
                            type="university"
                            onDataReceived={handleAiDataReceived}
                            initialQuery={formData.name}
                        />
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link href={`/universities/${id}`} target="_blank">
                        <Button variant="outline" size="sm">
                            <Eye className="mr-2 h-4 w-4" />
                            View Public Page
                        </Button>
                    </Link>
                    <Button variant="destructive" size="sm" onClick={handleDelete} disabled={saving}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-4">
                <Card className="border-none shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Programs</CardTitle>
                        <GraduationCap className="h-5 w-5 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{programs.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">Available programs</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-5 w-5 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{formData.total_students || "N/A"}</div>
                        <p className="text-xs text-muted-foreground mt-1">Enrolled students</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">International</CardTitle>
                        <Globe className="h-5 w-5 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{formData.international_students || "N/A"}</div>
                        <p className="text-xs text-muted-foreground mt-1">International students</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Founded</CardTitle>
                        <Calendar className="h-5 w-5 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{formData.founded || "N/A"}</div>
                        <p className="text-xs text-muted-foreground mt-1">Year established</p>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="details" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="details">
                        <Edit className="h-4 w-4 mr-2" />
                        Details
                    </TabsTrigger>
                    <TabsTrigger value="programs">
                        <GraduationCap className="h-4 w-4 mr-2" />
                        Programs ({programs.length})
                    </TabsTrigger>
                </TabsList>

                {/* Details Tab */}
                <TabsContent value="details">
                    <Card>
                        <CardHeader>
                            <CardTitle>University Information</CardTitle>
                            <CardDescription>Update university details and information</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Basic Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Basic Information</h3>
                                    <Separator />
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">University Name *</Label>
                                            <Input
                                                id="name"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="name_local">Local Name (Chinese)</Label>
                                            <Input
                                                id="name_local"
                                                value={formData.name_local}
                                                onChange={(e) => setFormData({ ...formData, name_local: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="slug">Slug (URL Friendly) *</Label>
                                            <Input
                                                id="slug"
                                                required
                                                value={formData.slug}
                                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="website">Website</Label>
                                            <Input
                                                id="website"
                                                type="url"
                                                value={formData.website}
                                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                                placeholder="https://"
                                            />
                                        </div>
                                    </div>

                                    {/* Logo Upload */}
                                    <div className="space-y-2">
                                        <Label htmlFor="logo">University Logo</Label>
                                        <div className="flex items-start gap-4">
                                            {logoPreview && (
                                                <div className="relative w-32 h-32 border-2 border-dashed rounded-lg overflow-hidden">
                                                    <img
                                                        src={logoPreview}
                                                        alt="Logo preview"
                                                        className="w-full h-full object-contain p-2"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setLogoPreview("")}
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                                                    <input
                                                        id="logo"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleLogoUpload}
                                                        className="hidden"
                                                    />
                                                    <label htmlFor="logo" className="cursor-pointer">
                                                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                                        <p className="text-sm font-medium">Click to upload logo</p>
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            PNG, JPG, GIF up to 5MB
                                                        </p>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Cover Photo Upload */}
                                    <div className="space-y-2">
                                        <Label htmlFor="cover">Cover Photo (Hero Banner)</Label>
                                        <p className="text-sm text-muted-foreground">This photo will be displayed in the hero section and listing cards. Recommended size: 1920x600px</p>
                                        <div className="flex items-start gap-4">
                                            {coverPhotoPreview && (
                                                <div className="relative w-full h-48 border-2 border-dashed rounded-lg overflow-hidden">
                                                    <img
                                                        src={coverPhotoPreview}
                                                        alt="Cover photo preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setCoverPhotoPreview("");
                                                            setFormData({ ...formData, cover_photo_url: "" });
                                                        }}
                                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 shadow-lg"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            )}
                                            {!coverPhotoPreview && (
                                                <div className="w-full">
                                                    <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer bg-muted/20">
                                                        <input
                                                            id="cover"
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleCoverPhotoUpload}
                                                            className="hidden"
                                                        />
                                                        <label htmlFor="cover" className="cursor-pointer">
                                                            <ImageIcon className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                                                            <p className="text-sm font-medium">Click to upload cover photo</p>
                                                            <p className="text-xs text-muted-foreground mt-2">
                                                                PNG, JPG, GIF up to 5MB • Recommended: 1920x600px
                                                            </p>
                                                        </label>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Gallery Upload */}
                                    <div className="space-y-2">
                                        <Label htmlFor="gallery">University Gallery</Label>
                                        <div className="space-y-4">
                                            {/* Gallery Preview */}
                                            {galleryPreviews.length > 0 && (
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    {galleryPreviews.map((preview, index) => (
                                                        <div key={index} className="relative aspect-video border-2 border-dashed rounded-lg overflow-hidden group">
                                                            <img
                                                                src={preview}
                                                                alt={`Gallery ${index + 1}`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeGalleryImage(index)}
                                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Upload Button */}
                                            <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                                                <input
                                                    id="gallery"
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={handleGalleryUpload}
                                                    className="hidden"
                                                />
                                                <label htmlFor="gallery" className="cursor-pointer">
                                                    <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                                    <p className="text-sm font-medium">Click to upload gallery images</p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        Multiple images allowed (max 10) • PNG, JPG, GIF up to 5MB each
                                                    </p>
                                                    {galleryPreviews.length > 0 && (
                                                        <p className="text-xs text-primary mt-2">
                                                            {galleryPreviews.length} / 10 images uploaded
                                                        </p>
                                                    )}
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Video Section */}
                                    <div className="space-y-2">
                                        <Label htmlFor="video_url">University Video (YouTube/Vimeo)</Label>
                                        <Input
                                            id="video_url"
                                            type="url"
                                            value={formData.video_url}
                                            onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                                            placeholder="https://www.youtube.com/watch?v=..."
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Paste a YouTube or Vimeo video URL to showcase your university
                                        </p>
                                        {formData.video_url && (
                                            <div className="mt-2 p-3 bg-muted rounded-lg">
                                                <p className="text-sm font-medium mb-2">Video Preview:</p>
                                                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                                                    {formData.video_url.includes('youtube.com') || formData.video_url.includes('youtu.be') ? (
                                                        <iframe
                                                            width="100%"
                                                            height="100%"
                                                            src={`https://www.youtube.com/embed/${formData.video_url.includes('youtu.be')
                                                                ? formData.video_url.split('youtu.be/')[1]?.split('?')[0]
                                                                : formData.video_url.split('v=')[1]?.split('&')[0]
                                                                }`}
                                                            title="University Video"
                                                            frameBorder="0"
                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                            allowFullScreen
                                                        ></iframe>
                                                    ) : formData.video_url.includes('vimeo.com') ? (
                                                        <iframe
                                                            width="100%"
                                                            height="100%"
                                                            src={`https://player.vimeo.com/video/${formData.video_url.split('vimeo.com/')[1]?.split('?')[0]}`}
                                                            title="University Video"
                                                            frameBorder="0"
                                                            allow="autoplay; fullscreen; picture-in-picture"
                                                            allowFullScreen
                                                        ></iframe>
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full text-white">
                                                            Invalid video URL
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Location</h3>
                                    <Separator />
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="city">City *</Label>
                                            <Input
                                                id="city"
                                                required
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="province">Province</Label>
                                            <Input
                                                id="province"
                                                value={formData.province}
                                                onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {/* Map Location Picker */}
                                    <div className="space-y-2">
                                        <Label>Map Location (Click to set pin)</Label>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="latitude">Latitude</Label>
                                                <Input
                                                    id="latitude"
                                                    type="number"
                                                    step="any"
                                                    value={formData.latitude}
                                                    onChange={(e) => {
                                                        setFormData({ ...formData, latitude: e.target.value });
                                                        if (e.target.value && formData.longitude) {
                                                            setMapLocation({ lat: parseFloat(e.target.value), lng: parseFloat(formData.longitude) });
                                                        }
                                                    }}
                                                    placeholder="e.g., 39.9042"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="longitude">Longitude</Label>
                                                <Input
                                                    id="longitude"
                                                    type="number"
                                                    step="any"
                                                    value={formData.longitude}
                                                    onChange={(e) => {
                                                        setFormData({ ...formData, longitude: e.target.value });
                                                        if (formData.latitude && e.target.value) {
                                                            setMapLocation({ lat: parseFloat(formData.latitude), lng: parseFloat(e.target.value) });
                                                        }
                                                    }}
                                                    placeholder="e.g., 116.4074"
                                                />
                                            </div>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Enter coordinates manually or use Google Maps to find the location
                                        </p>

                                        {/* Map Preview */}
                                        {formData.latitude && formData.longitude && (
                                            <div className="mt-2 p-3 bg-muted rounded-lg">
                                                <p className="text-sm font-medium mb-2">Map Preview:</p>
                                                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                                                    <iframe
                                                        width="100%"
                                                        height="100%"
                                                        frameBorder="0"
                                                        style={{ border: 0 }}
                                                        src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${formData.latitude},${formData.longitude}&zoom=15`}
                                                        allowFullScreen
                                                    ></iframe>
                                                </div>
                                                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                                                    <MapPin className="h-3 w-3" />
                                                    <span>Location: {formData.latitude}, {formData.longitude}</span>
                                                    <a
                                                        href={`https://www.google.com/maps/search/?api=1&query=${formData.latitude},${formData.longitude}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-primary hover:underline ml-auto"
                                                    >
                                                        Open in Google Maps →
                                                    </a>
                                                </div>
                                            </div>
                                        )}

                                        {/* Quick Location Buttons */}
                                        <div className="flex flex-wrap gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setFormData({ ...formData, latitude: "39.9042", longitude: "116.4074" });
                                                    setMapLocation({ lat: 39.9042, lng: 116.4074 });
                                                }}
                                            >
                                                <MapPin className="h-3 w-3 mr-1" />
                                                Beijing
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setFormData({ ...formData, latitude: "31.2304", longitude: "121.4737" });
                                                    setMapLocation({ lat: 31.2304, lng: 121.4737 });
                                                }}
                                            >
                                                <MapPin className="h-3 w-3 mr-1" />
                                                Shanghai
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setFormData({ ...formData, latitude: "22.5431", longitude: "114.0579" });
                                                    setMapLocation({ lat: 22.5431, lng: 114.0579 });
                                                }}
                                            >
                                                <MapPin className="h-3 w-3 mr-1" />
                                                Shenzhen
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setFormData({ ...formData, latitude: "30.5728", longitude: "104.0668" });
                                                    setMapLocation({ lat: 30.5728, lng: 104.0668 });
                                                }}
                                            >
                                                <MapPin className="h-3 w-3 mr-1" />
                                                Chengdu
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Statistics */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Statistics</h3>
                                    <Separator />
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="founded">Founded Year</Label>
                                            <Input
                                                id="founded"
                                                value={formData.founded}
                                                onChange={(e) => setFormData({ ...formData, founded: e.target.value })}
                                                placeholder="e.g., 1911"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="ranking">Ranking</Label>
                                            <Input
                                                id="ranking"
                                                value={formData.ranking}
                                                onChange={(e) => setFormData({ ...formData, ranking: e.target.value })}
                                                placeholder="e.g., Top 100"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="total_students">Total Students</Label>
                                            <Input
                                                id="total_students"
                                                value={formData.total_students}
                                                onChange={(e) => setFormData({ ...formData, total_students: e.target.value })}
                                                placeholder="e.g., 50,000"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="international_students">International Students</Label>
                                            <Input
                                                id="international_students"
                                                value={formData.international_students}
                                                onChange={(e) => setFormData({ ...formData, international_students: e.target.value })}
                                                placeholder="e.g., 5,000"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Features/Tags */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Features & Tags</h3>
                                    <Separator />
                                    <div className="space-y-3">
                                        <Label>University Features</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Add tags like "Project 985", "C9 League", "Comprehensive University", etc.
                                        </p>

                                        {/* Display existing features */}
                                        {formData.features.length > 0 && (
                                            <div className="flex flex-wrap gap-2 p-4 bg-muted/50 rounded-lg">
                                                {formData.features.map((feature, index) => (
                                                    <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                                                        {feature}
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newFeatures = formData.features.filter((_, i) => i !== index);
                                                                setFormData({ ...formData, features: newFeatures });
                                                            }}
                                                            className="ml-2 hover:text-destructive"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}

                                        {/* Add new feature */}
                                        <div className="flex gap-2">
                                            <Input
                                                value={featureInput}
                                                onChange={(e) => setFeatureInput(e.target.value)}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        if (featureInput.trim() && !formData.features.includes(featureInput.trim())) {
                                                            setFormData({
                                                                ...formData,
                                                                features: [...formData.features, featureInput.trim()]
                                                            });
                                                            setFeatureInput("");
                                                        }
                                                    }
                                                }}
                                                placeholder="Type a feature and press Enter"
                                            />
                                            <Button
                                                type="button"
                                                onClick={() => {
                                                    if (featureInput.trim() && !formData.features.includes(featureInput.trim())) {
                                                        setFormData({
                                                            ...formData,
                                                            features: [...formData.features, featureInput.trim()]
                                                        });
                                                        setFeatureInput("");
                                                    }
                                                }}
                                                disabled={!featureInput.trim()}
                                            >
                                                Add
                                            </Button>
                                        </div>

                                        {/* Quick add common features */}
                                        <div className="space-y-2">
                                            <p className="text-xs text-muted-foreground">Quick add:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {["Project 985", "Project 211", "C9 League", "Double First Class", "Comprehensive University", "Research University", "Liberal Arts", "Sciences", "Engineering", "Medical"].map((preset) => (
                                                    <Button
                                                        key={preset}
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            if (!formData.features.includes(preset)) {
                                                                setFormData({
                                                                    ...formData,
                                                                    features: [...formData.features, preset]
                                                                });
                                                            }
                                                        }}
                                                        disabled={formData.features.includes(preset)}
                                                        className="text-xs"
                                                    >
                                                        + {preset}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Description</h3>
                                    <Separator />
                                    <div className="space-y-2">
                                        <Label htmlFor="description">University Description</Label>
                                        <Textarea
                                            id="description"
                                            rows={8}
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Provide a detailed description of the university..."
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end gap-2">
                                    <Link href="/admin/universities">
                                        <Button type="button" variant="outline">Cancel</Button>
                                    </Link>
                                    <Button type="submit" disabled={saving}>
                                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Programs Tab */}
                <TabsContent value="programs">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Programs</CardTitle>
                                    <CardDescription>Programs offered by this university</CardDescription>
                                </div>
                                <Link href="/admin/programs">
                                    <Button size="sm">
                                        <GraduationCap className="mr-2 h-4 w-4" />
                                        Manage Programs
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {programs.length > 0 ? (
                                <div className="space-y-4">
                                    {programs.map((program: any) => (
                                        <div key={program.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-semibold">{program.display_title || program.program_title}</h4>
                                                    <Badge variant={program.is_active ? "default" : "secondary"}>
                                                        {program.is_active ? "Active" : "Inactive"}
                                                    </Badge>
                                                    <Badge variant="outline">{program.category}</Badge>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                    <span>{program.level}</span>
                                                    <span>•</span>
                                                    <span>{program.duration}</span>
                                                    <span>•</span>
                                                    <span>{program.language_name || "Not specified"}</span>
                                                    <span>•</span>
                                                    <span className="font-medium text-foreground">{program.tuition_fee} {program.currency}/year</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {program.slug && (
                                                    <Link href={`/programs/${program.slug}`} target="_blank">
                                                        <Button variant="outline" size="sm">
                                                            <Eye className="h-4 w-4 mr-1" />
                                                            View
                                                        </Button>
                                                    </Link>
                                                )}
                                                <ProgramDialog
                                                    program={program}
                                                    universities={[{ id: id, name: formData.name }]}
                                                    languages={languages}
                                                    trigger={
                                                        <Button variant="ghost" size="sm">
                                                            <Edit className="h-4 w-4 mr-1" />
                                                            Edit
                                                        </Button>
                                                    }
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-muted-foreground">
                                    <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No programs added yet</p>
                                    <Link href="/admin/programs">
                                        <Button variant="outline" className="mt-4">
                                            Add First Program
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
