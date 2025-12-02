import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const v3Data = [
    // Bachelor Programs
    { code: 'B2601', name: 'Beijing Institute of Technology (Zhuhai)', campus: 'Main Campus', type: 'Double Room', price: 900, period: 'month', currency: 'RMB', desc: null },
    { code: 'B2601', name: 'Beijing Institute of Technology (Zhuhai)', campus: 'Main Campus', type: 'Quad Room', price: 500, period: 'month', currency: 'RMB', desc: null },

    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", campus: 'SIP Campus', type: 'Standard Room (Min)', price: 1710, period: 'month', currency: 'RMB', desc: 'Range: 1710-2700 RMB/month' },
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", campus: 'SIP Campus', type: 'Standard Room (Max)', price: 2700, period: 'month', currency: 'RMB', desc: 'Range: 1710-2700 RMB/month' },
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", campus: 'Taicang Campus', type: 'Double Room', price: 6000, period: 'year', currency: 'RMB', desc: null },
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", campus: 'Taicang Campus', type: 'Single Room', price: 14000, period: 'year', currency: 'RMB', desc: null },

    { code: 'B2602', name: 'China University of Petroleum (East China)', campus: 'South Section', type: 'Double Room (Ocean View - Min)', price: 700, period: 'month', currency: 'RMB', desc: 'Range: 700-750 RMB/month' },
    { code: 'B2602', name: 'China University of Petroleum (East China)', campus: 'South Section', type: 'Double Room (Ocean View - Max)', price: 750, period: 'month', currency: 'RMB', desc: 'Range: 700-750 RMB/month' },
    { code: 'B2602', name: 'China University of Petroleum (East China)', campus: 'North Section', type: 'Double Room (City View - Min)', price: 600, period: 'month', currency: 'RMB', desc: 'Range: 600-650 RMB/month' },
    { code: 'B2602', name: 'China University of Petroleum (East China)', campus: 'North Section', type: 'Double Room (City View - Max)', price: 650, period: 'month', currency: 'RMB', desc: 'Range: 600-650 RMB/month' },

    { code: 'B2603', name: 'Linyi University', campus: 'Main Campus', type: 'Quad Room (Lower Bed)', price: 240, period: 'month', currency: 'RMB', desc: null },
    { code: 'B2603', name: 'Linyi University', campus: 'Main Campus', type: 'Quad Room (Upper Bed)', price: 200, period: 'month', currency: 'RMB', desc: null },

    { code: 'B2605', name: 'Northwestern Polytechnical University', campus: 'Main Campus', type: 'Triple Room', price: 5400, period: 'year', currency: 'RMB', desc: null },
    { code: 'B2605', name: 'Northwestern Polytechnical University', campus: 'Main Campus', type: 'Double Room', price: 7200, period: 'year', currency: 'RMB', desc: 'Options: 7200 or 9000 RMB/year' },
    { code: 'B2605', name: 'Northwestern Polytechnical University', campus: 'Main Campus', type: 'Double Room (Premium)', price: 9000, period: 'year', currency: 'RMB', desc: 'Options: 7200 or 9000 RMB/year' },

    { code: 'B2606', name: 'Beijing Institute of Technology', campus: 'Liangxiang Campus', type: 'Double Room', price: 900, period: 'month', currency: 'RMB', desc: null },
    { code: 'B2606', name: 'Beijing Institute of Technology', campus: 'Liangxiang Campus', type: 'Triple Room', price: 700, period: 'month', currency: 'RMB', desc: null },
    { code: 'B2606', name: 'Beijing Institute of Technology', campus: 'Liangxiang Campus', type: 'Quad Room', price: 500, period: 'month', currency: 'RMB', desc: null },
    { code: 'B2606', name: 'Beijing Institute of Technology', campus: 'Zhongguancun Campus', type: 'Double Room', price: 1350, period: 'month', currency: 'RMB', desc: null },
    { code: 'B2606', name: 'Beijing Institute of Technology', campus: 'Zhongguancun Campus', type: 'Triple Room', price: 1200, period: 'month', currency: 'RMB', desc: null },
    { code: 'B2606', name: 'Beijing Institute of Technology', campus: 'Zhongguancun Campus', type: 'Quad Room', price: 900, period: 'month', currency: 'RMB', desc: null },

    { code: 'B2607', name: 'Dalian University of Technology', campus: 'On-Campus', type: 'Single Room', price: 1800, period: 'month', currency: 'RMB', desc: null },
    { code: 'B2607', name: 'Dalian University of Technology', campus: 'On-Campus', type: 'Double Room', price: 1200, period: 'month', currency: 'RMB', desc: null },
    { code: 'B2607', name: 'Dalian University of Technology', campus: 'Off-Campus', type: 'Single Room', price: 600, period: 'month', currency: 'RMB', desc: 'Only 5 minutes walk from DLUT East Gate' },

    { code: 'B2609', name: 'Shandong University of Traditional Chinese Medicine', campus: 'Main Campus', type: 'Double Room', price: 4000, period: 'year', currency: 'RMB', desc: null },

    { code: 'B2610', name: 'East China University of Science and Technology', campus: 'Main Campus', type: 'Single Room', price: 80, period: 'day', currency: 'RMB', desc: 'Options: 80 or 110 RMB/day' },
    { code: 'B2610', name: 'East China University of Science and Technology', campus: 'Main Campus', type: 'Single Room (Premium)', price: 110, period: 'day', currency: 'RMB', desc: 'Options: 80 or 110 RMB/day' },

    { code: 'B2611', name: 'Nanjing University of Aeronautics and Astronautics', campus: 'Main Campus', type: 'Single Room', price: 8000, period: 'year', currency: 'RMB', desc: null },
    { code: 'B2611', name: 'Nanjing University of Aeronautics and Astronautics', campus: 'Main Campus', type: 'Double Room (Small)', price: 4000, period: 'year', currency: 'RMB', desc: null },
    { code: 'B2611', name: 'Nanjing University of Aeronautics and Astronautics', campus: 'Main Campus', type: 'Double Room (Large)', price: 7000, period: 'year', currency: 'RMB', desc: null },

    { code: 'B2612', name: 'Harbin Institute of Technology', campus: 'Main Campus', type: 'Double Bed Room (Min)', price: 800, period: 'month', currency: 'RMB', desc: 'Range: 800-1000 RMB/month/bed' },
    { code: 'B2612', name: 'Harbin Institute of Technology', campus: 'Main Campus', type: 'Double Bed Room (Max)', price: 1000, period: 'month', currency: 'RMB', desc: 'Range: 800-1000 RMB/month/bed' },

    { code: 'B2613', name: 'Ocean University of China', campus: 'Laoshan Campus', type: 'Double Room', price: 5500, period: 'semester', currency: 'RMB', desc: 'Also 11000 RMB/year' },
    { code: 'B2613', name: 'Ocean University of China', campus: 'Laoshan Campus', type: 'Double Room', price: 11000, period: 'year', currency: 'RMB', desc: null },
    { code: 'B2613', name: 'Ocean University of China', campus: 'Laoshan Campus', type: 'Single Room', price: 11000, period: 'semester', currency: 'RMB', desc: 'Also 22000 RMB/year' },
    { code: 'B2613', name: 'Ocean University of China', campus: 'Laoshan Campus', type: 'Single Room', price: 22000, period: 'year', currency: 'RMB', desc: null },

    // Master Programs
    { code: 'M2602', name: 'Linyi University', campus: 'Main Campus', type: 'Quaternary Room (Upper Bed)', price: 200, period: 'month', currency: 'RMB', desc: null },
    { code: 'M2602', name: 'Linyi University', campus: 'Main Campus', type: 'Quaternary Room (Lower Bed)', price: 240, period: 'month', currency: 'RMB', desc: null },

    { code: 'M2607', name: 'Dalian University of Technology', campus: 'On-Campus', type: 'Single Room', price: 1800, period: 'month', currency: 'RMB', desc: null },
    { code: 'M2607', name: 'Dalian University of Technology', campus: 'On-Campus', type: 'Double Room', price: 1200, period: 'month', currency: 'RMB', desc: null },
    { code: 'M2607', name: 'Dalian University of Technology', campus: 'Off-Campus', type: 'Single Room', price: 600, period: 'month', currency: 'RMB', desc: 'Only 5 minutes walk from DLUT East Gate' },

    { code: 'M2608', name: 'Nanjing University of Aeronautics and Astronautics', campus: 'Main Campus', type: 'Single Room (Small)', price: 8000, period: 'year', currency: 'RMB', desc: null },
    { code: 'M2608', name: 'Nanjing University of Aeronautics and Astronautics', campus: 'Main Campus', type: 'Single Room (Large)', price: 14000, period: 'year', currency: 'RMB', desc: null },
    { code: 'M2608', name: 'Nanjing University of Aeronautics and Astronautics', campus: 'Main Campus', type: 'Double Room (Small)', price: 4000, period: 'year', currency: 'RMB', desc: null },
    { code: 'M2608', name: 'Nanjing University of Aeronautics and Astronautics', campus: 'Main Campus', type: 'Double Room (Large)', price: 7000, period: 'year', currency: 'RMB', desc: null },

    { code: 'M2609', name: 'China University of Petroleum (East China)', campus: 'South Section', type: 'Double Room (Ocean View - Min)', price: 600, period: 'month', currency: 'RMB', desc: 'Range: 600-750 RMB/month' },
    { code: 'M2609', name: 'China University of Petroleum (East China)', campus: 'South Section', type: 'Double Room (Ocean View - Max)', price: 750, period: 'month', currency: 'RMB', desc: 'Range: 600-750 RMB/month' },
    { code: 'M2609', name: 'China University of Petroleum (East China)', campus: 'North Section', type: 'Double Room (City View - Min)', price: 500, period: 'month', currency: 'RMB', desc: 'Range: 500-650 RMB/month' },
    { code: 'M2609', name: 'China University of Petroleum (East China)', campus: 'North Section', type: 'Double Room (City View - Max)', price: 650, period: 'month', currency: 'RMB', desc: 'Range: 500-650 RMB/month' },

    { code: 'M2610', name: 'Beijing Institute of Technology (Zhuhai)', campus: 'Main Campus', type: 'Double Room', price: 900, period: 'month', currency: 'RMB', desc: null },
    { code: 'M2610', name: 'Beijing Institute of Technology (Zhuhai)', campus: 'Main Campus', type: 'Quad Room', price: 500, period: 'month', currency: 'RMB', desc: null },

    { code: 'M2611', name: 'Beijing Institute of Technology', campus: 'Beijing Zhongguancun Campus', type: 'Double Room', price: 1350, period: 'month', currency: 'RMB', desc: null },
    { code: 'M2611', name: 'Beijing Institute of Technology', campus: 'Beijing Zhongguancun Campus', type: 'Triple Room', price: 1200, period: 'month', currency: 'RMB', desc: null },
    { code: 'M2611', name: 'Beijing Institute of Technology', campus: 'Beijing Zhongguancun Campus', type: 'Quad Room', price: 900, period: 'month', currency: 'RMB', desc: null },
    { code: 'M2611', name: 'Beijing Institute of Technology', campus: 'Beijing Liangxiang Campus', type: 'Double Room', price: 900, period: 'month', currency: 'RMB', desc: null },
    { code: 'M2611', name: 'Beijing Institute of Technology', campus: 'Beijing Liangxiang Campus', type: 'Triple Room', price: 700, period: 'month', currency: 'RMB', desc: null },
    { code: 'M2611', name: 'Beijing Institute of Technology', campus: 'Beijing Liangxiang Campus', type: 'Quad Room', price: 500, period: 'month', currency: 'RMB', desc: null },

    { code: 'M2612', name: 'Harbin Institute of Technology', campus: 'Main Campus', type: 'Double Bed Room (Min)', price: 800, period: 'month', currency: 'RMB', desc: 'Range: 800-1000 RMB/month/bed' },
    { code: 'M2612', name: 'Harbin Institute of Technology', campus: 'Main Campus', type: 'Double Bed Room (Max)', price: 1000, period: 'month', currency: 'RMB', desc: 'Range: 800-1000 RMB/month/bed' },

    { code: 'M2613', name: 'Northwestern Polytechnical University', campus: 'Main Campus', type: 'Double Room', price: 7200, period: 'year', currency: 'RMB', desc: 'Options: 7200 or 9000 RMB/year' },
    { code: 'M2613', name: 'Northwestern Polytechnical University', campus: 'Main Campus', type: 'Double Room (Premium)', price: 9000, period: 'year', currency: 'RMB', desc: 'Options: 7200 or 9000 RMB/year' },

    { code: 'M2614', name: "Xi'an Jiaotong-Liverpool University", campus: 'SIP Campus', type: 'Standard Room (Min)', price: 1710, period: 'month', currency: 'RMB', desc: 'Range: 1710-2700 RMB/month' },
    { code: 'M2614', name: "Xi'an Jiaotong-Liverpool University", campus: 'SIP Campus', type: 'Standard Room (Max)', price: 2700, period: 'month', currency: 'RMB', desc: 'Range: 1710-2700 RMB/month' },
    { code: 'M2614', name: "Xi'an Jiaotong-Liverpool University", campus: 'Taicang Campus', type: 'Double Room', price: 6000, period: 'year', currency: 'RMB', desc: null },
    { code: 'M2614', name: "Xi'an Jiaotong-Liverpool University", campus: 'Taicang Campus', type: 'Single Room', price: 14000, period: 'year', currency: 'RMB', desc: null },

    // Chinese Language Programs
    { code: 'L2601', name: 'Tiangong University', campus: 'Building NO.5 in Beiyuan', type: 'Double Room', price: 3100, period: 'semester', currency: 'RMB', desc: null },
    { code: 'L2601', name: 'Tiangong University', campus: 'Building NO.5 in Beiyuan', type: 'Triple Room', price: 2100, period: 'semester', currency: 'RMB', desc: null },
    { code: 'L2601', name: 'Tiangong University', campus: 'International Student Dormitory (Building B/C)', type: 'Double Room', price: 3700, period: 'semester', currency: 'RMB', desc: null },
    { code: 'L2601', name: 'Tiangong University', campus: 'International Student Dormitory (Building B/C)', type: 'Triple Room', price: 2500, period: 'semester', currency: 'RMB', desc: null },

    { code: 'L2602', name: 'Linyi University', campus: 'Main Campus', type: 'Quad Room (Lower Bed)', price: 240, period: 'month', currency: 'RMB', desc: 'Exclusive package: Tuition+Accommodation=4200/semester' },
    { code: 'L2602', name: 'Linyi University', campus: 'Main Campus', type: 'Quad Room (Upper Bed)', price: 200, period: 'month', currency: 'RMB', desc: 'Exclusive package: Tuition+Accommodation=4000/semester' },

    { code: 'L2603', name: 'Beijing Institute of Technology (Zhuhai)', campus: 'Main Campus', type: 'Double Room', price: 900, period: 'month', currency: 'RMB', desc: null },
    { code: 'L2603', name: 'Beijing Institute of Technology (Zhuhai)', campus: 'Main Campus', type: 'Quad Room', price: 500, period: 'month', currency: 'RMB', desc: null },

    { code: 'L2610', name: 'China University of Petroleum (East China)', campus: 'Main Campus', type: 'Double Room', price: 1100, period: 'month', currency: 'RMB', desc: 'After scholarship: pay 5000 RMB/semester for tuition' },

    { code: 'L2620', name: 'Shandong Normal University', campus: 'Main Campus', type: 'Double Room', price: 2500, period: 'semester', currency: 'RMB', desc: 'Exclusive: Tuition+Accommodation=6000/semester' },
    { code: 'L2620', name: 'Shandong Normal University', campus: 'Main Campus', type: 'Double Room', price: 5000, period: 'year', currency: 'RMB', desc: 'Exclusive: Tuition+Accommodation=12000/year' }
];

async function updateAccommodationV3() {
    console.log("Starting accommodation update V3...");

    // Get unique university names to clear existing data
    const universityNames = [...new Set(v3Data.map(d => d.name.split('(')[0].trim()))];

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

    for (const item of v3Data) {
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
        const { error: insertError } = await supabase
            .from('university_accommodation')
            .insert({
                university_id: universityId,
                campus: item.campus,
                room_type: item.type,
                price_min: item.price,
                currency: item.currency,
                billing_period: item.period.replace('per ', ''),
                description: item.desc
            });

        if (insertError) {
            console.error(`Error inserting for ${item.name}:`, insertError);
        } else {
            console.log(`Inserted: ${item.type} for ${universities[0].name}`);
        }
    }
    console.log("Finished update V3.");
}

updateAccommodationV3();
