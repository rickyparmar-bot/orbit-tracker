import json
import subprocess
import os

PLAYLIST_URL = "https://youtube.com/playlist?list=PLMttXSB2G2YNyx0wpKMcGo4VQNmQPZGek"

# Queries for specific subjects based on user request
CHEMISTRY_QUERIES = {
    "planner_physical_chemistry_some_basic_concepts_of_chemistry": "Mole Concept Faisal Sir PW One Shot",
    "planner_physical_chemistry_structure_of_atom": "Structure of Atom Faisal Sir PW One Shot",
    "planner_physical_chemistry_thermodynamics": "Thermodynamics Faisal Sir PW One Shot",
    "planner_physical_chemistry_equilibrium": "Chemical Equilibrium Faisal Sir PW One Shot",
    # Ionic equilibrium is usually part of Equilibrium or separate
    "planner_physical_chemistry_redox_reaction": "Redox Reactions Faisal Sir PW One Shot",
    
    # Inorganic Chemistry (Om Pandey Sir)
    "planner_inorganic_chemistry_trends__size__ie_": "Periodic Table Om Pandey Sir PW One Shot",
    "planner_inorganic_chemistry_chemical_bonding_and_molecular_structure": "Chemical Bonding Om Pandey Sir PW One Shot",
    
    # Organic Chemistry (Rohit Agarwal Sir)
    "planner_organic_chemistry_iupac_nomenclature": "IUPAC Nomenclature Rohit Agarwal Sir PW One Shot",
    "planner_organic_chemistry_inductive": "GOC General Organic Chemistry Rohit Agarwal Sir PW One Shot",
    "planner_organic_chemistry_hydrocarbon": "Hydrocarbons Rohit Agarwal Sir PW One Shot"
}

PHYSICS_PREFIX = "Saleem Sir PW One Shot "

def get_youtube_id(query):
    try:
        res = subprocess.run(
            ["yt-dlp", f"ytsearch1:{query}", "--get-id"],
            capture_output=True, text=True, check=True
        )
        vid = res.stdout.strip()
        if vid:
            return f"https://youtu.be/{vid}"
    except Exception as e:
        print(f"Error searching for {query}: {e}")
    return None

def get_playlist_videos(url):
    try:
        res = subprocess.run(
            ["yt-dlp", "--flat-playlist", "--print", "%(title)s|%(id)s", url],
            capture_output=True, text=True, check=True
        )
        videos = []
        for line in res.stdout.strip().split('\n'):
            if '|' in line:
                title, vid = line.split('|', 1)
                videos.append({"title": title, "link": f"https://youtu.be/{vid}"})
        return videos
    except Exception as e:
        print(f"Error fetching playlist: {e}")
        return []

def main():
    with open('planner_goals.json', 'r') as f:
        goals = json.load(f)
        
    # Get playlist videos for Maths
    maths_vids = get_playlist_videos(PLAYLIST_URL)
    
    for goal in goals:
        subject = goal['id']
        title = goal['title']
        
        link = None
        if "Maths" in title and maths_vids:
            # Simple substring matching for maths chapters
            search_name = title.split(' - ')[-1].lower()
            for vid in maths_vids:
                if search_name.split()[0] in vid['title'].lower():
                    link = vid['link']
                    break
            # Fallback for Maths
            if not link:
                link = get_youtube_id(f"{search_name} CBSE Class 11 Maths One Shot PW")
        elif "Physics" in title:
            search_name = title.split(' - ')[-1]
            link = get_youtube_id(PHYSICS_PREFIX + search_name)
        elif subject in CHEMISTRY_QUERIES:
            link = get_youtube_id(CHEMISTRY_QUERIES[subject])
            
        if link:
            goal['link'] = link
            print(f"[{title}] -> Found Link: {link}")
        else:
            print(f"[{title}] -> No link found.")

    with open('planner_goals_linked.json', 'w') as f:
        json.dump(goals, f, indent=4)
        
    print("Done generating planner_goals_linked.json")

if __name__ == '__main__':
    main()
