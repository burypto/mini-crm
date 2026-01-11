const { Customer, sequelize } = require('../src/models');
const logger = require('../src/lib/logger');


const excelData = [
  { ad: 'Ahmet', soyad: 'Yılmaz', tel: '+90 532 111 22 33', email: 'ahmet.yilmaz@mail.com' },
  { ad: 'Mehmet Ali', soyad: null, tel: '05321112233', email: null }, 
  { ad: 'Ayşe', soyad: 'KARA', tel: '5321112233', email: 'ayse.kara@mail' }, 
  { ad: 'fatma nur', soyad: 'yilmaz', tel: '+90 (532) 111 2233', email: 'fatma@mail.com' },
  { ad: '', soyad: 'Doğan', tel: '532-111-2233', email: 'dogan@mail.com' }, 
  { ad: 'Ali', soyad: 'Öztürk', tel: '+90 555 444 3322', email: null },
  { ad: 'Ali', soyad: 'Ozturk', tel: '+90 555 444 3322', email: 'ali.ozturk@mail.com' } 
];

function cleanPhone(phone) {
  if (!phone) return null;
  let cleaned = phone.replace(/\D/g, ''); 
  if (cleaned.startsWith('0')) cleaned = '9' + cleaned;
  if (cleaned.length === 10) cleaned = '90' + cleaned;
  return cleaned;
}

async function startETL() {
  try {
    await sequelize.sync(); 
    console.log('--- ETL Başladı ---');

    for (const row of excelData) {
      const normalizedPhone = cleanPhone(row.tel);

      
      const existing = await Customer.findOne({ where: { phone: normalizedPhone } });
      if (existing && normalizedPhone) {
        console.warn(`[UYARI] Duplicate Kayıt Atlandı: ${row.ad} (${normalizedPhone})`);
        continue;
      }

      await Customer.create({
        firstName: row.ad.trim() || 'İsimsiz',  
        lastName: row.soyad,
        phone: normalizedPhone,
        email: row.email,
        isActive: true
      });
      console.log(`[OK] Eklendi: ${row.ad}`);
    }
    console.log('--- ETL Tamamlandı ---');
  } catch (err) {
    console.error('Hata:', err);
  } finally {
    process.exit();
  }
}

startETL();
