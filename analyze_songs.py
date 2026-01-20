import os
import json

# Path to images
img_dir = r"c:\Users\mathe\Documents\CODES 2025\Portifolio\img\songs-cover"

# List files
files = os.listdir(img_dir)
webp_files = [f for f in files if f.endswith('.webp')]

# Album covers from script.js (I will populate this manually based on what I saw)
album_covers_in_code = [
      "A Garota de Neon e Nuvem", "A Saga do Zé Bodim", "A Teoria do Chão",
      "A vida é ou não é o que é", "Abyssborne", "Aftershock",
      "Almost Is Not a Game", "Amanhã Eu Salvo o Mundo", "Aquário de Estrelas",
      "B-Sides & Rarities", "Blue Noise in My Bones", "Brasil, Aqui Tudo É Normal",
      "Cassette Tape Summer", "Castelo de Areia (Antes da Maré)", "Celestial Whisper",
      "Chasing the Neon Gold", "Concrete & Ivy", "Confetti in the Dark",
      "Dreamcatcher’s Paradox", "Dust Mote Ballet",
      "Echoes of the Rising", "Echoes of the West (Stone & Fire)", "ERROR 404_ YOUTH",
      "Even in Ash, The Heartsong Sings", "Exploding Hearts",
      "Fire from the Mountain (Prometheus Unbound)", "Furacão de All Star",
      "Garota Sonhadora", "Glitch in the Gold", "Golden Resonance",
      "Gravity & Dust (The Weight of Us)", "Half-life Of You", "If you ever come back here",
      "Into the Eye", "Iron Boulevards", "JOMO (Joy of Missing Out)", "Kingdom of this Broken Girl",
      "Lantern of the Lost", "Laplace’s Demon (The Glitch in the Math)", "Luminous Threads",
      "Meteoros Apaixonados", "Moonlight in My Bones", "O Astrounauta de Quintal",
      "O Céu Também Sorri", "O Mundo Ficou Pequeno Demais Para Mim", "Off the Scales",
      "Overclocked (Into the Zone)", "Pajama Couture", "Paper Hearts & Gasoline Vibe",
      "Paper Lanterns (The Echo of Us)", "Paper Satellites", "Por Acaso (Você Chegou)",
      "Prism of the Rain (Niji no Kakera)", "Requiem For A Lier", "Running Forward",
      "Saturated", "Scriptless (The Misfit Musical)", "Starve the Dark, Feed the Fire",
      "Static & Gold", "Static Blue", "Stitched in the Quiet", "The Architect of Zero",
      "The Armor I Built", "The Art of Falling Up", "The Choir Inside the Black Hole",
      "The Clockwork Galaxy", "The Clockwork Renegade", "The Demons Wearing my Name",
      "The Eternal Game", "The Ghost of the Midnight Rail",
      "The Girl Who Rewrote the Moon (Legend of the Ink)", "The Gravity of Sparks",
      "The Ink of Goodbye (Sayonara no Ink)", "The Last Analog Heart",
      "The Lost & Found Department Vibe", "The Midnight Carousel",
      "The Person I'd Be If No One Was Watching", "The Prism Thief (Painting the Grey)",
      "The River That Remembered", "The Shape of Falling Light", "The Single Stitch Society",
      "The Unmapped Shore", "The Zero-Effort Hero", # Note: I might have missed some or added some, checking against file list
      "Theseus in My Skin", "Velocity of Light", "Velvet & Voltage",
      "Você deveria largar o League of Legends", "What Happened to Gen Z",
      "Wild Electric", "World in Slow Motion",
      "ノイズの海、酸素の花 (Noizu no Umi, Sanso no Hana)"
]

# Clean up code list (trimming just in case)
album_covers_in_code = [x.strip() for x in album_covers_in_code]

# Normalize function
def normalize(name):
    return name.lower().replace("'", "").replace("’", "").replace(" ", "").strip()

print(f"Total files in dir: {len(webp_files)}")
print(f"Total in code: {len(album_covers_in_code)}")

missing_in_code = []
for f in webp_files:
    name_no_ext = f.replace('.webp', '')
    if name_no_ext not in album_covers_in_code:
         # Double check with normalization to be sure it's not just a minor mismatch
         # But the user wants 'identical naming', so maybe strict check is better?
         # Let's list it if it's not an exact match
         missing_in_code.append(name_no_ext)

print("\n--- Missing in Code (Potential New Songs) ---")
for m in missing_in_code:
    print(f"'{m}'")

print("\n--- Inspecting 'Moonlight in My Bones' ---")
found = False
for f in webp_files:
    if "Moonlight" in f and "Bones" in f:
        print(f"Found on disk: '{f}' (Len: {len(f)})")
        print(f"Bytes: {[ord(c) for c in f]}")
        found = True

if not found:
    print("Moonlight in My Bones NOT found in directory listing!")

print("\n--- Inspecting Code Entry for Moonlight ---")
for c in album_covers_in_code:
    if "Moonlight" in c and "Bones" in c:
        print(f"Found in code: '{c}' (Len: {len(c)})")
        print(f"Bytes: {[ord(char) for char in c]}")

