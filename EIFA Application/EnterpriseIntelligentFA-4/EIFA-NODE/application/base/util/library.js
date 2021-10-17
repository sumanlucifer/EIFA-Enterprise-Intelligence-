const currencyConversion = (labelValue) => {
	let label = null;
	if (labelValue && labelValue.substring) {
		label = Number(Math.abs(Number(labelValue)).toFixed(2));
	} else if (labelValue && labelValue.toFixed) {
		label = Math.abs(labelValue).toFixed(2);
	} else {
		return labelValue;
	}
	// Nine Zeroes for Billions
	return label >= 1.0e9 ?
		parseInt((label / 1.0e9)) + 'B' : // Six Zeroes for Millions
		label >= 1.0e6 ?
		parseInt((label / 1.0e6)) + 'M' : // Three Zeroes for Thousands
		label >= 1.0e3 ?
		parseInt((label / 1.0e3)) + 'K' :
		label;
}

const dateConversion = (date) => {

	let monthNames = ["Jan", "Feb", "Mar", "Apr",
		"May", "Jun", "Jul", "Aug",
		"Sep", "Oct", "Nov", "Dec"
	];

	let day = date.getDate();

	let monthIndex = date.getMonth();
	let monthName = monthNames[monthIndex];
	let hour = date.getHours();
	var minute = padValue(date.getMinutes());
	var sAMPM = "AM";

	let year = date.getFullYear();

	var iHourCheck = parseInt(hour);

	if (iHourCheck > 12) {
		sAMPM = "PM";
		hour = iHourCheck - 12;
	} else if (iHourCheck === 0) {
		hour = "12";
	}

	hour = padValue(hour);

	return `${day} ${monthName} ${year}, ${hour}.${minute} ${sAMPM}`;
}

const padValue = (value) => {
	return (value < 10) ? "0" + value : value;
}

exports.currencyConversion = currencyConversion;
exports.dateConversion = dateConversion;