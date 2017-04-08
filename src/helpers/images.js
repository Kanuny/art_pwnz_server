import jimp from 'jimp';

function extract(url) {
  return url
    .replace(/^data:image\/png;base64,/, '')
    .replace(/^data:image\/jpeg;base64,/, '');
}

export async function getPreview(img) {
  if (!img) {
    return Promise.resolve('');
  }
  const base64Data = extract(img);

  const jimpImg = await jimp.read(new Buffer(base64Data, 'base64'));
  const preview = jimpImg.cover(400, 400);

  return new Promise((res) => {
    preview.getBase64('image/png', (err, result) => {
      res(result);
    });
  });
}

export async function saveImg(base64Url, name) {
  const base64Data = extract(base64Url);
  const jimpImg = await jimp.read(new Buffer(base64Data, 'base64'));
  return new Promise((res) => {
    jimpImg.write(`./public/img-${name}.png`, () => {
      res(`/img-${name}.png`);
    });
  });
}
