const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const saltRounds = 10;
var knex = require('knex');

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

const database = { 
	users : [
		{
			id: '100',
			name: 'Ramu',
			email: 'ramu@gmail.com',
			password: 'ramu123',
			entries: 0,
			joined: new Date()
		},
		{
			id: '101',
			name: 'Kaka',
			email: 'kaka@gmail.com',
			password: 'kaka123',
			entries: 0,
			joined: new Date()
		}
	]
}

app.get('/', ( req,res ) => {
	res.send(database.users);
})

app.post('/signin', (req,res) => {
	db.select('email','hash').from('login')
		.where('email','=',req.body.email)
		.then( data => {
			bcrypt.compare(req.body.password, data[0].hash, function(err, result) {
    		if(err){
    			return res.status(400).json("Server error!");
    		} else if (result) {
    			db.select('*').from('users')
    				.where('email','=',req.body.email)
    				.then( user => {
    					return res.json(user[0])
    				})
    				.catch(err => res.status(400).json("Unable to fetch user!"))
    		}
    		else {
    			res.status(400).json("Wrong credentials!");
    		}
			})
		})
		.catch(err => res.status(400).json("Wrong credentials!"))
});

app.get('/profile/:id', (req,res) => {
	const {id} = req.params;
	db.select('*').from('users').where({id})
		.then( user => {
			if(user.length){
				res.json(user[0]);
			} else {
				res.status(404).json('User Not Found!');
			}
		})
		.catch( err => res.status(400).json('Error finding user!'))
})

app.put('/image', (req,res) =>{
	const {id} = req.body;
	db('users').where('id','=',id)
		.increment('entries',1)
		.returning('entries')
		.then( entries => {
			res.json(entries[0]);
		})
		.catch( err => res.status(400).json('Unable to fetch entries!'))
})

app.post('/register', (req,res) => {
	const { name, email, password } = req.body;
	bcrypt.hash(password, saltRounds, function(err, hash) {
		if (err) {
			return res.status(400).json("Server Error!!");
		} else {
	    db.transaction(trx => {
	    	return trx.insert({
		    	hash : hash,
		    	email : email
		    })
		    .into('login')
		    .returning('email')
		    .then(loginEmail => {
		    	return trx('users')
					.returning('*')
					.insert({
						email:loginEmail[0],
						name:name,
						joined: new Date()
					})
					.then( user => {
						res.json(user[0]);
					})
					.catch( err => res.status(400).json("Unable to Register!"));
		    })
		    .catch( err => res.status(400).json("Unable to Register!"));
		  })
		  .catch( err => res.status(400).json("Unable to Register!"))
		}
	})
})

app.listen( 3001, () => { 
	console.log('The app is running on port 3001');
})