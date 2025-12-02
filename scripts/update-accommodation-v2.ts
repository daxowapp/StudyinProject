import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const newAccommodationData = [
    // B2602 - XJTLU
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", campus: 'SIP Campus', type: 'Standard Room (Min)', price: 1710, period: 'month', currency: 'RMB', desc: 'Range: 1710-2700 RMB/month' },
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", campus: 'SIP Campus', type: 'Standard Room (Max)', price: 2700, period: 'month', currency: 'RMB', desc: 'Range: 1710-2700 RMB/month' },
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", campus: 'Taicang Campus', type: 'Double Room', price: 6000, period: 'year', currency: 'RMB', desc: null },
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", campus: 'Taicang Campus', type: 'Single Room', price: 14000, period: 'year', currency: 'RMB', desc: null },

    // B2603 - LYU
    { code: 'B2603', name: 'Linyi University', campus: 'Main Campus', type: 'Quad Room (Lower Bed)', price: 240, period: 'month', currency: 'RMB', desc: null },
    { code: 'B2603', name: 'Linyi University', campus: 'Main Campus', type: 'Quad Room (Upper Bed)', price: 200, period: 'month', currency: 'RMB', desc: null },

    // B2605 - NPU
    { code: 'B2605', name: 'Northwestern Polytechnical University', campus: 'Main Campus', type: 'Triple Room', price: 5400, period: 'year', currency: 'RMB', desc: null },
    { code: 'B2605', name: 'Northwestern Polytechnical University', campus: 'Main Campus', type: 'Double Room', price: 7200, period: 'year', currency: 'RMB', desc: 'Options: 7200 or 9000 RMB/year' },
    { code: 'B2605', name: 'Northwestern Polytechnical University', campus: 'Main Campus', type: 'Double Room (Premium)', price: 9000, period: 'year', currency: 'RMB', desc: 'Options: 7200 or 9000 RMB/year' },

    // B2607 - DLUT
    { code: 'B2607', name: 'Dalian University of Technology', campus: 'On-Campus', type: 'Single Room', price: 1800, period: 'month', currency: 'RMB', desc: null },
    { code: 'B2607', name: 'Dalian University of Technology', campus: 'On-Campus', type: 'Double Room', price: 1200, period: 'month', currency: 'RMB', desc: null },
    { code: 'B2607', name: 'Dalian University of Technology', campus: 'Off-Campus', type: 'Single Room', price: 600, period: 'month', currency: 'RMB', desc: 'Only 5 minutes walk from DLUT East Gate' },

    // B2611 - NUAA
    { code: 'B2611', name: 'Nanjing University of Aeronautics and Astronautics', campus: 'Main Campus', type: 'Single Room', price: 8000, period: 'year', currency: 'RMB', desc: null },
    { code: 'B2611', name: 'Nanjing University of Aeronautics and Astronautics', campus: 'Main Campus', type: 'Double Room (Small)', price: 4000, period: 'year', currency: 'RMB', desc: null },
    { code: 'B2611', name: 'Nanjing University of Aeronautics and Astronautics', campus: 'Main Campus', type: 'Double Room (Large)', price: 7000, period: 'year', currency: 'RMB', desc: null },

    // B2612 - HIT
    { code: 'B2612', name: 'Harbin Institute of Technology', campus: 'Main Campus', type: 'Double Bed Room (Min)', price: 800, period: 'month', currency: 'RMB', desc: 'Range: 800-1000 RMB/month/bed' },
    { code: 'B2612', name: 'Harbin Institute of Technology', campus: 'Main Campus', type: 'Double Bed Room (Max)', price: 1000, period: 'month', currency: 'RMB', desc: 'Range: 800-1000 RMB/month/bed' },

    // L2602 - LYU (Chinese Language) - Same university as B2603 usually, but let's treat as separate entries if needed or just append.
    // Note: The user provided duplicate entries for LYU with different codes (B2603 vs L2602). 
    // Since we map by University Name, these will likely go to the same university ID unless "Linyi University" is duplicated in DB.
    // I will assume they go to the same university.
    { code: 'L2602', name: 'Linyi University', campus: 'Main Campus', type: 'Quad Room (Lower Bed) - Chinese Program', price: 240, period: 'month', currency: 'RMB', desc: 'Exclusive package: Tuition+Accommodation=4200/semester' },
    { code: 'L2602', name: 'Linyi University', campus: 'Main Campus', type: 'Quad Room (Upper Bed) - Chinese Program', price: 200, period: 'month', currency: 'RMB', desc: 'Exclusive package: Tuition+Accommodation=4000/semester' },

    // L2603 - BIT Zhuhai
    { code: 'L2603', name: 'Beijing Institute of Technology (Zhuhai)', campus: 'Main Campus', type: 'Double Room', price: 900, period: 'month', currency: 'RMB', desc: null },
    { code: 'L2603', name: 'Beijing Institute of Technology (Zhuhai)', campus: 'Main Campus', type: 'Quad Room', price: 500, period: 'month', currency: 'RMB', desc: null },

    // L2610 - UPC
    { code: 'L2610', name: 'China University of Petroleum (East China)', campus: 'Main Campus', type: 'Double Room', price: 1100, period: 'month', currency: 'RMB', desc: 'After scholarship: pay 5000 RMB/semester for tuition' },

    // L2620 - SDNU
    { code: 'L2620', name: 'Shandong Normal University', campus: 'Main Campus', type: 'Double Room', price: 2500, period: 'semester', currency: 'RMB', desc: 'Exclusive: Tuition+Accommodation=6000/semester' },
    { code: 'L2620', name: 'Shandong Normal University', campus: 'Main Campus', type: 'Double Room', price: 5000, period: 'year', currency: 'RMB', desc: 'Exclusive: Tuition+Accommodation=12000/year' }
];

async function updateAccommodation() {
    console.log("Starting accommodation update...");

    // Optional: Clear existing accommodation for these universities to avoid duplicates?
    // Or just append? The user said "update the sql", implying replacing or adding.
    // I'll assume we should clear previous entries for these universities to be safe and avoid duplicates, 
    // especially since I just inserted some.

    const universityNames = [...new Set(newAccommodationData.map(d => d.name.split('(')[0].trim()))];

    for (const namePart of universityNames) {
        const { data: universities } = await supabase
            .from('universities')
            .select('id, name')
            .ilike('name', `%${namePart}%`)
            .limit(1);

        if (universities && universities.length > 0) {
            const uniId = universities[0].id;
            console.log(`Clearing old accommodation for ${universities[0].name}...`);
            await supabase.from('university_accommodation').delete().eq('university_id', uniId);
        }
    }

    for (const item of newAccommodationData) {
        // 1. Find University ID
        const namePart = item.name.split('(')[0].trim();
        const { data: universities, error: uniError } = await supabase
            .from('universities')
            .select('id, name')
            .ilike('name', `%${namePart}%`)
            .limit(1);

        if (uniError || !universities || universities.length === 0) {
            console.error(`University not found for: ${item.name}`);
            continue;
        }

        const universityId = universities[0].id;

        // 2. Insert Data
        // Mapping 'period' to 'billing_period'
        // Mapping 'type' to 'room_type'
        // 'price' goes to 'price_min' (and 'price_max' if it's a range, but here it's single value mostly)
        // If description implies range, we could parse it, but for now let's put price in price_min.

        const { error: insertError } = await supabase
            .from('university_accommodation')
            .insert({
                university_id: universityId,
                campus: item.campus,
                room_type: item.type,
                price_min: item.price,
                // price_max: item.price, // Assuming fixed price unless range specified
                currency: item.currency,
                billing_period: item.period.replace('per ', ''), // "per month" -> "month"
                description: item.desc
            });

        if (insertError) {
            console.error(`Error inserting for ${item.name}:`, insertError);
        } else {
            console.log(`Inserted: ${item.type} for ${universities[0].name}`);
        }
    }
    console.log("Finished update.");
}

updateAccommodation();
