sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("REPINTEMPOLEEY.REPINTEMPOLEEY.controller.create", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf zinsertapp.zinsertapp.view.create
		 */
		onInit: function () {
			var mainData = {
				"ItemsInfo": [{
					"Value1": "",
					"Value2": false,
					"Value3": false,
					"Value4": false,
					"Value5": "",
					"Value6": "",
					"Value7": "",
					"Value8": "",
					"Value9": true,
					"Value10": "",
					"Value11": "",
					"Value12": "",
					"bAdd": true,
					"bDelete": false
				}]
			};

			var oMainModel = new sap.ui.model.json.JSONModel();
			oMainModel.setData(
				mainData
			);
			this.getView().setModel(oMainModel, "MainModel");
            this.mytext = this.getUrlVars();
            this.getView().byId("txtId").setText(this.mytext.ID);
		},
		getUrlVars: function () {
			var vars = {};
			var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
				vars[key] = value;
			});
			return vars;
		},
		handleBack: function () {
			sap.ui.core.UIComponent.getRouterFor(this).navTo("create", {
				Home: "create"

			});
		},
		handleHistory: function () {
			sap.ui.core.UIComponent.getRouterFor(this).navTo("History", {
				Home: "History"

			});
		},
		handleEntry : function(){
		sap.ui.core.UIComponent.getRouterFor(this).navTo("SchedaRepInt", {
				SchedaRepInt: "SchedaRepInt"

			});	
		},
		handleEntryDetail : function(){
		sap.ui.core.UIComponent.getRouterFor(this).navTo("SchRepIntDetail", {
				SchRepIntDetail: "SchRepIntDetail"

			});	
		},
		onAddItems: function () {

			var data = this.getView().getModel("MainModel").getProperty("/ItemsInfo");
			var oEntry = {
				"Value1": "",
				"Value2": false,
				"Value3": false,
				"Value4": false,
				"Value5": "",
				"Value6": "",
				"Value7": "",
				"Value8": "",
				"Value9": true,
				"Value10": "",
				"Value11": "",
				"Value12": "",
				"bAdd": true,
				"bDelete": true
			};
			data.push(oEntry);
			this.getView().getModel("MainModel").setProperty("/ItemsInfo", data);
		},
		onDeleteCategory: function (oEvent) {
			var data = this.getView().getModel("MainModel").getProperty("/ItemsInfo");
			var index = oEvent.getSource().getParent().getParent().getParent().getParent().getParent().indexOfItem(oEvent.getSource().getParent()
				.getParent().getParent().getParent());
			if (data.length - 1 === index) {
				data[index - 1].bAdd = true;
			}
			data.splice(index, 1);
			if (data.length === 1) {
				data[0].bDelete = false;
				data[0].bAdd = true;
			}
			this.getView().getModel("MainModel").setProperty("/ItemsInfo", data);
		}
	});

});