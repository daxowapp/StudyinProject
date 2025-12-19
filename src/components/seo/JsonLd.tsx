'use client';

interface JsonLdProps {
    data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}

// Organization schema for the website
export function OrganizationJsonLd({
    name = 'Studyatchina',
    url = 'https://studyatchina.com',
    logo = '/logo.png',
    description = 'Your gateway to studying in China. Browse top Chinese universities and scholarship opportunities.',
}: {
    name?: string;
    url?: string;
    logo?: string;
    description?: string;
}) {
    const data = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name,
        url,
        logo: `${url}${logo}`,
        description,
        sameAs: [
            // Add social media links when available
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            availableLanguage: ['English', 'Arabic', 'Persian', 'Turkish'],
        },
    };

    return <JsonLd data={data} />;
}

// EducationalOrganization schema for university pages
export function UniversityJsonLd({
    name,
    url,
    logo,
    description,
    address,
    foundingDate,
    numberOfStudents,
}: {
    name: string;
    url: string;
    logo?: string;
    description?: string;
    address?: { city: string; province: string; country?: string };
    foundingDate?: string;
    numberOfStudents?: number;
}) {
    const data: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'EducationalOrganization',
        '@id': url,
        name,
        url,
        description,
    };

    if (logo) data.logo = logo;
    if (foundingDate) data.foundingDate = foundingDate;
    if (numberOfStudents) data.numberOfStudents = numberOfStudents;

    if (address) {
        data.address = {
            '@type': 'PostalAddress',
            addressLocality: address.city,
            addressRegion: address.province,
            addressCountry: address.country || 'China',
        };
    }

    return <JsonLd data={data} />;
}

// Course schema for program pages
export function CourseJsonLd({
    name,
    description,
    provider,
    providerUrl,
    url,
    duration,
    educationalLevel,
    inLanguage,
    offers,
}: {
    name: string;
    description: string;
    provider: string;
    providerUrl: string;
    url: string;
    duration?: string;
    educationalLevel?: string;
    inLanguage?: string;
    offers?: { price: number; currency: string };
}) {
    const data: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'Course',
        '@id': url,
        name,
        description,
        url,
        provider: {
            '@type': 'EducationalOrganization',
            name: provider,
            url: providerUrl,
        },
    };

    if (duration) data.timeRequired = duration;
    if (educationalLevel) data.educationalLevel = educationalLevel;
    if (inLanguage) data.inLanguage = inLanguage;

    if (offers) {
        data.offers = {
            '@type': 'Offer',
            price: offers.price,
            priceCurrency: offers.currency,
            availability: 'https://schema.org/InStock',
        };
    }

    return <JsonLd data={data} />;
}

// BreadcrumbList schema
export function BreadcrumbJsonLd({
    items,
}: {
    items: { name: string; url: string }[];
}) {
    const data = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };

    return <JsonLd data={data} />;
}

// FAQPage schema
export function FAQJsonLd({
    questions,
}: {
    questions: { question: string; answer: string }[];
}) {
    const data = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: questions.map((q) => ({
            '@type': 'Question',
            name: q.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: q.answer,
            },
        })),
    };

    return <JsonLd data={data} />;
}

// Article schema for blog posts
export function ArticleJsonLd({
    headline,
    description,
    image,
    datePublished,
    dateModified,
    author,
    url,
}: {
    headline: string;
    description: string;
    image?: string;
    datePublished: string;
    dateModified?: string;
    author?: string;
    url: string;
}) {
    const data: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline,
        description,
        url,
        datePublished,
        dateModified: dateModified || datePublished,
        publisher: {
            '@type': 'Organization',
            name: 'Studyatchina',
            logo: {
                '@type': 'ImageObject',
                url: 'https://studyatchina.com/logo.png',
            },
        },
    };

    if (image) {
        data.image = {
            '@type': 'ImageObject',
            url: image,
        };
    }

    if (author) {
        data.author = {
            '@type': 'Person',
            name: author,
        };
    }

    return <JsonLd data={data} />;
}
