const cfg = require('./src/config');
const Database = require('better-sqlite3');

console.log('DB:', cfg.db.storage);

const db = new Database(cfg.db.storage);
const rows = db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all();
console.table(rows);

db.close();
