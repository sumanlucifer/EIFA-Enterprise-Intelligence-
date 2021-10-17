const {
	addanalysis,
	getalluseranalysis,
	getuseranalysis,
	removeanalysis
} = require("../service/analysis.service");
const {
	transactionService
} = require("../service/transactional.service");

//import validation
const {
	validateaddanalysisData,
	validateviewanalysisData
} = require("../service/validation.service");

/************* Get all user analysis ******************/
const getalluseranalysisController = async(req, res) => {
	try {
		let response = await getalluseranalysis(req.user);
		if (response.status == 'success') {
			res.status(200).send(response);
		} else {
			res.status(500).send(response);
		}
	} catch (ex) {
		res.status(500).send({
			status: 'error',
			message: ex.message
		});
	}
}

/************* Add user analysis ******************/
const addanalysisController = async(req, res) => {
	try {
		let reqBody = req.body;
		const {
			error
		} = validateaddanalysisData(reqBody);
		if (error) return res.status(400).send({
			status: "error",
			message: error.details[0].message
		});
		let response = await addanalysis(reqBody, req.user);
		// res.status(200).send(response);
		if (response.status == 'success') {
			response.message = 'Favourites added successfully!'
			res.status(200).send(response);
		} else {
			res.status(500).send(response);
		}

	} catch (ex) {
		res.status(500).send({
			status: 'error',
			message: ex.message
		});
	}
};

/************* Get specific user analysis ******************/
const getuseranalysisController = async(req, res) => {
	try {
		let reqBody = req.body;
		const {
			error
		} = validateviewanalysisData(reqBody);
		if (error) return res.status(400).send({
			status: "error",
			message: error.details[0].message
		});
		let response = await getuseranalysis(reqBody, req.user);
		if (response.status == 'success') {
			res.status(200).send(response);
		} else {
			res.status(500).send(response);
		}
	} catch (ex) {
		res.status(500).send({
			status: 'error',
			message: ex.message
		});
	}
}

/************* Remove specific user analysis ******************/
const removeanalysisController = async(req, res) => {
	try {
		let reqBody = req.body;
		const {
			error
		} = validateviewanalysisData(reqBody);
		if (error) return res.status(400).send({
			status: "error",
			message: error.details[0].message
		});
		let response = await removeanalysis(reqBody, req.user);
		// res.status(200).send(response);
		if (response.status == 'success') {
			res.status(200).send(response);
		} else {
			res.status(500).send(response);
		}

	} catch (ex) {
		res.status(500).send({
			status: 'error',
			message: ex.message
		});
	}
}

exports.getalluseranalysisController = getalluseranalysisController;
exports.addanalysisController = addanalysisController;
exports.getuseranalysisController = getuseranalysisController;
exports.removeanalysisController = removeanalysisController;