// @flow
import { STRING, DATE } from 'sequelize';

import sequelize from '../helpers/sequelize';

const User = sequelize.define('user', {
  updatedAt: DATE,
  token: STRING,
}, {
  timestamps: false
});

export default User;
