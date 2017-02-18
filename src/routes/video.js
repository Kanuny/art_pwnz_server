// @flow
import Video from '../models/Video';
import config from '../config';

const { pageSize } = config;

export default (router: any) => {
  router.post('/videos', async (ctx, next) => {
    const createdAt = Date.now();
    const newVideo = ctx.request.body;
    try {
      await Video.create({ ...newVideo, createdAt });
    } catch(e) {
      ctx.body = e;
      ctx.status = 500;
    }

    ctx.status = 200;
    await next();
  });

  router.del('/videos/:id', async (ctx, next) => {
    const { id } = ctx.params;
    await Video.update({
      removed: true,
    }, {
      where: { id },
    });

    ctx.status = 200;
    await next();  
  });

  router.get('/videos/:id', async (ctx, next) => {
    const { id } = ctx.params;
    const video = await Video.findById(id);  

    ctx.body = video;

    await next();
  });

  router.put('/videos/:id', async (ctx, next) => {
    const { id } = ctx.params;
    const nextVideo = ctx.request.body;

    await Video.update(nextVideo, {
      where: { id },
    });  
    const video = await Video.findById(id);  
    ctx.body = video;
    await next();
  });

  router.get('/videos', async (ctx, next) => {
    const { page } = ctx.request.query;

    const offset = (page || 0) * pageSize;
    const videos = await Video.findAll({
      where: { removed: false || null },
      order: [
        ['createdAt', 'DESC']
      ],
      offset,
      limit: pageSize,
    });
    const videosCount = await Video.count({ where: { removed: false || null }});
    ctx.body = {
      videos,
      pageCount: pageSize,
      count: videosCount,
      page,
    };
    await next();
  });
  return router;
};
