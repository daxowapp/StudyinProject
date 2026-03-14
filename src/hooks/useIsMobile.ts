"use client";

import { useState, useEffect } from "react";

/**
 * Hook to detect mobile viewport (<768px).
 * Returns `true` on server & initial render to avoid hydration mismatch,
 * then updates on the client after mount.
 */
export function useIsMobile(breakpoint = 768) {
    const [isMobile, setIsMobile] = useState(true); // default to mobile

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < breakpoint);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, [breakpoint]);

    return isMobile;
}
