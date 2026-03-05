import re
import json
import uuid

raw_text = """Math S. No. Batch Name Subject Sub- Subject Chapter Name Topic Lecture Number Date Faculty Name
1 11th JEE Restart 2026 Mathematics Mathematics Basic Mathematics Number Line & Wavy Curve 1 Friday, January 23, 2026 Tarun Khandelwal Sir
2 11th JEE Restart 2026 Mathematics Mathematics Basic Mathematics Inequalities 2 Wednesday, January 28, 2026 Tarun Khandelwal Sir
3 11th JEE Restart 2026 Mathematics Mathematics Basic Mathematics Modulus Equation & Inequation 3 Thursday, January 29, 2026 Tarun Khandelwal Sir
4 11th JEE Restart 2026 Mathematics Mathematics Basic Mathematics Logarithm 4 Friday, January 30, 2026 Tarun Khandelwal Sir
5 11th JEE Restart 2026 Mathematics Mathematics Basic Mathematics Logarithm 5 Wednesday, February 4, 2026 Tarun Khandelwal Sir
6 11th JEE Restart 2026 Mathematics Mathematics Quadratic Equations Reducible to Quadratic 1 Thursday, February 5, 2026 Tarun Khandelwal Sir
7 11th JEE Restart 2026 Mathematics Mathematics Quadratic Equations
Relation between roots & Coefficients,
completing the square 2 Friday, February 6, 2026 Tarun Khandelwal Sir
8 11th JEE Restart 2026 Mathematics Mathematics Quadratic Equations Graphs 3 Wednesday, February 11, 2026 Tarun Khandelwal Sir
9 11th JEE Restart 2026 Mathematics Mathematics Quadratic Equations Location of Roots 4 Thursday, February 12, 2026 Tarun Khandelwal Sir
10 11th JEE Restart 2026 Mathematics Mathematics Trignometry Graphs & Allied Angles 1 Friday, February 13, 2026 Tarun Khandelwal Sir
11 11th JEE Restart 2026 Mathematics Mathematics Trignometry Basic Identities 2 Tuesday, February 17, 2026 Tarun Khandelwal Sir
12 11th JEE Restart 2026 Mathematics Mathematics Trignometry Extra Formulas 3 Wednesday, February 18, 2026 Tarun Khandelwal Sir
13 11th JEE Restart 2026 Mathematics Mathematics Trignometry
Trignometric Equations & General
Solutions 4 Thursday, February 19, 2026 Tarun Khandelwal Sir
14 11th JEE Restart 2026 Mathematics Mathematics Sequence & Series AP, GP, HP 1 Friday, February 20, 2026 Tarun Khandelwal Sir
15 11th JEE Restart 2026 Mathematics Mathematics Sequence & Series Infinte GP & AGP 2 Tuesday, February 24, 2026 Tarun Khandelwal Sir
16 11th JEE Restart 2026 Mathematics Mathematics Sequence & Series
Series & AM & GM, AM & GM
Inequality 3 Wednesday, February 25, 2026 Tarun Khandelwal Sir
18 11th JEE Restart 2026 Mathematics Mathematics Straight Lines Equations of Lines, Slopes 1 Thursday, February 26, 2026 Tarun Khandelwal Sir
19 11th JEE Restart 2026 Mathematics Mathematics Straight Lines
Angle between lines, perpendicular
distance of a point from a line 2 Friday, February 27, 2026 Tarun Khandelwal Sir
20 11th JEE Restart 2026 Mathematics Mathematics Straight Lines Locus, Centres of Circles 3 Tuesday, March 3, 2026 Tarun Khandelwal Sir
21 11th JEE Restart 2026 Mathematics Mathematics Straight Lines Image & Foot of Perpendicular 4 Thursday, March 5, 2026 Tarun Khandelwal Sir
22 11th JEE Restart 2026 Mathematics Mathematics Circles Equation of Circles 1 Friday, March 6, 2026 Tarun Khandelwal Sir
23 11th JEE Restart 2026 Mathematics Mathematics Conic Section Parabola Standard Equations 1 Wednesday, March 11, 2026 Tarun Khandelwal Sir
24 11th JEE Restart 2026 Mathematics Mathematics Conic Section Ellipse standard equations 2 Thursday, March 12, 2026 Tarun Khandelwal Sir
25 11th JEE Restart 2026 Mathematics Mathematics Conic Section Hyperbola standard equations 3 Friday, March 13, 2026 Tarun Khandelwal Sir
26 11th JEE Restart 2026 Mathematics Mathematics
Permutations and
Combinations Permutation Basics 1 Wednesday, March 18, 2026 Tarun Khandelwal Sir
27 11th JEE Restart 2026 Mathematics Mathematics
Permutations and
Combinations Combination Basics 2 Thursday, March 19, 2026 Tarun Khandelwal Sir
28 11th JEE Restart 2026 Mathematics Mathematics
Permutations and
Combinations Groups, Inclusion Exclusion 3 Friday, March 20, 2026 Tarun Khandelwal Sir
29 11th JEE Restart 2026 Mathematics Mathematics
Permutations and
Combinations Beggar's Method & Dearrangement 4 Wednesday, March 25, 2026 Tarun Khandelwal Sir
30 11th JEE Restart 2026 Mathematics Mathematics Sets
Subsets, Cardinal Number, Cartesian
product 1 Thursday, March 26, 2026 Tarun Khandelwal Sir
31 11th JEE Restart 2026 Mathematics Mathematics Derivatives
Differentiation, product rule, division
rule and chain rule 1 Thursday, March 26, 2026 Tarun Khandelwal Sir
Physics S. No. Batch Name Subject Sub-Subject Chapter Name Topic Lecture Number Date Faculty Name
1 11th JEE Restart 2026 Physics Physics Units, Dimensions & Vectors Physical quantities, SI units 1 Wednesday, January 21, 2026 Saleem Ahmad Sir
2 11th JEE Restart 2026 Physics Physics Units, Dimensions & Vectors
Dimensional analysis, Scalars & vectors 2 Tuesday, January 27, 2026 Saleem Ahmad Sir
3 11th JEE Restart 2026 Physics Physics Units, Dimensions & Vectors vector resolution 3 Wednesday, January 28, 2026 Saleem Ahmad Sir
4 11th JEE Restart 2026 Physics Physics Kinematics Motion in 1D & 2D 1 Monday, February 2, 2026 Saleem Ahmad Sir
5 11th JEE Restart 2026 Physics Physics Kinematics Graphs (x–t, v–t, a–t) 2 Tuesday, February 3, 2026 Saleem Ahmad Sir
6 11th JEE Restart 2026 Physics Physics Kinematics
Relative motion
Projectile motion 3 Wednesday, February 4, 2026 Saleem Ahmad Sir
7 11th JEE Restart 2026 Physics Physics Laws of motion Newton’s laws 1 Monday, February 9, 2026 Saleem Ahmad Sir
8 11th JEE Restart 2026 Physics Physics Laws of motion Free body diagrams 2 Tuesday, February 10, 2026 Saleem Ahmad Sir
9 11th JEE Restart 2026 Physics Physics Laws of motion
Friction
Circular motion basics 3 Wednesday, February 11, 2026 Saleem Ahmad Sir
10 11th JEE Restart 2026 Physics Physics Work, energy and power Work–energy theorem 1 Monday, February 16, 2026 Saleem Ahmad Sir
11 11th JEE Restart 2026 Physics Physics Work, energy and power
Conservative & non-conservative
forces 2 Tuesday, February 17, 2026 Saleem Ahmad Sir
12 11th JEE Restart 2026 Physics Physics Work, energy and power
Potential energy
Power & efficiency 3 Wednesday, February 18, 2026 Saleem Ahmad Sir
13 11th JEE Restart 2026 Physics Physics Centre of Mass & Rotational Motion
Centre of mass,
Torque 1 Monday, February 23, 2026 Saleem Ahmad Sir
14 11th JEE Restart 2026 Physics Physics Centre of Mass & Rotational Motion
Angular momentum (intro),
Rolling motion (basic level) 2 Tuesday, February 24, 2026 Saleem Ahmad Sir
15 11th JEE Restart 2026 Physics Physics Rotational Motion Moment of Inertia 1 Wednesday, February 25, 2026 Saleem Ahmad Sir
16 11th JEE Restart 2026 Physics Physics Rotational Motion
Torque & Angular Momentum,
Rotational Kinematics 2 Monday, March 2, 2026 Saleem Ahmad Sir
17 11th JEE Restart 2026 Physics Physics Rotational Motion
Work, Power & Energy in Rotation,
Rolling Motion 3 Tuesday, March 3, 2026 Saleem Ahmad Sir
18 11th JEE Restart 2026 Physics Physics Gravitation Newton’s law of gravitation 1 Monday, March 9, 2026 Saleem Ahmad Sir
19 11th JEE Restart 2026 Physics Physics Gravitation
Gravitational field & potential,
Satellites (basics) 2 Tuesday, March 10, 2026 Saleem Ahmad Sir
20 11th JEE Restart 2026 Physics Physics Mechanical Properties of Solids Elasticity 1 Thursday, March 12, 2026 Saleem Ahmad Sir
21 11th JEE Restart 2026 Physics Physics Fluid mechanics Viscosity & surface tension 1 Friday, March 13, 2026 Saleem Ahmad Sir
22 11th JEE Restart 2026 Physics Physics Thermal Properties of Matter Temperature & heat transfer 1 Monday, March 16, 2026 Saleem Ahmad Sir
23 11th JEE Restart 2026 Physics Physics Thermodynamics & Kinetic Theory
Laws of thermodynamics
Ideal gas equation
Kinetic interpretation of temperature
 RMS, average & most probable speed 1 Tuesday, March 17, 2026 Saleem Ahmad Sir
24 11th JEE Restart 2026 Physics Physics Oscillations
Equation of SHM,
Displacement–Velocity–Acceleration
relations 1 Thursday, March 19, 2026 Saleem Ahmad Sir
25 11th JEE Restart 2026 Physics Physics Oscillations
Time period of: Mass–spring system
and Simple pendulum,
Energy in SHM (KE, PE, Total energy)
Maximum velocity & acceleration,
Phase and phase difference 2 Friday, March 20, 2026 Saleem Ahmad Sir
26 11th JEE Restart 2026 Physics Physics Waves
Wave equation & wave speed
Superposition of waves
Standing waves
Nodes & antinodes
1 Monday, March 23, 2026 Saleem Ahmad Sir
27 11th JEE Restart 2026 Physics Physics Waves
Harmonics in: Stretched string and
Open & closed organ pipes
Doppler effect 2 Tuesday, March 24, 2026 Saleem Ahmad Sir
Inorganic S. No. Batch Name Subject Sub- Subject Chapter Name Topic Lecture Number Date Faculty Name
1 11th JEE Restart 2026 Chemistry Inorganic Chemistry Classification of Elements and Periodicity in
Properties Trends (size, IE) 1 Thursday, February 5, 2026 Kunwar Om Pandey Sir
2 11th JEE Restart 2026 Chemistry Inorganic Chemistry Classification of Elements and Periodicity in
Properties Trends (EA, EN) 2 Friday, February 6, 2026 Kunwar Om Pandey Sir
3 11th JEE Restart 2026 Chemistry Inorganic Chemistry Classification of Elements and Periodicity in
Properties Valency & oxidation state 3 Monday, February 9, 2026 Kunwar Om Pandey Sir
4 11th JEE Restart 2026 Chemistry Inorganic Chemistry Chemical Bonding and Molecular Structure Ionic & covalent bonding 1 Tuesday, February 10, 2026 Kunwar Om Pandey Sir
5 11th JEE Restart 2026 Chemistry Inorganic Chemistry Chemical Bonding and Molecular Structure VSEPR theory 2 Thursday, February 12, 2026 Kunwar Om Pandey Sir
6 11th JEE Restart 2026 Chemistry Inorganic Chemistry Chemical Bonding and Molecular Structure Hybridization 3 Friday, February 13, 2026 Kunwar Om Pandey Sir
7 11th JEE Restart 2026 Chemistry Inorganic Chemistry Chemical Bonding and Molecular Structure Molecular shape 4 Monday, February 16, 2026 Kunwar Om Pandey Sir
Organic S. No. Batch Name Subject Sub- Subject Chapter Name Topic Lecture Number Date Faculty Name 1 11th JEE Restart 2026 Chemistry Organic Chemistry Some Basic principles and Techniques
(IUPAC Naming) IUPAC nomenclature
1 Friday, March 6, 2026 Rohit Agarwal Sir
2 11th JEE Restart 2026 Chemistry Organic Chemistry Some Basic principles and Techniques
(IUPAC Naming) IUPAC nomenclature
2 Monday, March 9, 2026 Rohit Agarwal Sir
3 11th JEE Restart 2026 Chemistry Organic Chemistry Some Basic principles and Techniques
(GOC) Inductive
1 Tuesday, March 10, 2026 Rohit Agarwal Sir
4 11th JEE Restart 2026 Chemistry Organic Chemistry Some Basic principles and Techniques
(GOC) resonance
2 Wednesday, March 11, 2026 Rohit Agarwal Sir
5 11th JEE Restart 2026 Chemistry Organic Chemistry Some Basic principles and Techniques
(GOC) resonance
3 Monday, March 16, 2026 Rohit Agarwal Sir
6 11th JEE Restart 2026 Chemistry Organic Chemistry Some Basic principles and Techniques
(GOC) hyperconjugation
4 Tuesday, March 17, 2026 Rohit Agarwal Sir
7 11th JEE Restart 2026 Chemistry Organic Chemistry Some Basic principles and Techniques
(Isomerism) Isomerism
1 Wednesday, March 18, 2026 Rohit Agarwal Sir
8 11th JEE Restart 2026 Chemistry Organic Chemistry Some Basic principles and Techniques
(Isomerism) Isomerism
2 Monday, March 23, 2026 Rohit Agarwal Sir
9 11th JEE Restart 2026 Chemistry Organic Chemistry Some Basic principles and Techniques
(Isomerism) Isomerism
3 Tuesday, March 24, 2026 Rohit Agarwal Sir
10 11th JEE Restart 2026 Chemistry Organic Chemistry Hydrocarbon
Alkanes Alkene Alkynes Reaction mechanism basics
1 Wednesday, March 25, 2026 Rohit Agarwal Sir
Physical chem S. No. Batch Name Subject Sub- Subject Chapter Name Topic Lecture Number Date Faculty Name
1 11th JEE Restart 2026 Chemistry Physical Chemistry Some Basic Concepts of Chemistry Mole, molar mass 1 Tuesday, January 27, 2026 Faisal Razaq Sir
2 11th JEE Restart 2026 Chemistry Physical Chemistry Some Basic Concepts of Chemistry Limiting reagent 2 Thursday, January 29, 2026 Faisal Razaq Sir
3 11th JEE Restart 2026 Chemistry Physical Chemistry Some Basic Concepts of Chemistry Percentage composition 3 Friday, January 30, 2026 Faisal Razaq Sir
4 11th JEE Restart 2026 Chemistry Physical Chemistry Structure of Atom Bohr model Quantum numbers 1 Monday, February 2, 2026 Faisal Razaq Sir
5 11th JEE Restart 2026 Chemistry Physical Chemistry Structure of Atom Electronic configuration 2 Tuesday, February 3, 2026 Faisal Razaq Sir
6 11th JEE Restart 2026 Chemistry Physical Chemistry Thermodynamics Enthalpy 1 Thursday, February 19, 2026 Faisal Razaq Sir
7 11th JEE Restart 2026 Chemistry Physical Chemistry Thermodynamics Entropy 2 Friday, February 20, 2026 Faisal Razaq Sir
8 11th JEE Restart 2026 Chemistry Physical Chemistry Thermodynamics Hess law
Gibbs free energy 3 Monday, February 23, 2026 Faisal Razaq Sir
9 11th JEE Restart 2026 Chemistry Physical Chemistry Redox Reaction
Balancing of Redox Reaction Types of Redox Reaction Concept of N-Factor Valency Factor Law of Equivalence
1 Thursday, February 26, 2026 Faisal Razaq Sir
10 11th JEE Restart 2026 Chemistry Physical Chemistry Equilibrium Law of mass action 1 Friday, February 27, 2026 Faisal Razaq Sir
11 11th JEE Restart 2026 Chemistry Physical Chemistry Equilibrium Equilibrium constant 2 Monday, March 2, 2026 Faisal Razaq Sir
12 11th JEE Restart 2026 Chemistry Physical Chemistry Equilibrium
pH, buffer (basic)
3 Thursday, March 5, 2026 Faisal Razaq Sir
"""

known_chapters = [
    # Maths
    "Basic Mathematics", "Quadratic Equations", "Trignometry", "Sequence & Series", "Straight Lines", "Circles", "Conic Section", "Permutations and Combinations", "Sets", "Derivatives",
    # Physics
    "Units, Dimensions & Vectors", "Kinematics", "Laws of motion", "Work, energy and power", "Centre of Mass & Rotational Motion", "Rotational Motion", "Gravitation", "Mechanical Properties of Solids", "Fluid mechanics", "Thermal Properties of Matter", "Thermodynamics & Kinetic Theory", "Oscillations", "Waves",
    # Chem
    "Classification of Elements and Periodicity in Properties", "Chemical Bonding and Molecular Structure",
    "Some Basic principles and Techniques (IUPAC Naming)", "Some Basic principles and Techniques (GOC)", "Some Basic principles and Techniques (Isomerism)", "Hydrocarbon Alkanes Alkene Alkynes", "Hydrocarbon",
    "Some Basic Concepts of Chemistry", "Structure of Atom", "Thermodynamics", "Redox Reaction", "Equilibrium"
]

records = []
current_record = ""

lines = raw_text.splitlines()
for i in range(min(5, len(lines))):
    print(f"Line {i}:", repr(lines[i]))

for line in lines:
    line = line.strip()
    if not line:
        continue
    # A new record starts with a number followed by "11th JEE"
    if re.match(r'^\d+\s+11th JEE', line):
        if current_record:
            records.append(current_record)
        current_record = line
    else:
        # Ignore headers
        if "S. No." in line or line.startswith("Inorganic") or line.startswith("Organic") or line.startswith("Physical"):
            continue
        if current_record:
            current_record += " " + line

if current_record:
    records.append(current_record)

print(f"Total raw records found: {len(records)}")

chapter_targets = {}

for rec in records:
    subject_match = re.search(r'11th JEE Restart 2026\s+(Mathematics Mathematics|Physics Physics|Chemistry (?:Organic|Inorganic|Physical) Chemistry)', rec)
    if not subject_match:
        print("Failed Subject Match:", rec[:60])
        continue
        
    subject_raw = subject_match.group(1)
    if "Mathematics" in subject_raw:
        subject = "Maths"
    elif "Physics" in subject_raw:
        subject = "Physics"
    elif "Organic" in subject_raw:
        subject = "Organic Chemistry"
    elif "Inorganic" in subject_raw:
        subject = "Inorganic Chemistry"
    elif "Physical" in subject_raw:
        subject = "Physical Chemistry"
    else:
        subject = "Other"
        
    lec_match = re.search(r'\s+(\d+)\s+(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),\s+(?:January|February|March)\s+\d{1,2},\s+2026', rec)
    if not lec_match:
        print(f"Failed to find lecture number in: {rec}")
        continue
        
    lecture_num = int(lec_match.group(1))
    
    start_idx = subject_match.end()
    end_idx = lec_match.start()
    middle_text = rec[start_idx:end_idx].strip()
    
    chapter = ""
    for kc in sorted(known_chapters, key=len, reverse=True):
        if middle_text.startswith(kc):
            chapter = kc
            break
            
    if not chapter:
        print(f"Unknown chapter for: {middle_text}")
        chapter = middle_text
        
    key = f"{subject} - {chapter}"
    if key not in chapter_targets:
        chapter_targets[key] = lecture_num
    else:
        chapter_targets[key] = max(chapter_targets[key], lecture_num)

goals = []
sequence_counter = 1

for title, target in chapter_targets.items():
    subject_name, chapter_name = title.split(' - ', 1)
    friendly_id = f"planner_{subject_name.lower().replace(' ', '_')}_{re.sub(r'[^a-zA-Z0-9]', '_', chapter_name.lower())}"
    
    goals.append({
        "id": friendly_id,
        "title": title,
        "target": target,
        "current": 0,
        "unit": "lectures",
        "completed": False,
        "isPlannerGoal": True,
        "sequence": sequence_counter,
        "createdAt": None # Will be populated by JS
    })
    sequence_counter += 1

with open("planner_goals.json", "w") as f:
    json.dump(goals, f, indent=4)
    
print(f"Successfully constructed {len(goals)} goals from raw text.")
