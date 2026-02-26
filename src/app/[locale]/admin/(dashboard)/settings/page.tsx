"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Settings,
    Mail,
    DollarSign,
    Bell,
    Shield,
    Database,
    Bot,
    Sparkles,
    Save
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

const DEFAULT_AI_PROMPT = `You are a friendly and knowledgeable study abroad advisor for Studyatchina, helping international students pursue their education in China.

## Your Capabilities:
- Help students find suitable programs and universities
- Explain admission requirements and application processes
- Provide information about scholarships (CSC, provincial, university-specific)
- Answer questions about student life in China
- Guide students through visa requirements
- Explain costs and living expenses

## Guidelines:
1. Be warm, encouraging, and professional
2. Provide accurate information based on your knowledge
3. If you're unsure, say so and suggest contacting the support team
4. Keep responses concise but helpful
5. Use bullet points and formatting for clarity
6. Respond in the same language the user writes in`;

export default function AdminSettingsPage() {
    const [loading, setLoading] = useState(false);
    const [aiPrompt, setAiPrompt] = useState(DEFAULT_AI_PROMPT);
    const [aiLoading, setAiLoading] = useState(false);

    // Load AI prompt from database on mount
    useEffect(() => {
        const loadAiPrompt = async () => {
            try {
                const supabase = createClient();
                const { data } = await supabase
                    .from('site_settings')
                    .select('value')
                    .eq('key', 'ai_chat_prompt')
                    .single();

                if (data?.value) {
                    setAiPrompt(data.value);
                }
            } catch {
                // Table might not exist yet, use default
            }
        };
        loadAiPrompt();
    }, []);

    const handleSaveAiPrompt = async () => {
        setAiLoading(true);
        try {
            const supabase = createClient();

            // Upsert the setting
            const { error } = await supabase
                .from('site_settings')
                .upsert(
                    { key: 'ai_chat_prompt', value: aiPrompt },
                    { onConflict: 'key' }
                );

            if (error) throw error;
            toast.success("AI prompt saved successfully!");
        } catch (error) {
            console.error('Error saving AI prompt:', error);
            toast.error("Failed to save AI prompt. Make sure site_settings table exists.");
        } finally {
            setAiLoading(false);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        // Simulate save
        setTimeout(() => {
            toast.success("Settings saved successfully!");
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-heading">Settings</h1>
                <p className="text-muted-foreground">Manage platform settings and configuration.</p>
            </div>

            <Tabs defaultValue="general" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                    <TabsTrigger value="general">
                        <Settings className="h-4 w-4 mr-2" />
                        General
                    </TabsTrigger>
                    <TabsTrigger value="ai">
                        <Bot className="h-4 w-4 mr-2" />
                        AI Chat
                    </TabsTrigger>
                    <TabsTrigger value="email">
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                    </TabsTrigger>
                    <TabsTrigger value="payment">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Payment
                    </TabsTrigger>
                    <TabsTrigger value="notifications">
                        <Bell className="h-4 w-4 mr-2" />
                        Notifications
                    </TabsTrigger>
                    <TabsTrigger value="advanced">
                        <Shield className="h-4 w-4 mr-2" />
                        Advanced
                    </TabsTrigger>
                </TabsList>

                {/* AI Chat Settings */}
                <TabsContent value="ai" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-primary" />
                                AI Chat Configuration
                            </CardTitle>
                            <CardDescription>
                                Customize the AI chat assistant&apos;s behavior and personality.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="ai-prompt">System Prompt</Label>
                                <p className="text-sm text-muted-foreground">
                                    This prompt tells the AI how to behave. Be specific about your brand voice, what information to provide, and how to respond.
                                </p>
                                <Textarea
                                    id="ai-prompt"
                                    value={aiPrompt}
                                    onChange={(e) => setAiPrompt(e.target.value)}
                                    rows={15}
                                    className="font-mono text-sm"
                                    placeholder="Enter your custom AI prompt..."
                                />
                            </div>
                            <div className="flex items-center justify-between pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setAiPrompt(DEFAULT_AI_PROMPT)}
                                >
                                    Reset to Default
                                </Button>
                                <Button
                                    onClick={handleSaveAiPrompt}
                                    disabled={aiLoading}
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    {aiLoading ? "Saving..." : "Save AI Prompt"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>AI Usage Tips</CardTitle>
                            <CardDescription>Best practices for configuring your AI assistant.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm text-muted-foreground">
                            <p>• <strong>Be specific</strong> about your platform name, services, and brand voice</p>
                            <p>• <strong>Include key information</strong> like tuition ranges, popular programs, and deadlines</p>
                            <p>• <strong>Set boundaries</strong> - tell the AI what topics to avoid or redirect</p>
                            <p>• <strong>Language support</strong> - the AI automatically responds in the user&apos;s language</p>
                            <p>• <strong>Test regularly</strong> - try different questions to ensure good responses</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* General Settings */}
                <TabsContent value="general" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Platform Information</CardTitle>
                            <CardDescription>Basic information about your platform.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="platform-name">Platform Name</Label>
                                    <Input id="platform-name" defaultValue="Studyatchina" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="platform-url">Platform URL</Label>
                                    <Input id="platform-url" defaultValue="https://studyatchina.com" />
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <Label htmlFor="guide-url">Guide Download Link</Label>
                                    <Input
                                        id="guide-url"
                                        placeholder="https://example.com/guide.pdf"
                                        defaultValue="https://example.com/guide.pdf"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        The link sent to students when they request the guide.
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    defaultValue="Your trusted partner in discovering and applying to China's top universities."
                                    rows={3}
                                />
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="support-email">Support Email</Label>
                                    <Input id="support-email" type="email" defaultValue="support@studyatchina.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="support-phone">Support Phone</Label>
                                    <Input id="support-phone" defaultValue="+86 123 456 7890" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Regional Settings</CardTitle>
                            <CardDescription>Configure timezone and language preferences.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="timezone">Timezone</Label>
                                    <Input id="timezone" defaultValue="Asia/Shanghai" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="currency">Default Currency</Label>
                                    <Input id="currency" defaultValue="USD" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Email Settings */}
                <TabsContent value="email" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>SMTP Configuration</CardTitle>
                            <CardDescription>Configure email server settings.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="smtp-host">SMTP Host</Label>
                                    <Input id="smtp-host" placeholder="smtp.gmail.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="smtp-port">SMTP Port</Label>
                                    <Input id="smtp-port" placeholder="587" />
                                </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="smtp-user">SMTP Username</Label>
                                    <Input id="smtp-user" type="email" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="smtp-pass">SMTP Password</Label>
                                    <Input id="smtp-pass" type="password" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Enable SSL/TLS</Label>
                                    <p className="text-sm text-muted-foreground">Use secure connection</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Email Templates</CardTitle>
                            <CardDescription>Customize automated email messages.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Welcome Email</Label>
                                    <p className="text-sm text-muted-foreground">Send to new users</p>
                                </div>
                                <Button variant="outline" size="sm">Edit Template</Button>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Application Confirmation</Label>
                                    <p className="text-sm text-muted-foreground">Send when application submitted</p>
                                </div>
                                <Button variant="outline" size="sm">Edit Template</Button>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Acceptance Letter</Label>
                                    <p className="text-sm text-muted-foreground">Send when application accepted</p>
                                </div>
                                <Button variant="outline" size="sm">Edit Template</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Payment Settings */}
                <TabsContent value="payment" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Stripe Configuration</CardTitle>
                            <CardDescription>Configure payment gateway settings.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="stripe-public">Stripe Publishable Key</Label>
                                <Input id="stripe-public" placeholder="pk_live_..." />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="stripe-secret">Stripe Secret Key</Label>
                                <Input id="stripe-secret" type="password" placeholder="sk_live_..." />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="webhook-secret">Webhook Secret</Label>
                                <Input id="webhook-secret" type="password" placeholder="whsec_..." />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Test Mode</Label>
                                    <p className="text-sm text-muted-foreground">Use test API keys</p>
                                </div>
                                <Switch />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Fee Structure</CardTitle>
                            <CardDescription>Configure default fees for applications.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="default-app-fee">Default Application Fee</Label>
                                    <Input id="default-app-fee" type="number" defaultValue="150" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notifications */}
                <TabsContent value="notifications" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Preferences</CardTitle>
                            <CardDescription>Control when and how notifications are sent.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>New Application Alerts</Label>
                                    <p className="text-sm text-muted-foreground">Notify admins of new applications</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Payment Notifications</Label>
                                    <p className="text-sm text-muted-foreground">Notify on successful payments</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Daily Summary</Label>
                                    <p className="text-sm text-muted-foreground">Receive daily activity summary</p>
                                </div>
                                <Switch />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Weekly Reports</Label>
                                    <p className="text-sm text-muted-foreground">Receive weekly analytics report</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Advanced Settings */}
                <TabsContent value="advanced" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Database & Backup</CardTitle>
                            <CardDescription>Manage database and backup settings.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Automatic Backups</Label>
                                    <p className="text-sm text-muted-foreground">Daily database backups</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Backup Retention</Label>
                                    <p className="text-sm text-muted-foreground">Keep backups for 30 days</p>
                                </div>
                                <Button variant="outline" size="sm">Configure</Button>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Manual Backup</Label>
                                    <p className="text-sm text-muted-foreground">Create backup now</p>
                                </div>
                                <Button variant="outline" size="sm">
                                    <Database className="h-4 w-4 mr-2" />
                                    Backup Now
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Security</CardTitle>
                            <CardDescription>Configure security and access control.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Two-Factor Authentication</Label>
                                    <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
                                </div>
                                <Switch />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Session Timeout</Label>
                                    <p className="text-sm text-muted-foreground">Auto logout after 30 minutes</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>IP Whitelist</Label>
                                    <p className="text-sm text-muted-foreground">Restrict admin access by IP</p>
                                </div>
                                <Button variant="outline" size="sm">Configure</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-destructive">
                        <CardHeader>
                            <CardTitle className="text-destructive">Danger Zone</CardTitle>
                            <CardDescription>Irreversible and destructive actions.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Clear All Cache</Label>
                                    <p className="text-sm text-muted-foreground">Remove all cached data</p>
                                </div>
                                <Button variant="destructive" size="sm">Clear Cache</Button>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Reset Platform</Label>
                                    <p className="text-sm text-muted-foreground">Reset all settings to default</p>
                                </div>
                                <Button variant="destructive" size="sm">Reset</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-4">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSave} disabled={loading}>
                    {loading ? "Saving..." : "Save All Changes"}
                </Button>
            </div>
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
