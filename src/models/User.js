// @flow
import { STRING } from 'sequelize';

import sequelize from '../helpers/sequelize';

const User = sequelize.define('user', {
  username: STRING,
  password: STRING,
  role: STRING,
  token: STRING,
}, {
  timestamps: false
});

export default User;
