"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, MapPin, Users, Upload, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateProfile, uploadProfilePhoto } from "./actions";
import { COUNTRIES, COUNTRY_CODES } from "@/lib/constants/countries";
import { useTranslations } from "next-intl";

interface ProfileEditFormProps {
    user: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    profile: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export default function ProfileEditForm({ user, profile }: ProfileEditFormProps) {
    const [loading, setLoading] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const t = useTranslations('Profile');

    // Helper to get initial value with fallbacks
    const getInitialValue = (key: string, fallback: string = ""): string => {
        if (profile && profile[key]) return profile[key] as string;
        if (user?.user_metadata && user.user_metadata[key]) return user.user_metadata[key] as string;
        return fallback;
    };

    const getInitialFullName = () => {
        if (profile?.full_name) return profile.full_name;
        if (profile?.first_name && profile?.last_name) return `${profile.first_name} ${profile.last_name}`;
        if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
        if (user?.user_metadata?.first_name && user?.user_metadata?.last_name) return `${user.user_metadata.first_name} ${user.user_metadata.last_name}`;
        return "";
    };

    const [formData, setFormData] = useState({
        full_name: getInitialFullName(),
        phone: getInitialValue('phone'),
        phone_country_code: getInitialValue('phone_country_code', '+86'),
        nationality: getInitialValue('nationality'),
        passport_number: getInitialValue('passport_number'),
        date_of_birth: getInitialValue('date_of_birth'),
        address: getInitialValue('address'),
        city: getInitialValue('city'),
        postal_code: getInitialValue('postal_code'),
        emergency_contact_name: getInitialValue('emergency_contact_name'),
        emergency_contact_phone: getInitialValue('emergency_contact_phone'),
        emergency_phone_code: getInitialValue('emergency_phone_code', '+86'),
        emergency_contact_relationship: getInitialValue('emergency_contact_relationship'),
    });

    const [profilePhotoUrl, setProfilePhotoUrl] = useState(profile?.profile_photo_url || "");

    const [phoneCountryId, setPhoneCountryId] = useState(() =>
        COUNTRY_CODES.find(c => c.code === getInitialValue('phone_country_code', '+86'))?.id || "CN"
    );
    const [emergencyPhoneCountryId, setEmergencyPhoneCountryId] = useState(() =>
        COUNTRY_CODES.find(c => c.code === getInitialValue('emergency_phone_code', '+86'))?.id || "CN"
    );

    const handlePhoneCountryChange = (id: string, field: 'phone' | 'emergency') => {
        const country = COUNTRY_CODES.find(c => c.id === id);
        if (!country) return;

        if (field === 'phone') {
            setPhoneCountryId(id);
            setFormData(prev => ({ ...prev, phone_country_code: country.code }));
        } else {
            setEmergencyPhoneCountryId(id);
            setFormData(prev => ({ ...prev, emergency_phone_code: country.code }));
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error("Please upload an image file");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be less than 5MB");
            return;
        }

        setUploadingPhoto(true);
        const result = await uploadProfilePhoto(user.id, file);

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success(t('success'));
            setProfilePhotoUrl(result.url || "");
        }
        setUploadingPhoto(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const result = await updateProfile(user.id, formData);

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success(t('success'));
        }
        setLoading(false);
    };

    // Calculate profile completion
    const totalFields = 13;
    const filledFields = Object.values(formData).filter(v => v && v !== "").length;
    const completionPercentage = Math.round((filledFields / totalFields) * 100);

    const getInitials = () => {
        const name = formData.full_name || user.email;
        return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Completion Card */}
            <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{t('completion')}</span>
                        <span className="text-sm font-bold text-blue-600">{completionPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${completionPercentage}%` }}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        {t('completeProfile')}
                    </p>
                </CardContent>
            </Card>

            {/* Profile Photo */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {t('photo.title')}
                    </CardTitle>
                    <CardDescription>{t('photo.description')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-6">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={profilePhotoUrl} />
                            <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                                {getInitials()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                            <Label htmlFor="photo" className="cursor-pointer">
                                <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                                    {uploadingPhoto ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Upload className="h-4 w-4" />
                                    )}
                                    {uploadingPhoto ? t('photo.uploading') : t('photo.upload')}
                                </div>
                            </Label>
                            <Input
                                id="photo"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handlePhotoUpload}
                                disabled={uploadingPhoto}
                            />
                            <p className="text-xs text-muted-foreground">
                                {t('photo.hint')}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {t('personalInfo.title')}
                    </CardTitle>
                    <CardDescription>{t('personalInfo.description')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="full_name">{t('fullName')} *</Label>
                            <Input
                                id="full_name"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleInputChange}
                                placeholder="John Doe"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">{t('email')}</Label>
                            <Input
                                id="email"
                                value={user.email || ''}
                                disabled
                                className="bg-muted text-muted-foreground"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="date_of_birth">{t('dob')}</Label>
                            <Input
                                id="date_of_birth"
                                name="date_of_birth"
                                type="date"
                                value={formData.date_of_birth}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">{t('phone')}</Label>
                            <div className="flex gap-2">
                                <Select
                                    value={phoneCountryId}
                                    onValueChange={(value) => handlePhoneCountryChange(value, 'phone')}
                                >
                                    <SelectTrigger className="w-[130px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {COUNTRY_CODES.map((item) => (
                                            <SelectItem key={item.id} value={item.id}>
                                                {item.code} {item.country}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="123456789"
                                    className="flex-1"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="nationality">{t('nationality')}</Label>
                            <Select
                                value={formData.nationality}
                                onValueChange={(value) => handleSelectChange("nationality", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={t('nationality')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {COUNTRIES.map((country) => (
                                        <SelectItem key={country} value={country}>
                                            {country}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="passport_number">{t('passportNumber')}</Label>
                            <Input
                                id="passport_number"
                                name="passport_number"
                                value={formData.passport_number}
                                onChange={handleInputChange}
                                placeholder="A12345678"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Address */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        {t('address.title')}
                    </CardTitle>
                    <CardDescription>{t('address.description')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="address">{t('address.street')}</Label>
                        <Input
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="123 Main Street, Apt 4B"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="city">{t('address.city')}</Label>
                            <Input
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                placeholder="New York"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="postal_code">{t('address.postalCode')}</Label>
                            <Input
                                id="postal_code"
                                name="postal_code"
                                value={formData.postal_code}
                                onChange={handleInputChange}
                                placeholder="10001"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        {t('emergency.title')}
                    </CardTitle>
                    <CardDescription>{t('emergency.description')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="emergency_contact_name">{t('emergency.name')}</Label>
                            <Input
                                id="emergency_contact_name"
                                name="emergency_contact_name"
                                value={formData.emergency_contact_name}
                                onChange={handleInputChange}
                                placeholder="Jane Doe"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="emergency_contact_phone">{t('emergency.phone')}</Label>
                            <div className="flex gap-2">
                                <Select
                                    value={emergencyPhoneCountryId}
                                    onValueChange={(value) => handlePhoneCountryChange(value, 'emergency')}
                                >
                                    <SelectTrigger className="w-[130px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {COUNTRY_CODES.map((item) => (
                                            <SelectItem key={`emergency-${item.id}`} value={item.id}>
                                                {item.code} {item.country}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Input
                                    id="emergency_contact_phone"
                                    name="emergency_contact_phone"
                                    type="tel"
                                    value={formData.emergency_contact_phone}
                                    onChange={handleInputChange}
                                    placeholder="123456789"
                                    className="flex-1"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="emergency_contact_relationship">{t('emergency.relationship')}</Label>
                            <Input
                                id="emergency_contact_relationship"
                                name="emergency_contact_relationship"
                                value={formData.emergency_contact_relationship}
                                onChange={handleInputChange}
                                placeholder="Mother, Father, Spouse"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button type="submit" size="lg" disabled={loading} className="min-w-[200px]">
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {t('saving')}
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            {t('save')}
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
