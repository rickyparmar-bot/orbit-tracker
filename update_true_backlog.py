import json
import subprocess

links = [
  "https://www.youtube.com/watch?v=UOzWO2-Z9So",
  "https://www.youtube.com/watch?v=02CBTEOMMsA",
  "https://www.youtube.com/watch?v=pi0bAxOGHIo",
  "https://www.youtube.com/watch?v=VG2KogeWzIY",
  "https://www.youtube.com/watch?v=ub4LDdjCauQ",
  "https://www.youtube.com/watch?v=4ddGqKZIIvs",
  "https://www.youtube.com/watch?v=QS6vOMlhvsc",
  "https://www.youtube.com/watch?v=Ar3TH7MEVTQ",
  "https://www.youtube.com/watch?v=UoJh42eQU8I",
  "https://www.youtube.com/watch?v=bLkVDkaJrTo",
  "https://www.youtube.com/watch?v=6I3mLw30qzQ",
  "https://www.youtube.com/watch?v=WnIszkrdY8Q",
  "https://www.youtube.com/watch?v=QeecXIDYtiw",
  "https://www.youtube.com/watch?v=o8T4ZG08q8g",
  "https://www.youtube.com/watch?v=wHnUniHm3yc",
  "https://www.youtube.com/watch?v=0DgG7LxiYzk",
  "https://www.youtube.com/watch?v=NKth1h8pr7s",
  "https://www.youtube.com/watch?v=bv8qBsHK9bM",
  "https://www.youtube.com/watch?v=JAvi2K_DbbI",
  "https://www.youtube.com/watch?v=FCByCwnj_J0",
  "https://www.youtube.com/watch?v=wE0xrUuJLnk",
  "https://www.youtube.com/watch?v=6HQgDO1trlM",
  "https://www.youtube.com/watch?v=Rh95KkMwklU",
  "https://www.youtube.com/watch?v=mE8w2uxm6XY",
  "https://www.youtube.com/watch?v=UsHUxG90f_4"
]

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

def guess_subject(title):
    t = title.lower()
    if any(k in t for k in ["math", "quadratic", "trigonometry", "sequence", "binomial", "permutation", "straight line", "circle", "conic", "derivative", "function", "relation", "limit", "matrix", "determinant"]):
        return "Maths"
    if any(k in t for k in ["chemistry", "mole", "atomic", "thermodynamics", "equilibrium", "redox", "periodic", "bonding", "iupac", "goc", "isomerism", "hydrocarbon", "orbital", "chemical"]):
        return "Chemistry"
    # Fallback to physics
    return "Physics"

goals_output = []
sequence = 1

for link in links:
    title, duration_sec = get_video_info(link)
    if not title:
        continue
    
    # Clean up title for display
    clean_title = title.split(" in One Shot")[0].split(" in 1 Shot")[0].split(" |")[0].split(" ||")[0].strip()
    subject = guess_subject(title)
    
    hours = round(float(duration_sec) / 3600.0, 1)
    
    goals_output.append({
        "id": f"planner_backlog_{sequence}",
        "title": f"{subject} - {clean_title}",
        "target": 1,
        "current": 0,
        "unit": "one-shot",
        "completed": False,
        "isPlannerGoal": True,
        "sequence": sequence,
        "createdAt": None,
        "link": link,
        "durationHours": hours,
        "chapterDisplay": clean_title,
        "subjectName": subject
    })
    print(f"[{subject}] {clean_title} ({hours}h)")
    sequence += 1

with open('planner_goals.json', 'w') as f:
    json.dump(goals_output, f, indent=4)
    
print("Successfully generated new planner_goals.json")
