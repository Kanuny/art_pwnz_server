// @flow
import Koa from 'koa';

import type { Koa$Context } from './types';
import sequelize from './helpers/sequelize';

const app = new Koa();

sequelize.sync();

app.use((ctx: Koa$Context) => {
  ctx.body = 'Hello World';
});

app.listen(3000);
