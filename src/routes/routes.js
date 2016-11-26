// @flow
import koaRouter from 'koa-router';

import Article from '../models/Article';

const router = koaRouter();

router.get('/articles', async (ctx, next) => {
  const articles = await Article.findAll();

  ctx.body = articles;
  await next();
});

router.post('/articles', async (ctx, next) => {
  try {
    await Article.create(ctx.request.body);
  } catch(e) {
    console.log('err', e);

    ctx.body = e;
    ctx.status = 500;
  }
  
  console.log('created', ctx.request.body);
  ctx.status = 200;
  await next();
});

export default router;
