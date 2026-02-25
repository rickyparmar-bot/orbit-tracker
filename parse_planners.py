import os
import re
import json
import subprocess

def parse_pdf_to_json(pdf_dir, output_file):
    goals = []
    
    # Check if the directory exists
    if not os.path.exists(pdf_dir):
        print(f"Error: Directory '{pdf_dir}' not found.")
        return

    # Sort filenames so the sequence is deterministic (e.g., Chemistry, Maths, Physics)
    filenames = sorted(os.listdir(pdf_dir))
    sequence_counter = 1

    for filename in filenames:
        if not filename.endswith('.pdf'):
            continue
            
        pdf_path = os.path.join(pdf_dir, filename)
        subject_name = filename.replace(' Lecture Planner.pdf', '').replace('.pdf', '')
        
        try:
            # Run pdftotext with -layout to preserve column formatting
            result = subprocess.run(
                ['pdftotext', '-layout', pdf_path, '-'], 
                capture_output=True, text=True, check=True
            )
            text = result.stdout
        except subprocess.CalledProcessError as e:
            print(f"Error processing {filename}: {e}")
            continue
        except FileNotFoundError:
             print("Error: pdftotext is not installed. Please install poppler-utils.")
             return

        # Dictionary to keep track of total lectures per chapter
        chapter_lectures = {}
        
        # Parse lines
        lines = text.split('\n')
        
        # Determine column structure from header if possible, but hardcoding based on typical layout is easier for this static format
        # Typical layout:
        # S.No (0-8), Batch Name (9-33), Subject (34-45), Sub-Subject (46-60), Chapter Name (61-100), Topic (101-140), Lecture Number (141-150), Date (151-180), Faculty Name (180+)
        
        current_chapter = ""
        
        for line in lines:
            line_stripped = line.strip()
            # Skip empty lines, headers, or lines without data
            if not line_stripped or 'S. No.' in line_stripped or 'Batch Name' in line_stripped:
                continue
                
            # If the line appears to be data (contains a number at the start or is indented)
            # We can use simple substring parsing based on the fixed-width output of `pdftotext -layout`
            
            # The Lecture number is typically a 1 or 2 digit number bordered by many spaces, appearing right before the Date.
            # E.g. "...  1      Thursday, February 26, 2026"
            # We can find it by looking for a digit followed by a lot of spaces and then a Day of week
            match = re.search(r'\s{2,}(\d+)\s{2,}(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)', line)
            
            if match:
                lecture_num_str = match.group(1)
                
                # Check if this line actually contains the chapter name.
                # If there are multiple words separated by large spaces before the lecture number:
                prefix = line[:match.start()]
                parts = [p.strip() for p in re.split(r'\s{2,}', prefix.strip()) if p.strip()]
                
                # If it's a full row, parts will be like: ['1', '11th JEE Restart 2026', 'Physics', 'Physics', 'Units, Dimensions & Vectors', 'Physical quantities, SI units']
                chapter_name = ""
                
                if len(parts) >= 2:
                    # Look for the chapter name. usually it's the 5th item if S.No is present, or 4th if not.
                    # We know subject is 'Physics' etc.
                    for i in range(len(parts)-1, -1, -1):
                        part = parts[i]
                        # Discard 'Physics', 'Maths', 'Chemistry', etc.
                        if part.lower() not in ['physics', 'chemistry', 'maths', 'organic chemistry', 'inorganic chemistry', 'physical chemistry', '11th jee restart 2026']:
                            if not part.isdigit():
                                chapter_name = part
                                # The piece right before the topic is usually the chapter, but some rows only have topic list
                                # If the row has "11th JEE Restart", it's a primary row and contains the chapter name.
                                if '11th JEE' in line:
                                    # Chapter is the 2nd to last text block before Topic
                                    if len(parts) >= 5:
                                        if '11th' in parts[0]:
                                            chapter_name = parts[3]
                                        else:
                                            chapter_name = parts[4]
                                break
                
                if chapter_name and '11th JEE' in line:
                    current_chapter = chapter_name
                    
                chapter_to_save = current_chapter if current_chapter else chapter_name
                
                if chapter_to_save:
                    try:
                        lecture_num = int(lecture_num_str)
                        if chapter_to_save not in chapter_lectures:
                            chapter_lectures[chapter_to_save] = lecture_num
                        else:
                            chapter_lectures[chapter_to_save] = max(chapter_lectures[chapter_to_save], lecture_num)
                    except ValueError:
                        pass
                        
        # Create goal objects
        for chapter, max_lectures in chapter_lectures.items():
            if max_lectures > 0:
                goals.append({
                    "id": f"planner_{subject_name.lower().replace(' ', '_')}_{re.sub(r'[^a-zA-Z0-9]', '_', chapter.lower())}",
                    "title": f"{subject_name} - {chapter}",
                    "target": max_lectures,
                    "current": 0,
                    "unit": "lectures",
                    "completed": False,
                    "isPlannerGoal": True,
                    "sequence": sequence_counter,
                    "createdAt": None # Will be set by app.js on load
                })
                sequence_counter += 1
                
    # Save to JSON
    with open(output_file, 'w') as f:
        json.dump(goals, f, indent=4)
        
    print(f"Successfully parsed {len(goals)} goals to {output_file}")

if __name__ == "__main__":
    parse_pdf_to_json('PLANNAR', 'planner_goals.json')
