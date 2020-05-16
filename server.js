const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const saltRounds = 10;
const knex = require('knex');

const register = require('./controllers/register'); 
const signin = require('./controllers/signin'); 
const profile = require('./controllers/profile'); 
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'test',
    database : 'facedetect'
  }
});

const app = express();

app.use(express.json());
app.use(cors());

app.post('/signin', (req, res) => { signin.handleSignin(req, res, bcrypt, db) });

app.get('/profile/:id', (req, res) => { profile.handleProfile(req,res,db) });

app.put('/image', (req, res) => { image.handleImage(req,res,db) });

app.post('/imageapi', (req, res) => { image.handleApiCall(req,res) });

app.post('/register', (req,res) => { register.handleRegister(req,res,db,bcrypt,saltRounds) });

app.listen( 3001, () => { 
	console.log('The app is running on port 3001');
})