import json
import subprocess

# The raw links the user provided, in the order they provided them (mostly)
# I will map them to their real titles and durations, then re-sequence them.

raw_data = [
    # Physics
    {"url": "https://www.youtube.com/watch?v=UOzWO2-Z9So", "subject": "Physics", "orig_tag": "Basic Maths & Unit/Dimensions"},
    {"url": "https://www.youtube.com/watch?v=02CBTEOMMsA", "subject": "Physics", "orig_tag": "Motion in a Straight Line"},
    {"url": "https://www.youtube.com/watch?v=pi0bAxOGHIo", "subject": "Physics", "orig_tag": "Laws of Motion"},
    {"url": "https://www.youtube.com/watch?v=VG2KogeWzIY", "subject": "Physics", "orig_tag": "Work, Power & Energy"},
    # Physical Chem
    {"url": "https://www.youtube.com/watch?v=ub4LDdjCauQ", "subject": "Chemistry", "orig_tag": "Mole Concept"},
    {"url": "https://www.youtube.com/watch?v=4ddGqKZIIvs", "subject": "Chemistry", "orig_tag": "Atomic Structure"},
    {"url": "https://www.youtube.com/watch?v=QS6vOMlhvsc", "subject": "Chemistry", "orig_tag": "Thermodynamics"},
    {"url": "https://www.youtube.com/watch?v=Ar3TH7MEVTQ", "subject": "Chemistry", "orig_tag": "Equilibrium"},
    {"url": "https://www.youtube.com/watch?v=UoJh42eQU8I", "subject": "Chemistry", "orig_tag": "Redox Reactions"},
    # Inorganic
    {"url": "https://www.youtube.com/watch?v=bLkVDkaJrTo", "subject": "Chemistry", "orig_tag": "Periodic Table"},
    {"url": "https://www.youtube.com/watch?v=6I3mLw30qzQ", "subject": "Chemistry", "orig_tag": "Chemical Bonding"},
    # Organic
    {"url": "https://www.youtube.com/watch?v=WnIszkrdY8Q", "subject": "Chemistry", "orig_tag": "IUPAC"},
    {"url": "https://www.youtube.com/watch?v=QeecXIDYtiw", "subject": "Chemistry", "orig_tag": "GOC"},
    {"url": "https://www.youtube.com/watch?v=o8T4ZG08q8g", "subject": "Chemistry", "orig_tag": "Isomerism"},
    {"url": "https://www.youtube.com/watch?v=wHnUniHm3yc", "subject": "Chemistry", "orig_tag": "Hydrocarbons"},
    # Maths
    {"url": "https://www.youtube.com/watch?v=0DgG7LxiYzk", "subject": "Maths", "orig_tag": "Basic Mathematics"},
    {"url": "https://www.youtube.com/watch?v=NKth1h8pr7s", "subject": "Maths", "orig_tag": "Quadratic"},
    {"url": "https://www.youtube.com/watch?v=bv8qBsHK9bM", "subject": "Maths", "orig_tag": "Trigonometry"},
    {"url": "https://www.youtube.com/watch?v=JAvi2K_DbbI", "subject": "Maths", "orig_tag": "Seq & Series"},
    {"url": "https://www.youtube.com/watch?v=FCByCwnj_J0", "subject": "Maths", "orig_tag": "Binomial"},
    {"url": "https://www.youtube.com/watch?v=wE0xrUuJLnk", "subject": "Maths", "orig_tag": "P & C"},
    {"url": "https://www.youtube.com/watch?v=6HQgDO1trlM", "subject": "Maths", "orig_tag": "Straight Lines"},
    {"url": "https://www.youtube.com/watch?v=Rh95KkMwklU", "subject": "Maths", "orig_tag": "Circles"},
    {"url": "https://www.youtube.com/watch?v=mE8w2uxm6XY", "subject": "Maths", "orig_tag": "Conic Sections"},
    {"url": "https://www.youtube.com/watch?v=UsHUxG90f_4", "subject": "Maths", "orig_tag": "Limits & Derivatives"}
]

# Note: The user pointed out that some of my previous guesses were wrong.
# I will use a lookup table to fix them before generating the final JSON.
SUBJECT_FIXES = {
    "THREE-DIMENSIONAL GEOMETRY": "Maths",
    "CONTINUITY & METHOD OF DIFFERENTIABILITY": "Maths",
    "MOTION IN A STRAIGHT LINE": "Physics",
    "KTG & THERMODYNAMICS": "Physics",
    "MOTION IN A PLANE": "Physics",
    "LAWS OF MOTION": "Physics",
    "ROTATIONAL MOTION": "Physics",
    "Sequence & Series": "Maths",
    "Quadratic Equations": "Maths",
    "Trigonometric Equation": "Maths",
    "TRIGONOMETRIC FUNCTIONS": "Maths",
    "RELATIONS & FUNCTIONS": "Maths",
    "Complex Numbers": "Maths",
    "OSCILLATIONS": "Physics",
    "GRAVITATION": "Physics",
    "Mechanical Properties of Solids": "Physics"
}

def get_video_info(url):
    try:
        res = subprocess.run(
            ["yt-dlp", "--print", "%(title)s@@@%(duration)s", url],
            capture_output=True, text=True, check=True
        )
        parts = res.stdout.strip().split('@@@')
        if len(parts) == 2:
            title = parts[0]
            duration_sec = int(parts[1]) if parts[1].isdigit() else 0
            return title, duration_sec
    except Exception as e:
        print(f"Error for {url}: {e}")
    return None, 0

def clean_title(title):
    # Remove clicking tags
    t = title.split(" in One Shot")[0].split(" in 1 Shot")[0].split(" in one Shot")[0]
    t = t.split(" |")[0].split(" ||")[0].split(":")[0].strip()
    t = t.replace("FULL CHAPTER", "").replace("in 1 shot", "").replace("in one shot", "").strip()
    return t

def get_best_subject(title, default_sub):
    upper_title = title.upper()
    for key, sub in SUBJECT_FIXES.items():
        if key.upper() in upper_title:
            return sub
    return default_sub

processed_goals = []
for item in raw_data:
    title, duration_sec = get_video_info(item['url'])
    if not title:
        continue
    
    ct = clean_title(title)
    sub = get_best_subject(ct, item['subject'])
    hours = round(float(duration_sec) / 3600.0, 1)
    
    processed_goals.append({
        "raw_title": title,
        "chapterDisplay": ct,
        "subjectName": sub,
        "link": item['url'],
        "durationHours": hours
    })
    print(f"Fetched: {ct} ({sub}) - {hours}h")

# Define Progressive ROADMAP Sequence (Interleaved)
# This sequence ensures dependencies (e.g. Basic Maths first)
roadmap_sequence = [
    "BASIC MATHEMATICS", # Maths
    "BASIC MATHS & UNIT/DIMENSIONS", # Physics
    "QUADRATIC EQUATIONS", # Maths
    "MOTION IN A STRAIGHT LINE", # Physics
    "MOLE CONCEPT", # Chem
    "ATOMIC STRUCTURE", # Chem
    "TRIGONOMETRIC FUNCTIONS", # Maths
    "TRIGONOMETRIC EQUATION", # Maths
    "TRIGONOMETRY", # (User orig tag)
    "MOTION IN A PLANE", # Physics
    "LAWS OF MOTION", # Physics
    "PERIODIC TABLE", # Chem
    "CHEMICAL BONDING", # Chem
    "WORK, POWER & ENERGY", # Physics
    "Sequence & Series", # Maths
    "REDOX REACTIONS", # Chem
    "IUPAC NOMENCLATURE", # Chem
    "GOC", # Chem
    "ISOMERISM", # Chem
    "HYDROCARBONS", # Chem
    "GRAVITATION", # Physics
    "BINOMIAL THEOREM", # Maths
    "PERMUTATION & COMBINATIONS", # Maths
    "STRAIGHT LINES", # Maths
    "CIRCLE", # Maths
    "HYPERBOLA", # Maths (Conic)
    "RELATIONS & FUNCTIONS", # Maths
    "CONTINUITY & METHOD OF DIFFERENTIABILITY", # Maths
    "LIMITS", # Maths
    "ROTATIONAL MOTION", # Physics
    "MECHANICAL PROPERTIES OF SOLIDS", # Physics
    "OSCILLATIONS", # Physics
    "KTG & THERMODYNAMICS", # Physics
    "IONIC EQUILIBRIUM", # Chem
    "THERMODYNAMICS", # Chem
    "THREE-DIMENSIONAL GEOMETRY" # Maths
]

# Map processed goals to roadmap
final_goals = []
# Create a dictionary for easy lookup
lookup = {}
for g in processed_goals:
    lookup[g['chapterDisplay'].upper()] = g

# Some titles might be substrings or variations, let's do soft matching
def find_goal(name):
    un = name.upper()
    if un in lookup: return lookup[un]
    for key in lookup:
        if un in key or key in un:
            return lookup[key]
    return None

ordered_list = []
for name in roadmap_sequence:
    goal = find_goal(name)
    if goal:
        ordered_list.append(goal)
        # Remove from lookup to avoid duplicates
        key_to_del = None
        for k in lookup:
            if lookup[k] == goal:
                key_to_del = k
                break
        if key_to_del: del lookup[key_to_del]

# Add any remaining (if any)
for g in lookup.values():
    ordered_list.append(g)

# Assign Days (approx 8 hours per day)
current_day = 1
current_day_hours = 0
max_hours_per_day = 8.5

for i, g in enumerate(ordered_list):
    if current_day_hours + g['durationHours'] > max_hours_per_day and current_day_hours > 4:
        current_day += 1
        current_day_hours = 0
    
    g['day'] = f"Day {current_day}"
    g['id'] = f"backlog_day_{current_day}_{i}"
    g['title'] = f"{g['subjectName']} - {g['chapterDisplay']}"
    g['target'] = 1
    g['current'] = 0
    g['unit'] = "one-shot"
    g['completed'] = False
    g['isPlannerGoal'] = True
    g['sequence'] = i + 1
    g['createdAt'] = None
    
    current_day_hours += g['durationHours']

# Save
with open('planner_goals.json', 'w') as f:
    json.dump(ordered_list, f, indent=4)

print(f"Successfully generated roadmap with {current_day} days.")
