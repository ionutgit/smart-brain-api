const handleRegister = (req, res, db, bcrypt) => {
	const { name , email, password } = req.body;
	if (!email || !name || !password) {
		return res.status(400).json('incorrect form submission');
	}

	const hash = bcrypt.hashSync(password);
	db.transaction(trx => {
		trx.insert({
			hash: hash,
			email: email
		})
			.into('login')
			.returning('email')
			.then(loginEmail => {
				trx('users')
					.returning('*')
					.insert({
						email: email,
						name: name,
						joined: new Date()
				}).then(user => {
					res.json(user[0]);
				})
			})
				.then(trx.commit)
				.catch(trx.rollback);
	})
		.catch(err => res.status(400).json("unable to login"));
}

module.exports = {
	handleRegister: handleRegister
}
