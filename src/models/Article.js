// @flow
import { STRING, DATE, BOOLEAN } from 'sequelize';

import sequelize from '../helpers/sequelize';

import Image from './Image';

const Article = sequelize.define('article', {
  description: STRING,
  hidden: BOOLEAN,
  removed: BOOLEAN,
  createdAt: DATE,
});

Article.hasMany(Image);

export default Article;
