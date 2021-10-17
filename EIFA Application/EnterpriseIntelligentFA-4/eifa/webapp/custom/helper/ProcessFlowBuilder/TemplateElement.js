sap.ui.define([

], function (library, Control, ProcessFlowBuilderRenderer) {
	"use strict";
	var $ = go.GraphObject.make;
	var TemplateElement = function(){
			
	};
    TemplateElement.prototype.create = function(oControl,goDiagram,divId){
		var myPalette = $(go.Palette, oControl.getId()+divId,{
			"animationManager.isInitial": false,
            maxSelectionCount: 1,
            nodeTemplateMap: goDiagram.nodeTemplateMap,
            linkTemplate: $(go.Link,{
                  locationSpot: go.Spot.Center,
                  selectionAdornmentTemplate:
                    $(go.Adornment, "Link",
                      { locationSpot: go.Spot.Center },
                      $(go.Shape,
                        { isPanelMain: true, fill: null, stroke: "deepskyblue", strokeWidth: 0 }),
                      $(go.Shape,  // the arrowhead
                        { toArrow: "Standard", stroke: null })
                    )
            },{
              routing: go.Link.AvoidsNodes,
              curve: go.Link.JumpOver,
              corner: 5,
              toShortLength: 4
            },
            new go.Binding("points"),
            $(go.Shape,  // the link path shape
            	{ isPanelMain: true, strokeWidth: 2 }),
            $(go.Shape,  // the arrowhead
            	{ toArrow: "Standard", stroke: null })
        	),
            model: this.createNodeLinksModel(oControl,goDiagram)
    	});
	};
	TemplateElement.prototype.createNodeLinksModel = function(oControl,goDiagram){
		var templateModel = [];
		var aTemplates = oControl.getAggregation('templates')
		if(!aTemplates){
			return new go.GraphLinksModel(templateModel); 
		}
		aTemplates.forEach(function (e) {
			// var template = e.getTemplate(e.getPort());
			// goDiagram.nodeTemplateMap.add(template.type, template.data);
			templateModel.push({
				category: e.getType(),
				text: e.getText(),
				figure : e.getShape(),
				fill : e.getColor(),
				width : e.getWidth(),
				height : e.getHeight()
			})
		}.bind(this));
		return new go.GraphLinksModel(templateModel);
	}
	return TemplateElement;
});