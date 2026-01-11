const { Customer, Product, Order, OrderItem, sequelize } = require('../models');
const orderService = require('../services/orderService');

async function main() {
  try {
    
    let customer = await Customer.findOne({ where: { email: 'ahmet.yilmaz@mail.com' } });
    if (!customer) {
      customer = await Customer.create({
        firstName: 'Ahmet',
        lastName: 'Yılmaz',
        email: 'ahmet.yilmaz@mail.com',
        phone: '905321112233'
      });
    }
    console.log('Müşteri Hazır:', customer.firstName, customer.lastName);

    
    const [product] = await Product.findOrCreate({
      where: { sku: 'LAPTOP-001' },
      defaults: {
        name: 'Gaming Laptop',
        price: 45000.0,
        stockQuantity: 10,
        trackStock: true
      }
    });
    console.log('Ürün Hazır:', product.name, '| Stok:', product.stockQuantity);

   
    console.log('\nSipariş oluşturuluyor...');
    const order = await orderService.createOrder({
      customerId: customer.id,
      items: [{ productId: product.id, quantity: 2 }]
    });

    console.log('--- SİPARİŞ ÖZETİ ---');
    console.log('Sipariş ID:', order.id);
    console.log('Müşteri:', order.customer.firstName, order.customer.lastName);
    console.log('Toplam Tutar:', order.totalAmount, 'TL');
    console.log('Durum:', order.status);
    console.log('Kalemler:');
    order.items.forEach((item) => {
      console.log(`- ${item.product.name}: ${item.quantity} adet x ${item.unitPrice} TL`);
    });

    
    const updatedProduct = await Product.findByPk(product.id);
    console.log('\nGüncel Stok Durumu:', updatedProduct.stockQuantity);
  } catch (error) {
    console.error('Hata oluştu:', error.message);
  } finally {
    await sequelize.close();
  }
}

main();
