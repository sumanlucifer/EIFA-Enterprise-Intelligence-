const axios = require('axios');
const path = require("path");
const parentDir = path.join(__dirname, '../../')
const dotenv = require("dotenv");
dotenv.config({
	path: `${parentDir}/.env`
});

const getQueryInputs = async(data) => {
	try {
		let responseObject = {};
		var config = {
			method: 'post',
			url: process.env.DATA_MODEL_URL,
			data: data
		};	
		//console.log(config)
		let response = await axios(config);
		console.log('response--->', JSON.stringify(response.data))
		responseObject.status = 'success';
		let queryInputs = [];
		queryInputs.push(response.data)
		responseObject.queryInputs = response.data;
		return responseObject;
	} catch (e) {
		console.log('Exception message---->', e.message);
		let responseObject = {};
		responseObject.status = 'error';
		responseObject.message = e.message;
		return responseObject;
	}

}

exports.getQueryInputs = getQueryInputs;