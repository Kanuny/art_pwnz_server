import passport from 'koa-passport';
import User from '../models/User';

import { getToken } from '../helpers/passport';

async function login(ctx) {
  try {
    const token = getToken(ctx.state.user);
    await User.update({
      token,
    }, { where: { username: ctx.state.user.username } });
    console.log('logged in', ctx.state.user);
    const nextUser = await User.findOne({
      where: { username: ctx.state.user.username },
    });

    ctx.status = 200;
    ctx.body = {
      token,
      user: nextUser,
    };
  } catch (e) {
    ctx.status = 401;
    ctx.body = e;
  }
}

function loginByToken(ctx) {
  ctx.body = ctx.state.user;
  ctx.body = {
    token: ctx.state.user.token,
    user: ctx.state.user,
  };
  ctx.status = 200;
}

async function createUser(ctx, next) {
  const { username, password, role } = ctx.request.body;

  try {
    const user = await User.create({
      username,
      password,
      role,
    });

    ctx.body = user;
    ctx.status = 200;
  } catch (e) {
    ctx.body = e;
    ctx.status = 400;
  }

  return next();
}

export default function (router) {
  router.post('/auth/signin', passport.authenticate('local'), login);
  router.get('/auth/signin', passport.authenticate('jwt'), loginByToken);
  router.post('/v1/users', createUser);

  return router;
}
