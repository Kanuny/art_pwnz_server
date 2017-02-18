// @flow
import Article from '../models/Article';
import Image from '../models/Image';
import config from '../config';
import { getPreview } from '../helpers/images';

const { pageSize } = config;


export default (router: any) => {
  router.del('/articles/:id', async (ctx, next) => {
    const { id } = ctx.params;
    await Article.update({
      removed: true,
    }, {
      where: { id },
    });

    ctx.status = 200;
    await next();  
  });

  router.get('/articles/:id', async (ctx, next) => {
    const { id } = ctx.params;
    const article = await Article.findById(id, {
      include: [
        {
          model: Image,
          attributes: ['name', 'id'],
        },
      ],
    });  

    ctx.body = article;
    await next();
  })

  router.get('/articles', async (ctx, next) => {
    const { page } = ctx.request.query;

    const offset = (page || 0) * pageSize;
    const articles = await Article.findAll({
      where: { removed: false || null },
      include: [
        {
          model: Image,
          attributes: ['preview', 'name'],
          where: { name: 'preview'},
        },
      ],
      order: [
        ['createdAt', 'DESC']
      ],
      offset,
      limit: pageSize,
    });

    const articlesCount = await Article.count({ where: { removed: false || null } });
  
    ctx.body = {
      articles,
      pageCount: pageSize,
      count: articlesCount,
      page,
    };
    await next();
  });


  router.post('/articles', async (ctx, next) => {
    const createdAt = Date.now();
    const {
      preview,
      main,
      fragment1,
      fragment2,
      fragment3,
      ...article,
    } = ctx.request.body;
    try {
      const nextArticle = await Article.create({ ...article, createdAt });
      const previewPreview = await getPreview(preview);
      const mainPreview = await getPreview(main);
      const fragment1Preview = await getPreview(fragment1);
      const fragment2Preview = await getPreview(fragment2);
      const fragment3Preview = await getPreview(fragment3);

      const mainImg = await Image.create({
        createdAt,
        fullScreen: preview,
        name: 'preview',
        preview: previewPreview,
      });
      const previewImg = await Image.create({
        createdAt,
        fullScreen: main,
        name: 'main',
        preview: mainPreview,
      });
      const fr1Img = await Image.create({
        createdAt,
        fullScreen: fragment1,
        name: 'fragment1',
        preview: fragment1Preview,
      });
      const fr2Img = await Image.create({
        createdAt,
        fullScreen: fragment2,
        preview: fragment2Preview,
        name: 'fragment2',
      });
      const fr3Img = await Image.create({
        createdAt,
        fullScreen: fragment3,
        preview: fragment3Preview,
        name: 'fragment3',
      });

      await nextArticle.addImage(mainImg);
      await nextArticle.addImage(previewImg);
      await nextArticle.addImage(fr1Img);
      await nextArticle.addImage(fr2Img);
      await nextArticle.addImage(fr3Img);
    } catch(e) {
      console.log('err');

      ctx.body = e;
      ctx.status = 500;
    }
    
    ctx.status = 200;
    await next();
  });

  return router;
};