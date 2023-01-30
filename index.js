const express = require('express');
const app = express();
const routes_v1 = require('./api/routes_v1');
const path = require('path');
const HTMLFolder = path.join(__dirname, './htmldocs')

app.set('view engine', 'hbs');

// this will remove serialize bigint error
BigInt.prototype.toJSON = function() { return this.toString() }

app.use(express.static(HTMLFolder));
app.use('/api/v1/', routes_v1);

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.get('/profile', (req, res) => {
  res.render('profile');
});

app.listen(3000, () => {
  console.log('Server listening on port: 3000.');
});