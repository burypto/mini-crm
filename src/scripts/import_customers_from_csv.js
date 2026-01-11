/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { sequelize, Customer } = require('../models');

function normalizePhone(phone) {
  if (!phone) return null;
  
 
  let cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('0')) {
    
    cleaned = '9' + cleaned;
  } else if (!cleaned.startsWith('90')) {
   
    cleaned = '90' + cleaned;
  }
  
  return cleaned || null;
}

function cleanName(name) {
  if (!name) return '';
 
  let cleaned = name.replace(/[.,'":;!?()\[\]{}“”„‟/\\-]/g, ' ').trim();
  
  return cleaned
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function validateEmail(email) {
  if (!email) return null;
  const trimmed = email.trim().toLowerCase();
 
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(trimmed) ? trimmed : null;
}

async function main() {
  const csvPath = path.resolve(__dirname, '..', 'data', 'customers.csv');

  if (!fs.existsSync(csvPath)) {
    console.error('CSV bulunamadı:', csvPath);
    process.exit(1);
  }

  const raw = fs.readFileSync(csvPath, 'utf8');
  const records = parse(raw, { columns: true, skip_empty_lines: true, trim: true });

  let inserted = 0, failed = 0;
  const errors = [];

  for (const [idx, r] of records.entries()) {
    try {
      let firstName = cleanName(r.first_name || r.firstName || '');
      let lastName = cleanName(r.last_name || r.lastName || '');
      
      if (!firstName && lastName) {
        firstName = lastName;
        lastName = null;
      }

      if (!firstName) {
        firstName = 'Bilinmeyen';
      }

      const email = validateEmail(r.email);
      const phone = normalizePhone(r.phone);

     
      if (phone) {
        const existing = await Customer.findOne({ where: { phone } });
        if (existing) {
          console.log(`Atlandı (Duplicate): ${firstName} - ${phone}`);
          continue;
        }
      }

      await Customer.create({
        firstName,
        lastName: lastName || null,
        phone,
        email,
        address: (r.address || '').trim() || null,
        isActive: true
      });

      inserted++;
    } catch (e) {
      failed++;
      errors.push({ row: idx + 2, message: e.message });
    }
  }

  console.log('--- ETL SONUÇ RAPORU ---');
  console.log('Başarıyla Aktarılan:', inserted);
  console.log('Hatalı/Eksik Kayıt:', failed);
  
  await sequelize.close();
}

main().catch(async (e) => {
  console.error(e);
  try { await sequelize.close(); } catch {}
  process.exit(1);
});
