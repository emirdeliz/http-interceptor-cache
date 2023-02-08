import express from 'express';
import { resolve } from 'path';

const app = express();
const port = process.argv[3];

app.route('/').get((_req, res) => {
	res.sendFile(resolve(process.cwd() + '/src/client/app.html'));
});

app.post('/post-data', (_req, res) => {
  res.send({
    status: true,
    message: 'OK, That\'s the message result to POST',
  });
});

app.get('/get-data', (_req, res) => {
  res.send({
    status: true,
    message: 'OK, That\'s the message result to GET',
  });
});

app.put('/put-data', (_req, res) => {
  res.send({
    status: true,
    message: 'OK, That\'s the message result to PUT',
  });
});

app.delete('/delete-data', (_req, res) => {
  res.send({
    status: true,
    message: 'OK, That\'s the message result to DELETE',
  });
});

app.use(express.static(process.cwd() + '/assets'));
app.use(express.static(process.cwd() + '/src/client'));
app.listen(port, () => {
	console.log(`Example app listening on port http://0.0.0.0:${port}`);
});
