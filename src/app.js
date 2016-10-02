import express from 'express';
import morgan from 'morgan';

const app = express();

app.use(morgan('combined'));

app.get('/', (req, res) => {
  res.send('hello world');
});
app.listen(3000, () => {
  console.log('server listen on 3000');
});
