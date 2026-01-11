const { Customer, sequelize } = require('../src/models');
const logger = require('../src/lib/logger');

const dirtyData = [
  {
    first: 'fatma nur',
    last: 'yilmaz',
    phone: '+90 (532) 111 2233',
    email: 'fatma@mail.com',
    city: 'Adana'
  },
  { first: '', last: 'Doğan', phone: '532-111-2233', email: 'dogan@mail.com', city: 'Bursa' }, // Adı boş
  { first: 'Elif', last: null, phone: '1112233', email: 'elif@mail.com', city: 'İstanbul' }, // Soyadı boş, tel eksik
  { first: 'Ali', last: 'Öztürk', phone: '+90 555 444 3322', email: null, city: null },
  {
    first: 'Ali',
    last: 'Ozturk',
    phone: '+90 555 444 3322',
    email: 'ali.ozturk@mail.com',
    city: null
  } 
];


function normalizePhone(phone) {
  if (!phone) return null;
  let cleaned = phone.replace(/\D/g, ''); 
  if (cleaned.startsWith('0')) cleaned = '9' + cleaned; 
  if (cleaned.length === 10) cleaned = '90' + cleaned; 
  return cleaned;
}

async function runImport() {
  try {
    await sequelize.authenticate();
    console.log('--- Veri Aktarımı Başladı ---');

    for (const data of dirtyData) {
      const cleanPhone = normalizePhone(data.phone);

      
      const existing = await Customer.findOne({ where: { phone: cleanPhone } });

      if (existing) {
        logger.warn(`Atlanıyor: ${cleanPhone} zaten kayıtlı.`);
        continue;
      }

      await Customer.create({
        firstName: data.first || 'İsimsiz', 
        lastName: data.last || '',
        phone: cleanPhone,
        email: data.email,
        address: data.city,
        isActive: true
      });

      logger.info(`Eklendi: ${data.first} ${data.last}`);
    }

    console.log('--- Veri Aktarımı Tamamlandı ---');
    process.exit(0);
  } catch (err) {
    logger.error('Aktarım hatası:', err);
    process.exit(1);
  }
}

runImport();
