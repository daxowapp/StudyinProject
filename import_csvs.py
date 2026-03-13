import sqlite3
import pandas as pd

def import_csvs(db_path, csv_files):
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    
    # create universities and programs tables (just in case they aren't there or to be sure)
    cur.execute('''
    CREATE TABLE IF NOT EXISTS universities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE,
        description TEXT,
        city TEXT
    )
    ''')
    cur.execute('''
    CREATE TABLE IF NOT EXISTS programs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        university_id INTEGER,
        name TEXT,
        level TEXT,
        duration TEXT,
        tuition_fee TEXT,
        language TEXT,
        deadline TEXT,
        intake TEXT,
        FOREIGN KEY (university_id) REFERENCES universities(id)
    )
    ''')

    for csv_file in csv_files:
        df = pd.read_csv(csv_file)
        
        for index, row in df.iterrows():
            uni_name = str(row.get('University Name', '')).strip()
            
            # Use original location logic or just empty for city if not found easily
            # But wait, university might already exist in the db!
            # Let's ensure it exists
            if pd.isna(uni_name) or not uni_name:
                continue
                
            cur.execute("SELECT id FROM universities WHERE name = ?", (uni_name,))
            res = cur.fetchone()
            if res:
                uni_id = res[0]
            else:
                cur.execute("INSERT INTO universities (name) VALUES (?)", (uni_name,))
                uni_id = cur.lastrowid
            
            prog_name = str(row.get('Program Name', '')).strip()
            level = str(row.get('Level', '')).strip()
            dur = str(row.get('Duration', '')).strip()
            t_fee = str(row.get('Tuition Fee', '')).strip()
            lang = str(row.get('Program Language', '')).strip()
            dead = str(row.get('Application Deadline', '')).strip()
            intake = str(row.get('Start Date', '')).strip()
            
            cur.execute("""
                INSERT INTO programs (university_id, name, level, duration, tuition_fee, language, deadline, intake)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (uni_id, prog_name, level, dur, t_fee, lang, dead, intake))

    conn.commit()
    conn.close()

if __name__ == "__main__":
    db = 'database/studyin.db'
    csvs = ['data/bachelor_programs_translated.csv', 'data/master_programs_translated.csv']
    import_csvs(db, csvs)
    print("Files imported successfully.")
