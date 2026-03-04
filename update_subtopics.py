import json

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

# Create interleaved order
interleaved = []
max_len = max(len(maths_chapters), len(chemistry_chapters), len(physics_chapters))

for i in range(max_len):
    if i < len(maths_chapters):
        interleaved.append({"subject": "Maths", "chapter": maths_chapters[i]})
    if i < len(chemistry_chapters):
        interleaved.append({"subject": "Chemistry", "chapter": chemistry_chapters[i]})
    if i < len(physics_chapters):
        interleaved.append({"subject": "Physics", "chapter": physics_chapters[i]})

# Generate goals without fetching videos.
# Subtopics for Physics: Video, HC Verma, Module
# Subtopics for Maths/Chem: Video, Module, Question Practice

goals = []
sequence = 1
current_day = 1
item_count_in_day = 0

for item in interleaved:
    # 2 chapters per day roughly
    if item_count_in_day >= 2:
        current_day += 1
        item_count_in_day = 0

    subtopics = ["Video", "Module", "Question Practice"]
    if item["subject"] == "Physics":
        subtopics = ["Video", "HC Verma", "Module"]
        
    goal = {
        "chapterDisplay": item["chapter"],
        "subjectName": item["subject"],
        "link": None,
        "durationHours": 3.0, # Dummy duration, effectively 6 hours per day with 2 chapters
        "day": f"Day {current_day}",
        "id": f"backlog_day_{current_day}_{sequence}",
        "title": f"{item['subject']} - {item['chapter']}",
        "target": len(subtopics),  # 3 tasks per chapter
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
    item_count_in_day += 1

with open("planner_goals.json", "w") as f:
    json.dump(goals, f, indent=4)

print(f"Finished! Total chapters: {len(goals)}. Total days: {current_day}")
