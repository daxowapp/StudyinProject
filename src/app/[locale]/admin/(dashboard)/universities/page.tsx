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
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { UniversityFilters } from "./filters";
import { UniversityActions } from "./components/UniversityActions";
import { Pagination } from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 10;

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
    const page = typeof params.page === 'string' ? parseInt(params.page) : 1;

    // Calculate range
    const from = (page - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

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

    // Parallelize fetching: Data + Count, Cities, Provinces
    const [
        { data: universities, count },
        { data: citiesData },
        { data: provincesData }
    ] = await Promise.all([
        query
            .order("created_at", { ascending: false })
            .range(from, to),
        supabase
            .from("universities")
            .select("city")
            .not("city", "is", null)
            .order("city"),
        supabase
            .from("universities")
            .select("province")
            .not("province", "is", null)
            .order("province")
    ]);

    const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 0;

    // Extract unique values for filters
    const cities = Array.from(new Set(citiesData?.map(item => item.city) || [])).filter(Boolean) as string[];
    const provinces = Array.from(new Set(provincesData?.map(item => item.province) || [])).filter(Boolean) as string[];

    interface University {
        id: string;
        name: string;
        city: string;
        created_at: string;
        university_programs: { count: number }[];
    }

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
                        {universities?.map((uni: University) => (
                            <TableRow key={uni.id}>
                                <TableCell className="font-medium">{uni.name}</TableCell>
                                <TableCell>{uni.city}</TableCell>
                                <TableCell>{uni.university_programs?.[0]?.count || 0}</TableCell>
                                <TableCell>
                                    <Badge variant="default">Active</Badge>
                                </TableCell>
                                <TableCell>{new Date(uni.created_at).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                    <UniversityActions id={uni.id} />
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
            </div >

            <Pagination totalPages={totalPages} currentPage={page} />
        </div >
    );
}
