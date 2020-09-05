const validEmailRegex = 
  RegExp(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i);

const handleRegister = (req,res,db,bcrypt,saltRounds) => {
	const { name, email, password } = req.body;
	if(!name || !email || !password || !validEmailRegex.test(email)) {
		return res.status(400).json("Invalid input!!");
	}
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
}

module.exports = {
	handleRegister : handleRegister
};