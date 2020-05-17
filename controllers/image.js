const Clarifai = require('clarifai');

//Please enter your own Clarifai API key here
const app = new Clarifai.App({
	apiKey: '1af9641b4694479fb7dbd55b7e27da69'
});

const handleImage = (req,res,db) =>{
	const {id} = req.body;
	db('users').where('id','=',id)
		.increment('entries',1)
		.returning('entries')
		.then( entries => {
			res.json(entries[0]);
		})
		.catch( err => res.status(400).json('Unable to fetch entries!'))
}

const handleApiCall = (req,res) => {
	app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
		.then(data => {
			res.json(data);
		})
		.catch(err => res.status(400).json('Error detecting face!!'))
}

module.exports = {
	handleImage,
	handleApiCall
};