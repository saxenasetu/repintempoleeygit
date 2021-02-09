sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox"
], function (Controller) {
	"use strict";

	return Controller.extend("REPINTEMPOLEEY.REPINTEMPOLEEY.controller.App", {
		// onInit: function () {

		// 	var that = this;
		// 	var repintEmpAuthoModel = new sap.ui.model.json.JSONModel();
		// 	var oRepintEmpAuthoJson = [];
		// 	var oRepintEmpAuthoJsonData = {};			
		// 	var empID = that.getOwnerComponent().getModel("empModel").getData().name; // Get logged in Emp EmpId

		// 	// Actual working url below
		// 	var urlgetAutho = "/HANAMDC/REPINT/RepintEmployee/xsjs/getAuthorization.xsjs/?aEmpid=" + empID + "";

		// 	$.ajax({
		// 		url: urlgetAutho,
		// 		success: function (data, response) {
		// 			that.getOwnerComponent().getModel("viewProperties").setProperty("/authorizedUser", true);

		// 			oRepintEmpAuthoJsonData = {
		// 				"AUTHHORIZEDDATA": data[0],
		// 				"ROLE_EMP": data[0].ROLE_EMP,
		// 				"AUTHHORIZEDFLAG": "1"
		// 			};
		// 			oRepintEmpAuthoJson.push(oRepintEmpAuthoJsonData);
		// 			repintEmpAuthoModel.setData(oRepintEmpAuthoJson);
		// 			that.getView().setModel(repintEmpAuthoModel, "EmpAuthoModel");					
		// 		},
		// 		error: function (xhr, textStatus, error) {
		// 				that.getOwnerComponent().getModel("viewProperties").setProperty("/authorizedUser", false);

		// 				jQuery.sap.log.getLogger().error("Employee Authorization failed " + error.toString());
		// 				// Forward to Unauthorized page
		// 				var _busyDialog = new sap.m.BusyDialog();
		// 				_busyDialog.open();
		// 				sap.ui.core.UIComponent.getRouterFor(that).navTo("Unauthorized");
		// 				_busyDialog.close();
		// 				// MessageBox.error(
		// 				// 	"Employee Authorization check failed. Please contact Administrator"
		// 				// );
		// 			}
		// 	});

		// },
		

		/**
			 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
			 * This hook is the same one that SAPUI5 controls get after being rendered.

		 */
		onAfterRendering: function () {},
		
	});
});