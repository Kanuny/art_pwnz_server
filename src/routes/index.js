// @flow
import koaRouter from 'koa-router';
import compose from 'lodash/fp/compose';

import article from './article';
import history from './history';
import video from './video';
import image from './image';
import auth from './auth';

const router = koaRouter();

export default compose(
  article,
  history,
  video,
  image,
  auth,
)(router);
