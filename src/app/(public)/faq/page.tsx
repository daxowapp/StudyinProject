import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";

const faqs = [
    {
        category: "Applications",
        items: [
            {
                q: "When is the application deadline?",
                a: "Deadlines vary by university and program. Generally, for the September intake, applications close between March and June. Check specific program pages for exact dates.",
            },
            {
                q: "Can I apply to multiple universities?",
                a: "Yes, you can apply to as many programs as you like. However, each application requires a separate application fee.",
            },
            {
                q: "What documents do I need?",
                a: "Typically, you need a passport copy, highest degree certificate, transcripts, personal statement, and recommendation letters. Some programs may require language proficiency tests (IELTS/TOEFL/HSK).",
            },
        ],
    },
    {
        category: "Payments & Fees",
        items: [
            {
                q: "How do I pay the application fee?",
                a: "You can pay securely via Stripe using any major credit or debit card directly on our platform.",
            },
            {
                q: "Is the application fee refundable?",
                a: "No, application fees charged by universities and our service fees are non-refundable, regardless of the admission result.",
            },
        ],
    },
    {
        category: "Visa & Arrival",
        items: [
            {
                q: "How do I get a student visa?",
                a: "Once accepted, the university will send you an Admission Letter and a JW202 form. You need to take these documents to the Chinese embassy in your country to apply for an X1 (long-term) or X2 (short-term) visa.",
            },
            {
                q: "Can I work while studying in China?",
                a: "International students can work part-time or take internships with permission from their university and the immigration office. Unauthorized employment is illegal.",
            },
        ],
    },
];

export default function FAQPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b py-20">
                <div className="container mx-auto px-4 md:px-6 text-center">
                    <h1 className="text-4xl font-bold font-heading mb-4">Frequently Asked Questions</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                        Find answers to common questions about studying in China.
                    </p>

                    <div className="max-w-md mx-auto relative">
                        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input className="pl-10 h-12 text-lg" placeholder="Search for answers..." />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 py-16 max-w-4xl">
                <div className="space-y-12">
                    {faqs.map((section, index) => (
                        <div key={index}>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-10 w-1 bg-primary rounded-full" />
                                <h2 className="text-3xl font-bold">{section.category}</h2>
                            </div>
                            <Accordion type="single" collapsible className="w-full space-y-4">
                                {section.items.map((item, i) => (
                                    <AccordionItem key={i} value={`item-${index}-${i}`} className="border-none shadow-lg rounded-lg px-6 bg-card">
                                        <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary py-6">
                                            {item.q}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                                            {item.a}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    ))}
                </div>

                <div className="mt-20 bg-gradient-to-br from-primary/10 via-primary/5 to-background border-none shadow-xl rounded-2xl p-12 text-center">
                    <h3 className="text-2xl font-bold mb-3">Still have questions?</h3>
                    <p className="text-muted-foreground mb-8 text-lg">
                        Our support team is here to help you with any other inquiries.
                    </p>
                    <Button size="lg">Contact Support</Button>
                </div>
            </div>
        </div>
    );
}
