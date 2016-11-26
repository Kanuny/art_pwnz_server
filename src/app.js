// @flow
import Koa from 'koa';
import cors from 'kcors';
import koaBody from 'koa-body';

import sequelize from './helpers/sequelize';

import router from './routes/routes';

const app = new Koa();

app.use(cors());
app.use(koaBody());

sequelize.sync({ force: true });

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);
