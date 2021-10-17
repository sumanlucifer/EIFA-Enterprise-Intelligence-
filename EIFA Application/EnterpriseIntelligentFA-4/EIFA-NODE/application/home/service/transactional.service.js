const {
	executeQuery
} = require('../DAO/hanaDAO');


const transactionService = async(body) => {
	let userId = body.user ? body.user.id : 'unknown';
	let QueryDesc = body.QueryDesc ? body.QueryDesc : '';
	let QuerySQL = body.QuerySQL ? body.QuerySQL.replace(/'/g,"''") : '';
	let ParentUserTransactionID = body.ParentUserTransactionID ? body.ParentUserTransactionID : null;
	let ChartType = body.ChartType ? body.ChartType : '';
	let QueryLibraryID = body.QueryLibraryID ? body.QueryLibraryID : null;
	let UserFavoriteID = body.UserFavoriteID ? body.UserFavoriteID : null;
	let QueryKeywords= body.QueryKeywords ? body.QueryKeywords : null;
	let QuerySource = body.QuerySource ? body.QuerySource : 'New';
	let IsValidQuery = body.IsValidQuery ? body.IsValidQuery : 0;
	let IsDataPresent = body.IsDataPresent ? body.IsDataPresent : 0;
	let bodyObj = [
		`CREATE LOCAL TEMPORARY TABLE #TEMPTABLE LIKE "7948535F11F94C619C2DE45470343ED7"."EIFA.db.appTableTypes::uttInsUserTransaction"`,
		`INSERT INTO #TEMPTABLE VALUES('` + userId + `', '` + QueryDesc + `','` + QuerySQL + `', ` + ParentUserTransactionID + `,'` + ChartType +
		`',` + QueryLibraryID + `,` + UserFavoriteID + `,'` + QuerySource + `',` + IsValidQuery + `,` + IsDataPresent + `,'` + QueryKeywords + `')`,
		`CALL "7948535F11F94C619C2DE45470343ED7"."EIFA.db.appProcedures::uspInsUserTransaction"('` + userId + `',#TEMPTABLE)`
	];
	const response = await executeQuery(bodyObj);
	return response;
}

exports.transactionService = transactionService;