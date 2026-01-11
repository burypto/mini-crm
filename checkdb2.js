const { sequelize } = require('./src/models');

(async () => {
  console.log('DB:', sequelize.options.storage || '(storage bilinmiyor)');
  const [rows] = await sequelize.query(
    "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
  );
  console.table(rows);
  await sequelize.close();
})().catch((err) => {
  console.error('DB check error:', err);
  process.exit(1);
});
