"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface PaginationProps {
    totalPages: number;
    currentPage: number;
}

export function Pagination({ totalPages, currentPage }: PaginationProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center space-x-2 py-4">
            <Button
                variant="outline"
                size="icon"
                disabled={currentPage <= 1}
                asChild={currentPage > 1}
            >
                {currentPage > 1 ? (
                    <Link href={createPageURL(1)}>
                        <ChevronsLeft className="h-4 w-4" />
                        <span className="sr-only">First Page</span>
                    </Link>
                ) : (
                    <span>
                        <ChevronsLeft className="h-4 w-4" />
                        <span className="sr-only">First Page</span>
                    </span>
                )}
            </Button>

            <Button
                variant="outline"
                size="icon"
                disabled={currentPage <= 1}
                asChild={currentPage > 1}
            >
                {currentPage > 1 ? (
                    <Link href={createPageURL(currentPage - 1)}>
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Previous Page</span>
                    </Link>
                ) : (
                    <span>
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Previous Page</span>
                    </span>
                )}
            </Button>

            <div className="flex items-center gap-1 mx-2">
                <span className="text-sm font-medium">
                    Page {currentPage} of {totalPages}
                </span>
            </div>

            <Button
                variant="outline"
                size="icon"
                disabled={currentPage >= totalPages}
                asChild={currentPage < totalPages}
            >
                {currentPage < totalPages ? (
                    <Link href={createPageURL(currentPage + 1)}>
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">Next Page</span>
                    </Link>
                ) : (
                    <span>
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">Next Page</span>
                    </span>
                )}
            </Button>

            <Button
                variant="outline"
                size="icon"
                disabled={currentPage >= totalPages}
                asChild={currentPage < totalPages}
            >
                {currentPage < totalPages ? (
                    <Link href={createPageURL(totalPages)}>
                        <ChevronsRight className="h-4 w-4" />
                        <span className="sr-only">Last Page</span>
                    </Link>
                ) : (
                    <span>
                        <ChevronsRight className="h-4 w-4" />
                        <span className="sr-only">Last Page</span>
                    </span>
                )}
            </Button>
        </div>
    );
}
