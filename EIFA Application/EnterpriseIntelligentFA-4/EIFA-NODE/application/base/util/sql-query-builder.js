// var sql = require("sql-query"),
// 	sqlQuery = sql.Query();
// sql.Query().select().prototype.custfunction = function () {
// 	return this;
// }
var sqlQuery = require("../sql-library/Query").Query(); //,sqlQuery = sql.Query();

const build = (tableNames) => {
	try {
		let responseJson = {};
		let finalQuery = '';
		//	console.log(JSON.stringify(tableNames));
		if (tableNames && tableNames.length > 0) {
			let sqlSelect = sqlQuery.select();

			//			console.log(sqlQuery)
			let query = sqlSelect;

			let groupbyFields = [];
			let validQuery = false;
			for (let i = 0; i < tableNames.length; i++) {
				if (tableNames[i].join.length > 0 || tableNames[i].fields.length > 0 || tableNames[i].aggregation.length > 0) {
					validQuery = true;
					if (tableNames[i].join && tableNames[i].join.length == 2) {
						query.from(tableNames[i].name.trim(), tableNames[i].join[0], tableNames[i].join[1]);
					} else {
						query.from(tableNames[i].name.trim());
					}
					if (tableNames[i].aggregation && tableNames[i].aggregation.length > 0) {
						for (let k = 0; k < tableNames[i].aggregation.length; k++) {
							query.fun(tableNames[i].aggregation[k].type, tableNames[i].aggregation[k].field).as(tableNames[i].aggregation[k].alias);
						}
					}
					if (tableNames[i].fields && tableNames[i].fields.length > 0) {
						for (let j = 0; j < tableNames[i].fields.length; j++) {
							let groupbyPresent = (tableNames[i].groupBy.length > 0 && tableNames[i].groupBy.indexOf(tableNames[i].fields[j].name) > -1) ? true :
								false;
							if (!groupbyPresent) {
								query.select(tableNames[i].fields[j].name);
								query.as(tableNames[i].fields[j].alias);
							}
						}
					}
					if (tableNames[i].fields && tableNames[i].fields.length == 0 && tableNames[i].aggregation && tableNames[i].aggregation.length == 0) {
						query.fun('SUM', 'Revenue').as('Revenue');
					}
					if (tableNames[i].where && tableNames[i].where.length > 0) {
						for (let l = 0; l < tableNames[i].where.length; l++) {
							if (tableNames[i].where[l].field != '' && tableNames[i].where[l].value != '') {
								let obj = {};
								if (typeof tableNames[i].where[l].value == 'string' && tableNames[i].where[l].value.indexOf('[') > -1 && tableNames[i].where[l].value
									.indexOf(']') > -1) {
									tableNames[i].where[l].value = tableNames[i].where[l].value.replace(/'/g, '"');
									tableNames[i].where[l].value = JSON.parse(tableNames[i].where[l].value);
								}
								if (typeof tableNames[i].where[l].value != 'object') {
									obj["__sql"] = [
										["UPPER(`" + tableNames[i].where[l].field + "`) = ?", [tableNames[i].where[l].value]]
									];
								} else {
									obj["__sql"] = [
										["UPPER(`" + tableNames[i].where[l].field + "`) in ?", [tableNames[i].where[l].value]]
									];
								}
								query.where(obj);
							}
						}
					}
					if (tableNames[i].groupBy && tableNames[i].groupBy.length > 0) {
						for (let m = 0; m < tableNames[i].groupBy.length; m++) {
							if (tableNames[i].groupBy[m] == 'Date') {
								groupbyFields.push(tableNames[i].groupBy[m]);
								query.select(tableNames[i].groupBy[m]).as('Month');
							}else{
								groupbyFields.push(tableNames[i].groupBy[m]);
								query.select(tableNames[i].groupBy[m]).as(tableNames[i].groupBy[m]);
							}
						}
					}
					if (tableNames[i].having) {
						if (typeof tableNames[i].having == 'string') {
							query.having(tableNames[i].having);
						} else if (tableNames[i].having.length > 0) {
							for (let m = 0; m < tableNames[i].having.length; m++) {
								query.having(tableNames[i].having[m]);
							}
						}

					}
					if (tableNames[i].orderBy && tableNames[i].orderBy.length > 0) {
						for (let n = 0; n < tableNames[i].orderBy.length; n++) {
							let sortorder = (tableNames[i].orderBy[n].sortorder && tableNames[i].orderBy[n].sortorder == 'desc' ? 'Z' : 'A');
							let aggField = tableNames[i].aggregation.filter(e => e.field == tableNames[i].orderBy[n].field);
							let normalField = tableNames[i].fields.filter(e => e.field == tableNames[i].orderBy[n].field);
							let groupByField = tableNames[i].groupBy.filter(e => e == tableNames[i].orderBy[n].field);
							if (aggField.length > 0) {
								query.order(aggField[0].alias, sortorder);
							}
							if (normalField.length > 0) {
								query.order(normalField[0].alias, sortorder);
							}
							if (groupByField.length > 0) {
								query.order(groupByField[0], sortorder);
							}
						}
					} else {
						for (let n = 0; n < tableNames[i].groupBy.length; n++) {
							query.order(tableNames[i].groupBy[n]);
						}
					}
					if (tableNames[i].limit) {
						query.limit(tableNames[i].limit);
					}
					//console.log('groupbyFields----->', groupbyFields)
					if (i == tableNames.length - 1 && groupbyFields.length > 0) {
						query.groupBy(...groupbyFields);
					}
				}
			}
			//console.log('######', query.build().replace(/`/g, '"'));
			if (validQuery) {
				finalQuery = query.build().replace(/`/g, '"');
				if (tableNames[0].name.indexOf(')') > -1) {
					finalQuery = finalQuery.replace(')"', ')');
				}
				responseJson.status = 'success';
				responseJson.query = finalQuery;
			} else {
				responseJson.status = 'success';
				responseJson.type = 'question';
				responseJson.validQuestion = false;
				responseJson.query = '';
			}
		}

		return responseJson;
	} catch (e) {
		let responseJson = {};
		responseJson.status = 'error';
		responseJson.message = e.message;
		return responseJson;
	}

};

//Use case scenario

//Table 1
// id  companyname

//Table 2
//id companyid amount

//Request Object
// let reqObj = [{
//     name: "COMPANY",
//     join: [],
//     fields: [{
//         name: "id",
//         alias: "ID"
//     }, {
//         name: "company",
//         alias: "COMPANY"
//     }],
//     aggregation: [{
//         type: "count",
//         field: "id",
//         alias: "COUNT"
//     }],
//     where: [{
//         field: "company",
//         value: "Benz"
//     }, {
//         field: "id",
//         value: 1
//     }],
//     groupBy: ["COMPANY"],
//     orderBy: ["COMPANY"],
//     having: [],
//     limit: 1000

// }, {
//     name: "SALES",
//     join: ["companyid", "id"],
//     fields: [{
//         name: "id",
//         alias: "ID"
//     }, {
//         name: "companyid",
//         alias: "COMPANYID"
//     }, {
//         name: "amount",
//         alias: "AMOUNT"
//     }],
//     aggregation: [{
//         type: "count",
//         field: "id",
//         alias: "COUNT"
//     }],
//     where: [{
//         field: "AMOUNT",
//         value: 10000
//     }],
//     groupBy: ["AMOUNT"],
//     orderBy: ["AMOUNT"],
//     having: [],
//     limit: 1000

// }];

//build(reqObj);

exports.build = build;