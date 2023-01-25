const express = require('express');
const app = express();
const db = require('./db');

app.get('/', (req, res) => {
  res.redirect('https://dynamismtechnology.com/');
});

app.get('/getAllRecords/', async (req, res) => {
  try {
    const result = await db.pool.query("select * from chatbot_activity;");
    res.send(result);
  } catch (error) {
    throw error;
  }
});

app.post('/post/', async function(req, res) {
  try {
    const {domain_t,source_t,flow_name_t,source_id_t,first_name_t,last_name_t,gender_t,timezone_t,local_t,language_t} = req.body;
    const sqlQuery = 'insert into chatbot_activity (domain_t,source_t,flow_name_t,source_id_t,first_name_t,last_name_t,gender_t,timezone_t,local_t,language_t) values (?,?,?,?,?,?,?,?,?,?);';
    const result = await db.pool.query(sqlQuery, [domain_t,source_t,flow_name_t,source_id_t,first_name_t,last_name_t,gender_t,timezone_t,local_t,language_t]);
    res.send(result);
  } catch (error) {
    res.send(error);
  }  
});

module.exports = app;