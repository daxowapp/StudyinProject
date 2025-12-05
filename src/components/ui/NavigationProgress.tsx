"use client";

import { useEffect, useCallback, ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";

// Minimal NProgress styles inlined
const nprogessStyles = `
#nprogress {
  pointer-events: none;
}
#nprogress .bar {
  background: hsl(var(--primary));
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
}
#nprogress .peg {
  display: block;
  position: absolute;
  right: 0px;
  width: 100px;
  height: 100%;
  box-shadow: 0 0 10px hsl(var(--primary)), 0 0 5px hsl(var(--primary));
  opacity: 1;
  transform: rotate(3deg) translate(0px, -4px);
}
`;

// Configure NProgress
NProgress.configure({
    showSpinner: false,
    minimum: 0.1,
    easing: "ease",
    speed: 400,
});

export function NavigationProgress({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Inject styles
        const style = document.createElement("style");
        style.id = "nprogress-styles";
        style.textContent = nprogessStyles;
        if (!document.getElementById("nprogress-styles")) {
            document.head.appendChild(style);
        }
        return () => {
            const existingStyle = document.getElementById("nprogress-styles");
            if (existingStyle) existingStyle.remove();
        };
    }, []);

    useEffect(() => {
        // Complete progress on route change
        NProgress.done();
    }, [pathname, searchParams]);

    // Listen for link clicks to start progress
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const anchor = target.closest("a");

            if (anchor) {
                const href = anchor.getAttribute("href");
                const isExternal = anchor.target === "_blank" || href?.startsWith("http");
                const isHash = href?.startsWith("#");
                const isSameRoute = href === pathname;

                if (href && !isExternal && !isHash && !isSameRoute) {
                    NProgress.start();
                }
            }
        };

        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, [pathname]);

    return <>{children}</>;
}

// Hook for programmatic navigation with progress
export function useNavigationProgress() {
    const start = useCallback(() => NProgress.start(), []);
    const done = useCallback(() => NProgress.done(), []);
    const set = useCallback((n: number) => NProgress.set(n), []);

    return { start, done, set };
}
