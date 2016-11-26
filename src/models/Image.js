// @flow
import { STRING, DATE } from 'sequelize';

import sequelize from '../helpers/sequelize'; 

const Image = sequelize.define('image', {
  preview: STRING,
  name: STRING,
  fullScreen: STRING,
  createdAt: DATE,
});

export default Image;
