import sqlite3
import pandas as pd
import json
import os
from openai import OpenAI
from dotenv import load_dotenv
import argparse

# Load env variables
load_dotenv('.env.local')

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

DB_PATH = "database/studyin.db"

def ensure_description_column(cursor):
    try:
        cursor.execute("ALTER TABLE programs ADD COLUMN description TEXT;")
        print("Added 'description' column to programs table.")
    except sqlite3.OperationalError:
        pass # Column already exists

def generate_university_info(name, location_hint):
    prompt = f"""
    You are an AI assistant helping to build a university database.
    I have a university named '{name}'. The raw location data from exactly is '{location_hint}'.
    Please provide:
    1. A short, compelling description of this university (around 2-3 sentences).
    2. The standardized English name of the city where the main campus is located.

    Return the result exactly as a JSON object with 'description' and 'city' keys. ONLY return JSON.
    """
    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        response_format={ "type": "json_object" }
    )
    return json.loads(completion.choices[0].message.content)

def generate_program_description(program_name, university_name):
    prompt = f"""
    You are an AI assistant helping to build a university study program database.
    I need a short, compelling description (about 2 sentences) for a university program called '{program_name}' at '{university_name}'.
    Return the result exactly as a JSON object with a single 'description' key. ONLY return JSON.
    """
    try:
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            response_format={ "type": "json_object" }
        )
        return json.loads(completion.choices[0].message.content).get('description', '')
    except Exception as e:
        print(f"Error generating program description: {e}")
        return ""

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--unilimit", type=int, default=10, help="Max number of missing universities to process.")
    parser.add_argument("--proglimit", type=int, default=50, help="Max number of missing programs to process.")
    args = parser.parse_args()

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    ensure_description_column(cursor)

    print("Loading Excel file...")
    df = pd.read_excel('supabase/combined_data_2026-03-09.xlsx')
    
    # Fill nan to empty strings for safety
    df = df.fillna('')
    
    # Process Universities
    print("Processing Universities...")
    unique_unis = df[['University Name', 'Location']].drop_duplicates(subset=['University Name'])
    unique_unis = unique_unis[unique_unis['University Name'] != '']
    
    unis_processed = 0
    for _, row in unique_unis.iterrows():
        if unis_processed >= args.unilimit:
            print(f"Reached uni limit of {args.unilimit}.")
            break
        
        name = row['University Name']
        loc = row['Location']
        
        cursor.execute("SELECT id FROM universities WHERE name = ?", (name,))
        if not cursor.fetchone():
            print(f"New university found: {name}. Generating info using OpenAI...")
            try:
                info = generate_university_info(name, loc)
                cursor.execute("INSERT INTO universities (name, description, city) VALUES (?, ?, ?)",
                               (name, info.get('description', ''), info.get('city', '')))
                conn.commit()
                unis_processed += 1
                print(f"  Inserted: {name} ({info.get('city', '')})")
            except Exception as e:
                print(f"  Failed for {name}: {e}")
    
    # Fetch university map
    cursor.execute("SELECT id, name FROM universities")
    uni_map = {name: uid for uid, name in cursor.fetchall()}
    
    # Process Programs
    print("Processing Programs...")
    progs_processed = 0
    for _, row in df.iterrows():
        if progs_processed >= args.proglimit:
            print(f"Reached program limit of {args.proglimit}")
            break
            
        uni_name = row['University Name']
        prog_name = row['Program Name']
        
        if not uni_name or not prog_name:
            continue
            
        uni_id = uni_map.get(uni_name)
        if not uni_id:
            # University might not have been processed if we hit limit
            continue
            
        cursor.execute("SELECT id, description FROM programs WHERE name = ? AND university_id = ?", (prog_name, uni_id))
        existing_prog = cursor.fetchone()
        
        if existing_prog:
            if not existing_prog[1]:
                # Needs description update
                print(f"Program missing description: {prog_name} at {uni_name}. Generating...")
                desc = generate_program_description(prog_name, uni_name)
                cursor.execute("UPDATE programs SET description = ? WHERE id = ?", (desc, existing_prog[0]))
                conn.commit()
                progs_processed += 1
            continue
        
        print(f"New program found: {prog_name} at {uni_name}. Generating description...")
        desc = generate_program_description(prog_name, uni_name)
        
        cursor.execute("""
            INSERT INTO programs (university_id, name, level, duration, tuition_fee, language, deadline, intake, description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            uni_id,
            prog_name,
            row['Level'],
            row['Duration'],
            row['Tuition Fee'],
            row['Program Language'],
            row['Application Deadline'],
            row['Start Date'],
            desc
        ))
        conn.commit()
        progs_processed += 1

    conn.close()
    print("Integration completed.")

if __name__ == "__main__":
    main()
