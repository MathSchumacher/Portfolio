import os

# Paths
base_dir = r'c:\Users\mathe\Documents\CODES 2025\Portifolio'
original_file = os.path.join(base_dir, 'script.js')
part2_file = os.path.join(base_dir, 'script_part2.js')
output_file = os.path.join(base_dir, 'script_fixed.js')

print("Reading original...")
with open(original_file, 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f"Original lines: {len(lines)}")

# Truncate to 1863 lines
clean_lines = lines[:1863]

print("Reading part 2...")
with open(part2_file, 'r', encoding='utf-8') as f:
    part2_content = f.read()

print("Writing fixed file...")
with open(output_file, 'w', encoding='utf-8') as f:
    f.writelines(clean_lines)
    f.write('\n\n')
    f.write(part2_content)

print("SUCCESS: Created script_fixed.js")
