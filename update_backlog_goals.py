import json
import subprocess
import os

data = [
    {"subject": "Physics", "chapter": "Basic Maths & Unit/Dimensions", "link": "https://www.youtube.com/watch?v=UOzWO2-Z9So"},
    {"subject": "Physics", "chapter": "Motion in a Straight Line", "link": "https://www.youtube.com/watch?v=02CBTEOMMsA"},
    {"subject": "Physics", "chapter": "Laws of Motion", "link": "https://www.youtube.com/watch?v=pi0bAxOGHIo"},
    {"subject": "Physics", "chapter": "Work, Power & Energy", "link": "https://www.youtube.com/watch?v=VG2KogeWzIY"},

    {"subject": "Physical Chemistry", "chapter": "Mole Concept", "link": "https://www.youtube.com/watch?v=ub4LDdjCauQ"},
    {"subject": "Physical Chemistry", "chapter": "Atomic Structure", "link": "https://www.youtube.com/watch?v=4ddGqKZIIvs"},
    {"subject": "Physical Chemistry", "chapter": "Thermodynamics", "link": "https://www.youtube.com/watch?v=QS6vOMlhvsc"},
    {"subject": "Physical Chemistry", "chapter": "Chemical & Ionic Equilibrium", "link": "https://www.youtube.com/watch?v=Ar3TH7MEVTQ"},
    {"subject": "Physical Chemistry", "chapter": "Redox Reactions", "link": "https://www.youtube.com/watch?v=UoJh42eQU8I"},

    {"subject": "Inorganic Chemistry", "chapter": "Periodic Table", "link": "https://www.youtube.com/watch?v=bLkVDkaJrTo"},
    {"subject": "Inorganic Chemistry", "chapter": "Chemical Bonding", "link": "https://www.youtube.com/watch?v=6I3mLw30qzQ"},

    {"subject": "Organic Chemistry", "chapter": "IUPAC Nomenclature", "link": "https://www.youtube.com/watch?v=WnIszkrdY8Q"},
    {"subject": "Organic Chemistry", "chapter": "GOC (General Organic Chemistry)", "link": "https://www.youtube.com/watch?v=QeecXIDYtiw"},
    {"subject": "Organic Chemistry", "chapter": "Isomerism", "link": "https://www.youtube.com/watch?v=o8T4ZG08q8g"},
    {"subject": "Organic Chemistry", "chapter": "Hydrocarbons", "link": "https://www.youtube.com/watch?v=wHnUniHm3yc"},

    {"subject": "Maths", "chapter": "Basic Mathematics", "link": "https://www.youtube.com/watch?v=0DgG7LxiYzk"},
    {"subject": "Maths", "chapter": "Quadratic Equations", "link": "https://www.youtube.com/watch?v=NKth1h8pr7s"},
    {"subject": "Maths", "chapter": "Trigonometry", "link": "https://www.youtube.com/watch?v=bv8qBsHK9bM"},
    {"subject": "Maths", "chapter": "Sequence & Series", "link": "https://www.youtube.com/watch?v=JAvi2K_DbbI"},
    {"subject": "Maths", "chapter": "Binomial Theorem", "link": "https://www.youtube.com/watch?v=FCByCwnj_J0"},
    {"subject": "Maths", "chapter": "Permutations & Combinations", "link": "https://www.youtube.com/watch?v=wE0xrUuJLnk"},
    {"subject": "Maths", "chapter": "Straight Lines", "link": "https://www.youtube.com/watch?v=6HQgDO1trlM"},
    {"subject": "Maths", "chapter": "Circles", "link": "https://www.youtube.com/watch?v=Rh95KkMwklU"},
    {"subject": "Maths", "chapter": "Conic Sections", "link": "https://www.youtube.com/watch?v=mE8w2uxm6XY"},
    {"subject": "Maths", "chapter": "Limits & Derivatives", "link": "https://www.youtube.com/watch?v=UsHUxG90f_4"}
]

def get_duration(url):
    try:
        res = subprocess.run(
            ["yt-dlp", "--get-duration", url],
            capture_output=True, text=True, check=True
        )
        duration_str = res.stdout.strip()
        # Parse HH:MM:SS or MM:SS into total minutes
        parts = duration_str.split(':')
        if len(parts) == 3:
            h, m, s = [int(p) for p in parts]
            return h * 60 + m + round(s/60, 2)
        elif len(parts) == 2:
            m, s = [int(p) for p in parts]
            return m + round(s/60, 2)
        else:
            return int(parts[0]) / 60
    except Exception as e:
        print(f"Error fetching duration for {url}: {e}")
        return 0

goals_output = []
for i, item in enumerate(data):
    duration_mins = get_duration(item['link'])
    hours = round(duration_mins / 60, 1)
    
    # We set target as 1 because these are one shots
    goals_output.append({
        "id": f"planner_{item['subject'].lower().replace(' ', '_')}_{i}",
        "title": f"{item['subject']} - {item['chapter']}",
        "target": 1, 
        "current": 0,
        "unit": "one-shot",
        "completed": False,
        "isPlannerGoal": True,
        "sequence": i + 1,
        "createdAt": None,
        "link": item["link"],
        "durationHours": hours
    })
    print(f"Processed {item['chapter']}: {hours} hrs")

with open('planner_goals.json', 'w') as f:
    json.dump(goals_output, f, indent=4)
    
print("Successfully generated new planner_goals.json")
