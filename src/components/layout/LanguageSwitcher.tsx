"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useTransition } from "react";

const languages = [
    { code: "en", name: "English", dir: "ltr" },
    { code: "tr", name: "Türkçe", dir: "ltr" },
    { code: "ar", name: "العربية", dir: "rtl" },
    { code: "fa", name: "فارسی", dir: "rtl" },
];

export function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const handleLanguageChange = (newLocale: string) => {
        startTransition(() => {
            router.replace(pathname, { locale: newLocale });
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" disabled={isPending} className="gap-2">
                    <Globe className="h-4 w-4" />
                    <span className="font-medium">{languages.find((l) => l.code === locale)?.name}</span>
                    <span className="sr-only">Switch language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`cursor-pointer ${locale === lang.code ? "bg-accent text-accent-foreground" : ""
                            }`}
                    >
                        <span className={lang.dir === "rtl" ? "font-cairo" : ""}>
                            {lang.name}
                        </span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
