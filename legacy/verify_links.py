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

for link in links:
    try:
        res = subprocess.run(
            ["yt-dlp", "--print", "%(title)s", link],
            capture_output=True, text=True, check=True
        )
        title = res.stdout.strip()
        print(f"{link} -> {title}")
    except Exception as e:
        print(f"Error fetching title for {link}: {e}")
