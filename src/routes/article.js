// @flow
import Article from '../models/Article';
import Image from '../models/Image';
import config from '../config';
import { getPreview } from '../helpers/images';
import Localization from '../models/Localization';

const { pageSize } = config;

function addPreviewImages(arr) {
  const promises = arr.map(item => getPreview(item.fullScreen).then(preview => ({ ...item, preview })) );
  return Promise.all(promises);
}
function updateImages(arr, id) {
  const promises = arr.map(({name, fullScreen, preview}) => Image.update({
    fullScreen,
    preview,
  }, { where: { name, articleId: id } }));
  return Promise.all(promises);
}
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
  router.put('/articles/:id', async (ctx, next) => {
    const { id } = ctx.params;
    const { name, description, postName, postDescription, preview, main, fragment1, fragment2, fragment3, genre, ...nextArticle } = ctx.request.body;
    const imgMap = await addPreviewImages([
      { name: 'preview', fullScreen: preview },
      { name: 'main', fullScreen: main },
      { name: 'fragment1', fullScreen: fragment1 },
      { name: 'fragment2', fullScreen: fragment2 },
      { name: 'fragment3', fullScreen: fragment3 },
    ].filter(item => !!item.fullScreen));

    await Article.update(nextArticle, {
      where: { id },
    });
    await updateImages(imgMap, id);

    const article = await Article.findById(id);

    if (name) {
      const articleName = await article.getName();

      articleName.ru = name.ru;
      articleName.en = name.en;

      await articleName.save();
    }

    if (description) {
      const articleDescription = await article.getDescription();
      articleDescription.ru = description.ru;
      articleDescription.en = description.en;

      await articleDescription.save();
    }

    if (postName) {
      const articlePostName = await article.getPostName();

      articlePostName.ru = postName.ru;
      articlePostName.en = postName.en;
      
      await articlePostName.save();
    }

    if (postDescription) {
      const articlePostDescription = await article.getPostDescription();
      articlePostDescription.ru = postDescription.ru;
      articlePostDescription.en = postDescription.en;

      await articlePostDescription.save();
    }

    if (genre) {
      const articlePostDescription = await article.getGenre();
      articlePostDescription.ru = postDescription.ru;
      articlePostDescription.en = postDescription.en;

      await articlePostDescription.save();
    }
    ctx.body = article;
    await next();
  });
  router.get('/articles/:id', async (ctx, next) => {
    const { id } = ctx.params;
    const article = await Article.findById(id, {
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
          model: Localization,
          as: 'genre',
        },
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
          model: Localization,
          as: 'genre',
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
      name,
      description,
      postName,
      genre,
      postDescription,
      ...article,
    } = ctx.request.body;
    try {
      const nextArticle = await Article.create({ ...article, createdAt });
      if (preview) {
        const previewPreview = await getPreview(preview);

        const previewImg = await Image.create({
          createdAt,
          fullScreen: preview,
          name: 'preview',
          preview: previewPreview,
        });

        await nextArticle.addImage(previewImg);
      }

      if (main) {
        const mainPreview = await getPreview(main);
        const mainImg = await Image.create({
          createdAt,
          fullScreen: main,
          name: 'main',
          preview: mainPreview,
        });

        await nextArticle.addImage(mainImg);
      }
      if (fragment1) {
        const fragment1Preview = await getPreview(fragment1);
        const fr1Img = await Image.create({
          createdAt,
          fullScreen: fragment1,
          name: 'fragment1',
          preview: fragment1Preview,
        });

        await nextArticle.addImage(fr1Img);
      }
      if (fragment2) {
        const fragment2Preview = await getPreview(fragment2);

        const fr2Img = await Image.create({
          createdAt,
          fullScreen: fragment2,
          preview: fragment2Preview,
          name: 'fragment2',
        });

        await nextArticle.addImage(fr1Img);
      }
      if (fragment3) {
        const fragment3Preview = await getPreview(fragment3);
        const fr3Img = await Image.create({
          createdAt,
          fullScreen: fragment3,
          preview: fragment3Preview,
          name: 'fragment3',
        });

        await nextArticle.addImage(fr3Img);
      }
      if (name) {
        await nextArticle.createName(name);  
      }
      if (description) {
        await nextArticle.createDescription(description);  
      }
      if (postName) {
        await nextArticle.createPostName(postName);  
      }
      if (postDescription) {
        await nextArticle.createPostDescription(postDescription);  
      }
      if (genre) {
        await nextArticle.createGenre(genre);
      }
    } catch(e) {
      console.log('err', e);

      ctx.body = e;
      ctx.status = 500;

      await next();
      return;
    }
    
    ctx.status = 200;
    await next();
  });

  return router;
};