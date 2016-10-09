// @flow
import Koa from 'koa';

import type { Koa$Context } from './types';

const app = new Koa();

app.use((ctx: Koa$Context) => {
  ctx.body = 'Hello World';
});

app.listen(3000);
