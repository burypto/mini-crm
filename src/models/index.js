const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config');

const sequelize = new Sequelize({
  dialect: config.db.dialect,
  storage: config.db.storage,
  logging: config.db.logging ?? false
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Customer = require('./customer')(sequelize, DataTypes);
db.Order = require('./order')(sequelize, DataTypes);
db.Product = require('./product')(sequelize, DataTypes);
db.OrderItem = require('./orderItem')(sequelize, DataTypes);


db.Customer.hasMany(db.Order, { foreignKey: 'customerId', as: 'orders' });
db.Order.belongsTo(db.Customer, { foreignKey: 'customerId', as: 'customer' });

db.Order.hasMany(db.OrderItem, { foreignKey: 'orderId', as: 'items' });
db.OrderItem.belongsTo(db.Order, { foreignKey: 'orderId' });

db.Product.hasMany(db.OrderItem, { foreignKey: 'productId' });
db.OrderItem.belongsTo(db.Product, { foreignKey: 'productId', as: 'product' });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
