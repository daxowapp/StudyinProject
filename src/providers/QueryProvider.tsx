"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

export function QueryProvider({ children }: { children: ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 5 * 60 * 1000,      // 5 min — data considered fresh
                        gcTime: 30 * 60 * 1000,         // 30 min — unused cache GC
                        refetchOnWindowFocus: false,     // avoid surprise refetches
                        retry: 1,                        // single retry on failure
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
