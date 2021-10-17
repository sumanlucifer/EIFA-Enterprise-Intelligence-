const Joi = require('joi');

function validateaddFilterData(request) {
	const schema = {
		question: Joi.string().required(),
		sql: Joi.string().required(),
		chartType: Joi.string().allow('').required()
	}
	return Joi.validate(request, schema);
}

function validatedeleteFilterData(request) {
	const schema = {
		favouriteId: Joi.number().required()
	}
	return Joi.validate(request, schema);
}

function validateaddanalysisData(request) {
	const schema = {
		anlaysisName: Joi.string().required(),
		anlaysis: Joi.array().items(Joi.object({
			question: Joi.string().required(),
			sql: Joi.string().required(),
			chartType: Joi.string().allow('').required(),
			comments: Joi.string().allow('').required()
		}))
	}
	return Joi.validate(request, schema);
}

function validateviewanalysisData(request) {
	const schema = {
		analysisId: Joi.number().required()
	}
	return Joi.validate(request, schema);
}

exports.validateaddFilterData = validateaddFilterData;
exports.validatedeleteFilterData = validatedeleteFilterData;
exports.validateaddanalysisData = validateaddanalysisData;
exports.validateviewanalysisData = validateviewanalysisData;