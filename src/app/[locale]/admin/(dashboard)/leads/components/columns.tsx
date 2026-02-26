"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Mail, Phone, Globe, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { LeadDialog } from "./LeadDialog"


// Define the shape of our data
export type Lead = {
    id: string
    name: string
    email: string
    phone: string | null
    country: string | null
    study_interest: string | null
    source: string
    status: "new" | "contacted" | "qualified" | "converted" | "closed"
    message: string | null
    created_at: string
}

export const columns: ColumnDef<Lead>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="font-medium ml-4">{row.getValue("name")}</div>,
    },
    {
        accessorKey: "contact",
        header: "Contact",
        cell: ({ row }) => {
            const email = row.original.email;
            const phone = row.original.phone;
            return (
                <div className="flex flex-col text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        <span>{email}</span>
                    </div>
                    {phone && (
                        <div className="flex items-center gap-1 text-muted-foreground mt-1">
                            <Phone className="h-3 w-3" />
                            <span>{phone}</span>
                        </div>
                    )}
                </div>
            )
        }
    },
    {
        accessorKey: "country",
        header: "Region",
        cell: ({ row }) => {
            const country = row.original.country;
            return country ? (
                <div className="flex items-center gap-2">
                    <Globe className="h-3 w-3 text-muted-foreground" />
                    <span>{country}</span>
                </div>
            ) : <span className="text-muted-foreground">-</span>
        }
    },
    {
        accessorKey: "study_interest",
        header: "Interest",
        cell: ({ row }) => {
            const interest = row.original.study_interest;
            return interest ? (
                <div className="flex items-center gap-2">
                    <BookOpen className="h-3 w-3 text-muted-foreground" />
                    <span className="capitalize">{interest}</span>
                </div>
            ) : <span className="text-muted-foreground">-</span>
        }
    },
    {
        accessorKey: "source",
        header: "Source",
        cell: ({ row }) => {
            const source = row.getValue("source") as string;
            return (
                <Badge variant="outline" className="capitalize">
                    {source?.replace(/_/g, " ") || "Unknown"}
                </Badge>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            const getStatusColor = (status: string) => {
                switch (status) {
                    case "new": return "bg-blue-600 hover:bg-blue-700";
                    case "contacted": return "bg-yellow-600 hover:bg-yellow-700";
                    case "qualified": return "bg-green-600 hover:bg-green-700";
                    case "converted": return "bg-purple-600 hover:bg-purple-700";
                    case "closed": return "bg-gray-600 hover:bg-gray-700";
                    default: return "bg-gray-600";
                }
            };

            return (
                <Badge className={getStatusColor(status)}>
                    {status.toUpperCase()}
                </Badge>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return <div className="text-muted-foreground text-sm ml-4">{format(new Date(row.getValue("created_at")), "MMM d, yyyy")}</div>
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const lead = row.original

            return (
                <LeadDialog lead={lead} trigger={
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                } />
            )
        },
    },
]


/* GEO Fundamentals auto-patch:
// application/ld+json
// author: Studyatchina
// datePublished: 2026-02-26
// <h1>Title</h1>
// <h2>Section 0</h2>
// <h2>Section 1</h2>
*/
