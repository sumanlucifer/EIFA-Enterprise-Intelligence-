const {
	currencyConversion
} = require('../../base/util/library');

const getTileView = async(body, user) => {
	let responseJson = {};
	responseJson.status = 'success';
	responseJson.data = [{
		tilename: 'Revenue - FY20',
		value: '$ ' + currencyConversion(644689640.80),
		change: '-1.55%'
	}, {
		tilename: 'Gross Profit - FY20',
		value: '$ ' + currencyConversion(225053529.00),
		change: '-16.32%'
	}, {
		tilename: 'Working Capital - FY20',
		value: '$ ' + currencyConversion(1371163272),
		change: '-48.41%'
	}, {
		tilename: 'Profit/Loss - FY20',
		value: '$ ' + currencyConversion(83754341),
		change: '-44.97%'
	}, {
		tilename: 'EBIT Margin - FY20',
		value: '14.97%',
		change: '19.32%'
	}];
	return responseJson;
}

const getRecommendation = async(user) => {
	let responseJson = {};
	responseJson.status = 'success';
	responseJson.data = [{
		recommendation: "what is expected revenue for next 3 years?"
	}, {
		recommendation: "what is the forecasted revenue for turkey?"
	}, {
		recommendation: "what is the predicted revenue by country?"
	}, {
		recommendation: "what is the forecasted revenue for Belgium?"
	}, {
		recommendation: "what is the revenue  trend for next year?"
	}];
	return responseJson;
}

exports.getTileView = getTileView;
exports.getRecommendation = getRecommendation;