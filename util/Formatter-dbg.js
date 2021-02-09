/*global com*/
$.sap.declare("REPINTEMPOLEEY.REPINTEMPOLEEY.util.Formatter");

REPINTEMPOLEEY.REPINTEMPOLEEY.util.Formatter = {

	setConvertValue: function (text) {
		if (text == true) {
			return "X"
		}
		if (text == false) {
			return ""
		}
	},

	convertmstomins: function (sValue) {
		if (sValue === "") {
			return 0;
		} else {
			return sValue / 60000;
		}
	},

	convertminstoHHSS: function (MINUTES) {
		var m = MINUTES % 60;

		var h = (MINUTES - m) / 60;

		var HHMM = h.toString() + ":" + (m < 10 ? "0" : "") + m.toString();
		
		return HHMM;
	},

	checkTipogiornoFer: function (text) {
		if (text === "L") {
			return true;
		} else {
			return false;
		}
	},
	
	formatRIPValue: function(sValue){
		if(sValue === 1){
			return true;
		}else{
			return false;
		}	
	},

	checkTipogiornoSab: function (text) {
		if (text === "S") {
			return true;
		} else {
			return false;
		}
	},

	checkTipogiornoDom: function (text) {
		if (text === "F") {
			return true;
		} else {
			return false;
		}
	},

	formatDate: function (sValue) {
		if (sValue === "" || sValue === undefined || sValue === null) {
			return "";
		} else {
			jQuery.sap.require("sap.ui.core.format.DateFormat");
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "dd-MM-yyyy"
			});

			return oDateFormat.format(new Date(sValue), true);
		}
	},
	formatDateMulti: function (sValue) {
		var formatteddate;
		if (sValue === "" || sValue === undefined || sValue === null) {
			return "";
		} else {

			var mnths = {
					Jan: "01",
					Feb: "02",
					Mar: "03",
					Apr: "04",
					May: "05",
					Jun: "06",
					Jul: "07",
					Aug: "08",
					Sep: "09",
					Oct: "10",
					Nov: "11",
					Dec: "12"
				},
				date = sValue.toString().split(" ");
			formatteddate = [date[3], mnths[date[1]], date[2]].join("-");

			return (formatteddate).split("-")[2] + "-" + (formatteddate).split("-")[1] + "-" + (formatteddate).split("-")[0];

		}
	},	
	formatDateInterventi: function (sValue) {
		var formatteddate;
		if (sValue === "" || sValue === undefined || sValue === null) {
			return "";
		} else {

			var mnths = {
					Jan: "01",
					Feb: "02",
					Mar: "03",
					Apr: "04",
					May: "05",
					Jun: "06",
					Jul: "07",
					Aug: "08",
					Sep: "09",
					Oct: "10",
					Nov: "11",
					Dec: "12"
				},
				date = sValue.toString().split(" ");
			formatteddate = [date[3], mnths[date[1]], date[2]].join("-");

			return (formatteddate).split("-")[2] + "-" + (formatteddate).split("-")[1] + "-" + (formatteddate).split("-")[0];

		}
	},	
	formatMeseAnno: function(sValue){
		if (sValue === "" || sValue === undefined || sValue === null) {
			return "";
		} else {
			jQuery.sap.require("sap.ui.core.format.DateFormat");
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				//pattern: "MM-y"
				pattern: "yyyy-MM-dd"
			});

			//////return oDateFormat.format(new Date(sValue), true); // CHECK below condition false
			return oDateFormat.format(new Date(sValue), false);
		}		
	},
	
	formatDateToMMDDYYYY: function(sValue){
		if (sValue === "" || sValue === undefined || sValue === null) {
			return "";
		} else {
			return (sValue.split("-")[1] + "-" + sValue.split("-")[0] + "-" + sValue.split("-")[2]);
		}
	},

	formatUTCDate: function (sValue) {
		if (sValue === "" || sValue === undefined || sValue === null) {
			return "";
		} else {
			jQuery.sap.require("sap.ui.core.format.DateFormat");
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-ddTHH:mm:ss"
			});
			//sValue = sValue.substring(0,sValue.indexOf("T")); // E.g Returns "2018-04-03" from "2018-04-03T00:00:00" 
			return oDateFormat.format(new Date(sValue), true);
		}
	},
	
	formatInterventiDate: function (sValue) {
		if (sValue === "" || sValue === undefined || sValue === null) {
			return "";
		} else {

		var dt = sValue.split(" ")[0].split("-");	
		return dt[2] + "-" + dt[1] + "-" + dt[0];
		}
	}

	// formatLPN: function (sValue) {
	// 	if (sValue === 1) {
	// 		return true;
	// 	} else {
	// 		return false;
	// 	}

	// }

};