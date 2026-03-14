const fs = require('fs');
const path = require('path');

console.log("🚀 Arcapush SYSTEM AUDIT [Arcapush 2.0]");
console.log("-----------------------------------------------");

const filesToCheck = [
  { name: 'app/globals.css', critical: true },
  { name: 'app/layout.tsx', critical: true },
  { name: 'tailwind.config.ts', critical: true },
  { name: 'postcss.config.js', critical: false },
  { name: 'postcss.config.mjs', critical: false },
  { name: 'package.json', critical: true }
];

// 1. Check File Existence
filesToCheck.forEach(file => {
  if (fs.existsSync(path.join(process.cwd(), file.name))) {
    console.log(`✅ FOUND: ${file.name}`);
  } else {
    console.log(`${file.critical ? '❌ MISSING (CRITICAL):' : '⚠️  MISSING:'} ${file.name}`);
  }
});

// 2. Audit tailwind.config.ts Content Paths
if (fs.existsSync('tailwind.config.ts')) {
  const config = fs.readFileSync('tailwind.config.ts', 'utf8');
  if (config.includes('./src/')) {
    console.log("❌ CONFIG ERROR: Your config still looks for './src/', but your files are in root './app/'.");
  } else if (config.includes('./app/')) {
    console.log("✅ CONFIG OK: Tailwind is looking in the root './app/' folder.");
  }
}

// 3. Audit globals.css for Directives
if (fs.existsSync('app/globals.css')) {
  const css = fs.readFileSync('app/globals.css', 'utf8');
  if (css.includes('@tailwind')) {
    console.log("✅ CSS OK: @tailwind directives are present.");
  } else {
    console.log("❌ CSS ERROR: Your globals.css is missing the @tailwind directives!");
  }
}

console.log("-----------------------------------------------");
console.log("👉 FIX THE ❌ ITEMS, PUSH, AND REDEPLOY WITHOUT CACHE.");