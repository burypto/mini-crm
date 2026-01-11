const express = require('express');
const router = express.Router();
const customerService = require('../services/customerService');

/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Tüm müşterileri listeler
 *     tags: [Customers]
 *     responses:
 *       200:
 *         description: Müşteri listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Customer'
 */
router.get('/', async (req, res, next) => {
  try {
    const customers = await customerService.listCustomers();
    res.json(customers);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/customers:
 *   post:
 *     summary: Yeni müşteri oluşturur
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Customer'
 *     responses:
 *       201:
 *         description: Müşteri başarıyla oluşturuldu
 *       400:
 *         description: Geçersiz veri veya mükerrer kayıt
 */
router.post('/', async (req, res, next) => {
  try {
    const customer = await customerService.createCustomer(req.body);
    res.status(201).json(customer);
  } catch (err) {
    
    if (err.message.includes('zaten var')) {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
});


router.put('/:id', async (req, res, next) => {
  try {
    const updated = await customerService.updateCustomer(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    if (err.message === 'Müşteri bulunamadı.') {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
});


router.delete('/:id', async (req, res, next) => {
  try {
    const result = await customerService.deleteCustomer(req.params.id);
    res.json(result);
  } catch (err) {
    if (err.message === 'Müşteri bulunamadı.') {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
});

module.exports = router;
