const pool = require('../db');
const sql = require('./sql');

const getRecords = (req, res) => {
  pool.query(sql.selectAllRecords, (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

const insertRecord = (req, res) => {
  const {source_t,flow_name_t,source_id_t,first_name_t,last_name_t,gender_t,timezone_t,local_t,language_t} = req.body;

  pool.query(sql.insertRecord, [source_t,flow_name_t,source_id_t,first_name_t,last_name_t,gender_t,timezone_t,local_t,language_t], (error, results) => {
    if (error) throw error;
    res.status(201).send('Success');
  });
};

module.exports = {
  getRecords,
  insertRecord,
};