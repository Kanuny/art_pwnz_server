// @flow
import koaRouter from 'koa-router';
import compose from 'lodash/fp/compose';

import send from '../helpers/mailer';
import Article from '../models/Article';
import Image from '../models/Image';
import Localization from '../models/Localization';

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
  const { id, lang } = ctx.params;
  const article = await Article.findById(id, {
    include: [
      {
        model: Image,
        attributes: ['name', 'id', 'preview'],
      },
      {
        model: Localization,
        as: 'name',
      },
    ],
  });
  const url = await saveImg(
    article.images[0].preview,
    article.name.en,
  );
  const desc = {
    ru: 'Работа Юрия Клапоуха',
    en: 'Artwork by Yury Klapouh',
  };
  ctx.body = `
    <html>
      <head>
        <title>Art-Pwnz</title>
        <meta property="og:type" content="article" />
        <meta property="og:title" content="${article.name[lang]}" />
        <meta property="og:description" content="${desc[lang]}" />
        <meta property="og:image" content="https://artpwnz.herokuapp.com${url}" />
      </head>
    </html>
  `;
  ctx.status = 200;
}
function defaultRoutes(router) {
  router.post('/sendBuyingRequest', sendEmail);
  router.get('/getSharingHtml/:lang/:id', getSharing);

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
