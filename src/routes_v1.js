const {Router} = require('express');
const pool = require('../db');
const router = Router();

router.post('/post', async function(req, res) {
  try {
    const {domain_t,source_t,flow_name_t,source_id_t,first_name_t,last_name_t,gender_t,timezone_t,local_t,language_t} = req.body;
    const sqlQuery = 'insert into chatbot_activity (domain_t,source_t,flow_name_t,source_id_t,first_name_t,last_name_t,gender_t,timezone_t,local_t,language_t) values (?,?,?,?,?,?,?,?,?,?);';
    const result = await pool.query(sqlQuery, [domain_t,source_t,flow_name_t,source_id_t,first_name_t,last_name_t,gender_t,timezone_t,local_t,language_t]);

    res.status(200).json(result);
  }catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;