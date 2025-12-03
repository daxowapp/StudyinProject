"use client";

import { submitLead } from "../download-guide/actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, HelpCircle } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
                <div className="container mx-auto px-4 md:px-6 py-16">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 font-semibold text-sm mb-4">
                            <MessageSquare className="h-4 w-4 text-red-600" />
                            <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">Get in Touch</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            Contact Us
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Have questions about studying in China? We're here to help you every step of the way.
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 py-16">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <Card className="border-none shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-2xl">Send us a Message</CardTitle>
                                <CardDescription>
                                    Fill out the form below and we'll get back to you within 24 hours
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form action={async (formData) => {
                                    const result = await submitLead(formData);
                                    if (result.success) {
                                        toast.success("Message sent successfully!");
                                        (document.getElementById("contact-form") as HTMLFormElement)?.reset();
                                    } else {
                                        toast.error("Failed to send message");
                                    }
                                }} id="contact-form" className="space-y-6">
                                    <input type="hidden" name="source" value="contact_us" />
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First Name *</Label>
                                            <Input
                                                id="firstName"
                                                name="firstName"
                                                placeholder="John"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last Name *</Label>
                                            <Input
                                                id="lastName"
                                                name="lastName"
                                                placeholder="Doe"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email *</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="john@example.com"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                placeholder="+1 (555) 000-0000"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="subject">Subject *</Label>
                                        <Select name="subject">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a subject" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="admission">Admission Inquiry</SelectItem>
                                                <SelectItem value="scholarship">Scholarship Information</SelectItem>
                                                <SelectItem value="visa">Visa Assistance</SelectItem>
                                                <SelectItem value="programs">Program Information</SelectItem>
                                                <SelectItem value="general">General Question</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="message">Message *</Label>
                                        <Textarea
                                            id="message"
                                            name="message"
                                            placeholder="Tell us more about your inquiry..."
                                            rows={6}
                                            required
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                                        size="lg"
                                    >
                                        <Send className="mr-2 h-4 w-4" />
                                        Send Message
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-6">
                        {/* Contact Details Card */}
                        <Card className="border-none shadow-xl">
                            <CardHeader>
                                <CardTitle>Contact Information</CardTitle>
                                <CardDescription>
                                    Reach out to us through any of these channels
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center shrink-0">
                                        <Mail className="h-5 w-5 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold mb-1">Email</p>
                                        <a href="mailto:info@studyatchina.com" className="text-sm text-muted-foreground hover:text-primary">
                                            info@studyatchina.com
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center shrink-0">
                                        <Phone className="h-5 w-5 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold mb-1">Phone</p>
                                        <a href="tel:+861234567890" className="text-sm text-muted-foreground hover:text-primary">
                                            +86 123 456 7890
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center shrink-0">
                                        <MapPin className="h-5 w-5 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold mb-1">Office</p>
                                        <p className="text-sm text-muted-foreground">
                                            Beijing, China<br />
                                            100000
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center shrink-0">
                                        <Clock className="h-5 w-5 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold mb-1">Business Hours</p>
                                        <p className="text-sm text-muted-foreground">
                                            Monday - Friday: 9:00 AM - 6:00 PM<br />
                                            Saturday: 10:00 AM - 4:00 PM<br />
                                            Sunday: Closed
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* FAQ Card */}
                        <Card className="border-none shadow-xl bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <HelpCircle className="h-5 w-5 text-red-600" />
                                    Quick Help
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Before contacting us, you might find answers in our FAQ section.
                                </p>
                                <Button variant="outline" className="w-full" asChild>
                                    <a href="/faq">
                                        Visit FAQ
                                    </a>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Map Section */}
                <div className="mt-16">
                    <Card className="border-none shadow-xl overflow-hidden">
                        <div className="aspect-video bg-muted relative">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d116.4074!3d39.9042!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMznCsDU0JzE1LjEiTiAxMTbCsDI0JzI2LjYiRQ!5e0!3m2!1sen!2s!4v1234567890"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="absolute inset-0"
                            />
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
