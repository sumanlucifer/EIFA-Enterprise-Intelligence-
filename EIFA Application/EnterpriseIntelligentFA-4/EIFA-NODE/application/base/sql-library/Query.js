var SelectQuery = require("./Select").SelectQuery;
var Comparators = require("./Comparators");
var Helpers = require('./Helpers');


for (var comparator in Comparators) {
	exports[comparator] = Comparators[comparator];
}

function Query(opts) {
	if (typeof opts == "string") {
		opts = {
			dialect: opts
		};
	} else {
		opts = opts || {};
	}

	var Dialect = require("./Dialects/" + (opts.dialect || "mysql"));

	return {
		escape: Helpers.escapeQuery.bind(Helpers, Dialect),
		escapeId: Dialect.escapeId.bind(Dialect),
		escapeVal: Dialect.escapeVal.bind(Dialect),
		select: function () {
			return new SelectQuery(Dialect, opts);
		}
	};
}

function buildQueryType(type) {
	return function (data) {
		var o = {
			data: data
		};

		Object.defineProperty(o, "type", {
			value: function () {
				return type;
			},
			enumerable: false
		});

		return o;
	};
}

exports.Query = Query;
exports.Comparators = Object.keys(Comparators);
exports.Text = buildQueryType("text");