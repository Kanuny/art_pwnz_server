import passport from 'koa-passport';
import local from 'passport-local';
import jwtStrategy from 'passport-jwt';
import jwt from 'jsonwebtoken';

import User from '../models/User';

const JwtStrategy = jwtStrategy.Strategy;
const ExtractJwt = jwtStrategy.ExtractJwt;

const LocalStrategy = local.Strategy;

const JWT_STRATEGY_CONFIG = {
  secretOrKey: 'test',
  jwtFromRequest: ExtractJwt.versionOneCompatibility({
    authScheme: 'Bearer',
    tokenBodyField: 'access_token',
  }),
  tokenQueryParameterName: 'access_token',
  session: false,
  passReqToCallback: true,
};

// eslint-disable-next-line
export function getToken(user) {
  return jwt.sign({
    username: user.username,
  }, JWT_STRATEGY_CONFIG.secretOrKey, { expiresIn: '15m' });
}

passport.serializeUser(async (user, done) => {
  const query = user.username ? {
    username: user.username,
  } : {
    token: user.token,
  };

  const userInstance = await User.findOne({
    where: query,
  });

  done(null, userInstance);
});

passport.deserializeUser(async (user, done) => {
  done(null, user);
});

passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({
      where: { username },
    });

    return user && user.password === password
      ? done(null, user)
      : done(null, false);
  } catch (e) {
    return done(e);
  }
}));

passport.use(new JwtStrategy(JWT_STRATEGY_CONFIG, async (p, payload, done) => {
  try {
    const user = await User.findOne({
      where: { username: payload.username },
    });
    done(null, user);
  } catch (e) {
    done(e);
  }
}));
