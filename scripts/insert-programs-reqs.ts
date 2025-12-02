import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Data from user
const programsData = [
    // B2610 - UPC
    { code: 'B2610', name: 'China University of Petroleum (East China)', level: 'Bachelor', title: 'Petroleum Engineering', fee: 20000, unit: 'year', currency: 'RMB', note: 'Double First-Class University' },
    { code: 'B2610', name: 'China University of Petroleum (East China)', level: 'Bachelor', title: 'Big Data Management and Application', fee: 20000, unit: 'year', currency: 'RMB', note: '30 Seats available' },
    { code: 'B2610', name: 'China University of Petroleum (East China)', level: 'Bachelor', title: 'Geology', fee: 18000, unit: 'year', currency: 'RMB', note: null },
    { code: 'B2610', name: 'China University of Petroleum (East China)', level: 'Bachelor', title: 'Resource Exploration Engineering', fee: 18000, unit: 'year', currency: 'RMB', note: null },
    { code: 'B2610', name: 'China University of Petroleum (East China)', level: 'Bachelor', title: 'Mechanical Design, Manufacturing and Automation', fee: 18000, unit: 'year', currency: 'RMB', note: null },
    { code: 'B2610', name: 'China University of Petroleum (East China)', level: 'Bachelor', title: 'Software Engineering', fee: 18000, unit: 'year', currency: 'RMB', note: null },
    { code: 'B2610', name: 'China University of Petroleum (East China)', level: 'Bachelor', title: 'Civil Engineering', fee: 18000, unit: 'year', currency: 'RMB', note: null },
    { code: 'B2610', name: 'China University of Petroleum (East China)', level: 'Bachelor', title: 'Architecture', fee: 18000, unit: 'year', currency: 'RMB', note: null },

    // L2610 - UPC Chinese
    { code: 'L2610', name: 'China University of Petroleum (East China)', level: 'Chinese Language', title: 'General Chinese Program', fee: 5000, unit: 'semester', currency: 'RMB', note: 'After Scholarship Price (Original: 7000 RMB/semester)' },

    // B2607 - DLUT
    { code: 'B2607', name: 'Dalian University of Technology', level: 'Bachelor', title: 'Intelligent Construction (Civil Engineering)', fee: 25500, unit: 'year', currency: 'RMB', note: 'Scholarship: Free tuition for 4 years' },
    { code: 'B2607', name: 'Dalian University of Technology', level: 'Bachelor', title: 'Mechanical Design, Manufacture and Automation', fee: 25500, unit: 'year', currency: 'RMB', note: 'Scholarship: Free tuition for 4 years' },
    { code: 'B2607', name: 'Dalian University of Technology', level: 'Bachelor', title: 'Bioengineering (DUT-BGI)', fee: 25500, unit: 'year', currency: 'RMB', note: 'Scholarship: Free tuition for 4 years' },

    // B2605 - NPU
    { code: 'B2605', name: 'Northwestern Polytechnical University', level: 'Bachelor', title: 'Aerospace Engineering (Aircraft design)', fee: 25000, unit: 'year', currency: 'RMB', note: 'Scholarship Types A-E available' },
    { code: 'B2605', name: 'Northwestern Polytechnical University', level: 'Bachelor', title: 'Aerospace Engineering (Satellites, space science)', fee: 25000, unit: 'year', currency: 'RMB', note: 'Scholarship Types A-E available' },
    { code: 'B2605', name: 'Northwestern Polytechnical University', level: 'Bachelor', title: 'Engineering Mechanics', fee: 25000, unit: 'year', currency: 'RMB', note: 'Scholarship Types A-E available' },
    { code: 'B2605', name: 'Northwestern Polytechnical University', level: 'Bachelor', title: 'Electronics and Information Engineering', fee: 25000, unit: 'year', currency: 'RMB', note: 'Scholarship Types A-E available' },
    { code: 'B2605', name: 'Northwestern Polytechnical University', level: 'Bachelor', title: 'Computer Science and Technology', fee: 25000, unit: 'year', currency: 'RMB', note: 'Scholarship Types A-E available' },
    { code: 'B2605', name: 'Northwestern Polytechnical University', level: 'Bachelor', title: 'Business Administration', fee: 25000, unit: 'year', currency: 'RMB', note: 'Scholarship Types A-E available' },
    { code: 'B2605', name: 'Northwestern Polytechnical University', level: 'Bachelor', title: 'English', fee: 25000, unit: 'year', currency: 'RMB', note: 'Scholarship Types A-E available' },
    { code: 'B2605', name: 'Northwestern Polytechnical University', level: 'Bachelor', title: 'Electrical Engineering & Automation', fee: 25000, unit: 'year', currency: 'RMB', note: 'Scholarship Types A-E available' },
    { code: 'B2605', name: 'Northwestern Polytechnical University', level: 'Bachelor', title: 'Biotechnology', fee: 25000, unit: 'year', currency: 'RMB', note: 'Scholarship Types A-E available' },
    { code: 'B2605', name: 'Northwestern Polytechnical University', level: 'Bachelor', title: 'Materials Science and Engineering', fee: 25000, unit: 'year', currency: 'RMB', note: 'Scholarship Types A-E available' },
    { code: 'B2605', name: 'Northwestern Polytechnical University', level: 'Bachelor', title: 'Mechanical Engineering', fee: 25000, unit: 'year', currency: 'RMB', note: 'Scholarship Types A-E available' },

    // B2611 - NUAA
    { code: 'B2611', name: 'Nanjing University of Aeronautics and Astronautics', level: 'Bachelor', title: 'International Business', fee: 22900, unit: 'year', currency: 'RMB', note: 'Type A Scholarship: Free tuition 1st year' },
    { code: 'B2611', name: 'Nanjing University of Aeronautics and Astronautics', level: 'Bachelor', title: 'Aeronautical Engineering', fee: 23900, unit: 'year', currency: 'RMB', note: 'Type A Scholarship: Free tuition 1st year' },
    { code: 'B2611', name: 'Nanjing University of Aeronautics and Astronautics', level: 'Bachelor', title: 'Civil Engineering', fee: 23900, unit: 'year', currency: 'RMB', note: 'Type A Scholarship: Free tuition 1st year' },
    { code: 'B2611', name: 'Nanjing University of Aeronautics and Astronautics', level: 'Bachelor', title: 'Artificial Intelligence', fee: 23900, unit: 'year', currency: 'RMB', note: 'Type A Scholarship: Free tuition 1st year' },
    { code: 'B2611', name: 'Nanjing University of Aeronautics and Astronautics', level: 'Bachelor', title: 'Mechanical Engineering', fee: 23900, unit: 'year', currency: 'RMB', note: 'Type A Scholarship: Free tuition 1st year' },
    { code: 'B2611', name: 'Nanjing University of Aeronautics and Astronautics', level: 'Bachelor', title: 'Electrical & Electronic Engineering', fee: 23900, unit: 'year', currency: 'RMB', note: 'Type A Scholarship: Free tuition 1st year' },

    // B2603 - LYU
    { code: 'B2603', name: 'Linyi University', level: 'Bachelor', title: 'International Business Trade', fee: 12000, unit: 'year', currency: 'RMB', note: 'Scholarship: Free tuition 1st year' },
    { code: 'B2603', name: 'Linyi University', level: 'Bachelor', title: 'Computer Science and Technology', fee: 12000, unit: 'year', currency: 'RMB', note: 'Scholarship: Free tuition 1st year' },
    { code: 'B2603', name: 'Linyi University', level: 'Bachelor', title: 'E-commerce', fee: 12000, unit: 'year', currency: 'RMB', note: 'Scholarship: Free tuition 1st year' },
    { code: 'B2603', name: 'Linyi University', level: 'Bachelor', title: 'Visual Communication Design', fee: 12000, unit: 'year', currency: 'RMB', note: 'Scholarship: Free tuition 1st year' },
    { code: 'B2603', name: 'Linyi University', level: 'Bachelor', title: 'Civil Engineering', fee: 12000, unit: 'year', currency: 'RMB', note: 'Scholarship: Free tuition 1st year' },
    { code: 'B2603', name: 'Linyi University', level: 'Bachelor', title: 'Media Communication', fee: 12000, unit: 'year', currency: 'RMB', note: 'Scholarship: Free tuition 1st year' },

    // L2602 - LYU Chinese
    { code: 'L2602', name: 'Linyi University', level: 'Chinese Language', title: 'Chinese Language Program', fee: 4000, unit: 'semester', currency: 'RMB', note: 'Exclusive: Tuition + Quad Room (Upper Bed)' },
    { code: 'L2602', name: 'Linyi University', level: 'Chinese Language', title: 'Chinese Language Program', fee: 4200, unit: 'semester', currency: 'RMB', note: 'Exclusive: Tuition + Quad Room (Lower Bed)' },

    // L2620 - SDNU
    { code: 'L2620', name: 'Shandong Normal University', level: 'Chinese Language', title: 'Chinese Language Program', fee: 6000, unit: 'semester', currency: 'RMB', note: 'Exclusive: Tuition + Accommodation (Double Room)' },
    { code: 'L2620', name: 'Shandong Normal University', level: 'Chinese Language', title: 'Chinese Language Program', fee: 12000, unit: 'year', currency: 'RMB', note: 'Exclusive: Tuition + Accommodation (Double Room)' },

    // L2603 - BIT Zhuhai
    { code: 'L2603', name: 'Beijing Institute of Technology (Zhuhai)', level: 'Chinese Language', title: 'Chinese Language Program', fee: 2000, unit: 'semester', currency: 'RMB', note: 'Exclusive Offer (Original: 10000)' },
    { code: 'L2603', name: 'Beijing Institute of Technology (Zhuhai)', level: 'Chinese Language', title: 'Chinese Language Program', fee: 4000, unit: 'year', currency: 'RMB', note: 'Exclusive Offer (Original: 20000)' },

    // B2612 - HIT
    { code: 'B2612', name: 'Harbin Institute of Technology', level: 'Bachelor', title: 'Civil Engineering', fee: 26000, unit: 'year', currency: 'RMB', note: 'Scholarship: Free Tuition (Type A) available' },
    { code: 'B2612', name: 'Harbin Institute of Technology', level: 'Bachelor', title: 'Artificial Intelligence', fee: 26000, unit: 'year', currency: 'RMB', note: 'Scholarship: Free Tuition (Type A) available' },
    { code: 'B2612', name: 'Harbin Institute of Technology', level: 'Bachelor', title: 'Computer Science and Technology', fee: 26000, unit: 'year', currency: 'RMB', note: 'Scholarship: Free Tuition (Type A) available' },
    { code: 'B2612', name: 'Harbin Institute of Technology', level: 'Bachelor', title: 'Intelligent Medical Engineering', fee: 26000, unit: 'year', currency: 'RMB', note: 'Scholarship: Free Tuition (Type A) available' },
    { code: 'B2612', name: 'Harbin Institute of Technology', level: 'Bachelor', title: 'Business Management', fee: 26000, unit: 'year', currency: 'RMB', note: 'Scholarship: Free Tuition (Type A) available' },
    { code: 'B2612', name: 'Harbin Institute of Technology', level: 'Bachelor', title: 'Architecture', fee: 26000, unit: 'year', currency: 'RMB', note: 'Scholarship: Free Tuition (Type A) available' },
    { code: 'B2612', name: 'Harbin Institute of Technology', level: 'Bachelor', title: 'Measurement and Testing Technology and Instrument', fee: 26000, unit: 'year', currency: 'RMB', note: 'Requires >20 students to open class' },
    { code: 'B2612', name: 'Harbin Institute of Technology', level: 'Bachelor', title: 'Intelligent Construction', fee: 26000, unit: 'year', currency: 'RMB', note: 'Requires >20 students to open class' },
    { code: 'B2612', name: 'Harbin Institute of Technology', level: 'Bachelor', title: 'Biological Engineering', fee: 26000, unit: 'year', currency: 'RMB', note: 'Requires >20 students to open class' },
    { code: 'B2612', name: 'Harbin Institute of Technology', level: 'Bachelor', title: 'International Organizations and Global Governance', fee: 26000, unit: 'year', currency: 'RMB', note: 'Requires >20 students to open class' },
    { code: 'B2612', name: 'Harbin Institute of Technology', level: 'Bachelor', title: 'Sociology', fee: 26000, unit: 'year', currency: 'RMB', note: 'Requires >20 students to open class' },
    { code: 'B2612', name: 'Harbin Institute of Technology', level: 'Bachelor', title: 'Energy and Power Engineering', fee: 26000, unit: 'year', currency: 'RMB', note: 'Requires >20 students to open class' },
    { code: 'B2612', name: 'Harbin Institute of Technology', level: 'Bachelor', title: 'Big Data Management and Application', fee: 26000, unit: 'year', currency: 'RMB', note: 'Requires >20 students to open class' },
    { code: 'B2612', name: 'Harbin Institute of Technology', level: 'Bachelor', title: 'Digital Economy', fee: 26000, unit: 'year', currency: 'RMB', note: 'Requires >20 students to open class' },
    { code: 'B2612', name: 'Harbin Institute of Technology', level: 'Bachelor', title: 'Traffic Engineering', fee: 26000, unit: 'year', currency: 'RMB', note: 'Requires >20 students to open class' },
    { code: 'B2612', name: 'Harbin Institute of Technology', level: 'Bachelor', title: 'Digital Media Art', fee: 26000, unit: 'year', currency: 'RMB', note: 'Requires >20 students to open class' },
    { code: 'B2612', name: 'Harbin Institute of Technology', level: 'Bachelor', title: 'Product Design', fee: 26000, unit: 'year', currency: 'RMB', note: 'Requires >20 students to open class' },
    { code: 'B2612', name: 'Harbin Institute of Technology', level: 'Bachelor', title: 'Building Environment and Energy Application Engineering', fee: 26000, unit: 'year', currency: 'RMB', note: 'Requires >20 students to open class' },
    { code: 'B2612', name: 'Harbin Institute of Technology', level: 'Bachelor', title: 'Urban and Rural Planning', fee: 26000, unit: 'year', currency: 'RMB', note: 'Requires >20 students to open class' },
    { code: 'B2612', name: 'Harbin Institute of Technology', level: 'Bachelor', title: 'Intelligent Manufacturing Engineering', fee: 26000, unit: 'year', currency: 'RMB', note: 'Requires >20 students to open class' },
    { code: 'B2612', name: 'Harbin Institute of Technology', level: 'Bachelor', title: 'Robot Engineering', fee: 26000, unit: 'year', currency: 'RMB', note: 'Requires >20 students to open class' },
    { code: 'B2612', name: 'Harbin Institute of Technology', level: 'Bachelor', title: 'Environmental Engineering', fee: 26000, unit: 'year', currency: 'RMB', note: 'Requires >20 students to open class' },
    { code: 'B2612', name: 'Harbin Institute of Technology', level: 'Bachelor', title: 'Chemical Engineering and Technology', fee: 26000, unit: 'year', currency: 'RMB', note: 'Requires >20 students to open class' },
    { code: 'B2612', name: 'Harbin Institute of Technology', level: 'Bachelor', title: 'Automation', fee: 26000, unit: 'year', currency: 'RMB', note: 'Requires >20 students to open class' },
    { code: 'B2612', name: 'Harbin Institute of Technology', level: 'Bachelor', title: 'Integrated Circuit Design and Integrated System', fee: 26000, unit: 'year', currency: 'RMB', note: 'Requires >20 students to open class' },
    { code: 'B2612', name: 'Harbin Institute of Technology', level: 'Bachelor', title: 'Communication Engineering', fee: 26000, unit: 'year', currency: 'RMB', note: 'Requires >20 students to open class' },
    { code: 'B2612', name: 'Harbin Institute of Technology', level: 'Bachelor', title: 'Electronic Information Engineering', fee: 26000, unit: 'year', currency: 'RMB', note: 'Requires >20 students to open class' },
    { code: 'B2612', name: 'Harbin Institute of Technology', level: 'Bachelor', title: 'Electrical Engineering and Automation', fee: 26000, unit: 'year', currency: 'RMB', note: 'Requires >20 students to open class' },
    { code: 'B2612', name: 'Harbin Institute of Technology', level: 'Bachelor', title: 'Welding Technology and Engineering', fee: 26000, unit: 'year', currency: 'RMB', note: 'Requires >20 students to open class' },
    { code: 'B2612', name: 'Harbin Institute of Technology', level: 'Bachelor', title: 'Materials Science and Engineering', fee: 26000, unit: 'year', currency: 'RMB', note: 'Requires >20 students to open class' },

    // B2602 - XJTLU
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", level: 'Bachelor', title: 'Architecture', fee: 93000, unit: 'year', currency: 'RMB', note: '2+2 Study route available' },
    // ... (Adding rest of XJTLU programs in loop or truncated for brevity, but I should add all)
    // For brevity in this artifact, I will add a few representative ones and assume the user wants all. 
    // I will add the logic to process the full list if I had it in a file, but here I'll paste the full list.
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", level: 'Bachelor', title: 'Civil Engineering', fee: 93000, unit: 'year', currency: 'RMB', note: '2+2 Study route available' },
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", level: 'Bachelor', title: 'Industrial Design', fee: 93000, unit: 'year', currency: 'RMB', note: '2+2 Study route available' },
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", level: 'Bachelor', title: 'Urban Planning and Design', fee: 93000, unit: 'year', currency: 'RMB', note: '2+2 Study route available' },
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", level: 'Bachelor', title: 'Accounting', fee: 93000, unit: 'year', currency: 'RMB', note: '2+2 Study route available' },
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", level: 'Bachelor', title: 'Business Administration', fee: 93000, unit: 'year', currency: 'RMB', note: '2+2 Study route available' },
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", level: 'Bachelor', title: 'Economics', fee: 93000, unit: 'year', currency: 'RMB', note: '2+2 Study route available' },
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", level: 'Bachelor', title: 'Economics and Finance', fee: 93000, unit: 'year', currency: 'RMB', note: '2+2 Study route available' },
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", level: 'Bachelor', title: 'Human Resource Management', fee: 93000, unit: 'year', currency: 'RMB', note: '2+2 Study route available' },
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", level: 'Bachelor', title: 'Information Management and Information System', fee: 93000, unit: 'year', currency: 'RMB', note: '2+2 Study route available' },
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", level: 'Bachelor', title: 'International Business with a Language', fee: 93000, unit: 'year', currency: 'RMB', note: '2+2 Study route available' },
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", level: 'Bachelor', title: 'Digital and Intelligent Marketing', fee: 93000, unit: 'year', currency: 'RMB', note: '2+2 Study route available' },
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", level: 'Bachelor', title: 'Computer Science and Technology', fee: 93000, unit: 'year', currency: 'RMB', note: '2+2 Study route available' },
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", level: 'Bachelor', title: 'Digital Media Technology', fee: 93000, unit: 'year', currency: 'RMB', note: '2+2 Study route available' },
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", level: 'Bachelor', title: 'Electrical Engineering', fee: 93000, unit: 'year', currency: 'RMB', note: '2+2 Study route available' },
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", level: 'Bachelor', title: 'Electronic Science and Technology', fee: 93000, unit: 'year', currency: 'RMB', note: '2+2 Study route available' },
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", level: 'Bachelor', title: 'Information and Computing Science', fee: 93000, unit: 'year', currency: 'RMB', note: '2+2 Study route available' },
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", level: 'Bachelor', title: 'Mechatronics and Robotic Systems', fee: 93000, unit: 'year', currency: 'RMB', note: '2+2 Study route available' },
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", level: 'Bachelor', title: 'Telecommunication Engineering', fee: 93000, unit: 'year', currency: 'RMB', note: '2+2 Study route available' },
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", level: 'Bachelor', title: 'Artificial intelligence-Intelligent systems', fee: 93000, unit: 'year', currency: 'RMB', note: null },
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", level: 'Bachelor', title: 'Digital Media Arts', fee: 93000, unit: 'year', currency: 'RMB', note: 'Portfolio Required' },
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", level: 'Bachelor', title: 'Filmmaking', fee: 93000, unit: 'year', currency: 'RMB', note: 'Portfolio Required' },
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", level: 'Bachelor', title: 'TV Production', fee: 93000, unit: 'year', currency: 'RMB', note: 'Portfolio Required' },
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", level: 'Bachelor', title: 'Pharmaceutical Sciences', fee: 93000, unit: 'year', currency: 'RMB', note: '2+2 Study route available' },
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", level: 'Bachelor', title: 'Biopharmaceuticals', fee: 93000, unit: 'year', currency: 'RMB', note: null },
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", level: 'Bachelor', title: 'BSC Applied statistics (biostatistics)', fee: 93000, unit: 'year', currency: 'RMB', note: null },
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", level: 'Bachelor', title: 'China Studies', fee: 93000, unit: 'year', currency: 'RMB', note: null },
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", level: 'Bachelor', title: 'English and Communication Studies', fee: 93000, unit: 'year', currency: 'RMB', note: '2+2 Study route available' },
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", level: 'Bachelor', title: 'English and Business Studies', fee: 93000, unit: 'year', currency: 'RMB', note: null },
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", level: 'Bachelor', title: 'English and Applied Linguistics', fee: 93000, unit: 'year', currency: 'RMB', note: '2+2 Study route available' },
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", level: 'Bachelor', title: 'International Relations', fee: 93000, unit: 'year', currency: 'RMB', note: '2+2 Study route available' },
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", level: 'Bachelor', title: 'Media and Communication Studies', fee: 93000, unit: 'year', currency: 'RMB', note: '2+2 Study route available' },
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", level: 'Bachelor', title: 'Translation and Interpreting', fee: 93000, unit: 'year', currency: 'RMB', note: null },
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", level: 'Bachelor', title: 'Applied Chemistry', fee: 93000, unit: 'year', currency: 'RMB', note: '2+2 Study route available' },
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", level: 'Bachelor', title: 'Bioinformatics', fee: 93000, unit: 'year', currency: 'RMB', note: '2+2 Study route available' },
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", level: 'Bachelor', title: 'Biological Sciences', fee: 93000, unit: 'year', currency: 'RMB', note: '2+2 Study route available' },
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", level: 'Bachelor', title: 'Environmental Science', fee: 93000, unit: 'year', currency: 'RMB', note: '2+2 Study route available' },
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", level: 'Bachelor', title: 'Materials Science and Engineering', fee: 93000, unit: 'year', currency: 'RMB', note: '2+2 Study route available' },
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", level: 'Bachelor', title: 'Actuarial Science', fee: 93000, unit: 'year', currency: 'RMB', note: '2+2 Study route available' },
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", level: 'Bachelor', title: 'Applied Mathematics', fee: 93000, unit: 'year', currency: 'RMB', note: '2+2 Study route available' },
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", level: 'Bachelor', title: 'Financial Mathematics', fee: 93000, unit: 'year', currency: 'RMB', note: '2+2 Study route available' },
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", level: 'Bachelor', title: 'Data Science and Big Data Technology with Contemporary Entrepreneurialism', fee: 93000, unit: 'year', currency: 'RMB', note: 'Taicang Campus' },
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", level: 'Bachelor', title: 'Intelligent Manufacturing Engineering with Contemporary Entrepreneurialism', fee: 93000, unit: 'year', currency: 'RMB', note: 'Taicang Campus' },
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", level: 'Bachelor', title: 'Intelligent Robotics Engineering with Contemporary Entrepreneurialism', fee: 93000, unit: 'year', currency: 'RMB', note: 'Taicang Campus' },
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", level: 'Bachelor', title: 'Intelligent Supply Chain with Contemporary Entrepreneurialism', fee: 93000, unit: 'year', currency: 'RMB', note: 'Taicang Campus' },
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", level: 'Bachelor', title: 'Internet of Things Engineering with Contemporary Entrepreneurialism', fee: 93000, unit: 'year', currency: 'RMB', note: 'Taicang Campus' },
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", level: 'Bachelor', title: 'Microelectronic Science and Engineering with Contemporary Entrepreneurialism', fee: 93000, unit: 'year', currency: 'RMB', note: 'Taicang Campus' },
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", level: 'Bachelor', title: 'Artificial intelligence-Advanced industrial AI', fee: 93000, unit: 'year', currency: 'RMB', note: 'Taicang Campus' },
    { code: 'B2602', name: "Xi'an Jiaotong-Liverpool University", level: 'Bachelor', title: 'Arts, Technology and Entertainment with Contemporary Entrepreneurialism', fee: 93000, unit: 'year', currency: 'RMB', note: 'Taicang Campus' }
];

const requirementsData = [
    { name: 'China University of Petroleum (East China)', level: 'Bachelor', reqs: 'Standard Bachelor documents (Check Language Program L2610 list for reference: Passport, Photo, App Form, HS Diploma & Transcripts (Orig+Trans), Physical Exam, Non-criminal record, Language Cert, Financial Statement)' },
    { name: 'China University of Petroleum (East China)', level: 'Chinese Language', reqs: '1. Passport, 2. Photo, 3. Application form, 4. HS Diploma/Degree (Orig+Trans), 5. Official Transcripts (Orig+Trans), 6. Foreigner Physical Exam, 7. Non-criminal record (Orig+Trans), 8. Language proficiency certificate, 9. Financial Support Statement' },
    { name: 'Dalian University of Technology', level: 'Bachelor', reqs: '1. Application form, 2. Passport (Photo+Blank page), 3. Photo, 4. Notarized HS Diploma & Transcript, 5. Language Cert (TOEFL≥80, IELTS≥5.5, Duolingo≥100), 6. Physical Exam (6mo), 7. Blood Test (HIV, Syphilis, HbsAg, HCV), 8. Non-criminal record, 9. Financial Cert (50k RMB), 10. Personal Statement (600+ words), 11. Rec Letter, 12. CSCA Transcript' },
    { name: 'Northwestern Polytechnical University', level: 'Bachelor', reqs: '1. Application form, 2. Passport, 3. Photo, 4. Highest school cert (Orig+Trans), 5. HS Transcript (Orig+Trans), 6. Language Cert (IELTS≥6.0, TOEFL≥80, Duo≥115; No EFSET), 7. CSCA Test Results, 8. Physical Exam, 9. Non-criminal record (6mo), 10. Bank Statements (5000 USD), 11. Personal Statement+CV, 12. Intro Video' },
    { name: 'Nanjing University of Aeronautics and Astronautics', level: 'Bachelor', reqs: '1. Passport, 2. Photo, 3. Application form, 4. HS Diploma (Orig+Trans), 5. HS Transcripts (Orig+Trans), 6. Non-criminal record (Orig+Trans), 7. Physical Exam, 8. Two Rec Letters, 9. Personal Statement (<800w), 10. Language Cert (IELTS≥6.0/TOEFL≥70), 11. Financial Guarantee' },
    { name: 'Linyi University', level: 'Bachelor', reqs: '1. Passport, 2. Photo, 3. Application form, 4. HS Diploma (Orig+Trans), 5. Official Transcripts (Orig+Trans), 6. Physical Exam, 7. Non-criminal record, 8. Intro Video' },
    { name: 'Linyi University', level: 'Chinese Language', reqs: '1. Passport, 2. Photo, 3. Application form, 4. HS Diploma (Orig+Trans), 5. Official Transcripts (Orig+Trans), 6. Physical Exam, 7. Non-criminal record, 8. Intro Video' },
    { name: 'Shandong Normal University', level: 'Chinese Language', reqs: '1. Passport, 2. Photo, 3. Application form, 4. HS Diploma (Orig+Trans), 5. Official Transcripts (Orig+Trans), 6. Non-criminal record (Orig+Trans), 7. Bank Statements' },
    { name: 'Beijing Institute of Technology (Zhuhai)', level: 'Chinese Language', reqs: '1. Passport, 2. Photo, 3. Application form, 4. HS Diploma (Orig+Trans), 5. Official Transcripts (Orig+Trans), 6. Non-criminal record (Orig+Trans), 7. Physical Exam (with blood test), 8. Language Cert, 9. Personal Statement, 10. Minor notarized doc (if <18)' },
    { name: 'Harbin Institute of Technology', level: 'Bachelor', reqs: '1. Application form, 2. Passport, 3. Photo, 4. HS Diploma, 5. HS Transcript, 6. Language Cert, 7. Physical Exam, 8. Non-criminal record (Orig+Trans), 9. CV' },
    { name: "Xi'an Jiaotong-Liverpool University", level: 'Bachelor', reqs: '1. Photo, 2. Passport, 3. Application form, 4. HS Certificate (Trans), 5. Transcript (Trans), 6. English Certificate, 7. Personal Statement, 8. Portfolio & interview (Arts majors)' }
];

async function insertData() {
    console.log("Starting programs and requirements insertion...");

    // 1. Insert Programs
    for (const prog of programsData) {
        const namePart = prog.name.split('(')[0].trim();
        const { data: universities } = await supabase
            .from('universities')
            .select('id, name')
            .ilike('name', `%${namePart}%`)
            .limit(1);

        if (!universities || universities.length === 0) {
            console.error(`University not found for: ${prog.name}`);
            continue;
        }
        const uniId = universities[0].id;

        // Check if program exists
        const { data: existing } = await supabase
            .from('programs')
            .select('id')
            .eq('university_id', uniId)
            .eq('title', prog.title)
            .eq('level', prog.level)
            .limit(1);

        if (existing && existing.length > 0) {
            console.log(`Program already exists: ${prog.title}`);
            continue;
        }

        const { error } = await supabase.from('programs').insert({
            university_id: uniId,
            title: prog.title,
            level: prog.level,
            tuition_fee: prog.fee,
            tuition_unit: prog.unit,
            currency: prog.currency,
            description: prog.note,
            is_active: true
        });

        if (error) console.error(`Error inserting program ${prog.title}:`, error.message);
        else console.log(`Inserted program: ${prog.title} for ${prog.name}`);
    }

    // 2. Insert Requirements
    for (const req of requirementsData) {
        const namePart = req.name.split('(')[0].trim();
        const { data: universities } = await supabase
            .from('universities')
            .select('id, name')
            .ilike('name', `%${namePart}%`)
            .limit(1);

        if (!universities || universities.length === 0) continue;
        const uniId = universities[0].id;

        // Create a specific catalog item for this university and level to avoid unique constraint issues
        // and to allow specific "Bachelor" vs "Master" requirements if needed.
        const catalogTitle = `Application Documents - ${req.level}`;

        // Check if this specific catalog item already exists (globally or we make it specific?)
        // If we make it specific to the university, we pollute the catalog.
        // But the constraint is (university_id, requirement_id).
        // So if we reuse "Application Documents - Bachelor" for ALL universities, it works (uni_id differs).
        // But if a university has TWO "Bachelor" entries, it fails.
        // The user data has:
        // UPC: Bachelor, Chinese Language -> OK (different levels)
        // Linyi: Bachelor, Chinese Language -> OK
        // But wait, the error was: "duplicate key value violates unique constraint".
        // Ah, I was using the SAME "General Application Documents" (ID X) for BOTH Bachelor and Chinese Language for the SAME university.
        // That's why it failed. (Uni A, Req X) exists. Try to insert (Uni A, Req X) again -> Fail.

        // Solution: Use different catalog items for different levels.
        // "Application Documents (Bachelor)"
        // "Application Documents (Chinese Language)"

        let catalogId = '';
        const targetTitle = `Application Documents (${req.level})`;

        const { data: catalogItems } = await supabase
            .from('admission_requirements_catalog')
            .select('id')
            .eq('title', targetTitle)
            .limit(1);

        if (catalogItems && catalogItems.length > 0) {
            catalogId = catalogItems[0].id;
        } else {
            const { data: newCat, error: catError } = await supabase
                .from('admission_requirements_catalog')
                .insert({
                    title: targetTitle,
                    category: 'document',
                    requirement_type: 'file',
                    description: `Required documents for ${req.level} programs`,
                    is_common: true
                })
                .select('id')
                .single();

            if (newCat) catalogId = newCat.id;
            else {
                console.error("Failed to create catalog item:", catError?.message);
                continue;
            }
        }

        // Check if requirement already linked
        const { data: existingReq } = await supabase
            .from('university_admission_requirements')
            .select('id')
            .eq('university_id', uniId)
            .eq('requirement_id', catalogId)
            .limit(1);

        if (existingReq && existingReq.length > 0) {
            console.log(`Requirement already linked for ${req.name} (${req.level})`);
            // Update the note if needed?
            await supabase
                .from('university_admission_requirements')
                .update({ custom_note: req.reqs, program_level: req.level })
                .eq('id', existingReq[0].id);
            console.log(`Updated requirement note for ${req.name}`);
            continue;
        }

        const { error } = await supabase.from('university_admission_requirements').insert({
            university_id: uniId,
            requirement_id: catalogId,
            is_required: true,
            custom_note: req.reqs,
            program_level: req.level
        });

        if (error) console.error(`Error inserting requirement for ${req.name}:`, error.message);
        else console.log(`Inserted requirements for ${req.name} (${req.level})`);
    }
}

insertData();
