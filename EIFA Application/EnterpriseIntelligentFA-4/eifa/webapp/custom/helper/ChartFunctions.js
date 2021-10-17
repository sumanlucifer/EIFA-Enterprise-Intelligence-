sap.ui.define([
	"sap/ui/core/Control"
], function (Control) {
	"use strict";
	return {
		createDataset: function (that) {
			var chartData = {};
			var borderColor = that.getBorderColor();
			var steppedLine = that.getSteppedLine();
			var labels = that.getLabels();
			var data = that.getData();
			var dimension = that.getDimension();
			var measure = that.getMeasure();
			var measureChartType = that.getMeasureChartType();
			var measureColours = that.getMeasureColour();
			if (measure.length < 1) {
				return;
			}
			if (labels.length > 0) {
				chartData.labels = labels;
			} else {
				chartData.labels = data.map(function (e) {
					return e[dimension];
				});
			}
			switch (that.getChartType()) {
			case "scatter":
				chartData["datasets"] = measure.map(function (e, i) {
					return {
						label: e,
						pointRadius: 5,
						backgroundColor: measureColours[i],
						data: data.map(function (f) {
							return {
								x: f[dimension[i]],
								y: f[e]
							};
						})
					};
				});
				break;
			case "bubble":
				var radius = that.getRadius();
				chartData["datasets"] = measure.map(function (e, i) {
					return {

						label: e,
						backgroundColor: measureColours[i],
						data: data.map(function (f) {
							return {
								x: f[dimension[i]],
								y: f[e],
								r: f[radius[i]]
							};
						})
					};
				});
				break;
			case "line":
				var filVal = that.getEnableFilledLine();
				chartData["datasets"] = measure.map(function (e, i) {
					return {
						fill: filVal,
						label: e,
						steppedLine: steppedLine,
						backgroundColor: measureColours[i],
						pointBackgroundColor: "white",
						pointRadius: 5,
						borderColor: borderColor[i],
						data: data.map(function (f) {
							return {
								x: f[dimension[i]],
								y: f[e]
							};
						})
					};
				});
				break;
			case "doughnut":
				chartData["datasets"] = measure.map(function (e, i) {
					return {
						label: e,
						backgroundColor: measureColours,
						data: data.map(function (f) {
							return f[e];
						})
					};
				});
				break;
			default:
				chartData["datasets"] = measure.map(function (e, i) {
					if (measureChartType[i] === "bar" || measureChartType[i] === undefined) {
						return {
							label: e,
							backgroundColor: measureColours[i],
							type: measureChartType[i],
							labelAdditional: data.map(function (g) {
								return g["labelAdditional" + (i + 1)];
							}),
							data: data.map(function (f) {
								return f[e];
							})
						};
					}
					if (measureChartType[i] === "line") {
						var filVal = that.getEnableFilledLine();
						return {
							fill: filVal,
							label: e,
							backgroundColor: measureColours[i],
							pointBackgroundColor: "white",
							pointRadius: 5,
							type: measureChartType[i],
							borderColor: borderColor[i],
							data: data.map(function (f) {
								return {
									x: f[dimension[i]],
									y: f[e]
								};
							})
						}
					}
				});
			}
			return chartData;
		}
	};

});