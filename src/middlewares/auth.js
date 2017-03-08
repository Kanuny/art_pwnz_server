import passport from 'koa-passport';

export default function () {
  return async (ctx, next) => {
    console.log('!!!', ctx.state, ctx.isAuthenticated());

    await passport.authenticate('jwt')(ctx, next);
  };
}
