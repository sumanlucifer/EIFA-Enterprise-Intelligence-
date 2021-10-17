sap.ui.define([

], function (library, Control, ProcessFlowBuilderRenderer) {
	"use strict";
	var $ = go.GraphObject.make;
	var NodeTemplate = function(){
			
	};
	NodeTemplate.prototype.makePort = function(name, spot, output, input){
		return $(go.Shape, "Circle",
	        {
				fill: null,  
				stroke: null,
				desiredSize: new go.Size(7, 7),
				alignment: spot,
				alignmentFocus: spot,
				portId: name,
				fromSpot: spot, toSpot: spot,
				fromLinkable: output, toLinkable: input,
				cursor: "pointer"
    		});
	};
	NodeTemplate.prototype.showSmallPorts = function(node, show) {
		// node.ports.each(function(port) {
		//   if (port.portId !== "") {
		//     port.fill = show ? "rgba(0,0,0,1)" : null;
		//   }
		// });
	};
    NodeTemplate.prototype.create =function(oControl){
			return $(
				go.Node,
				"Spot",
				{ locationSpot: go.Spot.Center },
				{ deletable: !oControl.getIsViewOnly() },
				new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
    			$(
					go.Panel,
					"Auto",
					{ name: "PANEL" },
					new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
            		$(go.Shape, "Rectangle",{
                		portId: "", // the default port: if no spot on link data, use closest side
                		fromLinkable: true, toLinkable: true, cursor: "pointer",
                		fill: "white",  // default color
		                strokeWidth: .5
            		},
            		new go.Binding("figure"),
            		new go.Binding("fill")),
            		$(go.TextBlock,{
                		font: "12pt EYInterstate, Arial, sans-serif",
                		margin: 8,
                		maxSize: new go.Size(160, NaN),
            			wrap: go.TextBlock.WrapFit,
                		editable: false
            		},
            		new go.Binding("text").makeTwoWay())
        		),
				$(go.Panel, "Auto",{
						visible :oControl.getEdgeTextVisible(),
						alignment: go.Spot.TopRight
						
					},
					$(go.Shape, "RoundedRectangle",{ 
			          fill: "#E0362C", height: 18,
			          strokeWidth:0
		        	}),
					$(go.TextBlock, new go.Binding("text", "textSuper"), {
						// width: 14,
						font: "9pt helvetica, arial, sans-serif",
						stroke:"white",
						margin:0,
						background:"red",
						textAlign :"center",
						height: 14,
						editable: false
					})
				),
    			this.makePort("T", go.Spot.Top, false, true),
	        	this.makePort("L", go.Spot.Left, true, true),
	        	this.makePort("R", go.Spot.Right, true, true),
	        	this.makePort("B", go.Spot.Bottom, true, false),
        		{ // handle mouse enter/leave events to show/hide the ports
		            mouseEnter: function(e, node) { this.showSmallPorts(node, true); }.bind(this),
		            mouseEnter: function(e, node) { this.showSmallPorts(node, false); }.bind(this),
		        }
        	);
        }
	return NodeTemplate;
});