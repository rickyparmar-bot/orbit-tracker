import json
import os
import re
import subprocess
from datetime import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
from google import genai
from google.genai import types

app = FastAPI(title="Orbit Bridge API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
BASE_DIR = os.path.dirname(__file__)
DUMP_DIR = os.path.join(BASE_DIR, 'data')
if not os.path.exists(DUMP_DIR):
    os.makedirs(DUMP_DIR)

STORAGE_FILE = os.path.join(DUMP_DIR, 'tracker_storage.json')
TASKS_FILE = os.path.join(DUMP_DIR, 'tasks.json')
ERRORS_FILE = os.path.join(DUMP_DIR, 'error_log.json')

NOTEBOOK_API_ENDPOINT = "https://notebooklm.google.com/api/v1/..." # Placeholder
SESSION_COOKIE = os.environ.get("NOTEBOOKLM_SESSION", "debug_session")
BEARER_TOKEN = os.environ.get("NOTEBOOKLM_BEARER", "debug_bearer")

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
gemini_client = None
if GEMINI_API_KEY:
    gemini_client = genai.Client(api_key=GEMINI_API_KEY)

# --- Models ---
class TaskItem(BaseModel):
    id: str
    title: str
    completed: bool = False
    details: Optional[str] = None

class TaskUpdateAction(BaseModel):
    action: str
    task: Optional[TaskItem] = None
    tasks: Optional[List[TaskItem]] = None

class TopicRequest(BaseModel):
    topic: str

# --- Helpers ---
def init_files():
    if not os.path.exists(TASKS_FILE):
        with open(TASKS_FILE, 'w', encoding='utf-8') as f:
            json.dump([], f)
    if not os.path.exists(ERRORS_FILE):
        with open(ERRORS_FILE, 'w', encoding='utf-8') as f:
            json.dump([
                {"id": 1, "topic": "Solutions", "trap": "Confusing molality (m) with molarity (M). Molality uses kg of solvent, molarity uses L of solution."},
                {"id": 2, "topic": "Solutions", "trap": "Forgetting that Raoult's Law applies ONLY to ideal solutions. Non-ideal solutions show positive or negative deviations."},
                {"id": 3, "topic": "Solutions", "trap": "Using van't Hoff factor (i) incorrectly: i > 1 for dissociation (NaCl), i < 1 for association (acetic acid in benzene)."},
                {"id": 4, "topic": "Electrochemistry", "trap": "Mixing up cell EMF sign: E°cell = E°cathode − E°anode, NOT the other way round."},
                {"id": 5, "topic": "Electrochemistry", "trap": "Forgetting to balance electrons when using Nernst equation. The 'n' in the equation is number of electrons transferred."},
                {"id": 6, "topic": "Chemical Kinetics", "trap": "Confusing order of reaction with molecularity. Order is experimental, molecularity is theoretical and always a whole number."},
                {"id": 7, "topic": "Chemical Kinetics", "trap": "Using integrated rate law for wrong order. First order: ln[A] vs t is linear, NOT [A] vs t."},
                {"id": 8, "topic": "Coordination Compounds", "trap": "Forgetting that chelate complexes are more stable than non-chelate (chelate effect). EDTA forms 6 bonds."},
                {"id": 9, "topic": "Solid State", "trap": "Confusing FCC (4 atoms/unit cell, CN=12) with BCC (2 atoms/unit cell, CN=8)."},
                {"id": 10, "topic": "Surface Chemistry", "trap": "Mixing up physisorption (weak van der Waals, reversible) with chemisorption (strong chemical bonds, irreversible)."}
            ], f, indent=2)

init_files()

def get_tasks():
    with open(TASKS_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_tasks(tasks):
    with open(TASKS_FILE, 'w', encoding='utf-8') as f:
        json.dump(tasks, f, indent=2)

def notify(title: str, message: str):
    try:
        subprocess.run(['notify-send', title, message], check=True)
    except Exception as e:
        print(f"Notification failed: {e}")

def sanitize_content(content: str) -> str:
    """Uses Gemini to fix scientific spelling and facts."""
    if not gemini_client:
        return content
    try:
        response = gemini_client.models.generate_content(
            model='gemini-2.5-flash',
            contents=f"Correct any scientific spelling errors (e.g., Colegative -> Colligative) in the following text. Do not change the LaTeX formatting or Markdown headers. Return only the corrected text. Text: {content}"
        )
        return response.text
    except Exception as e:
        print(f"Sanitization failed: {e}")
        return content

def parse_notebook_content(content: str):
    """Parses content, groups equations by the nearest preceding markdown header."""
    lines = content.split('\n')
    chapters: Dict[str, List[str]] = {}
    current_chapter = "General Concepts"
    chapters[current_chapter] = []
    
    equation_pattern = r'\$\$(.*?)\$\$|\$([^\$]+)\$'
    header_pattern = r'^(#{1,6}\s+.*)$'

    in_display_math = False
    display_math_buffer = []

    for line in lines:
        header_match = re.match(header_pattern, line)
        if header_match:
            current_chapter = header_match.group(1).replace('#', '').strip()
            if current_chapter not in chapters:
                chapters[current_chapter] = []
            continue

        if '$$' in line:
            parts = line.split('$$')
            for i in range(len(parts)):
                if i > 0:
                    in_display_math = not in_display_math
                    if not in_display_math:
                        chapters[current_chapter].append(" ".join(display_math_buffer).strip())
                        display_math_buffer = []
                elif in_display_math and parts[i].strip():
                   display_math_buffer.append(parts[i])
        elif in_display_math:
            display_math_buffer.append(line)
        else:
            for match in re.finditer(equation_pattern, line):
                eq = match.group(1) if match.group(1) else match.group(2)
                if eq:
                    chapters[current_chapter].append(eq.strip())

    chapters = {k: v for k, v in chapters.items() if v}
    headers = re.findall(header_pattern, content, re.MULTILINE)
    return chapters, headers

def fetch_notebook_data():
    text_content = """
# Solutions — Concentration Terms
$M = \\frac{n_{solute}}{V_{solution}(L)}$
$m = \\frac{n_{solute}}{W_{solvent}(kg)}$
$x_A = \\frac{n_A}{n_A + n_B}$
$\\text{Mass\\%} = \\frac{W_{solute}}{W_{solution}} \\times 100$

# Solutions — Raoult's Law & Colligative Properties
$P_{total} = x_A P_A^\\circ + x_B P_B^\\circ$
$\\frac{P_A^\\circ - P_A}{P_A^\\circ} = x_B$
$\\Delta T_b = i K_b m$
$\\Delta T_f = i K_f m$
$\\pi = iCRT$
$p = K_H \\cdot x$

# Solutions — Van't Hoff Factor
$i = 1 + (n-1)\\alpha$
$i = 1 - \\left(1 - \\frac{1}{n}\\right)\\alpha$
$M_{obs} = \\frac{M_{calc}}{i}$

# Electrochemistry — Cell Potential
$E^\\circ_{cell} = E^\\circ_{cathode} - E^\\circ_{anode}$
$\\Delta G^\\circ = -nFE^\\circ_{cell}$
$E_{cell} = E^\\circ_{cell} - \\frac{RT}{nF}\\ln Q$
$E_{cell} = E^\\circ_{cell} - \\frac{0.0591}{n}\\log Q$

# Electrochemistry — Conductance & Kohlrausch
$\\Lambda_m = \\kappa \\cdot \\frac{1000}{M}$
$\\Lambda_m^\\circ = \\nu_+ \\lambda_+^\\circ + \\nu_- \\lambda_-^\\circ$
$G = \\kappa \\cdot \\frac{A}{l}$

# Chemical Kinetics — Rate Laws
$r = k[A]^n$
$k = Ae^{-E_a/RT}$
$\\ln k = \\ln A - \\frac{E_a}{RT}$
$t_{1/2} = \\frac{0.693}{k}$
$\\ln[A] = \\ln[A]_0 - kt$
$\\frac{1}{[A]} = \\frac{1}{[A]_0} + kt$

# Chemical Kinetics — Activation Energy
$\\log\\frac{k_2}{k_1} = \\frac{E_a}{2.303R}\\left(\\frac{1}{T_1} - \\frac{1}{T_2}\\right)$

# Solid State — Unit Cell
$\\rho = \\frac{ZM}{a^3 N_A}$
$r = \\frac{a}{2}$ (SC)
$r = \\frac{\\sqrt{3}a}{4}$ (BCC)
$r = \\frac{a}{2\\sqrt{2}}$ (FCC)

# Surface Chemistry — Adsorption
$\\frac{x}{m} = kP^{1/n}$
$\\frac{P}{V(P_0 - P)} = \\frac{1}{V_m C} + \\frac{C-1}{V_m C} \\cdot \\frac{P}{P_0}$

# Coordination Compounds
$\\mu = \\sqrt{n(n+2)} \\text{ BM}$
$\\text{CFSE} = -0.4n_{t_{2g}} \\Delta_o + 0.6n_{e_g} \\Delta_o$

# d and f Block Elements
$E^\\circ$ values determine oxidising/reducing power.
Lanthanoid contraction: $\\text{size decreases across } 4f \\text{ series}$

# p-Block Elements
$\\text{Hybridisation} = \\frac{1}{2}[V + M - C + A]$
where V = valence e⁻, M = monovalent atoms, C = cation charge, A = anion charge.

# Haloalkanes & Haloarenes
$\\text{SN1: Rate} = k[\\text{substrate}]$
$\\text{SN2: Rate} = k[\\text{substrate}][\\text{nucleophile}]$

# Alcohols, Phenols & Ethers
Acidity: $\\text{Phenol} > \\text{Water} > \\text{Alcohol}$
Lucas test: 3° (immediate) > 2° (5 min) > 1° (no reaction at RT)

# Aldehydes, Ketones & Carboxylic Acids
$\\text{Nucleophilic addition: } \\text{RCHO} > \\text{R}_2\\text{CO}$
Acid strength: $\\text{RCOOH} > \\text{Phenol} > \\text{ROH}$

# Amines
Basic strength (gas phase): $3^\\circ > 2^\\circ > 1^\\circ > \\text{NH}_3$
Basic strength (aq): $2^\\circ > 1^\\circ > 3^\\circ > \\text{NH}_3$
$K_b = \\frac{[\\text{RNH}_3^+][\\text{OH}^-]}{[\\text{RNH}_2]}$
    """
    return "Class 12 Chemistry — All Chapters", text_content

# --- Routes ---
@app.get("/api/sync")
def sync_notebook():
    try:
        topic, raw_content = fetch_notebook_data()
        clean_content = sanitize_content(raw_content)
        equations_by_chapter, headers = parse_notebook_content(clean_content)
        
        data = {
            "topic_name": topic,
            "timestamp": datetime.now().isoformat(),
            "equations_by_chapter": equations_by_chapter,
            "key_summary": headers,
            "raw_content": clean_content
        }
        
        with open(STORAGE_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
            
        notify("Orbit Sync Success", f"Successfully synced: {topic}")
        return {"success": True, "message": "Sync completed", "data": data}
        
    except Exception as e:
        notify("Orbit Sync Failed", str(e))
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/data")
def get_data():
    if os.path.exists(STORAGE_FILE):
        with open(STORAGE_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {"message": "No data available. Call /api/sync first."}

@app.get("/api/tasks")
def fetch_tasks():
    return {"success": True, "tasks": get_tasks()}

@app.post("/api/tasks/update")
def update_tasks(action_data: TaskUpdateAction):
    action = action_data.action
    task = action_data.task
    tasks = get_tasks()
    
    if action == "add" and task:
        if not any(t['id'] == task.id for t in tasks):
             tasks.append(task.dict())
    elif action == "update" and task:
        for i, t in enumerate(tasks):
            if t['id'] == task.id:
                tasks[i] = task.dict()
                break
    elif action == "delete" and task:
        tasks = [t for t in tasks if t['id'] != task.id]
    elif action == "replace_all" and action_data.tasks is not None:
        tasks = [t.dict() for t in action_data.tasks]
        
    save_tasks(tasks)
    return {"success": True, "tasks": tasks}

@app.get("/api/errors")
def get_errors():
    if os.path.exists(ERRORS_FILE):
        with open(ERRORS_FILE, 'r', encoding='utf-8') as f:
            return {"success": True, "traps": json.load(f)}
    return {"success": True, "traps": []}

@app.post("/api/infographic")
def generate_infographic():
    """Returns a hardcoded Class 12 Chemistry decision flowchart."""
    mermaid_chart = """graph TD
    A["Class 12 Chemistry"] --> B["Physical Chemistry"]
    A --> C["Inorganic Chemistry"]
    A --> D["Organic Chemistry"]
    B --> B1["Solutions"]
    B --> B2["Electrochemistry"]
    B --> B3["Chemical Kinetics"]
    B --> B4["Solid State"]
    B --> B5["Surface Chemistry"]
    B1 --> B1a["Raoult's Law"]
    B1 --> B1b["Colligative Properties"]
    B1b --> B1c{"Solute dissociates?"}
    B1c -->|Yes| B1d["i > 1, use van't Hoff"]
    B1c -->|No| B1e{"Solute associates?"}
    B1e -->|Yes| B1f["i < 1"]
    B1e -->|No| B1g["i = 1, normal"]
    B2 --> B2a["Nernst Equation"]
    B2 --> B2b["Kohlrausch's Law"]
    B3 --> B3a{"Reaction Order?"}
    B3a -->|0th| B3b["t1/2 = A0/2k"]
    B3a -->|1st| B3c["t1/2 = 0.693/k"]
    B3a -->|2nd| B3d["t1/2 = 1/kA0"]
    C --> C1["d & f Block"]
    C --> C2["p-Block Elements"]
    C --> C3["Coordination Compounds"]
    C3 --> C3a["CFT / VBT"]
    C3 --> C3b["Isomerism"]
    D --> D1["Haloalkanes"]
    D --> D2["Alcohols & Phenols"]
    D --> D3["Aldehydes & Ketones"]
    D --> D4["Amines"]
    D1 --> D1a{"SN1 or SN2?"}
    D1a -->|3° substrate| D1b["SN1 mechanism"]
    D1a -->|1° substrate| D1c["SN2 mechanism"]"""
    return {"success": True, "mermaid": mermaid_chart}

@app.post("/api/quiz")
def generate_quiz():
    """Returns quiz covering all Class 12 Chemistry chapters."""
    quiz = [
        {"question": "What is the formula for molality?", "options": ["n / V(L)", "n / W(kg)", "Wsolute / Wsolution × 100", "nA / (nA + nB)"], "answer": 1, "formula": "m = \\frac{n_{solute}}{W_{solvent}(kg)}"},
        {"question": "Nernst equation at 25°C uses which constant?", "options": ["0.0257/n", "0.0591/n", "0.693/k", "RT/nF"], "answer": 1, "formula": "E_{cell} = E^\\circ_{cell} - \\frac{0.0591}{n}\\log Q"},
        {"question": "Half-life of a first order reaction is:", "options": ["[A]₀ / 2k", "0.693 / k", "1 / k[A]₀", "ln2 × k"], "answer": 1, "formula": "t_{1/2} = \\frac{0.693}{k}"},
        {"question": "Density of a unit cell is given by:", "options": ["ZM / a³Nₐ", "a³Nₐ / ZM", "ZNₐ / Ma³", "M / Za³"], "answer": 0, "formula": "\\rho = \\frac{ZM}{a^3 N_A}"},
        {"question": "SN2 reactions occur fastest with:", "options": ["Tertiary substrates", "Secondary substrates", "Primary substrates", "Aromatic substrates"], "answer": 2, "formula": "\\text{SN2: Rate} = k[\\text{substrate}][\\text{nucleophile}]"}
    ]
    return {"success": True, "quiz": quiz}

@app.get("/api/notify")
def deployment_notify():
    notify("Orbit Tracker", "Active Recall Master Deployment Complete")
    return {"success": True}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
