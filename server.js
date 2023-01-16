const routes_v1 = require('./prod/routes_v1');
const express = require('express');
const app = express();
const port = 3000;

BigInt.prototype.toJSON = function() { return this.toString() }

app.use(express.json());
app.use('/api/v1/', routes_v1);

app.get('/', (req, res) => {
  res.redirect('https://dynamismtechnology.com/');
});

app.listen(port, () => console.log(`Server listening at port: ${port}.`));