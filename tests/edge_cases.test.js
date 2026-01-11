const request = require('supertest');
const app = require('../src/app');
const { sequelize, Customer, Product } = require('../src/models');

describe('Edge Case ve Özel Senaryo Testleri', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('Soyadı olmayan müşteri kaydedilebilmeli', async () => {
    const res = await request(app)
      .post('/api/customers')
      .send({
        firstName: 'Ahmet',
        phone: '905001112233'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.lastName).toBeNull();
  });

  test('Stok takibi yapılmayan ürün stok kontrolünü atlamalı', async () => {
    const product = await Product.create({
      name: 'Dijital Eğitim Seti',
      sku: 'DIGI-001',
      price: 100,
      stockQuantity: 0,
      trackStock: false
    });

    const customer = await Customer.create({ firstName: 'Mehmet', phone: '905004445566' });

    const res = await request(app)
      .post('/api/orders')
      .send({
        customerId: customer.id,
        items: [{ productId: product.id, quantity: 5 }]
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('pending');
  });

  test('Misafir siparişi (Müşteri kaydı olmadan) oluşturulabilmeli', async () => {
    const product = await Product.create({
      name: 'Fiziksel Kitap',
      sku: 'BOOK-001',
      price: 50,
      stockQuantity: 10,
      trackStock: true
    });

    const res = await request(app)
      .post('/api/orders')
      .send({
        guestInfo: {
          firstName: 'Misafir',
          lastName: 'Kullanıcı',
          phone: '905550001122',
          address: 'İstanbul, Beşiktaş'
        },
        items: [{ productId: product.id, quantity: 1 }]
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.customerId).toBeDefined(); 
  });
});
