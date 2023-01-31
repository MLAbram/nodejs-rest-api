const express = require('express');
const { registerHelper } = require('hbs');
const app = express();
const db = require('./db');
const joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticateToken = require('./jwt');

const usersSchema = joi.object({
  first_name: joi.string().min(1).max(50).required(),
  last_name: joi.string().min(1).max(50).required(),
  email: joi.string().min(5).max(50).required().email(),
  password: joi.string().min(5).max(100).required(),
  password2: joi.string().min(5).max(100),
  source: joi.string()
});

const loginSchema = joi.object({
  email: joi.string().min(5).max(50).required().email(),
  password: joi.string().min(5).max(100).required()
});

const contactsSchema = joi.object({
  user_id: joi.number().integer().min(1).required(),
  first_name: joi.string().min(1).max(50).required(),
  last_name: joi.string().min(1).max(50).required(),
  email: joi.string().min(5).max(50).required().email(),
  phone: joi.string().min(0).max(20),
  addr1: joi.string().min(0).max(50),
  addr2: joi.string().min(0).max(50),
  city: joi.string().min(0).max(50),
  state: joi.string().min(0).max(50),
  zip_code: joi.string().min(0).max(10),
  notes: joi.string().min(0).max(255)
});

function parseJwt (token) {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

app.get('/',authenticateToken , (req, res) => {
  res.status(200).send('<h1>REST API v1 Home Page</h1>')
});

// register new user
app.post('/register/', async function(req, res) {
  // validate user data
  const validation = usersSchema.validate(req.body);
  if (validation.error) return res.status(400).send(validation.error.details[0].message);

  // check if user already exists
  const result = await db.pool.query("select email_t from users where email_t = '" + req.body.email + "';");
  if (JSON.stringify(result).length > 2) {
    return res.status(400).send('User already exists...');
  }

  // validate if passwords match from webform
  if (req.body.source == 'webform') {
    if (req.body.password != req.body.password2) {
        return res.render('../views/register/', {
          message: 'Passwords do not match...'
        });
    }
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // add user to users table
  try {
    const {first_name,last_name,email,password} = req.body;
    const sqlQuery = 'insert into users (first_name_t,last_name_t,email_t,password_t) values (?,?,?,?);';
    const result = await db.pool.query(sqlQuery, [first_name,last_name,email,hashedPassword]);

    // res.status(200).send('User "' + req.body.first_name + ' ' + req.body.last_name + '" Created...');
    res.status(200).render('/register/', {
      message: 'User "' + req.body.first_name + ' ' + req.body.last_name + '" Created...'
    })
  } catch(error) {
    // res.status(400).send(error);
    res.status(200).render('/api/v1/register/', {
      message: error
    })
  }
});

// user login
app.post('/login/', async function(req, res) {
  // validate user data
  const validation = loginSchema.validate(req.body);
  if (validation.error) return res.status(400).send(validation.error.details[0].message);

  // check if user does not exist
  const emailSQL = await db.pool.query("select user_id, email_t from users where email_t = '" + req.body.email + "';");
  if (JSON.stringify(emailSQL).length == 2) {
    return res.status(400).send('Invalid Credentials...');
  } else {
    const emailResult = JSON.stringify(emailSQL[0].email_t).replace(/["]+/g, '');
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // compare passwords
  const passwordSQL = await db.pool.query("select password_t from users where email_t = '" + req.body.email + "';");
  const passwordResult = JSON.stringify(passwordSQL[0].password_t).replace(/["]+/g, '');
  const validatePassword = await bcrypt.compare(req.body.password, passwordResult);
  if (!validatePassword) return res.status(400).send('Invalid Credentials...');

  // create token
  const token = jwt.sign({id: emailSQL[0].user_id, email: req.body.email}, process.env.SALT_TOKEN);
  res.header('auth-token', token).send('auth-token: ' + token);
});

// get all registered user's contacts
app.get('/getAllContacts/', authenticateToken, async (req, res) => {
  try {
    const result = await db.pool.query('select * from contacts where user_id = ' + parseJwt(req.header('auth-token')).id + ';');
    res.status(200).send(result);
  } catch(error) {
    throw error;
  }
});

// get all registered user's contact by ID
app.get('/getContact/:id', authenticateToken, async (req, res) => {
  try {
    const result = await db.pool.query('select * from contacts where user_id = ' + parseJwt(req.header('auth-token')).id + ' and contacts_id = ' + req.params.id + ';');
    if (result.length == 0) {
      return res.status(400).send('Invalid Request...');
    } else {
      res.status(200).send(result);
    }
  } catch(error) {
    res.status(400).send(error);
  }
});

// register user to post new contact
app.post('/postContact/', authenticateToken, async function(req, res) {
  // validate user data
  const validation = contactsSchema.validate(req.body);
  if (validation.error) return res.status(400).send(validation.error.details[0].message);

  // does the user_id match the acutual user
  if (req.body.user_id != parseJwt(req.header('auth-token')).id) return res.status(400).send('Invalid Credentials...');
  
  // add contact to contacts table
  try {
    const {user_id,first_name,last_name,email,phone,addr1,addr2,city,state,zip_code,notes} = req.body;
    const sqlQuery = 'insert into contacts (user_id,first_name_t,last_name_t,email_t,phone_t,addr1_t,addr2_t,city_t,state_t,zip_code_t,notes_t) values (?,?,?,?,?,?,?,?,?,?,?);';
    const result = await db.pool.query(sqlQuery, [user_id,first_name,last_name,email,phone,addr1,addr2,city,state,zip_code,notes]);

    res.status(200).send('Contact "' + req.body.first_name + ' ' + req.body.last_name + '" Added...');
  } catch(error) {
    res.status(400).send(error);
  }
});

module.exports = app;