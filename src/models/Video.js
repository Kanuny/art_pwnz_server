// @flow
import { STRING, DATE, BOOLEAN } from 'sequelize';

import sequelize from '../helpers/sequelize';

import Localization from './Localization';

const Video = sequelize.define('video', {
  removed: BOOLEAN,
  createdAt: DATE,
  url: STRING,
}, {
  timestamps: false
});

Localization.belongsTo(Video);


Video.hasOne(Localization, { as: 'name' });
Video.hasOne(Localization, { as: 'description' });

export default Video;
