// @flow
import Image from '../models/Image';

export default (router: any) => {
  router.get('/images/:id', async (ctx, next) => {
    const { id } = ctx.params;
    const image = await Image.findById(id);

    ctx.body = image;

    await next();
  });

  return router;
}