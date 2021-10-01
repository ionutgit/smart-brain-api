const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

const database = {
	users: [
		{
			id: '123',
			name: 'John',
			email: 'john@gmail.com',
			password: 'cookies',
			entries: 0,
			joined: new Date()
		},
		{
			id: '124',
			name: 'Sally',
			email: 'sally@gmail.com',
			password: 'banans',
			entries: 0,
			joined: new Date()
		}
	]
}

app.get('/', (req, res) => {
	res.json(database.users);
})

app.post('/signin', (req, res) => {
	// res.send('signin');
	if (req.body.email === database.users[0].email &&
				req.body.password === database.users[0].password) {
		res.json('success');
	} else {
		res.status(400).json('login failed');
	}
})

app.post('/register', (req, res) => {
	database.users.push({
		id: '125',
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		entries: 0,
		joined: new Date()
	})
	res.json(database.users[database.users.length-1])
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

app.post('/image', (req, res) => {
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

app.listen(3000, () => {
	console.log('app is running on port 3000');
})

/*
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userID --> GET = user
/image --> PUT --> user

*/
