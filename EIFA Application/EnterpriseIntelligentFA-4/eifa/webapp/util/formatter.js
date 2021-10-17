sap.ui.define([
	"sap/ui/core/format/DateFormat"
], function (DateFormat) {
	"use strict";
	return {
		getRecommendationFormattedDate: function () {

			return "29/08/2020";
		},
		getFormattedDate: function () {
			var dDate = new Date(),
				iDate = (dDate).getDate(),
				sDateSuffix = "",
				sMonth = dDate.toLocaleString("default", {
					month: "short"
				});;
			switch (iDate % 10) {
			case 1:
				sDateSuffix = "st";
				break;
			case 2:
				sDateSuffix = "nd";
				break;
			case 3:
				sDateSuffix = "rd";
				break;
			default:
				sDateSuffix = "th";
			}

			return iDate + sDateSuffix + " " + sMonth + " " + dDate.getFullYear();
		},

		getMicImageSrc: function (sMicState) {
			var oSrc = {
				idle: "micIdle",
				active: "micActive",
				off: "micOff"
			};

			return "./util/image/" + oSrc[sMicState] + ".png"
		},
		getCommentsMicImageSrc: function (sMicState) {
			var oSrc = {
				active: "commentsMicActive",
				off: "commentsMicOff"
			};

			return "./util/image/" + oSrc[sMicState] + ".png"
		},
	};
});