// @flow
import { STRING } from 'sequelize';

import sequelize from '../helpers/sequelize'; 

const Localization = sequelize.define('localization', {
  ru: STRING,
  en: STRING,
});

export default Localization;
