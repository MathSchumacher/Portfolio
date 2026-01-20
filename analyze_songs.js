const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'img', 'songs-cover');
const files = fs.readdirSync(imgDir);
const webpFiles = files.filter(f => f.endsWith('.webp'));

const albumCoversInCode = [
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
      "The Unmapped Shore", "The Zero-Effort Hero", 
      "Theseus in My Skin", "Velocity of Light", "Velvet & Voltage",
      "Você deveria largar o League of Legends", "What Happened to Gen Z",
      "Wild Electric", "World in Slow Motion",
      "ノイズの海、酸素の花 (Noizu no Umi, Sanso no Hana)"
];

const codeSet = new Set(albumCoversInCode);
const missingInCode = [];

webpFiles.forEach(file => {
    const nameNoExt = file.replace('.webp', '');
    if (!codeSet.has(nameNoExt)) {
        missingInCode.push(nameNoExt);
    }
});

let output = '';
output += `Total files: ${webpFiles.length}\n`;
output += `Total in code: ${albumCoversInCode.length}\n`;
output += '\n--- Missing in Code (New Songs) ---\n';
missingInCode.forEach(song => output += `${song}\n`);

output += '\n--- Inspecting Moonlight in My Bones ---\n';
webpFiles.forEach(f => {
    if (f.includes('Moonlight')) {
        output += `Found file: "${f}"\n`;
        output += `Char codes: ${f.split('').map(c => c.charCodeAt(0)).join(', ')}\n`;
    }
});

output += '\n--- Inspecting Code Entry ---\n';
albumCoversInCode.forEach(c => {
    if (c.includes('Moonlight')) {
        output += `Found in code: "${c}"\n`;
        output += `Char codes: ${c.split('').map(char => char.charCodeAt(0)).join(', ')}\n`;
    }
});

fs.writeFileSync('analysis_result.txt', output);
console.log('Analysis written to analysis_result.txt');
