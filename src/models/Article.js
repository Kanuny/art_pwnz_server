// @flow
import { STRING, DATE, BOOLEAN } from 'sequelize';

import sequelize from '../helpers/sequelize';

import Image from './Image';

const Article = sequelize.define('article', {
  name: STRING,
  description: STRING,
  hidden: BOOLEAN,
  removed: BOOLEAN,
  createdAt: DATE,
  year: STRING,
  genre: STRING,
  forSale: BOOLEAN,
  postName: STRING,
  postDescription: STRING,
}, {
  timestamps: false
});

Article.hasMany(Image);
Image.belongsTo(Article);

export default Article;
