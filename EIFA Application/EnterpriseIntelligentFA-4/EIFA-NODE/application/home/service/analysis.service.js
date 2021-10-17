const {
	executeQuery
} = require('../DAO/hanaDAO');
const {
	queryResponse
} = require('./query.service');
const {
	transactionService
} = require("./transactional.service");
const {
	dateConversion
} = require('../../base/util/library');

/********** Get all user analysis ***********/
const getalluseranalysis = async(user) => {
	let userId = user ? user.id : 'unknown';
	let bodyObj = [
		`CALL "7948535F11F94C619C2DE45470343ED7"."EIFA.db.appProcedures::uspGetbyUserIDSaveAnalysisSummary"('` + userId + `')`
	];
	const response = await executeQuery(bodyObj);
	if (response.status == 'success' && response.result.length > 0) {
		response.charts = [];
		for (let i = 0; i < response.result.length; i++) {
			let executeQuery = await queryResponse(response.result[i].QuerySQL, 'favourites', response.result[i].QueryDesc);
			if (executeQuery.status == 'success') {
				executeQuery.validQuestion = true;
				executeQuery.sql = response.result[i].QuerySQL;
				executeQuery.question = response.result[i].QueryDesc;
				executeQuery.ChartId = response.result[i].UserSaveAnalysisHeaderID;
				delete executeQuery.status;
				response.charts.push(executeQuery);
			} else {
				console.log('Exception in favourites------->', executeQuery)
			}
			if (response.result.length - 1 == i) {
				delete response.result;
				return response;
			}
		}
		return response;
	} else {
		response.charts = [];
		delete response.result;
		return response;
	}

}

/********** Add specific user analysis1 ***********/
const addanalysis = async(body, user) => {
	let userId = user ? user.id : 'unknown';
	let anlaysisName = body.anlaysisName ? body.anlaysisName : '';
	let anlaysis = body.anlaysis ? body.anlaysis : [];
	if (anlaysis.length > 0) {
		let bodyObj = [
			`CREATE LOCAL TEMPORARY TABLE #TEMPTABLE LIKE "7948535F11F94C619C2DE45470343ED7"."EIFA.db.appTableTypes::uttInsUserSaveAnalysisInitial"`,
		];
		for (let i = 0; i < anlaysis.length; i++) {
			let queryDesc = anlaysis[i].question ? anlaysis[i].question : '';
			let querySQL = anlaysis[i].sql ? anlaysis[i].sql.replace(/'/g, "''") : '';
			let chartType = anlaysis[i].chartType ? anlaysis[i].chartType : '';
			let comments = anlaysis[i].comments ? anlaysis[i].comments : '';
			bodyObj.push(`INSERT INTO #TEMPTABLE VALUES('` + userId + `', '` + queryDesc + `','` + querySQL + `','` + chartType + `',null,` + (i +
				1) + `,'` + comments + `')`);

		}
		bodyObj.push(`CALL "7948535F11F94C619C2DE45470343ED7"."EIFA.db.appProcedures::uspInsUserSaveAnalysisInitial"('` + userId +
			`','` + anlaysisName + `',#TEMPTABLE)`);
		bodyObj.push(
			`select "UserSaveAnalysisHeaderID" from "7948535F11F94C619C2DE45470343ED7"."EIFA.db.appTables::appUserSaveAnalysisHeader" where "UserID" ='` +
			userId + `' order by "UserSaveAnalysisHeaderID" desc limit 1`
		);
		const response = await executeQuery(bodyObj);
		if (response.status == 'success') {
			await transactionService({
				user: user,
				QueryDesc: anlaysisName,
				QuerySQL: anlaysis[anlaysis.length - 1].sql,
				ParentUserTransactionID: null,
				ChartType: anlaysis[anlaysis.length - 1].chartType ? anlaysis[anlaysis.length - 1].chartType : '',
				QueryLibraryID: null,
				QueryKeyword: null,
				UserSaveAnalysisHeaderID: response.result.length > 0 ? response.result[0].UserSaveAnalysisHeaderID : null,
				QuerySource: 'Favorites',
				IsValidQuery: 1,
				IsDataPresent: 1
			});
			response.UserSaveAnalysisHeaderID = response.result.length > 0 ? response.result[0].UserSaveAnalysisHeaderID : null;
			delete response.result;
		}
		return response;
	} else {
		return {
			status: 'error',
			message: 'No analysis data found!'
		};
	}

}

/********** Get specific user analysis ***********/
const getuseranalysis = async(body, user) => {
	let analysisId = body.analysisId ? body.analysisId : 0;
	let userId = user ? user.id : 'unknown';
	let bodyObj = [
		`CALL "7948535F11F94C619C2DE45470343ED7"."EIFA.db.appProcedures::uspGetbyUserIDAnalysisIDSaveAnlysDtl"('` + userId + `',` + analysisId +
		`)`
	];
	const response = await executeQuery(bodyObj);
	if (response.status == 'success' && response.result.length > 0) {
		response.charts = [];
		for (let i = 0; i < response.result.length; i++) {
			let executeQuery = await queryResponse(response.result[i].QuerySQL, 'favourites', response.result[i].QueryDesc);
			if (executeQuery.status == 'success') {
				executeQuery.validQuestion = true;
				executeQuery.sql = response.result[i].QuerySQL;
				executeQuery.question = response.result[i].QueryDesc;
				executeQuery.ChartId = response.result[i].UserSaveAnalysisHeaderID;
				executeQuery.comments = response.result[i].Comments ? response.result[i].Comments : '';
				executeQuery.ChartOrder = response.result[i].SaveAnalysisOrder;
				console.log('******************',response.result[i])
				executeQuery.date = dateConversion(new Date(response.result[i].CreatedOn));
				delete executeQuery.status;
				response.charts.push(executeQuery);
			} else {
				console.log('Exception in favourites------->', executeQuery)
			}
			if (response.result.length - 1 == i) {
				delete response.result;
				return response;
			}
		}
	} else {
		response.charts = [];
		delete response.result;
		return response;
	}

}

const removeanalysis = async(body, user) => {
	let userId = user ? user.id : 'unknown';
	let analysisId = body.analysisId ? body.analysisId : '';
	let bodyObj = [
		`CALL "7948535F11F94C619C2DE45470343ED7"."EIFA.db.appProcedures::uspDelUserSaveAnalysis"('` + userId + `','` + analysisId + `')`
	];
	const response = await executeQuery(bodyObj);
	if (response.status == 'success') {
		if (response.result > 0) {
			response.message = 'Analysis deleted successfully!';
		} else {
			response.status = 'error';
			response.message = 'No Analysis found !'
		}
	}
	return response
}

exports.getalluseranalysis = getalluseranalysis;
exports.addanalysis = addanalysis;
exports.getuseranalysis = getuseranalysis;
exports.removeanalysis = removeanalysis;