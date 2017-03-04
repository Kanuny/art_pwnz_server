// @flow
import Sequelize from 'sequelize';

// FIXME remove default values
// ec2-54-217-235-11.eu-west-1.compute.amazonaws.com
/*
const userName = process.env.DB_USER || 'pqikqlbdiibqtm';
const password = process.env.DB_PASSWORD || '446ac5fde8f58617178909624e4efb89b1e6c462a3497eea33f0865267bea569'; */
const dbName = process.env.HEROKU_POSTGRESQL_BRONZE_URL || 'postgres://pqikqlbdiibqtm:446ac5fde8f58617178909624e4efb89b1e6c462a3497eea33f0865267bea569@ec2-54-217-235-11.eu-west-1.compute.amazonaws.com:5432/d2dehklu264u6n';

const DB = new Sequelize(dbName, {
  dialect: 'postgres',
  define: {
    timestamps: false,
  },
});

export default DB;
