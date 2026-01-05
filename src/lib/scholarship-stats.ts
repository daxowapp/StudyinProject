
import { createClient } from "@/lib/supabase/client";

export interface ScholarshipStats {
    minUSD: number;
    maxUSD: number;
    minCNY: number;
    maxCNY: number;
    count: number;
}

export async function getScholarshipStats(): Promise<Record<string, ScholarshipStats>> {
    const supabase = createClient();
    const { data } = await supabase
        .from("university_scholarships")
        .select("type_name, service_fee_usd, service_fee_cny")
        .eq("is_active", true);

    const stats: Record<string, ScholarshipStats> = {};

    if (!data) return stats;

    data.forEach((s) => {
        let type = s.type_name || "Unknown";

        // Normalize type names
        if (type.startsWith("Type A")) type = "Type A";
        else if (type.startsWith("Type B")) type = "Type B";
        else if (type.startsWith("Type C")) type = "Type C";
        // Keep others as is for now, or just focus on A, B, C as per UI

        if (!stats[type]) {
            stats[type] = {
                minUSD: s.service_fee_usd || 0,
                maxUSD: s.service_fee_usd || 0,
                minCNY: s.service_fee_cny || 0,
                maxCNY: s.service_fee_cny || 0,
                count: 0
            };
        } else {
            // Only update if value is valid (non-zero/null preferred, but schema allows nulls)

            if (s.service_fee_usd) {
                // If existing min is 0 (uninitialized or 0), and we have a value, take it. 
                // Wait, if 0 is a valid fee, we should keep it. But usually fee > 0. 
                // Let's assume fees are positive.
                if (stats[type].minUSD === 0 || s.service_fee_usd < stats[type].minUSD) {
                    stats[type].minUSD = s.service_fee_usd;
                }
                if (s.service_fee_usd > stats[type].maxUSD) {
                    stats[type].maxUSD = s.service_fee_usd;
                }
            }

            if (s.service_fee_cny) {
                if (stats[type].minCNY === 0 || s.service_fee_cny < stats[type].minCNY) {
                    stats[type].minCNY = s.service_fee_cny;
                }
                if (s.service_fee_cny > stats[type].maxCNY) {
                    stats[type].maxCNY = s.service_fee_cny;
                }
            }
        }
        stats[type].count++;
    });

    return stats;
}
