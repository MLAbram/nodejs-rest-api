const express = require('express');
const app = express();
const routes_v1 = require('./routes/routes_v1');
const path = require('path');
const hbs = require('hbs');
const HTMLFolder = path.join(__dirname, './htmldocs');

// this will remove serialize bigint error
BigInt.prototype.toJSON = function() { return this.toString() }

hbs.registerPartials(path.join(__dirname, 'views/partials'));

app.set('view engine', 'hbs');

app.use(express.static(HTMLFolder));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use('/api/v1', routes_v1);

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