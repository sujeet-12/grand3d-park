const fs = require('fs');
const code = fs.readFileSync('src/App.tsx', 'utf8');
const lines = code.split('\n');
lines.forEach((line, index) => {
  if (line.includes('ClockTower') || line.includes('clock') || line.includes('Clock')) {
    console.log(`${index + 1}: ${line.trim()}`);
  }
});
