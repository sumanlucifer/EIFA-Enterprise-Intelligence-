const {
	getKeywords
} = require("../service/conai.service");
const {
	getQueryInputs
} = require("../service/datamodel.service");
const {
	build
} = require("../../base/util/sql-query-builder");
const {
	queryResponse
} = require("../service/query.service");
const {
	addFavourite,
	removeFavourite,
	getFavouritebyUser,
	getInsightsbyUser
} = require("../service/favourite.service");
const {
	transactionService
} = require("../service/transactional.service");
const {
	getTileView,
	getRecommendation
} = require("../service/kpi.service");

//import validation
const {
	validateaddFilterData,
	validatedeleteFilterData
} = require("../service/validation.service");

const homeController = async(req, res) => {
	try {
		res.status(200).render('index', {
			title: 'Enterprise Intelligence Finance Advisor'
		});
	} catch (ex) {
		res.status(500).send('index', {
			title: 'Enterprise Intelligence Finance Advisor'
		});
	}
};

const getUserController = async(req, res) => {
	try {
		let response = {
			status: 'success',
			userId: req.user.id,
			name: req.user.name,
			email: req.user.emails[0].value
		}
		res.status(200).send(response);
	} catch (ex) {
		res.status(500).send({
			status: 'error',
			message: ex.message
		});
	}
};

const gettileviewController = async(req, res) => {
	try {
		let response = await getTileView(req.user);
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

const getfavouriteController = async(req, res) => {
	try {
		let response = await getFavouritebyUser(req.user);
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

const getInsightsController = async(req, res) => {
	try {
		let response = await getInsightsbyUser(req.user);
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

const addfavouriteController = async(req, res) => {
	try {
		let reqBody = req.body;
		const {
			error
		} = validateaddFilterData(reqBody);
		if (error) return res.status(400).send({
			status: "error",
			message: error.details[0].message
		});
		let response = await addFavourite(reqBody, req.user);
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

const removefavouriteController = async(req, res) => {
	try {
		let reqBody = req.body;
		const {
			error
		} = validatedeleteFilterData(reqBody);
		if (error) return res.status(400).send({
			status: "error",
			message: error.details[0].message
		});
		let response = await removeFavourite(reqBody, req.user);
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

const searchController = async(req, res) => {
	try {
		let keyword = req.body.keyword;
		let user = req.user;
		let client = req.db;
		//	console.log('keyword', client)
		let conairesponse = await getKeywords(req.body, user);
		if (conairesponse.status == 'success') {
			if (conairesponse.type == 'question' && conairesponse.validQuestion) {
				conairesponse.data.data = conairesponse.data.data.map(e => (isNaN(e) ? e : e * 1));
				conairesponse.data.others = conairesponse.data.others.map(e => (isNaN(e) ? e : e * 1))
				console.log('conairesponse.queryInputs---->', conairesponse.data)
				let datamodelresponse = await getQueryInputs(conairesponse.data);
				if (datamodelresponse.status == 'success') {

					//	console.log('datamodelresponse.queryInputs---->', JSON.stringify(datamodelresponse.queryInputs));
					let buildquery = await build(datamodelresponse.queryInputs);
					console.log('buildquery--->', JSON.stringify(buildquery))
					if (buildquery.status == 'success' && buildquery.query != '') {

						buildquery = {...conairesponse,
							...datamodelresponse,
							...buildquery
						}
						let querystatement = buildquery.query.replace(/""/g, '"');
						let executeQuery = await queryResponse(querystatement, 'query', conairesponse.data.titleFields);
						if (executeQuery.status == 'success') {
							executeQuery.sql = querystatement;
							executeQuery.question = keyword;
							executeQuery.suggestedQuestions = datamodelresponse.queryInputs.length > 0 ? datamodelresponse.queryInputs[0].kpi : [];
						}
						//console.log('WWWWWWWWWWWWWWWWW',JSON.stringify(executeQuery.sql))
						transactionService({
							user: req.user,
							QueryDesc: req.body.keyword,
							QuerySQL: executeQuery.sql,
							ParentUserTransactionID: null,
							ChartType: executeQuery.chartType,
							QueryKeywords: conairesponse.data.keywordsObj,
							QueryLibraryID: null,
							UserFavoriteID: null,
							QuerySource: 'New',
							IsValidQuery: 1,
							IsDataPresent: executeQuery.dataFound ? 1 : 0
						});
						if (executeQuery.status == 'success' && executeQuery.validQuestion) {
							res.status(200).send(executeQuery);
						} else {
							executeQuery.validQuestion = false;
							res.status(500).send(executeQuery);
						}
					} else if (buildquery.status == 'success' && buildquery.query == '') {
						delete buildquery.query;
						buildquery.errorText = "Sorry! I did not understand what you meant by " + keyword + ". Do you want me to learn the same?";
						res.status(200).send(buildquery);
					} else {
						buildquery.validQuestion = false;
						res.status(500).send(buildquery);
					}
				} else {
					datamodelresponse.validQuestion = false;
					res.status(500).send(datamodelresponse);
				}
			} else if (conairesponse.type == 'question' && !conairesponse.validQuestion) {
				transactionService({
					user: req.user,
					QueryDesc: req.body.keyword,
					QuerySQL: '',
					ParentUserTransactionID: null,
					ChartType: '',
					QueryKeywords: null,
					QueryLibraryID: null,
					UserFavoriteID: null,
					QuerySource: 'New',
					IsValidQuery: 0,
					IsDataPresent: 0
				})
				conairesponse.validQuestion = false;
				res.status(500).send(conairesponse);
			} else {
				res.status(200).send(conairesponse);
			}
		} else {
			conairesponse.validQuestion = false;
			res.status(500).send(conairesponse);
		}
	} catch (ex) {
		res.status(500).send({
			status: 'error',
			validQuestion: false,
			message: ex.message
		});
	}
}

const getRecommendationController = async(req, res) => {
	try {
		
		let response = await getRecommendation(req.user);
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

exports.homeController = homeController;
exports.addfavouriteController = addfavouriteController;
exports.getfavouriteController = getfavouriteController;
exports.searchController = searchController;
exports.removefavouriteController = removefavouriteController;
exports.gettileviewController = gettileviewController;
exports.getUserController = getUserController;
exports.getInsightsController = getInsightsController;
exports.getRecommendationController =getRecommendationController;