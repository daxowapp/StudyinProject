import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Cookie, Calendar, Settings, BarChart, Shield, CheckCircle2 } from "lucide-react";

export default function CookiePolicyPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
                <div className="container mx-auto px-4 md:px-6 py-12">
                    <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Home
                    </Link>
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-2 mb-4">
                            <Cookie className="h-8 w-8 text-primary" />
                            <h1 className="text-4xl md:text-5xl font-bold font-heading bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                Cookie Policy
                            </h1>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>Last Updated: December 1, 2025</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="max-w-4xl mx-auto">
                    <Card className="p-8 md:p-12">
                        <div className="prose prose-slate max-w-none">
                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">What Are Cookies?</h2>
                                <p className="text-muted-foreground mb-4">
                                    Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our Service.
                                </p>
                                <p className="text-muted-foreground">
                                    This Cookie Policy explains what cookies are, how we use them, and how you can control them.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">Types of Cookies We Use</h2>

                                {/* Essential Cookies */}
                                <div className="mb-6 p-6 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <div className="flex items-start gap-3 mb-3">
                                        <CheckCircle2 className="h-6 w-6 text-blue-600 mt-1" />
                                        <div>
                                            <h3 className="text-xl font-semibold mb-2">1. Essential Cookies</h3>
                                            <Badge variant="secondary" className="mb-3">Required</Badge>
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground mb-3">
                                        These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.
                                    </p>
                                    <p className="text-sm text-muted-foreground font-semibold mb-2">Examples:</p>
                                    <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
                                        <li>Authentication cookies (keep you logged in)</li>
                                        <li>Security cookies (prevent fraudulent activity)</li>
                                        <li>Session cookies (maintain your session state)</li>
                                        <li>Load balancing cookies (distribute traffic)</li>
                                    </ul>
                                    <p className="text-sm text-muted-foreground mt-3 italic">
                                        You cannot opt out of essential cookies as they are required for the Service to work.
                                    </p>
                                </div>

                                {/* Functional Cookies */}
                                <div className="mb-6 p-6 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                                    <div className="flex items-start gap-3 mb-3">
                                        <Settings className="h-6 w-6 text-green-600 mt-1" />
                                        <div>
                                            <h3 className="text-xl font-semibold mb-2">2. Functional Cookies</h3>
                                            <Badge variant="outline" className="mb-3">Optional</Badge>
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground mb-3">
                                        These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings.
                                    </p>
                                    <p className="text-sm text-muted-foreground font-semibold mb-2">Examples:</p>
                                    <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
                                        <li>Language preferences</li>
                                        <li>Region selection</li>
                                        <li>Theme preferences (dark/light mode)</li>
                                        <li>Font size and accessibility settings</li>
                                        <li>Recently viewed programs</li>
                                    </ul>
                                </div>

                                {/* Analytics Cookies */}
                                <div className="mb-6 p-6 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                                    <div className="flex items-start gap-3 mb-3">
                                        <BarChart className="h-6 w-6 text-purple-600 mt-1" />
                                        <div>
                                            <h3 className="text-xl font-semibold mb-2">3. Analytics Cookies</h3>
                                            <Badge variant="outline" className="mb-3">Optional</Badge>
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground mb-3">
                                        These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                                    </p>
                                    <p className="text-sm text-muted-foreground font-semibold mb-2">Examples:</p>
                                    <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
                                        <li>Google Analytics (traffic analysis)</li>
                                        <li>Page view tracking</li>
                                        <li>User journey mapping</li>
                                        <li>Bounce rate measurement</li>
                                        <li>Performance monitoring</li>
                                    </ul>
                                    <p className="text-sm text-muted-foreground mt-3">
                                        <strong>Data collected:</strong> Pages visited, time spent, device type, browser, location (country/city)
                                    </p>
                                </div>

                                {/* Marketing Cookies */}
                                <div className="mb-6 p-6 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                                    <div className="flex items-start gap-3 mb-3">
                                        <Shield className="h-6 w-6 text-orange-600 mt-1" />
                                        <div>
                                            <h3 className="text-xl font-semibold mb-2">4. Marketing/Advertising Cookies</h3>
                                            <Badge variant="outline" className="mb-3">Optional</Badge>
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground mb-3">
                                        These cookies track your browsing habits to deliver personalized advertisements and measure the effectiveness of our marketing campaigns.
                                    </p>
                                    <p className="text-sm text-muted-foreground font-semibold mb-2">Examples:</p>
                                    <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
                                        <li>Facebook Pixel (retargeting)</li>
                                        <li>Google Ads (ad personalization)</li>
                                        <li>LinkedIn Insight Tag</li>
                                        <li>Campaign tracking parameters</li>
                                    </ul>
                                </div>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">Third-Party Cookies</h2>
                                <p className="text-muted-foreground mb-4">
                                    We use services from third-party providers that may set their own cookies. These include:
                                </p>
                                <div className="space-y-4">
                                    <div className="p-4 bg-muted/50 rounded-lg">
                                        <h4 className="font-semibold mb-2">Google Analytics</h4>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            Purpose: Website traffic analysis and user behavior tracking
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Privacy Policy: <a href="https://policies.google.com/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a>
                                        </p>
                                    </div>
                                    <div className="p-4 bg-muted/50 rounded-lg">
                                        <h4 className="font-semibold mb-2">Supabase</h4>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            Purpose: Authentication and database services
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Privacy Policy: <a href="https://supabase.com/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Supabase Privacy</a>
                                        </p>
                                    </div>
                                    <div className="p-4 bg-muted/50 rounded-lg">
                                        <h4 className="font-semibold mb-2">Social Media Platforms</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Purpose: Social sharing and login functionality (Facebook, LinkedIn, WeChat)
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">Cookie Duration</h2>
                                <div className="space-y-4">
                                    <div className="p-4 border-l-4 border-blue-500 bg-blue-50/50 dark:bg-blue-950/20">
                                        <h4 className="font-semibold mb-2">Session Cookies</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Temporary cookies that are deleted when you close your browser. Used for essential functions like maintaining your login session.
                                        </p>
                                    </div>
                                    <div className="p-4 border-l-4 border-green-500 bg-green-50/50 dark:bg-green-950/20">
                                        <h4 className="font-semibold mb-2">Persistent Cookies</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Remain on your device for a set period (typically 30 days to 2 years). Used for remembering preferences and analytics.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">How to Control Cookies</h2>
                                <p className="text-muted-foreground mb-4">
                                    You have several options to manage cookies:
                                </p>

                                <h3 className="text-xl font-semibold mb-3">1. Cookie Consent Banner</h3>
                                <p className="text-muted-foreground mb-4">
                                    When you first visit our website, you&apos;ll see a cookie consent banner where you can accept or reject optional cookies.
                                </p>

                                <h3 className="text-xl font-semibold mb-3">2. Browser Settings</h3>
                                <p className="text-muted-foreground mb-4">
                                    Most browsers allow you to control cookies through their settings. You can:
                                </p>
                                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                                    <li>Block all cookies</li>
                                    <li>Block third-party cookies only</li>
                                    <li>Delete cookies after each session</li>
                                    <li>Accept cookies from specific websites</li>
                                </ul>

                                <div className="bg-muted/50 p-4 rounded-lg mb-4">
                                    <p className="text-sm font-semibold mb-2">Browser-specific instructions:</p>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>• Chrome: Settings → Privacy and Security → Cookies</li>
                                        <li>• Firefox: Options → Privacy & Security → Cookies</li>
                                        <li>• Safari: Preferences → Privacy → Cookies</li>
                                        <li>• Edge: Settings → Privacy → Cookies</li>
                                    </ul>
                                </div>

                                <h3 className="text-xl font-semibold mb-3">3. Opt-Out Tools</h3>
                                <p className="text-muted-foreground mb-4">
                                    You can opt out of specific tracking:
                                </p>
                                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                                    <li>Google Analytics: <a href="https://tools.google.com/dlpage/gaoptout" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out</a></li>
                                    <li>Facebook: Ad Settings in your Facebook account</li>
                                    <li>Network Advertising Initiative: <a href="http://www.networkadvertising.org/choices/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">NAI Opt-out</a></li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">Impact of Disabling Cookies</h2>
                                <p className="text-muted-foreground mb-4">
                                    If you disable cookies, some features of our Service may not function properly:
                                </p>
                                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                                    <li>You may need to log in every time you visit</li>
                                    <li>Your preferences won&apos;t be saved</li>
                                    <li>Some pages may not display correctly</li>
                                    <li>Personalized content won&apos;t be available</li>
                                    <li>Application forms may not work properly</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">Do Not Track Signals</h2>
                                <p className="text-muted-foreground">
                                    Some browsers have a &quot;Do Not Track&quot; feature that signals to websites that you don&apos;t want to be tracked. We currently do not respond to Do Not Track signals, but you can control cookies through your browser settings or our cookie consent tool.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">Updates to This Cookie Policy</h2>
                                <p className="text-muted-foreground mb-4">
                                    We may update this Cookie Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons.
                                </p>
                                <p className="text-muted-foreground">
                                    We will notify you of any material changes by posting the new Cookie Policy on this page and updating the &quot;Last Updated&quot; date.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
                                <p className="text-muted-foreground mb-4">
                                    If you have any questions about our use of cookies, please contact us:
                                </p>
                                <div className="bg-muted/50 p-4 rounded-lg">
                                    <p className="text-muted-foreground">Email: privacy@studyinchina.com</p>
                                    <p className="text-muted-foreground">Cookie Questions: cookies@studyinchina.com</p>
                                    <p className="text-muted-foreground">Address: [Your Company Address]</p>
                                </div>
                            </section>
                        </div>
                    </Card>

                    {/* Related Links */}
                    <div className="mt-8 grid gap-4 md:grid-cols-2">
                        <Link href="/terms-of-service">
                            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                                <h3 className="font-bold mb-2">Terms of Service</h3>
                                <p className="text-sm text-muted-foreground">Read our terms and conditions</p>
                            </Card>
                        </Link>
                        <Link href="/privacy-policy">
                            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                                <h3 className="font-bold mb-2">Privacy Policy</h3>
                                <p className="text-sm text-muted-foreground">Learn about data protection</p>
                            </Card>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
