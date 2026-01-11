const fs = require('fs');
const path = require('path');

const csvPath = path.resolve(__dirname, '..', 'data', 'customers.csv');
const raw = fs.readFileSync(csvPath, 'utf8');
const lines = raw.split('\n');
const header = lines[0];
const dataLines = lines.slice(1).filter(line => line.trim() !== '');

function generateRandomPhone() {
  const secondDigit = Math.floor(Math.random() * 6) + 3; 
  let rest = '';
  for (let i = 0; i < 8; i++) {
    rest += Math.floor(Math.random() * 10);
  }
  return `905${secondDigit}${rest}`;
}

const usedPhones = new Set();
const newDataLines = dataLines.map(line => {
  const parts = line.split(',');
  let randomPhone = generateRandomPhone();
  while (usedPhones.has(randomPhone)) {
    randomPhone = generateRandomPhone();
  }
  usedPhones.add(randomPhone);
  
  
  parts[2] = randomPhone;
  return parts.join(',');
});

fs.writeFileSync(csvPath, [header, ...newDataLines].join('\n'));
console.log('CSV telefon numaraları rastgele ve benzersiz numaralarla güncellendi.');
