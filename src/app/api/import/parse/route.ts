import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { createAdminClient } from "@/lib/supabase/server";
import * as fs from "fs";
import * as path from "path";

export const maxDuration = 60;

interface ExcelRow {
  source_file: string;
  program_name: string;
  level: string;
  duration: string;
  tuition_fee: string;
  entry_requirements: string;
  special_exams: string;
  location: string;
  start_date: string;
  application_deadline: string;
  application_fee: string;
  service_fee: string;
  program_language: string;
  university_name: string;
  csca_exam_required: string;
  application_fee_1: string;
}

function parseExcelRow(row: any[]): ExcelRow {
  return {
    source_file: row[0]?.toString() || "",
    program_name: row[1]?.toString() || "",
    level: row[2]?.toString() || "",
    duration: row[3]?.toString() || "",
    tuition_fee: row[4]?.toString() || "",
    entry_requirements: row[5]?.toString() || "",
    special_exams: row[6]?.toString() || "",
    location: row[7]?.toString() || "",
    start_date: row[8]?.toString() || "",
    application_deadline: row[9]?.toString() || "",
    application_fee: row[10]?.toString() || "",
    service_fee: row[11]?.toString() || "",
    program_language: row[12]?.toString() || "",
    university_name: row[13]?.toString() || "",
    csca_exam_required: row[14]?.toString() || "",
    application_fee_1: row[15]?.toString() || "",
  };
}

function isNA(val: string): boolean {
  return !val || val.trim() === "" || val.trim() === "N/A" || val.trim() === "None";
}

export async function POST() {
  try {
    // Read excel file
    const excelPath = path.join(process.cwd(), "supabase", "combined_data_2026-03-0.xlsx");
    
    let fileBuffer: Buffer;
    try {
      fileBuffer = fs.readFileSync(excelPath);
    } catch {
      return NextResponse.json(
        { error: `Cannot read Excel file at ${excelPath}. Ensure the file exists.` },
        { status: 404 }
      );
    }

    const workbook = XLSX.read(fileBuffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // Skip header row
    const dataRows = rawData.slice(1).filter(row => row.length > 0);

    // Group by university
    const universityMap: Record<string, {
      name: string;
      programCount: number;
      levels: Set<string>;
      languages: Set<string>;
      location: string;
    }> = {};

    for (const row of dataRows) {
      const parsed = parseExcelRow(row);
      const uniName = parsed.university_name.trim();
      if (!uniName || isNA(uniName)) continue;

      if (!universityMap[uniName]) {
        universityMap[uniName] = {
          name: uniName,
          programCount: 0,
          levels: new Set(),
          languages: new Set(),
          location: "",
        };
      }

      universityMap[uniName].programCount++;

      if (!isNA(parsed.level)) {
        universityMap[uniName].levels.add(parsed.level);
      }
      if (!isNA(parsed.program_language)) {
        universityMap[uniName].languages.add(parsed.program_language);
      }
      if (!isNA(parsed.location) && !universityMap[uniName].location) {
        universityMap[uniName].location = parsed.location;
      }
    }

    // Check which universities already exist in DB
    const supabase = await createAdminClient();
    const { data: existingUnis } = await supabase
      .from("universities")
      .select("id, name, slug");

    const existingNames = new Set(
      (existingUnis || []).map(u => u.name.toLowerCase().trim())
    );

    // Build summary
    const universities = Object.values(universityMap)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(uni => ({
        name: uni.name,
        programCount: uni.programCount,
        levels: Array.from(uni.levels),
        languages: Array.from(uni.languages),
        location: uni.location,
        existsInDb: existingNames.has(uni.name.toLowerCase().trim()),
        dbId: (existingUnis || []).find(
          e => e.name.toLowerCase().trim() === uni.name.toLowerCase().trim()
        )?.id || null,
      }));

    return NextResponse.json({
      totalRows: dataRows.length,
      totalUniversities: universities.length,
      newUniversities: universities.filter(u => !u.existsInDb).length,
      existingUniversities: universities.filter(u => u.existsInDb).length,
      universities,
    });
  } catch (error: any) {
    console.error("Parse error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
