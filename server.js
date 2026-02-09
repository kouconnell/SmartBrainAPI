const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register.js');
const signIn = require('./controllers/signin.js');
const image = require('./controllers/image.js');
const id = require('./controllers/id.js');

const dotenv = require('dotenv');
dotenv.config();

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    host: process.env.DATABASE_HOST,
    port: 5432,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PW,
    database: process.env.DATABASE_DB
  },
});

const app = express();

app.use(cors());																		// different origins (front-end runs on port 5173 and back-end runs on port 3000 -> browser blocks requests by default)

app.use(express.urlencoded({extended: false}));			// lets express read form data (URL-encoded data)
app.use(express.json());														// lets express read JSON request bodies

app.get('/', (req, res) => { res.send('success'); });

app.post('/signin', (req, res) => { signIn.handleSignIn(req, res, db, bcrypt); });

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt); });	// dependency injection

app.get('/profile/:id', (req, res) => { id.handleId(req, res, db); });

app.put('/image', (req, res) => { image.handleImage(req, res, db); });

app.post('/imageurl', (req, res) => { image.handleApiCall(req, res); });

app.listen(3000, () => { console.log('App is running on port 3000.'); });

/*
/ --> res = this is working
/signin  --> POST = success/fail
/register  --> POST (add) = user
/profile/:userId --> GET = user
/image --> PUT (update) --> user

*/