// @flow
import { STRING, DATE, BOOLEAN } from 'sequelize';

import sequelize from '../helpers/sequelize';

const Video = sequelize.define('article', {
  name: STRING,
  description: STRING,
  removed: BOOLEAN,
  createdAt: DATE,
  url: STRING,
}, {
  timestamps: false
});

export default Video;
