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
import { Plus, MoreHorizontal, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminUniversitiesPage() {
    const supabase = await createClient();
    const { data: universities } = await supabase
        .from("universities")
        .select("*, programs(count)")
        .order("created_at", { ascending: false });

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

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-9" placeholder="Search universities..." />
                </div>
            </div>

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
                                <TableCell>{uni.programs[0]?.count || 0}</TableCell>
                                <TableCell>
                                    <Badge variant="default">Active</Badge>
                                </TableCell>
                                <TableCell>{new Date(uni.created_at).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                    <Link href={`/admin/universities/${uni.id}`}>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </Link>
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
