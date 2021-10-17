sap.ui.define([

], function (library, Control, ProcessFlowBuilderRenderer) {
	"use strict";
	var $ = go.GraphObject.make;
	var LinkTemplate = function () {

	};
	LinkTemplate.prototype.linkSelectionAdornmentTemplate = $(
		go.Adornment,
		"Link",
		$(
			go.Shape, {
				isPanelMain: true,
				fill: null,
				stroke: "deepskyblue",
				strokeWidth: 0
			}
		)
	);
	LinkTemplate.prototype.create = function (oControl) {
		return $(go.Link,
		{ deletable: !oControl.getIsViewOnly() },// the whole link panel
			{
				routing: go.Link.AvoidsNodes,
				curve: go.Link.JumpOver,
				corner: 5,
				toShortLength: 4,
				relinkableFrom: true,
				relinkableTo: true,
				reshapable: true,
				resegmentable: true,
				// mouse-overs subtly highlight links:
				mouseEnter: function (e, link) {
					link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)";
				},
				mouseLeave: function (e, link) {
					link.findObject("HIGHLIGHT").stroke = "transparent";
				},
				selectionAdorned: false
			},
			//Fix for performance issue
			new go.Binding("points"),//.makeTwoWay(),
			$(go.Shape, // the highlight shape, normally transparent
				{
					isPanelMain: true,
					strokeWidth: 8,
					stroke: "transparent",
					name: "HIGHLIGHT"
				}),
			$(go.Shape, // the link path shape
				{
					isPanelMain: true,
					stroke: "gray",
					strokeWidth: 2
				},
				new go.Binding("stroke", "isSelected", function (sel) {
					return sel ? "dodgerblue" : "#A9A9A9";
				}).ofObject()),
			$(go.Shape, // the arrowhead
				{
					fromArrow: "Circle",
					fill: "white",
					strokeWidth: 1,
					stroke: "gray"
				}),
			$(go.Shape, // the arrowhead
				{
					toArrow: "standard",
					strokeWidth: 0,
					fill: "gray"
				}),
			$(go.Panel, "Auto", // the link label, normally not visible
				{
					visible: oControl.getLinksTextVisible(),
					name: "LABEL",
					//segmentIndex: 0,
					//segmentFraction: 0.5,
					segmentOffset: new go.Point(0, 0)
          //segmentOrientation: go.Link.OrientUpright
				},
				//Fix for performance issue
				new go.Binding("visible", "visible"),//.makeTwoWay(),
				$(go.Shape, "RoundedRectangle", // the label shape
					{
						fill: oControl.getFillColorBG(),
						strokeWidth: 0
					}),
				$(go.TextBlock, "", // the label
					{

						textAlign: "center",
						font: "bold 9pt helvetica, arial, sans-serif",
						stroke: oControl.getLinksTextColor(),
						editable: false,
						//background: that.getLinksTextBG()

					},
					new go.Binding("text", "text"))
			)
		);
	}
	return LinkTemplate;
});