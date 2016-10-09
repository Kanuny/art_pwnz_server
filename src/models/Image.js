// @flow
import { STRING, BLOB, DATE } from 'sequelize';

import sequelize from '../helpers/sequelize'; 

import Article from './Article';

const Image = sequelize.define('image', {
  description: STRING,
  preview: BLOB,
  fullScreen: BLOB,
  createdAt: DATE,
});

Image.belongTo(Article);

export default Image;
