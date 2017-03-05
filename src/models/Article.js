// @flow
import { STRING, DATE, BOOLEAN } from 'sequelize';

import sequelize from '../helpers/sequelize';

import Localization from './Localization';
import Image from './Image';

const Article = sequelize.define('article', {
  hidden: BOOLEAN,
  removed: BOOLEAN,
  createdAt: DATE,
  size: STRING,
  year: STRING,
  genre: STRING,
  forSale: BOOLEAN,
}, {
  timestamps: false
});

Article.hasMany(Image);
Image.belongsTo(Article);
Localization.hasMany(Article);

Article.belongsTo(Localization, { as: 'name' });
Article.belongsTo(Localization, { as: 'description' });
Article.belongsTo(Localization, { as: 'postName' });
Article.belongsTo(Localization, { as: 'postDescription' });
Article.belongsTo(Localization, { as: 'postDescription' });

export default Article;
