"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Loader2, Plus, X } from "lucide-react";

interface Accommodation {
    id: string;
    type: string;
    description: string;
    price_cny: number;
    price_usd: number;
    features: string[];
    display_order: number;
}

interface AccommodationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    universityId: string;
    accommodation?: Accommodation | null;
    onSuccess: () => void;
}

export function AccommodationDialog({
    open,
    onOpenChange,
    universityId,
    accommodation,
    onSuccess
}: AccommodationDialogProps) {
    const [loading, setLoading] = useState(false);
    const [featureInput, setFeatureInput] = useState("");
    const [formData, setFormData] = useState({
        type: "",
        description: "",
        price_cny: "",
        price_usd: "",
        features: [] as string[],
        display_order: 0
    });

    useEffect(() => {
        if (accommodation) {
            setFormData({
                type: accommodation.type || "",
                description: accommodation.description || "",
                price_cny: accommodation.price_cny?.toString() || "",
                price_usd: accommodation.price_usd?.toString() || "",
                features: accommodation.features || [],
                display_order: accommodation.display_order || 0
            });
        } else {
            setFormData({
                type: "",
                description: "",
                price_cny: "",
                price_usd: "",
                features: [],
                display_order: 0
            });
        }
    }, [accommodation, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const supabase = createClient();
            const payload = {
                university_id: universityId,
                type: formData.type,
                description: formData.description,
                price_cny: formData.price_cny ? parseFloat(formData.price_cny) : null,
                price_usd: formData.price_usd ? parseFloat(formData.price_usd) : null,
                features: formData.features,
                display_order: formData.display_order
            };

            if (accommodation?.id) {
                const { error } = await supabase
                    .from("university_accommodation")
                    .update(payload)
                    .eq("id", accommodation.id);

                if (error) throw error;
                toast.success("Accommodation updated successfully");
            } else {
                const { error } = await supabase
                    .from("university_accommodation")
                    .insert([payload]);

                if (error) throw error;
                toast.success("Accommodation added successfully");
            }

            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error("Error saving accommodation:", error);
            toast.error("Failed to save accommodation");
        } finally {
            setLoading(false);
        }
    };

    const addFeature = () => {
        if (featureInput.trim()) {
            setFormData(prev => ({
                ...prev,
                features: [...prev.features, featureInput.trim()]
            }));
            setFeatureInput("");
        }
    };

    const removeFeature = (index: number) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{accommodation ? "Edit Accommodation" : "Add Accommodation"}</DialogTitle>
                    <DialogDescription>
                        {accommodation ? "Edit the details of this accommodation option." : "Add a new accommodation option for this university."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="type">Room Type</Label>
                            <Input
                                id="type"
                                placeholder="e.g. Single Room, Double Room"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Brief description of the room..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="price_cny">Price (CNY/month)</Label>
                                <Input
                                    id="price_cny"
                                    type="number"
                                    placeholder="2500"
                                    value={formData.price_cny}
                                    onChange={(e) => setFormData({ ...formData, price_cny: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="price_usd">Price (USD/month approx)</Label>
                                <Input
                                    id="price_usd"
                                    type="number"
                                    placeholder="350"
                                    value={formData.price_usd}
                                    onChange={(e) => setFormData({ ...formData, price_usd: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label>Features</Label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Add a feature (e.g. Private Bathroom, AC)"
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
                                {formData.features.map((feature, index) => (
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

                        <div className="grid gap-2">
                            <Label htmlFor="display_order">Display Order</Label>
                            <Input
                                id="display_order"
                                type="number"
                                value={formData.display_order}
                                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {accommodation ? "Save Changes" : "Add Accommodation"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
