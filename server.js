const pool = require('./db');
const routes_v1 = require('./src/routes_v1');
const http = require('http');
const os = require('os');
const express = require('express');
const app = express();
// const port = process.env.port || 3000;
const port = 3000;

app.use(express.json());
app.use('/api/v1/', routes_v1);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => console.log(`Server listening at port: ${port}.`));