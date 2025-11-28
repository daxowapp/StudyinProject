import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Clock, Calendar, DollarSign, BookOpen } from "lucide-react";
import Link from "next/link";

interface ProgramHeaderProps {
    program: any;
}

export function ProgramHeader({ program }: ProgramHeaderProps) {
    return (
        <div className="relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-primary/5 h-[400px] -z-10" />

            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Main Info */}
                    <div className="flex-1 space-y-6">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-background">{program.level}</Badge>
                            {program.badges.map((badge: string) => (
                                <Badge key={badge} variant="secondary" className="bg-accent/20 text-accent-foreground hover:bg-accent/30">
                                    {badge}
                                </Badge>
                            ))}
                        </div>

                        <h1 className="text-3xl md:text-5xl font-bold font-heading leading-tight">
                            {program.name}
                        </h1>

                        <div className="flex items-center gap-2 text-lg text-muted-foreground">
                            <span className="font-semibold text-foreground">{program.university}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" /> {program.city}
                            </span>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4 pt-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center text-primary shadow-sm">
                                    <Clock className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Duration</p>
                                    <p className="font-semibold">{program.duration}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center text-primary shadow-sm">
                                    <BookOpen className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Language</p>
                                    <p className="font-semibold">{program.language}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center text-primary shadow-sm">
                                    <Calendar className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Next Intake</p>
                                    <p className="font-semibold">{program.intake}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center text-primary shadow-sm">
                                    <DollarSign className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Tuition</p>
                                    <p className="font-semibold">{program.tuition}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sticky Apply Box */}
                    <div className="w-full lg:w-[350px] shrink-0 lg:sticky lg:top-24">
                        <Card className="shadow-xl border-t-4 border-t-primary">
                            <CardHeader>
                                <CardTitle className="text-xl">Application Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Tuition Fee</span>
                                        <span className="font-semibold">{program.tuition}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Application Fee</span>
                                        <span className="font-semibold">{program.applicationFee}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Service Fee</span>
                                        <span className="font-semibold">{program.serviceFee}</span>
                                    </div>
                                    <div className="border-t pt-3 flex justify-between font-bold text-lg">
                                        <span>Total Initial</span>
                                        <span className="text-primary">{program.totalInitial}</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md text-xs text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800">
                                        <strong>Deadline:</strong> {program.deadline}
                                    </div>
                                    <Link href="/applications/new">
                                        <Button className="w-full text-lg py-6 shadow-lg shadow-primary/20">
                                            Apply Now
                                        </Button>
                                    </Link>
                                    <p className="text-xs text-center text-muted-foreground">
                                        You can save your application as a draft.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
