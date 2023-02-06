import express from 'express';
import { resolve } from 'path';

const app = express();
const port = process.argv[3];

app.route('/').get((_req, res) => {
	res.sendFile(resolve(process.cwd() + '/src/client/app.html'));
});

app.get('/json', (_req, res) => {
  res.send({
    status: true,
    message: 'OK, That\'s the message result',
  });
});

app.use(express.static(process.cwd() + '/assets'));
app.use(express.static(process.cwd() + '/src/client'));
app.listen(port, () => {
	console.log(`Example app listening on port http://0.0.0.0:${port}`);
});
