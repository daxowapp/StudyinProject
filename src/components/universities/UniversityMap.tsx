"use client";

import { useEffect, useRef } from "react";
import { MapPin, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";

interface UniversityMapProps {
    latitude: number;
    longitude: number;
    name: string;
    address?: string;
}

export function UniversityMap({ latitude, longitude, name, address }: UniversityMapProps) {
    const t = useTranslations("UniversityDetail");
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        // Dynamically import leaflet to avoid SSR issues
        import("leaflet").then((L) => {
            // Import leaflet CSS
            if (!document.querySelector('link[href*="leaflet.css"]')) {
                const link = document.createElement("link");
                link.rel = "stylesheet";
                link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
                link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
                link.crossOrigin = "";
                document.head.appendChild(link);
            }

            // Fix default marker icon
            delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
                iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            });

            if (!mapRef.current) return;

            const map = L.map(mapRef.current).setView([latitude, longitude], 15);

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                maxZoom: 19,
            }).addTo(map);

            const popupContent = `
                <div style="text-align:center;min-width:160px;">
                    <strong style="font-size:14px;">${name}</strong>
                    ${address ? `<br/><span style="color:#666;font-size:12px;">${address}</span>` : ""}
                </div>
            `;

            L.marker([latitude, longitude])
                .addTo(map)
                .bindPopup(popupContent)
                .openPopup();

            mapInstanceRef.current = map;

            // Fix map size after render
            setTimeout(() => map.invalidateSize(), 100);
        });

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [latitude, longitude, name, address]);

    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

    return (
        <div className="space-y-4">
            {/* Section Header */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                    <MapPin className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                    {t("location.title")}
                </h2>
            </div>

            {/* Address */}
            {address && (
                <p className="text-gray-600 flex items-start gap-2 ml-1">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                    {address}
                </p>
            )}

            {/* Map Container */}
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                <div
                    ref={mapRef}
                    className="w-full h-[350px] md:h-[400px]"
                    style={{ zIndex: 0 }}
                />
            </div>

            {/* View on Google Maps link */}
            <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
                <ExternalLink className="w-4 h-4" />
                {t("location.viewOnMap")}
            </a>
        </div>
    );
}
