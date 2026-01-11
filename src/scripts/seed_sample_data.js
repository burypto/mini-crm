const { sequelize, Customer, Product, Order, OrderItem } = require('../models');

async function seed() {
  try {
    await sequelize.sync({ force: true });

    const c1 = await Customer.create({
      firstName: 'Merve',
      lastName: 'Aydın',
      email: 'merve.aydin@example.com',
      phone: '905001112233',
      address: 'İstanbul, Kadıköy'
    });

    const c2 = await Customer.create({
      firstName: 'Caner',
      lastName: 'Özkan',
      email: 'caner.ozkan@example.com',
      phone: '905004445566'
    });

   
    const p1 = await Product.create({
      name: 'Kablosuz Kulaklık',
      sku: 'KULAK-001',
      price: 1250.00,
      stockQuantity: 50,
      trackStock: true
    });

    const p2 = await Product.create({
      name: 'Akıllı Saat',
      sku: 'SAAT-002',
      price: 3500.00,
      stockQuantity: 15,
      trackStock: true
    });

    
    const order = await Order.create({
      customerId: c1.id,
      status: 'preparing',
      totalAmount: 4750.00
    });

    await OrderItem.create({
      orderId: order.id,
      productId: p1.id,
      quantity: 1,
      unitPrice: 1250.00
    });

    await OrderItem.create({
      orderId: order.id,
      productId: p2.id,
      quantity: 1,
      unitPrice: 3500.00
    });

    console.log('Örnek veriler başarıyla eklendi.');
    process.exit(0);
  } catch (error) {
    console.error('Seed hatası:', error);
    process.exit(1);
  }
}

seed();
