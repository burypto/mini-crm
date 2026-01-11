module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'Product',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: false },
      sku: { type: DataTypes.STRING, allowNull: true, unique: true },
      price: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      stockQuantity: { type: DataTypes.INTEGER, allowNull: true, field: 'stock_quantity' },
      trackStock: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'track_stock'
      }
    },
    {
      tableName: 'products',
      underscored: true,
      timestamps: true
    }
  );

  return Product;
};
