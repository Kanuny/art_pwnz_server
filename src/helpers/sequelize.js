// @flow
import Sequelize from 'sequelize';

// FIXME remove default values
const userName = process.env.DB_USER || 'root';
const password = process.env.DB_PASSWORD || '1';

export default new Sequelize('mysql', userName, password);
