
// @flow
import Sequelize from 'sequelize';

// FIXME remove default values
const userName = process.env.DB_USER || 'root';
const password = process.env.DB_PASSWORD || '1';
const dbName = process.env.DB_NAME || 'test_art_pwnz';

const DB = new Sequelize(dbName, userName, password, {
  dialect: 'mysql',
  define: {
    timestamps: false,
  },
});

export default DB;