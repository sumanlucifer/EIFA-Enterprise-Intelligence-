const {
	executeQuery
} = require('../DAO/hanaDAO');
const {
	queryResponse
} = require('./query.service');
const {
	transactionService
} = require("./transactional.service");

const addFavourite = async(body, user) => {
	let userId = user ? user.id : 'unknown';
	let queryDesc = body.question ? body.question : '';
	let querySQL = body.sql ? body.sql : '';
	let chartType = body.chartType ? body.chartType : '';
	let bodyObj = [
		`CREATE LOCAL TEMPORARY TABLE #TEMPTABLE LIKE "7948535F11F94C619C2DE45470343ED7"."EIFA.db.appTableTypes::uttInsUserFavorites"`,
		`INSERT INTO #TEMPTABLE VALUES('` + userId + `', '` + queryDesc + `','` + querySQL + `', null,'` + chartType + `')`,
		`CALL "7948535F11F94C619C2DE45470343ED7"."EIFA.db.appProcedures::uspInsUserFavorites"('` + userId + `',#TEMPTABLE)`,
		`select "UserFavoritesID" from "7948535F11F94C619C2DE45470343ED7"."EIFA.db.appTables::appUserFavorites" order by "UserFavoritesID" desc limit 1`
	];
	const response = await executeQuery(bodyObj);
	if (response.status == 'success') {
		await transactionService({
			user: user,
			QueryDesc: queryDesc,
			QuerySQL: querySQL,
			ParentUserTransactionID: null,
			ChartType: chartType,
			QueryLibraryID: null,
			QueryKeyword: null,
			UserFavoriteID: response.result.length > 0 ? response.result[0].UserFavoritesID : null,
			QuerySource: 'Favorites',
			IsValidQuery: 1,
			IsDataPresent: 1
		});
		response.UserFavoritesID = response.result.length > 0 ? response.result[0].UserFavoritesID : null;
		delete response.result;
	}
	return response;
}

const removeFavourite = async(body, user) => {
	let userId = user ? user.id : 'unknown';
	let userfavoritesID = body.favouriteId ? body.favouriteId : '';
	let bodyObj = [
		`CALL "7948535F11F94C619C2DE45470343ED7"."EIFA.db.appProcedures::uspDelUserFavorites"('` + userId + `','` + userfavoritesID + `')`
	];
	const response = await executeQuery(bodyObj);
	if (response.status == 'success') {
		if (response.result > 0) {
			response.message = 'Favourites deleted successfully!';
		} else {
			response.status = 'error';
			response.message = 'No Favourites found !'
		}
	}
	return response
}

const getFavouritebyUser = async(user) => {
	let userId = user ? user.id : 'unknown';
	let bodyObj = [
		`CALL "7948535F11F94C619C2DE45470343ED7"."EIFA.db.appProcedures::uspGetbyUserIDFavorites"('` + userId + `')`
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
				executeQuery.ChartId = response.result[i].UserFavoritesID;
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

const getInsightsbyUser = async(user) => {
	let userId = user ? user.id : 'unknown';
	let bodyObj = [
	`SELECT TOP 10
	"UserTransactionID",
	"UserID",
	"QueryDesc",
	"QuerySQL",
	"ParentUserTransactionID",
	"ChartType"
   FROM "7948535F11F94C619C2DE45470343ED7"."EIFA.db.appTables::appUserTransaction" where "IsValidQuery"=1 and "IsDataPresent" = 1 and "QuerySource"='New' and "UserID"='${userId}' Order by "UserTransactionID" desc;`
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
				executeQuery.ChartId = response.result[i].UserTransactionID;
				delete executeQuery.status;
				response.charts.push(executeQuery);
			} else {
				console.log('Exception in Insights------->', executeQuery)
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

exports.addFavourite = addFavourite;
exports.getFavouritebyUser = getFavouritebyUser;
exports.removeFavourite = removeFavourite;
exports.getInsightsbyUser = getInsightsbyUser;