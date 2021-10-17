const {
	executeQuery
} = require('../DAO/hanaDAO');
const {
	currencyConversion
} = require('../../base/util/library');
const groupBy = require("group-array");

const queryResponse = async(query, type, value) => {
	//	console.log('query1------>', query, type, value);
	//  console.log('mlinputs------>', mlinputs);
	const response = await executeQuery([query]);
	//console.log('FFFFFFFFFFFFFFFFFF', response);
	if (response.status == 'success') {
		let ytitle = "",
			titleView = "";
		if (response.result.length == 1 && query.indexOf('GROUP BY') == -1) {
			//console.log('SSSSSSSSSSSSSSSS', Object.keys(response.result[0]))
			response.chartType = 'metric';
			response.dataFound = false;
			response.data = {};
			for (let obj in response.result[0]) {
				response.dataFound = true;
				if (response.result[0][obj]) {
					response.data[obj] = 'USD ' + currencyConversion(response.result[0][obj]);
					if (type == 'favourites') {
						response.title = obj;
					} else {
						for (let k = 0; k < value.length; k++) {
							if (typeof value[k] == 'string') {
								titleView += (k == 0) ? (value[k].charAt(0).toUpperCase() + (value[k].slice(1)) + ' ') : (value[k].toLowerCase() + ' '); //((k == 0 || k== value.length-1) ? (value[k] + ' ') : keyObjects[k]);
							} else {
								titleView += value[k] + ' ';;
							}
						}
						response.title = titleView + obj;
					}

				}
			}
			response.validQuestion = true;
			if (Object.keys(response.data).length == 0) {
				response.validQuestion = false;
				response.errorText = 'No data found!';
				delete response.data;
			} else {

			}
			// response.data['REVENUE'] = response.result[0][Object.keys(response.result[0])[0]] ? '\u20AC' + currencyConversion(response.result[0][
			// 	Object.keys(response.result[0])[
			// 		0]
			// ]) : '$' + 0;
			response.currency = 'USD';
			delete response.result;
		} else {
			response.dataFound = false;
			if (response.result.length > 0) {

				response.dataFound = true;
				response.data = JSON.parse(JSON.stringify(response.result).split('"SUM":').join('"Revenue":'));
				response.data = response.data.map(e => {
					if (Object.keys(e).length > 0) {
						let obj = {}
						for (let [key, value] of Object.entries(e)) {
							obj[key] = Math.sign(value) != -1 ? value : -(value);
						}
						return obj
					} else {
						return e;
					}
				})

				let keyObjects = Object.keys(response.result[0]);

				response['axis'] = {
					y: [],
					x: []
				};
				let xlength = (query.split('GROUP BY')[1].substring(0, query.split('GROUP BY')[1].indexOf("ORDER BY")).match(/,/g) || []).length;
				xlength = xlength + 1;
				//console.log('xlength--------->', keyObjects,xlength);
				for (let k = 0; k < keyObjects.length - xlength; k++) {
					response['axis'].y.push(keyObjects[k]);
					//console.log('test------>',(keyObjects.length - (xlength + 1)),'$$$$$$$',k,'SSSSSS',(k != (keyObjects.length - (xlength + 1))))
					ytitle += ((k != (keyObjects.length - (xlength + 1))) ? (keyObjects[k] + ' - ') : keyObjects[k]);
				}
			
				for (let k = keyObjects.length - 1; k >= keyObjects.length - xlength; k--) {
					response['axis'].x.push(keyObjects[k]);
				}
				if(response['axis'].x.length > 0 && response['axis'].x.indexOf('Month') > -1 && response['axis'].x.indexOf('PostingPeriod') > -1){
					response['axis'].x.splice(response['axis'].x.indexOf('PostingPeriod'),1);
				}
				if (keyObjects.indexOf('Year') > -1 || keyObjects.indexOf('Quarter') > -1) {
					response.chartType = 'line';
				} else {
					response.chartType = 'column';
				}
				if (response.axis.x.length == 2 && response.axis.y.length == 1) {
					let grouped = groupBy(response.data, response.axis.x[0]);
					response['axis'].y = [];
					response['axis'].x = [];
					let data = [];
					for (let key in grouped) {
						let result = {};
						for (var i = 0; i < grouped[key].length; i++) {
							let keys = Object.keys(grouped[key][i]);
							result[keys[keys.length - 1]] = grouped[key][i][keys[keys.length - 1]];
							if (response['axis'].y.indexOf(grouped[key][i][keys[keys.length - 2]]) == -1) {
								response['axis'].y.push(grouped[key][i][keys[keys.length - 2]]);
							}
							if (response['axis'].x.indexOf(keys[keys.length - 1]) == -1) {
								response['axis'].x.push(keys[keys.length - 1]);
							}
							result[grouped[key][i][keys[keys.length - 2]]] = grouped[key][i][keys[keys.length - 3]];
						}
						data.push(result);
					}
					response.data = data;
					response.chartType = 'column';
					//console.log('grouped============>', response.data);
				}
				response.currency = 'USD';
				response.validQuestion = true;
				if (type == 'favourites') {
					response.title = value;
				} else {
					for (let k = 0; k < value.length; k++) {
						if (typeof value[k] == 'string') {
							titleView += (k == 0) ? 'for ' + (value[k].charAt(0).toUpperCase() + (value[k].slice(1)) + ' ') : '' + (value[k] +
								' '); //((k == 0 || k== value.length-1) ? (value[k] + ' ') : keyObjects[k]);
						} else {
							titleView += value[k];
						}

					}
					response.title = ytitle + ' by ' + response.axis.x.join().replace(/,/g, ', ') + ' ' + titleView;
				}
				if (response.axis.x.length > 2 && response.axis.y.length == 1) {
					response.chartType = 'table';
					//	response.data = data;
					response.header = keyObjects;
					response.data = response.data.slice(0, 5);
					response.header = response.header.map((e) => {
						let obj ={};
						obj["label"] = e;
						return obj;
					});
					delete response.axis;
				}

			} else {
				response.validQuestion = false;
				response.errorText = 'No data found!';
			}
			delete response.result;

		}
	}
	//console.log('response-------------------------->', response)
	response.type = 'question';
	return response;
}

exports.queryResponse = queryResponse;