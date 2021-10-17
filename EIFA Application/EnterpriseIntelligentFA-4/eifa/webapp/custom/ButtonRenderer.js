sap.ui.define([
	"sap/ui/commons/RichTooltip"
],

	function (RichTooltip) {

		var ButtonRenderer = {};
		ButtonRenderer.render = function (oRm, oControl) {
			var style=`background:${oControl.getBgColor()};color:${oControl.getTextColor()};display:${oControl.getVisible()?'block':'none'};text-transform: none;`;
			switch(oControl.getType()){
				case("miniIcon") :
					var button =
						`
						<button class="mdl-button mdl-js-button mdl-button--icon" style="${style}">
						  <i class="material-icons" style="color:${oControl.getIconColor()}">${oControl.getIcon()}</i>
						  <span style="font-size:1rem;">${oControl.getText()}</span>
						</button>
						`;
						break;
				case("textOnly") : 
					var button = 
					`
						<button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" style="${style}"  
							${oControl.getDisabled()?'disabled':''}
						>
							<i class="material-icons" style="color:${oControl.getIconColor()}">${oControl.getIcon()}</i>
							${oControl.getText()}
						</button>
					`;
					break;
				case("profileView") : 
					var button = 
					`
						<button class="mdl-button mdl-js-button mdl-button--icon" style="${style}">
							<img style="height: 100%;" src="${oControl.getIcon()}"/>
						</button>
					`;
					break;
			}
			//Set Tooltip
			if(oControl.getHelperText().length){
				oControl.setTooltip(
					new RichTooltip({
						title : oControl.getText(),
						text : oControl.getHelperText() 
					})
				)
			}
			
			oRm.write("<div");

			oRm.writeControlData(oControl);
			oRm.writeClasses();
			oRm.write(">");
			oRm.write(button);
			oRm.write("</div>");
		};
		return ButtonRenderer;
	});