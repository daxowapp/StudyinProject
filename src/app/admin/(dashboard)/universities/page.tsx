import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Award, Home } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { UniversityFilters } from "./filters";

export default async function AdminUniversitiesPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const supabase = await createClient();
    const params = await searchParams;

    // Parse search params
    const search = typeof params.search === 'string' ? params.search : '';
    const city = typeof params.city === 'string' ? params.city : '';
    const province = typeof params.province === 'string' ? params.province : '';

    // Build query
    let query = supabase
        .from("universities")
        .select("*, university_programs(count)", { count: 'exact' });

    if (search) {
        query = query.ilike('name', `%${search}%`);
    }
    if (city && city !== 'all') {
        query = query.eq('city', city);
    }
    if (province && province !== 'all') {
        query = query.eq('province', province);
    }

    const { data: universities } = await query.order("created_at", { ascending: false });

    // Fetch unique cities and provinces for filters
    // We can do this efficiently by querying distinct values
    const { data: citiesData } = await supabase
        .from("universities")
        .select("city")
        .not("city", "is", null)
        .order("city");

    const { data: provincesData } = await supabase
        .from("universities")
        .select("province")
        .not("province", "is", null)
        .order("province");

    // Extract unique values
    const cities = Array.from(new Set(citiesData?.map(item => item.city) || [])).filter(Boolean) as string[];
    const provinces = Array.from(new Set(provincesData?.map(item => item.province) || [])).filter(Boolean) as string[];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-heading">Universities</h1>
                    <p className="text-muted-foreground">Manage universities and their programs.</p>
                </div>
                <Link href="/admin/universities/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add University
                    </Button>
                </Link>
            </div>

            <UniversityFilters cities={cities} provinces={provinces} />

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>City</TableHead>
                            <TableHead>Programs</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {universities?.map((uni: any) => (
                            <TableRow key={uni.id}>
                                <TableCell className="font-medium">{uni.name}</TableCell>
                                <TableCell>{uni.city}</TableCell>
                                <TableCell>{uni.university_programs?.[0]?.count || 0}</TableCell>
                                <TableCell>
                                    <Badge variant="default">Active</Badge>
                                </TableCell>
                                <TableCell>{new Date(uni.created_at).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link href={`/admin/universities/${uni.id}/scholarships`}>
                                            <Button variant="outline" size="sm">
                                                <Award className="mr-2 h-4 w-4" />
                                                Scholarships
                                            </Button>
                                        </Link>
                                        <Link href={`/admin/universities/${uni.id}/accommodation`}>
                                            <Button variant="outline" size="sm">
                                                <Home className="mr-2 h-4 w-4" />
                                                Accommodation
                                            </Button>
                                        </Link>
                                        <Link href={`/admin/universities/${uni.id}`}>
                                            <Button variant="outline" size="sm">
                                                <Edit className="mr-2 h-4 w-4" />
                                                Edit
                                            </Button>
                                        </Link>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {(!universities || universities.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    No universities found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
