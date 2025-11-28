import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MapPin, BookOpen, DollarSign } from "lucide-react";
import Link from "next/link";

interface University {
    id: string;
    name: string;
    city: string;
    province: string;
    programs: number;
    minTuition: string;
    badges: string[];
    logo?: string;
}

interface UniversityCardProps {
    university: University;
}

export function UniversityCard({ university }: UniversityCardProps) {
    return (
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-none shadow-sm bg-card group">
            <div className="h-32 bg-muted relative group-hover:scale-105 transition-transform duration-500">
                {/* Placeholder for Banner */}
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30 font-medium">
                    {university.name} Banner
                </div>
            </div>

            <CardContent className="p-6 pt-8 relative">
                {/* Logo */}
                <div className="absolute -top-10 left-6 h-16 w-16 rounded-xl bg-background shadow-md flex items-center justify-center border text-xs font-bold z-10">
                    Logo
                </div>

                <div className="mb-4">
                    <h3 className="font-bold text-lg leading-tight mb-1 group-hover:text-primary transition-colors">
                        {university.name}
                    </h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        {university.city}, {university.province}
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                    {university.badges.map((badge) => (
                        <Badge key={badge} variant="secondary" className="text-xs font-normal">
                            {badge}
                        </Badge>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-dashed">
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <BookOpen className="h-3 w-3" /> Programs
                        </span>
                        <span className="font-semibold">{university.programs}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <DollarSign className="h-3 w-3" /> Tuition From
                        </span>
                        <span className="font-semibold text-primary">{university.minTuition}</span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-6 pt-0 flex gap-2">
                <Link href={`/universities/${university.slug}`} className="w-full">
                    <Button className="w-full">View University</Button>
                </Link>
                <Link href={`/programs?university=${university.slug}`} className="w-full">
                    <Button variant="outline" className="w-full">View Programs</Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
