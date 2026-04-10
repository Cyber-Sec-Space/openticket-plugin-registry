const crypto = require('crypto');
const fs = require('fs');

if (process.argv.length < 3) {
  console.error("Usage: node hash.js <file_path>");
  process.exit(1);
}

const file = process.argv[2];

if (!fs.existsSync(file)) {
  console.error(`File not found: ${file}`);
  process.exit(1);
}

const content = fs.readFileSync(file, 'utf8');
const hash = crypto.createHash('sha256').update(content).digest('hex');

console.log(hash);
