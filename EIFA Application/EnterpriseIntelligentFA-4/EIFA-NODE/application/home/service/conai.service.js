const axios = require('axios');
const path = require("path");
const parentDir = path.join(__dirname, '../../');
const {
	executeQuery
} = require('../DAO/hanaDAO');
const dotenv = require("dotenv");
dotenv.config({
	path: `${parentDir}/.env`
});

const getKeywords = async(reqBody, user) => {
	try {
		let userId = user ? user.id : 'unknown';
		let keyword = reqBody.keyword ? reqBody.keyword : '';
		let initialQuestion = reqBody.initialQuestion != undefined ? reqBody.initialQuestion : true;
		let responseObject = {};

		var config = {
			method: 'post',
			url: process.env.CON_AI_URL,
			headers: {
				'Authorization': 'Token ' + process.env.CON_AI_TOKEN,
				'Content-Type': 'application/json'
			},
			data: {
				"message": {
					"type": "text",
					"content": keyword.replace('?', '')
				},
				"conversation_id": "EIFA-" + Math.random() + '-' + new Date().toISOString()
			}
		};
		let keywords = [];
		if (initialQuestion == 'false' || !initialQuestion) {
			let bodyObj = [
				`CALL "7948535F11F94C619C2DE45470343ED7"."EIFA.db.appProcedures::uspGetbyUserIDLastUsrTrnsctn"('` + userId + `')`
			];
			const response = await executeQuery(bodyObj);
			//console.log('hdbResponse---------->', response);
			if (response.status == 'success' && response.result.length > 0) {
				keywords = response.result[0].QueryKeywords ? JSON.parse(response.result[0].QueryKeywords) : [];
			} else {
				console.log('Error occured in getting the transactional log---->', response)
			}
		}
		//console.log('keywords--->', keywords)
		let response = await axios(config);
		//console.log('response--->', response.data)
		let keywordsObj = [],
			others = [],
			titleFields = [];
		responseObject.status = 'success';
		let entitytypes = ['revenue_type', 'location_wise', 'sales_type', 'ei_segment_wise',
			'datetime', 'location', 'hana_fields', 'ei_countries', 'navigation', 'speech_action', 'ebit', 'ei_entity', 'ei_actual', 'ei_expense',
			'ei_budget', "year_number", "value_wise", "ei_warranty", "ei_accountingnumberdescription", "ei_working-_capital",
			"ei_asset_turnover_ratio", "ei_warranty_claim", "ei_cash", "ei_warrantyexpense", "ei_warrantyliability", "ei_profit", "e_grossmargin",
			"ei_grossprofit", "ei_netprofit", "ei_grossmargin",
			"ei_ebitmargin", "ei_margin", "duration","ei_weekend","ei_holiday"
		];
		let metricEntities = ['revenue_type', "ei_profit", "e_grossmargin", "ei_grossprofit", "ei_netprofit", "ei_grossmargin", "ei_ebitmargin",
			"ei_margin", "ebit"
		];
		let othertypes = ['year_wise', 'change-in-sales', 'ei_lowest', 'ei_underperforming', 'ei_underlying-reasons', 'ei_predicted',
			'factor_wise',
			'ei_correlation',
			"ei_single_year", "ei_single_quarter", "percent", "ei_transaction"
		];
		let titletypes = ['year_wise', 'change-in-sales', 'ei_underperforming', 'ei_underlying-reasons', 'location', 'location_wise ',
			'ei_countries',
			'factor_wise', "value_wise", 'year_number', 'sales_type', "ei_single_year", "ei_single_quarter", "ei_lowest"
		];
		let integratedKeys = [...new Set([...keywords.map(e => e.entity_type), ...Object.keys(response.data.results.nlp.entities)])];
		let metricComparison = integratedKeys.filter(e => {
			return metricEntities.indexOf(e) !== -1;;
		});
		//console.log('metricComparison----->', integratedKeys, metricComparison)
		if (metricComparison.length > 1) {
			//keywords = metricComparison;
			let metrics = [];
			keywords = keywords.filter(function (element) {
				return metricComparison.indexOf(element.entity_type) !== -1;
			});
		}
		//console.log('initialKeyword---->', keywords)
		let includeyear = true,
			includeYearly = false,
			includequarterly = true,
			includePredictive = false;
		for (let n = 0; n < keywords.length; n++) {
			//	console.log(keywords[n].entity_type);
			let rawValue = keywords[n].keyword;
			if (keywords[n].entity_type == 'year_wise' || keywords[n].entity_type == 'year_number' || keywords[n].entity_type == 'factor_wise' || (
					keywords[n].entity_type == 'hana_fields' && (rawValue == 'year' || rawValue ==
						'yearly' || rawValue ==
						'years')) || (keywords[n].entity_type == 'duration' && rawValue.indexOf('years') > -1)) {
				includeyear = false;
			}
			if (keywords[n].entity_type == 'location_wise' || keywords[n].entity_type == 'ei_segment_wise' || keywords[n].entity_type ==
				'hana_fields' || keywords[n].entity_type == 'ei_entity' || keywords[n].entity_type ==
				'year_wise' || (keywords[n].entity_type == 'ei_lowest' && keywords[n].keyword == 'cut off') || keywords[n].entity_type == 'ei_weekend' || keywords[n].entity_type == 'ei_holiday' || keywords[n].entity_type == 'factor_wise' || (keywords[n].entity_type == 'duration' && rawValue.indexOf('years') > -1)) {
					includequarterly = false;
			}
			if (keywords[n].entity_type == 'year_wise' || keywords[n].entity_type == 'factor_wise' || (keywords[n].entity_type == 'duration' &&
					rawValue.indexOf('years') > -1)) {
				includeYearly = true;
			}
			if (keywords[n].entity_type == 'ei_single_year') {
				includeYearly = false;
				includeyear = false;
				includequarterly = true;
			}
			if (keywords[n].entity_type == 'ei_predicted') {
				includePredictive = true;
			}

		}
		let sortEntities = Object.keys(response.data.results.nlp.entities).filter(e => {
			return (e == 'change-in-sales' || e == 'ei_lowest')
		});
		if (sortEntities.length > 1) {
			delete response.data.results.nlp.entities[sortEntities[sortEntities.length - 1]]
		}
		for (let key in response.data.results.nlp.entities) {
			//console.log('###################################', key, response.data.results.nlp.entities[key][0], entitytypes.indexOf(key) > -1);
			if (entitytypes.indexOf(key) > -1 || othertypes.indexOf(key) > -1 || key == 'duration') {

				for (let i = 0; i < response.data.results.nlp.entities[key].length; i++) {
					let rawValue = response.data.results.nlp.entities[key][i].raw;
					//console.log('YYYYYYYYYY', key == 'duration' && rawValue.indexOf('year') > -1 && rawValue.indexOf('years') == -1)
					// if (key == 'datetime') {
					// 	response.data.results.nlp.entities[key][i].raw = response.data.results.nlp.entities[key][i].raw.replace(/\D/g, '');
					// }
					//console.log('$$$$$$$$$$$$', response.data.results.nlp.entities[key][i].raw)
					let yearValue = response.data.results.nlp.entities[key][i].value ? response.data.results.nlp.entities[key][i].value : response.data.results
						.nlp.entities[key][i].raw;
					if (key == 'year_number' || key == 'year_wise' || key == 'factor_wise' || (key == 'hana_fields' && (rawValue == 'year' || rawValue ==
							'yearly' || rawValue ==
							'years')) || (key == 'duration' && rawValue.indexOf('years') > -1)) {
						includeyear = false;
					}
					if (key == 'location_wise' || key == 'ei_entity' || key == 'ei_segment_wise' || key == 'hana_fields' || key == 'ei_entity' || key ==
						'factor_wise'  || (key == 'ei_lowest' && rawValue == 'cut off') || key == 'ei_weekend' || key == 'ei_holiday'  || key == 'year_wise' || (key == 'duration' && rawValue.indexOf('years') > -1)) {
						includequarterly = false;
					}
					if (key == 'year_wise' || key == 'factor_wise' || (key == 'duration' && rawValue.indexOf('years') >
							-1)) {
						includeYearly = true;
					}
					if (key == 'ei_single_year') {
						includeYearly = false;
						includeyear = false;
						includequarterly = true;
					}
					if (key == 'ei_predicted') {
						includePredictive = true;
					}
					if ((key == 'location_wise' || key == 'ei_segment_wise')) {
						keywords = keywords.filter(e => {
							return (e.entity_type != 'location_wise' && e.entity_type != 'ei_segment_wise')
						});
						keywords.push({
							entity_type: key,
							keyword: response.data.results.nlp.entities[key][i].value ? response.data.results.nlp.entities[key][i].value : response.data.results
								.nlp.entities[key][i].raw,
							value: response.data.results.nlp.entities[key][i].value ? response.data.results.nlp.entities[key][i].value : response.data.results
								.nlp.entities[key][i].raw
						});
					}
					if (keywords.map(e => e.entity_type).indexOf(key) > -1) {
						let index = keywords.map(e => e.entity_type).indexOf(key);
						keywords[index].keyword = response.data.results.nlp.entities[key][i].value ? response.data.results.nlp.entities[key][i].value :
							response.data.results
							.nlp.entities[key][i].raw;
						keywords[index].value = response.data.results.nlp.entities[key][i].value ? response.data.results.nlp.entities[key][i].value :
							response.data.results
							.nlp.entities[key][i].raw;
					} else {

						keywords.push({
							entity_type: key,
							keyword: response.data.results.nlp.entities[key][i].value ? response.data.results.nlp.entities[key][i].value : response.data.results
								.nlp.entities[key][i].raw,
							value: response.data.results.nlp.entities[key][i].value ? response.data.results.nlp.entities[key][i].value : response.data.results
								.nlp.entities[key][i].raw
						});
					}
				}
			}
		}
		//console.log('keywords----->', keywords)
		for (let m = 0; m < titletypes.length; m++) {
			if (keywords.map(e => e.entity_type).indexOf(titletypes[m]) > -1) {
				responseObject.type = 'question';
				let titleObj = keywords.filter(e => e.entity_type == titletypes[m]);
				titleFields.push(titleObj.map(
					e =>
					e.keyword)[0]);
			}
		}
		//	console.log('keyword----?', keywords)
		for (let m = 0; m < othertypes.length; m++) {
			if (keywords.map(e => e.entity_type).indexOf(othertypes[m]) > -1) {
				responseObject.type = 'question';
				let otherObj = keywords.filter(e => e.entity_type == othertypes[m]);
				if (keywords.map(e => e.entity_type).indexOf(othertypes[m]) > -1) {
					others.push(otherObj.map(
						e =>
						e.keyword)[0])
				}
				// others = keywords.map(e => e.entity_type).indexOf(othertypes[m]) > -1 ? keywords.filter(e => e.entity_type == othertypes[m]).map(e =>
				// 	e.keyword) : [];
				if (keywords.map(e => e.entity_type).indexOf(othertypes[m]) > -1) {
					keywordsObj = [...keywords.filter(e => e.entity_type == othertypes[m])];
				}
				keywords = keywords.filter(e => e.entity_type != othertypes[m]);
			}
		}

		if (keywords.map(e => e.entity_type).indexOf('navigation') > -1) {
			responseObject.type = 'navigation';
			responseObject.navigateto = keywords.filter(e => e.entity_type == 'navigation')[0].value;
		} else if (keywords.map(e => e.entity_type).indexOf('speech_action') > -1) {
			responseObject.type = 'action';
			responseObject.navigateto = keywords.filter(e => e.entity_type == 'speech_action')[0].value;
		} else if (keywords.map(e => e.entity_type).indexOf('ebit') > -1) {
			responseObject.type = 'question';
			keywordsObj = [...keywordsObj, ...keywords];
			keywords = keywords.map(e => e.entity_type).indexOf('ebit') > -1 ? keywords.map(e => e.keyword) : [];
		} else {
			responseObject.type = 'question';
			keywordsObj = [...keywordsObj, ...keywords];
			keywords = keywords.map(e => e.keyword);
			if (keywords.indexOf('year') > -1) {
				includeyear = false;
			}
		}
		//console.log('keywordsObj----------->', keywordsObj);
		if (responseObject.type == 'question') {
			responseObject.validQuestion = (keywords.length > 0 || others.length > 0) ? true : false;
			if (!responseObject.validQuestion) {
				responseObject.errorText = "Sorry! I did not understand what you meant by " + keyword + ". Do you want me to learn the same?";
			} else {
				//console.log('includeyear--->', includeyear)
				//console.log('includequarterly--->', includequarterly)
				//console.log('includeYearly--->', includeYearly)
				//console.log('includePredictive--->', includePredictive)
				if (includeyear && !includePredictive) {
					if (keywordsObj.map(e => e.entity_type).indexOf('ei_lowest') == -1 && keywordsObj.map(e => e.keyword).indexOf('cut off') == -1) {
						others.push('this year');
						titleFields.push('FY' + (new Date().getFullYear() - 1).toString().slice(-2));
					}
				}
				if (includequarterly && !includePredictive) {
					keywords.push('quarter');
				}
				//console.log('ddddddddd',includeYearly,keywordsObj.map(e => e.entity_type))
				if (includeYearly && !includePredictive) {
					if (keywordsObj.map(e => e.entity_type).indexOf('ei_single_year') > -1 || keywordsObj.map(e => e.entity_type).indexOf('year_number') >
						-1) {
						keywords.push('quarter');
					} else {
						keywords.push('year');
					}
				}
				if (includePredictive) {

					if (keywords.indexOf('quarterly') != -1 || keywords.indexOf('monthly') != -1) {
						//console.log(keywords.indexOf('quarterly'));
						if (includeyear) {
							keywords.push((new Date().getFullYear() - 1));
							titleFields.push('FY' + (new Date().getFullYear() - 1).toString().slice(-2));
						}
						//	keywords.push('year');
					} else {
						if (keywordsObj.map(e => e.entity_type).indexOf('ei_single_year') > -1 || keywordsObj.map(e => e.entity_type).indexOf('year_number') >
							-1) {
							keywords.push('quarter');
						} else {
							keywords.push('year');
						}
					}

				}
				responseObject.data = {
					data: keywords,
					others: others,
					titleFields: titleFields,
					keywordsObj: JSON.stringify(keywordsObj)
				};
			}
		} else {

		}
		//console.log('keywords------------->', responseObject)
		return responseObject;
	} catch (e) {
		//console.log('Exception message---->', e.message);
		let responseObject = {};
		responseObject.status = 'error';
		responseObject.message = 'Error occured in CON AI API, ' + e.message;
		return responseObject;
	}

}

exports.getKeywords = getKeywords;