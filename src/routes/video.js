// @flow
import Video from '../models/Video';
import Localization from '../models/Localization';
import config from '../config';
import auth from '../middlewares/auth';

const { pageSize } = config;

export default (router: any) => {
  router.post('/videos', auth(['admin']), async (ctx, next) => {
    const createdAt = Date.now();
    const newVideo = ctx.request.body;
    try {
      const nextVideo = await Video.create({ url: newVideo.url, createdAt });
      if (newVideo.name) {
        await nextVideo.createName(newVideo.name);
      }
      if (newVideo.description) {
        await nextVideo.createDescription(newVideo.description);
      }


    } catch(e) {
      ctx.body = e;
      ctx.status = 500;
      await next();
      return;
    }

    ctx.status = 200;
    await next();
  });

  router.del('/videos/:id', auth(['admin']), async (ctx, next) => {
    const { id } = ctx.params;
    await Video.update({
      removed: true,
    }, {
      where: { id },
    });

    ctx.status = 200;
    await next();
  });

  router.get('/videos/:id', auth(['admin']), async (ctx, next) => {
    const { id } = ctx.params;

    const video = await Video.findById(id, {
      include: [{
        model: Localization,
        as: 'name'
      }, {
        model: Localization,
        as: 'description',
      }],
    });

    ctx.body = video;

    await next();
  });

  router.put('/videos/:id', auth(['admin']), async (ctx, next) => {
    const { id } = ctx.params;
    const { name, description, ...nextVideo } = ctx.request.body;

    await Video.update(nextVideo, {
      where: { id },
    });
    const video = await Video.findById(id);

    const videoName = await video.getName();

    videoName.ru = name.ru;
    videoName.en = name.en;

    await videoName.save();

    const videoDescription = await video.getDescription();
    videoDescription.ru = description.ru;
    videoDescription.en = description.en;

    await videoDescription.save();

    ctx.body = video;
    await next();
  });

  router.get('/videos', auth(['admin']), async (ctx, next) => {
    const { page } = ctx.request.query;

    const offset = (page || 0) * pageSize;
    const videos = await Video.findAll({
      where: { removed: false || null },
      order: [
        ['createdAt', 'DESC']
      ],
      offset,
      limit: pageSize,
      include: [{
        model: Localization,
        as: 'name',
      }, {
        model: Localization,
        as: 'description',
      }],
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
