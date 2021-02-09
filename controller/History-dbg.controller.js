sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("REPINTEMPOLEEY.REPINTEMPOLEEY.controller.History", {
		onInit: function () {
			this._data = {
				History: [

					{
						Data: "06/02/2020",
						Fer: "lun-mart-merc-gio-ven",
						Sab: "Sab",
						Dom: "Dom",
						n: "123456",
						Lpn: "LPN",
						OraInizio: "10:30 AM",
						OraFine: "10:30 AM",
						Rip: "X",
						Causa: "Demo text",
						RemotoOnSite: "OnSite",
						Status: "Aperto"

					}, {
						Data: "06/02/2020",
						Fer: "lun-mart-merc-gio-ven",
						Sab: "Sab",
						Dom: "Dom",
						n: "123456",
						Lpn: "LPN",
						OraInizio: "10:30 AM",
						OraFine: "10:30 AM",
						Rip: "X",
						Causa: "Demo text",
						RemotoOnSite: "OnSite",
						Status: "Aperto"

					}, {
						Data: "06/02/2020",
						Fer: "lun-mart-merc-gio-ven",
						Sab: "Sab",
						Dom: "Dom",
						n: "123456",
						Lpn: "LPN",
						OraInizio: "10:30 AM",
						OraFine: "10:30 AM",
						Rip: "X",
						Causa: "Demo text",
						RemotoOnSite: "OnSite",
						Status: "Aperto"

					}, {
						Data: "06/02/2020",
						Fer: "lun-mart-merc-gio-ven",
						Sab: "Sab",
						Dom: "Dom",
						n: "123456",
						Lpn: "LPN",
						OraInizio: "10:30 AM",
						OraFine: "10:30 AM",
						Rip: "X",
						Causa: "Demo text",
						RemotoOnSite: "OnSite",
						Status: "Aperto"

					}, {
						Data: "06/02/2020",
						Fer: "lun-mart-merc-gio-ven",
						Sab: "Sab",
						Dom: "Dom",
						n: "123456",
						Lpn: "LPN",
						OraInizio: "10:30 AM",
						OraFine: "10:30 AM",
						Rip: "X",
						Causa: "Demo text",
						RemotoOnSite: "OnSite",
						Status: "Vicino"

					}, {
						Data: "06/02/2020",
						Fer: "lun-mart-merc-gio-ven",
						Sab: "Sab",
						Dom: "Dom",
						n: "123456",
						Lpn: "LPN",
						OraInizio: "10:30 AM",
						OraFine: "10:30 AM",
						Rip: "X",
						Causa: "Demo text",
						RemotoOnSite: "OnSite",
						Status: "Aperto"

					}, {
						Data: "06/02/2020",
						Fer: "lun-mart-merc-gio-ven",
						Sab: "Sab",
						Dom: "Dom",
						n: "123456",
						Lpn: "LPN",
						OraInizio: "10:30 AM",
						OraFine: "10:30 AM",
						Rip: "X",
						Causa: "Demo text",
						RemotoOnSite: "OnSite",
						Status: "Aperto"

					}, {
						Data: "06/02/2020",
						Fer: "lun-mart-merc-gio-ven",
						Sab: "Sab",
						Dom: "Dom",
						n: "123456",
						Lpn: "LPN",
						OraInizio: "10:30 AM",
						OraFine: "10:30 AM",
						Rip: "X",
						Causa: "Demo text",
						RemotoOnSite: "OnSite",
						Status: "Vicino"

					}, {
						Data: "06/02/2020",
						Fer: "lun-mart-merc-gio-ven",
						Sab: "Sab",
						Dom: "Dom",
						n: "123456",
						Lpn: "LPN",
						OraInizio: "10:30 AM",
						OraFine: "10:30 AM",
						Rip: "X",
						Causa: "Demo text",
						RemotoOnSite: "OnSite",
						Status: "Vicino"

					}, {
						Data: "06/02/2020",
						Fer: "lun-mart-merc-gio-ven",
						Sab: "Sab",
						Dom: "Dom",
						n: "123456",
						Lpn: "LPN",
						OraInizio: "10:30 AM",
						OraFine: "10:30 AM",
						Rip: "X",
						Causa: "Demo text",
						RemotoOnSite: "OnSite",
						Status: "Aperto"

					}, {
						Data: "06/02/2020",
						Fer: "lun-mart-merc-gio-ven",
						Sab: "Sab",
						Dom: "Dom",
						n: "123456",
						Lpn: "LPN",
						OraInizio: "10:30 AM",
						OraFine: "10:30 AM",
						Rip: "X",
						Causa: "Demo text",
						RemotoOnSite: "OnSite",
						Status: "Aperto"

					}, {
						Data: "06/02/2020",
						Fer: "lun-mart-merc-gio-ven",
						Sab: "Sab",
						Dom: "Dom",
						n: "123456",
						Lpn: "LPN",
						OraInizio: "10:30 AM",
						OraFine: "10:30 AM",
						Rip: "X",
						Causa: "Demo text",
						RemotoOnSite: "OnSite",
						Status: "Aperto"

					}, {
						Data: "06/02/2020",
						Fer: "lun-mart-merc-gio-ven",
						Sab: "Sab",
						Dom: "Dom",
						n: "123456",
						Lpn: "LPN",
						OraInizio: "10:30 AM",
						OraFine: "10:30 AM",
						Rip: "X",
						Causa: "Demo text",
						RemotoOnSite: "OnSite",
						Status: "Aperto"

					}
				]
			};
			this.jModel = new sap.ui.model.json.JSONModel();
			this.jModel.setData(this._data);
			this.getView().byId('idTableHistory').setModel(this.jModel);
		},
		handleCreate: function (oEvent) {
			sap.ui.core.UIComponent.getRouterFor(this).navTo("create", {
				create: "create"

			});
		},
		handleBack: function (oEvent) {
			sap.ui.core.UIComponent.getRouterFor(this).navTo("SchedaRepInt", {
				create: "SchedaRepInt"

			});
		},
		onEdit: function (oEvent) {

			var oItem = oEvent.getSource().getParent();
			var oTable = this.getView().byId("idTableHistory");
			var oIndex = oTable.indexOfItem(oItem);
			var Object = oTable.getModel().getObject("/History")[oIndex];
			if (Object) {
				var oItems = oTable.getItems()[oIndex];
				this.onPress(oItems, false);
				var oCurrentItem = oTable.getItems()[oIndex];
				if (oEvent.getSource().getPressed()) {
					this.onPress(oCurrentItem, true);
				} else {
					this.onPress(oCurrentItem, false);
				}

			}

		},
		onPress: function (oItem, oFlag) {
			var oEditableCells = oItem.getCells();
			for (var i = 0; i < oEditableCells.length - 2; i++) {
				var oEditableCell = oEditableCells[i];
				if (oEditableCell.getItems()) {
					var listControl = oEditableCell.getItems();
					$(listControl).each(function (j) {
						var oMetaData = listControl[j].getMetadata();
						var oElement = oMetaData.getElementName();
						if (oElement == "sap.m.Text") {
							listControl[j].setVisible(!oFlag);
						}
						if (oElement == "sap.m.Input") {
							listControl[j].setVisible(oFlag);
							listControl[j].setEditable(oFlag);
						}
					});
				}
			}
		},
		onDelete: function (oEvent) {	
			var deleteRecord = oEvent.getSource().getBindingContext().getObject();
			for (var i = 0; i < this._data.History.length; i++) {
				if (this._data.History[i] == deleteRecord) {
					this._data.History.splice(i, 1); 
					this.jModel.refresh();
					break; 
				}
			}}
	});
});