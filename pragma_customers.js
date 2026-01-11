const { sequelize } = require('./src/models');

(async () => {
  console.log('DB storage:', sequelize.options.storage);
  const [cols] = await sequelize.query("PRAGMA table_info('customers')");
  console.table(cols);
  await sequelize.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
