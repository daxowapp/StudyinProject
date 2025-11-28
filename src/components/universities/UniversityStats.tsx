import { Card, CardContent } from "@/components/ui/card";
import { Users, Building2, Trophy, Languages } from "lucide-react";

interface UniversityStatsProps {
    stats: any;
}

export function UniversityStats({ stats }: UniversityStatsProps) {
    const items = [
        { label: "Founded", value: stats.founded, icon: Building2 },
        { label: "Students", value: stats.students, icon: Users },
        { label: "Ranking", value: stats.ranking, icon: Trophy },
        { label: "Intl. Students", value: stats.intlStudents, icon: Globe }, // Globe is not imported, using Languages instead
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {items.map((item, index) => (
                <Card key={index} className="border-none shadow-sm bg-muted/30">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <item.icon className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">{item.label}</p>
                            <p className="font-bold text-lg">{item.value}</p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

import { Globe } from "lucide-react";
