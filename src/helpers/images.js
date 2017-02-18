import jimp from 'jimp';

export async function getPreview(img) {
  const base64Data = img.replace(/^data:image\/png;base64,/, '');
  const jimpImg = await jimp.read(new Buffer(base64Data, 'base64'));
  const preview = jimpImg.resize(400, 400);

  return new Promise((res) => {
    preview.getBase64('image/png', (err, result) => {
      res(result);
    });
  });
}