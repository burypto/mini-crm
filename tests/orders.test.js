process.env.NODE_ENV = 'test';
process.env.DB_STORAGE = './test_db.sqlite';
process.env.LOG_LEVEL = 'error';

const request = require('supertest');
const app = require('../src/app');
const { sequelize, Customer, Order } = require('../src/models');

describe('Sipariş API Testleri', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterEach(async () => {
    await Order.destroy({ where: {}, truncate: true });
    await Customer.destroy({ where: {}, truncate: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('POST /api/orders -> Geçerli müşteri ile sipariş oluşturulmalı', async () => {
    const customer = await Customer.create({ firstName: 'Test', email: 'test@mail.com' });

    const res = await request(app).post('/api/orders').send({
      customerId: customer.id,
      items: []
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.customerId).toBe(customer.id);
  });

  test('POST /api/orders -> Olmayan müşteri ile hata vermeli', async () => {
    const res = await request(app).post('/api/orders').send({
      customerId: 999,
      totalAmount: 50
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Müşteri bulunamadı.');
  });

  test('GET /api/orders -> Siparişler listelenmeli', async () => {
    const customer = await Customer.create({ firstName: 'Test' });
    await Order.create({ customerId: customer.id, totalAmount: 200 });

    const res = await request(app).get('/api/orders');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].customer).toBeDefined();
  });
});
