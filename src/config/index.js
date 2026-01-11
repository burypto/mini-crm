require('dotenv').config();
const path = require('path');

const projectRoot = path.resolve(__dirname, '..', '..'); 

function makeDbConfig(envKey) {
  const defaultStorage = envKey === 'test' ? './test_db.sqlite' : './database.sqlite';
  const storageInput = process.env.DB_STORAGE || defaultStorage;

  const storageAbs = path.isAbsolute(storageInput)
    ? storageInput
    : path.resolve(projectRoot, storageInput);

  return {
    dialect: 'sqlite',
    storage: storageAbs,
    logging: envKey === 'test' ? false : false 
  };
}

const runtimeEnv = process.env.NODE_ENV || 'development';

module.exports = {
  
  development: makeDbConfig('development'),
  test: makeDbConfig('test'),
  production: makeDbConfig('production'),

  
  app: {
    port: Number(process.env.APP_PORT || 3000),
    env: runtimeEnv
  },
  db: makeDbConfig(runtimeEnv)
};
