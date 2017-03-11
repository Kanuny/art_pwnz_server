// @flow
import koaRouter from 'koa-router';
import compose from 'lodash/fp/compose';

import send from '../helpers/mailer';
import Article from '../models/Article';

import article from './article';
import history from './history';
import video from './video';
import image from './image';
import auth from './auth';

import { saveImg } from '../helpers/images';
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
async function getSharing(ctx) {
  const { id } = ctx.params;
  const article = await Article.findById(id, {
    include: [
      {
        model: Image,
        attributes: ['name', 'id', 'preview'],
      },
    ],
  });
  const url = await saveImg(
    article.images[0].preview,
    article.images[0].name
  );
  ctx.body = `
    <html>
      <body>
        <img src=${url}>
      </body>
    </html>
  `;
  ctx.status = 200;
}
function defaultRoutes(router) {
  router.post('/sendBuyingRequest', sendEmail);
  router.get('/getSharingHtml/:id', getSharing);

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
