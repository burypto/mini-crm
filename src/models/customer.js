module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define(
    'Customer',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

      firstName: { type: DataTypes.STRING, allowNull: false, field: 'first_name' },
      lastName: { type: DataTypes.STRING, allowNull: true, field: 'last_name' },
      phone: { type: DataTypes.STRING, allowNull: true, field: 'phone' },
      email: { type: DataTypes.STRING, allowNull: true, field: 'email' },
      address: { type: DataTypes.TEXT, allowNull: true, field: 'address' },

      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active'
      }
    },
    {
      tableName: 'customers',
      underscored: true,
      timestamps: true
    }
  );

  return Customer;
};
