"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function NewUniversityPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        city: "",
        description: "",
        website: "",
        university_type: "",
        institution_category: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const supabase = createClient();
        const { error } = await supabase.from("universities").insert([formData]);

        if (error) {
            alert("Error creating university: " + error.message);
            setLoading(false);
        } else {
            router.push("/admin/universities");
            router.refresh();
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/admin/universities">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold font-heading">Add University</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>University Details</CardTitle>
                    <CardDescription>Enter the basic information for the new university.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">University Name</Label>
                            <Input
                                id="name"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug (URL Friendly)</Label>
                            <Input
                                id="slug"
                                required
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                                id="city"
                                required
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <Input
                                id="website"
                                type="url"
                                value={formData.website}
                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                rows={5}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="university_type">University Type</Label>
                            <Select
                                value={formData.university_type}
                                onValueChange={(value) => setFormData({ ...formData, university_type: value })}
                            >
                                <SelectTrigger id="university_type">
                                    <SelectValue placeholder="Select university type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Public">Public University</SelectItem>
                                    <SelectItem value="Private">Private University</SelectItem>
                                    <SelectItem value="Research">Research University</SelectItem>
                                    <SelectItem value="Comprehensive">Comprehensive University</SelectItem>
                                    <SelectItem value="Specialized">Specialized University</SelectItem>
                                    <SelectItem value="Vocational">Vocational University</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="institution_category">Institution Category</Label>
                            <Select
                                value={formData.institution_category}
                                onValueChange={(value) => setFormData({ ...formData, institution_category: value })}
                            >
                                <SelectTrigger id="institution_category">
                                    <SelectValue placeholder="Select institution category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="University">University</SelectItem>
                                    <SelectItem value="College">College</SelectItem>
                                    <SelectItem value="Language Institute">Language Institute</SelectItem>
                                    <SelectItem value="Vocational School">Vocational School</SelectItem>
                                    <SelectItem value="Technical Institute">Technical Institute</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create University
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
