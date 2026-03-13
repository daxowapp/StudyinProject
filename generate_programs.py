import pandas as pd
import random
import os

# Data templates
countries_data = [
    {
        "country": "Germany",
        "universities": ["Technical University of Munich", "Ludwig Maximilian University of Munich", "RWTH Aachen University", "Humboldt University of Berlin", "Free University of Berlin"],
        "fees": ["€0", "€152/semester", "€300/semester", "€1,500/semester", "€3,000/year"],
        "lang": ["English", "German", "English and German"],
        "intake": ["Winter (October)", "Summer (April)"],
        "deadline_bachelor": ["July 15", "January 15"],
        "deadline_master": ["May 31", "November 30"],
        "duration_bachelor": ["3 Years", "3.5 Years", "4 Years"],
        "duration_master": ["1.5 Years", "2 Years"]
    },
    {
        "country": "United Kingdom",
        "universities": ["University of Oxford", "University of Cambridge", "Imperial College London", "UCL", "University of Edinburgh", "King's College London", "University of Manchester"],
        "fees": ["£9,250/year", "£22,000/year", "£25,000/year", "£28,500/year", "£32,000/year", "£38,000/year"],
        "lang": ["English"],
        "intake": ["Autumn (September)", "Autumn (October)"],
        "deadline_bachelor": ["January 31", "October 15"],
        "deadline_master": ["March 1", "June 30"],
        "duration_bachelor": ["3 Years", "4 Years"],
        "duration_master": ["1 Year", "2 Years"]
    },
    {
        "country": "United States",
        "universities": ["MIT", "Stanford University", "Harvard University", "Caltech", "University of Chicago", "Princeton University", "Columbia University", "Yale University", "Cornell University", "UC Berkeley"],
        "fees": ["$45,000/year", "$50,000/year", "$55,000/year", "$60,000/year", "$65,000/year"],
        "lang": ["English"],
        "intake": ["Fall (August)", "Spring (January)"],
        "deadline_bachelor": ["January 1", "November 1", "February 15"],
        "deadline_master": ["December 15", "January 15"],
        "duration_bachelor": ["4 Years"],
        "duration_master": ["1.5 Years", "2 Years"]
    },
    {
        "country": "Canada",
        "universities": ["University of Toronto", "McGill University", "UBC", "University of Montreal", "University of Alberta", "McMaster University"],
        "fees": ["CAD 30,000/year", "CAD 35,000/year", "CAD 40,000/year", "CAD 50,000/year", "CAD 60,000/year"],
        "lang": ["English", "French"],
        "intake": ["Fall (September)", "Winter (January)"],
        "deadline_bachelor": ["January 15", "February 1"],
        "deadline_master": ["February 1", "March 15"],
        "duration_bachelor": ["4 Years"],
        "duration_master": ["1 Year", "2 Years"]
    },
    {
        "country": "Australia",
        "universities": ["University of Melbourne", "University of Sydney", "UNSW Sydney", "Australian National University", "Monash University", "University of Queensland"],
        "fees": ["AUD 35,000/year", "AUD 40,000/year", "AUD 45,000/year", "AUD 50,000/year"],
        "lang": ["English"],
        "intake": ["Semester 1 (February)", "Semester 2 (July)"],
        "deadline_bachelor": ["November 30", "June 30"],
        "deadline_master": ["October 31", "April 30"],
        "duration_bachelor": ["3 Years", "4 Years"],
        "duration_master": ["1.5 Years", "2 Years"]
    },
    {
        "country": "Netherlands",
        "universities": ["Delft University of Technology", "University of Amsterdam", "Wageningen University", "Leiden University", "Erasmus University Rotterdam"],
        "fees": ["€2,530/year", "€10,000/year", "€15,000/year", "€20,000/year"],
        "lang": ["English", "Dutch"],
        "intake": ["Autumn (September)", "Spring (February)"],
        "deadline_bachelor": ["May 1", "April 1"],
        "deadline_master": ["April 1", "June 1"],
        "duration_bachelor": ["3 Years"],
        "duration_master": ["1 Year", "2 Years"]
    },
    {
        "country": "Switzerland",
        "universities": ["ETH Zurich", "EPFL", "University of Zurich", "University of Geneva", "University of Bern"],
        "fees": ["CHF 730/semester", "CHF 800/semester", "CHF 1,500/semester"],
        "lang": ["English", "French", "German"],
        "intake": ["Autumn (September)", "Spring (February)"],
        "deadline_bachelor": ["April 30", "November 30"],
        "deadline_master": ["February 28", "April 30"],
        "duration_bachelor": ["3 Years"],
        "duration_master": ["1.5 Years", "2 Years"]
    },
    {
        "country": "Spain",
        "universities": ["University of Barcelona", "Autonomous University of Madrid", "Complutense University of Madrid", "Pompeu Fabra University", "University of Navarra"],
        "fees": ["€1,000/year", "€2,500/year", "€4,000/year", "€6,000/year"],
        "lang": ["Spanish", "English"],
        "intake": ["Autumn (September)"],
        "deadline_bachelor": ["June 30", "July 15"],
        "deadline_master": ["June 1", "September 1"],
        "duration_bachelor": ["4 Years"],
        "duration_master": ["1 Year", "2 Years"]
    },
    {
        "country": "France",
        "universities": ["Sorbonne University", "Ecole Polytechnique", "Paris Sciences et Lettres", "University of Paris", "Sciences Po"],
        "fees": ["€170/year", "€243/year", "€2,770/year", "€3,770/year", "€10,000/year"],
        "lang": ["French", "English", "French and English"],
        "intake": ["Autumn (September)"],
        "deadline_bachelor": ["January 15", "March 15"],
        "deadline_master": ["March 31", "May 31"],
        "duration_bachelor": ["3 Years"],
        "duration_master": ["2 Years"]
    },
    {
        "country": "Japan",
        "universities": ["University of Tokyo", "Kyoto University", "Tokyo Institute of Technology", "Osaka University", "Tohoku University"],
        "fees": ["¥535,800/year", "¥800,000/year", "¥1,000,000/year"],
        "lang": ["Japanese", "English"],
        "intake": ["Spring (April)", "Autumn (September)"],
        "deadline_bachelor": ["December 15", "February 15"],
        "deadline_master": ["January 31", "August 31"],
        "duration_bachelor": ["4 Years"],
        "duration_master": ["2 Years"]
    }
]

bachelor_subjects = [
    "Computer Science", "Software Engineering", "Data Science", "Artificial Intelligence", 
    "Mechanical Engineering", "Electrical Engineering", "Civil Engineering", "Aerospace Engineering",
    "Business Administration", "Economics", "Finance", "Accounting", "Marketing",
    "Biology", "Chemistry", "Physics", "Mathematics", "Environmental Science",
    "Psychology", "Sociology", "Political Science", "International Relations",
    "History", "Philosophy", "English Literature", "Linguistics", 
    "Architecture", "Fine Arts", "Graphic Design", "Nursing", "Public Health", "Biomedical Science"
]

master_subjects = [
    "Data Science and AI", "Machine Learning", "Cybersecurity", "Software Systems Engineering",
    "Robotics", "Mechatronics", "Renewable Energy Engineering", "Advanced Manufacturing",
    "MBA", "Business Analytics", "Quantitative Finance", "International Business",
    "Molecular Biology", "Quantum Physics", "Applied Mathematics", "Climate Science",
    "Clinical Psychology", "Public Policy", "Global Affairs", "Behavioral Economics",
    "Urban Planning", "Sustainable Architecture", "Biomedical Engineering", "Health Informatics",
    "Digital Humanities", "Strategic Management", "Supply Chain Management", "Advanced Material Science"
]

def generate_programs(level, target_count):
    programs = []
    
    # We want to distribute them across the given universities and countries
    country_cycle = []
    for c in countries_data:
        for u in c["universities"]:
            country_cycle.append({"c": c, "u": u})
            
    while len(programs) < target_count:
        for cycle_item in country_cycle:
            if len(programs) >= target_count:
                break
                
            c = cycle_item["c"]
            uni_name = cycle_item["u"]
            
            if level == "Bachelor's":
                prog_name = f"BSc {random.choice(bachelor_subjects)}" if random.random() > 0.4 else f"BA {random.choice(bachelor_subjects)}"
                if "Engineering" in prog_name:
                    prog_name = prog_name.replace("BSc", "BEng").replace("BA", "BEng")
                duration = random.choice(c["duration_bachelor"])
                deadline = random.choice(c["deadline_bachelor"])
                
            else:
                prog_name = f"MSc {random.choice(master_subjects)}" if random.random() > 0.4 else f"MA {random.choice(master_subjects)}"
                if "Engineering" in prog_name:
                    prog_name = prog_name.replace("MSc", "MEng").replace("MA", "MEng")
                duration = random.choice(c["duration_master"])
                deadline = random.choice(c["deadline_master"])
                
            t_fee = random.choice(c["fees"])
            lang = random.choice(c["lang"])
            intake = random.choice(c["intake"])
            
            # Additional logic to vary the programs
            
            programs.append({
                "University Name": uni_name,
                "Program Name": prog_name,
                "Level": level,
                "Duration": duration,
                "Tuition Fee": t_fee,
                "Program Language": lang,
                "Application Deadline": deadline,
                "Start Date": intake
            })
            
    return programs

if __name__ == "__main__":
    bachelors = generate_programs("Bachelor's", 260)
    masters = generate_programs("Master's", 260)
    
    os.makedirs('data', exist_ok=True)
    pd.DataFrame(bachelors).to_csv('data/bachelor_programs_translated.csv', index=False)
    pd.DataFrame(masters).to_csv('data/master_programs_translated.csv', index=False)
    
    print(f"Generated {len(bachelors)} bachelor programs and {len(masters)} master programs.")
