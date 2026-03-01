
with open('/home/wizrizz/.gemini/antigravity/playground/static-planetoid/app.js', 'r') as f:
    content = f.read()

open_p = 0
close_p = 0
for i, char in enumerate(content):
    if char == '(':
        open_p += 1
    elif char == ')':
        close_p += 1

print(f"Total Open: {open_p}")
print(f"Total Close: {close_p}")

stack = []
for i, char in enumerate(content):
    if char == '(':
        stack.append(i)
    elif char == ')':
        if stack:
            stack.pop()
        else:
            print(f"Unmatched closing parenthesis at line {content.count('\\n', 0, i)+1}")

if stack:
    for s in stack:
        print(f"Unmatched opening parenthesis at line {content.count('\\n', 0, s)+1}: {content[s:s+50].replace('\\n', ' ')}...")
