"use client";

import { useEffect } from "react";

/**
 * Defers loading of non-critical third-party scripts (Zoho SalesIQ, PageSense)
 * until the browser is idle, reducing TBT during initial page load.
 */
export function DeferredScripts() {
    useEffect(() => {
        const loadScripts = () => {
            // Zoho PageSense
            const ps = document.createElement("script");
            ps.src =
                "https://cdn.pagesense.io/js/daxowportal/643005dce2df4eb1810be296f6a79272.js";
            ps.async = true;
            document.body.appendChild(ps);

            // Zoho SalesIQ init
            (window as Record<string, unknown>).$zoho =
                (window as Record<string, unknown>).$zoho || {};
            ((window as Record<string, unknown>).$zoho as Record<string, unknown>).salesiq =
                ((window as Record<string, unknown>).$zoho as Record<string, unknown>).salesiq || {
                    ready: function () {},
                };

            // Zoho SalesIQ widget
            const sq = document.createElement("script");
            sq.src =
                "https://salesiq.zohopublic.com/widget?wc=siqc671c2f53632c30a591a902bec55f9bdcfc7670e7f9cbdd86f64bdc1d326a19a";
            sq.async = true;
            sq.defer = true;
            document.body.appendChild(sq);
        };

        if ("requestIdleCallback" in window) {
            (window as Window & { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(loadScripts);
        } else {
            // Fallback for Safari
            setTimeout(loadScripts, 3000);
        }
    }, []);

    return null;
}
