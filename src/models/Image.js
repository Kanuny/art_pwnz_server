// @flow
import { STRING, TEXT, DATE } from 'sequelize';

import sequelize from '../helpers/sequelize'; 

const Image = sequelize.define('image', {
  preview: TEXT('long'),
  name: STRING,
  fullScreen: TEXT('long'),
  createdAt: DATE,
});

export default Image;
