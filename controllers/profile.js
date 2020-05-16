const handleProfile = (req,res,db) => {
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
}

module.exports = {
	handleProfile : handleProfile
};