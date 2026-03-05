import json
import math

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

interleaved = []
max_len = max(len(maths_chapters), len(chemistry_chapters), len(physics_chapters))
for i in range(max_len):
    if i < len(maths_chapters): interleaved.append({"subject": "Maths", "chapter": maths_chapters[i]})
    if i < len(chemistry_chapters): interleaved.append({"subject": "Chemistry", "chapter": chemistry_chapters[i]})
    if i < len(physics_chapters): interleaved.append({"subject": "Physics", "chapter": physics_chapters[i]})

goals = []
sequence = 1

# Let's generate goals for exactly 180 days.
# Every day has Lakshya 2027 tasks.
for day in range(1, 181):
    lakshya_goal = {
        "chapterDisplay": "Daily Live Classes & Homework",
        "subjectName": "Lakshya 2027 (Class 12th)",
        "link": None,
        "durationHours": 5.0, # 2-3 classes + homework
        "day": f"Day {day}",
        "id": f"goal_lakshya_{day}",
        "title": f"Lakshya 2027 - Daily Classes",
        "target": 4,
        "current": 0,
        "unit": "tasks",
        "subtopics": ["Physics Class", "Chemistry Class", "Maths Class", "DPP & Revision"],
        "completed": False,
        "isPlannerGoal": True,
        "sequence": sequence,
        "createdAt": None
    }
    goals.append(lakshya_goal)
    sequence += 1

# Spread the 66 backlog chapters across the 180 days.
# We have 66 chapters to distribute over 180 days -> about 1 chapter every ~2.7 days.
for i, item in enumerate(interleaved):
    day = math.floor((i / len(interleaved)) * 179) + 1
    
    subtopics = ["Video", "Module", "Question Practice"]
    if item["subject"] == "Physics":
        subtopics = ["Video", "HC Verma", "Module"]
        
    goal = {
        "chapterDisplay": item["chapter"],
        "subjectName": item["subject"] + " (11th Backlog)",
        "link": None,
        "durationHours": 3.0,
        "day": f"Day {day}",
        "id": f"goal_backlog_{sequence}",
        "title": f"{item['subject']} - {item['chapter']}",
        "target": len(subtopics),
        "current": 0,
        "unit": "tasks",
        "subtopics": subtopics,
        "completed": False,
        "isPlannerGoal": True,
        "sequence": sequence,
        "createdAt": None
    }
    goals.append(goal)
    sequence += 1

# Sort goals by day then by sequence
def extract_day(g):
    return int(g["day"].replace("Day ", ""))

goals.sort(key=lambda g: (extract_day(g), g["sequence"]))

# Fix sequence numbering
for idx, goal in enumerate(goals):
    goal["sequence"] = idx + 1

with open("planner_goals.json", "w") as f:
    json.dump(goals, f, indent=4)
print("Updated planner_goals.json for Lakshya 2027 + Backlog.")
