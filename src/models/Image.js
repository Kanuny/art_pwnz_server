// @flow
import { STRING, BLOB, DATE } from 'sequelize';

import sequelize from '../helpers/sequelize'; 

const Image = sequelize.define('image', {
  description: STRING,
  preview: BLOB,
  fullScreen: BLOB,
  createdAt: DATE,
});

export default Image;
