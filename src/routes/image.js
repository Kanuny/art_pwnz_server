// @flow
import Image from '../models/Image';
import { getPreview } from '../helpers/images';

export default (router: any) => {
  router.get('/images/:id', async (ctx, next) => {
    const { id } = ctx.params;
    const image = await Image.findById(id);

    ctx.body = image;

    await next();
  });

  router.put('/images/:id', async (ctx, next) => {
    const { id } = ctx.params;
    const { img } = ctx.request.body;
    const preview = getPreview(img);

    await Image.update({
      fullScreen: img,
      preview,
    }, {
      where: { id },
    });

    ctx.status = 200;
    await next();
  });

  return router;
}