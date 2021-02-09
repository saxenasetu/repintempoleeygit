sap.ui.define(["sap/ui/core/mvc/Controller"], function (e) {
	"use strict";
	return e.extend("REPINTEMPOLEEY.REPINTEMPOLEEY.controller.create", {
		onInit: function () {
			var e = {
				ItemsInfo: [{
					Value1: "",
					Value2: false,
					Value3: false,
					Value4: false,
					Value5: "",
					Value6: "",
					Value7: "",
					Value8: "",
					Value9: true,
					Value10: "",
					Value11: "",
					Value12: "",
					bAdd: true,
					bDelete: false
				}]
			};
			var t = new sap.ui.model.json.JSONModel;
			t.setData(e);
			this.getView().setModel(t, "MainModel");
			this.mytext = this.getUrlVars();
			this.getView().byId("txtId").setText(this.mytext.ID)
		},
		getUrlVars: function () {
			var e = {};
			var t = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (t, a, n) {
				e[a] = n
			});
			return e
		},
		handleBack: function () {
			sap.ui.core.UIComponent.getRouterFor(this).navTo("create", {
				Home: "create"
			})
		},
		handleHistory: function () {
			sap.ui.core.UIComponent.getRouterFor(this).navTo("History", {
				Home: "History"
			})
		},
		handleEntry: function () {
			sap.ui.core.UIComponent.getRouterFor(this).navTo("SchedaRepInt", {
				SchedaRepInt: "SchedaRepInt"
			})
		},
		onAddItems: function () {
			var e = this.getView().getModel("MainModel").getProperty("/ItemsInfo");
			var t = {
				Value1: "",
				Value2: false,
				Value3: false,
				Value4: false,
				Value5: "",
				Value6: "",
				Value7: "",
				Value8: "",
				Value9: true,
				Value10: "",
				Value11: "",
				Value12: "",
				bAdd: true,
				bDelete: true
			};
			e.push(t);
			this.getView().getModel("MainModel").setProperty("/ItemsInfo", e)
		},
		onDeleteCategory: function (e) {
			var t = this.getView().getModel("MainModel").getProperty("/ItemsInfo");
			var a = e.getSource().getParent().getParent().getParent().getParent().getParent().indexOfItem(e.getSource().getParent().getParent()
				.getParent().getParent());
			if (t.length - 1 === a) {
				t[a - 1].bAdd = true
			}
			t.splice(a, 1);
			if (t.length === 1) {
				t[0].bDelete = false;
				t[0].bAdd = true
			}
			this.getView().getModel("MainModel").setProperty("/ItemsInfo", t)
		}
	})
});