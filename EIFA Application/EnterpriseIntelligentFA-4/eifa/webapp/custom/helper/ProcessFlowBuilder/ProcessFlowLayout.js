sap.ui.define([

], function () {
	"use strict";
	var $ = go.GraphObject.make;
	var ProcessFlowLayout = function () {};
	
	ProcessFlowLayout.prototype.create = function (type) {
		if(type === 'tree'){
			return this.createTreeLayout();
		}else{
			return this.createGridLayout(); 
		}
	};
	ProcessFlowLayout.prototype.createTreeLayout = function () {
		return $(go.TreeLayout,{ angle: 90, nodeSpacing: 15, layerSpacing: 50, layerStyle: go.TreeLayout.LayerUniform })
	};
	ProcessFlowLayout.prototype.createGridLayout = function () {
		return $(go.GridLayout,{ 
			//comparer: go.GridLayout.smartComparer 
			direction: 90,
			isOngoing: false,
			isInitial: false,
			isViewportSized: false
		})
	};
	return ProcessFlowLayout;
});