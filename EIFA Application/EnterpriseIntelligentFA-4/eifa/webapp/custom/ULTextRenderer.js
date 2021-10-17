sap.ui.define([],

	function () {

		var ULTextRenderer = {};
		ULTextRenderer.render = function (oRm, oControl) {
			var ulText = 
				`
				<div style="display : inline-block;  font-family: EYInterstate;">
				  <div style="ulText;color: ${oControl.getTextColor()}" >${oControl.getText()}</div>
				  <span style="background: ${oControl.getUlColor()}; height: ${oControl.getUlHeight()}; margin-top:.5rem; display : inline-block; left: 0;  width:${oControl.getUlWidth()}; border-radius:10px;"/>
				</div>
				`
			
			oRm.write("<div");
			oRm.writeControlData(oControl);
			
			oRm.writeClasses();
			oRm.write(">");
			oRm.write(ulText);
			oRm.write("</div>");
		};
		return ULTextRenderer;
	});