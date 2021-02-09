sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","REPINTEMPOLEEY/REPINTEMPOLEEY/model/models","sap/m/MessageBox"],function(e,o,t,r){"use strict";return e.extend("REPINTEMPOLEEY.REPINTEMPOLEEY.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments);this.setModel(t.createDeviceModel(),"device");var o={};$.ajax({url:"/services/userapi/currentUser",async:false,success:function(e,t){o.name=e.name.toUpperCase()},error:function(e,o,t){jQuery.sap.log.getLogger().error("Get Employee Authorization fetch failed"+t.toString())}});var r=new sap.ui.model.json.JSONModel;r.setData(o);this.setModel(r,"empModel");var i=new sap.ui.model.odata.v2.ODataModel("/HANAMDC/REPINT/RepintEmployee/xsodata/RepintEmployee.xsodata/",{json:true,defaultBindingMode:"TwoWay"});this.setModel(i,"basexsoModel");this.setModel(new sap.ui.model.json.JSONModel,"viewProperties");this.checkAuthorization()},checkAuthorization:function(){var e=this;var o=this.getModel("empModel").getData().name;o=o.toUpperCase();var t=new sap.ui.model.json.JSONModel;var r=[];var i={};var a="/HANAMDC/REPINT/RepintEmployee/xsjs/getAuthorization.xsjs/?aEmpid="+o+"";$.ajax({url:a,success:function(o,a){console.log(o);e.getRouter().initialize();if(o[0].ROLE_EMP==="X"){i={AUTHHORIZEDDATA:o[0],MATRICOLA:o[0].MATRICOLA,ROLE_DEPUTY:o[0].ROLE_DEPUTY,ROLE_EMP:o[0].ROLE_EMP,ROLE_HR:o[0].ROLE_HR,ROLE_HRBP:o[0].ROLE_HRBP,ROLE_MANAGER:o[0].ROLE_MANAGER};r.push(i);t.setData(r);e.setModel(t,"EmpAuthoModel");console.log("EmpAutho"+t);e.getModel("viewProperties").setProperty("/Authorized",true)}else{e.getModel("viewProperties").setProperty("/Authorized",false);jQuery.sap.log.getLogger().error("Employee Authorization failed ");sap.ui.core.UIComponent.getRouterFor(e).navTo("Unauthorized")}},error:function(o,t,r){e.getRouter().initialize();e.getModel("viewProperties").setProperty("/Authorized",false);jQuery.sap.log.getLogger().error("Employee Authorization failed "+r.toString());sap.ui.core.UIComponent.getRouterFor(e).navTo("Unauthorized")}})}})});