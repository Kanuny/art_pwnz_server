// @flow
import koaRouter from 'koa-router';
import jimp from 'jimp';

import Article from '../models/Article';
import Image from '../models/Image';

const router = koaRouter();

router.get('/articles', async (ctx, next) => {
  const articles = await Article.findAll({
  include: [
    { model: Image },
  ]
});

  ctx.body = articles;
  await next();
});
async function getPreview(img) {
  const base64Data = img.replace(/^data:image\/png;base64,/, '');
  const jimpImg = await jimp.read(new Buffer(base64Data, 'base64'));
  const preview = jimpImg.resize(128, 128);

  return new Promise((res) => {
    preview.getBase64('image/png', (err, result) => {
      res(result);
    });
  });
}
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

export default router;
