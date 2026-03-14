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
    Bot,
    Sparkles,
    Save
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { getSiteSetting, saveSiteSetting } from "./actions";

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
    const [aiPrompt, setAiPrompt] = useState(DEFAULT_AI_PROMPT);
    const [aiLoading, setAiLoading] = useState(false);

    // Load AI prompt from database on mount via server action
    const loadAiPrompt = useCallback(async () => {
        try {
            const value = await getSiteSetting("ai_chat_prompt");
            if (value) {
                setAiPrompt(value);
            }
        } catch {
            // Table might not exist yet, use default
        }
    }, []);

    useEffect(() => {
        loadAiPrompt();
    }, [loadAiPrompt]);

    const handleSaveAiPrompt = async () => {
        setAiLoading(true);
        try {
            const result = await saveSiteSetting("ai_chat_prompt", aiPrompt);
            if (result.error) {
                toast.error(`Failed to save: ${result.error}`);
            } else {
                toast.success("AI prompt saved successfully!");
            }
        } catch {
            toast.error("Failed to save AI prompt. Make sure site_settings table exists.");
        } finally {
            setAiLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-heading">Settings</h1>
                <p className="text-muted-foreground">Manage platform settings and configuration.</p>
            </div>

            <Tabs defaultValue="ai" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
                    <TabsTrigger value="ai">
                        <Bot className="h-4 w-4 mr-2" />
                        AI Chat
                    </TabsTrigger>
                    <TabsTrigger value="general">
                        <Settings className="h-4 w-4 mr-2" />
                        General
                    </TabsTrigger>
                    <TabsTrigger value="email">
                        <Mail className="h-4 w-4 mr-2" />
                        Email
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
                            <CardDescription>Basic information about your platform. These settings are managed via environment variables.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="platform-name">Platform Name</Label>
                                    <Input id="platform-name" defaultValue="Studyatchina" disabled />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="platform-url">Platform URL</Label>
                                    <Input id="platform-url" defaultValue="https://studyatchina.com" disabled />
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                To change platform settings, update environment variables and redeploy.
                            </p>
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
                                    <Input id="timezone" defaultValue="Asia/Shanghai" disabled />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="currency">Default Currency</Label>
                                    <Input id="currency" defaultValue="USD" disabled />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Email Settings */}
                <TabsContent value="email" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Email Configuration</CardTitle>
                            <CardDescription>Email is configured via environment variables (Resend API key).</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                                <div className="space-y-0.5">
                                    <Label>Email Provider</Label>
                                    <p className="text-sm text-muted-foreground">Resend (configured via RESEND_API_KEY)</p>
                                </div>
                                <DollarSign className="h-5 w-5 text-green-500" />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Email templates are defined in <code className="bg-muted px-1 rounded">src/lib/email/</code>. Update environment variables for API keys.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Email Templates</CardTitle>
                            <CardDescription>Automated email messages managed in code.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Welcome Email</Label>
                                    <p className="text-sm text-muted-foreground">Send to new users</p>
                                </div>
                                <span className="text-xs text-muted-foreground">Code-defined</span>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Application Confirmation</Label>
                                    <p className="text-sm text-muted-foreground">Send when application submitted</p>
                                </div>
                                <span className="text-xs text-muted-foreground">Code-defined</span>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Acceptance Letter</Label>
                                    <p className="text-sm text-muted-foreground">Send when application accepted</p>
                                </div>
                                <span className="text-xs text-muted-foreground">Code-defined</span>
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
                            <CardTitle>Security</CardTitle>
                            <CardDescription>Security features managed at the infrastructure level.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Two-Factor Authentication</Label>
                                    <p className="text-sm text-muted-foreground">Managed via Supabase Auth</p>
                                </div>
                                <span className="text-xs text-muted-foreground">Supabase</span>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Rate Limiting</Label>
                                    <p className="text-sm text-muted-foreground">Bot protection and rate limiting enabled</p>
                                </div>
                                <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 rounded-full">Active</span>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Admin Role Verification</Label>
                                    <p className="text-sm text-muted-foreground">All server actions require admin role</p>
                                </div>
                                <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 rounded-full">Active</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Environment Configuration</CardTitle>
                            <CardDescription>Sensitive settings like API keys and secrets are managed via environment variables.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm text-muted-foreground">
                            <p>The following are configured via environment variables and cannot be changed from this panel:</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Supabase URL & keys</li>
                                <li>Resend API key</li>
                                <li>Payment gateway credentials</li>
                                <li>OpenAI API key</li>
                            </ul>
                            <p className="text-xs mt-4">Update <code className="bg-muted px-1 rounded">.env.local</code> and redeploy to change these values.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
