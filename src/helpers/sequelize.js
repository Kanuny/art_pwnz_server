// @flow
import Sequelize from 'sequelize';

const userName = process.env.DB_USER || 'defaultUser';
const password = process.env.DB_PASSWORD || '';

export default new Sequelize('mysql', userName, password);
