sap.ui.define([
 "sap/ui/core/Control", "./KPIChartTileRenderer", "./libs/ChartJS", "./libs/Radial", "./helper/ChartFunctions",

], function (Control, KPIChartTileRenderer, ChartJS, Radial, ChartFunctions) {
	"use strict";

	var KPIChartTile = Control.extend("ey.eifa.custom.KPIChartTile", {
		metadata: {
			properties: {
				title: {
					type: "string",
					defaultValue: ""
				},
				xGrid: {
					type: "boolean",
					defaultValue: false
				},
				yGrid: {
					type: "boolean",
					defaultValue: false
				},
				stacked: {
					type: "boolean",
					defaultValue: false
				},
				enableAxisLabels: {
					type: "boolean",
					defaultValue: true
				},
				chartType: {
					type: "string",
					defaultValue: "bar"
				},
				steppedLine: {
					type: "boolean",
					defaultValue: false
				},
				labels: {
					type: "object",
					defaultValue: []
				},
				radius: {
					type: "object",
					defaultValue: ""
				},
				enableFilledLine: {
					type: "string",
					defaultValue: false
				},
				borderColor: {
					type: "object",
					defaultValue: []
				},
				xAxisLabel: {
					type: "string",
					defaultValue: ""
				},
				yAxisLabel: {
					type: "string",
					defaultValue: ""
				},
				size: {
					type: "string",
					defaultValue: "4x4"
				},
				measure: {
					type: "object",
					defaultValue: ""
				},
				measureColour: {
					type: "object",
					defaultValue: []
				},
				dimension: {
					type: "object",
					defaultValue: []
				},
				data: {
					type: "object",
					defaultValue: []
				},
				cardType: {
					type: "string",
					defaultValue: "chart" //chart //info //numeric // radial //measureBlock
				},
				info: {
					type: "string",
					defaultValue: "N/A"
				},
				mesL: {
					type: "string",
					defaultValue: ""
				},
				mesR: {
					type: "string",
					defaultValue: ""
				},
				labL: {
					type: "string",
					defaultValue: ""
				},
				labR: {
					type: "string",
					defaultValue: ""
				},
				radialPerc: {
					type: "string",
					defaultValue: ""
				},
				radialColor: {
					type: "string",
					defaultValue: ""
				},
				radialSummaryBase: {
					type: "string",
					defaultValue: "Total"
				},
				radialSummaryValue: {
					type: "string",
					defaultValue: "Sum Achieved"
				},
				measureBlock: {
					type: "object",
					defaultValue: []
				},
				progressVisible: {
					type: "boolean",
					defaultValue: true
				},
				cutOutPercentage: { //Only Applied to doughnut chart
					type: "float",
					defaultValue: 70
				},
				panDirection: {
					type: "string",
					defaultValue: 'x'
				},
				zoomDirection: {
					type: "string",
					defaultValue: 'x'
				},
				zoomEnabled: {
					type: "boolean",
					defaultValue: false
				},
				showBorder: {
					type: "boolean",
					defaultValue: true
				},
				fitToParent: {
					type: "boolean",
					defaultValue: false
				},
				draggable: {
					type: "boolean",
					defaultValue: false
				},
				_chart: {
					type: "string",
					defaultValue: ""
				},
				showLegend: {
					type: "boolean",
					defaultValue: true
				},
				yAxisType: {
					type: "string",
					defaultValue: "linear",
				},
				measureChartType: {
					type: "object",
					defaultValue: ""
				}
			},
			events: {
				onAreaSelection: {},
				select: {},
				onRightClick: {}
			}
		},
		onAfterRendering: function (oEvent) {
			var oControl = oEvent.srcControl;
			if (oControl.getCardType() === "chart") {
				var contextId = oControl.getId() + '--chartCanvas';
				var ctx = document.getElementById(contextId).getContext('2d');
				this.ctx = ctx;
				Chart.Legend.prototype.afterFit = function () {
					this.height = this.height + 20;
				};
				var canvas = document.getElementById(contextId);
				canvas.addEventListener('contextmenu', function (e) {
					e.preventDefault();
					this._chart.resetZoom();
					this.fireOnRightClick(this);
				}.bind(this), false);

				var sCaseId;
				var sXLabel = oControl.getProperty("xAxisLabel");
				var sYLabel = oControl.getProperty("yAxisLabel");
				var sChartType = oControl.getProperty("chartType");
				var sYAxisType = oControl.getProperty("yAxisType");

				
				var sMeasure = oControl.getProperty("measure")[0];
				if (sMeasure !== undefined) {
					var oData = oControl.getProperty("data");
					/*var array1 = [];
					for(var a = 0; a < oData.length; a++) {
						var keys =  Object.keys(oData[a]);
						for(var j=0; j < sMeasure.length; j++) {
							if(keys.indexOf(sMeasure[j]) !== -1) {
								var tempData = parseInt(oData[a][keys[keys.indexOf(sMeasure[j])]]);
								array1.push(tempData);
								break;
							}
						}
					}
					array1.sort(function(a,b) {
						return parseInt(a)-parseInt(b);
					});
					var sLength = array1.length;
					var firstVal = array1[0];
					var lastVal = array1[sLength - 1];
					var sDif = parseInt(lastVal) - parseInt(firstVal);*/
					
					oData = oData.sort(function (a, b) {
						var a1 = parseInt(a[sMeasure]),
							b1 = parseInt(b[sMeasure]);
						if (a1 == b1) return 0;
						return a1 < b1 ? 1 : -1;
					});

					var sLength = oData.length;
					var firstVal = oData[0][sMeasure];
					var lastVal = oData[sLength - 1][sMeasure];
					var sDif = parseInt(firstVal) - parseInt(lastVal);


					if (sDif >= 100) {
						sYAxisType = "logarithmic";
					} else {
						sYAxisType = "linear";
					}
				}

				var stacked = oControl.getStacked();
				var myChart = new Chart(ctx, {
					type: oControl.getChartType(),
					data: oControl.createMeasureDim(),
					options: {
						responsive: true,
						maintainAspectRatio: true,
						cutoutPercentage: oControl.getCutOutPercentage(),
						onClick: function (t, data) {
							if (sChartType === "doughnut") {
								var index = data[0]["_index"];
								var label = data[0]["_chart"].data.labels[index];
								var labelNumber = data[0]["_chart"].data.datasets[0].data[index];
								this.fireSelect({
									"label": label,
									"labelNumber": labelNumber
								}, this);
							} else if (sChartType === "bar") {
								var a = this.myChart;
								var activePoint = a.getElementAtEvent(t)[0];
								var dat = activePoint._chart.data;
								var datasetIndex = activePoint._datasetIndex;
								var labelClicked = dat.datasets[datasetIndex].label;
								var value = dat.datasets[datasetIndex].data[activePoint._index];
								var index = data[0]["_index"];
								var label = data[0]["_chart"].data.labels[index];
								this.fireSelect({
									"labelClicked": labelClicked,
									"value": value,
									"label": label
								}, this);
							}
						}.bind(this),
						tooltips: {
							callbacks: {
								title: function (t, data) {
									var aDatasets = data.datasets;

									switch (sChartType) {
									case "bar":
									case "bubble":
									case "scatter":
									case "line":
									default:

										for (var x in aDatasets) {
											var aData = aDatasets[x].data;
											for (var y in aData) {
												if (aData[y]) {
													if (parseFloat(aData[y]) === t[0].yLabel) {
														sCaseId = data.datasets[x].label;
													} else if (parseFloat(aData[y].y) === t[0].yLabel) {
														sCaseId = data.datasets[x].label;
													} else {
														if (aData[y].x !== undefined) {
															var sRegex = /^[a-zA-Z]+$/;
															if (!sRegex.test(aData[y].x)) {
																var sParsedX = parseFloat(aData[y].x)
															}

															if (!sRegex.test(aData[y].y)) {
																var sParsedY = parseFloat(aData[y].y)
															}

															if (sParsedX === t[0].xLabel && sParsedY === t[0].yLabel) {
																sCaseId = data.datasets[x].label;
															}
														}
													}
												}
											}
										}

										break;
									case "doughnut":
										sCaseId = data.labels[t[0].index];
										break;

									}

									return sCaseId;
								},
								label: function (t, data) {
									var sLabels = "";
									switch (sChartType) {
									case "bar":
									case "bubble":
									case "scatter":
									case "line":
										var sRegex = /^[a-zA-Z ]+$/;
										if (t.xLabel === "" && t.yLabel !== "") {
											sLabels = sYLabel + ": " + t.yLabel;
										} else if (t.yLabel === "" && t.xLabel !== "") {
											sLabels = sXLabel + ": " + t.xLabel;
										} else if (sRegex.test(t.xLabel) && (sXLabel === "" && sYLabel === "")) {
											sLabels = t.xLabel + ": " + t.yLabel;
										} else {
											sLabels = sXLabel + ": " + t.xLabel + ", " + sYLabel + ": " + t.yLabel;
										}
										if (sChartType === "bar") {
											if (data !== undefined) {
												if (data.datasets[t.datasetIndex].labelAdditional[0] !== undefined) {
													var labelAdditional = data.datasets[t.datasetIndex].labelAdditional[t.index];
													sLabels = sLabels + "			" + labelAdditional;
												}
											}
										}
										break;
									case "doughnut":

										sLabels = data.datasets[0].label + ": " + data.datasets[0].data[t.index];
										break;
									default:

									}
									return sLabels;
								}
							}
						},
						legend: {
							display: oControl.getShowLegend(),
							labels: {
								fontFamily: "EYInterstate",
								fontColor: "#737384",

							}
						},
						scales: {
							xAxes: [{
								display: oControl.getEnableAxisLabels(),
								ticks: {
									display: oControl.getEnableAxisLabels()
								},
								gridLines: {
									display: oControl.getXGrid()
								},
								scaleLabel: {
									display: oControl.getEnableAxisLabels(),

									labelString: oControl.getXAxisLabel()
								},
								stacked: stacked,
								barThickness: 20, // number (pixels) or 'flex'
								maxBarThickness: 20 // number (pixels)
							}],
							yAxes: [{
								display: oControl.getEnableAxisLabels(),
								type: sYAxisType,
								ticks: {
									display: oControl.getEnableAxisLabels(),
									precision: 0,
									callback: function (value, index, values) {
										if (sYAxisType === "logarithmic") {
											if (value === 10000000) return "10M";
											if (value === 1000000) return "1M";
											if (value === 100000) return "0.1M";
											if (value === 10000) return "10000";
											if (value === 1000) return "1000";
											if (value === 100) return "100";
											if (value === 10) return "10";
											if (value === 1) return "1";
											if (value === 0) return "0";
											return null;
										} else {
											return value;
										}
									}
								},
								gridLines: {
									display: oControl.getYGrid()
								},

								scaleLabel: {
									display: oControl.getEnableAxisLabels(),
									labelString: oControl.getYAxisLabel()
								},

								stacked: stacked
							}],
						},
						pan: {
							enabled: false,
							mode: oControl.getPanDirection()
						},
						zoom: {
							enabled: oControl.getZoomEnabled(),
							mode: oControl.getZoomDirection(),
							drag: oControl.getDraggable(),
							onZoomComplete: function (e) {
								var chartData = [];
								if (e.chart.data["datasets"]) {
									e.chart.data["datasets"].forEach(function (e) {
										e.data.forEach(function (f) {
											chartData.push(f);
										});
									});
								}
								var selectedPoints = [];
								var xAxis = e.chart.scales["x-axis-1"].ticks;
								var yAxis = e.chart.scales["y-axis-1"].ticks;
								chartData.forEach(function (e) {
									if (Number(e.x) >= Number(xAxis[0]) && Number(e.x) <= Number(xAxis[xAxis.length - 1]) && Number(e.y) <= Number(yAxis[0]) &&
										Number(e.y) >= Number(yAxis[yAxis.length - 1])) {
										selectedPoints.push(e);
									}
								});
								this._chart = e.chart;
								sap.m.MessageToast.show("Please Right Click to reset the chart");
								this.fireOnAreaSelection({
									"selectedPoints": selectedPoints
								}, this);
							}.bind(this)
						}
					}
				})
				this.myChart = myChart;
			}
			if (oControl.getCardType() === "radial") {
				$('#' + oControl.getId() + '--radialChart').radialIndicator({
					barColor: oControl.getRadialColor(),
					barWidth: 10,
					initValue: oControl.getRadialPerc(),
					roundCorner: true,
					percentage: false
				});
			}
			if (oControl.getCardType() === "radialSummary") {
				$('#' + oControl.getId() + '--radialChartSummary').radialIndicator({
					barColor: oControl.getRadialColor(),
					radius: 100,
					barWidth: 10,
					initValue: oControl.getRadialPerc(),
					roundCorner: true,
					percentage: false
				});
			}
			if (oControl.getCardType() === "measureBlock") {
				$('#' + oControl.getId() + '--radialChartMeasureBlock').radialIndicator({
					barColor: oControl.getRadialColor(),
					radius: 100,
					barWidth: 10,
					initValue: oControl.getRadialPerc(),
					roundCorner: true,
					percentage: false
				});
			}

		},
		createMeasureDim: function () {
			var chartData = ChartFunctions.createDataset(this);
			return chartData;
		},
		renderer: KPIChartTileRenderer
	});
	return KPIChartTile;
});