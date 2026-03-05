import json
import subprocess
import time

maths_chapters = [
    "Quadratic Equations", "Sequence and Series", "Trigonometric Functions",
    "Binomial Theorem", "Permutations and Combinations", "Matrices and Determinants",
    "Straight Lines", "Circles", "Conic Sections (Parabola, Ellipse, Hyperbola)",
    "Complex Numbers", "Sets, Relations & Functions", "Inverse Trigonometric Functions",
    "Limits, Continuity and Differentiability", "Method of Differentiation (MOD)",
    "Application of Derivatives (AOD)", "Indefinite Integration", "Definite Integration",
    "Application of Integrals (Area Under Curve)", "Differential Equations",
    "Vector Algebra", "Three Dimensional Geometry (3D)", "Probability", "Statistics"
]

chemistry_chapters = [
    "Mole Concept", "Atomic Structure", "Chemical Thermodynamics", "Chemical & Ionic Equilibrium",
    "Solutions", "Electrochemistry", "Chemical Kinetics", "Periodic Table", "Chemical Bonding",
    "Coordination Compounds", "P-Block", "D & F Block", "Metallurgy", "Salt Analysis (Qualitative Analysis)",
    "IUPAC Nomenclature", "GOC (General Organic Chemistry)", "Isomerism", "Hydrocarbons",
    "Haloalkanes & Haloarenes", "Alcohols, Phenols & Ethers", "Aldehydes, Ketones & Carboxylic Acids",
    "Amines", "Biomolecules"
]

physics_chapters = [
    "Units, Dimensions and Vectors", "Kinematics (1D & 2D Motion)", "Laws of Motion (NLM) & Friction",
    "Work, Energy and Power", "Circular Motion", "Center of Mass & Collision", "Rotational Mechanics",
    "Gravitation", "Properties of Solids & Fluids", "Thermal Properties, KTG & Thermodynamics",
    "Oscillations (SHM) & Waves", "Electrostatics (Fields, Potential, Gauss Law)", "Capacitance",
    "Current Electricity", "Magnetic Effects of Current & Magnetism", "Electromagnetic Induction (EMI) & AC",
    "Ray Optics & Optical Instruments", "Wave Optics", "Modern Physics (Dual Nature, Atoms, Nuclei)",
    "Semiconductors & Communication Systems"
]

all_chapters = []
for c in maths_chapters:
    all_chapters.append({"subject": "Maths", "chapter": c})
for c in chemistry_chapters:
    all_chapters.append({"subject": "Chemistry", "chapter": c})
for c in physics_chapters:
    all_chapters.append({"subject": "Physics", "chapter": c})

def fetch_youtube_data(subject, chapter):
    query = f"JEE one shot {subject} {chapter}"
    print(f"Searching for: {query}")
    try:
        res = subprocess.run(
            ["yt-dlp", f"ytsearch1:{query}", "--print", "%(title)s@@@%(duration)s@@@%(webpage_url)s"],
            capture_output=True, text=True, check=True
        )
        parts = res.stdout.strip().split('@@@')
        if len(parts) >= 3:
            title = parts[0]
            duration_sec = int(parts[1]) if parts[1].isdigit() else 7200
            url = parts[2]
            return url, duration_sec
    except Exception as e:
        print(f"Failed: {e}")
    return "", 7200

# To save time, let's interleave them directly
interleaved = []
max_len = max(len(maths_chapters), len(chemistry_chapters), len(physics_chapters))

for i in range(max_len):
    if i < len(maths_chapters):
        interleaved.append({"subject": "Maths", "chapter": maths_chapters[i]})
    if i < len(chemistry_chapters):
        interleaved.append({"subject": "Chemistry", "chapter": chemistry_chapters[i]})
    if i < len(physics_chapters):
        interleaved.append({"subject": "Physics", "chapter": physics_chapters[i]})

goals = []
current_day = 1
current_day_hours = 0
sequence = 1

for item in interleaved:
    url, duration_sec = fetch_youtube_data(item["subject"], item["chapter"])
    hours = round(float(duration_sec) / 3600.0, 1)
    
    # ensure it's at least > 1 to be realistic for a one shot, mostly just to handle bad yt-dlp parsings
    if hours < 1:
        hours = 2.5
        
    if current_day_hours + hours > 6.5 and current_day_hours > 2:
        current_day += 1
        current_day_hours = 0
        
    goal = {
        "chapterDisplay": item["chapter"],
        "subjectName": item["subject"],
        "link": url,
        "durationHours": hours,
        "day": f"Day {current_day}",
        "id": f"backlog_day_{current_day}_{sequence}",
        "title": f"{item['subject']} - {item['chapter']}",
        "target": 1,
        "current": 0,
        "unit": "one-shot",
        "completed": False,
        "isPlannerGoal": True,
        "sequence": sequence,
        "createdAt": None
    }
    goals.append(goal)
    sequence += 1
    current_day_hours += hours

with open("planner_goals.json", "w") as f:
    json.dump(goals, f, indent=4)

print(f"Finished! Total chapters: {len(goals)}. Total days: {current_day}")
