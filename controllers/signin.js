const validEmailRegex = 
  RegExp(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i);

const handleSignin = (req,res,bcrypt,db) => {
  const { email, password } = req.body;
  if( !email || !password || || !validEmailRegex.test(email)) {
    return res.status(400).json('Invalid Input!!');
  }
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
}

module.exports = {
    handleSignin : handleSignin
};