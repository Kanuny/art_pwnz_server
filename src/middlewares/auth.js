import passport from 'koa-passport';

export default function (roles) {
  return async (ctx, next) => {
    console.log('!!!', ctx.status);
    if (!ctx.isAuthenticated()) {
      ctx.status = 401;
      return;
    }

    if (!roles.includes(ctx.state.user.role)) {
      ctx.status = 403;
      return;
    }

    await passport.authenticate('jwt')(ctx, next);
  };
}
