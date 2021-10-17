sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"ey/eifa/util/api",
	"ey/eifa/util/formatter",
	"ey/eifa/util/api",
	"ey/eifa/util/libraries/canvg",
	"ey/eifa/util/libraries/jspdf",
	"ey/eifa/util/libraries/rgbcolor",
	"ey/eifa/util/libraries/stackblur"
], function (Controller, JSONModel, api, formatter) {
	"use strict";

	return Controller.extend("ey.eifa.controller.BaseController", {
		formatter: formatter,
		getAPI: api,
		getModel: function (sName) {
			return this.getOwnerComponent().getModel(sName);
		},
		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		}

	});
});