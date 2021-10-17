sap.ui.define(["sap/m/MessageBox"], function (MessageBox) {
	"use strict";
	return {
		crudOperations: function (oOptions) {
			oOptions.url = this.baseURL(oOptions);
			return new Promise(function (resolve, reject) {
				oOptions = $.extend(oOptions, {
					cache: false,
					success: function (response) {
						resolve(response);
					},
					error: function (e) {
						console.log(e);
						reject(e);
					}
				});
				$.ajax(oOptions);
			});
		},
		baseURL: function (oOptions) {
			return "../EIFA-NODE_api/" + oOptions.url;
		},
		objectStoreURL: function (oOptions) {
			return "https://itcappobjectstore.cfapps.eu10.hana.ondemand.com/api/" + oOptions.url;
		}

	};
});