const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    port : 5432,
    user : 'postgres',
    password : 'Pass4postgre!',
    database : 'smart-brain'
  }
});

// db.select('*').from('users').then(data => {
// 	console.log(data);
// });

const app = express();

app.use(bodyParser.json());
app.use(cors());

const database = {
	users: [
		{
			id: '123',
			name: 'John',
			password: 'cookies',
			email: 'john@gmail.com',
			entries: 0,
			joined: new Date()
		},
		{
			id: '124',
			name: 'Sally',
			password: 'bananas',
			email: 'sally@gmail.com',
			entries: 0,
			joined: new Date()
		}
	],
	login : [
		{
			id: '987',
			hash: '',
			email: 'john@gmail.com',
		}
	]
}

app.get('/', (req, res) => {
	res.json(database.users);
})

app.post('/signin', (req, res) => {
	// res.send('signin');
	// // Load hash from your password DB.
	// bcrypt.compare("apple", '$2a$10$8uCOdtSxJZZMAUNDAVGoLOP.1m8QNaqJ4Auj9a8wOz8z/Hsrit/Xa', function(err, res) {
	//     console.log('first guess', res);
	// });
	// bcrypt.compare("veggies", '$2a$10$8uCOdtSxJZZMAUNDAVGoLOP.1m8QNaqJ4Auj9a8wOz8z/Hsrit/Xa', function(err, res) {
	//     console.log('second guess', res);
	// });
	if (req.body.email === database.users[0].email &&
				req.body.password === database.users[0].password) {
		res.json(database.users[0]);
	} else {
		res.status(400).json('login failed');
	}
})

app.post('/register', (req, res) => {
	const { name , email, password } = req.body;
	// bcrypt.hash(password, null, null, function(err, hash) {
 //    console.log(hash);
	// });
	db('users')
		.returning('*')
		.insert({
			email: email,
			name: name,
			joined: new Date()
	}).then(user => {
		res.json(user[0]);
	})
		.catch(err => res.status(400).json("unable to login"));
})

app.get('/profile/:id', (req, res) => {
	let found = false;
	database.users.forEach(user => {
		if (user.id === req.params.id) {
			found = true;
			return res.json(user);
		}
	})
	if (!found) {
		res.status(404).json('no such user');
	}
})

app.put('/image', (req, res) => {
	const { id } = req.body;
	let found = false;
	database.users.forEach(user => {
		if (user.id === id) {
			found = true;
			user.entries++;
			return res.json(user.entries);
		}
		if (!found) {
			res.status(400).json('not found');
		}
	})
})



// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });

app.listen(8000, () => {
	console.log('app is running on port 8000');
})

/*
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userID --> GET = user
/image --> PUT --> user

*/
