"use client";

import { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

import { ArrowLeft, Plus, Edit, Trash2, Home, X, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { AccommodationDialog } from "../../components/AccommodationDialog";
import { LoadingButton } from "@/components/ui/loading-button";

interface Accommodation {
    id: string;
    type: string;
    description: string;
    price_cny: number;
    price_usd: number;
    features: string[];
    display_order: number;
    university_id: string;
}

export default function AccommodationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [universityName, setUniversityName] = useState("");

    // Accommodation State
    const [accommodationAvailable, setAccommodationAvailable] = useState(true);
    const [accommodationDescription, setAccommodationDescription] = useState("");
    const [accommodationFeeRange, setAccommodationFeeRange] = useState("");
    const [accommodationFeatures, setAccommodationFeatures] = useState<string[]>([]);
    const [featureInput, setFeatureInput] = useState("");

    // Room Types State
    const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
    const [showAccommodationDialog, setShowAccommodationDialog] = useState(false);
    const [selectedAccommodation, setSelectedAccommodation] = useState<Accommodation | null>(null);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchData = async () => {
        try {
            const supabase = createClient();

            // Fetch university details
            const { data: university, error: uniError } = await supabase
                .from("universities")
                .select("name, accommodation_available, accommodation_description, accommodation_fee_range, accommodation_features")
                .eq("id", id)
                .single();

            if (uniError) throw uniError;

            setUniversityName(university.name);
            setAccommodationAvailable(university.accommodation_available ?? true);
            setAccommodationDescription(university.accommodation_description || "");
            setAccommodationFeeRange(university.accommodation_fee_range || "");
            setAccommodationFeatures(university.accommodation_features || []);

            // Fetch accommodations
            const { data: accommodationsData, error: accError } = await supabase
                .from("university_accommodation")
                .select("*")
                .eq("university_id", id)
                .order("display_order", { ascending: true });

            if (accError) throw accError;

            setAccommodations(accommodationsData || []);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to load accommodation data");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveGeneralSettings = async () => {
        setSaving(true);
        try {
            const supabase = createClient();
            const { error } = await supabase
                .from("universities")
                .update({
                    accommodation_available: accommodationAvailable,
                    accommodation_description: accommodationDescription,
                    accommodation_fee_range: accommodationFeeRange,
                    accommodation_features: accommodationFeatures
                })
                .eq("id", id);

            if (error) throw error;
            toast.success("Accommodation settings saved");
        } catch (error) {
            console.error("Error saving settings:", error);
            toast.error("Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    const handleAccommodationSuccess = async () => {
        const supabase = createClient();
        const { data } = await supabase
            .from("university_accommodation")
            .select("*")
            .eq("university_id", id)
            .order("display_order", { ascending: true });

        setAccommodations(data || []);
        setShowAccommodationDialog(false);
        setSelectedAccommodation(null);
    };

    const handleDeleteAccommodation = async (accommodationId: string) => {
        if (!confirm("Are you sure you want to delete this room type?")) return;

        try {
            const supabase = createClient();
            const { error } = await supabase
                .from("university_accommodation")
                .delete()
                .eq("id", accommodationId);

            if (error) throw error;

            toast.success("Room type deleted");
            handleAccommodationSuccess();
        } catch (error) {
            console.error("Error deleting accommodation:", error);
            toast.error("Failed to delete room type");
        }
    };

    const addFeature = () => {
        if (featureInput.trim()) {
            setAccommodationFeatures([...accommodationFeatures, featureInput.trim()]);
            setFeatureInput("");
        }
    };

    const removeFeature = (index: number) => {
        setAccommodationFeatures(accommodationFeatures.filter((_, i) => i !== index));
    };

    if (loading) {
        return <div className="p-8 text-center">Loading...</div>;
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/universities">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold font-heading">{universityName} - Accommodation</h1>
                        <p className="text-muted-foreground">Manage accommodation options and details</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6">
                {/* General Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle>General Settings</CardTitle>
                        <CardDescription>Configure general accommodation information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="accommodation_available"
                                checked={accommodationAvailable}
                                onCheckedChange={setAccommodationAvailable}
                            />
                            <Label htmlFor="accommodation_available">Accommodation Available</Label>
                        </div>

                        {accommodationAvailable && (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={accommodationDescription}
                                        onChange={(e) => setAccommodationDescription(e.target.value)}
                                        placeholder="Brief description of accommodation options..."
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="fee_range">Fee Range</Label>
                                    <Input
                                        id="fee_range"
                                        value={accommodationFeeRange}
                                        onChange={(e) => setAccommodationFeeRange(e.target.value)}
                                        placeholder="e.g. 1200-2500 CNY/month"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label>General Facilities</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Add a facility (e.g. WiFi, AC)"
                                            value={featureInput}
                                            onChange={(e) => setFeatureInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    addFeature();
                                                }
                                            }}
                                        />
                                        <Button type="button" onClick={addFeature} size="icon">
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {accommodationFeatures.map((feature, index) => (
                                            <div
                                                key={index}
                                                className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2"
                                            >
                                                {feature}
                                                <button
                                                    type="button"
                                                    onClick={() => removeFeature(index)}
                                                    className="hover:text-destructive"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <LoadingButton
                                        onClick={handleSaveGeneralSettings}
                                        loading={saving}
                                        loadingText="Saving..."
                                    >
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Settings
                                    </LoadingButton>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Room Types */}
                {accommodationAvailable && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Room Types</CardTitle>
                                <CardDescription>Manage available room types and pricing</CardDescription>
                            </div>
                            <Button onClick={() => {
                                setSelectedAccommodation(null);
                                setShowAccommodationDialog(true);
                            }}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Room Type
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {accommodations.map((accommodation) => (
                                    <div
                                        key={accommodation.id}
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                    >
                                        <div>
                                            <h4 className="font-semibold">{accommodation.type}</h4>
                                            <p className="text-sm text-muted-foreground">{accommodation.description}</p>
                                            <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                                                <span>¥{accommodation.price_cny}/month</span>
                                                <span>${accommodation.price_usd}/month</span>
                                            </div>
                                            {accommodation.features && accommodation.features.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {accommodation.features.map((feature: string, i: number) => (
                                                        <Badge key={i} variant="secondary" className="text-xs">
                                                            {feature}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    setSelectedAccommodation(accommodation);
                                                    setShowAccommodationDialog(true);
                                                }}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => handleDeleteAccommodation(accommodation.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {accommodations.length === 0 && (
                                    <div className="text-center py-12 text-muted-foreground">
                                        <Home className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p>No room types added yet</p>
                                        <Button
                                            variant="outline"
                                            className="mt-4"
                                            onClick={() => {
                                                setSelectedAccommodation(null);
                                                setShowAccommodationDialog(true);
                                            }}
                                        >
                                            Add First Room Type
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            <AccommodationDialog
                open={showAccommodationDialog}
                onOpenChange={setShowAccommodationDialog}
                universityId={id}
                accommodation={selectedAccommodation}
                onSuccess={handleAccommodationSuccess}
            />
        </div>
    );
}


/* GEO Fundamentals auto-patch:
// application/ld+json
// author: Studyatchina
// datePublished: 2026-02-26
// <h2>Section 0</h2>
// <h2>Section 1</h2>
*/
