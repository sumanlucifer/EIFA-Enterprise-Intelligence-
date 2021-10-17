sap.ui.define([
	"./BaseController",
	"sap/ui/core/Fragment",
	"ey/eifa/custom/KPIChartTile",
	"sap/m/MessageToast",
	"sap/viz/ui5/controls/common/feeds/FeedItem",
	"sap/viz/ui5/data/FlattenedDataset",
	"sap/viz/ui5/controls/VizFrame",
	"sap/ui/model/json/JSONModel",
	"sap/viz/ui5/format/ChartFormatter",
	"sap/viz/ui5/api/env/Format",
	"sap/m/Text",
	"sap/ui/core/HTML"
], function (BaseController, Fragment, KPIChartTile, MessageToast, FeedItem, FlattenedDataset, VizFrame, JSONModel, ChartFormatter,
	Format, Text, HTML) {
	"use strict";

	return BaseController.extend("ey.eifa.controller.Home", {
		onCommentChange: function (e) {
			var iSelectedQuestionIndex = this.getModel().getProperty("/searchResultDialog/questionNavigator/selectedQuestion") - 1;
			this.getModel().setProperty("/searchResultDialog/newlyAddedComment/" + iSelectedQuestionIndex, e.getParameter("newValue"));
		},

		getRecommendation: function () {
			var oOptions = {
				url: "getRecommendation",
				type: "GET"
			};
			this.getAPI.crudOperations(oOptions)
				.then(function (oResponse) {
					var aData = oResponse.data;
					this.getModel().setProperty("/userRecommendation/getRecommendations", aData);
				}.bind(this));
		},
		handleLinkPress: function (e) {
			var e = e.getSource()._getBindingContext().getObject()
			var RecommendationQuestion = e.recommendation;

			if (RecommendationQuestion) {
				this.getModel().setProperty("/question", RecommendationQuestion);

				if (!this.oSearchResultDialog) {
					this.openSearchResultDialog().then(function () {
						this.getModel().setProperty("/searchResultDialog/questionNavigator/items", []);
						this.showSearchInPopover();
					}.bind(this));
				} else if (!this.oSearchResultDialog.isOpen()) {
					this.openSearchResultDialog();
					this.showSearchInPopover();
				} else {
					this.showSearchInPopover();
				}
			}
		},
		onShowChartMenu: function (oEvent) {
			var oButton = oEvent.getSource();
			if (!this.oChartMenuDialog) {
				Fragment.load({
					name: "ey.eifa.fragment.ChartMenuDialog",
					controller: this
				}).then(function (oPopover) {
					this.oChartMenuDialog = oPopover;
					this.getView().addDependent(this.oChartMenuDialog);
					this.oChartMenuDialog.openBy(oButton);
					oPopover.attachAfterOpen(function () {
						if (!this.isClickEventAttachedForPDF) {
							this.isClickEventAttachedForPDF = true;
							sap.ui.getCore().byId("pdfDownloadContainer")
								.attachBrowserEvent("click", this.onPdfDownload.bind(this));
						}
					}.bind(this));
				}.bind(this));
			} else {
				this.oChartMenuDialog.openBy(oButton);
			}
		},

		ChartMenuDialogClose: function () {
			this.oChartMenuDialog.close();
		},

		onChartOptionApply: function () {
			this.oChartDialog.close();
		},
		onShowChartType: function (e) {
			if (!this.oChartDialog) {
				Fragment.load({
					name: "ey.eifa.fragment.ChartOptionDialog",
					controller: this
				}).then(function (oPopover) {
					this.oChartDialog = oPopover;
					this.getView().addDependent(this.oChartDialog);
					this.oChartDialog.openBy(this.byId("searchResult"));
				}.bind(this));
			} else {
				this.oChartDialog.openBy(this.byId("searchResult"));
			}
			var iSelectedQuestionIndex = this.getModel().getProperty("/searchResultDialog/questionNavigator/selectedQuestion"),
				oData = this.getModel().getProperty("/searchResultDialog/questionNavigator/items/" + (iSelectedQuestionIndex - 1) + "/response");
			this.getModel().setProperty("/searchResultDialog/originalChartType", oData.chartType);

		},

		onChartOptionCancel: function () {
			this.oChartDialog.close();
			var iSelectedQuestionIndex = this.getModel().getProperty("/searchResultDialog/questionNavigator/selectedQuestion"),
				sChartType = this.getModel().getProperty("/searchResultDialog/originalChartType");
			this.getModel().setProperty("/searchResultDialog/questionNavigator/items/" + (iSelectedQuestionIndex - 1) + "/response/chartType",
				sChartType);
			var oResponse = this.getModel().getProperty("/searchResultDialog/questionNavigator/items/" + (iSelectedQuestionIndex - 1) +
				"/response");
			this.setSearchResultContent(oResponse);
		},

		onChartOptionPress: function (e) {
			var sChartType = e.getSource().getUseMap(),
				aQuestion = this.getModel().getProperty("/searchResultDialog/questionNavigator/items");
			var iSelectedQuestionIndex = this.getModel().getProperty("/searchResultDialog/questionNavigator/selectedQuestion"),
				oResponse = this.getModel().getProperty("/searchResultDialog/questionNavigator/items/" + (iSelectedQuestionIndex - 1) +
					"/response");
			oResponse.chartType = sChartType;
			this.getModel().setProperty("/searchResultDialog/questionNavigator/items/" + (iSelectedQuestionIndex - 1) +
				"/response", oResponse);
			this.setSearchResultContent(oResponse);
		},
		setSearchResultContent: function (oResponse) {
			if (this.getModel().getProperty("/searchResultDialog/questionNavigator/items").length) {
				this.byId("navigatorBar").setJustifyContent("SpaceBetween");
			}
			this.getModel().setProperty("/searchResultDialog/title", oResponse.title);
			//	this.getModel().setProperty("/searchResultDialog/comment", oResponse.comments || "");
			this.getModel().setProperty("/searchResultDialog/date", oResponse.date);

			var sVizType = oResponse.chartType,
				oControl;
			switch (sVizType) {
			case "table":
				oControl = this.getTable(oResponse);
				break;
			case "metric":
				oControl = this.getNumericTile(oResponse);
				break;

			case "column":
			case "stacked_column":
			case "line":
				oControl = this.getChart(oResponse, {
					vizType: sVizType,
					uidValueAxis: "valueAxis",
					uidCategoryAxis: "categoryAxis",
					plotAreaDataLabelVisible: true,
					titleVisible: false,
					height: "265px",
					width: "878px",
					gridlineVisible: true,
					axisLineVisible: true
				});
				break;
			case "donut":
				oControl = this.getChart(oResponse, {
					uidValueAxis: "size",
					uidCategoryAxis: "color",
					plotAreaDataLabelVisible: true,
					vizType: sVizType,
					titleVisible: false,
					height: "275px",
					width: "100%",
					gridlineVisible: true,
					axisLineVisible: true
				});
				break
			}
			this.getModel().setProperty("/searchResultDialog/resultReady", true);
			var iChartIndex = this.getModel().getProperty("/searchResultDialog/questionNavigator/selectedQuestion") - 1;
			if (oControl) {
				var aImageData = this.getModel().getProperty("/searchResultDialog/chartImageData"),
					oCurrentItem = this.byId("searchResult").getItems()[iChartIndex];
				if (oCurrentItem) {
					this.byId("searchResult").removeItem(oCurrentItem);
				}
				this.byId("searchResult").insertItem(oControl, iChartIndex);
				aImageData[iChartIndex] = null;
				if (sVizType !== "table" && oResponse.axis.y.length < 3 && oResponse.axis.x.length < 2) {
					// oControl.attachRenderComplete(function (e) {
					// 	if (!aImageData[iChartIndex]) {
					// 		var oChart = e.getSource(),
					// 			bOriginalState = e.getSource().getVizProperties().title.visible;
					// 		oChart.setVizProperties({
					// 			title: {
					// 				visible: true
					// 			}
					// 		});
					// 		var oImageData = this.createChartImageData(e.getSource());
					// 		aImageData[iChartIndex] = oImageData;
					// 		this.getModel().setProperty("/searchResultDialog/chartImageData", aImageData);
					// 		oChart.setVizProperties({
					// 			title: {
					// 				visible: bOriginalState
					// 			}
					// 		});
					// 	}
					// }.bind(this));
				}
			}

		},

		onStaticTileRefresh: function () {
			this.getStaticTiles();
		},
		createChartImageData: function (oVizFrame) {
			var sSVG = oVizFrame.exportToSVGString({
				width: 800,
				height: 600
			});
			sSVG = sSVG.replace(/translate /gm, "translate");
			var oCanvasHTML = document.createElement("canvas");
			canvg(oCanvasHTML, sSVG);
			var sImageData = oCanvasHTML.toDataURL("image/png");
			return sImageData;

		},
		onPdfDownload: function () {
			var oPDF = new jspdf.jsPDF(),
				x = 15,
				y = 5,
				width = 180,
				height = 160,
				aChartImageData = this.getModel().getProperty("/searchResultDialog/chartImageData");
			aChartImageData.forEach(function (sImageData, index) {
				if (index > 0) {
					oPDF.addPage();
				}
				oPDF.addImage(sImageData, "PNG", x, y, width, height);
			});
			oPDF.save("Analysis.pdf");
		},
		createSuggestedKpi: function (sId, oContext) {

			var oControl = new sap.m.Button({
				text: oContext.getObject(),
				type: "Unstyled",
				press: function (e) {
					this.getModel().setProperty("/question", e.getSource().getText());
					this.byId("searchInputInDialog").fireSearch({
						query: e.getSource().getText()
					});
				}.bind(this)
			}).addStyleClass("sapUiTinyMarginEnd suggestedKpi");
			return oControl;

		},
		voiceInputHandler: function (sVoiceInput) {
			var sActiveMic = this.getModel().getProperty("/activeMic"),
				iSelectedIndex = this.getModel().getProperty("/searchResultDialog/questionNavigator/selectedQuestion") - 1;
			// this.getModel().setProperty("/mic/" + sActiveMic + "/state", "off");

			switch (sActiveMic) {

			case "search":
				this.byId("searchMic").firePress();
				this.getModel().setProperty("/question", sVoiceInput);
				if (!this.oSearchResultDialog) {
					this.openSearchResultDialog();
				} else if (!this.oSearchResultDialog.isOpen()) {
					this.openSearchResultDialog();
				}
				this.showSearchInPopover();
				break;

			case "comments":
				this.byId("commentsMic").firePress();
				var sComment = this.getModel().getProperty("/searchResultDialog/newlyAddedComment/" + iSelectedIndex) + " " + sVoiceInput;
				this.getModel().setProperty("/searchResultDialog/newlyAddedComment/" + iSelectedIndex, sComment.trim());
				break;
			}

		},
		initiateSpeechRecognition: function () {
			if ('webkitSpeechRecognition' in window) {
				this.recognition = new webkitSpeechRecognition();
			} else {
				this.recognition = new SpeechRecognition();
			}
			this.recognition.continuous = true;
			this.recognition.interimResults = false;
			this.recognition.lang = "en-US";
			this.recognition.onresult = function (e) {
				for (var i = e.resultIndex; i < e.results.length; ++i) {
					if (e.results[i].isFinal) {
						var sFinal = e.results[i][0].transcript.trim();
						this.voiceInputHandler(sFinal);
					}
				}
			}.bind(this);
			this.recognition.onend = function () {
				//	this.recognition.start();
			}.bind(this);
		},

		handleQuestionaire: function (oResponse) {
			var aQuestion = this.getModel().getProperty("/searchResultDialog/questionNavigator/items"),
				iIndexForNewQuestion = aQuestion.length + 1,
				oQuestionItem = {
					response: oResponse,
					index: iIndexForNewQuestion
				};
			aQuestion.push(oQuestionItem);
			this.getModel().setProperty("/searchResultDialog/questionNavigator/items", aQuestion);
			this.getModel().setProperty("/searchResultDialog/questionNavigator/selectedQuestion", iIndexForNewQuestion);
			this.byId("searchResult").getItems().forEach(function (oItem, index) {
				if (index === iIndexForNewQuestion - 1) {
					oItem.setVisible(true);
				} else {
					oItem.setVisible(false);
				}
			});

			this.getModel().setProperty("/searchResultDialog/newlyAddedComment/" + iIndexForNewQuestion, "");
			this.getModel().setProperty("/searchResultDialog/comment", "");
		},

		createFavourites: function (sId, oContext) {

			if (this.byId("favourites").getItems().length === 2) {
				return;
			}
			var oData = oContext.getObject(),
				oControl, sVizType = oData.chartType;
			switch (sVizType) {

			case "metric":
				oControl = this.getNumericTile(oData);
				break;

			case "column":
			case "stacked_column":
			case "line":
				oControl = this.getChart(oData, {
					uidValueAxis: "valueAxis",
					uidCategoryAxis: "categoryAxis",
					plotAreaDataLabelVisible: true,
					vizType: sVizType,
					titleVisible: false,
					height: "222px",
					width: "363px",
					gridlineVisible: false,
					axisLineVisible: false,
					styleClass: ""
				});
				break;
			case "donut":
				oControl = this.getChart(oData, {
					uidValueAxis: "size",
					uidCategoryAxis: "color",
					plotAreaDataLabelVisible: true,
					vizType: sVizType,
					titleVisible: false,
					height: "222px",
					width: "363px",
					gridlineVisible: true,
					axisLineVisible: true,
					styleClass: ""
				});
				break;
			}
			var oVbox = new sap.m.VBox({
				height: "278px",
				width: "393px",
				items: [
					new Text({
						text: oData.title,
						tooltip: oData.title,
						maxLines: 1
					}).addStyleClass("gridTitle"),
					new HTML({
						content: "<div class='titleMarker'></div> "
					}),
					oControl
				]
			}).addStyleClass("favourites grid");
			oVbox.attachBrowserEvent("click", this.onFavouriteChartClicked.bind(this, oVbox));
			return oVbox;
		},
		onFavouriteChartClicked: function (oControl) {
			this.openSearchResultDialog().then(function () {
				this.getModel().setProperty("/favouritesClicked", true);
				var iClickedCardIndex = this.byId("favourites").indexOfItem(oControl),
					iChartId = this.getModel().getProperty("/viewAllFavourites/" + iClickedCardIndex).ChartId,
					oOptions = {
						url: "analysis/getuseranalysis",
						type: "POST",
						data: {
							analysisId: iChartId
						}
					};
				this.getModel().setProperty("/searchDialogBusy", true);
				this.getModel().setProperty("/searchResultDialog/invalidQuestion/visible", false);
				this.getModel().setProperty("/searchResultDialog/suggestedKpi", []);
				this.getAPI.crudOperations(oOptions)
					.then(function (oResponse) {
						var aCharts = oResponse.charts,
							oQuestionNavigator = this.byId("questionNavigator");
						aCharts.forEach(function (oChart) {
							//	this.getModel().setProperty("/searchResultDialog/suggestedKpi", oChart.suggestedQuestions);
							this.handleQuestionaire(oChart);
							this.setSearchResultContent(oChart);
						}.bind(this));
						var iLength = oQuestionNavigator.getItems().length,
							oButton = oQuestionNavigator.getItems()[iLength - 1];
						oQuestionNavigator.setSelectedKey(iLength);
						oQuestionNavigator.fireSelectionChange({
							item: oButton
						});
						if (this.getModel().getProperty("/mic/search/state") !== "off") {
							this.getModel().setProperty("/mic/search/state", "active");
						}
						this.getModel().setProperty("/searchDialogBusy", false);
					}.bind(this)).catch(function (error) {
						this.getModel().setProperty("/searchDialogBusy", false);
						var oResponse = JSON.parse(error.responseText);
						if (!oResponse.validQuestion) {
							this.getModel().setProperty("/searchResultDialog/invalidQuestion/visible", true);
							this.getModel().setProperty("/searchResultDialog/invalidQuestion/errorText", oResponse.errorText);
						}
					}.bind(this));
			}.bind(this));

		},
		getChartType: function (sChartType) {
			var oType = {
				bar: "column",
				Dbar: "line",
				line: "line",
				Dline: "column",
				metric: "metric"
			};
			return oType[sChartType];
		},
		onQuestionNavigation: function (e) {
			var oData = e.getParameter("item").getBindingContext().getObject(),
				oResponse = oData.response,
				sSelectedKey = e.getSource().getSelectedKey() || 1,
				iSelectedQuestionIndex = sSelectedKey - 1,
				sComment = this.getModel().getProperty("/searchResultDialog/newlyAddedComment/" + iSelectedQuestionIndex);
			this.getModel().setProperty("/question", oResponse.question);
			this.byId("searchResult").getItems().forEach(function (oItem, index) {
				if (index === iSelectedQuestionIndex) {
					oItem.setVisible(true);
				} else {
					oItem.setVisible(false);
				}
			});
			this.getModel().setProperty("/searchResultDialog/comment", sComment || "");
			this.getModel().setProperty("/searchResultDialog/suggestedKpi", oResponse.suggestedQuestions || []);

		},
		createStaticTiles: function (sId, oContext) {
			var oControl = this.byId("numericTile").clone(sId),
				aPath = oContext.getPath().split("/"),
				iIndex = +aPath[aPath.length - 1],
				iTotalKpi = this.getModel().getProperty("/staticTiles").length;
			if (iIndex < iTotalKpi - 1) {
				oControl.addStyleClass("verticalLineForNumericTile");
			}
			return oControl;
		},
		getStaticTiles: function () {
			var oOptions = {
				url: "tileview",
				type: "GET"
			};
			this.getAPI.crudOperations(oOptions).then(function (response) {
				this.getModel().setProperty("/staticTiles", response.data);
			}.bind(this));
		},
		createResultTableItems: function (sId, oContext) {
			var aHeader = this.getModel().getProperty("/searchResultDialog/resultTable/headers"),
				aCells = aHeader.map(function (item) {
					return new Text({
						text: "{" + item.label + "}"
					})
				});

			return new sap.m.ColumnListItem({
				cells: aCells
			});
		},
		createResultTableColumns: function (sId, oContext) {
			return new sap.m.Column({
				header: new Text({
					text: oContext.getProperty("label")
				})

			});
		},
		getTable: function (oResponse) {
			this.getModel().setProperty("/searchResultDialog/resultTable/headers", oResponse.header);
			this.getModel().setProperty("/searchResultDialog/resultTable/items", oResponse.data);
			var oTable = new sap.m.Table({
					sticky: ["ColumnHeaders"],
					items: {
						path: '/searchResultDialog/resultTable/items',
						factory: this.createResultTableItems.bind(this)
					},
					columns: {
						path: "/searchResultDialog/resultTable/headers",
						factory: this.createResultTableColumns.bind(this)
					}

				}).addStyleClass("resultTable"),
				oScrollContainer = new sap.m.ScrollContainer({
					height: "220px",
					vertical: true,
					content: [oTable]
				});

			return oScrollContainer;
		},
		getChart: function (oResponse, oConfig) {
			Format.numericFormatter(ChartFormatter.getInstance());
			var formatPattern = ChartFormatter.DefaultPattern,
				aMeasures = oResponse.axis.y.map(function (item) {
					return {
						name: item,
						value: "{" + item + "}"
					};
				}.bind(this)),
				aDimenssions = oResponse.axis.x.map(function (item) {
					return {
						name: item,
						value: "{" + item + "}"
					};
				}.bind(this)),
				oDataset = new FlattenedDataset({
					dimensions: aDimenssions,
					measures: aMeasures,
					data: {
						path: "/"
					}
				});

			var feedValueAxis = new FeedItem({
					'uid': oConfig.uidValueAxis, //"valueAxis",
					'type': "Measure",
					'values': oResponse.axis.y
				}),
				feedCategoryAxis = new FeedItem({
					'uid': oConfig.uidCategoryAxis, //"categoryAxis",
					'type': "Dimension",
					'values': oResponse.axis.x
				});

			var oVizFrame = new VizFrame({
				height: oConfig.height,
				width: oConfig.width,
				vizType: oConfig.vizType
			}).addStyleClass(oConfig.styleClass || "");

			oVizFrame.setDataset(oDataset)
				.setModel(new JSONModel(oResponse.data))
				.setVizProperties({
					valueAxisScale: {
						scaleBehavior: sap.chart.ScaleBehavior,
						autoScaleSettings: {
							syncWith: sap.chart.AutoScaleMode.VisibleData
						}
					},
					plotArea: {
						//plotArea.markerRenderer fn
						// callout: {
						// 	top: [{
						// 		dataContext: [{
						// 			" Actual Revenue": "293179030.80"
						// 		}]
						// 	}]
						// },
						dataLabel: {
							visible: oConfig.plotAreaDataLabelVisible,
							renderer: function (e) {
								if (oConfig.vizType !== "donut") {
									e.text = Math.round(e.text / 100000);
								}
							},
							style: {
								color: "#747480"
							}
						},
						dataPointSize: {
							max: 20,
							min: 20
						},
						background: {
							color: "#282a3b"
						},
						gridline: {
							visible: oConfig.gridlineVisible,
							color: "#747480"
						},
						colorPalette: ["#93F0E6", "#FFB46A", "#C981B2", "#8CE8AD", "#FF9A91", "#9C82D4", "#42C9C2", "#F95D54", "#1777CF", "#4EBEEB"]
					},
					valueAxis: {
						axisLine: {
							visible: false
						},
						label: {
							formatString: formatPattern.SHORTFLOAT,
							visible: false,
							style: {
								color: "ffffff"
							}
						},
						title: {
							visible: false
						}
					},
					categoryAxis: {
						labelRenderer: function (e) {
							e.styles.color = "#ffffff";
							// e.rotation=true;
							// e.rotationAngle=30;
						},
						hoverShadow: {
							color: "#747480"
						},
						axisLine: {
							visible: oConfig.axisLineVisible
						},
						label: {
							//	angle: 30,
							//	rotation: "fixed",
							// style: {
							// 	color: "#ffffff"
							// }
						},

						title: {
							visible: false
						}

					},
					title: {
						visible: oConfig.titleVisible,
						text: oResponse.title,
						alignment: "left",
						style: {
							color: "#FFE600"
						}
					},
					legend: {
						hoverShadow: {
							color: "#747480"
						},
						visible: true,
						label: {
							style: {
								color: "#FFE600"
							}
						},
						title: {
							text: oResponse.currency + " in Million",
							visible: true,
							style: {
								color: "#FFE600",
								fontSize: "11px"
							}
						}
					},
					general: {
						background: {
							color: "#282a3b"
						}
					},
					interaction: {
						hover: {
							color: "#93F0E6"
						},
						zoom: {
							enablement: "enabled",
							direction: "all"
						}
					}
				})
				.addFeed(feedValueAxis)
				.addFeed(feedCategoryAxis);

			// oVizFrame.setVizScales([{
			// 	feed: "valueAxis",
			// 	min: 50000000,
			// 	max: 50000000,
			// 	type: "logarithmic"
			// }], {
			// 	replace: true
			// });
			return oVizFrame;
		},

		getUserFavourite: function () {
			var oOptions = {
				url: "analysis/getalluseranalysis",
				type: "GET"
			};
			this.getModel().setProperty("/busy", true);
			this.getAPI.crudOperations(oOptions)
				.then(function (oResponse) {
					this.getModel().setProperty("/busy", false);
					this.getUserInsights();
					this.byId("favourites").removeAllItems();
					var aData = oResponse.charts;
					aData = this.skipTable(aData);
					this.getModel().setProperty("/viewAllFavourites", aData);
					this.getModel().setProperty("/favourites", aData.slice(0, 2));
				}.bind(this)).catch(function (error) {
					this.getModel().setProperty("/busy", false);
				}.bind(this));

		},
		getNumericTile: function (oResponse) {
			return new KPIChartTile({
				title: oResponse.question,
				size: '2x1',
				chartType: 'bar',
				cardType: "info",
				info: oResponse.data.Revenue,
			}).addStyleClass('sapUiSmallMargin');

		},
		onSaveAnalysis: function () {
			var aChartData = this.getModel().getProperty("/searchResultDialog/questionNavigator/items").map(function (item, index) {
					var oResponse = item.response,
						iIndexOfResult = this.getModel().getProperty("/searchResultDialog/questionNavigator/selectedQuestion") - 1;
					return {
						question: oResponse.title,
						sql: oResponse.sql,
						chartType: oResponse.chartType,
						comments: index === iIndexOfResult ? this.getModel().getProperty("/searchResultDialog/comment") : (oResponse.comments || "")
					};
				}.bind(this)),
				oOptions = {
					url: "analysis/addanalysis",
					type: "POST",
					contentType: "application/json",
					data: JSON.stringify({
						anlaysisName: aChartData[aChartData.length - 1].question,
						anlaysis: aChartData
					})
				};

			this.getAPI.crudOperations(oOptions)
				.then(function (response) {
					this.getUserFavourite();
					this.oSearchResultDialog.close();
					MessageToast.show(response.message);
				}.bind(this)).catch(function (error) {}.bind(this));
		},
		openSearchResultDialog: function () {
			this.getModel().setProperty("/searchResultDialog/resultReady", false);
			this.getModel().setProperty("/searchResultDialog/newlyAddedComment", []);
			this.getModel().setProperty("/mic/search/state", "off");
			this.getModel().setProperty("/mic/comments/state", "off");
			this.getModel().setProperty("/searchResultDialog/questionNavigator/items", []);
			return new Promise(function (resolve, reject) {
				if (!this.oSearchResultDialog) {
					Fragment.load({
						name: "ey.eifa.fragment.SearchResultDialog",
						controller: this,
						id: this.getView().getId()
					}).then(function (oDialog) {
						this.oSearchResultDialog = oDialog;
						this.getView().addDependent(oDialog);
						oDialog.open();
						resolve();
					}.bind(this));
				} else {
					this.oSearchResultDialog.open();
					resolve();
				}
			}.bind(this));
		},
		showSearchInPopover: function () {

			var oOptions = {
				url: "search",
				type: "POST",
				data: {
					keyword: this.getModel().getProperty("/question"),
					initialQuestion: !this.getModel().getProperty("/searchResultDialog/questionNavigator/items").length
				}
			};
			this.getModel().setProperty("/searchDialogBusy", true);
			this.getModel().setProperty("/searchResultDialog/invalidQuestion/visible", false);
			this.getModel().setProperty("/searchResultDialog/suggestedKpi", []);
			this.getAPI.crudOperations(oOptions)
				.then(function (oResponse) {
					this.getModel().setProperty("/searchResultDialog/suggestedKpi", oResponse.suggestedQuestions);
					this.handleQuestionaire(oResponse);
					this.setSearchResultContent(oResponse);

					if (this.getModel().getProperty("/mic/search/state") !== "off") {
						this.getModel().setProperty("/mic/search/state", "active");
					}
					this.getModel().setProperty("/searchDialogBusy", false);
				}.bind(this)).catch(function (error) {
					if (this.getModel().getProperty("/searchResultDialog/questionNavigator/items").length) {
						this.byId("navigatorBar").setJustifyContent("SpaceBetween");
					}
					this.getModel().setProperty("/searchDialogBusy", false);
					var oResponse = JSON.parse(error.responseText);
					if (!oResponse.validQuestion) {
						this.getModel().setProperty("/searchResultDialog/invalidQuestion/visible", true);
						this.getModel().setProperty("/searchResultDialog/invalidQuestion/errorText", oResponse.errorText);
					}
				}.bind(this));
		},
		onTextInput: function (e) {
			if (e.getParameter("query")) {
				this.getModel().setProperty("/question", e.getParameter("query"));

				if (!this.oSearchResultDialog) {
					this.openSearchResultDialog().then(function () {
						this.getModel().setProperty("/searchResultDialog/questionNavigator/items", []);
						this.showSearchInPopover();
					}.bind(this));
				} else if (!this.oSearchResultDialog.isOpen()) {
					this.openSearchResultDialog();
					this.showSearchInPopover();
				} else {
					this.showSearchInPopover();
				}

			}
		},
		onSearchResultDialogClose: function () {
			this.oSearchResultDialog.close();
			this.byId("searchResult").removeAllItems();
			this.getModel().setProperty("/question", "");
			this.getModel().setProperty("/searchResultDialog/suggestedKpi", []);
			this.getModel().setProperty("/searchResultDialog/chartImageData", []);
			this.userAskedQuestion = false;
		},
		setMicState: function (sMic, sMicState) {
			var oMicName = {
				search: "Search",
				comments: "Comments"
			};
			this.getModel().setProperty("/activeMic", sMicState === "off" ? null : sMic);
			if (sMicState === "off") {
				this.getModel().setProperty("/recognitionAlreadyStarted", false);
				this.recognition.stop();
				MessageToast.show(oMicName[sMic] + " Mic has been muted");
			} else {
				if (!this.getModel().getProperty("/recognitionAlreadyStarted")) {
					this.getModel().setProperty("/recognitionAlreadyStarted", true);
					this.recognition.start();
				}
				MessageToast.show(oMicName[sMic] + " Mic has been unmuted");
			}
		},
		onCommentsMicPress: function () {
			this.getModel().setProperty("/mic/search/state", "off");
			var sMicState = this.getModel().getProperty("/mic/comments/state") === "off" ? "active" : "off";
			this.getModel().setProperty("/mic/comments/state", sMicState);
			this.setMicState("comments", sMicState);
		},
		onSearchMicPress: function () {
			this.getModel().setProperty("/mic/comments/state", "off");
			var sMicState = this.getModel().getProperty("/mic/search/state") === "off" ? "active" : "off";
			this.getModel().setProperty("/mic/search/state", sMicState);
			this.setMicState("search", sMicState);
		},

		getBarChart: function (oResponse, oChartConfig) {
			return new KPIChartTile({
				title: "",
				zoomEnabled: true,
				size: oChartConfig.size,
				chartType: oResponse.chartType,
				cardType: "chart",
				xGrid: false,
				yGrid: true,
				yAxisType: 'logarithmic',
				showLegend: false,
				measure: [oResponse.axis.y],
				dimension: [oResponse.axis.x],
				data: oResponse.data,
				measureColour: ["#0088FEAB", "#00C49FAB", "#FFBB28AB", "#FF8042AB"]
			}).addStyleClass('sapUiSmallMargin');

		},
		getUserDetails: function () {
			var oOptions = {
				url: "getuserdetails",
				type: "GET"
			};
			this.getAPI.crudOperations(oOptions)
				.then(function (oResponse) {
					var aData = oResponse;
					// aData.name.givenName = "Debajyoti";
					// aData.name.familyName = "Bhattacharya";
					this.getModel().setProperty("/userInfo/firstName", aData.name.givenName);
					this.getModel().setProperty("/userInfo/lastName", aData.name.familyName);
					this.getModel().setProperty("/greetingQuestion", "Hi " + aData.name.givenName + ", How can I help you today?");
				}.bind(this));
		},

		onInit: function () {
			this.getUserDetails();
			this.getStaticTiles();
			this.getUserFavourite();
			this.getRecommendation();
			this.getModel().setData({
				busy: false,
				recognitionAlreadyStarted: false,
				activeMic: null,
				date: new Date(),
				userInfo: {
					firstName: null,
					lastName: null
				},
				greetingQuestion: "",
				mic: {
					keepMicOnIndefinitely: false,
					search: {
						state: "off" // idle, active, off
					},
					comments: {
						state: "off"
					}
				},
				searchResultDialog: {
					resultTable: {
						headers: null,
						items: null
					},
					comment: "",
					newlyAddedComment: [],
					title: "",
					originalChartType: null,
					chartImageData: [],
					suggestedKpi: [],
					resultReady: false,
					invalidQuestion: {
						visible: false,
						errorText: null
					},
					questionNavigator: {
						selectedQuestion: 0,
						items: []
					}
				},
				userRecommendation: {
					getRecommendations: []
				}
			});
			this.initiateSpeechRecognition();
		},
		getUserInsights: function () {
			var oOptions = {
				url: "getuserinsights",
				type: "GET"
			};
			this.getAPI.crudOperations(oOptions)
				.then(function (oResponse) {
					this.byId("insights").removeAllItems();
					var aData = oResponse.charts;
					aData = this.skipTable(aData);
					this.getModel().setProperty("/viewAllInsights", aData);
					this.getModel().setProperty("/insights", aData.slice(0, 2));
				}.bind(this));
		},
		skipTable: function (aData) {
			return aData.filter(function (item) {
				return item.chartType !== "table";
			});
		},
		createInsights: function (sId, oContext) {

			if (this.byId("insights").getItems().length === 2) {
				return;
			}
			var oData = oContext.getObject(),
				oControl, sVizType = oData.chartType;
			switch (sVizType) {

			case "metric":
				oControl = this.getNumericTile(oData);
				break;

			case "column":
			case "stacked_column":
			case "line":
				oControl = this.getChart(oData, {
					uidValueAxis: "valueAxis",
					uidCategoryAxis: "categoryAxis",
					plotAreaDataLabelVisible: true,
					vizType: sVizType,
					titleVisible: false,
					height: "222px",
					width: "363px",
					gridlineVisible: false,
					axisLineVisible: false,
					styleClass: ""
				});
				break;
			case "donut":
				oControl = this.getChart(oData, {
					uidValueAxis: "size",
					uidCategoryAxis: "color",
					plotAreaDataLabelVisible: true,
					vizType: sVizType,
					titleVisible: false,
					height: "222px",
					width: "363px",
					gridlineVisible: true,
					axisLineVisible: true,
					styleClass: ""
				});
				break;
			}
			var oVbox = new sap.m.VBox({
				height: "278px",
				width: "393px",
				items: [
					new Text({
						text: oData.title,
						tooltip: oData.title,
						maxLines: 1
					}).addStyleClass("gridTitle"),
					new HTML({
						content: "<div class='titleMarker'></div> "
					}),
					oControl
				]
			}).addStyleClass("favourites grid");
			return oVbox;
		},

		// triggerWithEifa: function () {
		// 	console.log(vFinal);
		// 	if (this.micAlreadyTriggered || vFinal.toLowerCase().indexOf("aisa") > -1 || vFinal.toLowerCase().indexOf("eifa") > -1 ||
		// 		vFinal.toLowerCase().indexOf("iifa") > -1) {
		// 		this.getModel().setProperty("/mic/search/state", "active");
		// 		if (!this.oSearchResultDialog) {
		// 			this.openSearchResultDialog();
		// 		} else if (!this.oSearchResultDialog.isOpen()) {
		// 			this.openSearchResultDialog();
		// 		}
		// 		if (vFinal.indexOf("IIFA") > -1) {
		// 			this.micAlreadyTriggered = true;
		// 			this.clear();
		// 		}
		// 		var id = setInterval(function () {
		// 			console.log("from interval")
		// 			this.clear();
		// 			this.getModel().setProperty("/mic/search/state", "idle");
		// 			this.micAlreadyTriggered = false;
		// 			if (!this.userAskedQuestion) {
		// 				this.oSearchResultDialog.close();
		// 				this.userAskedQuestion = false;
		// 			}
		// 		}.bind(this), 8000);
		// 		this.id.push(id);
		// 		var sQuestion = vFinal.slice(vFinal.indexOf("IIFA") + 4).trim();
		// 		if (sQuestion.length) {
		// 			this.clear();
		// 			this.getModel().setProperty("/mic/search/state", "idle");
		// 			this.micAlreadyTriggered = false;
		// 			this.userAskedQuestion = true;
		// 			this.getModel().setProperty("/question", sQuestion);
		// 			this.showSearchInPopover();
		// 		}
		// 	}
		// },
	});

});