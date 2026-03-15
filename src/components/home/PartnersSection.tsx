import { Award, CheckCircle, Shield, Building2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

interface University {
    id: string;
    name: string;
    slug: string;
    logo_url?: string;
}

interface PartnersSectionProps {
    universities?: University[];
}

export async function PartnersSection({ universities = [] }: PartnersSectionProps) {
    const t = await getTranslations('Partners');
    const displayUniversities = universities.slice(0, 6);

    const recognitions = [
        { key: 'unesco', icon: Award },
        { key: 'government', icon: Shield },
        { key: 'accredited', icon: CheckCircle },
    ];

    return (
        <section className="py-16 bg-muted/20 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-12 animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 font-semibold text-sm mb-4">
                        <Award className="h-4 w-4 text-primary" />
                        <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{t('badge')}</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight font-heading mb-4">
                        {t('title')}
                    </h2>
                    <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
                        {t('description')}
                    </p>
                </div>

                {/* University Logos */}
                <div className="mb-16">
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-6 md:gap-8">
                        {displayUniversities.map((university) => (
                            <Link href={`/universities/${university.slug}`} key={university.id} className="block">
                                <div
                                    className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 group aspect-square h-full"
                                >
                                    <div className="w-full h-20 mb-3 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        {university.logo_url && !university.logo_url.startsWith('data:') ? (
                                            <Image
                                                src={university.logo_url}
                                                alt={university.name}
                                                width={80}
                                                height={80}
                                                className="max-w-full max-h-full object-contain"
                                                unoptimized={university.logo_url.startsWith('http')}
                                            />
                                        ) : (
                                            <Building2 className="h-12 w-12 text-primary" />
                                        )}
                                    </div>
                                    <div className="text-xs text-center font-semibold text-muted-foreground group-hover:text-primary transition-colors line-clamp-2">
                                        {university.name}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Recognition Badges */}
                <div className="grid md:grid-cols-3 gap-6">
                    {recognitions.map((recognition, index) => (
                        <div
                            key={index}
                            className="flex items-start gap-4 p-6 rounded-2xl bg-white shadow-md hover:shadow-lg transition-all duration-300"
                        >
                            <div className="shrink-0 h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                <recognition.icon className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground mb-1">{t(`recognitions.${recognition.key}.title`)}</h3>
                                <p className="text-sm text-muted-foreground">{t(`recognitions.${recognition.key}.description`)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
