sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"REPINTEMPOLEEY/REPINTEMPOLEEY/model/models",
	"sap/m/MessageBox"
], function (UIComponent, Device, models, MessageBox) {
	"use strict";

	return UIComponent.extend("REPINTEMPOLEEY.REPINTEMPOLEEY.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			// var oEmpModel = new sap.ui.model.json.JSONModel();
			// oEmpModel.loadData("/services/userapi/currentUser");
			// this.setModel(oEmpModel, "empModel");

			//$.cookie("session", null);
			var oEntry = {};
			$.ajax({
				url: "/services/userapi/currentUser",
				async: false,
				success: function (data, response) {
					oEntry.name = data.name.toUpperCase();
					//oEntry.name = "P2002397341";
				},
				error: function (xhr, textStatus, error) {
					jQuery.sap.log.getLogger().error("Get Employee Authorization fetch failed" + error.toString());
				}
			});
			var oEmpModel = new sap.ui.model.json.JSONModel();
			oEmpModel.setData(oEntry);
			this.setModel(oEmpModel, "empModel");

			// /* Add a completion handler to log the json and any errors*/
			// oModel.attachRequestCompleted(function onCompleted(oEvent) {
			// 		if (oEvent.getParameter("success")) {
			// 			this.setData({
			// 				"json": this.getJSON(),
			// 				"status": "Success"
			// 			}, true);
			// 		} else {
			// 			var msg = oEvent.getParameter("errorObject").textStatus;
			// 			if (msg) {
			// 				this.setData("status", msg);
			// 			} else {
			// 				this.setData("status", "Unknown error retrieving user info");
			// 			}
			// 		}
			// });
			/* End model creation and loading*/

			var xsoDataModel = new sap.ui.model.odata.v2.ODataModel("/HANAMDC/REPINT/RepintEmployee/xsodata/RepintEmployee.xsodata/", {
				json: true,
				defaultBindingMode: "TwoWay"
			});

			this.setModel(xsoDataModel, "basexsoModel");

			this.setModel(new sap.ui.model.json.JSONModel(), "viewProperties");
			this.checkAuthorization();

		},

		checkAuthorization: function () {

			var that = this;
			//var empID = this.getModel("empModel").getData().name; // Get logged in Emp EmpId
			var empID = this.getModel("empModel").getData().name; // Get logged in Emp EmpId
			empID = empID.toUpperCase();
			//empID = "P2001257460";
			
			var repintEmpAuthoModel = new sap.ui.model.json.JSONModel();
			var oRepintEmpAuthoJson = [];
			var oRepintEmpAuthoJsonData = {};

			// Actual working url below
			var urlgetAutho = "/HANAMDC/REPINT/RepintEmployee/xsjs/getAuthorization.xsjs/?aEmpid=" + empID + "";

			$.ajax({
				url: urlgetAutho,
				success: function (data, response) {
					console.log(data);

					// enable routing
					that.getRouter().initialize();
					
					if(data[0].ROLE_EMP === "X"){ // Authorized to access "Repint Employee" App
						oRepintEmpAuthoJsonData = {
							"AUTHHORIZEDDATA": data[0],
							"MATRICOLA": data[0].MATRICOLA,
							"ROLE_DEPUTY": data[0].ROLE_DEPUTY,
							"ROLE_EMP": data[0].ROLE_EMP,
							"ROLE_HR": data[0].ROLE_HR,
							"ROLE_HRBP": data[0].ROLE_HRBP,
							"ROLE_MANAGER": data[0].ROLE_MANAGER
						};			
	
						oRepintEmpAuthoJson.push(oRepintEmpAuthoJsonData);
						repintEmpAuthoModel.setData(oRepintEmpAuthoJson);
						that.setModel(repintEmpAuthoModel, "EmpAuthoModel");
						console.log("EmpAutho" + repintEmpAuthoModel);
	
						that.getModel("viewProperties").setProperty("/Authorized", true);						
					}else{
						that.getModel("viewProperties").setProperty("/Authorized", false);
						jQuery.sap.log.getLogger().error("Employee Authorization failed ");					
						sap.ui.core.UIComponent.getRouterFor(that).navTo("Unauthorized");						
					}
				},
				error: function (xhr, textStatus, error) {
					that.getRouter().initialize();
					that.getModel("viewProperties").setProperty("/Authorized", false);
					jQuery.sap.log.getLogger().error("Employee Authorization failed " + error.toString());					
					sap.ui.core.UIComponent.getRouterFor(that).navTo("Unauthorized");
				}

			});
		}

	});
});