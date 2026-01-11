process.env.NODE_ENV = 'test';
process.env.DB_STORAGE = './test_db.sqlite';
process.env.LOG_LEVEL = 'error';

const request = require('supertest');
const app = require('../src/app');
const { sequelize, Customer } = require('../src/models');

describe('Müşteri API Testleri', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterEach(async () => {
    await Customer.destroy({ where: {}, truncate: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('POST /api/customers -> Mükerrer telefon engellenmeli', async () => {
    await request(app).post('/api/customers').send({
      firstName: 'Ali',
      phone: '905321112233'
    });

    const res = await request(app).post('/api/customers').send({
      firstName: 'Veli',
      phone: '905321112233'
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/telefon numarasıyla/i);
  });

  test('PUT /api/customers/:id -> Müşteri güncellenmeli', async () => {
    const createRes = await request(app)
      .post('/api/customers')
      .send({ firstName: 'Veli', lastName: 'Eski' });
    const id = createRes.body.id;

    const res = await request(app).put(`/api/customers/${id}`).send({ lastName: 'Yeni' });

    expect(res.statusCode).toBe(200);
    expect(res.body.lastName).toBe('Yeni');
  });

  test('DELETE /api/customers/:id -> Soft Delete yapılmalı', async () => {
    const createRes = await request(app)
      .post('/api/customers')
      .send({ firstName: 'Sil', isActive: true });
    const id = createRes.body.id;

    const res = await request(app).delete(`/api/customers/${id}`);
    expect(res.statusCode).toBe(200);

    const check = await Customer.findByPk(id);
    expect(check.isActive).toBe(false);
  });
});
