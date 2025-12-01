"use client";

import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

interface FiltersProps {
    cities: string[];
    provinces: string[];
}

export function UniversityFilters({ cities, provinces }: FiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set("search", term);
        } else {
            params.delete("search");
        }
        router.replace(`?${params.toString()}`);
    }, 300);

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value && value !== "all") {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.replace(`?${params.toString()}`);
    };

    return (
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    className="pl-9"
                    placeholder="Search universities..."
                    onChange={(e) => handleSearch(e.target.value)}
                    defaultValue={searchParams.get("search")?.toString()}
                />
            </div>
            <Select
                defaultValue={searchParams.get("city")?.toString() || "all"}
                onValueChange={(value) => handleFilterChange("city", value)}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by City" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    {cities.map((city) => (
                        <SelectItem key={city} value={city}>
                            {city}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select
                defaultValue={searchParams.get("province")?.toString() || "all"}
                onValueChange={(value) => handleFilterChange("province", value)}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by Province" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Provinces</SelectItem>
                    {provinces.map((province) => (
                        <SelectItem key={province} value={province}>
                            {province}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
