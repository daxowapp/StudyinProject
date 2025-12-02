import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const accommodationData = [
    {
        "university_code": "B2602",
        "university_name": "Xi'an Jiaotong-Liverpool University (XJTLU)",
        "program_type": "Bachelor",
        "accommodation": [
            {
                "campus": "SIP Campus",
                "room_type": "standard",
                "occupancy": null,
                "price_min": 1710,
                "price_max": 2700,
                "currency": "RMB",
                "billing_period": "month"
            },
            {
                "campus": "Taicang Campus",
                "room_type": "double room",
                "occupancy": 2,
                "price_min": 6000,
                "price_max": 6000,
                "currency": "RMB",
                "billing_period": "year"
            },
            {
                "campus": "Taicang Campus",
                "room_type": "single room",
                "occupancy": 1,
                "price_min": 14000,
                "price_max": 14000,
                "currency": "RMB",
                "billing_period": "year"
            }
        ]
    },
    {
        "university_code": "B2603",
        "university_name": "Linyi University (LYU)",
        "program_type": "Bachelor",
        "accommodation": [
            {
                "campus": null,
                "room_type": "quad room (lower bed)",
                "occupancy": 4,
                "price_min": 240,
                "price_max": 240,
                "currency": "RMB",
                "billing_period": "month"
            },
            {
                "campus": null,
                "room_type": "quad room (upper bed)",
                "occupancy": 4,
                "price_min": 200,
                "price_max": 200,
                "currency": "RMB",
                "billing_period": "month"
            }
        ]
    },
    {
        "university_code": "B2605",
        "university_name": "Northwestern Polytechnical University (NPU)",
        "program_type": "Bachelor",
        "accommodation": [
            {
                "campus": null,
                "room_type": "triple room",
                "occupancy": 3,
                "price_min": 5400,
                "price_max": 5400,
                "currency": "RMB",
                "billing_period": "year"
            },
            {
                "campus": null,
                "room_type": "double room",
                "occupancy": 2,
                "price_min": 7200,
                "price_max": 9000,
                "currency": "RMB",
                "billing_period": "year"
            }
        ]
    },
    {
        "university_code": "B2607",
        "university_name": "Dalian University of Technology (DLUT)",
        "program_type": "Bachelor",
        "accommodation": [
            {
                "campus": "On-campus",
                "room_type": "single room",
                "occupancy": 1,
                "price_min": 1800,
                "price_max": 1800,
                "currency": "RMB",
                "billing_period": "month"
            },
            {
                "campus": "On-campus",
                "room_type": "double room",
                "occupancy": 2,
                "price_min": 1200,
                "price_max": 1200,
                "currency": "RMB",
                "billing_period": "month"
            },
            {
                "campus": "Off-campus",
                "room_type": "single room",
                "occupancy": 1,
                "price_min": 600,
                "price_max": 600,
                "currency": "RMB",
                "billing_period": "month"
            }
        ]
    },
    {
        "university_code": "B2611",
        "university_name": "Nanjing University of Aeronautics and Astronautics (NUAA)",
        "program_type": "Bachelor",
        "accommodation": [
            {
                "campus": null,
                "room_type": "single room",
                "occupancy": 1,
                "price_min": 8000,
                "price_max": 8000,
                "currency": "RMB",
                "billing_period": "year"
            },
            {
                "campus": null,
                "room_type": "double room (small)",
                "occupancy": 2,
                "price_min": 4000,
                "price_max": 4000,
                "currency": "RMB",
                "billing_period": "year"
            },
            {
                "campus": null,
                "room_type": "double room (large)",
                "occupancy": 2,
                "price_min": 7000,
                "price_max": 7000,
                "currency": "RMB",
                "billing_period": "year"
            }
        ]
    },
    {
        "university_code": "B2612",
        "university_name": "Harbin Institute of Technology (HIT)",
        "program_type": "Bachelor",
        "accommodation": [
            {
                "campus": null,
                "room_type": "double room (bed price)",
                "occupancy": 2,
                "price_min": 800,
                "price_max": 1000,
                "currency": "RMB",
                "billing_period": "month",
                "price_basis": "per bed"
            }
        ]
    },
    {
        "university_code": "L2602",
        "university_name": "Linyi University (LYU)",
        "program_type": "Chinese Language Program",
        "accommodation": [
            {
                "campus": null,
                "room_type": "quad room (lower bed)",
                "occupancy": 4,
                "price_min": 240,
                "price_max": 240,
                "currency": "RMB",
                "billing_period": "month"
            },
            {
                "campus": null,
                "room_type": "quad room (upper bed)",
                "occupancy": 4,
                "price_min": 200,
                "price_max": 200,
                "currency": "RMB",
                "billing_period": "month"
            }
        ]
    },
    {
        "university_code": "L2603",
        "university_name": "Beijing Institute of Technology (Zhuhai) - BIT Zhuhai",
        "program_type": "Chinese Language Program",
        "accommodation": [
            {
                "campus": null,
                "room_type": "double room",
                "occupancy": 2,
                "price_min": 900,
                "price_max": 900,
                "currency": "RMB",
                "billing_period": "month"
            },
            {
                "campus": null,
                "room_type": "quad room",
                "occupancy": 4,
                "price_min": 500,
                "price_max": 500,
                "currency": "RMB",
                "billing_period": "month"
            }
        ]
    },
    {
        "university_code": "L2610",
        "university_name": "China University of Petroleum (East China) - UPC",
        "program_type": "Chinese Language Program",
        "accommodation": [
            {
                "campus": null,
                "room_type": "double room",
                "occupancy": 2,
                "price_min": 1100,
                "price_max": 1100,
                "currency": "RMB",
                "billing_period": "month"
            }
        ]
    },
    {
        "university_code": "L2620",
        "university_name": "Shandong Normal University (SDNU)",
        "program_type": "Chinese Language Program",
        "accommodation": [
            {
                "campus": null,
                "room_type": "double room",
                "occupancy": 2,
                "price_min": 2500,
                "price_max": 2500,
                "currency": "RMB",
                "billing_period": "semester"
            },
            {
                "campus": null,
                "room_type": "double room",
                "occupancy": 2,
                "price_min": 5000,
                "price_max": 5000,
                "currency": "RMB",
                "billing_period": "year"
            }
        ]
    }
];

async function insertAccommodation() {
    console.log("Starting accommodation insertion...");

    for (const item of accommodationData) {
        // 1. Find University ID by Name (fuzzy match)
        // Extract the main name part (e.g., "Linyi University" from "Linyi University (LYU)")
        const namePart = item.university_name.split('(')[0].trim();

        const { data: universities, error: uniError } = await supabase
            .from('universities')
            .select('id, name')
            .ilike('name', `%${namePart}%`)
            .limit(1);

        if (uniError || !universities || universities.length === 0) {
            console.error(`University not found for: ${item.university_name}`);
            continue;
        }

        const universityId = universities[0].id;
        console.log(`Found university: ${universities[0].name} (${universityId})`);

        // 2. Insert Accommodation Data
        for (const acc of item.accommodation) {
            const { error: insertError } = await supabase
                .from('university_accommodation')
                .insert({
                    university_id: universityId,
                    campus: acc.campus,
                    room_type: acc.room_type,
                    occupancy: acc.occupancy,
                    price_min: acc.price_min,
                    price_max: acc.price_max,
                    currency: acc.currency,
                    billing_period: acc.billing_period,
                    price_basis: (acc as any).price_basis || null, // Handle optional field
                    description: `${acc.room_type} - ${acc.billing_period}ly payment` // Fallback description
                });

            if (insertError) {
                console.error(`Error inserting accommodation for ${item.university_name}:`, insertError);
            } else {
                console.log(`Inserted: ${acc.room_type} for ${item.university_name}`);
            }
        }
    }
    console.log("Finished insertion.");
}

insertAccommodation();
