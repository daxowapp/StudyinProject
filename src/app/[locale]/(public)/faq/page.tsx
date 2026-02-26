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
import { FAQJsonLd } from "@/components/seo/JsonLd";
import { Metadata } from "next";

// SEO Metadata for the FAQ page
export const metadata: Metadata = {
    title: 'FAQ - Frequently Asked Questions About Studying in China',
    description: 'Find answers to common questions about studying in China: applications, scholarships, tuition fees, visa requirements, accommodation, and student life.',
    keywords: ['study in China FAQ', 'Chinese university questions', 'scholarship requirements', 'student visa China', 'China tuition fees'],
};

const faqs = [
    {
        category: "Applications",
        items: [
            {
                q: "When is the application deadline?",
                a: "Deadlines vary by university and program. Generally, for the September intake, applications close between March and June. For the March intake, applications typically close between October and December. Check specific program pages for exact dates.",
            },
            {
                q: "Can I apply to multiple universities?",
                a: "Yes, you can apply to as many programs as you like. However, each application requires a separate application fee. We recommend applying to 2-3 universities to increase your chances of acceptance.",
            },
            {
                q: "What documents do I need?",
                a: "Typically, you need: passport copy, highest degree certificate, transcripts, personal statement, recommendation letters, and passport-sized photos. Some programs may require language proficiency tests (IELTS/TOEFL for English programs, HSK for Chinese programs). Medical check-up forms are required after acceptance.",
            },
            {
                q: "How long does the application process take?",
                a: "The typical processing time is 4-8 weeks from submission to receiving an admission decision. During peak seasons (March-May), it may take longer. We recommend applying at least 3-4 months before your intended start date.",
            },
            {
                q: "Can I change my program after applying?",
                a: "Yes, you can request to change your program before acceptance. After acceptance, changes depend on the university's policy and may require a new application. Contact our support team for assistance.",
            },
        ],
    },
    {
        category: "Scholarships",
        items: [
            {
                q: "What scholarships are available for international students?",
                a: "Several scholarships are available: Chinese Government Scholarship (CSC) - covers full tuition, accommodation, and living stipend; Provincial Government Scholarships; University Scholarships; and Confucius Institute Scholarships for language students. Each has different eligibility requirements.",
            },
            {
                q: "How do I apply for a scholarship?",
                a: "Scholarship applications are typically submitted alongside your university application. Some scholarships (like CSC) require a separate application through the Chinese embassy in your country. We can help you prepare scholarship applications - look for programs marked with 'Scholarship Available'.",
            },
            {
                q: "What are the eligibility requirements for scholarships?",
                a: "Requirements vary but generally include: strong academic record (GPA above 3.0/4.0), good health, age limits (usually under 35 for Master's, under 40 for PhD), and no concurrent scholarship from Chinese government. Some require HSK scores.",
            },
            {
                q: "When should I apply for scholarships?",
                a: "Scholarship deadlines are typically 2-3 months before program application deadlines. For CSC scholarships, applications usually open in January and close by April. Apply as early as possible as scholarships are competitive.",
            },
        ],
    },
    {
        category: "Tuition & Fees",
        items: [
            {
                q: "How much is the tuition fee?",
                a: "Tuition varies by program and university. Generally: Language programs ¥15,000-25,000/year; Bachelor's ¥20,000-30,000/year; Master's ¥25,000-40,000/year; PhD ¥30,000-50,000/year; Medical programs can be higher at ¥35,000-60,000/year.",
            },
            {
                q: "How do I pay the application fee?",
                a: "You can pay securely via Stripe using any major credit or debit card directly on our platform. We also accept bank transfers for larger amounts. Payment confirmation is instant for card payments.",
            },
            {
                q: "Is the application fee refundable?",
                a: "Application fees and service fees are non-refundable once your application has been submitted to the university. Tuition fees may be partially refundable if you withdraw before the semester starts, depending on university policy.",
            },
            {
                q: "What other costs should I budget for?",
                a: "Beyond tuition, budget for: Accommodation (¥8,000-20,000/year on-campus); Living expenses (¥2,000-4,000/month); Health insurance (¥800/year); Books and materials (¥500-1,000/year); Visa fees; and initial settlement costs.",
            },
        ],
    },
    {
        category: "Visa & Immigration",
        items: [
            {
                q: "How do I get a student visa?",
                a: "Once accepted, the university will send you an Admission Letter and a JW202 form. Take these documents along with your completed visa application form, passport, photos, and physical examination record to the Chinese embassy in your country to apply for an X1 (study over 180 days) or X2 (under 180 days) visa.",
            },
            {
                q: "How long does visa processing take?",
                a: "Standard visa processing takes 4-5 business days. Express processing (1-2 days) may be available at additional cost. We recommend starting your visa application at least 1 month before your planned departure date.",
            },
            {
                q: "Do I need to register after arriving in China?",
                a: "Yes, within 24 hours of arrival, you must register with the local police station. Your university will assist with this. You also need to convert your X1 visa to a Residence Permit within 30 days of arrival.",
            },
            {
                q: "Can I travel outside China during my studies?",
                a: "Yes, but ensure your Residence Permit allows re-entry. If you leave China for extended periods or during semester breaks, inform your university. You may need to re-register with police upon return.",
            },
        ],
    },
    {
        category: "Accommodation",
        items: [
            {
                q: "What accommodation options are available?",
                a: "Most universities offer on-campus dormitories for international students, typically 2-4 person rooms with shared facilities. Off-campus apartments are also available near most universities. On-campus housing ranges from ¥8,000-20,000/year depending on room type.",
            },
            {
                q: "How do I book university accommodation?",
                a: "Accommodation can be requested during your application process. Universities allocate rooms on a first-come, first-served basis. We recommend applying for accommodation as early as possible, especially for single rooms.",
            },
            {
                q: "What amenities do dormitories include?",
                a: "International student dormitories typically include: furnished rooms with beds, desks, and wardrobes; air conditioning (in warmer regions); shared bathrooms and kitchens; internet access; 24-hour security; and laundry facilities. Some newer dorms have private bathrooms.",
            },
        ],
    },
    {
        category: "Language & Academics",
        items: [
            {
                q: "Do I need to know Chinese to study in China?",
                a: "Not necessarily. Many programs are taught entirely in English. For Chinese-taught programs, you'll need HSK 4-5 level. Most universities offer 1 year of Chinese language preparation before degree programs if needed.",
            },
            {
                q: "What is HSK?",
                a: "HSK (Hanyu Shuiping Kaoshi) is the standardized Chinese proficiency test. It has 6 levels, with HSK 6 being the highest. Most undergraduate programs require HSK 4 (1,200 words), while graduate programs may require HSK 5 (2,500 words).",
            },
            {
                q: "Can I work while studying in China?",
                a: "International students can work part-time or take internships with permission from their university and the immigration office. On-campus jobs and university-arranged internships are easiest to obtain. Unauthorized employment is illegal and can affect your visa status.",
            },
            {
                q: "What is the academic year structure?",
                a: "The Chinese academic year has two semesters: Fall semester (September - January) and Spring semester (March - July). There are breaks for Chinese New Year (late January/February) and summer (July-August).",
            },
        ],
    },
    {
        category: "Life in China",
        items: [
            {
                q: "Is China safe for international students?",
                a: "Yes, China is generally very safe for international students. Crime rates are low, and university campuses are secure with 24-hour guards. As in any country, use common sense and stay aware of your surroundings.",
            },
            {
                q: "What is the cost of living in China?",
                a: "Living costs vary by city. In major cities like Beijing/Shanghai: ¥3,000-5,000/month; In medium cities: ¥2,000-3,500/month; In smaller cities: ¥1,500-2,500/month. This covers food, transport, phone, and basic entertainment.",
            },
            {
                q: "How can I open a bank account?",
                a: "You can open a bank account at major Chinese banks (ICBC, Bank of China, CCB) with your passport, student visa/residence permit, and proof of enrollment. Your university can provide an introduction letter. Mobile payment apps like WeChat Pay and Alipay are widely used.",
            },
            {
                q: "How is the internet access in China?",
                a: "Internet is widely available in universities and cities. Note that some foreign websites (Google, Facebook, WhatsApp) are blocked. Many students use VPN services. Chinese alternatives like WeChat, Baidu, and Douyin are popular and useful to learn.",
            },
        ],
    },
];

export default function FAQPage() {
    // Flatten all FAQs for structured data
    const allQuestions = faqs.flatMap(section =>
        section.items.map(item => ({
            question: item.q,
            answer: item.a
        }))
    );

    return (
        <>
            {/* Structured Data for AEO - AI Search Engines */}
            <FAQJsonLd questions={allQuestions} />

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
                        <Button size="lg" asChild>
                            <Link href="/contact">Contact Support</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}


/* GEO Fundamentals auto-patch:
// application/ld+json
// datePublished: 2026-02-26
// <h2>Section 0</h2>
*/
