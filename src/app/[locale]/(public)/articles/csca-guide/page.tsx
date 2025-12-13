import { Link } from '@/i18n/routing';
import { ArrowLeft, BookOpen, Calculator, Calendar, CheckCircle2, FlaskConical, Languages, Microscope, Trophy, HelpCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
    title: 'Comprehensive Guide to CSCA Exam in China | StudyIn',
    description: 'Everything you need to know about the China Scholastic Competency Assessment (CSCA) - the standardized entrance exam for international students.',
};

export default function CSCAGuidePage() {
    const t = useTranslations('CSCAGuide');

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Hero Section */}
            <div className="bg-primary/5 border-b border-border">
                <div className="container mx-auto px-4 py-16">
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {t('backHome')}
                    </Link>

                    <div className="max-w-4xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            {t('newRequirement')}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                            <div dangerouslySetInnerHTML={{ __html: t.raw('title') }} />
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                            {t('subtitle')}
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Main Content */}
                    <div className="lg:col-span-8 space-y-12">

                        {/* Overview */}
                        <section className="prose prose-lg dark:prose-invert max-w-none">
                            <h2 className="flex items-center gap-3 text-2xl font-bold text-foreground mb-6">
                                <BookOpen className="w-6 h-6 text-primary" />
                                {t('sections.overview.title')}
                            </h2>
                            <div
                                className="text-muted-foreground"
                                dangerouslySetInnerHTML={{ __html: t.raw('sections.overview.content') }}
                            />

                            <div className="grid sm:grid-cols-3 gap-6 mt-8 not-prose">
                                {[
                                    { year: '2025', desc: 'sections.overview.keyDates.launch' },
                                    { year: '2026', desc: 'sections.overview.keyDates.mandatory' },
                                    { year: '2028', desc: 'sections.overview.keyDates.full' }
                                ].map((item, i) => (
                                    <div key={i} className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                                        <div className="text-3xl font-bold text-primary mb-2">{item.year}</div>
                                        <div className="text-sm text-muted-foreground font-medium">{t(item.desc)}</div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Structure */}
                        <section>
                            <h2 className="flex items-center gap-3 text-2xl font-bold text-foreground mb-6">
                                <Trophy className="w-6 h-6 text-primary" />
                                {t('sections.structure.title')}
                            </h2>
                            <p className="text-muted-foreground mb-8">{t('sections.structure.description')}</p>

                            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-muted/50 border-b border-border">
                                        <tr>
                                            <th className="p-4 font-semibold text-foreground">{t('sections.structure.table.subject')}</th>
                                            <th className="p-4 font-semibold text-foreground">{t('sections.structure.table.duration')}</th>
                                            <th className="p-4 font-semibold text-foreground">{t('sections.structure.table.questions')}</th>
                                            <th className="p-4 font-semibold text-foreground">{t('sections.structure.table.requirement')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {[
                                            {
                                                name: 'sections.structure.table.chinese.name',
                                                dur: '45 mins',
                                                q: '50',
                                                req: 'sections.structure.table.chinese.req',
                                                icon: Languages
                                            },
                                            {
                                                name: 'sections.structure.table.math.name',
                                                dur: '60 mins',
                                                q: '45',
                                                req: 'sections.structure.table.math.req',
                                                icon: Calculator
                                            },
                                            {
                                                name: 'sections.structure.table.physics.name',
                                                dur: '45 mins',
                                                q: '40',
                                                req: 'sections.structure.table.physics.req',
                                                icon: Microscope
                                            },
                                            {
                                                name: 'sections.structure.table.chemistry.name',
                                                dur: '45 mins',
                                                q: '40',
                                                req: 'sections.structure.table.chemistry.req',
                                                icon: FlaskConical
                                            }
                                        ].map((row, i) => (
                                            <tr key={i} className="hover:bg-muted/50 transition-colors">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                                            <row.icon className="w-4 h-4" />
                                                        </div>
                                                        <span className="font-medium text-foreground">{t(row.name)}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-muted-foreground">{row.dur}</td>
                                                <td className="p-4 text-muted-foreground">{row.q}</td>
                                                <td className="p-4">
                                                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${i < 2 ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                                                        }`}>
                                                        {t(row.req)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* In-depth Subjects */}
                        <section className="space-y-8">
                            <h2 className="text-2xl font-bold text-foreground">{t('sections.subjects.title')}</h2>

                            {/* Chinese */}
                            <div className="bg-card p-8 rounded-2xl border border-border shadow-sm">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-primary/10 rounded-xl">
                                        <Languages className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-foreground mb-2">{t('sections.subjects.chinese.title')}</h3>
                                        <p className="text-muted-foreground mb-6" dangerouslySetInnerHTML={{ __html: t.raw('sections.subjects.chinese.description') }} />
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            {[
                                                { title: 'sections.subjects.chinese.char.title', desc: 'sections.subjects.chinese.char.desc' },
                                                { title: 'sections.subjects.chinese.reading.title', desc: 'sections.subjects.chinese.reading.desc' },
                                                { title: 'sections.subjects.chinese.words.title', desc: 'sections.subjects.chinese.words.desc' },
                                                { title: 'sections.subjects.chinese.sentences.title', desc: 'sections.subjects.chinese.sentences.desc' }
                                            ].map((item, i) => (
                                                <div key={i} className="flex gap-3">
                                                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                                                    <div>
                                                        <div className="font-semibold text-foreground text-sm">{t(item.title)}</div>
                                                        <div className="text-sm text-muted-foreground">{t(item.desc)}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Math */}
                            <div className="bg-card p-8 rounded-2xl border border-border shadow-sm">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-primary/10 rounded-xl">
                                        <Calculator className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-foreground mb-2">{t('sections.subjects.math.title')}</h3>
                                        <p className="text-muted-foreground mb-4">{t('sections.subjects.math.description')}</p>
                                        <div className="flex gap-2 mb-6">
                                            <span className="px-2.5 py-1 rounded-md bg-muted text-xs font-medium text-muted-foreground border border-border">
                                                {t('sections.subjects.math.note')}
                                            </span>
                                        </div>
                                        <div className="space-y-3 bg-muted/30 p-4 rounded-xl border border-border">
                                            <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: t.raw('sections.subjects.math.topics') }} />
                                            <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: t.raw('sections.subjects.math.style') }} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sciences */}
                            <div className="grid sm:grid-cols-2 gap-6">
                                {[
                                    {
                                        icon: FlaskConical,
                                        title: 'sections.subjects.chem.title',
                                        desc: 'sections.subjects.chem.desc',
                                        topics: 'sections.subjects.chem.items'
                                    },
                                    {
                                        icon: Microscope,
                                        title: 'sections.subjects.phys.title',
                                        desc: 'sections.subjects.phys.desc',
                                        topics: 'sections.subjects.phys.items'
                                    }
                                ].map((item, i) => (
                                    <div key={i} className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 bg-primary/10 rounded-lg">
                                                <item.icon className="w-5 h-5 text-primary" />
                                            </div>
                                            <h3 className="font-bold text-foreground">{t(item.title)}</h3>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-4">{t(item.desc)}</p>
                                        <div className="text-sm font-medium text-foreground bg-muted/50 p-3 rounded-lg border border-border">
                                            {t(item.topics)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* FAQ Section */}
                        <section className="space-y-8">
                            <h2 className="flex items-center gap-3 text-2xl font-bold text-foreground">
                                <HelpCircle className="w-6 h-6 text-primary" />
                                {t('sections.faq.title')}
                            </h2>
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className="text-start">{t('sections.faq.q1.q')}</AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground leading-relaxed">
                                        {t('sections.faq.q1.a')}
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger className="text-start">{t('sections.faq.q2.q')}</AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground leading-relaxed">
                                        <div dangerouslySetInnerHTML={{ __html: t.raw('sections.faq.q2.a') }} />
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3">
                                    <AccordionTrigger className="text-start">{t('sections.faq.q3.q')}</AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground leading-relaxed">
                                        <div dangerouslySetInnerHTML={{ __html: t.raw('sections.faq.q3.a') }} />
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-4">
                                    <AccordionTrigger className="text-start">{t('sections.faq.q4.q')}</AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground leading-relaxed">
                                        <div dangerouslySetInnerHTML={{ __html: t.raw('sections.faq.q4.a') }} />
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </section>

                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm sticky top-24">
                            <h3 className="font-bold text-lg text-foreground mb-6">{t('sections.sidebar.title')}</h3>

                            <div className="space-y-6">
                                {[
                                    { icon: Calendar, label: 'sections.sidebar.dates.title', val: 'sections.sidebar.dates.desc' },
                                    { icon: BookOpen, label: 'sections.sidebar.prep.title', val: 'sections.sidebar.prep.desc' },
                                    { icon: CheckCircle2, label: 'sections.sidebar.passing.title', val: 'sections.sidebar.passing.desc' }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="p-2 bg-muted rounded-lg h-fit">
                                            <item.icon className="w-5 h-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-muted-foreground">{t(item.label)}</div>
                                            <div className="text-foreground font-semibold">{t(item.val)}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 pt-6 border-t border-border">
                                <div className="flex items-start gap-3 p-4 bg-amber-500/10 rounded-xl border border-amber-500/20 mb-6">
                                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                                    <p className="text-sm text-amber-900 dark:text-amber-100 font-medium">
                                        {t('sections.sidebar.warning')}
                                    </p>
                                </div>

                                <a
                                    href="https://www.csca.cn"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex w-full items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors mb-3"
                                >
                                    {t('sections.sidebar.register')}
                                    <ArrowRight className="w-4 h-4" />
                                </a>

                                {/* Tutor Section */}
                                <div className="mt-6 pt-6 border-t border-border">
                                    <h4 className="font-bold text-foreground mb-2">{t('sections.sidebar.tutor.title')}</h4>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        {t('sections.sidebar.tutor.desc')}
                                    </p>
                                    <Link
                                        href="/contact"
                                        className="flex w-full items-center justify-center gap-2 bg-background border border-border text-foreground hover:bg-accent/50 text-accent-foreground py-3 rounded-xl font-semibold transition-colors"
                                    >
                                        {t('sections.sidebar.tutor.button')}
                                    </Link>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
