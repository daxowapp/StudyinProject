import { getLanguages } from "./actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LanguageDialog } from "./components/LanguageDialog";

export default async function LanguagesPage() {
    const languages = await getLanguages();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Languages</h1>
                    <p className="text-muted-foreground">
                        Manage languages available for programs.
                    </p>
                </div>
                <LanguageDialog />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {languages?.map((language) => (
                    <Card key={language.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xl font-semibold">
                                {language.name}
                            </CardTitle>
                            <LanguageDialog language={language} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-muted-foreground">
                                Code: <span className="font-mono bg-muted px-1 rounded">{language.code}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {languages?.length === 0 && (
                    <div className="col-span-full text-center py-12 border-2 border-dashed rounded-lg">
                        <h3 className="text-lg font-medium">No languages found</h3>
                        <p className="text-muted-foreground mb-4">
                            Add languages to associate with programs.
                        </p>
                        <LanguageDialog />
                    </div>
                )}
            </div>
        </div>
    );
}
