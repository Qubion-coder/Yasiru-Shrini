const fs = require('fs');

let content = fs.readFileSync('e:\\QB\\wedding\\yasiru Shrini\\src\\App.tsx', 'utf-8');

const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  // Skip the bg-ink sections which are dark background (lines 527 to 563 approx)
  if (i >= 520 && i <= 565) continue;
  
  lines[i] = lines[i].replace(/text-stone-400/g, 'text-stone-700');
  lines[i] = lines[i].replace(/text-stone-500/g, 'text-stone-800');
  lines[i] = lines[i].replace(/text-stone-600/g, 'text-stone-900');
}

fs.writeFileSync('e:\\QB\\wedding\\yasiru Shrini\\src\\App.tsx', lines.join('\n'));
console.log('Success');
