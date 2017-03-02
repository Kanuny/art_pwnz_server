// @flow
import Koa from 'koa';
import cors from 'kcors';
import koaBody from 'koa-body';

import sequelize from './helpers/sequelize';

import router from './routes';

const app = new Koa();

app.use(cors());
app.use(koaBody({
  jsonLimit: 52428800,
}));

sequelize.sync({ force: true });

app
  .use(router.routes())
  .use(router.allowedMethods());

console.log('app running');
app.listen(80);
