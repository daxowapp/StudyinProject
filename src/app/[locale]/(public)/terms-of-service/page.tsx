import { Card } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, FileText, Calendar } from "lucide-react";

export default function TermsOfServicePage() {
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
                            <FileText className="h-8 w-8 text-primary" />
                            <h1 className="text-4xl md:text-5xl font-bold font-heading bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                Terms of Service
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
                                <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
                                <p className="text-muted-foreground mb-4">
                                    By accessing and using the Study in China platform (&quot;Service&quot;), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use our Service.
                                </p>
                                <p className="text-muted-foreground">
                                    These terms apply to all visitors, users, and others who access or use the Service.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
                                <p className="text-muted-foreground mb-4">
                                    Study in China provides an online platform that connects international students with Chinese universities and educational programs. Our services include:
                                </p>
                                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                                    <li>University and program search and discovery</li>
                                    <li>Application submission and tracking</li>
                                    <li>Document management and verification</li>
                                    <li>Communication between students and universities</li>
                                    <li>Educational resources and guidance</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">3. User Accounts</h2>
                                <h3 className="text-xl font-semibold mb-3">3.1 Registration</h3>
                                <p className="text-muted-foreground mb-4">
                                    To use certain features of our Service, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
                                </p>

                                <h3 className="text-xl font-semibold mb-3">3.2 Account Security</h3>
                                <p className="text-muted-foreground mb-4">
                                    You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. You agree not to disclose your password to any third party and to notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
                                </p>

                                <h3 className="text-xl font-semibold mb-3">3.3 Account Termination</h3>
                                <p className="text-muted-foreground">
                                    We reserve the right to suspend or terminate your account if you violate these Terms of Service or engage in fraudulent, abusive, or illegal activities.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">4. Application Process</h2>
                                <h3 className="text-xl font-semibold mb-3">4.1 Application Submission</h3>
                                <p className="text-muted-foreground mb-4">
                                    When you submit an application through our platform, you represent and warrant that:
                                </p>
                                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                                    <li>All information provided is true, accurate, and complete</li>
                                    <li>All documents submitted are authentic and unaltered</li>
                                    <li>You have the legal right to submit the application</li>
                                    <li>You meet the eligibility requirements for the program</li>
                                </ul>

                                <h3 className="text-xl font-semibold mb-3">4.2 Application Fees</h3>
                                <p className="text-muted-foreground mb-4">
                                    Some universities may require application fees. These fees are non-refundable unless otherwise stated by the university. We are not responsible for application fees charged by universities.
                                </p>

                                <h3 className="text-xl font-semibold mb-3">4.3 No Guarantee of Admission</h3>
                                <p className="text-muted-foreground">
                                    We facilitate the application process but do not guarantee admission to any university or program. Admission decisions are made solely by the universities.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">5. Payment Terms</h2>
                                <p className="text-muted-foreground mb-4">
                                    If you choose to use paid services on our platform, you agree to pay all fees and charges associated with your account. All fees are non-refundable unless otherwise stated.
                                </p>
                                <p className="text-muted-foreground">
                                    We reserve the right to change our fees at any time. We will provide you with reasonable notice of any fee changes.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">6. Intellectual Property Rights</h2>
                                <p className="text-muted-foreground mb-4">
                                    The Service and its original content, features, and functionality are owned by Study in China and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                                </p>
                                <p className="text-muted-foreground">
                                    You may not copy, modify, distribute, sell, or lease any part of our Service without our prior written consent.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">7. User Content</h2>
                                <h3 className="text-xl font-semibold mb-3">7.1 Your Content</h3>
                                <p className="text-muted-foreground mb-4">
                                    You retain all rights to any content you submit, post, or display on or through the Service. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and display such content for the purpose of providing and improving the Service.
                                </p>

                                <h3 className="text-xl font-semibold mb-3">7.2 Prohibited Content</h3>
                                <p className="text-muted-foreground mb-4">
                                    You agree not to post content that:
                                </p>
                                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                                    <li>Is illegal, harmful, or offensive</li>
                                    <li>Infringes on intellectual property rights</li>
                                    <li>Contains viruses or malicious code</li>
                                    <li>Violates privacy or data protection laws</li>
                                    <li>Is fraudulent or misleading</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">8. Privacy and Data Protection</h2>
                                <p className="text-muted-foreground mb-4">
                                    Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your personal information.
                                </p>
                                <p className="text-muted-foreground">
                                    By using our Service, you consent to the collection and use of your information as described in our Privacy Policy.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">9. Disclaimer of Warranties</h2>
                                <p className="text-muted-foreground mb-4">
                                    THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT:
                                </p>
                                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                                    <li>The Service will be uninterrupted or error-free</li>
                                    <li>Defects will be corrected</li>
                                    <li>The Service is free of viruses or harmful components</li>
                                    <li>The results obtained from using the Service will be accurate or reliable</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">10. Limitation of Liability</h2>
                                <p className="text-muted-foreground mb-4">
                                    TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY.
                                </p>
                                <p className="text-muted-foreground">
                                    Our total liability to you for all claims arising from or related to the Service shall not exceed the amount you paid us in the twelve (12) months preceding the claim.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">11. Indemnification</h2>
                                <p className="text-muted-foreground">
                                    You agree to indemnify and hold harmless Study in China, its affiliates, officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of the Service or violation of these Terms.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">12. Changes to Terms</h2>
                                <p className="text-muted-foreground mb-4">
                                    We reserve the right to modify or replace these Terms at any time. We will provide notice of any material changes by posting the new Terms on this page and updating the &quot;Last Updated&quot; date.
                                </p>
                                <p className="text-muted-foreground">
                                    Your continued use of the Service after any changes constitutes acceptance of the new Terms.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">13. Governing Law</h2>
                                <p className="text-muted-foreground">
                                    These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which our company is registered, without regard to its conflict of law provisions.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">14. Contact Information</h2>
                                <p className="text-muted-foreground mb-4">
                                    If you have any questions about these Terms of Service, please contact us:
                                </p>
                                <div className="bg-muted/50 p-4 rounded-lg">
                                    <p className="text-muted-foreground">Email: legal@studyinchina.com</p>
                                    <p className="text-muted-foreground">Address: [Your Company Address]</p>
                                </div>
                            </section>
                        </div>
                    </Card>

                    {/* Related Links */}
                    <div className="mt-8 grid gap-4 md:grid-cols-2">
                        <Link href="/privacy-policy">
                            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                                <h3 className="font-bold mb-2">Privacy Policy</h3>
                                <p className="text-sm text-muted-foreground">Learn how we protect your personal data</p>
                            </Card>
                        </Link>
                        <Link href="/cookie-policy">
                            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                                <h3 className="font-bold mb-2">Cookie Policy</h3>
                                <p className="text-sm text-muted-foreground">Understand how we use cookies</p>
                            </Card>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}


/* GEO Fundamentals auto-patch:
// application/ld+json
// datePublished: 2026-02-26
*/
