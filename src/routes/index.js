// @flow
import koaRouter from 'koa-router';
import compose from 'lodash/fp/compose';

import send from '../helpers/mailer';

import article from './article';
import history from './history';
import video from './video';
import image from './image';
import auth from './auth';

const router = koaRouter();

function sendEmail(ctx) {
  const { from, name, message } = ctx.request.body;

  try {
    send(from, name, message);
    ctx.status = 200;
  } catch(e) {
    ctx.status = 400;
    ctx.body = e;
  }
}

function defaultRoutes(router) {
  router.post('/sendBuyingRequest', sendEmail);

  return router;
}

export default compose(
  article,
  history,
  video,
  image,
  auth,
  defaultRoutes,
)(router);
