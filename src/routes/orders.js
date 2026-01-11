const express = require('express');
const router = express.Router();
const orderService = require('../services/orderService');
const logger = require('../lib/logger');

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Tüm siparişleri listeler
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Sipariş listesi
 */
router.get('/', async (req, res, next) => {
  try {
    const orders = await orderService.listOrders();
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Yeni sipariş oluşturur (Stok kontrollü)
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Sipariş başarıyla oluşturuldu
 *       400:
 *         description: Yetersiz stok veya geçersiz müşteri
 */
router.post('/', async (req, res, next) => {
  try {
    const order = await orderService.createOrder(req.body);
    res.status(201).json(order);
  } catch (err) {
    if (err.message === 'Müşteri bulunamadı.') {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
});


router.get('/:id', async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    res.json(order);
  } catch (err) {
    if (err.message === 'Sipariş bulunamadı.') {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
});


router.patch('/:id/status', async (req, res, next) => {
  try {
    const updated = await orderService.updateOrderStatus(req.params.id, req.body.status);
    res.json(updated);
  } catch (err) {
    if (err.message === 'Sipariş bulunamadı.') {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
});

module.exports = router;
