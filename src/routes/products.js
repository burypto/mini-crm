const express = require('express');
const router = express.Router();
const { Product } = require('../models');

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Tüm ürünleri listeler
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Ürün listesi
 */
router.get('/', async (req, res, next) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) { next(err); }
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Yeni ürün oluşturur
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               sku: { type: string }
 *               price: { type: number }
 *               stockQuantity: { type: integer }
 *     responses:
 *       201:
 *         description: Ürün oluşturuldu
 */
router.post('/', async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) { next(err); }
});

/**
 * @swagger
 * /api/products/{id}/stock:
 *   patch:
 *     summary: Ürün stok miktarını günceller
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity: { type: integer }
 *     responses:
 *       200:
 *         description: Stok güncellendi
 */
router.patch('/:id/stock', async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Ürün bulunamadı' });
    
    product.stockQuantity = req.body.quantity;
    await product.save();
    res.json(product);
  } catch (err) { next(err); }
});

module.exports = router;
