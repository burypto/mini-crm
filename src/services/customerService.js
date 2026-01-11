const { Customer } = require('../models');
const logger = require('../lib/logger');

async function listCustomers() {
  return Customer.findAll({ limit: 50, order: [['createdAt', 'DESC']] });
}


async function createCustomer(payload) {
  logger.info('Yeni müşteri oluşturuluyor...', { phone: payload.phone });

  if (payload.phone) {
    
    const existing = await Customer.findOne({ where: { phone: payload.phone } });
    if (existing) {
      throw new Error('Bu telefon numarasıyla kayıtlı bir müşteri zaten var.');
    }
  }
  return Customer.create(payload);
}


async function getCustomerById(id) {
  const customer = await Customer.findByPk(id);
  if (!customer) {
    throw new Error('Müşteri bulunamadı.');
  }
  return customer;
}


async function updateCustomer(id, payload) {
  const customer = await getCustomerById(id);
  await customer.update(payload);
  return customer;
}

async function deleteCustomer(id) {
  const customer = await getCustomerById(id);
 
  await customer.update({ isActive: false });
  return { message: 'Müşteri silindi (pasife alındı).' };
}

module.exports = {
  listCustomers,
  createCustomer,
  getCustomerById,
  updateCustomer,
  deleteCustomer
};
