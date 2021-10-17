/*!
 * ${copyright}
 */
// Provides control ey.ss.test.eygdscc.Example.
sap.ui.define([
	"sap/ui/core/Control", "./ButtonRenderer"
], function (Control, ButtonRenderer) {
	"use strict";

	var Button = Control.extend("ey.eifa.custom.Button", {
		metadata: {
			//library: "ey.ss.test.eygdscc",
			properties: {
				text: {
					type: "string",
					defaultValue: null
				},
				visible: {
					type: "boolean",
					defaultValue: "true"
				},
				//Types Available : https://material.io/tools/icons/?style=baseline
				icon: {
					type: "string",
					defaultValue: null
				},
				//Types Available : miniIcon,profileView,textOnly
				type: {
					type: "string",
					defaultValue: "miniIcon"
				},
				enablePropagation: {
					type: "boolean",
					defaultValue: false
				},
				disabled: {
					type: "boolean",
					defaultValue: false
				},
				bgColor: {
					type: "string",
					defaultValue: "miniIcon"
				},
				iconColor: {
					type: "string",
					defaultValue: "white"
				},
				textColor: {
					type: "string",
					defaultValue: "miniIcon"
				},
				helperText: {
					type: "string",
					defaultValue: ""
				}
			},
			events: {
				press: {}
			}
		},
		onclick: function (e) {
			if (this.getDisabled()) {
				return;
			}
			if (this.getEnablePropagation()) {
				e.stopPropagation();
			}
			this.firePress(e);
		},
		renderer: ButtonRenderer
	});
	return Button;
});