// @flow
import Koa from 'koa';
import cors from 'kcors';
import koaBody from 'koa-body';
import passport from 'koa-passport';
import convert from 'koa-convert';
import session from 'koa-generic-session';

import sequelize from './helpers/sequelize';

import router from './routes';

const app = new Koa();

app.keys = ['secret'];

async function launch() {
  await sequelize.sync();

  app
    .use(cors())
    .use(koaBody({
      jsonLimit: 52428800,
    }))
    .use(convert(session()));
  // eslint-disable-next-line
  require('./helpers/passport');

  app
    .use(passport.initialize())
    .use(passport.session())
    .use(router.routes())
    .use(router.allowedMethods())
  ;

  app.listen(process.env.PORT, () => {
    console.log(`Server started ${process.env.PORT || ''}`);
  });
}

launch();

export default app;

