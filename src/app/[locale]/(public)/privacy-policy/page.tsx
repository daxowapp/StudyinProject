import { Card } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Shield, Calendar, Lock, Eye, Database, UserCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
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
                            <Shield className="h-8 w-8 text-primary" />
                            <h1 className="text-4xl md:text-5xl font-bold font-heading bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                Privacy Policy
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
                                <h2 className="text-2xl font-bold mb-4">Introduction</h2>
                                <p className="text-muted-foreground mb-4">
                                    At Study in China, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
                                </p>
                                <p className="text-muted-foreground">
                                    By using our Service, you agree to the collection and use of information in accordance with this policy.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                    <Database className="h-6 w-6 text-primary" />
                                    1. Information We Collect
                                </h2>

                                <h3 className="text-xl font-semibold mb-3">1.1 Personal Information</h3>
                                <p className="text-muted-foreground mb-4">
                                    We collect personal information that you voluntarily provide to us when you:
                                </p>
                                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                                    <li>Register for an account</li>
                                    <li>Submit an application</li>
                                    <li>Contact us for support</li>
                                    <li>Subscribe to our newsletter</li>
                                    <li>Participate in surveys or promotions</li>
                                </ul>
                                <p className="text-muted-foreground mb-4">
                                    This information may include:
                                </p>
                                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                                    <li>Full name and contact details (email, phone number, address)</li>
                                    <li>Date of birth and nationality</li>
                                    <li>Passport information</li>
                                    <li>Educational background and qualifications</li>
                                    <li>Language proficiency test scores</li>
                                    <li>Financial information for scholarship applications</li>
                                    <li>Personal statement and motivation letters</li>
                                    <li>Recommendation letters</li>
                                </ul>

                                <h3 className="text-xl font-semibold mb-3 mt-6">1.2 Automatically Collected Information</h3>
                                <p className="text-muted-foreground mb-4">
                                    When you access our Service, we automatically collect certain information, including:
                                </p>
                                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                                    <li>IP address and device information</li>
                                    <li>Browser type and version</li>
                                    <li>Pages visited and time spent</li>
                                    <li>Referring website addresses</li>
                                    <li>Operating system and platform</li>
                                    <li>Cookies and similar tracking technologies</li>
                                </ul>

                                <h3 className="text-xl font-semibold mb-3 mt-6">1.3 Documents and Files</h3>
                                <p className="text-muted-foreground">
                                    We collect and store documents you upload for your applications, including transcripts, certificates, identification documents, and other supporting materials.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                    <Eye className="h-6 w-6 text-primary" />
                                    2. How We Use Your Information
                                </h2>
                                <p className="text-muted-foreground mb-4">
                                    We use the collected information for various purposes:
                                </p>
                                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                                    <li><strong>Application Processing:</strong> To submit and track your university applications</li>
                                    <li><strong>Account Management:</strong> To create and manage your user account</li>
                                    <li><strong>Communication:</strong> To send you updates, notifications, and respond to inquiries</li>
                                    <li><strong>Service Improvement:</strong> To analyze usage patterns and improve our platform</li>
                                    <li><strong>Personalization:</strong> To provide personalized recommendations and content</li>
                                    <li><strong>Security:</strong> To detect and prevent fraud, abuse, and security incidents</li>
                                    <li><strong>Legal Compliance:</strong> To comply with legal obligations and enforce our terms</li>
                                    <li><strong>Marketing:</strong> To send promotional materials (with your consent)</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">3. Information Sharing and Disclosure</h2>

                                <h3 className="text-xl font-semibold mb-3">3.1 Universities and Educational Institutions</h3>
                                <p className="text-muted-foreground mb-4">
                                    We share your application information with the universities and programs you apply to. This is necessary to process your applications.
                                </p>

                                <h3 className="text-xl font-semibold mb-3">3.2 Service Providers</h3>
                                <p className="text-muted-foreground mb-4">
                                    We may share your information with third-party service providers who perform services on our behalf, such as:
                                </p>
                                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                                    <li>Cloud storage providers</li>
                                    <li>Payment processors</li>
                                    <li>Email service providers</li>
                                    <li>Analytics providers</li>
                                    <li>Customer support tools</li>
                                </ul>

                                <h3 className="text-xl font-semibold mb-3">3.3 Legal Requirements</h3>
                                <p className="text-muted-foreground mb-4">
                                    We may disclose your information if required by law or in response to valid requests by public authorities.
                                </p>

                                <h3 className="text-xl font-semibold mb-3">3.4 Business Transfers</h3>
                                <p className="text-muted-foreground">
                                    In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                    <Lock className="h-6 w-6 text-primary" />
                                    4. Data Security
                                </h2>
                                <p className="text-muted-foreground mb-4">
                                    We implement appropriate technical and organizational measures to protect your personal information, including:
                                </p>
                                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                                    <li>Encryption of data in transit and at rest</li>
                                    <li>Regular security assessments and audits</li>
                                    <li>Access controls and authentication mechanisms</li>
                                    <li>Employee training on data protection</li>
                                    <li>Secure backup and disaster recovery procedures</li>
                                </ul>
                                <p className="text-muted-foreground mt-4">
                                    However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">5. Data Retention</h2>
                                <p className="text-muted-foreground mb-4">
                                    We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law.
                                </p>
                                <p className="text-muted-foreground">
                                    Application documents are typically retained for 7 years after the application process concludes. You may request deletion of your data at any time, subject to legal and contractual obligations.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                    <UserCheck className="h-6 w-6 text-primary" />
                                    6. Your Rights
                                </h2>
                                <p className="text-muted-foreground mb-4">
                                    Depending on your location, you may have the following rights regarding your personal information:
                                </p>
                                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                                    <li><strong>Access:</strong> Request a copy of your personal data</li>
                                    <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
                                    <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                                    <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                                    <li><strong>Objection:</strong> Object to processing of your personal data</li>
                                    <li><strong>Restriction:</strong> Request restriction of processing</li>
                                    <li><strong>Withdrawal of Consent:</strong> Withdraw consent for data processing</li>
                                </ul>
                                <p className="text-muted-foreground mt-4">
                                    To exercise these rights, please contact us at privacy@studyinchina.com
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">7. Cookies and Tracking Technologies</h2>
                                <p className="text-muted-foreground mb-4">
                                    We use cookies and similar tracking technologies to enhance your experience. For detailed information, please see our Cookie Policy.
                                </p>
                                <p className="text-muted-foreground">
                                    You can control cookies through your browser settings, but disabling cookies may affect the functionality of our Service.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">8. International Data Transfers</h2>
                                <p className="text-muted-foreground mb-4">
                                    Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws.
                                </p>
                                <p className="text-muted-foreground">
                                    We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">9. Children&apos;s Privacy</h2>
                                <p className="text-muted-foreground">
                                    Our Service is not intended for children under 16 years of age. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">10. Third-Party Links</h2>
                                <p className="text-muted-foreground">
                                    Our Service may contain links to third-party websites. We are not responsible for the privacy practices of these websites. We encourage you to read their privacy policies.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">11. Changes to This Privacy Policy</h2>
                                <p className="text-muted-foreground mb-4">
                                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date.
                                </p>
                                <p className="text-muted-foreground">
                                    We encourage you to review this Privacy Policy periodically for any changes.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">12. Contact Us</h2>
                                <p className="text-muted-foreground mb-4">
                                    If you have any questions about this Privacy Policy, please contact us:
                                </p>
                                <div className="bg-muted/50 p-4 rounded-lg">
                                    <p className="text-muted-foreground">Email: privacy@studyinchina.com</p>
                                    <p className="text-muted-foreground">Data Protection Officer: dpo@studyinchina.com</p>
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
                        <Link href="/cookie-policy">
                            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                                <h3 className="font-bold mb-2">Cookie Policy</h3>
                                <p className="text-sm text-muted-foreground">Learn about our cookie usage</p>
                            </Card>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
