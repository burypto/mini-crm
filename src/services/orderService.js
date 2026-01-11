const { Order, Customer, Product, OrderItem, sequelize } = require('../models');
const logger = require('../lib/logger');

async function listOrders() {
  return Order.findAll({
    include: [
      { model: Customer, as: 'customer' },
      { model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] }
    ],
    order: [['createdAt', 'DESC']]
  });
}

async function createOrder(payload) {
  const { customerId, guestInfo, items } = payload;

  const t = await sequelize.transaction();

  try {
    let targetCustomerId = customerId;


    if (!customerId && guestInfo) {
      const guest = await Customer.create(
        {
          firstName: guestInfo.firstName || 'Misafir',
          lastName: guestInfo.lastName || 'Müşteri',
          phone: guestInfo.phone,
          email: guestInfo.email,
          address: guestInfo.address,
          isActive: false
        },
        { transaction: t }
      );
      targetCustomerId = guest.id;
    } else {
      const customer = await Customer.findByPk(customerId);
      if (!customer) {
        throw new Error('Müşteri bulunamadı.');
      }
    }

    let totalAmount = 0;
    const order = await Order.create(
      {
        customerId: targetCustomerId,
        status: 'pending',
        totalAmount: 0
      },
      { transaction: t }
    );

    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) throw new Error(`Ürün bulunamadı: ${item.productId}`);

     
      if (product.trackStock && product.stockQuantity < item.quantity) {
        throw new Error(`Yetersiz stok: ${product.name}`);
      }

      
      if (product.trackStock) {
        await product.update(
          { stockQuantity: product.stockQuantity - item.quantity },
          { transaction: t }
        );
      }

      await OrderItem.create(
        {
          orderId: order.id,
          productId: product.id,
          quantity: item.quantity,
          unitPrice: product.price
        },
        { transaction: t }
      );

      totalAmount += product.price * item.quantity;
    }

    await order.update({ totalAmount }, { transaction: t });
    await t.commit();

    return getOrderById(order.id);
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

async function getOrderById(id) {
  const order = await Order.findByPk(id, {
    include: [
      { model: Customer, as: 'customer' },
      { model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] }
    ]
  });
  if (!order) {
    throw new Error('Sipariş bulunamadı.');
  }
  return order;
}

async function updateOrderStatus(id, status) {
  const order = await getOrderById(id);
  await order.update({ status });
  return order;
}

module.exports = {
  listOrders,
  createOrder,
  getOrderById,
  updateOrderStatus
};
