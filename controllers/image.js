const Clarifai = require('clarifai');

const dotenv = require('dotenv');
dotenv.config();

const returnRequestOptions = (imageUrl) => {
    const PAT = '7c13d72fd80b41729c544f61fa3ad3ad';
    const USER_ID = 'clarifai';       
    const APP_ID = 'main';
    const MODEL_ID = 'face-detection';
    const IMAGE_URL = imageUrl;

    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": IMAGE_URL
                    }
                }
            }
        ]
    });

    return {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT,
            'Content-Type': 'application/json'
        },
        body: raw
    };
}

const handleApiCall = async (req, res) => {
	try {
        const MODEL_ID = 'face-detection';
		const response = await fetch(
            `https://api.clarifai.com/v2/models/${MODEL_ID}/outputs`, 
            returnRequestOptions(req.body.input)
        );
		const data = await response.json();

        console.log('Clarifai API Response:', JSON.stringify(data, null, 2));

		res.json(data);
	}
	catch (err) {
        console.error('API Error:', err);
		res.status(400).json('unable to work with api');
	} 
}

const handleImage = (req, res, db) => {
	const { id } = req.body;
	db('users').where('id', '=', id)
	.increment('entries', 1)
	.returning('entries')
	.then(entries => {
		res.json(entries[0].entries);
	}).catch(err => {
        console.error('Database Error:', err);
		res.status(400).json('Unable to get entries.');
	})
}

module.exports = {
	handleImage,
	handleApiCall
}