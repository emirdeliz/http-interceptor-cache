import express from 'express';
import { resolve } from 'path';

const app = express();
app.use(express.static(process.cwd() + '/assets'));
app.use(express.static(process.cwd() + '/src/client'));
app.use(express.json()); // Used to parse JSON bodies

app.post('/post-data', (req, res) => {
  const jsonAsString = JSON.stringify(req.body);
  res.send({
    status: true,
    message: `OK, POST: ${jsonAsString}`,
  });
});

app.put('/put-data', (req, res) => {
  const jsonAsString = JSON.stringify(req.body);
  res.send({
    status: true,
    message: `OK, PUT: ${jsonAsString}`,
  });
});

app.get('/get-data/:id', (req, res) => {
  const id = req.params.id;
  res.send({
    status: true,
    message: `OK, GET: ${id}`,
  });
});

app.delete('/delete-data/:id', (req, res) => {
  const id = req.params.id;
  res.send({
    status: true,
    message: `OK, DELETE: ${id}`,
  });
});

app.patch('/patch-data/:name', (req, res) => {
  const name = req.params.name;
  res.send({
    status: true,
    message: `OK, PATCH: ${name}`,
  });
});

app.route('/').get((_req, res) => {
	res.sendFile(resolve(process.cwd() + '/src/client/app.html'));
});


const port = process.argv[3];
app.listen(port, () => {
	console.log(`Example app listening on port http://0.0.0.0:${port}`);
});
