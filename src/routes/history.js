// @flow
import Article from '../models/Article';
import Image from '../models/Image';
import Video from '../models/Video';
import Localization from '../models/Localization';

export default (router: any) => {
  router.get('/history', async (ctx, next) => {
    const videos = await Video.findAll({
      where: { removed: false || null },
      order: [
        ['createdAt', 'DESC']
      ],
      include: [{
        model: Localization,
        as: 'name',
      }, {
        model: Localization,
        as: 'description',
      }],
      offset: 0,
      limit: 10,
    });

    const articles = await Article.findAll({
      where: { removed: false || null },
      include: [
        {
          model: Localization,
          as: 'name',
        }, {
          model: Localization,
          as: 'description',
        },
        {
          model: Localization,
          as: 'postName',
        }, {
          model: Localization,
          as: 'postDescription',
        },
        {
          model: Image,
          attributes: ['preview', 'name'],
          where: { name: 'preview'},
        },
      ],    
      order: [
        ['createdAt', 'DESC']
      ],
      offset: 0,
      limit: 10,
    });

  const history = [
    ...videos.map((video) => ({ ...video.dataValues, type: 'video' })),
    ...articles.map((article) => ({ ...article.dataValues, type: 'article' })),
    ].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).slice(0, 10);
    ctx.body = history;
    await next();
  });
  return router;
};
