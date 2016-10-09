// @flow
import Sequelize from 'sequelize';

// FIXME remove default values
const userName = process.env.DB_USER || 'root';
const password = process.env.DB_PASSWORD || '1';
const dbName = process.env.DB_NAME || 'test_art_pwnz';

export default new Sequelize(dbName, userName, password, {
  dialect: 'mysql',
});
