sap.ui.define(["sap/ui/core/mvc/Controller"],function(e){"use strict";return e.extend("REPINTEMPOLEEY.REPINTEMPOLEEY.controller.History",{onInit:function(){this._data={History:[{Data:"06/02/2020",Fer:"lun-mart-merc-gio-ven",Sab:"Sab",Dom:"Dom",n:"123456",Lpn:"LPN",OraInizio:"10:30 AM",OraFine:"10:30 AM",Rip:"X",Causa:"Demo text",RemotoOnSite:"OnSite",Status:"Aperto"},{Data:"06/02/2020",Fer:"lun-mart-merc-gio-ven",Sab:"Sab",Dom:"Dom",n:"123456",Lpn:"LPN",OraInizio:"10:30 AM",OraFine:"10:30 AM",Rip:"X",Causa:"Demo text",RemotoOnSite:"OnSite",Status:"Aperto"},{Data:"06/02/2020",Fer:"lun-mart-merc-gio-ven",Sab:"Sab",Dom:"Dom",n:"123456",Lpn:"LPN",OraInizio:"10:30 AM",OraFine:"10:30 AM",Rip:"X",Causa:"Demo text",RemotoOnSite:"OnSite",Status:"Aperto"},{Data:"06/02/2020",Fer:"lun-mart-merc-gio-ven",Sab:"Sab",Dom:"Dom",n:"123456",Lpn:"LPN",OraInizio:"10:30 AM",OraFine:"10:30 AM",Rip:"X",Causa:"Demo text",RemotoOnSite:"OnSite",Status:"Aperto"},{Data:"06/02/2020",Fer:"lun-mart-merc-gio-ven",Sab:"Sab",Dom:"Dom",n:"123456",Lpn:"LPN",OraInizio:"10:30 AM",OraFine:"10:30 AM",Rip:"X",Causa:"Demo text",RemotoOnSite:"OnSite",Status:"Vicino"},{Data:"06/02/2020",Fer:"lun-mart-merc-gio-ven",Sab:"Sab",Dom:"Dom",n:"123456",Lpn:"LPN",OraInizio:"10:30 AM",OraFine:"10:30 AM",Rip:"X",Causa:"Demo text",RemotoOnSite:"OnSite",Status:"Aperto"},{Data:"06/02/2020",Fer:"lun-mart-merc-gio-ven",Sab:"Sab",Dom:"Dom",n:"123456",Lpn:"LPN",OraInizio:"10:30 AM",OraFine:"10:30 AM",Rip:"X",Causa:"Demo text",RemotoOnSite:"OnSite",Status:"Aperto"},{Data:"06/02/2020",Fer:"lun-mart-merc-gio-ven",Sab:"Sab",Dom:"Dom",n:"123456",Lpn:"LPN",OraInizio:"10:30 AM",OraFine:"10:30 AM",Rip:"X",Causa:"Demo text",RemotoOnSite:"OnSite",Status:"Vicino"},{Data:"06/02/2020",Fer:"lun-mart-merc-gio-ven",Sab:"Sab",Dom:"Dom",n:"123456",Lpn:"LPN",OraInizio:"10:30 AM",OraFine:"10:30 AM",Rip:"X",Causa:"Demo text",RemotoOnSite:"OnSite",Status:"Vicino"},{Data:"06/02/2020",Fer:"lun-mart-merc-gio-ven",Sab:"Sab",Dom:"Dom",n:"123456",Lpn:"LPN",OraInizio:"10:30 AM",OraFine:"10:30 AM",Rip:"X",Causa:"Demo text",RemotoOnSite:"OnSite",Status:"Aperto"},{Data:"06/02/2020",Fer:"lun-mart-merc-gio-ven",Sab:"Sab",Dom:"Dom",n:"123456",Lpn:"LPN",OraInizio:"10:30 AM",OraFine:"10:30 AM",Rip:"X",Causa:"Demo text",RemotoOnSite:"OnSite",Status:"Aperto"},{Data:"06/02/2020",Fer:"lun-mart-merc-gio-ven",Sab:"Sab",Dom:"Dom",n:"123456",Lpn:"LPN",OraInizio:"10:30 AM",OraFine:"10:30 AM",Rip:"X",Causa:"Demo text",RemotoOnSite:"OnSite",Status:"Aperto"},{Data:"06/02/2020",Fer:"lun-mart-merc-gio-ven",Sab:"Sab",Dom:"Dom",n:"123456",Lpn:"LPN",OraInizio:"10:30 AM",OraFine:"10:30 AM",Rip:"X",Causa:"Demo text",RemotoOnSite:"OnSite",Status:"Aperto"}]};this.jModel=new sap.ui.model.json.JSONModel;this.jModel.setData(this._data);this.getView().byId("idTableHistory").setModel(this.jModel)},handleCreate:function(e){sap.ui.core.UIComponent.getRouterFor(this).navTo("create",{create:"create"})},handleBack:function(e){sap.ui.core.UIComponent.getRouterFor(this).navTo("SchedaRepInt",{create:"SchedaRepInt"})},onEdit:function(e){var t=e.getSource().getParent();var a=this.getView().byId("idTableHistory");var o=a.indexOfItem(t);var i=a.getModel().getObject("/History")[o];if(i){var n=a.getItems()[o];this.onPress(n,false);var r=a.getItems()[o];if(e.getSource().getPressed()){this.onPress(r,true)}else{this.onPress(r,false)}}},onPress:function(e,t){var a=e.getCells();for(var o=0;o<a.length-2;o++){var i=a[o];if(i.getItems()){var n=i.getItems();$(n).each(function(e){var a=n[e].getMetadata();var o=a.getElementName();if(o=="sap.m.Text"){n[e].setVisible(!t)}if(o=="sap.m.Input"){n[e].setVisible(t);n[e].setEditable(t)}})}}},onDelete:function(e){var t=e.getSource().getBindingContext().getObject();for(var a=0;a<this._data.History.length;a++){if(this._data.History[a]==t){this._data.History.splice(a,1);this.jModel.refresh();break}}}})});