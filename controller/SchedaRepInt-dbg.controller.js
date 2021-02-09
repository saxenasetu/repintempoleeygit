sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"REPINTEMPOLEEY/REPINTEMPOLEEY/util/Formatter",
	"sap/m/MessageBox",
	"sap/m/library",
	"sap/ui/core/library",
	"sap/ui/core/Core",
	"sap/m/MessageToast"
], function (Controller, Formatter, MessageBox, library, coreLibrary, Core, MessageToast) {
	"use strict";

	var TimePickerMaskMode = library.TimePickerMaskMode,
	ValueState = coreLibrary.ValueState;
	var counterSession;
	var timeOutInMilliSeconds = 10000;

	// Below code added on 2nd Feb 2021 to fix "Time Out" issue
	// jQuery(document).ajaxComplete(function (e, jqXHR) {
	// 	if (jqXHR.getResponseHeader("com.sap.cloud.security.login")) {
	// 		alert("Session is expired, page shall be reloaded.");
	// 		window.location.reload();
	// 	}
	// })
	
	return Controller.extend("REPINTEMPOLEEY.REPINTEMPOLEEY.controller.SchedaRepInt", {
		Formatter: Formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf REPINTEMPOLEEY.REPINTEMPOLEEY.view.SchedaRepInt
		 */
		onInit: function () {
			var that = this;
			//var oView = that.getView();

			// Below code added on 2nd Feb 2021 to fix "Time Out" issue
			var view = this.getView();
			
			// view.addEventDelegate({
			// 	onAfterShow: function (oEvent) {
			// 		counterSession = 0;
			// 		setInterval(function () {
			// 			that.Timeout();
			// 		}, timeOutInMilliSeconds);
			// 	//	}, 500);
			// 	}
			// }, view);
			
			// Below code commented on 16th Dec 2020
			// Line of code added on 10th Dec to fix performance impact issue on 'Delete' Interventi Records
			//that.getView().byId("idButDeleteRefresh").setVisible(false);

			that._busyDialog = new sap.m.BusyDialog({
				showCancelButton: false
			});

			// Below line of code commented on 29th Dec
			////that.byId("tp1").setMaskMode(TimePickerMaskMode.On);
			////that.byId("tp2").setMaskMode(TimePickerMaskMode.On);

			// Below condition added on 7th Dec 2020
			that.invioBozzaFlag = false;
			that.invioFlag = false;

			// for the data binding example do not use the change event for check but the data binding parsing events
			// Core.attachParseError(
			// 	function (oEvent) {
			// 		var oElement = oEvent.getParameter("element");

			// 		if (oElement.setValueState) {
			// 			oElement.setValueState(ValueState.Error);
			// 		}
			// 	});

			// Core.attachValidationSuccess(
			// 	function (oEvent) {
			// 		var oElement = oEvent.getParameter("element");

			// 		if (oElement.setValueState) {
			// 			oElement.setValueState(ValueState.None);
			// 		}
			// 	});

		},

		// This function is to set time out value in milliseconds
		// Timeout: function () {
		// 	if (counterSession === 0) {
		// 		var that = this
		// 		this._getDialog().open();
		// 		setTimeout(function () {
		// 			if (that._oDialog) {
		// 				that.CloseTimeout("si");
		// 			}
		// 		}, 10000);
		// 	//	}, 1000);
		// 	}
		// },

	// This function is to open "Fragment" as a pop up to user
	_getDialog: function () {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment(
					"REPINTEMPOLEEY.REPINTEMPOLEEY.fragment.TimeOutDiag", this.getView().getController());
				this.getView().addDependent(this._oDialog);
			}

			return this._oDialog;
	},
		
	// This function is to show pop up message to user after time in milliseconds exceeds the set timeout value (18 minutes)
	// CloseTimeout: function (Val) {
	// 		this._oDialog.close();
	// 		this._oDialog.destroy(true);
	// 		this._oDialog = undefined;
	// 		if ((Val === "si") && counterSession === 0) {
	// 			counterSession++;
	// 			MessageBox.alert(
	// 			"Session lost , click ok to reload the session", {
	// 				actions: [sap.m.MessageBox.Action.OK
	// 				],
	// 				onClose: function (oEventoOk) {
	// 					if (oEventoOk === "OK") {
	// 						////window.location.reload();
	// 						timeOutInMilliSeconds = 5000;

	// 						var _oModel = new sap.ui.model.odata.v2.ODataModel("/HANAMDC/REPINT/RepintEmployee/xsodata/RepintEmployee.xsodata/");
	// 						//var xsoDataModel = new sap.ui.model.odata.v2.ODataModel("/HANAMDC/REPINT/RepintEmployee/xsodata/RepintEmployee.xsodata/", {
							
	// 						_oModel.attachMetadataLoaded(null, function(){
	// 						   var oMetadata = _oModel.getServiceMetadata();
	// 						   console.log(oMetadata);
	// 						},null);							
	// 					}
	// 				}
	// 			});
	// 		}

	// 	},

		// This function is called when time out occurs and user select "OK" in Popup displayed to User to continue the session
		// TimeOutCloseOkay: function () {
		// //	alert("hhtp call !");

		// 	var _oModel = new sap.ui.model.odata.v2.ODataModel("/HANAMDC/REPINT/RepintEmployee/xsodata/RepintEmployee.xsodata/");
		// 	//var xsoDataModel = new sap.ui.model.odata.v2.ODataModel("/HANAMDC/REPINT/RepintEmployee/xsodata/RepintEmployee.xsodata/", {
			
		// 	_oModel.attachMetadataLoaded(null, function(){
		// 	   var oMetadata = _oModel.getServiceMetadata();
		// 	   console.log(oMetadata);
		// 	},null);

		// 	this.CloseTimeout("no");
		// },
		
		// This function is called when user has to navigate to "REPINT" Fiori App (Landing Page)
		onPressRepintHome: function (oEvent) {
			var that = this;
			that._busyDialog.open();
			sap.m.URLHelper.redirect("https://repint-bfmyao56da.dispatcher.hana.ondemand.com", false); // For Dev
			//sap.m.URLHelper.redirect("https://repint-pmveyi6e6t.dispatcher.hana.ondemand.com", false); // For Production
			that._busyDialog.close();
		},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf REPINTEMPOLEEY.REPINTEMPOLEEY.view.SchedaRepInt
		 * This function is called to check whether logged in user is authorized or not. Set system's Today's date as AnnoMese date.
		 * Internally calls getEmpData() function to get employee data
		 */
		onAfterRendering: function () {
			//	this.beforeShow();
			var that = this;
			if (that.getOwnerComponent().getModel("viewProperties").getProperty("/Authorized")) {
				var today = new Date();
				var vMonth = today.getMonth() + 1;
				var month = "";
				if (vMonth < 10) {
					month = "0" + vMonth;
				} else {
					month = vMonth;
				}

				that.getView().byId("dpAnnoMese").setValue(Formatter.formatMeseAnno(today));
				that.getOwnerComponent().getModel("viewProperties").setProperty("/ANNOMESE", that.getView().byId("dpAnnoMese").getValue());

				var xsoBaseModel = that.getOwnerComponent().getModel("basexsoModel");
				that.getEmpData(xsoBaseModel);
			} else {
				var _busyDialog = new sap.m.BusyDialog();
				_busyDialog.open();
				sap.ui.core.UIComponent.getRouterFor(that).navTo("Unauthorized");
				_busyDialog.close();
				// MessageBox.error(
				// 	"Autorizzazione fallita per l'app Employee. Contatta l'amministratore"
				// );
			}
		},

		// This function is called from within onAfterRendering() function. It reads logged in Employee Id. Internally it calls getEmpIdScheda() to get Employee details based on IDSCHEDA
		// Getting Cambio Responsabile data for F4 Valuehelp.
		// To get Header information (Livello, Matricola, Nome, Cognome etc.)
		getEmpData: function (xsoBaseModel) {
			var that = this;
			xsoBaseModel.attachRequestSent(function () {
				that._busyDialog.open();
			});
			xsoBaseModel.attachRequestCompleted(function () {
				that._busyDialog.close();
			});

			// Reading Employee data
			var empID = that.getOwnerComponent().getModel("empModel").getData().name; // Get logged in Emp EmpId
			// KAPIL HARDCODED
			//empID = "P2001257460";
			//empID = "P2002397341";
			//var empID = "P2002397341";
			//empID = "P2001995750";
			//empID = "P1942220823";
			var repintEmpdataModel = new sap.ui.model.json.JSONModel();
			var oRepintEmpdataJson = [];
			var oRepintEmpdataJsonData = {};

			// var oFilters = [];
			// var filter1 = new sap.ui.model.Filter("ID", sap.ui.model.FilterOperator.EQ, empID);
			// oFilters.push(filter1);

			// Actual working url below
			var urlEmployeeSet = "/HANAMDC/REPINT/RepintEmployee/xsjs/EmployeeSet.xsjs/?aEmpid=" + empID;

			$.ajax({
				url: urlEmployeeSet,
				async: false,
				success: function (oDataIn) {
					console.log("EmployeeSet" + oDataIn);
					//for (var i = 0; i < oDataIn.results.length; ++i) {
					oRepintEmpdataJsonData = {
						//"IDEMPLOYEE": oDataIn.results[i].IDEMPLOYEE,
						"ID": oDataIn[0].ID,
						//"SUPERID": oDataIn[0].SUPERID,
						"MATRICOLA": oDataIn[0].MATRICOLA,
						"COGNOME": oDataIn[0].COGNOME,
						"NOME": oDataIn[0].NOME,
						//"CODICE_FISCALE": oDataIn[0].CODICE_FISCALE,
						//"STATUS_DIPENDENTE": oDataIn[0].STATUS_DIPENDENTE,
						//"DATA_ASSUNZIONE": oDataIn[0].DATA_ASSUNZIONE,
						//"DATA_CESSAZIONE": oDataIn[0].DATA_CESSAZIONE,
						"CDC": oDataIn[0].CDC,
						//"CDC_DBCENTRALE": oDataIn[0].CDC_DBCENTRALE,
						//"DIPART_ID": oDataIn[0].DIPART_ID,
						"EMAIL": oDataIn[0].EMAIL,
						//"ACCOUNTNT": oDataIn[0].ACCOUNTNT,
						//"N_TIPO": oDataIn[0].N_TIPO,
						"STABILIMENTO_ATTUALE": oDataIn[0].STABILIMENTO_ATTUALE,
						//"RUOLO_PROF": oDataIn[0].RUOLO_PROF,
						//"HR1_PAYGRADE": oDataIn[0].HR1_PAYGRADE,
						//"DATETIME_CR": Formatter.formatDate(oDataIn[0].DATETIME_CR),
						//"DATETIME_LM": Formatter.formatDate(oDataIn[0].DATETIME_LM),
						"LIVELLO": oDataIn[0].LIVELLO,
						"MATRICOLA_RESP": oDataIn[0].MATRICOLA_RESP,
						"UNITAORGANIZZATIVA": oDataIn[0].UNITAORGANIZZATIVA,
						"DEPARTMENT": oDataIn[0].DEPARTMENT,
						"ManagerFirstName": oDataIn[0].ManagerFirstName,
						"ManagerLastName": oDataIn[0].ManagerLastName,
						"STABILIMENTODESC": oDataIn[0].STABILIMENTODESC
							// "MATRICOLA_DEPUTY" : oDataIn[0].MATRICOLA_DEPUTY,
							// "NOME_DELEGATO" : oDataIn[0].NOME_DELEGATO,
							// "COGNOME_DELEGATO": oDataIn[0].COGNOME_DELEGATO
					};

					oRepintEmpdataJson.push(oRepintEmpdataJsonData);
					oRepintEmpdataJsonData = {};

					console.log(" EmployeeSet ");
					console.log(oRepintEmpdataJson);
					repintEmpdataModel.setData(oRepintEmpdataJson);
					that.getView().setModel(repintEmpdataModel, "RepintEmpdataModel");

					// Getting Cambio Responsabile data for F4 Valuehelp
					var repintCambioRespModel = new sap.ui.model.json.JSONModel();
					var oRepintCambioRespJson = [];
					var oRepintCambioRespJsonData = {};
					var oFilters = [];

					//var CDCvalue = that.getView().getModel("RepintEmpdataModel").getProperty("/0/CDC");
					//var filter11 = new sap.ui.model.Filter("CDC", sap.ui.model.FilterOperator.Contains, CDCvalue);

					var matricula_resp = that.getView().getModel("RepintEmpdataModel").getProperty("/0/MATRICOLA_RESP");

					if (matricula_resp !== undefined && matricula_resp !== null && matricula_resp !== "") {
						var filter11 = new sap.ui.model.Filter("MATRICOLA_RESP", sap.ui.model.FilterOperator.Contains, matricula_resp);
						oFilters.push(filter11);

						//xsoBaseModel.read("/CambioResponsabileSet?$filter=CDC eq 'IT01SP-010'", {
						xsoBaseModel.read("/CambioResponsabileSet", {
							filters: oFilters,
							success: function (oDataIn, oResponse) {
								//jsonModel.setData(oDataIn);
								for (var i = 0; i < oDataIn.results.length; ++i) {
									oRepintCambioRespJsonData = {
										"MATRICOLA_RESP": oDataIn.results[i].MATRICOLA_RESP,
										"NOME_RESP": oDataIn.results[i].NOME_RESP,
										"COGNOME_RESP": oDataIn.results[i].COGNOME_RESP,
										"MATRICOLA_DEPUTY": oDataIn.results[i].MATRICOLA_DELEGATO,
										"COGNOME_DELEGATO": oDataIn.results[i].COGNOME_DELEGATO,
										"NOME_DELEGATO": oDataIn.results[i].NOME_DELEGATO
									};

									oRepintCambioRespJson.push(oRepintCambioRespJsonData);
									oRepintCambioRespJsonData = {};
								}
								console.log(" CAMBIO RESP ");
								console.log(oRepintCambioRespJson);
								repintCambioRespModel.setData(oRepintCambioRespJson);
								that.getView().byId("idRepintCambioResp").setModel(repintCambioRespModel, "RepintCambioRespModel");

							}.bind(this),
							error: function (oError) {
								//Handle the error
								MessageBox.error("Impossibile ottenere le informazioni del Responsabile/Deputy. Contatta l'amministratore");
								jQuery.sap.log.getLogger().error("RepintCambioResponsabile data fetch failed" + oError.toString());
							}.bind(this)
						});
						// else{
						// 	var _busyDialog = new sap.m.BusyDialog();
						// 	_busyDialog.open();
						// 	sap.ui.core.UIComponent.getRouterFor(that).navTo("Unauthorized");
						// 	_busyDialog.close();						
						// }

						// Below line of code commented on 30th Jan. getEmpIdScheda() function call added below
						///////that.getEmpIdScheda();
					}
					// Below line of code added on 30th Jan
					that.getEmpIdScheda();
					//	}.bind(this),
				},
				error: function (oError) {
					//Handle the error
					MessageBox.error("Impossibile ottenere le informazioni del dipendente. Contatta l'amministratore");
					jQuery.sap.log.getLogger().error("Employee data fetch failed" + oError.toString());
				}.bind(this)
			});

		},

		// This function is called from within getEmpData() function. Based on Matricola and AnnoMese value service returns ID Scheda (if present).
		// If ID Scheda doesn't exists then application creates blank "Reperibilita" and "Interventi" empty record(1 default record)
		// Here if STATO value is not defined and IDSCHEDA = 0 it implies that Employee is creating Reperibilita and Interventi records for new Mese/Anno date
		// "Salva" and "Salva Bozza" button is editable, Stornata button is non editable		
		// It internally calls getExpandData() function
		getEmpIdScheda: function () {
			var that = this;
			var xsoDataModel1 = new sap.ui.model.odata.ODataModel("/HANAMDC/REPINT/RepintEmployee/xsodata/RepintEmployee.xsodata/");

			xsoDataModel1.attachRequestSent(function () {
				that._busyDialog.open();
			});
			xsoDataModel1.attachRequestCompleted(function () {
				that._busyDialog.close();
			});

			var matricolaID = that.getView().getModel("RepintEmpdataModel").getProperty("/0/MATRICOLA");
			var annomeseValue = that.getOwnerComponent().getModel("viewProperties").getProperty("/ANNOMESE").split("-")[0] + "-" + that.getOwnerComponent()
				.getModel("viewProperties").getProperty("/ANNOMESE").split("-")[1];

			// Getting ID Scheda data
			xsoDataModel1.read("/HeaderSet?$filter=MATRICOLA eq '" + matricolaID + "' and ANNOMESE eq datetime'" + annomeseValue + "-01'", {
				//filters: oFilters,
				success: function (oDataIn, oResponse) {
					console.log(" IDSCHEDA Set ");
					console.log(oDataIn);
					if (oDataIn.results.length === 0) {
						this.getOwnerComponent().getModel("viewProperties").setProperty("/IDSCHEDA", 0);
						this.onAddItems1New();
						this.onAddItems2New();

						// Below line of code added in order to reset "Eventuale Delegato" replace old existing (if any) value with blank value
						// Without this it was retaining old value even
						this.getOwnerComponent().getModel("viewProperties").setProperty("/MATRICOLA_DEPUTY", "");
						if(this.getView().getModel("RepintEmpHdrModel") !== undefined && this.getView().getModel("RepintEmpHdrModel").getData() !== undefined
						&& this.getView().getModel("RepintEmpHdrModel").getData() !== null 
						 && this.getView().getModel("RepintEmpHdrModel").getData().length >0){
							this.getView().getModel("RepintEmpHdrModel").setProperty("/0/MATRICOLA_DEPUTY","");
						}

						// Here STATO value is not defined and IDSCHEDA = 0 it implies that Employee is creating Reperibilita and Interventi records for new Mese/Anno date
						// "Salva" and "Salva Bozza" button is editable, Stornata button is non editable
						// this.getView().byId("idButStornata").setEnabled(false);
						// this.getView().byId("idButCreate").setEnabled(true);
						// this.getView().byId("idButDraft").setEnabled(true);
						// this.getView().byId("idStato").setText("In carico al Dipendente");

						// 29th Jan - below code added to fix below bug 
						// When the Delegato reject the form, the Employee see in the Delegato field the name of the Delegato BUT IF he submit the form again, the form is not sent to the Delegato 
						var oRepintEmpHdrModelData = [];
						var oEntry = {
							STATO: 0
						};
						oRepintEmpHdrModelData.push(oEntry);
						this.setButtonVisibility(oRepintEmpHdrModelData);
						///this.setButtonVisibility(this.getView().getModel("RepintEmpHdrModel").getData()); 

					} else {
						this.getOwnerComponent().getModel("viewProperties").setProperty("/IDSCHEDA", oDataIn.results[0].IDSCHEDA);
						
						// Below line of code added in order to reset "Eventuale Delegato" replace old existing (if any) value with blank value
						// Without this it was retaining old value even
						this.getOwnerComponent().getModel("viewProperties").setProperty("/MATRICOLA_DEPUTY", "");
						if(this.getView().getModel("RepintEmpHdrModel") !== undefined && this.getView().getModel("RepintEmpHdrModel").getData() !== undefined
						&& this.getView().getModel("RepintEmpHdrModel").getData() !== null 
						 && this.getView().getModel("RepintEmpHdrModel").getData().length >0){
							this.getView().getModel("RepintEmpHdrModel").setProperty("/0/MATRICOLA_DEPUTY","");
						}
						
						this.getExpandData("onload");
					}
				}.bind(this),
				error: function (oError) {
					//Handle the error
					MessageBox.error("Impossibile ottenere le informazioni della scheda REPINT. Contatta l'amministratore");
					jQuery.sap.log.getLogger().error("IDSCHEDA fetch failed" + oError.toString());
				}.bind(this)
			});

			var repintRiposiModel = new sap.ui.model.json.JSONModel();
			var oRepintRiposiJson = [];
			var oRepintRiposiJsonData = {};

			// Get Riposi Set
			xsoDataModel1.read("/RiposiSet", {
				//filters: oFilters,
				success: function (oDataIn, oResponse) {
					console.log(" RiposiSet");
					console.log(oDataIn.results);
					for (var i = 0; i < oDataIn.results.length; ++i) {
						oRepintRiposiJsonData = {
							"DACONTRATTO": oDataIn.results[i].DACONTRATTO,
							"DURATA_INCLUSA": oDataIn.results[i].DURATA_INCLUSA,
							"DURATA_MAX": oDataIn.results[i].DURATA_MAX,
							"DURATA_MIN": oDataIn.results[i].DURATA_MIN,
							"FASCIA_FINE": Formatter.convertminstoHHSS(Formatter.convertmstomins(oDataIn.results[i].FASCIA_FINE.ms)),
							"FASCIA_INIZIO": Formatter.convertminstoHHSS(Formatter.convertmstomins(oDataIn.results[i].FASCIA_INIZIO.ms)),
							"GIORNI": oDataIn.results[i].GIORNI,
							"IDREGOLA": oDataIn.results[i].IDREGOLA,
							"INCLUSO_DMAX": oDataIn.results[i].INCLUSO_DMAX,
							"INCLUSO_DMIN": oDataIn.results[i].INCLUSO_DMIN,
							"INCLUSO_FF": oDataIn.results[i].INCLUSO_FF,
							"INCLUSO_FI": oDataIn.results[i].INCLUSO_FI,
							"TIPO_COMPENSATIVO": oDataIn.results[i].TIPO_COMPENSATIVO,
							"VALORE": oDataIn.results[i].VALORE
						};

						oRepintRiposiJson.push(oRepintRiposiJsonData);
						oRepintRiposiJsonData = {};
					}
					repintRiposiModel.setData(oRepintRiposiJson);
					that.getView().setModel(repintRiposiModel, "RiposiModel");

				}.bind(this),
				error: function (oError) {
					//Handle the error
					MessageBox.error("Impossibile ottenere le informazioni delle regole del Riposo. Contatta l'amministratore");
					jQuery.sap.log.getLogger().error("Data fetch failed for Riposi. Please contact administrator." + oError.toString());
				}.bind(this)
			});

			var repintRegoleCompensativiModel = new sap.ui.model.json.JSONModel();
			var oRepintRegoleCompensativiJson = [];
			var oRepintRegoleCompensativiJsonData = {};

			// Get RipflagSet
			xsoDataModel1.read("/RipflagSet", {
				success: function (oDataIn, oResponse) {
					console.log(" RipflagSet");
					console.log(oDataIn.results);
					for (var i = 0; i < oDataIn.results.length; ++i) {
						oRepintRegoleCompensativiJsonData = {
							"IDREGOLECOMPENSATIVIMULTI": oDataIn.results[i].IDREGOLECOMPENSATIVIMULTI,
							"N_INTERVENTI": oDataIn.results[i].N_INTERVENTI,
							"VALORE": oDataIn.results[i].VALORE,
							"FASCIA_INIZIO": oDataIn.results[i].FASCIA_INIZIO,
							"FASCIA_FINE": oDataIn.results[i].FASCIA_FINE
						};

						oRepintRegoleCompensativiJson.push(oRepintRegoleCompensativiJsonData);
						oRepintRegoleCompensativiJsonData = {};
					}
					repintRegoleCompensativiModel.setData(oRepintRegoleCompensativiJson);
					that.getView().setModel(repintRegoleCompensativiModel, "RegoleCompensativi");

				}.bind(this),
				error: function (oError) {
					//Handle the error
					MessageBox.error("Impossibile ottenere le informazioni per calcolare RIP. Contatta l'amministratore");
					jQuery.sap.log.getLogger().error("Data fetch failed for RIP. Please contact administrator." + oError.toString());
				}.bind(this)
			});

			var oRepintParamSetModel = new sap.ui.model.json.JSONModel();
			var oRepintParamSetJson = [];
			var oRepintParamSetJsonData = {};

			// Get ParamSet
			xsoDataModel1.read("/ParamSet", {
				success: function (oDataIn, oResponse) {
					console.log(" ParamSet");
					console.log(oDataIn.results);
					for (var i = 0; i < oDataIn.results.length; ++i) {
						oRepintParamSetJsonData = {
							"PARAMETER_NAME": oDataIn.results[i].PARAMETER_NAME,
							"PARAMETER_VALUE": oDataIn.results[i].PARAMETER_VALUE,
							"DESCRIPTION": oDataIn.results[i].DESCRIPTION,
							"DATETIME_CR": oDataIn.results[i].DATETIME_CR,
							"DATETIME_LM": oDataIn.results[i].DATETIME_LM
						};

						oRepintParamSetJson.push(oRepintParamSetJsonData);
						oRepintParamSetJsonData = {};
					}
					oRepintParamSetModel.setData(oRepintParamSetJson);
					that.getView().setModel(oRepintParamSetModel, "ParamSetModel");

				}.bind(this),
				error: function (oError) {
					//Handle the error
					MessageBox.error("Impossibile ottenere le informazione delle regole del RIP. Contatta l'amministratore");
					jQuery.sap.log.getLogger().error("Data fetch failed for ParamSet (RIP). Please contact administrator." + oError.toString());
				}.bind(this)
			});

		},

		// This function is the main function to read Header data, Reperibilita data and Interventi data based on the "AnnoMese" selected date and specific to IDSCHEDA (if exists)
		// This function called on landing page (flag = "onload") and also after success (flag = "success") on performing "Invio" operation
		getExpandData: function (flag) {
			var that = this;
			that.getView().byId("dpAnnoMese").setValue(Formatter.formatMeseAnno(that.getOwnerComponent().getModel("viewProperties").getProperty(
				"/ANNOMESE")));
			var oDate = new Date(that.getOwnerComponent().getModel("viewProperties").getProperty("/ANNOMESE"));

			var firstDay = new Date(oDate.getFullYear(), oDate.getMonth(), 1);
			var lastDay = new Date(oDate.getFullYear(), oDate.getMonth() + 1, 0);

			var repintEmpHdrModel = new sap.ui.model.json.JSONModel();
			var oRepintEmpHeaderJson = [];
			var oRepintEmpHeaderJsonData = {};

			var repintReperibilitaModel = new sap.ui.model.json.JSONModel();
			var oRepintReperibilitaJson = [];
			var oRepintReperibilitaJsonData = {};

			var xsoBaseModel = this.getOwnerComponent().getModel("basexsoModel");
			var xsoDataModel1 = new sap.ui.model.odata.ODataModel("/HANAMDC/REPINT/RepintEmployee/xsodata/RepintEmployee.xsodata/");

			xsoBaseModel.attachRequestSent(function () {
				that._busyDialog.open();
			});
			xsoBaseModel.attachRequestCompleted(function () {
				that._busyDialog.close();
			});

			var path = "/RepintEmpHeader(IDSCHEDA=" + that.getOwnerComponent().getModel("viewProperties").getProperty("/IDSCHEDA") + ")";
			var mParameters = {
				async: false,
				urlParameters: {
					"$expand": 'REPERIBILITA,INTERVENTI'
				},
				success: function (oDataIn, oResponse) {
					console.log("******* EXPAND ******");
					console.log(oDataIn);

					// Getting Repint Employee Header data
					oRepintEmpHeaderJsonData = {
						"IDSCHEDA": oDataIn.IDSCHEDA,
						"MATRICOLA": oDataIn.MATRICOLA,
						"COGNOME": oDataIn.COGNOME,
						"NOME": oDataIn.NOME,
						"LIVELLO": oDataIn.LIVELLO,
						"CDC": oDataIn.CDC,
						"ANNOMESE": Formatter.formatDate(oDataIn.ANNOMESE),
						"STABILIMENTO": oDataIn.STABILIMENTO,
						"MATRICOLA_RESP": oDataIn.MATRICOLA_RESP,
						"MATRICOLA_DEPUTY": oDataIn.MATRICOLA_DEPUTY,
						"AUT_DIPENDENTE": oDataIn.AUT_DIPENDENTE,
						"AUT_RESP": oDataIn.AUT_RESP,
						"AUT_HRGEST": oDataIn.AUT_HRGEST,
						"STATO": oDataIn.STATO,
						//"DATACREAZIONE": Formatter.formatDate(oDataIn.DATACREAZIONE),
						"DATACREAZIONE": sap.ui.core.format.DateFormat.getDateTimeInstance({ // To convert UTC timestamp back to local time
							pattern: "yyyy-MM-dd HH:mm"
						}).format(new Date(oDataIn.DATACREAZIONE)),
						"DATE_MANAGER": (oDataIn.DATE_MANAGER === null) ? "" : sap.ui.core.format.DateFormat.getDateTimeInstance({ // To convert UTC timestamp back to local time
							pattern: "yyyy-MM-dd HH:mm"
						}).format(new Date(oDataIn.DATE_MANAGER)),
						"DATE_HR": (oDataIn.DATE_HR === null) ? "" : sap.ui.core.format.DateFormat.getDateTimeInstance({ // To convert UTC timestamp back to local time
							pattern: "yyyy-MM-dd HH:mm"
						}).format(new Date(oDataIn.DATE_HR)),
						//"DATACREAZIONE": new Date(oDataIn.DATACREAZIONE), 
						"TOTALE_EROGATO": oDataIn.TOTALE_EROGATO,
						"ANNOMESE_ORIG": Formatter.formatDate(oDataIn.ANNOMESE_ORIG),
						"STATO_ORIG": oDataIn.STATO_ORIG,
						"DATA_SPOSTAMENTO_COMPETENZA": Formatter.formatDate(oDataIn.DATA_SPOSTAMENTO_COMPETENZA)
					};

					oRepintEmpHeaderJson.push(oRepintEmpHeaderJsonData);
					oRepintEmpHeaderJsonData = {};

					repintEmpHdrModel.setData(oRepintEmpHeaderJson);
					//repintEmpHdrModel.setDefaultBindingMode("TwoWay");
					/////////	that.getOwnerComponent().getModel("viewProperties").setProperty("/IDSCHEDA", oRepintEmpHeaderJson[0].IDSCHEDA);

					that.getView().setModel(repintEmpHdrModel, "RepintEmpHdrModel");
					/////////////					that.setButtonVisibility(that.getView().getModel("RepintEmpHdrModel").getData());
					console.log(that.getView().getModel("RepintEmpHdrModel").getData());

					// 22nd Dec - Logic added to fix bug ?????
					// if (oDataIn.MATRICOLA_DEPUTY !== "" && oDataIn.MATRICOLA_DEPUTY !== null && oDataIn.MATRICOLA_DEPUTY !== undefined) {

					// }

					// Getting REPERIBILITY data	
					for (var i = 0; i < oDataIn.REPERIBILITA.results.length; i++) {

						oRepintReperibilitaJsonData = {
							"DATAREPERIBILITA": Formatter.formatDate(oDataIn.REPERIBILITA.results[i].DATAREPERIBILITA),
							"IDREPERIBILITA": oDataIn.REPERIBILITA.results[i].IDREPERIBILITA,
							"IDSCHEDA": oDataIn.REPERIBILITA.results[i].IDSCHEDA,
							"Fer": Formatter.checkTipogiornoFer(oDataIn.REPERIBILITA.results[i].TIPOGIORNO), // Fer. -> L, Sab. -> S, Dom. -> F
							"Sab": Formatter.checkTipogiornoSab(oDataIn.REPERIBILITA.results[i].TIPOGIORNO),
							"Dom": Formatter.checkTipogiornoDom(oDataIn.REPERIBILITA.results[i].TIPOGIORNO),
							"minDate": firstDay,
							"maxDate": lastDay,
							"oButton1": true,
							"oButton2": true
						};
						oRepintReperibilitaJson.push(oRepintReperibilitaJsonData);
						oRepintReperibilitaJsonData = {};
					}

					if (oRepintReperibilitaJson.length === 0 && flag === "onload") { // To avoid adding Reperibilita blank record twice
						that.onAddItems1New();
					} else if (oRepintReperibilitaJson.length === 0 && flag === "success") { // No record in Reperbilita Table
						// Do nothing
					} else {
						repintReperibilitaModel.setData(oRepintReperibilitaJson);
						that.getView().byId("idTableReperibilita").setModel(repintReperibilitaModel, "RepintReperibilitaModel");

						for (var i = 0; i < oDataIn.REPERIBILITA.results.length; ++i) {
							that.chkFer(Formatter.checkTipogiornoFer(oDataIn.REPERIBILITA.results[i].TIPOGIORNO));
							that.chkSab(Formatter.checkTipogiornoSab(oDataIn.REPERIBILITA.results[i].TIPOGIORNO));
							that.chkDom(Formatter.checkTipogiornoDom(oDataIn.REPERIBILITA.results[i].TIPOGIORNO));
						}

						that.getView().byId("txtAggiorna").setText(repintReperibilitaModel.getData().length);
						that.getView().byId("txtElimina").setText(repintReperibilitaModel.getData().length);
						console.log("REPERIBILITA DATA");
						console.log(that.getView().byId("idTableReperibilita").getModel("RepintReperibilitaModel"));
					}

					var repintInterventiModel = new sap.ui.model.json.JSONModel();
					var oRepintInterventiJson = [];
					var oRepintInterventiJsonData = {};

					// Getting Interventi data
					for (var j = 0; j < oDataIn.INTERVENTI.results.length; j++) {

						if (oDataIn.INTERVENTI.results[j].FASCIA !== 0) {
							////if (oDataIn.INTERVENTI.results[j].FASCIA > 0 && oDataIn.INTERVENTI.results[j].FASCIA <= 1) {
							if (oDataIn.INTERVENTI.results[j].FASCIA === 1) {
								oDataIn.INTERVENTI.results[j].h1h = true;
								oDataIn.INTERVENTI.results[j].h12h = false;
								oDataIn.INTERVENTI.results[j].h24h = false;
								oDataIn.INTERVENTI.results[j].h46h = false;
								oDataIn.INTERVENTI.results[j].h68h = false;
								oDataIn.INTERVENTI.results[j].h8h = false;
							} ////else if (oDataIn.INTERVENTI.results[j].FASCIA > 1 && oDataIn.INTERVENTI.results[j].FASCIA <= 2) {
							else if (oDataIn.INTERVENTI.results[j].FASCIA === 2) {
								oDataIn.INTERVENTI.results[j].h1h = false;
								oDataIn.INTERVENTI.results[j].h12h = true;
								oDataIn.INTERVENTI.results[j].h24h = false;
								oDataIn.INTERVENTI.results[j].h46h = false;
								oDataIn.INTERVENTI.results[j].h68h = false;
								oDataIn.INTERVENTI.results[j].h8h = false;
							} ////else if (oDataIn.INTERVENTI.results[j].FASCIA > 2 && oDataIn.INTERVENTI.results[j].FASCIA <= 4) {
							else if (oDataIn.INTERVENTI.results[j].FASCIA === 3) {
								oDataIn.INTERVENTI.results[j].h1h = false;
								oDataIn.INTERVENTI.results[j].h12h = false;
								oDataIn.INTERVENTI.results[j].h24h = true;
								oDataIn.INTERVENTI.results[j].h46h = false;
								oDataIn.INTERVENTI.results[j].h68h = false;
								oDataIn.INTERVENTI.results[j].h8h = false;
							} ////else if (oDataIn.INTERVENTI.results[j].FASCIA > 4 && oDataIn.INTERVENTI.results[j].FASCIA <= 6) {
							else if (oDataIn.INTERVENTI.results[j].FASCIA === 4) {
								oDataIn.INTERVENTI.results[j].h1h = false;
								oDataIn.INTERVENTI.results[j].h12h = false;
								oDataIn.INTERVENTI.results[j].h24h = false;
								oDataIn.INTERVENTI.results[j].h46h = true;
								oDataIn.INTERVENTI.results[j].h68h = false;
								oDataIn.INTERVENTI.results[j].h8h = false;

							} ////else if (oDataIn.INTERVENTI.results[j].FASCIA > 6 && oDataIn.INTERVENTI.results[j].FASCIA <= 8) {
							else if (oDataIn.INTERVENTI.results[j].FASCIA === 5) {
								oDataIn.INTERVENTI.results[j].h1h = false;
								oDataIn.INTERVENTI.results[j].h12h = false;
								oDataIn.INTERVENTI.results[j].h24h = false;
								oDataIn.INTERVENTI.results[j].h46h = false;
								oDataIn.INTERVENTI.results[j].h68h = true;
								oDataIn.INTERVENTI.results[j].h8h = false;
							} ////else if (oDataIn.INTERVENTI.results[j].FASCIA > 8) {
							else if (oDataIn.INTERVENTI.results[j].FASCIA === 6) {
								oDataIn.INTERVENTI.results[j].h1h = false;
								oDataIn.INTERVENTI.results[j].h12h = false;
								oDataIn.INTERVENTI.results[j].h24h = false;
								oDataIn.INTERVENTI.results[j].h46h = false;
								oDataIn.INTERVENTI.results[j].h68h = false;
								oDataIn.INTERVENTI.results[j].h8h = true;
							}
						} else {
							oDataIn.INTERVENTI.results[j].h1h = false;
							oDataIn.INTERVENTI.results[j].h12h = false;
							oDataIn.INTERVENTI.results[j].h24h = false;
							oDataIn.INTERVENTI.results[j].h46h = false;
							oDataIn.INTERVENTI.results[j].h68h = false;
							oDataIn.INTERVENTI.results[j].h8h = false;
						}

						oRepintInterventiJsonData = {
							"n": j + 1,
							//"LPN": false,
							"CAUSA": (oDataIn.INTERVENTI.results[j].CAUSA === undefined || oDataIn.INTERVENTI.results[j].CAUSA === null) ? "" : oDataIn.INTERVENTI
								.results[j].CAUSA,
							"h1h": oDataIn.INTERVENTI.results[j].h1h,
							"h12h": oDataIn.INTERVENTI.results[j].h12h,
							"h24h": oDataIn.INTERVENTI.results[j].h24h,
							"h46h": oDataIn.INTERVENTI.results[j].h46h,
							"h68h": oDataIn.INTERVENTI.results[j].h68h,
							"h8h": oDataIn.INTERVENTI.results[j].h8h,
							"oButton1": true,
							"oButton2": true,
							"minDate": firstDay,
							"maxDate": lastDay,
							"CHIAMATODA": (oDataIn.INTERVENTI.results[j].CHIAMATODA === undefined || oDataIn.INTERVENTI.results[j].CHIAMATODA === null) ?
								"" : oDataIn.INTERVENTI.results[j].CHIAMATODA,
							"CONTINTERVENTO": (oDataIn.INTERVENTI.results[j].CONTINTERVENTO === null || oDataIn.INTERVENTI.results[j].CONTINTERVENTO ===
								"" || oDataIn.INTERVENTI.results[j].CONTINTERVENTO === 0) ? 0 : oDataIn.INTERVENTI.results[j].CONTINTERVENTO,
							"DATAINTERVENTO": Formatter.formatDate(oDataIn.INTERVENTI.results[j].DATAINTERVENTO),
							"DURATA": oDataIn.INTERVENTI.results[j].DURATA, // DURATA is same as MINDIFFORAINIFINE as "MINDIFFORAINIFINE" is added later
							"FASCIA": oDataIn.INTERVENTI.results[j].FASCIA,
							"FLAGCONT": (oDataIn.INTERVENTI.results[j].FLAGCONT === 1) ? true : false,
							/////"FLAGNOTTURNO": Formatter.formatLPN(oDataIn.INTERVENTI.results[j].FLAGNOTTURNO), // DOUBT - Check if LPN is mapped with FLAGNOTTURNO
							////"FLAGNOTTURNO": (oDataIn.INTERVENTI.results[j].FLAGNOTTURNO === undefined || oDataIn.INTERVENTI.results[j].FLAGNOTTURNO === null || oDataIn.INTERVENTI.results[j].FLAGNOTTURNO === 0) ? 0 : oDataIn.INTERVENTI.results[j].FLAGNOTTURNO , // LPN is mapped with FLAGNOTTURNO
							"FLAGNOTTURNO": (oDataIn.INTERVENTI.results[j].FLAGNOTTURNO === undefined || oDataIn.INTERVENTI.results[j].FLAGNOTTURNO ===
								null || oDataIn.INTERVENTI.results[j].FLAGNOTTURNO === 0) ? false : true, // LPN is mapped with FLAGNOTTURNO
							"IDINTERVENTO": oDataIn.INTERVENTI.results[j].IDINTERVENTO,
							"IDSCHEDA": oDataIn.INTERVENTI.results[j].IDSCHEDA,
							"ORAFINE": oDataIn.INTERVENTI.results[j].ORAFINE,
							"ORAINIZIO": oDataIn.INTERVENTI.results[j].ORAINIZIO,
							"STESSACAUSALE": oDataIn.INTERVENTI.results[j].STESSACAUSALE,
							"WORKINGDAY": oDataIn.INTERVENTI.results[j].WORKINGDAY,
							"NONWORKINGDAY": oDataIn.INTERVENTI.results[j].NONWORKINGDAY,
							"MINDIFFORAINIFINE": oDataIn.INTERVENTI.results[j].DURATA, // DURATA is same as MINDIFFORAINIFINE as "MINDIFFORAINIFINE" is added later
							"ORAINIZIOTIMESTAMP": new Date(oDataIn.INTERVENTI.results[j].ORAINIZIOTIMESTAMP), // To convert UTC timestamp back to local time
							"ORAFINETIMESTAMP": new Date(oDataIn.INTERVENTI.results[j].ORAFINETIMESTAMP), // To convert UTC timestamp back to local time
							"CHECKOK": oDataIn.INTERVENTI.results[j].CHECKOK,
							"RIPOSI": oDataIn.INTERVENTI.results[j].RIPOSI,
							"CHIAMATODA_ALTRO": (oDataIn.INTERVENTI.results[j].CHIAMATODA_ALTRO === undefined || oDataIn.INTERVENTI.results[j].CHIAMATODA_ALTRO ===
								null || oDataIn.INTERVENTI.results[j].CHIAMATODA_ALTRO === "") ? "" : oDataIn.INTERVENTI.results[j].CHIAMATODA_ALTRO
						};
						oRepintInterventiJson.push(oRepintInterventiJsonData);
						oRepintInterventiJsonData = {};
					}

					if (oRepintInterventiJson.length === 0 && flag === "onload") { // To avoid adding Interventi blank record twice
						// New condtion added on 8th Dec 2020
						// While deleting all records from Interventi Table -> Invio operation -> Keeps 1 blank record (Read only)
						// Now on calling onAddItems2New() create one more new Item in 'Interventi' table. So it keeps 2 records instead of 1 newly created
						// This logic was added to remove 1 blank record (Read only) created after performing 'Invio' operation
						// Reset RepintInterventiModel
						var interventidataModel = that.getView().byId("idTableInterventi").getModel("RepintInterventiModel");
						if (interventidataModel) {
							interventidataModel.setData(null);
							interventidataModel.updateBindings(true);
						}
						that.onAddItems2New();
						that.setButtonVisibility(that.getView().getModel("RepintEmpHdrModel").getData());
					} else {
						// oRepintInterventiJson.length === 0 flag === "success"
						if (oRepintInterventiJson.length === 0 && flag === "success") { // No record in Interventi Table
							// Do nothing
						} else {
							repintInterventiModel.setData(oRepintInterventiJson);
							that.getView().byId("idTableInterventi").setModel(repintInterventiModel, "RepintInterventiModel");
							that.sortInterventiDateData(that.getView().byId("idTableInterventi").getModel("RepintInterventiModel"));

							for (var i = 0; i < oDataIn.INTERVENTI.results.length; ++i) {
								if (oDataIn.INTERVENTI.results[i].h1h === true) {
									that.chk1h(true);
									that.chk12h(false);
									that.chk24h(false);
									that.chk46h(false);
									that.chk68h(false);
									that.chk8h(false);
								} else if (oDataIn.INTERVENTI.results[i].h12h === true) {
									that.chk1h(false);
									that.chk12h(true);
									that.chk24h(false);
									that.chk46h(false);
									that.chk68h(false);
									that.chk8h(false);
								} else if (oDataIn.INTERVENTI.results[i].h24h === true) {
									that.chk1h(false);
									that.chk12h(false);
									that.chk24h(true);
									that.chk46h(false);
									that.chk68h(false);
									that.chk8h(false);
								} else if (oDataIn.INTERVENTI.results[i].h46h === true) {
									that.chk1h(false);
									that.chk12h(false);
									that.chk24h(false);
									that.chk46h(true);
									that.chk68h(false);
									that.chk8h(false);
								} else if (oDataIn.INTERVENTI.results[i].h68h === true) {
									that.chk1h(false);
									that.chk12h(false);
									that.chk24h(false);
									that.chk46h(false);
									that.chk68h(true);
									that.chk8h(false);
								} else if (oDataIn.INTERVENTI.results[i].h8h === true) {
									that.chk1h(false);
									that.chk12h(false);
									that.chk24h(false);
									that.chk46h(false);
									that.chk68h(false);
									that.chk8h(true);
								} else {
									that.chk1h(false);
									that.chk12h(false);
									that.chk24h(false);
									that.chk46h(false);
									that.chk68h(false);
									that.chk8h(false);
								}
							}
							console.log("INTERVENTI DATA");
							console.log(that.getView().byId("idTableInterventi").getModel("RepintInterventiModel").getData());
							that.getView().byId("txtAggiorna1").setText(repintInterventiModel.getData().length);
							that.getView().byId("txtElimina1").setText(repintInterventiModel.getData().length);

							that.setButtonVisibility(that.getView().getModel("RepintEmpHdrModel").getData());
						}

						if (flag === "success") {
							var idTableInterventi = that.getView().byId("idTableInterventi");
							var oRepDateModel = that.getView().byId("idTableReperibilita").getModel("RepintReperibilitaModel");
							var oInterventiDateModel = that.getView().byId("idTableInterventi").getModel("RepintInterventiModel");

							// Iterate through all Interventi Records so as to set 'CONTINTERVENTO ' value with 'IDINTERVENTO' values created after success of 'Salva' operation
							for (var indexInterventi = 0; indexInterventi < oInterventiDateModel.getData().length; ++indexInterventi) {

								//////that.filterRiposiSet(idTableInterventi, oRepDateModel, oInterventiDateModel, indexInterventi);
								//that.getView().byId("idTableInterventi").getModel("RepintInterventiModel")
								that.checkForRIPAfterSubmitForCONTINTERVENTO(oInterventiDateModel);
							}

							oInterventiDateModel.updateBindings(true);
							that.setStessacausale(oInterventiDateModel);
							that.setButtonVisibility(that.getView().getModel("RepintEmpHdrModel").getData());
						}

					}

					// Getting Matricola Delegato data
					var matricolaDeputy = that.getView().getModel("RepintEmpHdrModel").getData()[0].MATRICOLA_DEPUTY;
					if (matricolaDeputy !== "" && matricolaDeputy !== null && matricolaDeputy !== undefined) {
						var RepintCambioRespModelData = that.getView().byId("idRepintCambioResp").getModel("RepintCambioRespModel").getData();

						// Filter records from RepintCambioRespModel based on "Matricola_Deputy" value
						var matricolaDeputyData = jQuery.grep(RepintCambioRespModelData, function (a) {
							return (a.MATRICOLA_DEPUTY == matricolaDeputy);
						});
						console.log("MATRICOLA DEPUTY");
						console.log(matricolaDeputyData);

						if (matricolaDeputyData) {
							if (matricolaDeputyData.length > 0) {
								that.getView().byId("idRepintCambioResp").setValue(matricolaDeputyData[0].NOME_DELEGATO + " " + matricolaDeputyData[0].COGNOME_DELEGATO);

								// Below line of code added on 21st Jan to fix bug:
								// After the user insert or change the Delegato and (re)send (when he receives back the form when rejected) and than send again the form to the Manager, the Manager doesn't receive the form (form ID :  167823)
								// When the Delegato reject the form, the Employee see in the Delegato field the name of the Delegato BUT IF he submit the form again, the form is not sent to the Delegato 
								that.getOwnerComponent().getModel("viewProperties").setProperty("/MATRICOLA_DEPUTY", matricolaDeputyData[0].MATRICOLA_DEPUTY);
							}
						}

						// // Getting Matricola Delegato data
						// xsoDataModel1.read("/RepintEmployee.xsodata/DelegateSet?$filter=MATRICOLA_DELEGATO eq '" + matricolaDeputy + "'", {			
						// 	success: function (oDataIn, oResponse) {
						// 		console.log("DELEGATESET ");
						// 		console.log(oDataIn);

						// 	}.bind(this),
						// 	error: function (oError) {
						// 		//Handle the error
						// 		MessageBox.error("Data fetch failed while getting DelegateSet. Please contact administrator.");
						// 		jQuery.sap.log.getLogger().error("DelegateSet fetch failed" + oError.toString());
						// 	}.bind(this)
						// });							
					}

				},
				error: function (oError) {
					MessageBox.error("Impossibile ottenere le informazioni della scheda REPINT. Contatta l'amministratore");
					jQuery.sap.log.getLogger().error("Data fetch failed for Repint Expand Service. Please contact administrator." + oError.toString());
				}
			};

			xsoBaseModel.read(path, mParameters);

			// Getting Matricola Delegato data
			// var matricolaDeputy = that.getView().getModel("RepintEmpHdrModel").getData()[0].MATRICOLA_DEPUTY;

			// xsoDataModel1.read("/RepintEmployee.xsodata/DelegateSet?$filter=MATRICOLA_DELEGATO eq '" + matricolaDeputy + "', {			
			// 	success: function (oDataIn, oResponse) {
			// 		console.log("DELEGATESET");
			// 		console.log(oDataIn);

			// 	}.bind(this),
			// 	error: function (oError) {
			// 		//Handle the error
			// 		MessageBox.error("Data fetch failed while getting DelegateSet. Please contact administrator.");
			// 		jQuery.sap.log.getLogger().error("DelegateSet fetch failed" + oError.toString());
			// 	}.bind(this)
			// });

		},

		// This function is called from within getExpandData() function to set the visibility of "Richiama", "Invio" and "Salva Bozza" buttons based on "STATO" (Status) value
		setButtonVisibility: function (oRepintEmpHdrModelData) {
			console.log("Inside setButtonVisibility");

			var oReperbilitaModel;
			var oInterventiModel;
			this.getView().byId("idRejComment").setVisible(false);
			this.getView().byId("idlblRejComment").setVisible(false);
			this.getView().byId("idLblapp2").setText("Approvazione Line Manager:");
			this.getView().byId("idLblapp3").setText("Approvazione HR:");
			////oRepintEmpHdrModelData[0].STATO = 201;

			// Set "Salva" and "Salva Bozza" button editable. "Stornata" button non editable
			// STATO = 0 - Salva Bozza operation is performed
			if (oRepintEmpHdrModelData[0].STATO === 0) {
				this.getView().byId("idButStornata").setEnabled(false);
				this.getView().byId("idButCreate").setEnabled(true);
				this.getView().byId("idButDraft").setEnabled(true);
				this.getView().byId("idStato").setText("In carico al Dipendente");
			}
			// STATO = 100 - Submitted for Manager approval. Manager approval pending.
			// Set "Salva" and "salva Bozza" button non editable."Stornata" button editable
			else if (oRepintEmpHdrModelData[0].STATO === 100) {
				this.getView().byId("idButStornata").setEnabled(true);
				// KAPIL - Revert back below changes. Done for testing
				//this.getView().byId("idButCreate").setEnabled(true);
				//this.getView().byId("idButDraft").setEnabled(true);

				// Below logic added on 14th Jan - Bug fixing Defect# 54
				this.getView().byId("idApprovazione2").setText("");
				this.getView().byId("idApprovazione3").setText("");

				this.getView().byId("idButCreate").setEnabled(false);
				this.getView().byId("idButDraft").setEnabled(false);
				this.getView().byId("idStato").setText("Approvata Dipendente");
				// Set Reperibilita and Interventi table "+" and "-" fields Non Editable
				oReperbilitaModel = this.getView().byId("idTableReperibilita").getModel("RepintReperibilitaModel");

				if (oReperbilitaModel !== undefined && oReperbilitaModel !== null && oReperbilitaModel !== "") {
					for (var i = 0; i < oReperbilitaModel.getData().length; ++i) {
						oReperbilitaModel.setProperty("/" + i + "/oButton1", false);
						oReperbilitaModel.setProperty("/" + i + "/oButton2", false);
					}
				}

				oInterventiModel = this.getView().byId("idTableInterventi").getModel("RepintInterventiModel");
				if (oInterventiModel !== undefined && oInterventiModel !== null && oInterventiModel !== "") {
					for (var i = 0; i < oInterventiModel.getData().length; ++i) {
						oInterventiModel.setProperty("/" + i + "/oButton1", false);
						oInterventiModel.setProperty("/" + i + "/oButton2", false);
					}
				}
				var aReperibilita = this.getView().byId("idTableReperibilita");
				var currentRepRec;
				for (var y = 0; y < aReperibilita.getItems().length; ++y) {
					currentRepRec = aReperibilita.getItems()[y];
					this.disableControls(currentRepRec, false);
				}

				var aInterventi = this.getView().byId("idTableInterventi");
				var currentIntRec;
				for (var x = 0; x < aInterventi.getItems().length; ++x) {
					currentIntRec = aInterventi.getItems()[x];
					this.disableControls(currentIntRec, false);
				}

			}
			// Set "Salva", "Salva Bozza" and Stornata" button Non Editable
			// STATO = 101 - Manager Approved, STATO = 102 - HR Approved
			else if (oRepintEmpHdrModelData[0].STATO === 101 || oRepintEmpHdrModelData[0].STATO === 102) {
				this.getView().byId("idButStornata").setEnabled(false);
				this.getView().byId("idButCreate").setEnabled(false);
				this.getView().byId("idButDraft").setEnabled(false);
				if (oRepintEmpHdrModelData[0].STATO === 101) {
					this.getView().byId("idStato").setText("Approvata Responsabile/Deputy");
				} else if (oRepintEmpHdrModelData[0].STATO === 102) {
					this.getView().byId("idStato").setText("Approvata HR");
				}
				// Set Reperibilita and Interventi table "+" and "-" fields Non Editable
				oReperbilitaModel = this.getView().byId("idTableReperibilita").getModel("RepintReperibilitaModel");

				if (oReperbilitaModel !== undefined && oReperbilitaModel !== null && oReperbilitaModel !== "") {
					for (var i = 0; i < oReperbilitaModel.getData().length; ++i) {
						oReperbilitaModel.setProperty("/" + i + "/oButton1", false);
						oReperbilitaModel.setProperty("/" + i + "/oButton2", false);
					}
				}

				oInterventiModel = this.getView().byId("idTableInterventi").getModel("RepintInterventiModel");
				if (oInterventiModel !== undefined && oInterventiModel !== null && oInterventiModel !== "") {
					for (var i = 0; i < oInterventiModel.getData().length; ++i) {
						oInterventiModel.setProperty("/" + i + "/oButton1", false);
						oInterventiModel.setProperty("/" + i + "/oButton2", false);
					}
				}
				var aReperibilita = this.getView().byId("idTableReperibilita");
				var currentRepRec;
				for (var y = 0; y < aReperibilita.getItems().length; ++y) {
					currentRepRec = aReperibilita.getItems()[y];
					this.disableControls(currentRepRec, false);
				}

				var aInterventi = this.getView().byId("idTableInterventi");
				var currentIntRec;
				for (var x = 0; x < aInterventi.getItems().length; ++x) {
					currentIntRec = aInterventi.getItems()[x];
					this.disableControls(currentIntRec, false);
				}
			}
			// Set "Salva", "Salva Bozza" Editable. Stornata" button Non Editable
			// STATO = 201 - Manager Reject, STATO = 202 - HR Reject			
			else if (oRepintEmpHdrModelData[0].STATO === 201 || oRepintEmpHdrModelData[0].STATO === 202) {

				this.getView().byId("idButStornata").setEnabled(false);
				this.getView().byId("idButCreate").setEnabled(true);
				this.getView().byId("idButDraft").setEnabled(true);
				this.getView().byId("idRejComment").setVisible(true);
				this.getView().byId("idlblRejComment").setVisible(true);

				// Below logic commented on 14th Jan - Bug fixing Defect# 54
				// Below logic added on 11th Dec 2020 - Bug fixing
				// if (oRepintEmpHdrModelData[0].STATO === 201) {
				// 	this.getView().byId("idApprovazione2").setText("");
				// } else if (oRepintEmpHdrModelData[0].STATO === 202) {
				// 	this.getView().byId("idApprovazione3").setText("");
				// }
				if (oRepintEmpHdrModelData[0].STATO === 201) { // Manager Reject
				//	this.getView().byId("idApprovazione1").setText(""); // Set "Approvazione Dipendente:" date blank
					this.getView().byId("idLblapp2").setText("Rifiutata Line Manager:");
					this.getView().byId("idStato").setText("Reject Responsabile");
					this.getView().byId("idlblRejComment").setText("Commento Responsabile:");

				} else if (oRepintEmpHdrModelData[0].STATO === 202) { // HR Reject
				//	this.getView().byId("idApprovazione1").setText(""); // Set "Approvazione Dipendente:" date blank
				//	this.getView().byId("idApprovazione2").setText(""); // Set "Approvazione Line Manager:" date blank
					this.getView().byId("idLblapp3").setText("Rifiutata HR:");
					///this.getView().byId("idLblapp3").addStyleClass("repintemployeeSpaceControl14");					
					this.getView().byId("idStato").setText("Reject HR");
					this.getView().byId("idlblRejComment").setText("HR Comment:");
				}

				this.getRejectionComment();
				// if(this.getView().getModel("COMMENTSetModel") !== undefined && 	this.getView().getModel("COMMENTSetModel") !== null){
				// 	if(this.getView().getModel("COMMENTSetModel").getData() > 0){
				// 		this.getView().byId("idRejComment").setText(this.getView().getModel("COMMENTSetModel").getData()[0].COMMENTO);
				// 	}else{
				// 		this.getView().byId("idRejComment").setText("");
				// 	}
				// }else{
				// 	this.getView().byId("idRejComment").setText("");
				// }

			}
			// Set "Salva" and "Salva Bozza" editable. "Stornata" button non editable
			// STATO = 300 - Employee performs "Stornata" operation (Cancel approve by Employee)
			else if (oRepintEmpHdrModelData[0].STATO === 300) {
				this.getView().byId("idButStornata").setEnabled(false);
				this.getView().byId("idButCreate").setEnabled(true);
				this.getView().byId("idButDraft").setEnabled(true);
				this.getView().byId("idApprovazione1").setText("");
				this.getView().byId("idApprovazione2").setText("");
				this.getView().byId("idApprovazione3").setText("");
				this.getView().byId("idStato").setText("Stornata Approvazione Dipendente");
			}
			// Set "Salva" and "Salva Bozza" non editable. "Stornata" button editable
			// STATO = 301 - Manager (Apprpver 1) performs "Stornata" operation (Cancel approve by 1st approver - Manager)
			// PENDING - Check for Due Date pending
			else if (oRepintEmpHdrModelData[0].STATO === 301) {
				this.getView().byId("idButStornata").setEnabled(true);
				this.getView().byId("idButCreate").setEnabled(false);
				this.getView().byId("idButDraft").setEnabled(false);
				this.getView().byId("idStato").setText("Stornata Approvazione Resp.");
				// Set Reperibilita and Interventi table "+" and "-" fields Non Editable
				oReperbilitaModel = this.getView().byId("idTableReperibilita").getModel("RepintReperibilitaModel");

				if (oReperbilitaModel !== undefined && oReperbilitaModel !== null && oReperbilitaModel !== "") {
					for (var i = 0; i < oReperbilitaModel.getData().length; ++i) {
						oReperbilitaModel.setProperty("/" + i + "/oButton1", false);
						oReperbilitaModel.setProperty("/" + i + "/oButton2", false);
					}
				}

				oInterventiModel = this.getView().byId("idTableInterventi").getModel("RepintInterventiModel");
				if (oInterventiModel !== undefined && oInterventiModel !== null && oInterventiModel !== "") {
					for (var i = 0; i < oInterventiModel.getData().length; ++i) {
						oInterventiModel.setProperty("/" + i + "/oButton1", false);
						oInterventiModel.setProperty("/" + i + "/oButton2", false);
					}
				}

				var aReperibilita = this.getView().byId("idTableReperibilita");
				var currentRepRec;
				for (var y = 0; y < aReperibilita.getItems().length; ++y) {
					currentRepRec = aReperibilita.getItems()[y];
					this.disableControls(currentRepRec, false);
				}

				var aInterventi = this.getView().byId("idTableInterventi");
				var currentIntRec;
				for (var x = 0; x < aInterventi.getItems().length; ++x) {
					currentIntRec = aInterventi.getItems()[x];
					this.disableControls(currentIntRec, false);
				}
				oReperbilitaModel.updateBindings(true);
				oInterventiModel.updateBindings(true);
			}
			// Set "Salva", "Salva Bozza" and "Stornata" button non editable
			// SATAO = 302 - HR (Approve 2) performs "Stornata" operation (Cancel approve by 2nd approver - HR)
			else if (oRepintEmpHdrModelData[0].STATO === 302) {
				this.getView().byId("idButStornata").setEnabled(false);
				this.getView().byId("idButCreate").setEnabled(false);
				this.getView().byId("idButDraft").setEnabled(false);
				this.getView().byId("idStato").setText("Stornata Approvazione HR");
			}

		},

		// This function is called from within setButtonVisibility() function when STATO = 201 - Manager Reject, STATO = 202 - HR Reject to read the Rejection comment
		// returned by "COMMENTSET" service and display it on landing page for either "Commento Responsabile:" (if rejected by Manager) or "HR Comment:" (if rejected by HR)
		// Set "Salva", "Salva Bozza" Editable. Stornata" button Non Editable
		getRejectionComment: function () {
			var that = this;
			var xsoBaseModel = that.getOwnerComponent().getModel("basexsoModel");
			var idScheda = that.getOwnerComponent().getModel("viewProperties").getProperty("/IDSCHEDA");

			var oFilters = [];
			var filter11 = new sap.ui.model.Filter("IDSCHEDA", sap.ui.model.FilterOperator.EQ, idScheda);
			oFilters.push(filter11);

			xsoBaseModel.read("/COMMENTSET", {
				filters: oFilters,
				success: function (oDataIn, oResponse) {
					if (oDataIn.results.length > 0) {
						that.getView().byId("idRejComment").setText(oDataIn.results[oDataIn.results.length - 1].COMMENTO);
					} else {
						that.getView().byId("idRejComment").setText("");
					}

				}.bind(that),
				error: function (oError) {
					//Handle the error
					MessageBox.error("Impossibile ottenere le informazioni dei commenti pe ril motivo el rifiuto. Contatta l'amministratore");
					jQuery.sap.log.getLogger().error("Data fetch failed for COMMENTSET. Please contact administrator." + oError.toString());
				}.bind(that)
			});
		},

		// This function is to disable Controls (Input,DatePicker,TimePicker,Select) of "Reperibilita" and "Interventi" table
		// This Function is called from within setButtonVisibility() function when STATO is following:
		// STATO = 100 - Submitted for Manager approval. Manager approval pending (Set "Salva" and "salva Bozza" button non editable."Stornata" button editable)
		// STATO = 101 - Manager Approved, STATO = 102 - HR Approved (Set "Salva", "Salva Bozza" and Stornata" button Non Editable)
		// STATO = 301 - Manager (Apprpver 1) performs "Stornata" operation (Cancel approve by 1st approver - Manager)	(Set "Salva" and "Salva Bozza" non editable. "Stornata" button editable)	
		disableControls: function (e, t) {
			var a = e.getCells();
			for (var o = 0; o < a.length - 2; o++) {
				var i = a[o];
				var aa = i.getMetadata();
				var obj = aa.getElementName();
				if (obj === "sap.m.Input" || obj === "sap.m.DatePicker" || obj === "sap.m.TimePicker" || obj === "sap.m.Select") {
					//	i.setEnabled(t);
					i.setEditable(t);
				}
			}
		},

		// This function is called to display only "Reperibilita" table -  "Visualizza Solo Reperibilità"
		pressReperibilita: function (oEvent) {
			this.getView().byId("idInterventiVBox").setVisible(false);
			this.getView().byId("idReperibilitaVBox").setVisible(true);
			this.getView().byId("idTableReperibilita").setWidth("100%");

		},

		// This function is called to display only "Interventi" table -  "Solo Interventi"
		pressInterventi: function (oEvent) {
			this.getView().byId("idInterventiVBox").setVisible(true);
			this.getView().byId("idReperibilitaVBox").setVisible(false);
			this.getView().byId("idTableReperibilita").setWidth("30rem");
		},

		// This function is called to display both "Reperibilita" annd "Interventi" table - "Visualizza Solo Reperibilità" and "Solo Interventi"
		pressReperibilitaInterventi: function (oEvent) {
			this.getView().byId("idInterventiVBox").setVisible(true);
			this.getView().byId("idReperibilitaVBox").setVisible(true);
			this.getView().byId("idTableReperibilita").setWidth("30rem");
			this.getView().byId("idTableInterventi").setWidth("109rem");
		},

		// This function is to open 'ValueHelp' popup (CambioResp.fragment.xml) of "Eventuale Delegato" field
		handleValueHelp: function (oEvent) {
			var that = this;
			var idPath = oEvent.getSource().sId;

			if (!that._valueHelpDialog) {
				that._valueHelpDialog = sap.ui.xmlfragment(
					"REPINTEMPOLEEY.REPINTEMPOLEEY.fragment.CambioResp", that);
				that._valueHelpDialog.setModel(that.getView().byId("idRepintCambioResp").getModel("RepintCambioRespModel"));
				sap.ui.getCore().byId(idPath).addDependent(that._valueHelpDialog);
			}
			that._valueHelpDialog.open();
		},

		// This function is called while performing search on 'ValueHelp' popup (CambioResp.fragment.xml) of "Eventuale Delegato" field
		_handleValueHelpSearch: function (oEvent) {
			var oFilters = [];
			var svalue = oEvent.getParameters("selectedItem").value;
			var oFilter1 = new sap.ui.model.Filter("NOME_DELEGATO", sap.ui.model.FilterOperator.Contains, svalue);
			//oFilters.push(filter1);
			var oFilter2 = new sap.ui.model.Filter("COGNOME_DELEGATO", sap.ui.model.FilterOperator.Contains, svalue);
			//oFilters.push(filter2);
			oFilters = new sap.ui.model.Filter([oFilter1, oFilter2]);
			// filter binding
			var oList = sap.ui.getCore().byId("idSelectDiagCambioResp");
			var oBinding = oList.getBinding("items");
			oBinding.filter(oFilters);
		},

		// This function is called on confirming (On selecting single value) value on 'ValueHelp' popup (CambioResp.fragment.xml) of "Eventuale Delegato" field
		_handleValueHelpClose: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem"),
				oInput = this.getView().byId("idRepintCambioResp");

			if (!oSelectedItem) {
				oInput.resetProperty("value");
				return;
			}

			oInput.setValue(oSelectedItem.getTitle());

			this.getOwnerComponent().getModel("viewProperties").setProperty("/MATRICOLA_DEPUTY", sap.ui.getCore().byId(
				"idSelectDiagCambioResp").getModel("RepintCambioRespModel").getProperty(oEvent.getParameter("selectedItem").getBindingContextPath() +
				"/MATRICOLA_DEPUTY"));

			// // Below code added on 
			// this.getView().byId("idRepintCambioResp").setValue(sap.ui.getCore().byId(
			// 	"idSelectDiagCambioResp").getModel("RepintCambioRespModel").getProperty(oEvent.getParameter("selectedItem").getBindingContextPath() +
			// 	"/MATRICOLA_DEPUTY"));	

		},

		// This function is called on cancelling (On click 'Cancel' button) on 'ValueHelp' popup (CambioResp.fragment.xml) of "Eventuale Delegato" field
		// Here on cancelling already selected value(if value exists) of "Eventuale Delegato" field will get removed (blank)
		_handleValueHelpCancel: function (oEvent) {

			this.getOwnerComponent().getModel("viewProperties").setProperty("/MATRICOLA_DEPUTY", "");
			///this.getView().byId("idRepintCambioResp").setValue("");
			var oSelectedItem = oEvent.getParameter("selectedItem"),
				oInput = this.getView().byId("idRepintCambioResp");

			if (!oSelectedItem) {
				oInput.resetProperty("value");
				
				
				// var xsoBaseModel = this.getOwnerComponent().getModel("basexsoModel");
				// xsoBaseModel.attachRequestSent(function () {
				// 	this._busyDialog.open();
				// });
				// xsoBaseModel.attachRequestCompleted(function () {
				// 	this._busyDialog.close();
				// });
				// // Update "RepintCambioRespModel" model for "Eventuale Delegato" ValueHelp selected Key and Text
				// var repintCambioRespModel = new sap.ui.model.json.JSONModel();
				// var oRepintCambioRespJson = [];
				// var oRepintCambioRespJsonData = {};
				// var oFilters = [];

				// //var CDCvalue = that.getView().getModel("RepintEmpdataModel").getProperty("/0/CDC");
				// //var filter11 = new sap.ui.model.Filter("CDC", sap.ui.model.FilterOperator.Contains, CDCvalue);

				// var matricula_resp = this.getView().getModel("RepintEmpdataModel").getProperty("/0/MATRICOLA_RESP");

				// if (matricula_resp !== undefined && matricula_resp !== null && matricula_resp !== "") {
				// 	var filter11 = new sap.ui.model.Filter("MATRICOLA_RESP", sap.ui.model.FilterOperator.Contains, matricula_resp);
				// 	oFilters.push(filter11);

				// 	//xsoBaseModel.read("/CambioResponsabileSet?$filter=CDC eq 'IT01SP-010'", {
				// 	xsoBaseModel.read("/CambioResponsabileSet", {
				// 		filters: oFilters,
				// 		success: function (oDataIn, oResponse) {
				// 			//jsonModel.setData(oDataIn);
				// 			for (var i = 0; i < oDataIn.results.length; ++i) {
				// 				oRepintCambioRespJsonData = {
				// 					"MATRICOLA_RESP": oDataIn.results[i].MATRICOLA_RESP,
				// 					"NOME_RESP": oDataIn.results[i].NOME_RESP,
				// 					"COGNOME_RESP": oDataIn.results[i].COGNOME_RESP,
				// 					"MATRICOLA_DEPUTY": oDataIn.results[i].MATRICOLA_DELEGATO,
				// 					"COGNOME_DELEGATO": oDataIn.results[i].COGNOME_DELEGATO,
				// 					"NOME_DELEGATO": oDataIn.results[i].NOME_DELEGATO
				// 				};

				// 				oRepintCambioRespJson.push(oRepintCambioRespJsonData);
				// 				oRepintCambioRespJsonData = {};
				// 			}
				// 			console.log(" CAMBIO RESP ON CANCEL");
				// 			console.log(oRepintCambioRespJson);
				// 			repintCambioRespModel.setData(oRepintCambioRespJson);
				// 			this.getView().byId("idRepintCambioResp").setModel(repintCambioRespModel, "RepintCambioRespModel");

				// 		}.bind(this),
				// 		error: function (oError) {
				// 			//Handle the error
				// 			MessageBox.error("Impossibile ottenere le informazioni del Responsabile/Deputy. Contatta l'amministratore");
				// 			jQuery.sap.log.getLogger().error("RepintCambioResponsabile data fetch failed" + oError.toString());
				// 		}.bind(this)
				// 	});
				// }
				
				return;
			}
		},

		// This function is called immediately before selecting/changing "Reperibilita" date value to get and store old selected "Reperibilita" date value (If Reperibilita
		// date value is already selected before current selection/change). Old "Reperibilita" date value is used for validation whether selected/changed date value already
		// exists in the whole "Reperibilita" table
		navigateReperibilitaDate: function (oEvent) {
			console.log(oEvent);
			if (oEvent.getSource().getValue() !== "" && oEvent.getSource().getValue() !== null) {
				//this.getOwnerComponent().getModel("viewProperties").setProperty("/oldReperbilitaDate", oEvent.getSource().getValue());
				this.getOwnerComponent().getModel("viewProperties").setProperty("/oldReperbilitaDate", oEvent.getSource().getValue());
			} else {
				this.getOwnerComponent().getModel("viewProperties").setProperty("/oldReperbilitaDate", null);
			}

		},

		// 
		handleDateChange: function (oEvent) {
			var that = this;
			var reperbilitaNewDate;

			if (that.ReperInterventiDateCheckForLPN(oEvent)) {
				if ((that.getOwnerComponent().getModel("viewProperties").getProperty("/oldReperbilitaDate") === "") || (that.getOwnerComponent().getModel(
						"viewProperties").getProperty("/oldReperbilitaDate") === null)) { // Indicates new Reperbilita Date selection

					that.setReperbilitaDateLSF(oEvent);

					// var oRepDateModel = this.getView().byId("idTableReperibilita").getModel("RepintReperibilitaModel");
					// var Dtflag = false;

					// if (oRepDateModel.getData().length > 1) {
					// 	var oData = oRepDateModel.getProperty("/");
					// 	var index = oEvent.getSource().getParent().getParent().indexOfItem(oEvent.getSource().getParent());
					// 	oRepDateModel.getData()[index].DATAREPERIBILITA = null;

					// 	for (var j = 0; j < oRepDateModel.getData().length; ++j) {
					// 		if (oEvent.getParameter("newValue") === oRepDateModel.getData()[j].DATAREPERIBILITA) {
					// 			Dtflag = true;
					// 		}
					// 	}
					// 	if (Dtflag) {
					// 		oEvent.getSource().setDateValue(null);
					// 		MessageBox.error("La data selezionata è già utilizzata. Seleziona un valore differente");
					// 		return;
					// 	} else {
					// 		oRepDateModel.getData()[index].DATAREPERIBILITA = oEvent.getParameter("newValue");
					// 	}
					// }

					// if (!Dtflag) {
					// 	this.getLSF(oEvent);
					// }

				} else { // Indicates Reperbilita date change

					// Line added on 26th Nov. Commented the same line below.
					// Below logic added on 26th Nov 2020 to sort Reperibilita Date
					var indexReperibilita = oEvent.getSource().getParent().getParent().indexOfItem(oEvent.getSource().getParent());

					if (that.setReperbilitaDateLSF(oEvent)) {
						reperbilitaNewDate = oEvent.getParameter("newValue");
					} else {
						reperbilitaNewDate = null; // Set null in order to set null value for Interventi date whose value was same like Reperbilita Date before selection
					}
					//	if (oRepDateModel.getData().length > 1) {
					//var oData = oRepDateModel.getProperty("/");

					// Line commented on 26th Nov
					///////////////	var indexReperibilita = oEvent.getSource().getParent().getParent().indexOfItem(oEvent.getSource().getParent());

					//var data = this.getView().byId("idTableReperibilita").getModel("RepintReperibilitaModel").getProperty("/");
					var dataInterventi = this.getView().byId("idTableInterventi").getModel("RepintInterventiModel").getProperty("/");
					var oldReperbilitaDate = that.getOwnerComponent().getModel("viewProperties").getProperty("/oldReperbilitaDate");
					//var reperbilitaNewDate = oEvent.getParameter("newValue");

					var indexInterventi = dataInterventi.length;
					while (indexInterventi--) {
						if (oldReperbilitaDate === dataInterventi[indexInterventi].DATAINTERVENTO) {
							dataInterventi[indexInterventi].DATAINTERVENTO = reperbilitaNewDate;
							that.handleInterventiDateUpdate(reperbilitaNewDate, indexInterventi, indexReperibilita);
						}
					}
					//	}
				}
			}

		},

		// Below condition added on 7th Dec 2020
		ReperInterventiDateCheckForLPN: function (oEvent) {
			var reperbilitaNewDate = oEvent.getParameter("newValue");

			var oRepDateModel = this.getView().byId("idTableReperibilita").getModel("RepintReperibilitaModel");
			var oInterventiDateModel = this.getView().byId("idTableInterventi").getModel("RepintInterventiModel");
			////////////var indexInterventi = oEvent.getSource().getParent().getParent().indexOfItem(oEvent.getSource().getParent());
			var indexReperibilita = oEvent.getSource().getParent().getParent().indexOfItem(oEvent.getSource().getParent());

			///////////this.resetInterventiValues(this.getView().byId("idTableInterventi"), oInterventiDateModel, indexInterventi);

			//var Dtflag = false;
			for (var j = 0; j < oInterventiDateModel.getData().length; ++j) {
				if (reperbilitaNewDate === oInterventiDateModel.getData()[j].DATAINTERVENTO) {
					//Dtflag = true;

					// if (oRepDateModel.getData()[j].Fer === true) {
					// 	oInterventiDateModel.getData()[indexInterventi].WORKINGDAY = true;
					// 	oInterventiDateModel.getData()[indexInterventi].NONWORKINGDAY = false;
					// } else { // SATURDAY, SUNDAY or HOLIDAY // if(oRepDateModel.getData()[j].Sab === true || oRepDateModel.getData()[j].Dom === true){
					// 	oInterventiDateModel.getData()[indexInterventi].WORKINGDAY = false;
					// 	oInterventiDateModel.getData()[indexInterventi].NONWORKINGDAY = true;
					// }

					if (oInterventiDateModel.getData()[j].FLAGNOTTURNO === true && (oInterventiDateModel.getData()[j].DATAINTERVENTO !== "" &&
							oInterventiDateModel.getData()[j].DATAINTERVENTO !== undefined && oInterventiDateModel.getData()[j].DATAINTERVENTO !== null)) {
						oEvent.getSource().setDateValue(null);
						///////////this.resetInterventiValues(this.getView().byId("idTableInterventi"), oInterventiDateModel, k);
						this.getView().byId("idTableReperibilita").getItems()[indexReperibilita].getCells()[0].setValueState(sap.ui.core.ValueState.Error);
						MessageBox.error("Non è possibile inserire per LPN una data presente in Reperibilità");
						return false;
					}
				}
			}

			// for (var k = 0; k < oInterventiDateModel.getData().length; ++k) {

			// 	// if ((!Dtflag) && oInterventiDateModel.getData()[k].FLAGNOTTURNO !== true && (oInterventiDateModel.getData()[k].DATAINTERVENTO !== "" 
			// 	// && oInterventiDateModel.getData()[k].DATAINTERVENTO !== undefined  && oInterventiDateModel.getData()[k].DATAINTERVENTO !== null) ) {
			// 	// 	oEvent.getSource().setDateValue(null);
			// 	// 	////////////////this.resetInterventiValues(this.getView().byId("idTableInterventi"), oInterventiDateModel, k);

			// 	// 	this.getView().byId("idTableReperibilita").getItems()[indexReperibilita].getCells()[0].setValueState(sap.ui.core.ValueState.Error);
			// 	// 	MessageBox.error("Per l'intervento inserire una data presente in Reperibilità");
			// 	// 	return;
			// 	// }

			// 	if (Dtflag && oInterventiDateModel.getData()[k].FLAGNOTTURNO === true && (oInterventiDateModel.getData()[k].DATAINTERVENTO !== "" &&
			// 			oInterventiDateModel.getData()[k].DATAINTERVENTO !== undefined && oInterventiDateModel.getData()[k].DATAINTERVENTO !== null)) {
			// 		oEvent.getSource().setDateValue(null);
			// 		///////////this.resetInterventiValues(this.getView().byId("idTableInterventi"), oInterventiDateModel, k);
			// 		this.getView().byId("idTableReperibilita").getItems()[indexReperibilita].getCells()[0].setValueState(sap.ui.core.ValueState.Error);
			// 		MessageBox.error("Non è possibile inserire per LPN una data presente in Reperibilità");
			// 		return false;
			// 	}
			// }

			// // If LPN is checked user can select any date for Anno/Messe month. Here need to identify whether it is Working day or NONWORKINGDAY (Sat, Sunday or Holiday)
			// if (oInterventiDateModel.getData()[indexInterventi].FLAGNOTTURNO === true) {
			// 	oInterventiDateModel.getData()[indexInterventi].RIPOSI = null;
			// 	this.getLSFForInterventiLPN(oEvent, "", "");
			// }

			// this.filterRiposiSet(this.getView().byId("idTableInterventi"), oRepDateModel, oInterventiDateModel, indexInterventi, false);
			return true;
		},

		setReperbilitaDateLSF: function (oEvent) {
			var oRepDateModel = this.getView().byId("idTableReperibilita").getModel("RepintReperibilitaModel");
			var Dtflag = false;

			if (oRepDateModel.getData().length > 1) {
				//var oData = oRepDateModel.getProperty("/");
				var index = oEvent.getSource().getParent().getParent().indexOfItem(oEvent.getSource().getParent());

				for (var j = 0; j < oRepDateModel.getData().length; ++j) {
					if ((oEvent.getParameter("newValue") === oRepDateModel.getData()[j].DATAREPERIBILITA) && (index !== j)) {
						Dtflag = true;
						break;
					}
				}
				if (Dtflag) {
					//oEvent.getSource().setDateValue(null);
					this.resetReperbilitaValues(oRepDateModel, index);
					MessageBox.error("La data selezionata è già utilizzata. Seleziona un valore differente");
					return false;
				} else {
					oRepDateModel.getData()[index].DATAREPERIBILITA = oEvent.getParameter("newValue");
				}
			}

			if (!Dtflag) {
				this.getLSF(oEvent);

				// Below logic added on 26th Nov 2020 to sort Reperibilita Date
				var oSortedReperibilitaDateData;
				var oReperibilitaTable = this.getView().byId("idTableReperibilita");
				var oSortedReperibilitaDateDataModel = new sap.ui.model.json.JSONModel();

				var oRepDateModel = oReperibilitaTable.getModel("RepintReperibilitaModel");
				oSortedReperibilitaDateData = this.sortReperibilitaDateData(oRepDateModel);

				oSortedReperibilitaDateDataModel.setData(oSortedReperibilitaDateData);
				oSortedReperibilitaDateDataModel.updateBindings(true);
				oSortedReperibilitaDateDataModel.refresh();
				oReperibilitaTable.setModel(oSortedReperibilitaDateDataModel, "RepintReperibilitaModel");
				return true;
			}
		},

		getLSF: function (oEvent) {
			var that = this;
			var oDateVal = oEvent.getParameter("newValue").split("-");
			var dd = oDateVal[0];
			var mm = oDateVal[1];
			var yy = oDateVal[2];

			var aDate = mm + "-" + dd;
			var aEmpId = that.getOwnerComponent().getModel("empModel").getData().name; // Get logged in Emp EmpId
			// KAPIL HARDCODED
			//aEmpId = "P2001257460";
			//aEmpId = "P2002397341";
			//var aEmpId = "P2002397341";
			//aEmpId = "P2001995750";
			//aEmpId = "P1942220823";

			var aCompleteDate = yy + "-" + mm + "-" + dd + "T00:00:00";

			// https://italybfmyao56da.hana.ondemand.com/REPINT/RepintEmployee/xsjs/getLSF.xsjs/?aDate='06-01'&aEmpid='1234'&aCompleteDate=2020-06-01T00:00:00
			//var urlgetLSF = "/HANAMDC/REPINT/RepintEmployee/xsjs/getLSF.xsjs/?aDate='06-01'&aEmpid='1234'&aCompleteDate=2020-06-01T00:00:00";

			// Actual working url below
			var urlgetLSF = "/HANAMDC/REPINT/RepintEmployee/xsjs/getLSF.xsjs/?aDate='" + aDate + "'&aEmpid='" + aEmpId + "'&aCompleteDate=" +
				aCompleteDate;

			var oModel = that.getView().byId("idTableReperibilita").getModel("RepintReperibilitaModel");
			var oData = oModel.getProperty("/");

			var index = oEvent.getSource().getParent().getParent().indexOfItem(oEvent.getSource().getParent());

			oData[index].Dom = false;
			oData[index].Fer = false;
			oData[index].Sab = false;

			$.ajax({
				url: urlgetLSF,
				async: false,
				success: function (data) {
					console.log(data);

					// for(var i = 0 ; i < data.length ; ++i){
					// 	if(data[i].H !== undefined && data[i].H !== null){ // It mean "H" (Holiday) exists. Set "F"
					// 		oData[index].Dom = true;
					// 	}
					// 	if(data[i].L !== undefined && data[i].L !== null){ // It mean "L" exists
					// 		oData[index].Fer = true;
					// 	}							
					// 	if(data[i].S !== undefined && data[i].S !== null){ // It mean "S" exists
					// 		oData[index].Sab = true;
					// 	}								
					// }
					for (var i = 0; i < data.length; ++i) {
						if (data[i].F !== undefined && data[i].F !== null) { // It mean (Holiday) exists. Set "F"
							oData[index].Dom = true;
							that.chkDom(true);
							that.chkSab(false);
							that.chkFer(false);
						} else if (data[i].S !== undefined && data[i].S !== null) { // It mean "S" exists
							oData[index].Sab = true;
							that.chkSab(true);
							that.chkFer(false);
							that.chkDom(false);
						} else {
							oData[index].Fer = true; // It mean "L" exists
							that.chkFer(true);
							that.chkSab(false);
							that.chkDom(false);
						}
					}

					that.getView().byId("idTableReperibilita").getModel("RepintReperibilitaModel").setProperty("/", oData);
				},
				error: function (xhr, textStatus, error) {
					MessageBox.error(
						"Impossibile ottenere le informazioni in merito alla variazione della data di reperbilità. Contatta l'amministratore");
					jQuery.sap.log.getLogger().error(
						"Data fetch failed while calling getLSF function for Reperibilita Date change. Please contact administrator." + error.toString()
					);
				}
			});

		},

		// Logic added on 5th Oct
		// This function is to check whether next Interventi Date (next from currently selected Interventi Date) is "Non Working Day" (Holiday or Sat/Sunday) or "Working Day" (working Weekday)
		// If next day is 'Holiday' then that.LSFHolidayFlag = true. If 'Working day' then that.LSFHolidayFlag = false
		// Multi calculation is to skip when next day is Non Working day else go ahead with 'Multi' calculation
		getLSFForMultiCalc: function (nextInterventiDate) {
			var that = this;
			that.LSFHolidayFlag = false;
			//var oDateVal = oEvent.getParameter("newValue").split("-");
			var oDateVal = nextInterventiDate.split("-");
			var dd = oDateVal[0];
			var mm = oDateVal[1];
			var yy = oDateVal[2];

			var aDate = mm + "-" + dd;
			var aEmpId = that.getOwnerComponent().getModel("empModel").getData().name; // Get logged in Emp EmpId
			var aCompleteDate = yy + "-" + mm + "-" + dd + "T00:00:00";

			// https://italybfmyao56da.hana.ondemand.com/REPINT/RepintEmployee/xsjs/getLSF.xsjs/?aDate='06-01'&aEmpid='1234'&aCompleteDate=2020-06-01T00:00:00
			//var urlgetLSF = "/HANAMDC/REPINT/RepintEmployee/xsjs/getLSF.xsjs/?aDate='06-01'&aEmpid='1234'&aCompleteDate=2020-06-01T00:00:00";

			// Actual working url below
			var urlgetLSF = "/HANAMDC/REPINT/RepintEmployee/xsjs/getLSF.xsjs/?aDate='" + aDate + "'&aEmpid='" + aEmpId + "'&aCompleteDate=" +
				aCompleteDate;

			// var oModel = that.getView().byId("idTableReperibilita").getModel("RepintReperibilitaModel");
			// var oData = oModel.getProperty("/");

			// var index = oEvent.getSource().getParent().getParent().indexOfItem(oEvent.getSource().getParent());

			// oData[index].Dom = false;
			// oData[index].Fer = false;
			// oData[index].Sab = false;

			$.ajax({
				url: urlgetLSF,
				async: false,
				success: function (data) {
					console.log(data);

					// for(var i = 0 ; i < data.length ; ++i){
					// 	if(data[i].H !== undefined && data[i].H !== null){ // It mean "H" (Holiday) exists. Set "F"
					// 		oData[index].Dom = true;
					// 	}
					// 	if(data[i].L !== undefined && data[i].L !== null){ // It mean "L" exists
					// 		oData[index].Fer = true;
					// 	}							
					// 	if(data[i].S !== undefined && data[i].S !== null){ // It mean "S" exists
					// 		oData[index].Sab = true;
					// 	}								
					// }
					for (var i = 0; i < data.length; ++i) {

						if (data[i].F !== undefined && data[i].F !== null) { // It mean (Holiday) exists. Set "F"
							that.LSFHolidayFlag = true;
							//oData[index].Dom = true;
							// that.chkDom(true);
							// that.chkSab(false);
							// that.chkFer(false);

						} else if (data[i].S !== undefined && data[i].S !== null) { // It mean "S" exists
							that.LSFHolidayFlag = true;
							//oData[index].Sab = true;
							// that.chkSab(true);
							// that.chkFer(false);
							// that.chkDom(false);
						} else {
							that.LSFHolidayFlag = false;
							//oData[index].Fer = true; // It mean "L" exists
							// that.chkFer(true);
							// that.chkSab(false);
							// that.chkDom(false);
						}
					}

					///that.getView().byId("idTableReperibilita").getModel("RepintReperibilitaModel").setProperty("/", oData);
				},
				error: function (xhr, textStatus, error) {
					MessageBox.error("Impossibile ottenere le informazioni delle regole per il calcolo del riposo. Contatta l'amministratore");
					jQuery.sap.log.getLogger().error("Data fetch failed while calling getLSF for Multi Calculation.Please contact administrator." +
						error.toString());
				}
			});

		},

		// This function is reused - Called when new Interventi date is selected(Reperbilita date exists) where "interventiDateValue" & "indexinterventi" is blank or Reperbilita date is changed where "oEvent" is blank
		getLSFForInterventiLPN: function (oEvent, interventiDateValue, indexinterventi) {
			var that = this;
			var indexInterventi;
			var oDateVal;

			if (oEvent !== "") {
				oDateVal = oEvent.getParameter("newValue").split("-");
				indexInterventi = oEvent.getSource().getParent().getParent().indexOfItem(oEvent.getSource().getParent());
			} else {
				oDateVal = interventiDateValue.split("-");
				indexInterventi = indexinterventi;
			}

			var dd = oDateVal[0];
			var mm = oDateVal[1];
			var yy = oDateVal[2];

			var aDate = mm + "-" + dd;
			var aEmpId = that.getOwnerComponent().getModel("empModel").getData().name; // Get logged in Emp EmpId
			var aCompleteDate = yy + "-" + mm + "-" + dd + "T00:00:00";

			// Actual working url below
			var urlgetLSF = "/HANAMDC/REPINT/RepintEmployee/xsjs/getLSF.xsjs/?aDate='" + aDate + "'&aEmpid='" + aEmpId + "'&aCompleteDate=" +
				aCompleteDate;

			var oInterventiDateModel = that.getView().byId("idTableInterventi").getModel("RepintInterventiModel");

			$.ajax({
				url: urlgetLSF,
				async: false,
				success: function (data) {
					for (var i = 0; i < data.length; ++i) {
						if ((data[i].F !== undefined && data[i].F !== null) || (data[i].S !== undefined && data[i].S !== null)) { // It mean Non-Working day (Sat, Sun or Holiday)
							oInterventiDateModel.getData()[indexInterventi].WORKINGDAY = false;
							oInterventiDateModel.getData()[indexInterventi].NONWORKINGDAY = true;
						} else { // Working Day - "L" value
							oInterventiDateModel.getData()[indexInterventi].WORKINGDAY = true;
							oInterventiDateModel.getData()[indexInterventi].NONWORKINGDAY = false;
						}
					}
				},
				error: function (xhr, textStatus, error) {
					MessageBox.error(
						"Impossibile ottenere le informazioni per il calcolo di LPN. Contatta l'amministratore");
					jQuery.sap.log.getLogger().error(
						"Data fetch failed while calling getLSFForInterventiLPN function for LPN condition . Please contact administrator." + error.toString()
					);
				}
			});

		},

		resetInterventiValues: function (oInterventiTable, oInterventiDateModel, indexInterventi) {
			//Reset Ora Inizio and Ora Fine values
			oInterventiTable.getItems()[indexInterventi].getCells()[3].setValueState(sap.ui.core.ValueState.None);
			oInterventiTable.getItems()[indexInterventi].getCells()[4].setValueState(sap.ui.core.ValueState.None);
			oInterventiDateModel.getData()[indexInterventi].ORAINIZIOTIMESTAMP = null;
			oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP = null;
			////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraInizioDateTimestamp", null);
			////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraFineoDateTimestamp", null);
			oInterventiDateModel.getData()[indexInterventi].ORAINIZIO = null;
			oInterventiDateModel.getData()[indexInterventi].ORAFINE = null;
			oInterventiDateModel.getData()[indexInterventi].FLAGCONT = false;
			oInterventiDateModel.getData()[indexInterventi].RIPOSI = null;
			oInterventiDateModel.getData()[indexInterventi].h1h = false;
			oInterventiDateModel.getData()[indexInterventi].h12h = false;
			oInterventiDateModel.getData()[indexInterventi].h24h = false;
			oInterventiDateModel.getData()[indexInterventi].h46h = false;
			oInterventiDateModel.getData()[indexInterventi].h68h = false;
			oInterventiDateModel.getData()[indexInterventi].h8h = false;
		},

		resetReperbilitaValues: function (oRepDateModel, index) {
			var oData = oRepDateModel.getProperty("/");
			oData[index].DATAREPERIBILITA = null;
			oData[index].Dom = false;
			oData[index].Sab = false;
			oData[index].Fer = false;
		},

		handleInterventiDateUpdate: function (newDateValue, indexInterventi, indexReperibilita) {

			var oRepDateModel = this.getView().byId("idTableReperibilita").getModel("RepintReperibilitaModel");
			var oInterventiDateModel = this.getView().byId("idTableInterventi").getModel("RepintInterventiModel");

			this.resetInterventiValues(this.getView().byId("idTableInterventi"), oInterventiDateModel, indexInterventi);

			//var Dtflag = false; 
			//for (var j = 0; j < oRepDateModel.getData().length; ++j) {
			//if (oEvent.getParameter("newValue") === oRepDateModel.getData()[j].DATAREPERIBILITA) {
			//Dtflag = true;

			if (oRepDateModel.getData()[indexReperibilita].Fer === true) {
				oInterventiDateModel.getData()[indexInterventi].WORKINGDAY = true;
				oInterventiDateModel.getData()[indexInterventi].NONWORKINGDAY = false;
			} else { // SATURDAY, SUNDAY or HOLIDAY // if(oRepDateModel.getData()[indexReperibilita].Sab === true || oRepDateModel.getData()[indexReperibilita].Dom === true){
				oInterventiDateModel.getData()[indexInterventi].WORKINGDAY = false;
				oInterventiDateModel.getData()[indexInterventi].NONWORKINGDAY = true;
			}
			//	}
			//}

			// if ((!Dtflag) && oInterventiDateModel.getData()[indexInterventi].LPN !== true) {
			// 	oEvent.getSource().setDateValue(null);
			// 	this.resetInterventiValues(this.getView().byId("idTableInterventi"), oInterventiDateModel, indexInterventi);

			// 	MessageBox.error("Per l'intervento inserire una data presente in Reperibilità");
			// 	return;
			// }

			// If LPN is checked user can select any date for Anno/Messe month. Here need to identify whether it is Working day or NONWORKINGDAY (Sat, Sunday or Holiday)
			if (oInterventiDateModel.getData()[indexInterventi].FLAGNOTTURNO === true) {
				oInterventiDateModel.getData()[indexInterventi].RIPOSI = null;
				this.getLSFForInterventiLPN("", newDateValue, indexInterventi);
			}

			oRepDateModel.updateBindings(true);
			oInterventiDateModel.updateBindings(true);

			///////////this.filterRiposiSet(oRepDateModel, oInterventiDateModel, indexInterventi);
		},

		// Below code commented to implement LPN Change
		// handleInterventiDateChange: function (oEvent) {
		// 	var oRepDateModel = this.getView().byId("idTableReperibilita").getModel("RepintReperibilitaModel");
		// 	var oInterventiDateModel = this.getView().byId("idTableInterventi").getModel("RepintInterventiModel");
		// 	var indexInterventi = oEvent.getSource().getParent().getParent().indexOfItem(oEvent.getSource().getParent());

		// 	this.resetInterventiValues(this.getView().byId("idTableInterventi"), oInterventiDateModel, indexInterventi);

		// 	var Dtflag = false;
		// 	for (var j = 0; j < oRepDateModel.getData().length; ++j) {
		// 		if (oEvent.getParameter("newValue") === oRepDateModel.getData()[j].DATAREPERIBILITA) {
		// 			Dtflag = true;

		// 			if (oRepDateModel.getData()[j].Fer === true) {
		// 				oInterventiDateModel.getData()[indexInterventi].WORKINGDAY = true;
		// 				oInterventiDateModel.getData()[indexInterventi].NONWORKINGDAY = false;
		// 			} else { // SATURDAY, SUNDAY or HOLIDAY // if(oRepDateModel.getData()[j].Sab === true || oRepDateModel.getData()[j].Dom === true){
		// 				oInterventiDateModel.getData()[indexInterventi].WORKINGDAY = false;
		// 				oInterventiDateModel.getData()[indexInterventi].NONWORKINGDAY = true;
		// 			}
		// 		}
		// 	}

		// 	if ((!Dtflag) && oInterventiDateModel.getData()[indexInterventi].FLAGNOTTURNO !== true) {
		// 		oEvent.getSource().setDateValue(null);
		// 		this.resetInterventiValues(this.getView().byId("idTableInterventi"), oInterventiDateModel, indexInterventi);
		// 		this.getView().byId("idTableInterventi").getItems()[indexInterventi].getCells()[2].setValueState(sap.ui.core.ValueState.Error);
		// 		MessageBox.error("Per l'intervento inserire una data presente in Reperibilità");
		// 		return;
		// 	}

		// 	// If LPN is checked user can select any date for Anno/Messe month. Here need to identify whether it is Working day or NONWORKINGDAY (Sat, Sunday or Holiday)
		// 	if (oInterventiDateModel.getData()[indexInterventi].FLAGNOTTURNO === true) {
		// 		oInterventiDateModel.getData()[indexInterventi].RIPOSI = null;
		// 		this.getLSFForInterventiLPN(oEvent, "", "");
		// 	}

		// 	this.filterRiposiSet(this.getView().byId("idTableInterventi"), oRepDateModel, oInterventiDateModel, indexInterventi);

		// },

		handleInterventiDateChange: function (oEvent) {
			var oRepDateModel = this.getView().byId("idTableReperibilita").getModel("RepintReperibilitaModel");
			var oInterventiDateModel = this.getView().byId("idTableInterventi").getModel("RepintInterventiModel");
			var indexInterventi = oEvent.getSource().getParent().getParent().indexOfItem(oEvent.getSource().getParent());

			this.resetInterventiValues(this.getView().byId("idTableInterventi"), oInterventiDateModel, indexInterventi);

			var Dtflag = false;
			for (var j = 0; j < oRepDateModel.getData().length; ++j) {
				if (oEvent.getParameter("newValue") === oRepDateModel.getData()[j].DATAREPERIBILITA) {
					Dtflag = true;

					if (oRepDateModel.getData()[j].Fer === true) {
						oInterventiDateModel.getData()[indexInterventi].WORKINGDAY = true;
						oInterventiDateModel.getData()[indexInterventi].NONWORKINGDAY = false;
					} else { // SATURDAY, SUNDAY or HOLIDAY // if(oRepDateModel.getData()[j].Sab === true || oRepDateModel.getData()[j].Dom === true){
						oInterventiDateModel.getData()[indexInterventi].WORKINGDAY = false;
						oInterventiDateModel.getData()[indexInterventi].NONWORKINGDAY = true;
					}
				}
			}

			if ((!Dtflag) && oInterventiDateModel.getData()[indexInterventi].FLAGNOTTURNO !== true) {
				oEvent.getSource().setDateValue(null);
				this.resetInterventiValues(this.getView().byId("idTableInterventi"), oInterventiDateModel, indexInterventi);
				this.getView().byId("idTableInterventi").getItems()[indexInterventi].getCells()[2].setValueState(sap.ui.core.ValueState.Error);
				MessageBox.error("Per l'intervento inserire una data presente in Reperibilità");
				return;
			}

			if (Dtflag && oInterventiDateModel.getData()[indexInterventi].FLAGNOTTURNO === true) {
				oEvent.getSource().setDateValue(null);
				this.resetInterventiValues(this.getView().byId("idTableInterventi"), oInterventiDateModel, indexInterventi);
				this.getView().byId("idTableInterventi").getItems()[indexInterventi].getCells()[2].setValueState(sap.ui.core.ValueState.Error);
				MessageBox.error("La data di Intervento selezionata non deve essere uguale a nessuna data di ripetibilità inserita");
				return;
			}

			// If LPN is checked user can select any date for Anno/Messe month. Here need to identify whether it is Working day or NONWORKINGDAY (Sat, Sunday or Holiday)
			if (oInterventiDateModel.getData()[indexInterventi].FLAGNOTTURNO === true) {
				oInterventiDateModel.getData()[indexInterventi].RIPOSI = null;
				this.getLSFForInterventiLPN(oEvent, "", "");
			}

			this.filterRiposiSet(this.getView().byId("idTableInterventi"), oRepDateModel, oInterventiDateModel, indexInterventi, false);

		},

		resetCHECKOKvalue: function (oSortedInterventiDateData) {
			for (var i = 0; i < oSortedInterventiDateData.length; ++i) {
				oSortedInterventiDateData[i].CHECKOK = "N";
			}
		},

		filterRiposiSet: function (oInterventiTable, oRepDateModel, oInterventiDateModel, indexInterventi, onChiamatodaChange) {

			var that = this;
			var oRiposiWorkingDay;
			var oRiposiNonWorkingDay;
			var oRiposiModelData = that.getView().getModel("RiposiModel").getData();
			var oSortedInterventiDateData;

			var validReposi = [];
			var validReposidata = {};

			var validOraInizioFine = true;
			var oSortedInterventiDateDataModel = new sap.ui.model.json.JSONModel();
			oSortedInterventiDateData = that.sortInterventiDateData(oInterventiDateModel);
			oSortedInterventiDateDataModel.setData(oSortedInterventiDateData);
			oInterventiTable.setModel(oSortedInterventiDateDataModel, "RepintInterventiModel");

			// Check if any of the Interventi date is blank/null/undefined
			for (var checknull = 0; checknull < oSortedInterventiDateData.length; ++checknull) {
				if ((oSortedInterventiDateData[checknull].DATAINTERVENTO === null) || (oSortedInterventiDateData[checknull].DATAINTERVENTO ===
						"") ||
					(oSortedInterventiDateData[checknull].DATAINTERVENTO === undefined)) {
					oInterventiTable.getItems()[checknull].getCells()[2].setValueState(sap.ui.core.ValueState.Error);
					validOraInizioFine = false;
					// Below condition added on 7th Dec 2020
					// On selection of Chaimatoda dropdown value initially if 'Interventi' date is not selected (blank) application use to show error message to user to that 'Interventi' date cannot be blank
					// But now the change is - Not to show error message on selection of Chaimatoda dropdown value
					// For any other field validation need to show message as usual
					// So passing 'true' while calling filterRiposiSet() on selection of 'Chiamatoda' dropdown value - onChiamatodaChange() else passing 'false'					
					if (!(onChiamatodaChange)) {
						MessageBox.error("Nella sezione Interventi valorizzata il campo data");
					}

					return;
				} else {
					oInterventiTable.getItems()[checknull].getCells()[2].setValueState(sap.ui.core.ValueState.None);
				}
				if ((oSortedInterventiDateData[checknull].ORAFINE === null) || (oSortedInterventiDateData[checknull].ORAFINE === "") ||
					(
						oSortedInterventiDateData[checknull].ORAFINE === undefined)) {
					// Below line of code Commented on 29th Dec
					/////oInterventiTable.getItems()[checknull].getCells()[3].setValueState(sap.ui.core.ValueState.Error);
					validOraInizioFine = false;
					// Commented on 24th Nov
					////MessageBox.error("Il campo Ora Inizio deve essere valorizzato");
					return;
				} else {
					oInterventiTable.getItems()[checknull].getCells()[3].setValueState(sap.ui.core.ValueState.None);
				}
				if ((oSortedInterventiDateData[checknull].ORAFINE === null) || (oSortedInterventiDateData[checknull].ORAFINE === "") ||
					(
						oSortedInterventiDateData[checknull].ORAFINE === undefined)) {
					// Below line of code Commented on 29th Dec
					////oInterventiTable.getItems()[checknull].getCells()[4].setValueState(sap.ui.core.ValueState.Error);
					validOraInizioFine = false;
					MessageBox.error("Il campo \"Ora Fine\" non può essere lasciato vuoto");
					return;
				} else {
					oInterventiTable.getItems()[checknull].getCells()[4].setValueState(sap.ui.core.ValueState.None);
				}

				if (oSortedInterventiDateData[checknull].ORAINIZIOTIMESTAMP === "" || oSortedInterventiDateData[checknull].ORAINIZIOTIMESTAMP ===
					undefined || oSortedInterventiDateData[checknull].ORAINIZIOTIMESTAMP === null) {
					oInterventiTable.getItems()[checknull].getCells()[3].setValueState(sap.ui.core.ValueState.Error);
					oInterventiTable.getItems()[checknull].getCells()[4].setValueState(sap.ui.core.ValueState.Error);
					//MessageBox.warning("For Interventi Date " + oSortedInterventiDateData[k].DATAINTERVENTO + " Ora Inizio and Ora Fine value cannot be blank");
					validOraInizioFine = false;
					return;
				} else {
					oInterventiTable.getItems()[checknull].getCells()[3].setValueState(sap.ui.core.ValueState.None);
					oInterventiTable.getItems()[checknull].getCells()[4].setValueState(sap.ui.core.ValueState.None);
				}

				if (oSortedInterventiDateData[checknull].ORAFINETIMESTAMP === "" || oSortedInterventiDateData[checknull].ORAFINETIMESTAMP ===
					undefined ||
					oSortedInterventiDateData[checknull].ORAFINETIMESTAMP === null) {
					oInterventiTable.getItems()[checknull].getCells()[3].setValueState(sap.ui.core.ValueState.Error);
					oInterventiTable.getItems()[checknull].getCells()[4].setValueState(sap.ui.core.ValueState.Error);
					//MessageBox.warning("For Interventi Date " + oSortedInterventiDateData.getData()[k].DATAINTERVENTO + " Ora Fine and Ora Fine value cannot be blank");
					validOraInizioFine = false;
					return;
				} else {
					oInterventiTable.getItems()[checknull].getCells()[3].setValueState(sap.ui.core.ValueState.None);
					oInterventiTable.getItems()[checknull].getCells()[4].setValueState(sap.ui.core.ValueState.None);
				}

			}

			if (validOraInizioFine) {

				//oSortedInterventiDateData = that.sortInterventiDateData(oInterventiDateModel);
				///oSortedInterventiDateData = oInterventiDateModel; // KAPIL
				console.log("SORTED DATA" + oSortedInterventiDateData);

				that.resetCHECKOKvalue(oSortedInterventiDateData);

				if (that.getOwnerComponent().getModel("viewProperties").getProperty("/oRiposiWorkingDay") === undefined) {
					oRiposiWorkingDay = jQuery.grep(oRiposiModelData, function (a) {
						return (a.GIORNI == 1);
					});

					that.getOwnerComponent().getModel("viewProperties").setProperty("/oRiposiWorkingDay", oRiposiWorkingDay);
				} else {
					oRiposiWorkingDay = that.getOwnerComponent().getModel("viewProperties").getProperty("/oRiposiWorkingDay");
				}

				if (that.getOwnerComponent().getModel("viewProperties").getProperty("/oRiposiNonWorkingDay") === undefined) {
					oRiposiNonWorkingDay = jQuery.grep(oRiposiModelData, function (a) {
						return (a.GIORNI == 5); // Return for GIORNI = 5
					});
					that.getOwnerComponent().getModel("viewProperties").setProperty("/oRiposiNonWorkingDay", oRiposiNonWorkingDay);
				} else {
					oRiposiNonWorkingDay = that.getOwnerComponent().getModel("viewProperties").getProperty("/oRiposiNonWorkingDay");
				}

				var oInterventiCurrentDayDate;
				var oInterventiOraInizioTimestamp;
				var oInterventiOraFineTimestamp;
				var oFascioInizioCurrentDayDate;
				var oFascoInizioCurrentDayTimestamp;
				var oFascioFineNextDayDate;
				var oFascioFineNextDayDayTimestamp;
				var oFascioFineSameDayTimestamp;
				var oFascioFineSameDayDate;
				var res;

				for (var i = 0; i < oSortedInterventiDateData.length; ++i) {

					// CHECK
					// Reset RIP, CONTINTERVENTO and RIPOSI value for performing check and set the value if condition is true (e.g RIP checkbox is checked/unchecked)
					// oSortedInterventiDateData[i].FLAGCONT = false;
					// oSortedInterventiDateData[i].CONTINTERVENTO = 0;
					// oSortedInterventiDateData[i].RIPOSI = "";

					if (oSortedInterventiDateData[i].WORKINGDAY) { // Return for GIORNI = 1

						oInterventiOraInizioTimestamp = oSortedInterventiDateData[i].ORAINIZIOTIMESTAMP;
						oInterventiOraFineTimestamp = oSortedInterventiDateData[i].ORAFINETIMESTAMP;

						//	for (var j = 0; j < oRiposiWorkingDay.length; ++j) {

						// // Check whether minute difference of Ora Inizio and Ora Fine is between DURATA_MIN & DURATA_MAX
						// if ((oRiposiWorkingDay[j].DURATA_MIN < oSortedInterventiDateData[i].MINDIFFORAINIFINE) && (oSortedInterventiDateData[
						// 		i].MINDIFFORAINIFINE <= oRiposiWorkingDay[j].DURATA_MAX)) {

						oInterventiCurrentDayDate = new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[i].DATAINTERVENTO));
						oFascioFineNextDayDate = new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[i].DATAINTERVENTO));

						oFascioInizioCurrentDayDate = new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[i].DATAINTERVENTO)); // Fascio Inizio current day
						oFascioFineNextDayDate.setDate(oFascioInizioCurrentDayDate.getDate() + 1); // Fascia Fine next day

						// Using oRiposiWorkingDay[0] below as for GIORNI = 1, value of FASCIA_INIZIO=10:00:00 PM and FASCIA_FINE=08:30:00 AM is same
						oFascoInizioCurrentDayTimestamp = new Date(oFascioInizioCurrentDayDate.getFullYear(), oFascioInizioCurrentDayDate.getMonth(),
							oFascioInizioCurrentDayDate.getDate(), (oRiposiWorkingDay[0].FASCIA_INIZIO).split(":")[0], (oRiposiWorkingDay[0].FASCIA_INIZIO)
							.split(":")[1], "00");
						oFascioFineNextDayDayTimestamp = new Date(oFascioFineNextDayDate.getFullYear(), oFascioFineNextDayDate.getMonth(),
							oFascioFineNextDayDate.getDate(), (oRiposiWorkingDay[0].FASCIA_FINE).split(":")[0], (oRiposiWorkingDay[0].FASCIA_FINE).split(
								":")[1], "00");

						// Check if Ora Inizio and Ora Fine value is range between FASCIO_INIZIO and FASCIO_FINE value - CHECK OK for Working Day
						if ((oInterventiOraInizioTimestamp >= oFascoInizioCurrentDayTimestamp && oInterventiOraInizioTimestamp <=
								oFascioFineNextDayDayTimestamp) && oInterventiOraFineTimestamp >= oFascoInizioCurrentDayTimestamp &&
							oInterventiOraFineTimestamp <= oFascioFineNextDayDayTimestamp) {

							oSortedInterventiDateData[i].CHECKOK = "Y";

						} else { // Partial Check OK - e.g. 17:30 < 10:00 PM && ( 01:30 >= 10:00 && 01:30 <= 08:30 AM) - Valid time = 10:00 PM to 01:30 AM = 220 mins
							if (oInterventiOraInizioTimestamp < oFascoInizioCurrentDayTimestamp && (oInterventiOraFineTimestamp >
									oFascoInizioCurrentDayTimestamp && oInterventiOraFineTimestamp <= oFascioFineNextDayDayTimestamp)) {
								oSortedInterventiDateData[i].CHECKOK = "Y";

								res = Math.abs(oInterventiOraFineTimestamp - oFascoInizioCurrentDayTimestamp) / 1000;
								oSortedInterventiDateData[i].MINDIFFORAINIFINE = Math.floor(res / 60); // Partial minutes set for difference between Ora Inizio and Ora Fine

							}
							// Below condition is never going to happen. e.g. (21:30 >= 10:00 PM && 21:30 <= 08:30 AM) && 09:00 > 08:30
							// (oInterventiOraInizioTimestamp >= oFascoInizioCurrentDayTimestamp && oInterventiOraInizioTimestamp <= oFascioFineNextDayDayTimestamp) 
							// && oInterventiOraFineTimestamp > oFascioFineNextDayDayTimestamp )
							else {
								// CHECK not OK
								oSortedInterventiDateData[i].CHECKOK = "N";
							}
						}

					} else { // Return for GIORNI = 5

						oSortedInterventiDateData[i].CHECKOK = "Y";
					}
				}
				console.log("REPOSI");
				console.log(oSortedInterventiDateData);
				this.calculateCompensativi(oSortedInterventiDateData, onChiamatodaChange);
			}

		},

		sortInterventiDateData: function (oInterventiDateModel) {
			var oSortedInterventiDateData = oInterventiDateModel.getData().sort(function (a, b) {

				if ((a.DATAINTERVENTO !== "") && (b.DATAINTERVENTO !== "")) {
					if (a.DATAINTERVENTO < b.DATAINTERVENTO) //sort Interventi Date ascending
						return -1;
					if (a.DATAINTERVENTO > b.DATAINTERVENTO)
						return 1;
					return 0; //default return value (no sorting)					
				}

			});

			return oSortedInterventiDateData;
		},

		// Below functionsortInterventiDataForOraInzio() added on 30th Jan to fix bug 
		// Inserting two INTERVENTI in order to create a RIP case, the RIP box was not flagged. The rows for these two interventi were not placed in sequence.
		// This logic does the sorting of combination of "Interventi Date" and "Ora Inzio" value
		sortInterventiDataForOraInzio: function (oInterventiDateModel) {
			var oSortedInterventiDateData = oInterventiDateModel.getData().sort(function (a, b) {

				if ((a.ORAINIZIOTIMESTAMP !== "") && (b.ORAINIZIOTIMESTAMP !== "")) {
					if (a.ORAINIZIOTIMESTAMP < b.ORAINIZIOTIMESTAMP) //sort Interventi Ora Inzio ascending
						return -1;
					if (a.ORAINIZIOTIMESTAMP > b.ORAINIZIOTIMESTAMP)
						return 1;
					return 0; //default return value (no sorting)					
				}

			});

			return oSortedInterventiDateData;
		},

		sortReperibilitaDateData: function (oReperibilitaDateModel) {
			var oSortedReperibilitaDateData = oReperibilitaDateModel.getData().sort(function (a, b) {

				if ((a.DATAREPERIBILITA !== "") && (b.DATAREPERIBILITA !== "")) {
					if (a.DATAREPERIBILITA < b.DATAREPERIBILITA) //sort Reperibilita Date ascending
						return -1;
					if (a.DATAREPERIBILITA > b.DATAREPERIBILITA)
						return 1;
					return 0 //default return value (no sorting)					
				}
			});
			return oSortedReperibilitaDateData;
		},

		resetRiposi: function (oSortedInterventiDateData) {
			for (var i = 0; i < oSortedInterventiDateData.length; ++i) {
				oSortedInterventiDateData[i].RIPOSI = "";
			}
		},

		// KAPIL - ******************** Below code commented before implementing RIPOSI changes
		// calculateCompensativi: function (oSortedInterventiDateData) {

		// 	var that = this;
		// 	var riposiflag = false;
		// 	var oInterventiOraInizioTimestamp;
		// 	var oInterventiOraFineTimestamp;
		// 	var oInterventiCurrentDayDate;
		// 	var oFascioInizioCurrentDayDate;
		// 	var oFascioFineSameDayDate;
		// 	var oFascoInizioCurrentDayTimestamp;
		// 	var oFascioFineSameDayTimestamp;

		// 	that.resetRiposi(oSortedInterventiDateData);

		// 	var oRiposiWorkingDay = that.getOwnerComponent().getModel("viewProperties").getProperty("/oRiposiWorkingDay");
		// 	var oRiposiNonWorkingDay = that.getOwnerComponent().getModel("viewProperties").getProperty("/oRiposiNonWorkingDay");
		// 	var oRegoleCompensativi = that.getView().getModel("RegoleCompensativi").getData();

		// 	var uniqueinterventDates = $.unique(oSortedInterventiDateData.map(function (value) {
		// 		return value.DATAINTERVENTO;
		// 	})); // Get Unique Interventi Dates

		// 	var sumOraIniFineMinsDIffSameIntervtDt = 0;
		// 	var checkOKCountDatewise = 0;
		// 	var multi = 0;
		// 	uniqueinterventDates.map(function (interventDate) {
		// 		sumOraIniFineMinsDIffSameIntervtDt = 0;
		// 		checkOKCountDatewise = 0;

		// 		var riposiArray = [];
		// 		var riposiJsonData = {};
		// 		var multiJsonData = {};
		// 		$.each(oSortedInterventiDateData, function (index, value) {
		// 			if ((value.DATAINTERVENTO).toString() === interventDate.toString() && (value.CHECKOK) === "Y" && (!(value.FLAGCONT))) { // RIP checkbox should not be checked as checked record Interventi date gets counted into previous date for "Multi" count increment by 1 (checkOKCountDatewise++)
		// 				sumOraIniFineMinsDIffSameIntervtDt = sumOraIniFineMinsDIffSameIntervtDt + value.MINDIFFORAINIFINE;
		// 				checkOKCountDatewise = checkOKCountDatewise + 1;
		// 			}
		// 		});

		// 		for (var c = 0; c < oRegoleCompensativi.length; c++) {
		// 			if (checkOKCountDatewise >= oRegoleCompensativi[0].N_INTERVENTI) {
		// 				multi = oRegoleCompensativi[0].VALORE;
		// 			}
		// 		}

		// 		for (var i = 0; i < oSortedInterventiDateData.length; ++i) {

		// 			///if (oSortedInterventiDateData[i].DATAINTERVENTO === interventDate) { // Need to execute loop every time for given Interventi Date in order to get Riposi value for given Interventi Date
		// 			if (oSortedInterventiDateData[i].DATAINTERVENTO === interventDate) { // Need to execute loop every time for given Interventi Date in order to get Riposi value for given Interventi Date								 						
		// 				//if (oSortedInterventiDateData[i].DATAINTERVENTO === interventDate.toString()) { // Need to execute loop every time for given Interventi Date in order to get Riposi value for given Interventi Date								 	

		// 				if (oSortedInterventiDateData[i].WORKINGDAY) { // Return for GIORNI = 1

		// 					// oInterventiOraInizioTimestamp = oSortedInterventiDateData[i].ORAINIZIOTIMESTAMP;
		// 					// oInterventiOraFineTimestamp = oSortedInterventiDateData[i].ORAFINETIMESTAMP;
		// 					//oSortedInterventiDateData[i].RIPOSI = oRiposiWorkingDay[j].VALORE * 8;

		// 					for (var j = 0; j < oRiposiWorkingDay.length; ++j) {

		// 						// Check whether minute difference of Ora Inizio and Ora Fine is between DURATA_MIN & DURATA_MAX
		// 						//if (oRiposiWorkingDay[j].DURATA_MIN < oSortedInterventiDateData[i].MINDIFFORAINIFINE <= oRiposiWorkingDay[j].DURATA_MAX) {
		// 						if ((oRiposiWorkingDay[j].DURATA_MIN < sumOraIniFineMinsDIffSameIntervtDt && (sumOraIniFineMinsDIffSameIntervtDt <=
		// 								oRiposiWorkingDay[j].DURATA_MAX))) {

		// 							//oSortedInterventiDateData[i].RIPOSI = oRiposiWorkingDay[j].VALORE * 8;
		// 							if (checkOKCountDatewise < 3) {
		// 								riposiJsonData = {
		// 									"InterventiDate": interventDate,
		// 									"RiposiValue": (oRiposiWorkingDay[j].VALORE * 8).toString() + "H",
		// 									"multi": "(" + 0 + " Multi)"
		// 										//"multi": "(" + multi.toString() + " Multi)"
		// 								};
		// 							} else {
		// 								riposiJsonData = {
		// 									"InterventiDate": interventDate,
		// 									"RiposiValue": (oRiposiWorkingDay[j].VALORE * 8).toString() + "H",
		// 									"multi": "(" + multi.toString() + " Multi)"
		// 								};
		// 							}

		// 							riposiArray.push(riposiJsonData);
		// 							riposiJsonData = {};

		// 							riposiflag = true;
		// 							break;
		// 						}

		// 					}

		// 					if (!riposiflag) {
		// 						if (checkOKCountDatewise >= 3) {
		// 							multiJsonData = {
		// 								"InterventiDate": interventDate,
		// 								"RiposiValue": "0 H",
		// 								"multi": "(" + multi.toString() + " Multi)"
		// 							};

		// 							riposiArray.push(riposiJsonData);
		// 							riposiJsonData = {};
		// 						} else {
		// 							multiJsonData = {
		// 								"InterventiDate": interventDate,
		// 								"RiposiValue": "0 H",
		// 								"multi": "(" + 0 + " Multi)"
		// 							};

		// 							riposiArray.push(multiJsonData);
		// 							multiJsonData = {};
		// 						}
		// 					}

		// 				} else { // Return for GIORNI = 5

		// 					for (var j = 0; j < oRiposiNonWorkingDay.length; ++j) {

		// 						// Overlapping Range
		// 						// 240 - 480 
		// 						// 240 - 1440 
		// 						if ((oRiposiNonWorkingDay[j].DURATA_MIN === 240 && oRiposiNonWorkingDay[j].DURATA_MAX === 480) && (oRiposiNonWorkingDay[j].DURATA_MIN <
		// 								sumOraIniFineMinsDIffSameIntervtDt && (sumOraIniFineMinsDIffSameIntervtDt <= oRiposiNonWorkingDay[j].DURATA_MAX))) {

		// 							oInterventiOraInizioTimestamp = oSortedInterventiDateData[i].ORAINIZIOTIMESTAMP;
		// 							oInterventiOraFineTimestamp = oSortedInterventiDateData[i].ORAFINETIMESTAMP;

		// 							oInterventiCurrentDayDate = new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[i].DATAINTERVENTO));
		// 							//oFascioFineNextDayDate = new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[i].DATAINTERVENTO));

		// 							oFascioInizioCurrentDayDate = new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[i].DATAINTERVENTO)); // Fascio Inizio current day
		// 							oFascioFineSameDayDate = new Date(oInterventiCurrentDayDate); // Fascio Fine current day

		// 							//oFascioFineNextDayDate.setDate(oFascioInizioCurrentDayDate.getDate() + 1); // Fascia Fine next day

		// 							oFascoInizioCurrentDayTimestamp = new Date(oFascioInizioCurrentDayDate.getFullYear(), oFascioInizioCurrentDayDate.getMonth(),
		// 								oFascioInizioCurrentDayDate.getDate(), (oRiposiNonWorkingDay[j].FASCIA_INIZIO).split(":")[0], (oRiposiNonWorkingDay[j].FASCIA_INIZIO)
		// 								.split(":")[1], "00");

		// 							// oFascioFineNextDayDayTimestamp = new Date(oFascioFineNextDayDate.getFullYear(), oFascioFineNextDayDate.getMonth(),
		// 							// 	oFascioFineNextDayDate.getDate(), (oRiposiNonWorkingDay[j].FASCIA_FINE).split(":")[0], (oRiposiNonWorkingDay[j].FASCIA_FINE)
		// 							// 	.split(
		// 							// 		":")[1], "00");

		// 							// oFascioFineSameDayTimestamp = new Date(oFascioFineSameDayDate.getFullYear(), oFascioFineSameDayDate.getMonth(),
		// 							// 	oFascioFineSameDayDate.getDate(), (oRiposiNonWorkingDay[j].FASCIA_FINE).split(":")[0], (oRiposiNonWorkingDay[j].FASCIA_FINE)
		// 							// 	.split(
		// 							// 		":")[1], "00");

		// 							// Check if Ora Inizio and Ora Fine Timestamp is between 08:30 AM (FASCIO_INIZIO of IDREGOLA = 10) - 10:00 PM (FASCIO_FINE of IDREGOLA = 14). NOTE - Here we are not considering FASCIO_FINE(11:00 PM) of IDREGOLA = 10 
		// 							oFascioFineSameDayTimestamp = new Date(oFascioFineSameDayDate.getFullYear(), oFascioFineSameDayDate.getMonth(),
		// 								oFascioFineSameDayDate.getDate(), "22", "00", "00");

		// 							// Check if Ora Inizio and Ora Fine value is range between FASCIO_INIZIO and FASCIO_FINE value for same day 
		// 							// It mean to consider IDREGOLA = 10 and not IDREGOLA = 14 if below condition is true
		// 							if ((oInterventiOraInizioTimestamp > oFascoInizioCurrentDayTimestamp && oInterventiOraInizioTimestamp <=
		// 									oFascioFineSameDayTimestamp) && oInterventiOraFineTimestamp > oFascoInizioCurrentDayTimestamp &&
		// 								oInterventiOraFineTimestamp <= oFascioFineSameDayTimestamp) {

		// 								if (checkOKCountDatewise < 3) {
		// 									riposiJsonData = {
		// 										"InterventiDate": interventDate,
		// 										"RiposiValue": "0.5".toString() + "H", // IDREGOLA = 10 (Rule no. 10). VALORE = 0.5
		// 										"multi": "(" + 0 + " Multi)"
		// 									};
		// 								} else {
		// 									riposiJsonData = {
		// 										"InterventiDate": interventDate,
		// 										"RiposiValue": "0.5".toString() + "H",
		// 										"multi": "(" + multi.toString() + " Multi)"
		// 									};
		// 								}
		// 							} else { // If Ora Inizio Timestamp is > 08:30 AM & Ora Fine Timestamp is > 10:00 PM. In all other cases VALORE = 1, IDREGOLA = 14
		// 								if (checkOKCountDatewise < 3) {
		// 									riposiJsonData = {
		// 										"InterventiDate": interventDate,
		// 										"RiposiValue": "8".toString() + "H",
		// 										"multi": "(" + 0 + " Multi)"
		// 									};
		// 								} else {
		// 									riposiJsonData = {
		// 										"InterventiDate": interventDate,
		// 										"RiposiValue": "8".toString() + "H",
		// 										"multi": "(" + multi.toString() + " Multi)"
		// 									};
		// 								}
		// 							}

		// 							riposiArray.push(riposiJsonData);
		// 							riposiJsonData = {};

		// 							riposiflag = true;
		// 							break;

		// 						} else {
		// 							if ((oRiposiNonWorkingDay[j].DURATA_MIN < sumOraIniFineMinsDIffSameIntervtDt && (sumOraIniFineMinsDIffSameIntervtDt <=
		// 									oRiposiNonWorkingDay[j].DURATA_MAX))) {

		// 								if (checkOKCountDatewise < 3) {
		// 									riposiJsonData = {
		// 										"InterventiDate": interventDate,
		// 										"RiposiValue": (oRiposiNonWorkingDay[j].VALORE * 8).toString() + "H",
		// 										"multi": "(" + 0 + " Multi)"
		// 									};
		// 								} else {
		// 									riposiJsonData = {
		// 										"InterventiDate": interventDate,
		// 										"RiposiValue": (oRiposiNonWorkingDay[j].VALORE * 8).toString() + "H",
		// 										"multi": "(" + multi.toString() + " Multi)"
		// 									};
		// 								}

		// 								riposiArray.push(riposiJsonData);
		// 								riposiJsonData = {};

		// 								riposiflag = true;
		// 								break;
		// 							}
		// 						}
		// 					}

		// 					if (!riposiflag) {
		// 						if (checkOKCountDatewise >= 3) {
		// 							multiJsonData = {
		// 								"InterventiDate": interventDate,
		// 								"RiposiValue": "0 H",
		// 								"multi": "(" + multi.toString() + " Multi)"
		// 							};
		// 						} else {
		// 							multiJsonData = {
		// 								"InterventiDate": interventDate,
		// 								"RiposiValue": "0 H",
		// 								"multi": "(" + 0 + " Multi)"
		// 							};
		// 						}

		// 						riposiArray.push(multiJsonData);
		// 						multiJsonData = {};
		// 					}
		// 				}
		// 			}
		// 		} // End of for loop

		// 		var uniqueInterventiDateRiposi = that.unique(riposiArray);
		// 		var oInterventiDateModel = that.getView().byId("idTableInterventi").getModel("RepintInterventiModel");

		// 		// KAPIL - Please check below code. Commented to fix riposi issue as on 5th Aug
		// 		// for (var index = 0; index < oSortedInterventiDateData.length; ++index) {
		// 		// 	for (var indexDt = 0; indexDt < uniqueInterventiDateRiposi.length; ++indexDt) {
		// 		// 		if (oSortedInterventiDateData[index].DATAINTERVENTO === uniqueInterventiDateRiposi[indexDt].InterventiDate) {
		// 		// 			oInterventiDateModel.getData()[index].RIPOSI = uniqueInterventiDateRiposi[indexDt].RiposiValue + " " +
		// 		// 				uniqueInterventiDateRiposi[indexDt].multi; // Always first index for new Interventi date
		// 		// 			//oSortedInterventiDateData[index].RIPOSI = uniqueInterventiDateRiposi[indexDt].RiposiValue; // Always first index for new Interventi date
		// 		// 			uniqueInterventiDateRiposi.splice(0, 1);
		// 		// 			break;
		// 		// 		}
		// 		// 	}
		// 		// }

		// 		for (var index = 0; index < oSortedInterventiDateData.length; ++index) {
		// 			for (var indexDt = 0; indexDt < uniqueInterventiDateRiposi.length; ++indexDt) {
		// 				if (oSortedInterventiDateData[index].DATAINTERVENTO === uniqueInterventiDateRiposi[indexDt].InterventiDate) {
		// 					for (var k = indexDt; k < uniqueInterventiDateRiposi.length; ++k) {
		// 						// Always first index for new Interventi date
		// 						oInterventiDateModel.getData()[index].RIPOSI = oInterventiDateModel.getData()[index].RIPOSI +
		// 							uniqueInterventiDateRiposi[k].RiposiValue + " " + uniqueInterventiDateRiposi[k].multi;
		// 						uniqueInterventiDateRiposi.splice(0, 1);
		// 					}
		// 					//break;
		// 					///indexInter = indexDt + 1; 
		// 				}
		// 			}
		// 			break;
		// 		}

		// 		that.getView().byId("idTableInterventi").getModel("RepintInterventiModel").updateBindings(true);

		// 		that.checkForRIP(that.getView().byId("idTableInterventi").getModel("RepintInterventiModel"));

		// 	});

		// },

		// ***************************************************************************************************************************8

		// KAPIL - new logic implemented below 
		calculateCompensativi: function (oSortedInterventiDateData, onChiamatodaChange) {

			var that = this;
			var riposiflag = false;
			var oInterventiOraInizioTimestamp;
			var oInterventiOraFineTimestamp;
			var oInterventiCurrentDayDate;
			var oFascioInizioNextDayDate;
			var oFascioFineoNextDayDate;
			var oFascioFineNextDayTimestamp;
			var oFascioInizioCurrentDayDate;
			var oFascioFineSameDayDate;
			var oFascoInizioCurrentDayTimestamp;
			var oFascioFineSameDayTimestamp;
			var totRiposiValue = 0;
			var riposi = 0;
			var workingDayFlag = false;
			var nonWorkingDayFlag = false;
			var oMultiCurrentDayDate;
			var oMultiNextDayDate;
			// On 26th Nov - Below variabes declared for "Multi" value calculation
			var oFascioInizioMultiCurrentDayDate;
			var oFascioFineoMultiNextDayDate;
			var oFascoInizioMultiCurrentDayTimestamp;
			var oFascioFineMultiNextDayTimestamp;

			that.resetRiposi(oSortedInterventiDateData);

			var oRiposiWorkingDay = that.getOwnerComponent().getModel("viewProperties").getProperty("/oRiposiWorkingDay");
			var oRiposiNonWorkingDay = that.getOwnerComponent().getModel("viewProperties").getProperty("/oRiposiNonWorkingDay");
			var oRegoleCompensativi = that.getView().getModel("RegoleCompensativi").getData();

			var uniqueinterventDates = $.unique(oSortedInterventiDateData.map(function (value) {
				return value.DATAINTERVENTO;
			})); // Get Unique Interventi Dates

			var sumOraIniFineMinsDIffSameIntervtDt = 0;
			var sumOraIniFineMinsDIffSameIntervtDtNonWorkDayfirstSlot = 0;
			var sumOraIniFineMinsDIffSameIntervtDtNonWorkDaysecSlot = 0;
			var checkOKCountDatewise = 0;
			var multi = 0;
			uniqueinterventDates.map(function (interventDate) {
				sumOraIniFineMinsDIffSameIntervtDt = 0;
				sumOraIniFineMinsDIffSameIntervtDtNonWorkDayfirstSlot = 0;
				sumOraIniFineMinsDIffSameIntervtDtNonWorkDaysecSlot = 0;
				workingDayFlag = false;
				nonWorkingDayFlag = false;

				checkOKCountDatewise = 0;

				var riposiArray = [];
				var riposiJsonData = {};
				var multiJsonData = {};

				$.each(oSortedInterventiDateData, function (index, value) {
					if ((value.DATAINTERVENTO).toString() === interventDate.toString() && (value.CHECKOK) === "Y" && (!(value.FLAGCONT))) { // RIP checkbox should not be checked as checked record Interventi date gets counted into previous date for "Multi" count increment by 1 (checkOKCountDatewise++)
						/////////sumOraIniFineMinsDIffSameIntervtDt = sumOraIniFineMinsDIffSameIntervtDt + value.MINDIFFORAINIFINE;

						// New logic added on 5th Oct 2020 - Multi Calculation 
						// One new condtion added - To check whether Next Interventi Date is Holiday or Working Day. If Holiday then consider increment of checkOKCountDatewise
						// else ignore increment of checkOKCountDatewise.

						// First get next Interventi Date
						oMultiCurrentDayDate = new Date(Formatter.formatDateToMMDDYYYY(value.DATAINTERVENTO));
						oMultiNextDayDate = new Date(Formatter.formatDateToMMDDYYYY(value.DATAINTERVENTO));
						oMultiNextDayDate.setDate(oMultiCurrentDayDate.getDate() + 1);

						that.getLSFForMultiCalc(Formatter.formatDateMulti(oMultiNextDayDate));
						if (!that.LSFHolidayFlag) {

							// Below line of code commented on 26th Nov to implement 'Multi' calculation condition (as below)
							////checkOKCountDatewise = checkOKCountDatewise + 1;

							// Below logic added on 26th Nov 2020 - Multi Calculation
							// Ora Inizio nd Ora fine to check if falls under - FASCIO_INIZIO (23:00 - same day)  and FASCIO_FINE (08:30 - next day)
							oInterventiOraInizioTimestamp = value.ORAINIZIOTIMESTAMP;
							oInterventiOraFineTimestamp = value.ORAFINETIMESTAMP;
							//oInterventiCurrentDayDate = new Date(Formatter.formatDateToMMDDYYYY(value.DATAINTERVENTO));

							oFascioInizioMultiCurrentDayDate = new Date(Formatter.formatDateToMMDDYYYY(value.DATAINTERVENTO)); // MULTI - Fascio Inizio current day
							oFascioFineoMultiNextDayDate = new Date(Formatter.formatDateToMMDDYYYY(value.DATAINTERVENTO));
							oFascioFineoMultiNextDayDate.setDate(oMultiCurrentDayDate.getDate() + 1); // MULTI - Fascio Fine Next day

							// MULTI - Fascio Inizio Current Day Timestamp
							oFascoInizioMultiCurrentDayTimestamp = new Date(oFascioInizioMultiCurrentDayDate.getFullYear(),
								oFascioInizioMultiCurrentDayDate.getMonth(),
								oFascioInizioMultiCurrentDayDate.getDate(), "23", "00", "00");

							// MULTI - Fascio Fine Next Day Timestamp
							oFascioFineMultiNextDayTimestamp = new Date(oFascioFineoMultiNextDayDate.getFullYear(), oFascioFineoMultiNextDayDate.getMonth(),
								oFascioFineoMultiNextDayDate.getDate(), "08", "30", "00");

							// MULTI -Check if Ora Inizio and Ora Fine value is range between FASCIO_INIZIO ( 23:00 for same day) and FASCIO_FINE (08:30 for Next Day) 
							// If so then increment checkOKCountDatewise
							if ((oInterventiOraInizioTimestamp >= oFascoInizioMultiCurrentDayTimestamp && oInterventiOraInizioTimestamp <=
									oFascioFineMultiNextDayTimestamp) && oInterventiOraFineTimestamp >= oFascoInizioMultiCurrentDayTimestamp &&
								oInterventiOraFineTimestamp <= oFascioFineMultiNextDayTimestamp) {

								checkOKCountDatewise = checkOKCountDatewise + 1;
							}
						}
					}
				});

				for (var c = 0; c < oRegoleCompensativi.length; c++) {
					if (checkOKCountDatewise >= oRegoleCompensativi[0].N_INTERVENTI) {
						multi = oRegoleCompensativi[0].VALORE;
					}
				}

				// var workingDayFlag = false;
				// var nonWorkingDayFlag = false;
				for (var i = 0; i < oSortedInterventiDateData.length; ++i) {
					///if (oSortedInterventiDateData[i].DATAINTERVENTO === interventDate) { // Need to execute loop every time for given Interventi Date in order to get Riposi value for given Interventi Date
					if (oSortedInterventiDateData[i].DATAINTERVENTO === interventDate) { // Need to execute loop every time for given Interventi Date in order to get Riposi value for given Interventi Date								 						
						//if (oSortedInterventiDateData[i].DATAINTERVENTO === interventDate.toString()) { // Need to execute loop every time for given Interventi Date in order to get Riposi value for given Interventi Date								 	

						if (oSortedInterventiDateData[i].WORKINGDAY) { // Return for GIORNI = 1
							workingDayFlag = true;

							// if(!workingDayFlag){
							// 	workingDayFlag = true;
							// To execute below code only once per Interventi Date as it iterates all the records for specific Interventi Date. 
							// So no need to iterate it again else sumOraIniFineMinsDIffSameIntervtDt value increases on subsequent iterate
							// So reset sumOraIniFineMinsDIffSameIntervtDt every time
							sumOraIniFineMinsDIffSameIntervtDt = 0;
							$.each(oSortedInterventiDateData, function (index, value) {
								if ((value.DATAINTERVENTO).toString() === interventDate.toString() && (value.CHECKOK) === "Y" && (!(value.FLAGCONT))) { // RIP checkbox should not be checked as checked record Interventi date gets counted into previous date for "Multi" count increment by 1 (checkOKCountDatewise++)

									// -------------------------          NEXT DAY/SLOT CALCULATION		--------------------------------------------
									oInterventiOraInizioTimestamp = value.ORAINIZIOTIMESTAMP;
									oInterventiOraFineTimestamp = value.ORAFINETIMESTAMP;

									/////oInterventiCurrentDayDate = new Date(Formatter.formatDateToMMDDYYYY(value.DATAINTERVENTO));
									oFascioInizioCurrentDayDate = new Date(Formatter.formatDateToMMDDYYYY(value.DATAINTERVENTO)); // Fascio Inizio current day

									oInterventiCurrentDayDate = new Date(Formatter.formatDateToMMDDYYYY(value.DATAINTERVENTO));
									oFascioFineoNextDayDate = new Date(Formatter.formatDateToMMDDYYYY(value.DATAINTERVENTO));
									oFascioFineoNextDayDate.setDate(oInterventiCurrentDayDate.getDate() + 1); // Fascio Fine Next day

									// Fascio Inizio Current Day Timestamp
									oFascoInizioCurrentDayTimestamp = new Date(oFascioInizioCurrentDayDate.getFullYear(), oFascioInizioCurrentDayDate.getMonth(),
										oFascioInizioCurrentDayDate.getDate(), "22", "00", "00");

									// Fascio Fine Next Day Timestamp
									oFascioFineNextDayTimestamp = new Date(oFascioFineoNextDayDate.getFullYear(), oFascioFineoNextDayDate.getMonth(),
										oFascioFineoNextDayDate.getDate(), "08", "30", "00");

									// // Check if Ora Inizio and Ora Fine value is range between FASCIO_INIZIO (for same day) and FASCIO_FINE (Next Day)
									// if ((oInterventiOraInizioTimestamp > oFascoInizioCurrentDayTimestamp && oInterventiOraInizioTimestamp <=
									// 		oFascioFineNextDayTimestamp) && oInterventiOraFineTimestamp > oFascoInizioCurrentDayTimestamp &&
									// 	oInterventiOraFineTimestamp <= oFascioFineNextDayTimestamp) {

									// Check if Ora Inizio and Ora Fine value is range between FASCIO_INIZIO (for same day) and FASCIO_FINE (Next Day)
									if ((oInterventiOraInizioTimestamp >= oFascoInizioCurrentDayTimestamp && oInterventiOraInizioTimestamp <=
											oFascioFineNextDayTimestamp) && oInterventiOraFineTimestamp >= oFascoInizioCurrentDayTimestamp &&
										oInterventiOraFineTimestamp <= oFascioFineNextDayTimestamp) {
										sumOraIniFineMinsDIffSameIntervtDt = sumOraIniFineMinsDIffSameIntervtDt + value.MINDIFFORAINIFINE;
									}
									// New logic added on 29th Sep 
									else { // Partial Check OK - e.g. 17:30 < 10:00 PM && ( 01:30 >= 10:00 && 01:30 <= 08:30 AM) - Valid time = 10:00 PM to 01:30 AM = 220 mins
										if (oInterventiOraInizioTimestamp < oFascoInizioCurrentDayTimestamp && (oInterventiOraFineTimestamp >
												oFascoInizioCurrentDayTimestamp && oInterventiOraFineTimestamp <= oFascioFineNextDayTimestamp)) {
											sumOraIniFineMinsDIffSameIntervtDt = sumOraIniFineMinsDIffSameIntervtDt + value.MINDIFFORAINIFINE;
										}
									}

								}
							});

							//	}
							for (var j = 0; j < oRiposiWorkingDay.length; ++j) {

								// New logic added on 29th Sep
								// if ((oRiposiWorkingDay[j].DURATA_MIN === 60 && oRiposiWorkingDay[j].DURATA_MAX === 120)
								// ) {

								// Check whether minute difference of Ora Inizio and Ora Fine is between DURATA_MIN & DURATA_MAX
								//if (oRiposiWorkingDay[j].DURATA_MIN < oSortedInterventiDateData[i].MINDIFFORAINIFINE <= oRiposiWorkingDay[j].DURATA_MAX) {
								if ((oRiposiWorkingDay[j].DURATA_MIN < sumOraIniFineMinsDIffSameIntervtDt && (sumOraIniFineMinsDIffSameIntervtDt <=
										oRiposiWorkingDay[j].DURATA_MAX))) {

									// Uncommented below code on 29th Sep
									// Check below code if require-------
									// // *************** Check if OraInzio Timestamp and Ora Fine Timestamp is between FASCIA_INIZIO and FASCIA_FINE timestamp 
									// // Second slot - 22:00 PM - 08:30 AM
									oInterventiOraInizioTimestamp = oSortedInterventiDateData[i].ORAINIZIOTIMESTAMP;
									oInterventiOraFineTimestamp = oSortedInterventiDateData[i].ORAFINETIMESTAMP;
									oInterventiCurrentDayDate = new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[i].DATAINTERVENTO));
									oFascioFineoNextDayDate.setDate(oInterventiCurrentDayDate.getDate() + 1); // Fascio Fine Next day

									// Fascio Inizio Current Day Timestamp 
									oFascoInizioCurrentDayTimestamp = new Date(oInterventiCurrentDayDate.getFullYear(), oInterventiCurrentDayDate.getMonth(),
										oInterventiCurrentDayDate.getDate(), "22", "00", "00");

									// Fascio Fine Next Day Timestamp
									oFascioFineNextDayTimestamp = new Date(oFascioFineoNextDayDate.getFullYear(), oFascioFineoNextDayDate.getMonth(),
										oFascioFineoNextDayDate.getDate(), "08", "30", "00");

									// Check if Ora Inizio and Ora Fine value is range between FASCIO_INIZIO and FASCIO_FINE value for next slot
									// 22:00 PM - 08:30 AM
									if ((oInterventiOraInizioTimestamp >= oFascoInizioCurrentDayTimestamp && oInterventiOraInizioTimestamp <=
											oFascioFineNextDayTimestamp) && oInterventiOraFineTimestamp > oFascoInizioCurrentDayTimestamp &&
										oInterventiOraFineTimestamp <= oFascioFineNextDayTimestamp) {
										if (checkOKCountDatewise < 3) {
											riposiJsonData = {
												"InterventiDate": interventDate,
												"RiposiValue": (oRiposiWorkingDay[j].VALORE * 8).toString() + "H",
												"multi": "(" + 0 + " Multi)"
											};
										} else {
											riposiJsonData = {
												"InterventiDate": interventDate,
												"RiposiValue": (oRiposiWorkingDay[j].VALORE * 8).toString() + "H",
												"multi": "(" + multi.toString() + " Multi)"
											};
										}
										riposiArray.push(riposiJsonData);
										riposiJsonData = {};

										riposiflag = true;
										break;

									} // New logic added on 29th Sep 
									else { // Partial Check OK - e.g. 17:30 < 10:00 PM && ( 01:30 >= 10:00 && 01:30 <= 08:30 AM) - Valid time = 10:00 PM to 01:30 AM = 220 mins
										if (oInterventiOraInizioTimestamp < oFascoInizioCurrentDayTimestamp && (oInterventiOraFineTimestamp >
												oFascoInizioCurrentDayTimestamp && oInterventiOraFineTimestamp <= oFascioFineNextDayTimestamp)) {
											if (checkOKCountDatewise < 3) {
												riposiJsonData = {
													"InterventiDate": interventDate,
													"RiposiValue": (oRiposiWorkingDay[j].VALORE * 8).toString() + "H",
													"multi": "(" + 0 + " Multi)"
												};
											} else {
												riposiJsonData = {
													"InterventiDate": interventDate,
													"RiposiValue": (oRiposiWorkingDay[j].VALORE * 8).toString() + "H",
													"multi": "(" + multi.toString() + " Multi)"
												};
											}
											riposiArray.push(riposiJsonData);
											riposiJsonData = {};

											riposiflag = true;
											break;
										}
									}
									// Below code commented on 29th Sep
									// if (checkOKCountDatewise < 3) {
									// 	riposiJsonData = {
									// 		"InterventiDate": interventDate,
									// 		"RiposiValue": (oRiposiWorkingDay[j].VALORE * 8).toString() + "H",
									// 		"multi": "(" + 0 + " Multi)"
									// 			//"multi": "(" + multi.toString() + " Multi)"
									// 	};
									// } else {
									// 	riposiJsonData = {
									// 		"InterventiDate": interventDate,
									// 		"RiposiValue": (oRiposiWorkingDay[j].VALORE * 8).toString() + "H",
									// 		"multi": "(" + multi.toString() + " Multi)"
									// 	};
									// }
									// riposiArray.push(riposiJsonData);
									// riposiJsonData = {};

									// riposiflag = true;
									// break;

								} // End of if

								//	}

							} // End of for (var j = 0; j < oRiposiWorkingDay.length; ++j) {

							// Below code commented on 29th Sep
							// if (!riposiflag) {
							// 	if (checkOKCountDatewise >= 3) {
							// 		multiJsonData = {
							// 			"InterventiDate": interventDate,
							// 			"RiposiValue": "0H",
							// 			"multi": "(" + multi.toString() + " Multi)"
							// 		};

							// 		riposiArray.push(multiJsonData);
							// 		multiJsonData = {};
							// 	}
							// 	// *************** Commented below line of code as 0 H (0 Multi) should not be displayed as Riposi Value
							// 	// else {
							// 	// 	multiJsonData = {
							// 	// 		"InterventiDate": interventDate,
							// 	// 		"RiposiValue": "0 H",
							// 	// 		"multi": "(" + 0 + " Multi)"
							// 	// 	};
							// 	// }
							// 	// riposiArray.push(multiJsonData);
							// 	// multiJsonData = {};

							// }

						} else { // Return for GIORNI = 5
							nonWorkingDayFlag = true;
							/// *************************************************************************************************************************************************

							// To execute below code only once per Interventi Date as it iterates all the records for specific Interventi Date. 
							// So no need to iterate it again else sumOraIniFineMinsDIffSameIntervtDt value increases on subsequent iterate
							// So reset sumOraIniFineMinsDIffSameIntervtDtNonWorkDayfirstSlot and sumOraIniFineMinsDIffSameIntervtDtNonWorkDaysecSlot every time
							sumOraIniFineMinsDIffSameIntervtDtNonWorkDayfirstSlot = 0;
							sumOraIniFineMinsDIffSameIntervtDtNonWorkDaysecSlot = 0;

							// For Non Working Day
							$.each(oSortedInterventiDateData, function (index, value) {
								if ((value.DATAINTERVENTO).toString() === interventDate.toString() && (value.CHECKOK) === "Y" && (!(value.FLAGCONT))) { // RIP checkbox should not be checked as checked record Interventi date gets counted into previous date for "Multi" count increment by 1 (checkOKCountDatewise++)
									/////////sumOraIniFineMinsDIffSameIntervtDt = sumOraIniFineMinsDIffSameIntervtDt + value.MINDIFFORAINIFINE;

									// -------------------------          CURRENT DAY CALCULATION		--------------------------------------------
									oInterventiOraInizioTimestamp = value.ORAINIZIOTIMESTAMP;
									oInterventiOraFineTimestamp = value.ORAFINETIMESTAMP;

									oInterventiCurrentDayDate = new Date(Formatter.formatDateToMMDDYYYY(value.DATAINTERVENTO));
									oFascioInizioCurrentDayDate = new Date(Formatter.formatDateToMMDDYYYY(value.DATAINTERVENTO)); // Fascio Inizio current day
									oFascioFineSameDayDate = new Date(oInterventiCurrentDayDate); // Fascio Fine current day

									// Fascio Inizio Current Day Timestamp
									oFascoInizioCurrentDayTimestamp = new Date(oFascioInizioCurrentDayDate.getFullYear(), oFascioInizioCurrentDayDate.getMonth(),
										oFascioInizioCurrentDayDate.getDate(), "08", "30", "00");

									// Fasco Fine Current Day Timestamp
									// Check if Ora Inizio and Ora Fine Timestamp is between 08:30 AM (FASCIO_INIZIO of IDREGOLA = 10) - 10:00 PM (FASCIO_FINE of IDREGOLA = 14). NOTE - Here we are not considering FASCIO_FINE(11:00 PM) of IDREGOLA = 10 
									oFascioFineSameDayTimestamp = new Date(oFascioFineSameDayDate.getFullYear(), oFascioFineSameDayDate.getMonth(),
										oFascioFineSameDayDate.getDate(), "22", "00", "00");

									// // Check if Ora Inizio and Ora Fine value is range between FASCIO_INIZIO and FASCIO_FINE value for same day/first slot 
									// if ((oInterventiOraInizioTimestamp > oFascoInizioCurrentDayTimestamp && oInterventiOraInizioTimestamp <=
									// 		oFascioFineSameDayTimestamp) && oInterventiOraFineTimestamp > oFascoInizioCurrentDayTimestamp &&
									// 	oInterventiOraFineTimestamp <= oFascioFineSameDayTimestamp) {

									// Check if Ora Inizio and Ora Fine value is range between FASCIO_INIZIO and FASCIO_FINE value for same day/first slot 
									if ((oInterventiOraInizioTimestamp >= oFascoInizioCurrentDayTimestamp && oInterventiOraInizioTimestamp <=
											oFascioFineSameDayTimestamp) && oInterventiOraFineTimestamp >= oFascoInizioCurrentDayTimestamp &&
										oInterventiOraFineTimestamp <= oFascioFineSameDayTimestamp) {
										sumOraIniFineMinsDIffSameIntervtDtNonWorkDayfirstSlot = sumOraIniFineMinsDIffSameIntervtDtNonWorkDayfirstSlot + value.MINDIFFORAINIFINE;
									}

									// -------------------------          NEXT SLOT/DAY CALCULATION		--------------------------------------------								 
									oInterventiCurrentDayDate = new Date(Formatter.formatDateToMMDDYYYY(value.DATAINTERVENTO));
									oFascioFineoNextDayDate = new Date(Formatter.formatDateToMMDDYYYY(value.DATAINTERVENTO));
									oFascioFineoNextDayDate.setDate(oInterventiCurrentDayDate.getDate() + 1); // Fascio Fine Next day

									// Fascio Inizio Current Day Timestamp
									oFascoInizioCurrentDayTimestamp = new Date(oFascioInizioCurrentDayDate.getFullYear(), oFascioInizioCurrentDayDate.getMonth(),
										oFascioInizioCurrentDayDate.getDate(), "22", "00", "00");

									// Fascio Fine Next Day Timestamp
									oFascioFineNextDayTimestamp = new Date(oFascioFineoNextDayDate.getFullYear(), oFascioFineoNextDayDate.getMonth(),
										oFascioFineoNextDayDate.getDate(), "08", "30", "00");

									// Check for overlapping time
									// Check if Ora Inizio and Ora Fine value is overlapping e.g. Ora Inizio is 20:00 PM and Ora Fine is 00:00 AM
									// FASCIO_INIZIO = 10:00 PM (Current day) and FASCIO_FINE = 08:30 AM (Next day)
									// Here need to consider whole timeslot (from 20:00 PM to 00:00 AM) = 240 mins
									if (oInterventiOraInizioTimestamp < oFascoInizioCurrentDayTimestamp &&
										(oInterventiOraFineTimestamp >= oFascoInizioCurrentDayTimestamp && oInterventiOraFineTimestamp <=
											oFascioFineNextDayTimestamp)
									) {
										sumOraIniFineMinsDIffSameIntervtDtNonWorkDaysecSlot = sumOraIniFineMinsDIffSameIntervtDtNonWorkDaysecSlot + value.MINDIFFORAINIFINE;
									}
									// Check if Ora Inizio and Ora Fine value is range between >= FASCIO_INIZIO (for same day) and <= FASCIO_FINE (Next Day)
									else if ((oInterventiOraInizioTimestamp >= oFascoInizioCurrentDayTimestamp && oInterventiOraInizioTimestamp <=
											oFascioFineNextDayTimestamp) && oInterventiOraFineTimestamp >= oFascoInizioCurrentDayTimestamp &&
										oInterventiOraFineTimestamp <= oFascioFineNextDayTimestamp) {
										sumOraIniFineMinsDIffSameIntervtDtNonWorkDaysecSlot = sumOraIniFineMinsDIffSameIntervtDtNonWorkDaysecSlot + value
											.MINDIFFORAINIFINE;
									}

								}
							});

							for (var j = 0; j < oRiposiNonWorkingDay.length; ++j) {

								if ((oRiposiNonWorkingDay[j].DURATA_MIN === 240 && oRiposiNonWorkingDay[j].DURATA_MAX === 480) ||
									(oRiposiNonWorkingDay[j].DURATA_MIN === 480 && oRiposiNonWorkingDay[j].DURATA_MAX === 1440)
								) {

									// First Slot (08:30:00 AM - 11:00:00 PM - In fact to consider 10:00 PM) 
									// Check if Ora Inizio and Ora Fine value minutes difference is in range between FASCIO_INIZIO and FASCIO_FINE value for same day 
									if ((oRiposiNonWorkingDay[j].DURATA_MIN) < sumOraIniFineMinsDIffSameIntervtDtNonWorkDayfirstSlot && (
											sumOraIniFineMinsDIffSameIntervtDtNonWorkDayfirstSlot <=
											oRiposiNonWorkingDay[j].DURATA_MAX)) {

										// *************** Check if OraInzio Timestamp and Ora Fine Timestamp is between FASCIA_INIZIO and FASCIA_FINE timestamp
										// First slot - 08:30 AM - 10:00 PM (22:00)
										oInterventiOraInizioTimestamp = oSortedInterventiDateData[i].ORAINIZIOTIMESTAMP;
										oInterventiOraFineTimestamp = oSortedInterventiDateData[i].ORAFINETIMESTAMP;
										oInterventiCurrentDayDate = new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[i].DATAINTERVENTO));

										oFascioInizioCurrentDayDate = new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[i].DATAINTERVENTO)); // Fascio Inizio current day
										oFascioFineSameDayDate = new Date(oInterventiCurrentDayDate); // Fascio Fine current day

										oFascoInizioCurrentDayTimestamp = new Date(oFascioInizioCurrentDayDate.getFullYear(), oFascioInizioCurrentDayDate.getMonth(),
											oFascioInizioCurrentDayDate.getDate(), "08", "30", "00");

										// Check if Ora Inizio and Ora Fine Timestamp is between 08:30 AM (FASCIO_INIZIO of IDREGOLA = 10) - 10:00 PM (FASCIO_FINE of IDREGOLA = 14). NOTE - Here we are not considering FASCIO_FINE(11:00 PM) of IDREGOLA = 10 
										oFascioFineSameDayTimestamp = new Date(oFascioFineSameDayDate.getFullYear(), oFascioFineSameDayDate.getMonth(),
											oFascioFineSameDayDate.getDate(), "22", "00", "00");

										// // Check if Ora Inizio and Ora Fine value is range between FASCIO_INIZIO and FASCIO_FINE value for same day/first slot
										// if ((oInterventiOraInizioTimestamp > oFascoInizioCurrentDayTimestamp && oInterventiOraInizioTimestamp <=
										// 		oFascioFineSameDayTimestamp) && oInterventiOraFineTimestamp > oFascoInizioCurrentDayTimestamp &&
										// 	oInterventiOraFineTimestamp <= oFascioFineSameDayTimestamp) {

										// Check if Ora Inizio and Ora Fine value is range between FASCIO_INIZIO and FASCIO_FINE value for same day/first slot
										if ((oInterventiOraInizioTimestamp >= oFascoInizioCurrentDayTimestamp && oInterventiOraInizioTimestamp <=
												oFascioFineSameDayTimestamp) && oInterventiOraFineTimestamp >= oFascoInizioCurrentDayTimestamp &&
											oInterventiOraFineTimestamp <= oFascioFineSameDayTimestamp) {
											if (checkOKCountDatewise < 3) {
												riposiJsonData = {
													"InterventiDate": interventDate,
													//"RiposiValue": "4".toString() + "H", // IDREGOLA = 10 (Rule no. 10). VALORE = 0.5. Here Riposi value is 0.5 * 8 = 4.
													"RiposiValue": (oRiposiNonWorkingDay[j].VALORE * 8).toString() + "H",
													"multi": "(" + 0 + " Multi)"
												};
											} else {
												riposiJsonData = {
													"InterventiDate": interventDate,
													////"RiposiValue": "0.5".toString() + "H",
													"RiposiValue": (oRiposiNonWorkingDay[j].VALORE * 8).toString() + "H",
													///"RiposiValue": "4".toString() + "H",
													"multi": "(" + multi.toString() + " Multi)"
												};
											}
											// Logic added on 28th Sep
											riposiArray.push(riposiJsonData);
											riposiJsonData = {};

											riposiflag = true;
											break;

										}
										// Logic added on 28th Sep
										// riposiArray.push(riposiJsonData);
										// riposiJsonData = {};

										// riposiflag = true;
										// break;
									}
								} //(oRiposiNonWorkingDay[j].DURATA_MIN === 240 && oRiposiNonWorkingDay[j].DURATA_MAX === 480)
								// Second Slot (10:00:00 PM - 08:30:00 AM) 
								// Check if Ora Inizio and Ora Fine value minutes difference is in range between FASCIO_INIZIO for same day and FASCIO_FINE value of next day
								else {

									if ((oRiposiNonWorkingDay[j].DURATA_MIN === 60 && oRiposiNonWorkingDay[j].DURATA_MAX === 120) ||
										(oRiposiNonWorkingDay[j].DURATA_MIN === 120 && oRiposiNonWorkingDay[j].DURATA_MAX === 240) ||
										(oRiposiNonWorkingDay[j].DURATA_MIN === 240 && oRiposiNonWorkingDay[j].DURATA_MAX === 1440)
									) {
										if ((oRiposiNonWorkingDay[j].DURATA_MIN) < sumOraIniFineMinsDIffSameIntervtDtNonWorkDaysecSlot && (
												sumOraIniFineMinsDIffSameIntervtDtNonWorkDaysecSlot <=
												oRiposiNonWorkingDay[j].DURATA_MAX)) {

											// *************** Check if OraInzio Timestamp and Ora Fine Timestamp is between FASCIA_INIZIO and FASCIA_FINE timestamp 
											// Second slot - 22:00 PM - 08:30 AM
											oInterventiOraInizioTimestamp = oSortedInterventiDateData[i].ORAINIZIOTIMESTAMP;
											oInterventiOraFineTimestamp = oSortedInterventiDateData[i].ORAFINETIMESTAMP;
											oInterventiCurrentDayDate = new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[i].DATAINTERVENTO));
											oFascioFineoNextDayDate = new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[i].DATAINTERVENTO));
											oFascioFineoNextDayDate.setDate(oInterventiCurrentDayDate.getDate() + 1); // Fascio Fine Next day

											// Fascio Inizio Current Day Timestamp 
											oFascoInizioCurrentDayTimestamp = new Date(oInterventiCurrentDayDate.getFullYear(), oInterventiCurrentDayDate.getMonth(),
												oInterventiCurrentDayDate.getDate(), "22", "00", "00");

											// Fascio Fine Next Day Timestamp
											oFascioFineNextDayTimestamp = new Date(oFascioFineoNextDayDate.getFullYear(), oFascioFineoNextDayDate.getMonth(),
												oFascioFineoNextDayDate.getDate(), "08", "30", "00");

											// // Check if Ora Inizio and Ora Fine value is range between FASCIO_INIZIO and FASCIO_FINE value for next slot
											// // 22:00 PM - 08:30 AM
											// if ((oInterventiOraInizioTimestamp > oFascoInizioCurrentDayTimestamp && oInterventiOraInizioTimestamp <=
											// 		oFascioFineNextDayTimestamp) && oInterventiOraFineTimestamp > oFascoInizioCurrentDayTimestamp &&
											// 	oInterventiOraFineTimestamp <= oFascioFineNextDayTimestamp) {

											// Check if Ora Inizio and Ora Fine value is range between FASCIO_INIZIO and FASCIO_FINE value for next slot
											// 22:00 PM - 08:30 AM
											if ((oInterventiOraInizioTimestamp >= oFascoInizioCurrentDayTimestamp && oInterventiOraInizioTimestamp <=
													oFascioFineNextDayTimestamp) && oInterventiOraFineTimestamp >= oFascoInizioCurrentDayTimestamp &&
												oInterventiOraFineTimestamp <= oFascioFineNextDayTimestamp) {
												if (checkOKCountDatewise < 3) {
													riposiJsonData = {
														"InterventiDate": interventDate,
														"RiposiValue": (oRiposiNonWorkingDay[j].VALORE * 8).toString() + "H",
														"multi": "(" + 0 + " Multi)"
													};
												} else {
													riposiJsonData = {
														"InterventiDate": interventDate,
														"RiposiValue": (oRiposiNonWorkingDay[j].VALORE * 8).toString() + "H",
														"multi": "(" + multi.toString() + " Multi)"
													};
												}
												// Logic added on 28th Sep
												riposiArray.push(riposiJsonData);
												riposiJsonData = {};

												riposiflag = true;
												break;

											}
											// New logic added on 28th Sep
											// Check for overlapping time
											// Check if Ora Inizio and Ora Fine value is overlapping e.g. Ora Inizio is 20:00 PM and Ora Fine is 00:00 AM
											// FASCIO_INIZIO = 10:00 PM (Current day) and FASCIO_FINE = 08:30 AM (Next day)										
											else if (oInterventiOraInizioTimestamp < oFascoInizioCurrentDayTimestamp &&
												(oInterventiOraFineTimestamp >= oFascoInizioCurrentDayTimestamp && oInterventiOraFineTimestamp <=
													oFascioFineNextDayTimestamp)
											) {
												if (checkOKCountDatewise < 3) {
													riposiJsonData = {
														"InterventiDate": interventDate,
														"RiposiValue": (oRiposiNonWorkingDay[j].VALORE * 8).toString() + "H",
														"multi": "(" + 0 + " Multi)"
													};
												} else {
													riposiJsonData = {
														"InterventiDate": interventDate,
														"RiposiValue": (oRiposiNonWorkingDay[j].VALORE * 8).toString() + "H",
														"multi": "(" + multi.toString() + " Multi)"
													};
												}
												// Logic added on 28th Sep
												riposiArray.push(riposiJsonData);
												riposiJsonData = {};

												riposiflag = true;
												break;
											}
										}
										// Logic added on 28th Sep
										// riposiArray.push(riposiJsonData);
										// riposiJsonData = {};

										// riposiflag = true;
										// break;
									}
								}

								// // Overlapping Range
								// // 240 - 480 
								// // 240 - 1440 
								// if ((oRiposiNonWorkingDay[j].DURATA_MIN === 240 && oRiposiNonWorkingDay[j].DURATA_MAX === 480) && (oRiposiNonWorkingDay[j]
								// 		.DURATA_MIN <
								// 		sumOraIniFineMinsDIffSameIntervtDt && (sumOraIniFineMinsDIffSameIntervtDt <= oRiposiNonWorkingDay[j].DURATA_MAX))) {

								// 	oInterventiOraInizioTimestamp = oSortedInterventiDateData[i].ORAINIZIOTIMESTAMP;
								// 	oInterventiOraFineTimestamp = oSortedInterventiDateData[i].ORAFINETIMESTAMP;

								// 	oInterventiCurrentDayDate = new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[i].DATAINTERVENTO));
								// 	//oFascioFineNextDayDate = new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[i].DATAINTERVENTO));

								// 	oFascioInizioCurrentDayDate = new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[i].DATAINTERVENTO)); // Fascio Inizio current day
								// 	oFascioFineSameDayDate = new Date(oInterventiCurrentDayDate); // Fascio Fine current day

								// 	//oFascioFineNextDayDate.setDate(oFascioInizioCurrentDayDate.getDate() + 1); // Fascia Fine next day

								// 	oFascoInizioCurrentDayTimestamp = new Date(oFascioInizioCurrentDayDate.getFullYear(), oFascioInizioCurrentDayDate.getMonth(),
								// 		oFascioInizioCurrentDayDate.getDate(), (oRiposiNonWorkingDay[j].FASCIA_INIZIO).split(":")[0], (oRiposiNonWorkingDay[j].FASCIA_INIZIO)
								// 		.split(":")[1], "00");

								// 	// Check if Ora Inizio and Ora Fine Timestamp is between 08:30 AM (FASCIO_INIZIO of IDREGOLA = 10) - 10:00 PM (FASCIO_FINE of IDREGOLA = 14). NOTE - Here we are not considering FASCIO_FINE(11:00 PM) of IDREGOLA = 10 
								// 	oFascioFineSameDayTimestamp = new Date(oFascioFineSameDayDate.getFullYear(), oFascioFineSameDayDate.getMonth(),
								// 		oFascioFineSameDayDate.getDate(), "22", "00", "00");

								// 	// Check if Ora Inizio and Ora Fine value is range between FASCIO_INIZIO and FASCIO_FINE value for same day 
								// 	// It mean to consider IDREGOLA = 10 and not IDREGOLA = 14 if below condition is true
								// if ((oInterventiOraInizioTimestamp > oFascoInizioCurrentDayTimestamp && oInterventiOraInizioTimestamp <=
								// 		oFascioFineSameDayTimestamp) && oInterventiOraFineTimestamp > oFascoInizioCurrentDayTimestamp &&
								// 	oInterventiOraFineTimestamp <= oFascioFineSameDayTimestamp) {

								// 	if (checkOKCountDatewise < 3) {
								// 		riposiJsonData = {
								// 			"InterventiDate": interventDate,
								// 			////"RiposiValue": "0.5".toString() + "H", // IDREGOLA = 10 (Rule no. 10). VALORE = 0.5
								// 			"RiposiValue": "4".toString() + "H", // IDREGOLA = 10 (Rule no. 10). VALORE = 0.5
								// 			"multi": "(" + 0 + " Multi)"
								// 		};
								// 	} else {
								// 		riposiJsonData = {
								// 			"InterventiDate": interventDate,
								// 			////"RiposiValue": "0.5".toString() + "H",
								// 			"RiposiValue": "4".toString() + "H",
								// 			"multi": "(" + multi.toString() + " Multi)"
								// 		};
								// 	}

								// } 
								// else { // If Ora Inizio Timestamp is > 08:30 AM & Ora Fine Timestamp is > 10:00 PM. In all other cases VALORE = 1, IDREGOLA = 14
								// 	if (checkOKCountDatewise < 3) {
								// 		riposiJsonData = {
								// 			"InterventiDate": interventDate,
								// 			"RiposiValue": "8".toString() + "H",
								// 			"multi": "(" + 0 + " Multi)"
								// 		};
								// 	} else {
								// 		riposiJsonData = {
								// 			"InterventiDate": interventDate,
								// 			"RiposiValue": "8".toString() + "H",
								// 			"multi": "(" + multi.toString() + " Multi)"
								// 		};
								// 	}
								// }

								// 	riposiArray.push(riposiJsonData);
								// 	riposiJsonData = {};

								// 	riposiflag = true;
								// 	break;

								// } 

								//else {
								// 	if ((oRiposiNonWorkingDay[j].DURATA_MIN < sumOraIniFineMinsDIffSameIntervtDt && (sumOraIniFineMinsDIffSameIntervtDt <=
								// 			oRiposiNonWorkingDay[j].DURATA_MAX))) {

								// 		if (checkOKCountDatewise < 3) {
								// 			riposiJsonData = {
								// 				"InterventiDate": interventDate,
								// 				"RiposiValue": (oRiposiNonWorkingDay[j].VALORE * 8).toString() + "H",
								// 				"multi": "(" + 0 + " Multi)"
								// 			};
								// 		} else {
								// 			riposiJsonData = {
								// 				"InterventiDate": interventDate,
								// 				"RiposiValue": (oRiposiNonWorkingDay[j].VALORE * 8).toString() + "H",
								// 				"multi": "(" + multi.toString() + " Multi)"
								// 			};
								// 		}

								// 		riposiArray.push(riposiJsonData);
								// 		riposiJsonData = {};

								// 		riposiflag = true;
								// 		break;
								// 	}
								// }

							}

							/// ---------------------- END OF GIORNI = 5 For Loop

							// Below code commented on 29th Sep
							// if (!riposiflag) {
							// 	if (checkOKCountDatewise >= 3) {
							// 		multiJsonData = {
							// 			"InterventiDate": interventDate,
							// 			"RiposiValue": "0H",
							// 			"multi": "(" + multi.toString() + " Multi)"
							// 		};
							// 		riposiArray.push(multiJsonData);
							// 		multiJsonData = {};
							// 	}
							// 	// Below code commented on 28th Sep
							// 	// else {
							// 	// 	multiJsonData = {
							// 	// 		"InterventiDate": interventDate,
							// 	// 		"RiposiValue": "0H",
							// 	// 		"multi": "(" + 0 + " Multi)"
							// 	// 	};
							// 	// }

							// 	// riposiArray.push(multiJsonData);
							// 	// multiJsonData = {};
							// }
						}
					}
				} // End of for loop

				var uniqueInterventiDateRiposi = [];

				// Below condition implies that for NONWORKING DAY if uniqueInterventiDateRiposi contains more than 1 records
				// It implies that both first slot and second slot RIPOSI value exits For e.g. below - To consider highest array value
				// as this contains RIPOSI value of sum of first slot and second slot.
				// uniqueInterventiDateRiposi array value below:
				// 0:
				// InterventiDate: "26-09-2020"
				// RiposiValue: "4H"
				// multi: "(0 Multi)"
				// 1:
				// InterventiDate: "26-09-2020"
				// RiposiValue: "8H"
				// multi: "(0 Multi)"
				// length: 2
				if (nonWorkingDayFlag) {
					if (riposiArray.length > 0) {
						uniqueInterventiDateRiposi.push(riposiArray[riposiArray.length - 1]);

						// Logic added on 25th Nov - Bug fix
						// The issue was when 2 Interventions exists for same Non-Working day for either first slots (both) or secode slots (both)
						// then "riposiArray" contains two different 'RiposiValue' one for each first slot. Here the locic to calculate total RIPOSI value for same Interventi Date
						// does summation of both first slot 'RiposiValue' which is incorrect as above logic already does summation of 'MINDIFFORAINIFINE' of each first slot
						// e.g. 
						//	Interventi Date					Ora Inizio			Ora Fine	Riposi
						//	29-11-2020						10:00				13:00		4H (0 Multi)
						//	29-11-2020						17:00				19:00		4H (0 Multi)
						// Output - Here instead of 4H it returns 8H which is incorrect
						// Conclusion - Here if 2 Interventions of same Interventi Date is for 2 different slots (first and second) then existing logic works but if 2 Intervntions of same
						// Interventi Data is for same slots (first or second) then the issue occurs. Above logic is implemented to fix the issue

						// Multiple slots exists for "firstslot" and not "secondslot"
						if (sumOraIniFineMinsDIffSameIntervtDtNonWorkDayfirstSlot !== 0 && sumOraIniFineMinsDIffSameIntervtDtNonWorkDaysecSlot === 0) {
							// Get 'Riposi' calculated value of 1st record as all the records will contain same calculated Riposi value
							if (riposiArray[0].RiposiValue !== "" && riposiArray[0].RiposiValue !== undefined &&
								riposiArray[0].RiposiValue !== null) {
								riposi = riposiArray[0].RiposiValue;
								totRiposiValue = parseInt(riposi.substr(0, (riposi.indexOf("H"))));
							}
						}
						// Multiple slots exists for "secondslot" and not "firstslot"
						else if (sumOraIniFineMinsDIffSameIntervtDtNonWorkDaysecSlot !== 0 && sumOraIniFineMinsDIffSameIntervtDtNonWorkDayfirstSlot ===
							0) {
							// Get 'Riposi' calculated value of 1st record as all the records will contain same calculated Riposi value
							if (riposiArray[0].RiposiValue !== "" && riposiArray[0].RiposiValue !== undefined &&
								riposiArray[0].RiposiValue !== null) {
								riposi = riposiArray[0].RiposiValue;
								totRiposiValue = parseInt(riposi.substr(0, (riposi.indexOf("H"))));
							}
						} else {
							// else if(sumOraIniFineMinsDIffSameIntervtDtNonWorkDaysecSlot !== 0 && sumOraIniFineMinsDIffSameIntervtDtNonWorkDayfirstSlot !== 0){

							// }

							// Logic to calculate total RIPOSI value for same Interventi Date 
							for (var i = 0; i < riposiArray.length; ++i) {
								if (riposiArray.length == 1) {
									if (riposiArray[i].RiposiValue !== "" && riposiArray[i].RiposiValue !== undefined &&
										riposiArray[i].RiposiValue !== null) {
										riposi = riposiArray[i].RiposiValue;
										totRiposiValue = parseInt(riposi.substr(0, (riposi.indexOf("H"))));
									} else {
										totRiposiValue = 0;
									}
								} else {
									if (riposiArray[i].RiposiValue !== "" && riposiArray[i].RiposiValue !== undefined &&
										riposiArray[i].RiposiValue !== null) {
										riposi = riposiArray[i].RiposiValue;
										totRiposiValue = totRiposiValue + parseInt(riposi.substr(0, (riposi.indexOf("H"))));
									}
								}
							}
						}

						if (totRiposiValue > 8) {
							totRiposiValue = 8; // If RIPOSI value is greater than 8 then reset the value to "8"
						}

						uniqueInterventiDateRiposi[0].RiposiValue = totRiposiValue + "H";
					}

				} else if (workingDayFlag) {
					if (riposiArray.length > 0) {
						// Check below code if doesnt work then uncomment next line of code
						uniqueInterventiDateRiposi = that.unique(riposiArray);
						//////uniqueInterventiDateRiposi = riposiArray[riposiArray.length - 1];
					}
				}

				var oInterventiDateModel = that.getView().byId("idTableInterventi").getModel("RepintInterventiModel");

				// Logic commented on 28th Sep
				// KAPIL - Please check below code. Commented to fix riposi issue as on 5th Aug
				// Below code uncommented on 29th Sep
				for (var index = 0; index < oSortedInterventiDateData.length; ++index) {
					for (var indexDt = 0; indexDt < uniqueInterventiDateRiposi.length; ++indexDt) {
						if (oSortedInterventiDateData[index].DATAINTERVENTO === uniqueInterventiDateRiposi[indexDt].InterventiDate) {

							// // Logic to calculate total RIPOSI value for same Interventi Date 
							// for (var i = 0; i < riposiArray.length; ++i) {
							// 	if (riposiArray.length == 1) {
							// 		if (riposiArray[i].RiposiValue !== "" && riposiArray[i].RiposiValue !== undefined &&
							// 			riposiArray[i].RiposiValue !== null) {
							// 			riposi = riposiArray[i].RiposiValue;
							// 			totRiposiValue = parseInt(riposi.substr(0, (riposi.indexOf("H"))));
							// 		} else {
							// 			totRiposiValue = 0;
							// 		}
							// 	} else {
							// 		if (riposiArray[i].RiposiValue !== "" && riposiArray[i].RiposiValue !== undefined &&
							// 			riposiArray[i].RiposiValue !== null) {
							// 			riposi = riposiArray[i].RiposiValue;
							// 			totRiposiValue = totRiposiValue + parseInt(riposi.substr(0, (riposi.indexOf("H"))));
							// 		}
							// 	}
							// }
							// if (totRiposiValue > 8) {
							// 	totRiposiValue = 8; // If RIPOSI value is greater than 8 then reset the value to "8"
							// }

							// Below line of code added on 29th Sep
							// If RIPOSI value is greater than 8 reset it to 8
							// if(uniqueInterventiDateRiposi[indexDt].RiposiValue > 8){
							// 	uniqueInterventiDateRiposi[indexDt].RiposiValue = 8;
							// }

							oInterventiDateModel.getData()[index].RIPOSI = uniqueInterventiDateRiposi[indexDt].RiposiValue + " " +
								uniqueInterventiDateRiposi[indexDt].multi; // Always first index for new Interventi date
							//oSortedInterventiDateData[index].RIPOSI = uniqueInterventiDateRiposi[indexDt].RiposiValue; // Always first index for new Interventi date
							uniqueInterventiDateRiposi.splice(0, 1);
							break;
						}
					}
				}

				// Logic added on 28th Sep 
				// Below code commented on 29th Sep
				// totRiposiValue = 0;
				// riposi = 0;
				// for (var index = 0; index < oSortedInterventiDateData.length; ++index) {
				// 	for (var indexDt = 0; indexDt < uniqueInterventiDateRiposi.length; ++indexDt) {
				// 		if (oSortedInterventiDateData[index].DATAINTERVENTO === uniqueInterventiDateRiposi[indexDt].InterventiDate) {

				// 			// Logic to calculate total RIPOSI value for same Interventi Date
				// 			for (var i = 0; i < riposiArray.length; ++i) {
				// 				if (riposiArray.length == 1) {
				// 					if (riposiArray[i].RiposiValue !== "" && riposiArray[i].RiposiValue !== undefined &&
				// 						riposiArray[i].RiposiValue !== null) {
				// 						riposi = riposiArray[i].RiposiValue;
				// 						totRiposiValue = parseInt(riposi.substr(0, (riposi.indexOf("H"))));
				// 					} else {
				// 						totRiposiValue = 0;
				// 					}
				// 				} else {
				// 					if (riposiArray[i].RiposiValue !== "" && riposiArray[i].RiposiValue !== undefined &&
				// 						riposiArray[i].RiposiValue !== null) {
				// 						riposi = riposiArray[i].RiposiValue;
				// 						totRiposiValue = totRiposiValue + parseInt(riposi.substr(0, (riposi.indexOf("H"))));
				// 					}
				// 				}
				// 			}
				// 			if (totRiposiValue > 8) {
				// 				totRiposiValue = 8; // If RIPOSI value is greater than 8 then reset the value to "8"
				// 			}
				// 			oInterventiDateModel.getData()[index].RIPOSI = totRiposiValue + "H " + uniqueInterventiDateRiposi[indexDt].multi; // Always first index for new Interventi date
				// 			uniqueInterventiDateRiposi.splice(0, 1);
				// 		}
				// 	}
				// 	break;
				// }

				//KAPIL - Please check below code. Commented to fix riposi issue as on 1st Sep
				// for (var index = 0; index < oSortedInterventiDateData.length; ++index) {
				// 	for (var indexDt = 0; indexDt < uniqueInterventiDateRiposi.length; ++indexDt) {
				// 		if (oSortedInterventiDateData[index].DATAINTERVENTO === uniqueInterventiDateRiposi[indexDt].InterventiDate) {
				// 			for (var k = indexDt; k < uniqueInterventiDateRiposi.length; ++k) {
				// 				// Always first index for new Interventi date
				// 				oInterventiDateModel.getData()[index].RIPOSI = oInterventiDateModel.getData()[index].RIPOSI +
				// 					uniqueInterventiDateRiposi[k].RiposiValue + " " + uniqueInterventiDateRiposi[k].multi;
				// 				uniqueInterventiDateRiposi.splice(0, 1);
				// 			}
				// 			//break;
				// 			///indexInter = indexDt + 1; 
				// 		}
				// 	}
				// 	break;
				// }

				that.getView().byId("idTableInterventi").getModel("RepintInterventiModel").updateBindings(true);

				that.checkForRIP(that.getView().byId("idTableInterventi").getModel("RepintInterventiModel"), onChiamatodaChange);

			});

		},

		unique: function (arr) {

			var uniques = [];
			var itemsFound = {};
			for (var i = 0, l = arr.length; i < l; i++) {
				var stringified = JSON.stringify(arr[i]);
				if (itemsFound[stringified]) {
					continue;
				}
				uniques.push(arr[i]);
				itemsFound[stringified] = true;
			}
			return uniques;
		},

		uniqueInterCalcu: function (arr) {

			var uniques = [];
			var itemsFound = {};
			var entry = "";
			for (var i = 0, l = arr.length; i < l; i++) {

				entry = {
					"DATAINTERVENTO": arr[i].DATAINTERVENTO,
					"TimeSlot": arr[i].TimeSlot
				};

				var stringified = JSON.stringify(entry);
				if (itemsFound[stringified]) {
					continue;
				}
				uniques.push(arr[i]);
				itemsFound[stringified] = true;
			}
			return uniques;
		},

		resetContinterventoFlagCountChiamatoda: function (RepintInterventiModel) {
			// Reset all 'FLAGCONT' and 'CONTINTERVENTO' value to 0 for all Interventi Records so as to update it with latest value
			for (var i = 0; i < RepintInterventiModel.getData().length; ++i) {
				RepintInterventiModel.getData()[i].FLAGCONT = false;
				RepintInterventiModel.getData()[i].CONTINTERVENTO = 0;
				if (RepintInterventiModel.getData()[i].CHIAMATODA === undefined || RepintInterventiModel.getData()[i].CHIAMATODA === null) {
					RepintInterventiModel.getData()[i].CHIAMATODA = "";
				}
				if (RepintInterventiModel.getData()[i].CAUSA === undefined || RepintInterventiModel.getData()[i].CAUSA === null) {
					RepintInterventiModel.getData()[i].CAUSA = "";
				} else {
					RepintInterventiModel.getData()[i].CAUSA = (RepintInterventiModel.getData()[i].CAUSA).trim();
				}
			}
		},

		checkForRIP: function (RepintInterventiModel, onChiamatodaChange) {
			var j = 0;
			var dateintervento;
			var oInterventiDate;
			var oInterventoNextDate;
			var paramSetdata;
			//var interventiCurrentDateTimestamp;
			//var interventiNextDayDateTimestamp;

			this.resetContinterventoFlagCountChiamatoda(RepintInterventiModel);

			var oParamSetModel = this.getView().getModel("ParamSetModel").getData();

			if (this.getOwnerComponent().getModel("viewProperties").getProperty("/paramSet") === undefined) {
				paramSetdata = jQuery.grep(oParamSetModel, function (a) {
					return (a.PARAMETER_NAME == "INT_A_CAVALLO_MINUTI");
				});
				this.getOwnerComponent().getModel("viewProperties").setProperty("/paramSet", paramSetdata);
			} else {
				paramSetdata = this.getOwnerComponent().getModel("viewProperties").getProperty("/paramSet");
			}

			//if (RepintInterventiModel.getData().length > 1) {
			if (RepintInterventiModel.getData().length > paramSetdata[0].PARAMETER_VALUE) {
				for (var i = 0; i < RepintInterventiModel.getData().length; ++i) {
					if (RepintInterventiModel.getData().length === 1 || i === RepintInterventiModel.getData().length - 1) {
						break;
					}
					j = i + 1;

					// CHECK
					// RepintInterventiModel.getData()[j].FLAGCONT = false;
					// RepintInterventiModel.getData()[i].CONTINTERVENTO = 0;

					dateintervento = RepintInterventiModel.getData()[i].DATAINTERVENTO;
					oInterventiDate = new Date(Formatter.formatDateToMMDDYYYY(dateintervento));
					oInterventoNextDate = new Date(Formatter.formatDateToMMDDYYYY(dateintervento));
					// oInterventiYear = oInterventiDate.getFullYear();
					// oInterventiMonth = oInterventiDate.getMonth();
					// oInterventiToday = oInterventiDate.getDate();
					oInterventoNextDate.setDate(oInterventiDate.getDate() + 1);
					// oInterventiNextYear = oInterventoNextDate.getFullYear();
					// oInterventiNextMonth = oInterventoNextDate.getMonth();
					// oInterventiNextDay = oInterventoNextDate.getDate();

					//	interventiCurrentDateTimestamp = new Date(oInterventiDate.getFullYear(), oInterventiDate.getMonth(), oInterventiDate.getDate(), "00", "00", "00");

					//	interventiNextDayDateTimestamp = new Date(oInterventoNextDate.getFullYear(), oInterventoNextDate.getMonth(), oInterventoNextDate.getDate(), "00","00","00");					

					// PENDING to get value from ParamSet
					// 1st Condition check - Implies next Interventi date is equal to current Interventi date + 1. E.g. current date = 14-02-2020 then next Interventi date = 15-02-2020
					//if(RepintInterventiModel.getData()[j].DATAINTERVENTO === interventiNextDayDateTimestamp){ 

					//if ( RepintInterventiModel.getData()[j].DATAINTERVENTO === Formatter.formatDate(oInterventoNextDate)) {
					if ((new Date(Formatter.formatDateToMMDDYYYY(RepintInterventiModel.getData()[j].DATAINTERVENTO))).toString() ===
						oInterventoNextDate.toString()) {
						//XXXXXX/////if ((RepintInterventiModel.getData()[i].MINDIFFORAINIFINE > 1) && // 2nd Condition check - (row1.orafine - row1.orainizio) >  T_PARAMETERS.INT_A_CAVALLO_MINUTI
						if ((RepintInterventiModel.getData()[i].MINDIFFORAINIFINE >= 1) && // 2nd Condition check - (row1.orafine - row1.orainizio) >  T_PARAMETERS.INT_A_CAVALLO_MINUTI
							(RepintInterventiModel.getData()[i].CHIAMATODA === RepintInterventiModel.getData()[j].CHIAMATODA) && // 3rd Condition check -  row1."chiamato da" eq row2."chiamato da"
							(RepintInterventiModel.getData()[i].CAUSA.toString() === RepintInterventiModel.getData()[j].CAUSA.toString()) && // 4th Condition check - row1."causa" eq row2."causa" 		
							((RepintInterventiModel.getData()[i].ORAFINE === "08:30") && (RepintInterventiModel.getData()[i].ORAFINE.toString() ===
								RepintInterventiModel.getData()[j].ORAINIZIO.toString())) // 5th Condition check - row1."ora fine" eq row2."ora inizio" 
						) {
							RepintInterventiModel.getData()[i].CONTINTERVENTO = RepintInterventiModel.getData()[j].IDINTERVENTO;
							RepintInterventiModel.getData()[j].FLAGCONT = true;

							//xxxx///////this.updateCompensativiPostRIPCheck(RepintInterventiModel); // This function should be called when RIP flag is true as "multi" value may change
							this.updateCompensativiPostRIPCheck(RepintInterventiModel.getData(), onChiamatodaChange); // This function should be called when RIP flag is true as "multi" value may change
						} else {
							RepintInterventiModel.getData()[j].FLAGCONT = false;
							RepintInterventiModel.getData()[i].CONTINTERVENTO = 0;
						}
					}
				}
			}
		},

		checkForRIPAfterSubmitForCONTINTERVENTO: function (RepintInterventiModel) {
			console.log("Inside checkForRIPAfterSubmitForCONTINTERVENTO");
			var j = 0;
			var dateintervento;
			var oInterventiDate;
			var oInterventoNextDate;
			var paramSetdata;

			this.resetContinterventoFlagCountChiamatoda(RepintInterventiModel);

			var oParamSetModel = this.getView().getModel("ParamSetModel").getData();

			if (this.getOwnerComponent().getModel("viewProperties").getProperty("/paramSet") === undefined) {
				paramSetdata = jQuery.grep(oParamSetModel, function (a) {
					return (a.PARAMETER_NAME == "INT_A_CAVALLO_MINUTI");
				});
				this.getOwnerComponent().getModel("viewProperties").setProperty("/paramSet", paramSetdata);
			} else {
				paramSetdata = this.getOwnerComponent().getModel("viewProperties").getProperty("/paramSet");
			}

			if (RepintInterventiModel.getData().length > paramSetdata[0].PARAMETER_VALUE) {
				for (var i = 0; i < RepintInterventiModel.getData().length; ++i) {
					if (RepintInterventiModel.getData().length === 1 || i === RepintInterventiModel.getData().length - 1) {
						break;
					}
					j = i + 1;

					dateintervento = RepintInterventiModel.getData()[i].DATAINTERVENTO;
					oInterventiDate = new Date(Formatter.formatDateToMMDDYYYY(dateintervento));
					oInterventoNextDate = new Date(Formatter.formatDateToMMDDYYYY(dateintervento));
					oInterventoNextDate.setDate(oInterventiDate.getDate() + 1);

					if ((new Date(Formatter.formatDateToMMDDYYYY(RepintInterventiModel.getData()[j].DATAINTERVENTO))).toString() ===
						oInterventoNextDate.toString()) {
						if ((RepintInterventiModel.getData()[i].MINDIFFORAINIFINE > 1) && // 2nd Condition check - (row1.orafine - row1.orainizio) >  T_PARAMETERS.INT_A_CAVALLO_MINUTI
							(RepintInterventiModel.getData()[i].CHIAMATODA === RepintInterventiModel.getData()[j].CHIAMATODA) && // 3rd Condition check -  row1."chiamato da" eq row2."chiamato da"
							(RepintInterventiModel.getData()[i].CAUSA.toString() === RepintInterventiModel.getData()[j].CAUSA.toString()) && // 4th Condition check - row1."causa" eq row2."causa" 		
							((RepintInterventiModel.getData()[i].ORAFINE === "08:30") && (RepintInterventiModel.getData()[i].ORAFINE.toString() ===
								RepintInterventiModel.getData()[j].ORAINIZIO.toString())) // 5th Condition check - row1."ora fine" eq row2."ora inizio" 
						) {
							RepintInterventiModel.getData()[i].CONTINTERVENTO = RepintInterventiModel.getData()[j].IDINTERVENTO;
							RepintInterventiModel.getData()[j].FLAGCONT = true;

							/////this.updateCompensativiPostRIPCheck(RepintInterventiModel); // This function should be called when RIP flag is true as "multi" value may change
						} else {
							RepintInterventiModel.getData()[j].FLAGCONT = false;
							RepintInterventiModel.getData()[i].CONTINTERVENTO = 0;
						}
					}
				}
			}
		},

		// KAPIL - Below code commented out before implementing changes as on 1st Sep 2020
		// updateCompensativiPostRIPCheck: function (oSortedInterventiDateData) {

		// 	var that = this;
		// 	var riposiflag = false;
		// 	var oInterventiOraInizioTimestamp;
		// 	var oInterventiOraFineTimestamp;
		// 	var oInterventiCurrentDayDate;
		// 	var oFascioInizioCurrentDayDate;
		// 	var oFascioFineSameDayDate;
		// 	var oFascoInizioCurrentDayTimestamp;
		// 	var oFascioFineSameDayTimestamp;

		// 	var oRiposiWorkingDay = that.getOwnerComponent().getModel("viewProperties").getProperty("/oRiposiWorkingDay");
		// 	var oRiposiNonWorkingDay = that.getOwnerComponent().getModel("viewProperties").getProperty("/oRiposiNonWorkingDay");
		// 	var oRegoleCompensativi = that.getView().getModel("RegoleCompensativi").getData();

		// 	var uniqueinterventDates = $.unique(oSortedInterventiDateData.getData().map(function (value) {
		// 		return value.DATAINTERVENTO;
		// 	})); // Get Unique Interventi Dates

		// 	var sumOraIniFineMinsDIffSameIntervtDt = 0;
		// 	var checkOKCountDatewise = 0;
		// 	var multi = 0;
		// 	uniqueinterventDates.map(function (interventDate) {
		// 		sumOraIniFineMinsDIffSameIntervtDt = 0;
		// 		checkOKCountDatewise = 0;

		// 		var riposiArray = [];
		// 		var riposiJsonData = {};
		// 		var multiJsonData = {};

		// 		var j = 0;
		// 		var dateintervento;
		// 		var oInterventiDate;
		// 		var oInterventoNextDate;

		// 		if (oSortedInterventiDateData.getData().length > 1) {
		// 			for (var i = 0; i < oSortedInterventiDateData.getData().length; ++i) {
		// 				if (oSortedInterventiDateData.getData().length === 1 || i === oSortedInterventiDateData.getData().length - 1) {
		// 					break;
		// 				}
		// 				j = i + 1;

		// 				dateintervento = oSortedInterventiDateData.getData()[i].DATAINTERVENTO;
		// 				oInterventiDate = new Date(Formatter.formatDateToMMDDYYYY(dateintervento));
		// 				oInterventoNextDate = new Date(Formatter.formatDateToMMDDYYYY(dateintervento));
		// 				oInterventoNextDate.setDate(oInterventiDate.getDate() + 1);

		// 				//	interventiCurrentDateTimestamp = new Date(oInterventiDate.getFullYear(), oInterventiDate.getMonth(), oInterventiDate.getDate(), "00", "00", "00");

		// 				//	interventiNextDayDateTimestamp = new Date(oInterventoNextDate.getFullYear(), oInterventoNextDate.getMonth(), oInterventoNextDate.getDate(), "00","00","00");					

		// 				// PENDING to get value from ParamSet
		// 				// 1st Condition check - Implies next Interventi date is equal to current Interventi date + 1. E.g. current date = 14-02-2020 then next Interventi date = 15-02-2020
		// 				//if(oSortedInterventiDateData.getData()[j].DATAINTERVENTO === interventiNextDayDateTimestamp){ 

		// 				// if ((oSortedInterventiDateData.getData()[i].DATAINTERVENTO) === interventDate && (oSortedInterventiDateData.getData()[i].CHECKOK) ===
		// 				// 	"Y" && (!(oSortedInterventiDateData.getData()[i].FLAGCONT))) {
		// 				// 	sumOraIniFineMinsDIffSameIntervtDt = sumOraIniFineMinsDIffSameIntervtDt + oSortedInterventiDateData.getData()[i].MINDIFFORAINIFINE;
		// 				// 	checkOKCountDatewise = checkOKCountDatewise + 1;
		// 				// }

		// 				if ((oSortedInterventiDateData.getData()[i].DATAINTERVENTO === interventDate) && (oSortedInterventiDateData.getData()[i].CHECKOK) ===
		// 					"Y" && (!(oSortedInterventiDateData.getData()[i].FLAGCONT))) {
		// 					sumOraIniFineMinsDIffSameIntervtDt = sumOraIniFineMinsDIffSameIntervtDt + oSortedInterventiDateData.getData()[i].MINDIFFORAINIFINE;
		// 					checkOKCountDatewise = checkOKCountDatewise + 1;
		// 				}

		// 				// Check if next Interventi date value is current Interventi date +1. If so then RIP is checked for next record. 
		// 				// Here checkOKCountDatewise and sumOraIniFineMinsDIffSameIntervtDt of next record (Current Interventi date + 1) should be considered for current Interventi date record and not for next Interventi date record.
		// 				// E.g below: Here checkOKCountDatewise value of 8/06/2020 is 3 (Including RIP = X record) and sumOraIniFineMinsDIffSameIntervtDt = 240 mins (and not 150 mins)
		// 				// 				                        Chiamato da	    Causa	  Rip.	Minutes	repintDay	
		// 				// 8/6/2020	17:30	22:00	Working day	intervento 1	Causa 1			0		8/6/2020	count 8/6 minutes 240
		// 				// 8/6/2020	1:00	3:00	Working day	intervento 2	Causa 2			120		8/6/2020	
		// 				// 8/6/2020	8:00	8:30	Working day	intervento 3	Causa 3			30		8/6/2020	
		// 				// 9/6/2020	8:30	10:00	Working day	intervento 3	Causa 3	   X	90		8/6/2020	
		// 				// 9/6/2020	10:00	11:00	Working day	intervento 4	Causa 4			0		9/6/2020	count 9/6 minutes 0

		// 				// if ((new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData.getData()[j].DATAINTERVENTO))).toString() ===
		// 				// 	oInterventoNextDate.toString() && (oSortedInterventiDateData.getData()[j].FLAGCONT)) {
		// 				// 	sumOraIniFineMinsDIffSameIntervtDt = sumOraIniFineMinsDIffSameIntervtDt + oSortedInterventiDateData.getData()[j].MINDIFFORAINIFINE;
		// 				// 	checkOKCountDatewise = checkOKCountDatewise + 1;
		// 				// }
		// 				if ((new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData.getData()[i].DATAINTERVENTO))).toString() ===
		// 					oInterventoNextDate.toString() && (oSortedInterventiDateData.getData()[j].FLAGCONT)) {
		// 					sumOraIniFineMinsDIffSameIntervtDt = sumOraIniFineMinsDIffSameIntervtDt + oSortedInterventiDateData.getData()[j].MINDIFFORAINIFINE;
		// 					checkOKCountDatewise = checkOKCountDatewise + 1;
		// 				}
		// 			}
		// 		}

		// 		for (var c = 0; c < oRegoleCompensativi.length; c++) {
		// 			if (checkOKCountDatewise >= oRegoleCompensativi[0].N_INTERVENTI) {
		// 				multi = oRegoleCompensativi[0].VALORE;
		// 			}
		// 		}

		// 		for (var i = 0; i < oSortedInterventiDateData.getData().length; ++i) {

		// 			//  if (   (new Date(Formatter.formatDateToMMDDYYYY(RepintInterventiModel.getData()[j].DATAINTERVENTO))).toString() === oInterventoNextDate.toString()  ) 
		// 			//  ((new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData.getData()[i].DATAINTERVENTO))).toString() === interventDate.toString()

		// 			///if (oSortedInterventiDateData[i].DATAINTERVENTO === interventDate) { // Need to execute loop every time for given Interventi Date in order to get Riposi value for given Interventi Date				

		// 			// if (((new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData.getData()[i].DATAINTERVENTO))).toString() ===
		// 			// 		interventDate.toString())) {
		// 			// Need to execute loop every time for given Interventi Date in order to get Riposi value for given Interventi Date									
		// 			if (oSortedInterventiDateData.getData()[i].DATAINTERVENTO === interventDate.toString()) {
		// 				if (oSortedInterventiDateData.getData()[i].WORKINGDAY) { // Return for GIORNI = 1
		// 					for (var j = 0; j < oRiposiWorkingDay.length; ++j) {

		// 						// Check whether minute difference of Ora Inizio and Ora Fine is between DURATA_MIN & DURATA_MAX
		// 						if ((oRiposiWorkingDay[j].DURATA_MIN < sumOraIniFineMinsDIffSameIntervtDt && (sumOraIniFineMinsDIffSameIntervtDt <=
		// 								oRiposiWorkingDay[j].DURATA_MAX))) {

		// 							if (checkOKCountDatewise < 3) {
		// 								riposiJsonData = {
		// 									"InterventiDate": interventDate,
		// 									"RiposiValue": (oRiposiWorkingDay[j].VALORE * 8).toString() + "H",
		// 									"multi": "(" + 0 + " Multi)"
		// 								};
		// 							} else {
		// 								riposiJsonData = {
		// 									"InterventiDate": interventDate,
		// 									"RiposiValue": (oRiposiWorkingDay[j].VALORE * 8).toString() + "H",
		// 									"multi": "(" + multi.toString() + " Multi)"
		// 								};
		// 							}

		// 							riposiArray.push(riposiJsonData);
		// 							riposiJsonData = {};

		// 							riposiflag = true;
		// 							break;
		// 						}

		// 					}

		// 					if (!riposiflag) {
		// 						if (checkOKCountDatewise >= 3) {
		// 							multiJsonData = {
		// 								"InterventiDate": interventDate,
		// 								"RiposiValue": "0 H",
		// 								"multi": "(" + multi.toString() + " Multi)"
		// 							};

		// 							riposiArray.push(riposiJsonData);
		// 							riposiJsonData = {};
		// 						} else {
		// 							multiJsonData = {
		// 								"InterventiDate": interventDate,
		// 								"RiposiValue": "0 H",
		// 								"multi": "(" + 0 + " Multi)"
		// 							};

		// 							riposiArray.push(riposiJsonData);
		// 							riposiJsonData = {};
		// 						}
		// 					}

		// 				} else { // Return for GIORNI = 5

		// 					for (var j = 0; j < oRiposiNonWorkingDay.length; ++j) {

		// 						// Overlapping Range
		// 						// 240 - 480 
		// 						// 240 - 1440 
		// 						if ((oRiposiNonWorkingDay[j].DURATA_MIN === 240 && oRiposiNonWorkingDay[j].DURATA_MAX === 480) && (oRiposiNonWorkingDay[j]
		// 								.DURATA_MIN <
		// 								sumOraIniFineMinsDIffSameIntervtDt && (sumOraIniFineMinsDIffSameIntervtDt <= oRiposiNonWorkingDay[j].DURATA_MAX))) {

		// 							oInterventiOraInizioTimestamp = oSortedInterventiDateData.getData()[i].ORAINIZIOTIMESTAMP;
		// 							oInterventiOraFineTimestamp = oSortedInterventiDateData.getData()[i].ORAFINETIMESTAMP;
		// 							oInterventiCurrentDayDate = new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData.getData()[i].DATAINTERVENTO));
		// 							oFascioInizioCurrentDayDate = new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData.getData()[i].DATAINTERVENTO)); // Fascio Inizio current day
		// 							oFascioFineSameDayDate = new Date(oInterventiCurrentDayDate); // Fascio Fine current day

		// 							oFascoInizioCurrentDayTimestamp = new Date(oFascioInizioCurrentDayDate.getFullYear(), oFascioInizioCurrentDayDate.getMonth(),
		// 								oFascioInizioCurrentDayDate.getDate(), (oRiposiNonWorkingDay[j].FASCIA_INIZIO).split(":")[0], (oRiposiNonWorkingDay[j].FASCIA_INIZIO)
		// 								.split(":")[1], "00");

		// 							// Check if Ora Inizio and Ora Fine Timestamp is between 08:30 AM (FASCIO_INIZIO of IDREGOLA = 10) - 10:00 PM (FASCIO_FINE of IDREGOLA = 14). NOTE - Here we are not considering FASCIO_FINE(11:00 PM) of IDREGOLA = 10 
		// 							oFascioFineSameDayTimestamp = new Date(oFascioFineSameDayDate.getFullYear(), oFascioFineSameDayDate.getMonth(),
		// 								oFascioFineSameDayDate.getDate(), "22", "00", "00");

		// 							// Check if Ora Inizio and Ora Fine value is range between FASCIO_INIZIO and FASCIO_FINE value for same day 
		// 							// It mean to consider IDREGOLA = 10 and not IDREGOLA = 14 if below condition is true
		// 							if ((oInterventiOraInizioTimestamp > oFascoInizioCurrentDayTimestamp && oInterventiOraInizioTimestamp <=
		// 									oFascioFineSameDayTimestamp) && oInterventiOraFineTimestamp > oFascoInizioCurrentDayTimestamp &&
		// 								oInterventiOraFineTimestamp <= oFascioFineSameDayTimestamp) {

		// 								if (checkOKCountDatewise < 3) {
		// 									riposiJsonData = {
		// 										"InterventiDate": interventDate,
		// 										"RiposiValue": "0.5".toString() + "H", // IDREGOLA = 10 (Rule no. 10). VALORE = 0.5
		// 										"multi": "(" + 0 + " Multi)"
		// 									};
		// 								} else {
		// 									riposiJsonData = {
		// 										"InterventiDate": interventDate,
		// 										"RiposiValue": "0.5".toString() + "H",
		// 										"multi": "(" + multi.toString() + " Multi)"
		// 									};
		// 								}
		// 							} else { // If Ora Inizio Timestamp is > 08:30 AM & Ora Fine Timestamp is > 10:00 PM. In all other cases VALORE = 1, IDREGOLA = 14
		// 								if (checkOKCountDatewise < 3) {
		// 									riposiJsonData = {
		// 										"InterventiDate": interventDate,
		// 										"RiposiValue": "8".toString() + "H",
		// 										"multi": "(" + 0 + " Multi)"
		// 									};
		// 								} else {
		// 									riposiJsonData = {
		// 										"InterventiDate": interventDate,
		// 										"RiposiValue": "8".toString() + "H",
		// 										"multi": "(" + multi.toString() + " Multi)"
		// 									};
		// 								}
		// 							}

		// 							riposiArray.push(riposiJsonData);
		// 							riposiJsonData = {};

		// 							riposiflag = true;
		// 							break;

		// 						} else {
		// 							if ((oRiposiNonWorkingDay[j].DURATA_MIN < sumOraIniFineMinsDIffSameIntervtDt && (sumOraIniFineMinsDIffSameIntervtDt <=
		// 									oRiposiNonWorkingDay[j].DURATA_MAX))) {

		// 								if (checkOKCountDatewise < 3) {
		// 									riposiJsonData = {
		// 										"InterventiDate": interventDate,
		// 										"RiposiValue": (oRiposiNonWorkingDay[j].VALORE * 8).toString() + "H",
		// 										"multi": "(" + 0 + " Multi)"
		// 									};
		// 								} else {
		// 									riposiJsonData = {
		// 										"InterventiDate": interventDate,
		// 										"RiposiValue": (oRiposiNonWorkingDay[j].VALORE * 8).toString() + "H",
		// 										"multi": "(" + multi.toString() + " Multi)"
		// 									};
		// 								}

		// 								riposiArray.push(riposiJsonData);
		// 								riposiJsonData = {};

		// 								riposiflag = true;
		// 								break;
		// 							}
		// 						}
		// 					}

		// 					if (!riposiflag) {
		// 						if (checkOKCountDatewise >= 3) {
		// 							multiJsonData = {
		// 								"InterventiDate": interventDate,
		// 								"RiposiValue": "0 H",
		// 								"multi": "(" + multi.toString() + " Multi)"
		// 							};
		// 						} 
		// 						// *************** Commented below line of code as 0 H (0 Multi) should not be displayed as Riposi Value
		// 						// else {
		// 						// 	multiJsonData = {
		// 						// 		"InterventiDate": interventDate,
		// 						// 		"RiposiValue": "0 H",
		// 						// 		"multi": "(" + 0 + " Multi)"
		// 						// 	};
		// 						// }

		// 						riposiArray.push(riposiJsonData);
		// 						riposiJsonData = {};
		// 					}
		// 				}
		// 			}
		// 		} // End of for loop

		// 		var uniqueInterventiDateRiposi = that.unique(riposiArray);
		// 		var oInterventiDateModel = that.getView().byId("idTableInterventi").getModel("RepintInterventiModel");

		// 		// KAPIL - Please check below code. Commented to fix riposi issue as on 5th Aug
		// 		for (var index = 0; index < oSortedInterventiDateData.getData().length; ++index) {
		// 			for (var indexDt = 0; indexDt < uniqueInterventiDateRiposi.length; ++indexDt) {
		// 				//////// if ((new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData.getData()[index].DATAINTERVENTO))).toString() === (
		// 				// 		uniqueInterventiDateRiposi[indexDt].InterventiDate).toString()) {
		// 				if (oSortedInterventiDateData.getData()[index].DATAINTERVENTO === uniqueInterventiDateRiposi[indexDt].InterventiDate) {
		// 					oInterventiDateModel.getData()[index].RIPOSI = uniqueInterventiDateRiposi[indexDt].RiposiValue + " " +
		// 						uniqueInterventiDateRiposi[indexDt].multi; // Always first index for new Interventi date
		// 					//oSortedInterventiDateData.getData()[index].RIPOSI = uniqueInterventiDateRiposi[indexDt].RiposiValue; // Always first index for new Interventi date
		// 					uniqueInterventiDateRiposi.splice(0, 1);
		// 					break;
		// 				}
		// 			}
		// 		}

		// 		// KAPIL - Below code added on 5th Aug 
		// 		// for (var index = 0; index < oSortedInterventiDateData.getData().length; ++index) {
		// 		// 	for (var indexDt = 0; indexDt < uniqueInterventiDateRiposi.length; ++indexDt) {
		// 		// 		if (oSortedInterventiDateData.getData()[index].DATAINTERVENTO === uniqueInterventiDateRiposi[indexDt].InterventiDate) {
		// 		// 			for (var k = indexDt; k < uniqueInterventiDateRiposi.length; ++k) {
		// 		// 				// Always first index for new Interventi date
		// 		// 				oInterventiDateModel.getData()[index].RIPOSI = oInterventiDateModel.getData()[index].RIPOSI +
		// 		// 					uniqueInterventiDateRiposi[k].RiposiValue + " " + uniqueInterventiDateRiposi[k].multi;
		// 		// 				uniqueInterventiDateRiposi.splice(0, 1);
		// 		// 			}
		// 		// 			//break;
		// 		// 			///indexInter = indexDt + 1; 
		// 		// 		}
		// 		// 	}
		// 		// 	break;
		// 		// }

		// 		oInterventiDateModel.updateBindings(true);

		// 	});

		// },

		//// ----------------------------------------------------------------------------------------------------------------------------------
		// KAPIL - Below code added as on 1st Sep 2020 to fix Riposi calculation issue
		// Commented as on 2nd Sep 7:00 PM - To incorporate RIP logic changes as per excel sheet. Backup in seperate .js under Temp Folder.
		// updateCompensativiPostRIPCheck: function (oSortedInterventiDateData) {

		// 	var that = this;
		// 	var riposiflag = false;
		// 	var oInterventiOraInizioTimestamp;
		// 	var oInterventiOraFineTimestamp;
		// 	var oInterventiCurrentDayDate;
		// 	var oFascioInizioCurrentDayDate;
		// 	var oFascioFineSameDayDate;
		// 	var oFascoInizioCurrentDayTimestamp;
		// 	var oFascioFineSameDayTimestamp;
		// 	var oFascioFineoNextDayDate;
		// 	var oFascioFineoNextDayDate;
		// 	var oFascioFineNextDayTimestamp;
		// 	var oInterventiOraInizioTimestampRIP;
		// 	var oInterventiOraFineTimestampRIP;
		// 	var oInterventiCurrentDayDateRIP;
		// 	var oFascioInizioCurrentDayDateRIP;
		// 	var oFascioFineoNextDayDateRIP;
		// 	var oFascoInizioCurrentDayTimestampRIP;
		// 	var oFascioFineNextDayTimestampRIP;
		// 	var oFascioFineoCurrentDayDateRIP;
		// 	var oFascioFineCurrentDayTimestampRIP;

		// 	var oRiposiWorkingDay = that.getOwnerComponent().getModel("viewProperties").getProperty("/oRiposiWorkingDay");
		// 	var oRiposiNonWorkingDay = that.getOwnerComponent().getModel("viewProperties").getProperty("/oRiposiNonWorkingDay");
		// 	var oRegoleCompensativi = that.getView().getModel("RegoleCompensativi").getData();

		// 	var uniqueinterventDates = $.unique(oSortedInterventiDateData.getData().map(function (value) {
		// 		return value.DATAINTERVENTO;
		// 	})); // Get Unique Interventi Dates

		// 	var sumOraIniFineMinsDIffSameIntervtDt = 0;
		// 	var sumOraIniFineMinsDIffSameIntervtDtNonWorkDayfirstSlot = 0;
		// 	var sumOraIniFineMinsDIffSameIntervtDtNonWorkDaysecSlot = 0;
		// 	var	sumOraIniFineMinsDIffSameIntervtDtNonWorkDayfirstSlotRIP = 0
		// 	var	sumOraIniFineMinsDIffSameIntervtDtNonWorkDaysecSlotRIP = 0
		// 	var sumOraIniFineMinsDIffSameIntervtDtRIP = 0;

		// 	var checkOKCountDatewise = 0;
		// 	var multi = 0;
		// 	uniqueinterventDates.map(function (interventDate) {
		// 		sumOraIniFineMinsDIffSameIntervtDt = 0;
		// 		sumOraIniFineMinsDIffSameIntervtDtNonWorkDayfirstSlot = 0;
		// 		sumOraIniFineMinsDIffSameIntervtDtNonWorkDaysecSlot = 0;
		// 		sumOraIniFineMinsDIffSameIntervtDtNonWorkDayfirstSlotRIP = 0;
		// 		sumOraIniFineMinsDIffSameIntervtDtNonWorkDaysecSlotRIP = 0;			
		// 		sumOraIniFineMinsDIffSameIntervtDtRIP = 0; 
		// 		checkOKCountDatewise = 0;

		// 		var riposiArray = [];
		// 		var riposiJsonData = {};
		// 		var multiJsonData = {};

		// 		var j = 0;
		// 		var dateintervento;
		// 		var oInterventiDate;
		// 		var oInterventoNextDate;

		// 		if (oSortedInterventiDateData.getData().length > 1) {
		// 			for (var i = 0; i < oSortedInterventiDateData.getData().length; ++i) {
		// 				if (oSortedInterventiDateData.getData().length === 1 || i === oSortedInterventiDateData.getData().length - 1) {
		// 					break;
		// 				}
		// 				j = i + 1;

		// 				dateintervento = oSortedInterventiDateData.getData()[i].DATAINTERVENTO;
		// 				oInterventiDate = new Date(Formatter.formatDateToMMDDYYYY(dateintervento));
		// 				oInterventoNextDate = new Date(Formatter.formatDateToMMDDYYYY(dateintervento));
		// 				oInterventoNextDate.setDate(oInterventiDate.getDate() + 1);

		// 				if ((oSortedInterventiDateData.getData()[i].DATAINTERVENTO === interventDate) && (oSortedInterventiDateData.getData()[i].CHECKOK) ===
		// 					"Y" && (!(oSortedInterventiDateData.getData()[i].FLAGCONT))) {

		// 					//XX//////sumOraIniFineMinsDIffSameIntervtDt = sumOraIniFineMinsDIffSameIntervtDt + oSortedInterventiDateData.getData()[i].MINDIFFORAINIFINE;
		// 					checkOKCountDatewise = checkOKCountDatewise + 1;
		// 				}

		// 				// Check if next Interventi date value is current Interventi date + 1. If so then RIP is checked for next record. 
		// 				// Here checkOKCountDatewise and sumOraIniFineMinsDIffSameIntervtDt of next record (Current Interventi date + 1) should be considered for current Interventi date record and not for next Interventi date record.
		// 				// E.g below: Here checkOKCountDatewise value of 8/06/2020 is 3 (Including RIP = X record) and sumOraIniFineMinsDIffSameIntervtDt = 240 mins (and not 150 mins)
		// 				// 				                        Chiamato da	    Causa	  Rip.	Minutes	repintDay	
		// 				// 8/6/2020	17:30	22:00	Working day	intervento 1	Causa 1			0		8/6/2020	count 8/6 minutes 240
		// 				// 8/6/2020	1:00	3:00	Working day	intervento 2	Causa 2			120		8/6/2020	
		// 				// 8/6/2020	8:00	8:30	Working day	intervento 3	Causa 3			30		8/6/2020	
		// 				// 9/6/2020	8:30	10:00	Working day	intervento 3	Causa 3	   X	90		8/6/2020	
		// 				// 9/6/2020	10:00	11:00	Working day	intervento 4	Causa 4			0		9/6/2020	count 9/6 minutes 0

		// 				if ((new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData.getData()[i].DATAINTERVENTO))).toString() ===
		// 					oInterventoNextDate.toString() && (oSortedInterventiDateData.getData()[j].FLAGCONT)) {

		// 					//xxxxx///sumOraIniFineMinsDIffSameIntervtDt = sumOraIniFineMinsDIffSameIntervtDt + oSortedInterventiDateData.getData()[j].MINDIFFORAINIFINE;

		// 					checkOKCountDatewise = checkOKCountDatewise + 1;
		// 				}
		// 			}
		// 		}

		// 		for (var c = 0; c < oRegoleCompensativi.length; c++) {
		// 			if (checkOKCountDatewise >= oRegoleCompensativi[0].N_INTERVENTI) {
		// 				multi = oRegoleCompensativi[0].VALORE;
		// 			}
		// 		}

		// 		oSortedInterventiDateData = oSortedInterventiDateData.getData();
		// 		for (var i = 0; i < oSortedInterventiDateData.length; ++i) {

		// 			if (oSortedInterventiDateData.length === 1 || i === oSortedInterventiDateData.length - 1) {
		// 				break;
		// 			}
		// 			j = i + 1;

		// 			dateintervento = oSortedInterventiDateData.getData()[i].DATAINTERVENTO;
		// 			oInterventiDate = new Date(Formatter.formatDateToMMDDYYYY(dateintervento));
		// 			oInterventoNextDate = new Date(Formatter.formatDateToMMDDYYYY(dateintervento));
		// 			oInterventoNextDate.setDate(oInterventiDate.getDate() + 1);

		// 			if (oSortedInterventiDateData[i].DATAINTERVENTO === interventDate) { // Need to execute loop every time for given Interventi Date in order to get Riposi value for given Interventi Date								 						
		// 				if (oSortedInterventiDateData[i].WORKINGDAY) { // Return for GIORNI = 1

		// 					// To execute below code only once per Interventi Date as it iterates all the records for specific Interventi Date. 
		// 					// So no need to iterate it again else sumOraIniFineMinsDIffSameIntervtDt value increases on subsequent iterate
		// 					// So reset sumOraIniFineMinsDIffSameIntervtDt every time
		// 					sumOraIniFineMinsDIffSameIntervtDt = 0;
		// 					sumOraIniFineMinsDIffSameIntervtDtNonWorkDayfirstSlotRIP = 0;
		// 					sumOraIniFineMinsDIffSameIntervtDtNonWorkDaysecSlotRIP = 0;								
		// 					$.each(oSortedInterventiDateData, function (index, value) {

		// 						if ((value.DATAINTERVENTO).toString() === interventDate.toString() && (value.CHECKOK) === "Y" && (!(value.FLAGCONT))) { // RIP checkbox should not be checked as checked record Interventi date gets counted into previous date for "Multi" count increment by 1 (checkOKCountDatewise++)

		// 							// -------------------------          NEXT DAY/SLOT CALCULATION		--------------------------------------------
		// 							oInterventiOraInizioTimestamp = value.ORAINIZIOTIMESTAMP;
		// 							oInterventiOraFineTimestamp = value.ORAFINETIMESTAMP;

		// 							oInterventiCurrentDayDate = new Date(Formatter.formatDateToMMDDYYYY(value.DATAINTERVENTO));
		// 							oFascioInizioCurrentDayDate = new Date(Formatter.formatDateToMMDDYYYY(value.DATAINTERVENTO)); // Fascio Inizio current day

		// 							oInterventiCurrentDayDate = new Date(Formatter.formatDateToMMDDYYYY(value.DATAINTERVENTO));
		// 							oFascioFineoNextDayDate = new Date(Formatter.formatDateToMMDDYYYY(value.DATAINTERVENTO));
		// 							oFascioFineoNextDayDate.setDate(oInterventiCurrentDayDate.getDate() + 1); // Fascio Fine Next day

		// 							// Fascio Inizio Current Day Timestamp
		// 							oFascoInizioCurrentDayTimestamp = new Date(oFascioInizioCurrentDayDate.getFullYear(), oFascioInizioCurrentDayDate.getMonth(),
		// 								oFascioInizioCurrentDayDate.getDate(), "22", "00", "00");

		// 							// Fascio Fine Next Day Timestamp
		// 							oFascioFineNextDayTimestamp = new Date(oFascioFineoNextDayDate.getFullYear(), oFascioFineoNextDayDate.getMonth(),
		// 								oFascioFineoNextDayDate.getDate(), "08", "30", "00");

		// 							// Check if Ora Inizio and Ora Fine value is range between FASCIO_INIZIO (for same day) and FASCIO_FINE (Next Day)
		// 							if ((oInterventiOraInizioTimestamp >= oFascoInizioCurrentDayTimestamp && oInterventiOraInizioTimestamp <=
		// 									oFascioFineNextDayTimestamp) && oInterventiOraFineTimestamp >= oFascoInizioCurrentDayTimestamp &&
		// 								oInterventiOraFineTimestamp <= oFascioFineNextDayTimestamp) {

		// 								sumOraIniFineMinsDIffSameIntervtDt = sumOraIniFineMinsDIffSameIntervtDt + value.MINDIFFORAINIFINE;
		// 							}
		// 						} // End of - ((value.DATAINTERVENTO).toString() === interventDate.toString() && (value.CHECKOK) === "Y" && (!(value.FLAGCONT)))

		// 					});

		// 						// *********************  Check for RIP  ************************
		// 						if ((new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[j].DATAINTERVENTO))).toString() ===
		// 							oInterventoNextDate.toString() && (oSortedInterventiDateData[j].FLAGCONT)) {

		// 							// *********** Check whether next Interventi Day (Interventi Day + 1 - RIP Checked one) is working or non-working day *************
		// 							// Working Day Check
		// 							if (oSortedInterventiDateData[j].WORKINGDAY) {
		// 								oInterventiOraInizioTimestampRIP = oSortedInterventiDateData[j].ORAINIZIOTIMESTAMP;
		// 								oInterventiOraFineTimestampRIP = oSortedInterventiDateData[j].ORAFINETIMESTAMP;

		// 								oInterventiCurrentDayDateRIP = new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[j].DATAINTERVENTO));
		// 								oFascioInizioCurrentDayDateRIP = new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[j].DATAINTERVENTO)); // Fascio Inizio current day
		// 								oFascioFineoNextDayDateRIP.setDate(oInterventiCurrentDayDateRIP.getDate() + 1); // Fascio Fine Next day

		// 								// Fascio Inizio Current Day Timestamp
		// 								oFascoInizioCurrentDayTimestampRIP = new Date(oFascioInizioCurrentDayDateRIP.getFullYear(),
		// 									oFascioInizioCurrentDayDateRIP.getMonth(),
		// 									oFascioInizioCurrentDayDateRIP.getDate(), "22", "00", "00");

		// 								// Fascio Fine Next Day Timestamp
		// 								oFascioFineNextDayTimestampRIP = new Date(oFascioFineoNextDayDateRIP.getFullYear(), oFascioFineoNextDayDateRIP.getMonth(),
		// 									oFascioFineoNextDayDateRIP.getDate(), "08", "30", "00");

		// 								// Check if Ora Inizio and Ora Fine value is range between FASCIO_INIZIO (for same day) and FASCIO_FINE (Next Day)
		// 								if ((oInterventiOraInizioTimestampRIP >= oFascoInizioCurrentDayTimestampRIP && oInterventiOraInizioTimestampRIP <=
		// 										oFascioFineNextDayTimestampRIP) && oInterventiOraFineTimestampRIP >= oFascoInizioCurrentDayTimestampRIP &&
		// 									oInterventiOraFineTimestampRIP <= oFascioFineNextDayTimestampRIP) {

		// 									sumOraIniFineMinsDIffSameIntervtDt = sumOraIniFineMinsDIffSameIntervtDt + value.MINDIFFORAINIFINE;
		// 								}

		// 							}
		// 							// Non Working Day Check
		// 							else {
		// 								// -------------------------          CURRENT DAY CALCULATION		--------------------------------------------
		// 								oInterventiOraInizioTimestampRIP = oSortedInterventiDateData[j].ORAINIZIOTIMESTAMP;
		// 								oInterventiOraFineTimestampRIP = oSortedInterventiDateData[j].ORAFINETIMESTAMP;

		// 								oInterventiCurrentDayDateRIP = new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[j].DATAINTERVENTO));
		// 								oFascioInizioCurrentDayDateRIP = new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[j].DATAINTERVENTO)); // Fascio Inizio current day
		// 								oFascioFineoCurrentDayDateRIP.setDate(oInterventiCurrentDayDateRIP); // Fascio Fine Current day

		// 								// Fascio Inizio Current Day Timestamp
		// 								oFascoInizioCurrentDayTimestampRIP = new Date(oFascioInizioCurrentDayDateRIP.getFullYear(),
		// 									oFascioInizioCurrentDayDateRIP.getMonth(),
		// 									oFascioInizioCurrentDayDateRIP.getDate(), "08", "30", "00");

		// 								// Fascio Fine Current Day Timestamp
		// 								oFascioFineCurrentDayTimestampRIP = new Date(oFascioFineoCurrentDayDateRIP.getFullYear(), oFascioFineoCurrentDayDateRIP.getMonth(),
		// 									oFascioFineoCurrentDayDateRIP.getDate(), "22", "00", "00");

		// 								// Check if Ora Inizio and Ora Fine value is range between FASCIO_INIZIO (08:30 AM) and FASCIO_FINE (10:00 PM) value for same day/first slot 
		// 								if ((oInterventiOraInizioTimestampRIP >= oFascoInizioCurrentDayTimestampRIP && oInterventiOraInizioTimestampRIP <=
		// 										oFascioFineCurrentDayTimestampRIP) && oInterventiOraFineTimestampRIP >= oFascoInizioCurrentDayTimestampRIP &&
		// 									oInterventiOraFineTimestampRIP <= oFascioFineCurrentDayTimestampRIP) {

		// 									sumOraIniFineMinsDIffSameIntervtDtNonWorkDayfirstSlotRIP = sumOraIniFineMinsDIffSameIntervtDtNonWorkDayfirstSlotRIP +
		// 										value.MINDIFFORAINIFINE;
		// 								}

		// 								// -------------------------          NEXT SLOT/DAY CALCULATION		--------------------------------------------	
		// 								oInterventiOraInizioTimestampRIP = oSortedInterventiDateData[j].ORAINIZIOTIMESTAMP;
		// 								oInterventiOraFineTimestampRIP = oSortedInterventiDateData[j].ORAFINETIMESTAMP;

		// 								oInterventiCurrentDayDateRIP = new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[j].DATAINTERVENTO));
		// 								oFascioInizioCurrentDayDateRIP = new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[j].DATAINTERVENTO)); // Fascio Inizio current day
		// 								oFascioFineoNextDayDateRIP.setDate(oInterventiCurrentDayDateRIP.getDate() + 1); // Fascio Fine Next day										

		// 								// Fascio Inizio Current Day Timestamp
		// 								oFascoInizioCurrentDayTimestampRIP = new Date(oFascioInizioCurrentDayDateRIP.getFullYear(),
		// 									oFascioInizioCurrentDayDateRIP.getMonth(),
		// 									oFascioInizioCurrentDayDateRIP.getDate(), "22", "00", "00");

		// 								// Fascio Fine Next Day Timestamp
		// 								oFascioFineNextDayTimestampRIP = new Date(oFascioFineoNextDayDateRIP.getFullYear(), oFascioFineoNextDayDateRIP.getMonth(),
		// 									oFascioFineoNextDayDateRIP.getDate(), "08", "30", "00");

		// 								// Check if Ora Inizio and Ora Fine value is range between FASCIO_INIZIO (for same day) and FASCIO_FINE (Next Day)
		// 								if ((oInterventiOraInizioTimestampRIP >= oFascoInizioCurrentDayTimestampRIP && oInterventiOraInizioTimestampRIP <=
		// 										oFascioFineNextDayTimestampRIP) && oInterventiOraFineTimestampRIP >= oFascoInizioCurrentDayTimestampRIP &&
		// 									oInterventiOraFineTimestampRIP <= oFascioFineNextDayTimestampRIP) {

		// 									sumOraIniFineMinsDIffSameIntervtDtNonWorkDaysecSlotRIP = sumOraIniFineMinsDIffSameIntervtDtNonWorkDaysecSlotRIP + value
		// 										.MINDIFFORAINIFINE;
		// 								}

		// 							} // End of else - Non Working Day Check
		// 							if(sumOraIniFineMinsDIffSameIntervtDtNonWorkDayfirstSlotRIP > 0){
		// 								sumOraIniFineMinsDIffSameIntervtDt = sumOraIniFineMinsDIffSameIntervtDt + sumOraIniFineMinsDIffSameIntervtDtNonWorkDayfirstSlotRIP;	
		// 							}
		// 							if(sumOraIniFineMinsDIffSameIntervtDtNonWorkDaysecSlotRIP > 0){
		// 								sumOraIniFineMinsDIffSameIntervtDt = sumOraIniFineMinsDIffSameIntervtDt + sumOraIniFineMinsDIffSameIntervtDtNonWorkDaysecSlotRIP;	
		// 							}
		// 						} // End of if((new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[i].DATAINTERVENTO))).toString() === oInterventoNextDate.toString() && (oSortedInterventiDateData[j].FLAGCONT)

		// 					for (var j = 0; j < oRiposiWorkingDay.length; ++j) {
		// 						// Check whether minute difference of Ora Inizio and Ora Fine is between DURATA_MIN & DURATA_MAX
		// 						if ((oRiposiWorkingDay[j].DURATA_MIN < sumOraIniFineMinsDIffSameIntervtDt && (sumOraIniFineMinsDIffSameIntervtDt <=
		// 								oRiposiWorkingDay[j].DURATA_MAX))) {
		// 							if (checkOKCountDatewise < 3) {
		// 								riposiJsonData = {
		// 									"InterventiDate": interventDate,
		// 									"RiposiValue": (oRiposiWorkingDay[j].VALORE * 8).toString() + "H",
		// 									"multi": "(" + 0 + " Multi)"
		// 								};
		// 							} else {
		// 								riposiJsonData = {
		// 									"InterventiDate": interventDate,
		// 									"RiposiValue": (oRiposiWorkingDay[j].VALORE * 8).toString() + "H",
		// 									"multi": "(" + multi.toString() + " Multi)"
		// 								};
		// 							}

		// 							riposiArray.push(riposiJsonData);
		// 							riposiJsonData = {};

		// 							riposiflag = true;
		// 							break;

		// 						} // End of if

		// 					}

		// 					if (!riposiflag) {
		// 						if (checkOKCountDatewise >= 3) {
		// 							multiJsonData = {
		// 								"InterventiDate": interventDate,
		// 								"RiposiValue": "0 H",
		// 								"multi": "(" + multi.toString() + " Multi)"
		// 							};

		// 							// riposiArray.push(riposiJsonData);
		// 							// riposiJsonData = {};
		// 						}
		// 						// *************** Commented below line of code as 0 H (0 Multi) should not be displayed as Riposi Value
		// 						// else {
		// 						// 	multiJsonData = {
		// 						// 		"InterventiDate": interventDate,
		// 						// 		"RiposiValue": "0 H",
		// 						// 		"multi": "(" + 0 + " Multi)"
		// 						// 	};
		// 						// }
		// 						riposiArray.push(multiJsonData);
		// 						multiJsonData = {};

		// 					}

		// 				} else { // Return for GIORNI = 5

		// 					/// *************************************************************************************************************************************************

		// 					// To execute below code only once per Interventi Date as it iterates all the records for specific Interventi Date. 
		// 					// So no need to iterate it again else sumOraIniFineMinsDIffSameIntervtDt value increases on subsequent iterate
		// 					// So reset sumOraIniFineMinsDIffSameIntervtDtNonWorkDayfirstSlot and sumOraIniFineMinsDIffSameIntervtDtNonWorkDaysecSlot every time
		// 					sumOraIniFineMinsDIffSameIntervtDtNonWorkDayfirstSlot = 0;
		// 					sumOraIniFineMinsDIffSameIntervtDtNonWorkDaysecSlot = 0;
		// 					sumOraIniFineMinsDIffSameIntervtDtRIP = 0;
		// 					// For Non Working Day
		// 					$.each(oSortedInterventiDateData, function (index, value) {
		// 						if ((value.DATAINTERVENTO).toString() === interventDate.toString() && (value.CHECKOK) === "Y" && (!(value.FLAGCONT))) { // RIP checkbox should not be checked as checked record Interventi date gets counted into previous date for "Multi" count increment by 1 (checkOKCountDatewise++)
		// 							/////////sumOraIniFineMinsDIffSameIntervtDt = sumOraIniFineMinsDIffSameIntervtDt + value.MINDIFFORAINIFINE;

		// 							// -------------------------          CURRENT DAY CALCULATION		--------------------------------------------
		// 							oInterventiOraInizioTimestamp = value.ORAINIZIOTIMESTAMP;
		// 							oInterventiOraFineTimestamp = value.ORAFINETIMESTAMP;

		// 							oInterventiCurrentDayDate = new Date(Formatter.formatDateToMMDDYYYY(value.DATAINTERVENTO));
		// 							oFascioInizioCurrentDayDate = new Date(Formatter.formatDateToMMDDYYYY(value.DATAINTERVENTO)); // Fascio Inizio current day
		// 							oFascioFineSameDayDate = new Date(oInterventiCurrentDayDate); // Fascio Fine current day

		// 							// Fascio Inizio Current Day Timestamp
		// 							oFascoInizioCurrentDayTimestamp = new Date(oFascioInizioCurrentDayDate.getFullYear(), oFascioInizioCurrentDayDate.getMonth(),
		// 								oFascioInizioCurrentDayDate.getDate(), "08", "30", "00");

		// 							// Fasco Fine Current Day Timestamp
		// 							// Check if Ora Inizio and Ora Fine Timestamp is between 08:30 AM (FASCIO_INIZIO of IDREGOLA = 10) - 10:00 PM (FASCIO_FINE of IDREGOLA = 14). NOTE - Here we are not considering FASCIO_FINE(11:00 PM) of IDREGOLA = 10 
		// 							oFascioFineSameDayTimestamp = new Date(oFascioFineSameDayDate.getFullYear(), oFascioFineSameDayDate.getMonth(),
		// 								oFascioFineSameDayDate.getDate(), "22", "00", "00");

		// 							// Check if Ora Inizio and Ora Fine value is range between FASCIO_INIZIO and FASCIO_FINE value for same day/first slot 
		// 							if ((oInterventiOraInizioTimestamp >= oFascoInizioCurrentDayTimestamp && oInterventiOraInizioTimestamp <=
		// 									oFascioFineSameDayTimestamp) && oInterventiOraFineTimestamp >= oFascoInizioCurrentDayTimestamp &&
		// 								oInterventiOraFineTimestamp <= oFascioFineSameDayTimestamp) {
		// 								sumOraIniFineMinsDIffSameIntervtDtNonWorkDayfirstSlot = sumOraIniFineMinsDIffSameIntervtDtNonWorkDayfirstSlot + value.MINDIFFORAINIFINE;
		// 							}

		// 							// -------------------------          NEXT SLOT/DAY CALCULATION		--------------------------------------------								 
		// 							oInterventiCurrentDayDate = new Date(Formatter.formatDateToMMDDYYYY(value.DATAINTERVENTO));
		// 							oFascioFineoNextDayDate = new Date(Formatter.formatDateToMMDDYYYY(value.DATAINTERVENTO));
		// 							oFascioFineoNextDayDate.setDate(oInterventiCurrentDayDate.getDate() + 1); // Fascio Fine Next day

		// 							// Fascio Inizio Current Day Timestamp
		// 							oFascoInizioCurrentDayTimestamp = new Date(oFascioInizioCurrentDayDate.getFullYear(), oFascioInizioCurrentDayDate.getMonth(),
		// 								oFascioInizioCurrentDayDate.getDate(), "22", "00", "00");

		// 							// Fascio Fine Next Day Timestamp
		// 							oFascioFineNextDayTimestamp = new Date(oFascioFineoNextDayDate.getFullYear(), oFascioFineoNextDayDate.getMonth(),
		// 								oFascioFineoNextDayDate.getDate(), "08", "30", "00");

		// 							// Check if Ora Inizio and Ora Fine value is range between FASCIO_INIZIO (for same day) and FASCIO_FINE (Next Day)
		// 							if ((oInterventiOraInizioTimestamp >= oFascoInizioCurrentDayTimestamp && oInterventiOraInizioTimestamp <=
		// 									oFascioFineNextDayTimestamp) && oInterventiOraFineTimestamp >= oFascoInizioCurrentDayTimestamp &&
		// 								oInterventiOraFineTimestamp <= oFascioFineNextDayTimestamp) {
		// 								sumOraIniFineMinsDIffSameIntervtDtNonWorkDaysecSlot = sumOraIniFineMinsDIffSameIntervtDtNonWorkDaysecSlot + value
		// 									.MINDIFFORAINIFINE;
		// 							}

		// 						}

		// 					});

		// 						// *********************  Check for RIP  ************************
		// 						if ((new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[j].DATAINTERVENTO))).toString() ===
		// 							oInterventoNextDate.toString() && (oSortedInterventiDateData[j].FLAGCONT)) {

		// 							// *********** Check whether next Interventi Day (Interventi Day + 1 - RIP Checked one) is working or non-working day *************
		// 							// Working Day Check
		// 							if (oSortedInterventiDateData[j].WORKINGDAY) {
		// 								oInterventiOraInizioTimestampRIP = oSortedInterventiDateData[j].ORAINIZIOTIMESTAMP;
		// 								oInterventiOraFineTimestampRIP = oSortedInterventiDateData[j].ORAFINETIMESTAMP;

		// 								oInterventiCurrentDayDateRIP = new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[j].DATAINTERVENTO));
		// 								oFascioInizioCurrentDayDateRIP = new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[j].DATAINTERVENTO)); // Fascio Inizio current day
		// 								oFascioFineoNextDayDateRIP.setDate(oInterventiCurrentDayDateRIP.getDate() + 1); // Fascio Fine Next day

		// 								// Fascio Inizio Current Day Timestamp
		// 								oFascoInizioCurrentDayTimestampRIP = new Date(oFascioInizioCurrentDayDateRIP.getFullYear(),
		// 									oFascioInizioCurrentDayDateRIP.getMonth(),
		// 									oFascioInizioCurrentDayDateRIP.getDate(), "22", "00", "00");

		// 								// Fascio Fine Next Day Timestamp
		// 								oFascioFineNextDayTimestampRIP = new Date(oFascioFineoNextDayDateRIP.getFullYear(), oFascioFineoNextDayDateRIP.getMonth(),
		// 									oFascioFineoNextDayDateRIP.getDate(), "08", "30", "00");

		// 								// Check if Ora Inizio and Ora Fine value is range between FASCIO_INIZIO (for same day) and FASCIO_FINE (Next Day)
		// 								if ((oInterventiOraInizioTimestampRIP >= oFascoInizioCurrentDayTimestampRIP && oInterventiOraInizioTimestampRIP <=
		// 										oFascioFineNextDayTimestampRIP) && oInterventiOraFineTimestampRIP >= oFascoInizioCurrentDayTimestampRIP &&
		// 									oInterventiOraFineTimestampRIP <= oFascioFineNextDayTimestampRIP) {

		// 									sumOraIniFineMinsDIffSameIntervtDtRIP = sumOraIniFineMinsDIffSameIntervtDtRIP + value.MINDIFFORAINIFINE;
		// 								}

		// 							}
		// 							// Non Working Day Check
		// 							else {
		// 								// -------------------------          CURRENT DAY CALCULATION		--------------------------------------------
		// 								oInterventiOraInizioTimestampRIP = oSortedInterventiDateData[j].ORAINIZIOTIMESTAMP;
		// 								oInterventiOraFineTimestampRIP = oSortedInterventiDateData[j].ORAFINETIMESTAMP;

		// 								oInterventiCurrentDayDateRIP = new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[j].DATAINTERVENTO));
		// 								oFascioInizioCurrentDayDateRIP = new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[j].DATAINTERVENTO)); // Fascio Inizio current day
		// 								oFascioFineoCurrentDayDateRIP.setDate(oInterventiCurrentDayDateRIP); // Fascio Fine Current day

		// 								// Fascio Inizio Current Day Timestamp
		// 								oFascoInizioCurrentDayTimestampRIP = new Date(oFascioInizioCurrentDayDateRIP.getFullYear(),
		// 									oFascioInizioCurrentDayDateRIP.getMonth(),
		// 									oFascioInizioCurrentDayDateRIP.getDate(), "08", "30", "00");

		// 								// Fascio Fine Current Day Timestamp
		// 								oFascioFineCurrentDayTimestampRIP = new Date(oFascioFineoCurrentDayDateRIP.getFullYear(), oFascioFineoCurrentDayDateRIP.getMonth(),
		// 									oFascioFineoCurrentDayDateRIP.getDate(), "22", "00", "00");

		// 								// Check if Ora Inizio and Ora Fine value is range between FASCIO_INIZIO (08:30 AM) and FASCIO_FINE (10:00 PM) value for same day/first slot 
		// 								if ((oInterventiOraInizioTimestampRIP >= oFascoInizioCurrentDayTimestampRIP && oInterventiOraInizioTimestampRIP <=
		// 										oFascioFineCurrentDayTimestampRIP) && oInterventiOraFineTimestampRIP >= oFascoInizioCurrentDayTimestampRIP &&
		// 									oInterventiOraFineTimestampRIP <= oFascioFineCurrentDayTimestampRIP) {

		// 									sumOraIniFineMinsDIffSameIntervtDtNonWorkDayfirstSlotRIP = sumOraIniFineMinsDIffSameIntervtDtNonWorkDayfirstSlotRIP +
		// 										value.MINDIFFORAINIFINE;
		// 								}

		// 								// -------------------------          NEXT SLOT/DAY CALCULATION		--------------------------------------------	
		// 								oInterventiOraInizioTimestampRIP = oSortedInterventiDateData[j].ORAINIZIOTIMESTAMP;
		// 								oInterventiOraFineTimestampRIP = oSortedInterventiDateData[j].ORAFINETIMESTAMP;

		// 								oInterventiCurrentDayDateRIP = new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[j].DATAINTERVENTO));
		// 								oFascioInizioCurrentDayDateRIP = new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[j].DATAINTERVENTO)); // Fascio Inizio current day
		// 								oFascioFineoNextDayDateRIP.setDate(oInterventiCurrentDayDateRIP.getDate() + 1); // Fascio Fine Next day										

		// 								// Fascio Inizio Current Day Timestamp
		// 								oFascoInizioCurrentDayTimestampRIP = new Date(oFascioInizioCurrentDayDateRIP.getFullYear(),
		// 									oFascioInizioCurrentDayDateRIP.getMonth(),
		// 									oFascioInizioCurrentDayDateRIP.getDate(), "22", "00", "00");

		// 								// Fascio Fine Next Day Timestamp
		// 								oFascioFineNextDayTimestampRIP = new Date(oFascioFineoNextDayDateRIP.getFullYear(), oFascioFineoNextDayDateRIP.getMonth(),
		// 									oFascioFineoNextDayDateRIP.getDate(), "08", "30", "00");

		// 								// Check if Ora Inizio and Ora Fine value is range between FASCIO_INIZIO (for same day) and FASCIO_FINE (Next Day)
		// 								if ((oInterventiOraInizioTimestampRIP >= oFascoInizioCurrentDayTimestampRIP && oInterventiOraInizioTimestampRIP <=
		// 										oFascioFineNextDayTimestampRIP) && oInterventiOraFineTimestampRIP >= oFascoInizioCurrentDayTimestampRIP &&
		// 									oInterventiOraFineTimestampRIP <= oFascioFineNextDayTimestampRIP) {

		// 									sumOraIniFineMinsDIffSameIntervtDtNonWorkDaysecSlotRIP = sumOraIniFineMinsDIffSameIntervtDtNonWorkDaysecSlotRIP + value
		// 										.MINDIFFORAINIFINE;
		// 								}

		// 							} // End of else - Non Working Day Check
		// 							if(sumOraIniFineMinsDIffSameIntervtDtNonWorkDayfirstSlotRIP > 0){
		// 								sumOraIniFineMinsDIffSameIntervtDtNonWorkDayfirstSlot = sumOraIniFineMinsDIffSameIntervtDtNonWorkDayfirstSlot + sumOraIniFineMinsDIffSameIntervtDtNonWorkDayfirstSlotRIP;	
		// 							}
		// 							if(sumOraIniFineMinsDIffSameIntervtDtNonWorkDaysecSlotRIP > 0){
		// 								sumOraIniFineMinsDIffSameIntervtDtNonWorkDaysecSlot = sumOraIniFineMinsDIffSameIntervtDtNonWorkDaysecSlot + sumOraIniFineMinsDIffSameIntervtDtNonWorkDaysecSlotRIP;	
		// 							}
		// 						} // End of if((new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[i].DATAINTERVENTO))).toString() === oInterventoNextDate.toString() && (oSortedInterventiDateData[j].FLAGCONT)

		// 					for (var j = 0; j < oRiposiNonWorkingDay.length; ++j) {
		// 						// First Slot (08:30:00 AM - 11:00:00 PM - In fact to consider 10:00 PM) 
		// 						// Check if Ora Inizio and Ora Fine value minutes difference is in range between FASCIO_INIZIO and FASCIO_FINE value for same day 
		// 						if ((oRiposiNonWorkingDay[j].DURATA_MIN) < sumOraIniFineMinsDIffSameIntervtDtNonWorkDayfirstSlot && (
		// 								sumOraIniFineMinsDIffSameIntervtDtNonWorkDayfirstSlot <=
		// 								oRiposiNonWorkingDay[j].DURATA_MAX)) {

		// 							// *************** Check if OraInzio Timestamp and Ora Fine Timestamp is between FASCIA_INIZIO and FASCIA_FINE timestamp
		// 							// First slot - 08:30 AM - 10:00 PM (22:00)
		// 							oInterventiOraInizioTimestamp = oSortedInterventiDateData[i].ORAINIZIOTIMESTAMP;
		// 							oInterventiOraFineTimestamp = oSortedInterventiDateData[i].ORAFINETIMESTAMP;
		// 							oInterventiCurrentDayDate = new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[i].DATAINTERVENTO));

		// 							oFascioInizioCurrentDayDate = new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[i].DATAINTERVENTO)); // Fascio Inizio current day
		// 							oFascioFineSameDayDate = new Date(oInterventiCurrentDayDate); // Fascio Fine current day

		// 							oFascoInizioCurrentDayTimestamp = new Date(oFascioInizioCurrentDayDate.getFullYear(), oFascioInizioCurrentDayDate.getMonth(),
		// 								oFascioInizioCurrentDayDate.getDate(), "08", "30", "00");

		// 							// Check if Ora Inizio and Ora Fine Timestamp is between 08:30 AM (FASCIO_INIZIO of IDREGOLA = 10) - 10:00 PM (FASCIO_FINE of IDREGOLA = 14). NOTE - Here we are not considering FASCIO_FINE(11:00 PM) of IDREGOLA = 10 
		// 							oFascioFineSameDayTimestamp = new Date(oFascioFineSameDayDate.getFullYear(), oFascioFineSameDayDate.getMonth(),
		// 								oFascioFineSameDayDate.getDate(), "22", "00", "00");

		// 							// Check if Ora Inizio and Ora Fine value is range between FASCIO_INIZIO and FASCIO_FINE value for same day/first slot
		// 							if ((oInterventiOraInizioTimestamp >= oFascoInizioCurrentDayTimestamp && oInterventiOraInizioTimestamp <=
		// 									oFascioFineSameDayTimestamp) && oInterventiOraFineTimestamp >= oFascoInizioCurrentDayTimestamp &&
		// 								oInterventiOraFineTimestamp <= oFascioFineSameDayTimestamp) {
		// 								if (checkOKCountDatewise < 3) {
		// 									riposiJsonData = {
		// 										"InterventiDate": interventDate,
		// 										"RiposiValue": (oRiposiNonWorkingDay[j].VALORE * 8).toString() + "H",
		// 										"multi": "(" + 0 + " Multi)"
		// 									};
		// 								} else {
		// 									riposiJsonData = {
		// 										"InterventiDate": interventDate,
		// 										"RiposiValue": (oRiposiNonWorkingDay[j].VALORE * 8).toString() + "H",
		// 										"multi": "(" + multi.toString() + " Multi)"
		// 									};
		// 								}
		// 							}

		// 							riposiArray.push(riposiJsonData);
		// 							riposiJsonData = {};

		// 							riposiflag = true;
		// 							break;
		// 						}
		// 						// Second Slot (10:00:00 PM - 08:30:00 AM) 
		// 						// Check if Ora Inizio and Ora Fine value minutes difference is in range between FASCIO_INIZIO for same day and FASCIO_FINE value of next day
		// 						else {

		// 							if ((oRiposiNonWorkingDay[j].DURATA_MIN) < sumOraIniFineMinsDIffSameIntervtDtNonWorkDaysecSlot && (
		// 									sumOraIniFineMinsDIffSameIntervtDtNonWorkDaysecSlot <=
		// 									oRiposiNonWorkingDay[j].DURATA_MAX)) {

		// 								// *************** Check if OraInzio Timestamp and Ora Fine Timestamp is between FASCIA_INIZIO and FASCIA_FINE timestamp 
		// 								// Second slot - 22:00 PM - 08:30 AM
		// 								oInterventiOraInizioTimestamp = oSortedInterventiDateData[i].ORAINIZIOTIMESTAMP;
		// 								oInterventiOraFineTimestamp = oSortedInterventiDateData[i].ORAFINETIMESTAMP;
		// 								oInterventiCurrentDayDate = new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[i].DATAINTERVENTO));
		// 								oFascioFineoNextDayDate = new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[i].DATAINTERVENTO));
		// 								oFascioFineoNextDayDate.setDate(oInterventiCurrentDayDate.getDate() + 1); // Fascio Fine Next day

		// 								// Fascio Inizio Current Day Timestamp 
		// 								oFascoInizioCurrentDayTimestamp = new Date(oInterventiCurrentDayDate.getFullYear(), oInterventiCurrentDayDate.getMonth(),
		// 									oInterventiCurrentDayDate.getDate(), "22", "00", "00");

		// 								// Fascio Fine Next Day Timestamp
		// 								oFascioFineNextDayTimestamp = new Date(oFascioFineoNextDayDate.getFullYear(), oFascioFineoNextDayDate.getMonth(),
		// 									oFascioFineoNextDayDate.getDate(), "08", "30", "00");

		// 								// Check if Ora Inizio and Ora Fine value is range between FASCIO_INIZIO and FASCIO_FINE value for next slot
		// 								// 22:00 PM - 08:30 AM
		// 								if ((oInterventiOraInizioTimestamp >= oFascoInizioCurrentDayTimestamp && oInterventiOraInizioTimestamp <=
		// 										oFascioFineNextDayTimestamp) && oInterventiOraFineTimestamp >= oFascoInizioCurrentDayTimestamp &&
		// 									oInterventiOraFineTimestamp <= oFascioFineNextDayTimestamp) {
		// 									if (checkOKCountDatewise < 3) {
		// 										riposiJsonData = {
		// 											"InterventiDate": interventDate,
		// 											"RiposiValue": (oRiposiNonWorkingDay[j].VALORE * 8).toString() + "H",
		// 											"multi": "(" + 0 + " Multi)"
		// 										};
		// 									} else {
		// 										riposiJsonData = {
		// 											"InterventiDate": interventDate,
		// 											"RiposiValue": (oRiposiNonWorkingDay[j].VALORE * 8).toString() + "H",
		// 											"multi": "(" + multi.toString() + " Multi)"
		// 										};
		// 									}
		// 								}

		// 							}
		// 							riposiArray.push(riposiJsonData);
		// 							riposiJsonData = {};

		// 							riposiflag = true;
		// 							break;
		// 						}
		// 					}

		// 					/// ---------------------- END OF GIORNI = 5 For Loop

		// 					if (!riposiflag) {
		// 						if (checkOKCountDatewise >= 3) {
		// 							multiJsonData = {
		// 								"InterventiDate": interventDate,
		// 								"RiposiValue": "0 H",
		// 								"multi": "(" + multi.toString() + " Multi)"
		// 							};
		// 						} else {
		// 							multiJsonData = {
		// 								"InterventiDate": interventDate,
		// 								"RiposiValue": "0 H",
		// 								"multi": "(" + 0 + " Multi)"
		// 							};
		// 						}

		// 						riposiArray.push(multiJsonData);
		// 						multiJsonData = {};
		// 					}
		// 				}
		// 			}

		// 		} // End of for loop
		// 		// ---------------------------------------- END OF NEW CODE ---------------------------------

		// 		// ---------------------------------- COMMENTED BELOW CODE AS ON 1st Sep to implement changes
		// 		// for (var i = 0; i < oSortedInterventiDateData.getData().length; ++i) {

		// 		// 	// Need to execute loop every time for given Interventi Date in order to get Riposi value for given Interventi Date									
		// 		// 	if (oSortedInterventiDateData.getData()[i].DATAINTERVENTO === interventDate.toString()) {
		// 		// 		if (oSortedInterventiDateData.getData()[i].WORKINGDAY) { // Return for GIORNI = 1

		// 		// 			for (var j = 0; j < oRiposiWorkingDay.length; ++j) {

		// 		// 				// Check whether minute difference of Ora Inizio and Ora Fine is between DURATA_MIN & DURATA_MAX
		// 		// 				if ((oRiposiWorkingDay[j].DURATA_MIN < sumOraIniFineMinsDIffSameIntervtDt && (sumOraIniFineMinsDIffSameIntervtDt <=
		// 		// 						oRiposiWorkingDay[j].DURATA_MAX))) {

		// 		// 					if (checkOKCountDatewise < 3) {
		// 		// 						riposiJsonData = {
		// 		// 							"InterventiDate": interventDate,
		// 		// 							"RiposiValue": (oRiposiWorkingDay[j].VALORE * 8).toString() + "H",
		// 		// 							"multi": "(" + 0 + " Multi)"
		// 		// 						};
		// 		// 					} else {
		// 		// 						riposiJsonData = {
		// 		// 							"InterventiDate": interventDate,
		// 		// 							"RiposiValue": (oRiposiWorkingDay[j].VALORE * 8).toString() + "H",
		// 		// 							"multi": "(" + multi.toString() + " Multi)"
		// 		// 						};
		// 		// 					}

		// 		// 					riposiArray.push(riposiJsonData);
		// 		// 					riposiJsonData = {};

		// 		// 					riposiflag = true;
		// 		// 					break;
		// 		// 				}

		// 		// 			}

		// 		// 			if (!riposiflag) {
		// 		// 				if (checkOKCountDatewise >= 3) {
		// 		// 					multiJsonData = {
		// 		// 						"InterventiDate": interventDate,
		// 		// 						"RiposiValue": "0 H",
		// 		// 						"multi": "(" + multi.toString() + " Multi)"
		// 		// 					};

		// 		// 					//riposiArray.push(riposiJsonData);
		// 		// 					//riposiJsonData = {};
		// 		// 				} else {
		// 		// 					multiJsonData = {
		// 		// 						"InterventiDate": interventDate,
		// 		// 						"RiposiValue": "0 H",
		// 		// 						"multi": "(" + 0 + " Multi)"
		// 		// 					};

		// 		// 					// riposiArray.push(riposiJsonData);
		// 		// 					// riposiJsonData = {};
		// 		// 					riposiArray.push(multiJsonData);
		// 		// 					multiJsonData = {};									
		// 		// 				}
		// 		// 			}

		// 		// 		} else { // Return for GIORNI = 5

		// 		// 			for (var j = 0; j < oRiposiNonWorkingDay.length; ++j) {

		// 		// 				// Overlapping Range
		// 		// 				// 240 - 480 
		// 		// 				// 240 - 1440 
		// 		// 				if ((oRiposiNonWorkingDay[j].DURATA_MIN === 240 && oRiposiNonWorkingDay[j].DURATA_MAX === 480) && (oRiposiNonWorkingDay[j]
		// 		// 						.DURATA_MIN <
		// 		// 						sumOraIniFineMinsDIffSameIntervtDt && (sumOraIniFineMinsDIffSameIntervtDt <= oRiposiNonWorkingDay[j].DURATA_MAX))) {

		// 		// 					oInterventiOraInizioTimestamp = oSortedInterventiDateData.getData()[i].ORAINIZIOTIMESTAMP;
		// 		// 					oInterventiOraFineTimestamp = oSortedInterventiDateData.getData()[i].ORAFINETIMESTAMP;
		// 		// 					oInterventiCurrentDayDate = new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData.getData()[i].DATAINTERVENTO));
		// 		// 					oFascioInizioCurrentDayDate = new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData.getData()[i].DATAINTERVENTO)); // Fascio Inizio current day
		// 		// 					oFascioFineSameDayDate = new Date(oInterventiCurrentDayDate); // Fascio Fine current day

		// 		// 					oFascoInizioCurrentDayTimestamp = new Date(oFascioInizioCurrentDayDate.getFullYear(), oFascioInizioCurrentDayDate.getMonth(),
		// 		// 						oFascioInizioCurrentDayDate.getDate(), (oRiposiNonWorkingDay[j].FASCIA_INIZIO).split(":")[0], (oRiposiNonWorkingDay[j].FASCIA_INIZIO)
		// 		// 						.split(":")[1], "00");

		// 		// 					// Check if Ora Inizio and Ora Fine Timestamp is between 08:30 AM (FASCIO_INIZIO of IDREGOLA = 10) - 10:00 PM (FASCIO_FINE of IDREGOLA = 14). NOTE - Here we are not considering FASCIO_FINE(11:00 PM) of IDREGOLA = 10 
		// 		// 					oFascioFineSameDayTimestamp = new Date(oFascioFineSameDayDate.getFullYear(), oFascioFineSameDayDate.getMonth(),
		// 		// 						oFascioFineSameDayDate.getDate(), "22", "00", "00");

		// 		// 					// Check if Ora Inizio and Ora Fine value is range between FASCIO_INIZIO and FASCIO_FINE value for same day 
		// 		// 					// It mean to consider IDREGOLA = 10 and not IDREGOLA = 14 if below condition is true
		// 		// 					if ((oInterventiOraInizioTimestamp > oFascoInizioCurrentDayTimestamp && oInterventiOraInizioTimestamp <=
		// 		// 							oFascioFineSameDayTimestamp) && oInterventiOraFineTimestamp > oFascoInizioCurrentDayTimestamp &&
		// 		// 						oInterventiOraFineTimestamp <= oFascioFineSameDayTimestamp) {

		// 		// 						if (checkOKCountDatewise < 3) {
		// 		// 							riposiJsonData = {
		// 		// 								"InterventiDate": interventDate,
		// 		// 								"RiposiValue": "0.5".toString() + "H", // IDREGOLA = 10 (Rule no. 10). VALORE = 0.5
		// 		// 								"multi": "(" + 0 + " Multi)"
		// 		// 							};
		// 		// 						} else {
		// 		// 							riposiJsonData = {
		// 		// 								"InterventiDate": interventDate,
		// 		// 								"RiposiValue": "0.5".toString() + "H",
		// 		// 								"multi": "(" + multi.toString() + " Multi)"
		// 		// 							};
		// 		// 						}
		// 		// 					} else { // If Ora Inizio Timestamp is > 08:30 AM & Ora Fine Timestamp is > 10:00 PM. In all other cases VALORE = 1, IDREGOLA = 14
		// 		// 						if (checkOKCountDatewise < 3) {
		// 		// 							riposiJsonData = {
		// 		// 								"InterventiDate": interventDate,
		// 		// 								"RiposiValue": "8".toString() + "H",
		// 		// 								"multi": "(" + 0 + " Multi)"
		// 		// 							};
		// 		// 						} else {
		// 		// 							riposiJsonData = {
		// 		// 								"InterventiDate": interventDate,
		// 		// 								"RiposiValue": "8".toString() + "H",
		// 		// 								"multi": "(" + multi.toString() + " Multi)"
		// 		// 							};
		// 		// 						}
		// 		// 					}

		// 		// 					riposiArray.push(riposiJsonData);
		// 		// 					riposiJsonData = {};

		// 		// 					riposiflag = true;
		// 		// 					break;

		// 		// 				} else {
		// 		// 					if ((oRiposiNonWorkingDay[j].DURATA_MIN < sumOraIniFineMinsDIffSameIntervtDt && (sumOraIniFineMinsDIffSameIntervtDt <=
		// 		// 							oRiposiNonWorkingDay[j].DURATA_MAX))) {

		// 		// 						if (checkOKCountDatewise < 3) {
		// 		// 							riposiJsonData = {
		// 		// 								"InterventiDate": interventDate,
		// 		// 								"RiposiValue": (oRiposiNonWorkingDay[j].VALORE * 8).toString() + "H",
		// 		// 								"multi": "(" + 0 + " Multi)"
		// 		// 							};
		// 		// 						} else {
		// 		// 							riposiJsonData = {
		// 		// 								"InterventiDate": interventDate,
		// 		// 								"RiposiValue": (oRiposiNonWorkingDay[j].VALORE * 8).toString() + "H",
		// 		// 								"multi": "(" + multi.toString() + " Multi)"
		// 		// 							};
		// 		// 						}

		// 		// 						riposiArray.push(riposiJsonData);
		// 		// 						riposiJsonData = {};

		// 		// 						riposiflag = true;
		// 		// 						break;
		// 		// 					}
		// 		// 				}
		// 		// 			}

		// 		// 			if (!riposiflag) {
		// 		// 				if (checkOKCountDatewise >= 3) {
		// 		// 					multiJsonData = {
		// 		// 						"InterventiDate": interventDate,
		// 		// 						"RiposiValue": "0 H",
		// 		// 						"multi": "(" + multi.toString() + " Multi)"
		// 		// 					};
		// 		// 				} 
		// 		// 				// *************** Commented below line of code as 0 H (0 Multi) should not be displayed as Riposi Value
		// 		// 				// else {
		// 		// 				// 	multiJsonData = {
		// 		// 				// 		"InterventiDate": interventDate,
		// 		// 				// 		"RiposiValue": "0 H",
		// 		// 				// 		"multi": "(" + 0 + " Multi)"
		// 		// 				// 	};
		// 		// 				// }

		// 		// 				riposiArray.push(riposiJsonData);
		// 		// 				riposiJsonData = {};
		// 		// 			}
		// 		// 		}
		// 		// 	}
		// 		// } // End of for loop
		// 		// ------------------------------------------------END OF EXISTING CODE ---------------------------------------------------------------

		// 		var uniqueInterventiDateRiposi = that.unique(riposiArray);
		// 		var oInterventiDateModel = that.getView().byId("idTableInterventi").getModel("RepintInterventiModel");

		// 		// KAPIL - Please check below code. Commented to fix riposi issue as on 5th Aug
		// 		for (var index = 0; index < oSortedInterventiDateData.getData().length; ++index) {
		// 			for (var indexDt = 0; indexDt < uniqueInterventiDateRiposi.length; ++indexDt) {
		// 				//////// if ((new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData.getData()[index].DATAINTERVENTO))).toString() === (
		// 				// 		uniqueInterventiDateRiposi[indexDt].InterventiDate).toString()) {
		// 				if (oSortedInterventiDateData.getData()[index].DATAINTERVENTO === uniqueInterventiDateRiposi[indexDt].InterventiDate) {
		// 					oInterventiDateModel.getData()[index].RIPOSI = uniqueInterventiDateRiposi[indexDt].RiposiValue + " " +
		// 						uniqueInterventiDateRiposi[indexDt].multi; // Always first index for new Interventi date
		// 					//oSortedInterventiDateData.getData()[index].RIPOSI = uniqueInterventiDateRiposi[indexDt].RiposiValue; // Always first index for new Interventi date
		// 					uniqueInterventiDateRiposi.splice(0, 1);
		// 					break;
		// 				}
		// 			}
		// 		}

		// 		// KAPIL - Below code added on 5th Aug 
		// 		// for (var index = 0; index < oSortedInterventiDateData.getData().length; ++index) {
		// 		// 	for (var indexDt = 0; indexDt < uniqueInterventiDateRiposi.length; ++indexDt) {
		// 		// 		if (oSortedInterventiDateData.getData()[index].DATAINTERVENTO === uniqueInterventiDateRiposi[indexDt].InterventiDate) {
		// 		// 			for (var k = indexDt; k < uniqueInterventiDateRiposi.length; ++k) {
		// 		// 				// Always first index for new Interventi date
		// 		// 				oInterventiDateModel.getData()[index].RIPOSI = oInterventiDateModel.getData()[index].RIPOSI +
		// 		// 					uniqueInterventiDateRiposi[k].RiposiValue + " " + uniqueInterventiDateRiposi[k].multi;
		// 		// 				uniqueInterventiDateRiposi.splice(0, 1);
		// 		// 			}
		// 		// 			//break;
		// 		// 			///indexInter = indexDt + 1; 
		// 		// 		}
		// 		// 	}
		// 		// 	break;
		// 		// }

		// 		oInterventiDateModel.updateBindings(true);

		// 	});

		// },

		// KAPIL - Below code added as on 1st/2nd Sep 2020 to fix Riposi calculation issue
		updateCompensativiPostRIPCheck: function (oSortedInterventiDateData, onChiamatodaChange) {

			var that = this;
			var riposiflag = false;
			that.RIPFLAG = false;
			var oInterventiOraInizioTimestamp;
			var oInterventiOraFineTimestamp;
			var oInterventiCurrentDayDate;
			var oFascioInizioCurrentDayDate;
			var oFascioFineSameDayDate;
			var oFascoInizioCurrentDayTimestamp;
			var oFascioFineSameDayTimestamp;
			var oFascioFineoNextDayDate;
			var oFascioFineoNextDayDate;
			var oFascioFineNextDayTimestamp;
			var oInterventiOraInizioTimestampRIP;
			var oInterventiOraFineTimestampRIP;
			var oInterventiCurrentDayDateRIP;
			var oFascioInizioCurrentDayDateRIP;
			var oFascioFineoNextDayDateRIP;
			var oFascoInizioCurrentDayTimestampRIP;
			var oFascioFineNextDayTimestampRIP;
			var oFascioFineoCurrentDayDateRIP;
			var oFascioFineCurrentDayTimestampRIP;
			var totRiposiValue = 0;
			var riposi = 0;
			var workingDayFlag = false;
			var nonWorkingDayFlag = false;
			// On 26th Nov - Below variabes declared for "Multi" value calculation
			var oFascioInizioMultiCurrentDayDate;
			var oFascioFineoMultiNextDayDate;
			var oFascoInizioMultiCurrentDayTimestamp;
			var oFascioFineMultiNextDayTimestamp;

			var oRiposiWorkingDay = that.getOwnerComponent().getModel("viewProperties").getProperty("/oRiposiWorkingDay");
			var oRiposiNonWorkingDay = that.getOwnerComponent().getModel("viewProperties").getProperty("/oRiposiNonWorkingDay");
			var oRegoleCompensativi = that.getView().getModel("RegoleCompensativi").getData();

			// xxxx///////
			// var uniqueinterventDates = $.unique(oSortedInterventiDateData.getData().map(function (value) {
			// 	return value.DATAINTERVENTO;
			// })); // Get Unique Interventi Dates

			var uniqueinterventDates = $.unique(oSortedInterventiDateData.map(function (value) {
				return value.DATAINTERVENTO;
			})); // Get Unique Interventi Dates

			var sumOraIniFineMinsDIffSameIntervtDt = 0;
			var sumOraIniFineMinsDIffSameIntervtDtNonWorkDayfirstSlot = 0;
			var sumOraIniFineMinsDIffSameIntervtDtNonWorkDaysecSlot = 0;
			var sumOraIniFineMinsDIffSameIntervtDtNonWorkDayfirstSlotRIP = 0
			var sumOraIniFineMinsDIffSameIntervtDtNonWorkDaysecSlotRIP = 0
			var sumOraIniFineMinsDIffSameIntervtDtRIP = 0;

			var checkOKCountDatewise = 0;
			var multi = 0;
			uniqueinterventDates.map(function (interventDate) {
				sumOraIniFineMinsDIffSameIntervtDt = 0;
				sumOraIniFineMinsDIffSameIntervtDtNonWorkDayfirstSlot = 0;
				sumOraIniFineMinsDIffSameIntervtDtNonWorkDaysecSlot = 0;
				sumOraIniFineMinsDIffSameIntervtDtNonWorkDayfirstSlotRIP = 0;
				sumOraIniFineMinsDIffSameIntervtDtNonWorkDaysecSlotRIP = 0;
				sumOraIniFineMinsDIffSameIntervtDtRIP = 0;
				checkOKCountDatewise = 0;
				workingDayFlag = false;
				nonWorkingDayFlag = false;

				var riposiArray = [];
				var riposiJsonData = {};
				var multiJsonData = {};

				var j = 0;
				var dateintervento;
				var oInterventiDate;
				var oInterventoNextDate;

				//////////oSortedInterventiDateData = oSortedInterventiDateData.getData();

				if (oSortedInterventiDateData.length > 1) {
					for (var i = 0; i < oSortedInterventiDateData.length; ++i) {
						if (oSortedInterventiDateData.length === 1 || i === oSortedInterventiDateData.length - 1) {

							// Below logic added on 10th Dec 2020
							// Reason for adding below logic is - For below set of Interventions, Output is correct for RIPOSI - 2H (2 Multi)
							// Date			Ora Inzio		Ora Fine	RIP		Riposi
							// 01-01-2021	08:00			08:30
							// 02-01-2021	09:00			10:00		
							// 04-01-2021	23:30			00:00				2H (2 Multi)
							// 04-01-2021	00:00			00:30	
							// 04-01-2021	02:00			03:00

							// But when RIP is true - Output is incorrect for RIPOSI - 2H (0 Multi)
							// Date			Ora Inzio		Ora Fine	RIP		Riposi
							// 01-01-2021	08:00			08:30
							// 02-01-2021	08:30			10:00		X	
							// 04-01-2021	23:30			00:00				2H (0 Multi)
							// 04-01-2021	00:00			00:30	
							// 04-01-2021	02:00			03:00

							// Conclusion - Here RIP condition is true for 02-01-2021 "updateCompensativiPostRIPCheck()" is called (this function) in which when 
							// i === oSortedInterventiDateData.length - 1 condtion is true then the control break; and checkOKCountDatewise increment is not done as the control is not executing
							// logic below j = i + 1; condition as the control break; So need to add logic to increment checkOKCountDatewise here itself

							// ************************ Logic START ***********************************
							dateintervento = oSortedInterventiDateData[i].DATAINTERVENTO;
							oInterventiDate = new Date(Formatter.formatDateToMMDDYYYY(dateintervento));
							oInterventoNextDate = new Date(Formatter.formatDateToMMDDYYYY(dateintervento));
							oInterventoNextDate.setDate(oInterventiDate.getDate() + 1);

							if ((oSortedInterventiDateData[i].DATAINTERVENTO === interventDate) && (oSortedInterventiDateData[i].CHECKOK) ===
								"Y" && (!(oSortedInterventiDateData[i].FLAGCONT))) {

								//XX//////sumOraIniFineMinsDIffSameIntervtDt = sumOraIniFineMinsDIffSameIntervtDt + oSortedInterventiDateData[i].MINDIFFORAINIFINE;

								// Below line of code commented on 15th Oct
								//////////checkOKCountDatewise = checkOKCountDatewise + 1;

								// New logic added on 15th Oct 2020 - Multi Calculation 
								// One new condtion added - To check whether Next Interventi Date is Holiday or Working Day. If Holiday then consider increment of checkOKCountDatewise
								// else ignore increment of checkOKCountDatewise.

								// First get next Interventi Date - which is already calculated above: oInterventoNextDate
								that.getLSFForMultiCalc(Formatter.formatDateMulti(oInterventoNextDate));
								if (!that.LSFHolidayFlag) {

									// Below line of code commented on 26th Nov to implement 'Multi' calculation condition (as below)
									///checkOKCountDatewise = checkOKCountDatewise + 1;

									// Below logic added on 26th Nov 2020 - Multi Calculation
									// Ora Inizio nd Ora fine to check if falls under - FASCIO_INIZIO (23:00 - same day)  and FASCIO_FINE (08:30 - next day)
									oInterventiOraInizioTimestamp = oSortedInterventiDateData[i].ORAINIZIOTIMESTAMP;
									oInterventiOraFineTimestamp = oSortedInterventiDateData[i].ORAFINETIMESTAMP;

									oFascioInizioMultiCurrentDayDate = new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[i].DATAINTERVENTO)); // MULTI - Fascio Inizio current day
									oFascioFineoMultiNextDayDate = new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[i].DATAINTERVENTO));
									oFascioFineoMultiNextDayDate.setDate(oInterventiDate.getDate() + 1); // MULTI - Fascio Fine Next day

									// MULTI - Fascio Inizio Current Day Timestamp
									oFascoInizioMultiCurrentDayTimestamp = new Date(oFascioInizioMultiCurrentDayDate.getFullYear(),
										oFascioInizioMultiCurrentDayDate.getMonth(),
										oFascioInizioMultiCurrentDayDate.getDate(), "23", "00", "00");

									// MULTI - Fascio Fine Next Day Timestamp
									oFascioFineMultiNextDayTimestamp = new Date(oFascioFineoMultiNextDayDate.getFullYear(), oFascioFineoMultiNextDayDate.getMonth(),
										oFascioFineoMultiNextDayDate.getDate(), "08", "30", "00");

									// MULTI -Check if Ora Inizio and Ora Fine value is range between FASCIO_INIZIO ( 23:00 for same day) and FASCIO_FINE (08:30 for Next Day) 
									// If so then increment checkOKCountDatewise
									if ((oInterventiOraInizioTimestamp >= oFascoInizioMultiCurrentDayTimestamp && oInterventiOraInizioTimestamp <=
											oFascioFineMultiNextDayTimestamp) && oInterventiOraFineTimestamp >= oFascoInizioMultiCurrentDayTimestamp &&
										oInterventiOraFineTimestamp <= oFascioFineMultiNextDayTimestamp) {

										checkOKCountDatewise = checkOKCountDatewise + 1;
									}
								}
							}

							// ************************ Logic END ***********************************

							break;
						}
						j = i + 1;

						dateintervento = oSortedInterventiDateData[i].DATAINTERVENTO;
						oInterventiDate = new Date(Formatter.formatDateToMMDDYYYY(dateintervento));
						oInterventoNextDate = new Date(Formatter.formatDateToMMDDYYYY(dateintervento));
						oInterventoNextDate.setDate(oInterventiDate.getDate() + 1);

						if ((oSortedInterventiDateData[i].DATAINTERVENTO === interventDate) && (oSortedInterventiDateData[i].CHECKOK) ===
							"Y" && (!(oSortedInterventiDateData[i].FLAGCONT))) {

							//XX//////sumOraIniFineMinsDIffSameIntervtDt = sumOraIniFineMinsDIffSameIntervtDt + oSortedInterventiDateData[i].MINDIFFORAINIFINE;

							// Below line of code commented on 15th Oct
							//////////checkOKCountDatewise = checkOKCountDatewise + 1;

							// New logic added on 15th Oct 2020 - Multi Calculation 
							// One new condtion added - To check whether Next Interventi Date is Holiday or Working Day. If Holiday then consider increment of checkOKCountDatewise
							// else ignore increment of checkOKCountDatewise.

							// First get next Interventi Date - which is already calculated above: oInterventoNextDate
							that.getLSFForMultiCalc(Formatter.formatDateMulti(oInterventoNextDate));
							if (!that.LSFHolidayFlag) {

								// Below line of code commented on 26th Nov to implement 'Multi' calculation condition (as below)
								///checkOKCountDatewise = checkOKCountDatewise + 1;

								// Below logic added on 26th Nov 2020 - Multi Calculation
								// Ora Inizio nd Ora fine to check if falls under - FASCIO_INIZIO (23:00 - same day)  and FASCIO_FINE (08:30 - next day)
								oInterventiOraInizioTimestamp = oSortedInterventiDateData[i].ORAINIZIOTIMESTAMP;
								oInterventiOraFineTimestamp = oSortedInterventiDateData[i].ORAFINETIMESTAMP;

								oFascioInizioMultiCurrentDayDate = new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[i].DATAINTERVENTO)); // MULTI - Fascio Inizio current day
								oFascioFineoMultiNextDayDate = new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[i].DATAINTERVENTO));
								oFascioFineoMultiNextDayDate.setDate(oInterventiDate.getDate() + 1); // MULTI - Fascio Fine Next day

								// MULTI - Fascio Inizio Current Day Timestamp
								oFascoInizioMultiCurrentDayTimestamp = new Date(oFascioInizioMultiCurrentDayDate.getFullYear(),
									oFascioInizioMultiCurrentDayDate.getMonth(),
									oFascioInizioMultiCurrentDayDate.getDate(), "23", "00", "00");

								// MULTI - Fascio Fine Next Day Timestamp
								oFascioFineMultiNextDayTimestamp = new Date(oFascioFineoMultiNextDayDate.getFullYear(), oFascioFineoMultiNextDayDate.getMonth(),
									oFascioFineoMultiNextDayDate.getDate(), "08", "30", "00");

								// MULTI -Check if Ora Inizio and Ora Fine value is range between FASCIO_INIZIO ( 23:00 for same day) and FASCIO_FINE (08:30 for Next Day) 
								// If so then increment checkOKCountDatewise
								if ((oInterventiOraInizioTimestamp >= oFascoInizioMultiCurrentDayTimestamp && oInterventiOraInizioTimestamp <=
										oFascioFineMultiNextDayTimestamp) && oInterventiOraFineTimestamp >= oFascoInizioMultiCurrentDayTimestamp &&
									oInterventiOraFineTimestamp <= oFascioFineMultiNextDayTimestamp) {

									checkOKCountDatewise = checkOKCountDatewise + 1;
								}
							}
						}

						// Check if next Interventi date value is current Interventi date + 1. If so then RIP is checked for next record. 
						// Here checkOKCountDatewise and sumOraIniFineMinsDIffSameIntervtDt of next record (Current Interventi date + 1) should be considered for current Interventi date record and not for next Interventi date record.
						// E.g below: Here checkOKCountDatewise value of 8/06/2020 is 3 (Excluding 1st 8/6/2020 record as CHECKOK = 'N' & Including RIP = X record) and sumOraIniFineMinsDIffSameIntervtDt = 240 mins (and not 150 mins)
						// 				                        Chiamato da	    Causa	  Rip.	Minutes	repintDay	
						// 8/6/2020	17:30	22:00	Working day	intervento 1	Causa 1			0		8/6/2020	count 8/6 minutes 240
						// 8/6/2020	1:00	3:00	Working day	intervento 2	Causa 2			120		8/6/2020	
						// 8/6/2020	8:00	8:30	Working day	intervento 3	Causa 3			30		8/6/2020	
						// 9/6/2020	8:30	10:00	Working day	intervento 3	Causa 3	   X	90		8/6/2020	
						// 9/6/2020	10:00	11:00	Working day	intervento 4	Causa 4			0		9/6/2020	count 9/6 minutes 0

						if ((new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[j].DATAINTERVENTO))).toString() ===
							oInterventoNextDate.toString() && (oSortedInterventiDateData[j].FLAGCONT)) {

							//xxxxx///sumOraIniFineMinsDIffSameIntervtDt = sumOraIniFineMinsDIffSameIntervtDt + oSortedInterventiDateData[j].MINDIFFORAINIFINE;

							// Below line of code commented on 15th Oct
							///////checkOKCountDatewise = checkOKCountDatewise + 1;

							// New logic added on 15th Oct 2020 - Multi Calculation 
							// One new condtion added - To check whether Next Interventi Date is Holiday or Working Day. If Holiday then consider increment of checkOKCountDatewise
							// else ignore increment of checkOKCountDatewise.

							// First get next Interventi Date - which is already calculated above: oInterventoNextDate
							that.getLSFForMultiCalc(Formatter.formatDateMulti(oInterventoNextDate));
							if (!that.LSFHolidayFlag) {

								// Below line of code commented on 26th Nov to implement 'Multi' calculation condition (as below)
								////checkOKCountDatewise = checkOKCountDatewise + 1;

								// Below logic added on 26th Nov 2020 - Multi Calculation
								// Ora Inizio nd Ora fine of next Intervention to check if falls under - FASCIO_INIZIO (23:00 - same day)  and FASCIO_FINE (08:30 - next day)
								oInterventiOraInizioTimestamp = oSortedInterventiDateData[j].ORAINIZIOTIMESTAMP;
								oInterventiOraFineTimestamp = oSortedInterventiDateData[j].ORAFINETIMESTAMP;

								oFascioInizioMultiCurrentDayDate = new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[j].DATAINTERVENTO)); // MULTI - Fascio Inizio current day
								oFascioFineoMultiNextDayDate = new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[j].DATAINTERVENTO));
								oFascioFineoMultiNextDayDate.setDate(oInterventiDate.getDate() + 1); // MULTI - Fascio Fine Next day

								// MULTI - Fascio Inizio Current Day Timestamp
								oFascoInizioMultiCurrentDayTimestamp = new Date(oFascioInizioMultiCurrentDayDate.getFullYear(),
									oFascioInizioMultiCurrentDayDate.getMonth(),
									oFascioInizioMultiCurrentDayDate.getDate(), "23", "00", "00");

								// MULTI - Fascio Fine Next Day Timestamp
								oFascioFineMultiNextDayTimestamp = new Date(oFascioFineoMultiNextDayDate.getFullYear(), oFascioFineoMultiNextDayDate.getMonth(),
									oFascioFineoMultiNextDayDate.getDate(), "08", "30", "00");

								// MULTI -Check if Ora Inizio and Ora Fine value is range between FASCIO_INIZIO ( 23:00 for same day) and FASCIO_FINE (08:30 for Next Day) 
								// If so then increment checkOKCountDatewise
								if ((oInterventiOraInizioTimestamp >= oFascoInizioMultiCurrentDayTimestamp && oInterventiOraInizioTimestamp <=
										oFascioFineMultiNextDayTimestamp) && oInterventiOraFineTimestamp >= oFascoInizioMultiCurrentDayTimestamp &&
									oInterventiOraFineTimestamp <= oFascioFineMultiNextDayTimestamp) {

									checkOKCountDatewise = checkOKCountDatewise + 1;
								}
							}
						}
					}
				}

				for (var c = 0; c < oRegoleCompensativi.length; c++) {
					if (checkOKCountDatewise >= oRegoleCompensativi[0].N_INTERVENTI) {
						multi = oRegoleCompensativi[0].VALORE;
					}
				}

				//////				oSortedInterventiDateData = oSortedInterventiDateData.getData();
				for (var i = 0; i < oSortedInterventiDateData.length; ++i) {

					if (oSortedInterventiDateData.length === 1 || i === oSortedInterventiDateData.length - 1) {
						break;
					}
					j = i + 1;

					dateintervento = oSortedInterventiDateData[i].DATAINTERVENTO;
					oInterventiDate = new Date(Formatter.formatDateToMMDDYYYY(dateintervento));
					oInterventoNextDate = new Date(Formatter.formatDateToMMDDYYYY(dateintervento));
					oInterventoNextDate.setDate(oInterventiDate.getDate() + 1);

					if (oSortedInterventiDateData[i].DATAINTERVENTO === interventDate) { // Need to execute loop every time for given Interventi Date in order to get Riposi value for given Interventi Date								 						
						if (oSortedInterventiDateData[i].WORKINGDAY) { // Return for GIORNI = 1
							workingDayFlag = true;

							// To execute below code only once per Interventi Date as it iterates all the records for specific Interventi Date. 
							// So no need to iterate it again else sumOraIniFineMinsDIffSameIntervtDt value increases on subsequent iterate
							// So reset sumOraIniFineMinsDIffSameIntervtDt every time
							sumOraIniFineMinsDIffSameIntervtDt = 0;
							sumOraIniFineMinsDIffSameIntervtDtNonWorkDayfirstSlotRIP = 0;
							sumOraIniFineMinsDIffSameIntervtDtNonWorkDaysecSlotRIP = 0;
							$.each(oSortedInterventiDateData, function (index, value) {

								if ((value.DATAINTERVENTO).toString() === interventDate.toString() && (value.CHECKOK) === "Y" && (!(value.FLAGCONT))) { // RIP checkbox should not be checked as checked record Interventi date gets counted into previous date for "Multi" count increment by 1 (checkOKCountDatewise++)

									// -------------------------          NEXT DAY/SLOT CALCULATION		--------------------------------------------
									oInterventiOraInizioTimestamp = value.ORAINIZIOTIMESTAMP;
									oInterventiOraFineTimestamp = value.ORAFINETIMESTAMP;

									oInterventiCurrentDayDate = new Date(Formatter.formatDateToMMDDYYYY(value.DATAINTERVENTO));
									oFascioInizioCurrentDayDate = new Date(Formatter.formatDateToMMDDYYYY(value.DATAINTERVENTO)); // Fascio Inizio current day

									oInterventiCurrentDayDate = new Date(Formatter.formatDateToMMDDYYYY(value.DATAINTERVENTO));
									oFascioFineoNextDayDate = new Date(Formatter.formatDateToMMDDYYYY(value.DATAINTERVENTO));
									oFascioFineoNextDayDate.setDate(oInterventiCurrentDayDate.getDate() + 1); // Fascio Fine Next day

									// Fascio Inizio Current Day Timestamp
									oFascoInizioCurrentDayTimestamp = new Date(oFascioInizioCurrentDayDate.getFullYear(), oFascioInizioCurrentDayDate.getMonth(),
										oFascioInizioCurrentDayDate.getDate(), "22", "00", "00");

									// Fascio Fine Next Day Timestamp
									oFascioFineNextDayTimestamp = new Date(oFascioFineoNextDayDate.getFullYear(), oFascioFineoNextDayDate.getMonth(),
										oFascioFineoNextDayDate.getDate(), "08", "30", "00");

									// Check if Ora Inizio and Ora Fine value is range between FASCIO_INIZIO (for same day) and FASCIO_FINE (Next Day)
									if ((oInterventiOraInizioTimestamp >= oFascoInizioCurrentDayTimestamp && oInterventiOraInizioTimestamp <=
											oFascioFineNextDayTimestamp) && oInterventiOraFineTimestamp >= oFascoInizioCurrentDayTimestamp &&
										oInterventiOraFineTimestamp <= oFascioFineNextDayTimestamp) {

										sumOraIniFineMinsDIffSameIntervtDt = sumOraIniFineMinsDIffSameIntervtDt + value.MINDIFFORAINIFINE;
									}
									// New logic added on 29th Sep 
									else { // Partial Check OK - e.g. 17:30 < 10:00 PM && ( 01:30 >= 10:00 && 01:30 <= 08:30 AM) - Valid time = 10:00 PM to 01:30 AM = 220 mins
										if (oInterventiOraInizioTimestamp < oFascoInizioCurrentDayTimestamp && (oInterventiOraFineTimestamp >
												oFascoInizioCurrentDayTimestamp && oInterventiOraFineTimestamp <= oFascioFineNextDayTimestamp)) {
											sumOraIniFineMinsDIffSameIntervtDt = sumOraIniFineMinsDIffSameIntervtDt + value.MINDIFFORAINIFINE;
										}
									}
								} // End of - ((value.DATAINTERVENTO).toString() === interventDate.toString() && (value.CHECKOK) === "Y" && (!(value.FLAGCONT)))

								// // *********************  Check for RIP  ************************
								// if ((new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[j].DATAINTERVENTO))).toString() ===
								// 	oInterventoNextDate.toString() && (oSortedInterventiDateData[j].FLAGCONT)) {

								// 	// *********** Check whether next Interventi Day (Interventi Day + 1 - RIP Checked one) is working or non-working day - Logic discarded *************
								// 	// Irrespective of whether it is Working Day or Non Working Day, consider MINDIFFORAINIFINE of RIP day and add in previous Interventi Riposi Calculation (as per explained in sheet)
								// 	sumOraIniFineMinsDIffSameIntervtDt = sumOraIniFineMinsDIffSameIntervtDt + oSortedInterventiDateData[j].MINDIFFORAINIFINE;	

								// } // End of if((new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[i].DATAINTERVENTO))).toString() === oInterventoNextDate.toString() && (oSortedInterventiDateData[j].FLAGCONT)

							});

							// *********************  Check for RIP  ************************
							if ((new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[j].DATAINTERVENTO))).toString() ===
								oInterventoNextDate.toString() && (oSortedInterventiDateData[j].FLAGCONT)) {

								// RIP Flag is required when below values are entered by User
								// Interventi Date	Ora Inizio	Ora Fine	RIPOSI
								// 16-10-2020		220:00		00:00		4H (0 Multi)
								// 16-10-2020		08:29		08:30	
								// 17-10-2020		08:30		11:00

								// For above entered values "uniqueInterventiDateRiposi" has below values so here 'RIPFLAG' = true is required to get RiposiValue: "8H" value. 
								// If 'RIPFLAG' is not checked then incorrect value is evaluated and displayed.
								// uniqueInterventiDateRiposi
								// (2)[{…}, {…}]
								// 0:
								// 	InterventiDate: "16-10-2020"
								// RiposiValue: "4H"
								// multi: "(0 Multi)"
								// __proto__: Object
								// 1:
								// 	InterventiDate: "16-10-2020"
								// RiposiValue: "8H"
								// multi: "(0 Multi)"
								// __proto__: Object
								// length: 2
								// __proto__: Array(0)

								that.RIPFLAG = true;
								// *********** Check whether next Interventi Day (Interventi Day + 1 - RIP Checked one) is working or non-working day - Logic discarded *************
								// Irrespective of whether it is Working Day or Non Working Day, consider MINDIFFORAINIFINE of RIP day and add in previous Interventi Riposi Calculation (as per explained in sheet)
								sumOraIniFineMinsDIffSameIntervtDt = sumOraIniFineMinsDIffSameIntervtDt + oSortedInterventiDateData[j].MINDIFFORAINIFINE;

							} // End of if((new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[i].DATAINTERVENTO))).toString() === oInterventoNextDate.toString() && (oSortedInterventiDateData[j].FLAGCONT)

							// Below code added on 29th Sep - Check logic
							for (var j = 0; j < oRiposiWorkingDay.length; ++j) {

								// Check whether minute difference of Ora Inizio and Ora Fine is between DURATA_MIN & DURATA_MAX
								//if (oRiposiWorkingDay[j].DURATA_MIN < oSortedInterventiDateData[i].MINDIFFORAINIFINE <= oRiposiWorkingDay[j].DURATA_MAX) {
								if ((oRiposiWorkingDay[j].DURATA_MIN < sumOraIniFineMinsDIffSameIntervtDt && (sumOraIniFineMinsDIffSameIntervtDt <=
										oRiposiWorkingDay[j].DURATA_MAX))) {

									// Uncommented below code on 29th Sep
									// Check below code if require-------
									// // *************** Check if OraInzio Timestamp and Ora Fine Timestamp is between FASCIA_INIZIO and FASCIA_FINE timestamp 
									// // Second slot - 22:00 PM - 08:30 AM
									oInterventiOraInizioTimestamp = oSortedInterventiDateData[i].ORAINIZIOTIMESTAMP;
									oInterventiOraFineTimestamp = oSortedInterventiDateData[i].ORAFINETIMESTAMP;
									oInterventiCurrentDayDate = new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[i].DATAINTERVENTO));
									oFascioFineoNextDayDate.setDate(oInterventiCurrentDayDate.getDate() + 1); // Fascio Fine Next day

									// Fascio Inizio Current Day Timestamp 
									oFascoInizioCurrentDayTimestamp = new Date(oInterventiCurrentDayDate.getFullYear(), oInterventiCurrentDayDate.getMonth(),
										oInterventiCurrentDayDate.getDate(), "22", "00", "00");

									// Fascio Fine Next Day Timestamp
									oFascioFineNextDayTimestamp = new Date(oFascioFineoNextDayDate.getFullYear(), oFascioFineoNextDayDate.getMonth(),
										oFascioFineoNextDayDate.getDate(), "08", "30", "00");

									// Check if Ora Inizio and Ora Fine value is range between FASCIO_INIZIO and FASCIO_FINE value for next slot
									// 22:00 PM - 08:30 AM
									if ((oInterventiOraInizioTimestamp >= oFascoInizioCurrentDayTimestamp && oInterventiOraInizioTimestamp <=
											oFascioFineNextDayTimestamp) && oInterventiOraFineTimestamp > oFascoInizioCurrentDayTimestamp &&
										oInterventiOraFineTimestamp <= oFascioFineNextDayTimestamp) {
										if (checkOKCountDatewise < 3) {
											riposiJsonData = {
												"InterventiDate": interventDate,
												"RiposiValue": (oRiposiWorkingDay[j].VALORE * 8).toString() + "H",
												"multi": "(" + 0 + " Multi)"
											};
										} else {
											riposiJsonData = {
												"InterventiDate": interventDate,
												"RiposiValue": (oRiposiWorkingDay[j].VALORE * 8).toString() + "H",
												"multi": "(" + multi.toString() + " Multi)"
											};
										}
										riposiArray.push(riposiJsonData);
										riposiJsonData = {};

										riposiflag = true;
										break;
									} // New logic added on 29th Sep 
									else { // Partial Check OK - e.g. 17:30 < 10:00 PM && ( 01:30 >= 10:00 && 01:30 <= 08:30 AM) - Valid time = 10:00 PM to 01:30 AM = 220 mins
										if (oInterventiOraInizioTimestamp < oFascoInizioCurrentDayTimestamp && (oInterventiOraFineTimestamp >
												oFascoInizioCurrentDayTimestamp && oInterventiOraFineTimestamp <= oFascioFineNextDayTimestamp)) {
											if (checkOKCountDatewise < 3) {
												riposiJsonData = {
													"InterventiDate": interventDate,
													"RiposiValue": (oRiposiWorkingDay[j].VALORE * 8).toString() + "H",
													"multi": "(" + 0 + " Multi)"
												};
											} else {
												riposiJsonData = {
													"InterventiDate": interventDate,
													"RiposiValue": (oRiposiWorkingDay[j].VALORE * 8).toString() + "H",
													"multi": "(" + multi.toString() + " Multi)"
												};
											}
											riposiArray.push(riposiJsonData);
											riposiJsonData = {};

											riposiflag = true;
											break;
										}
									}

									// Below code commented on 29th Sep
									// if (checkOKCountDatewise < 3) {
									// 	riposiJsonData = {
									// 		"InterventiDate": interventDate,
									// 		"RiposiValue": (oRiposiWorkingDay[j].VALORE * 8).toString() + "H",
									// 		"multi": "(" + 0 + " Multi)"
									// 			//"multi": "(" + multi.toString() + " Multi)"
									// 	};
									// } else {
									// 	riposiJsonData = {
									// 		"InterventiDate": interventDate,
									// 		"RiposiValue": (oRiposiWorkingDay[j].VALORE * 8).toString() + "H",
									// 		"multi": "(" + multi.toString() + " Multi)"
									// 	};
									// }
									// riposiArray.push(riposiJsonData);
									// riposiJsonData = {};

									// riposiflag = true;
									// break;

								} // End of if

								//	}

							} // End of for (var j = 0; j < oRiposiWorkingDay.length; ++j) {

							// Below working code commented on 29th Sep - Check if required. Other logic added replacing below code.
							// for (var j = 0; j < oRiposiWorkingDay.length; ++j) {
							// 	// Check whether minute difference of Ora Inizio and Ora Fine is between DURATA_MIN & DURATA_MAX
							// 	if ((oRiposiWorkingDay[j].DURATA_MIN < sumOraIniFineMinsDIffSameIntervtDt && (sumOraIniFineMinsDIffSameIntervtDt <=
							// 			oRiposiWorkingDay[j].DURATA_MAX))) {
							// 		if (checkOKCountDatewise < 3) {
							// 			riposiJsonData = {
							// 				"InterventiDate": interventDate,
							// 				"RiposiValue": (oRiposiWorkingDay[j].VALORE * 8).toString() + "H",
							// 				"multi": "(" + 0 + " Multi)"
							// 			};
							// 		} else {
							// 			riposiJsonData = {
							// 				"InterventiDate": interventDate,
							// 				"RiposiValue": (oRiposiWorkingDay[j].VALORE * 8).toString() + "H",
							// 				"multi": "(" + multi.toString() + " Multi)"
							// 			};
							// 		}

							// 		riposiArray.push(riposiJsonData);
							// 		riposiJsonData = {};

							// 		riposiflag = true;
							// 		break;

							// 	} // End of if
							// }

							// Below code commented on 29th Sep
							// if (!riposiflag) {
							// 	if (checkOKCountDatewise >= 3) {
							// 		multiJsonData = {
							// 			"InterventiDate": interventDate,
							// 			"RiposiValue": "0H",
							// 			"multi": "(" + multi.toString() + " Multi)"
							// 		};
							// 		riposiArray.push(multiJsonData);
							// 		multiJsonData = {};
							// 	}
							// 	// *************** Commented below line of code as 0 H (0 Multi) should not be displayed as Riposi Value
							// 	// else {
							// 	// 	multiJsonData = {
							// 	// 		"InterventiDate": interventDate,
							// 	// 		"RiposiValue": "0 H",
							// 	// 		"multi": "(" + 0 + " Multi)"
							// 	// 	};
							// 	// }
							// 	// riposiArray.push(multiJsonData);
							// 	// multiJsonData = {};

							// }

						} else { // Return for GIORNI = 5
							nonWorkingDayFlag = true;
							/// *************************************************************************************************************************************************

							// To execute below code only once per Interventi Date as it iterates all the records for specific Interventi Date. 
							// So no need to iterate it again else sumOraIniFineMinsDIffSameIntervtDt value increases on subsequent iterate
							// So reset sumOraIniFineMinsDIffSameIntervtDtNonWorkDayfirstSlot and sumOraIniFineMinsDIffSameIntervtDtNonWorkDaysecSlot every time
							sumOraIniFineMinsDIffSameIntervtDtNonWorkDayfirstSlot = 0;
							sumOraIniFineMinsDIffSameIntervtDtNonWorkDaysecSlot = 0;
							sumOraIniFineMinsDIffSameIntervtDtRIP = 0;
							// For Non Working Day
							$.each(oSortedInterventiDateData, function (index, value) {
								if ((value.DATAINTERVENTO).toString() === interventDate.toString() && (value.CHECKOK) === "Y" && (!(value.FLAGCONT))) { // RIP checkbox should not be checked as checked record Interventi date gets counted into previous date for "Multi" count increment by 1 (checkOKCountDatewise++)
									/////////sumOraIniFineMinsDIffSameIntervtDt = sumOraIniFineMinsDIffSameIntervtDt + value.MINDIFFORAINIFINE;

									// -------------------------          CURRENT DAY CALCULATION		--------------------------------------------
									oInterventiOraInizioTimestamp = value.ORAINIZIOTIMESTAMP;
									oInterventiOraFineTimestamp = value.ORAFINETIMESTAMP;

									oInterventiCurrentDayDate = new Date(Formatter.formatDateToMMDDYYYY(value.DATAINTERVENTO));
									oFascioInizioCurrentDayDate = new Date(Formatter.formatDateToMMDDYYYY(value.DATAINTERVENTO)); // Fascio Inizio current day
									oFascioFineSameDayDate = new Date(oInterventiCurrentDayDate); // Fascio Fine current day

									// Fascio Inizio Current Day Timestamp
									oFascoInizioCurrentDayTimestamp = new Date(oFascioInizioCurrentDayDate.getFullYear(), oFascioInizioCurrentDayDate.getMonth(),
										oFascioInizioCurrentDayDate.getDate(), "08", "30", "00");

									// Fasco Fine Current Day Timestamp
									// Check if Ora Inizio and Ora Fine Timestamp is between 08:30 AM (FASCIO_INIZIO of IDREGOLA = 10) - 10:00 PM (FASCIO_FINE of IDREGOLA = 14). NOTE - Here we are not considering FASCIO_FINE(11:00 PM) of IDREGOLA = 10 
									oFascioFineSameDayTimestamp = new Date(oFascioFineSameDayDate.getFullYear(), oFascioFineSameDayDate.getMonth(),
										oFascioFineSameDayDate.getDate(), "22", "00", "00");

									// Check if Ora Inizio and Ora Fine value is range between FASCIO_INIZIO and FASCIO_FINE value for same day/first slot 
									if ((oInterventiOraInizioTimestamp >= oFascoInizioCurrentDayTimestamp && oInterventiOraInizioTimestamp <=
											oFascioFineSameDayTimestamp) && oInterventiOraFineTimestamp >= oFascoInizioCurrentDayTimestamp &&
										oInterventiOraFineTimestamp <= oFascioFineSameDayTimestamp) {
										sumOraIniFineMinsDIffSameIntervtDtNonWorkDayfirstSlot = sumOraIniFineMinsDIffSameIntervtDtNonWorkDayfirstSlot + value.MINDIFFORAINIFINE;
									}

									// -------------------------          NEXT SLOT/DAY CALCULATION		--------------------------------------------								 
									oInterventiCurrentDayDate = new Date(Formatter.formatDateToMMDDYYYY(value.DATAINTERVENTO));
									oFascioFineoNextDayDate = new Date(Formatter.formatDateToMMDDYYYY(value.DATAINTERVENTO));
									oFascioFineoNextDayDate.setDate(oInterventiCurrentDayDate.getDate() + 1); // Fascio Fine Next day

									// Fascio Inizio Current Day Timestamp
									oFascoInizioCurrentDayTimestamp = new Date(oFascioInizioCurrentDayDate.getFullYear(), oFascioInizioCurrentDayDate.getMonth(),
										oFascioInizioCurrentDayDate.getDate(), "22", "00", "00");

									// Fascio Fine Next Day Timestamp
									oFascioFineNextDayTimestamp = new Date(oFascioFineoNextDayDate.getFullYear(), oFascioFineoNextDayDate.getMonth(),
										oFascioFineoNextDayDate.getDate(), "08", "30", "00");

									// Below working code commented on 28th Sep to implement new changes
									// Check if Ora Inizio and Ora Fine value is range between FASCIO_INIZIO (for same day) and FASCIO_FINE (Next Day)
									// if ((oInterventiOraInizioTimestamp >= oFascoInizioCurrentDayTimestamp && oInterventiOraInizioTimestamp <=
									// 		oFascioFineNextDayTimestamp) && oInterventiOraFineTimestamp >= oFascoInizioCurrentDayTimestamp &&
									// 	oInterventiOraFineTimestamp <= oFascioFineNextDayTimestamp) {
									// 	sumOraIniFineMinsDIffSameIntervtDtNonWorkDaysecSlot = sumOraIniFineMinsDIffSameIntervtDtNonWorkDaysecSlot + value
									// 		.MINDIFFORAINIFINE;
									// }

									// Check for overlapping time
									// Check if Ora Inizio and Ora Fine value is overlapping e.g. Ora Inizio is 20:00 PM and Ora Fine is 00:00 AM
									// FASCIO_INIZIO = 10:00 PM (Current day) and FASCIO_FINE = 08:30 AM (Next day)
									// Here need to consider whole timeslot (from 20:00 PM to 00:00 AM) = 240 mins
									if (oInterventiOraInizioTimestamp < oFascoInizioCurrentDayTimestamp &&
										(oInterventiOraFineTimestamp >= oFascoInizioCurrentDayTimestamp && oInterventiOraFineTimestamp <=
											oFascioFineNextDayTimestamp)
									) {
										sumOraIniFineMinsDIffSameIntervtDtNonWorkDaysecSlot = sumOraIniFineMinsDIffSameIntervtDtNonWorkDaysecSlot + value.MINDIFFORAINIFINE;
									}
									// Check if Ora Inizio and Ora Fine value is range between >= FASCIO_INIZIO (for same day) and <= FASCIO_FINE (Next Day)
									else if ((oInterventiOraInizioTimestamp >= oFascoInizioCurrentDayTimestamp && oInterventiOraInizioTimestamp <=
											oFascioFineNextDayTimestamp) && oInterventiOraFineTimestamp >= oFascoInizioCurrentDayTimestamp &&
										oInterventiOraFineTimestamp <= oFascioFineNextDayTimestamp) {
										sumOraIniFineMinsDIffSameIntervtDtNonWorkDaysecSlot = sumOraIniFineMinsDIffSameIntervtDtNonWorkDaysecSlot + value
											.MINDIFFORAINIFINE;
									}

								}

								// // *********************  Check for RIP  ************************
								// if ((new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[j].DATAINTERVENTO))).toString() ===
								// 	oInterventoNextDate.toString() && (oSortedInterventiDateData[j].FLAGCONT)) {

								// 	// *********** Check whether next Interventi Day (Interventi Day + 1 - RIP Checked one) is working or non-working day - Logic discarded *************
								// 	// Irrespective of whether it is Working Day or Non Working Day, consider MINDIFFORAINIFINE of RIP day and add in previous Interventi Riposi Calculation (as per explained in sheet)
								// 	// RIP MINDIFFORAINIFINE value will always be starting from 08:30 AM (Ora Inizio) so to consider first slot for calculation
								// 	sumOraIniFineMinsDIffSameIntervtDtNonWorkDayfirstSlot = sumOraIniFineMinsDIffSameIntervtDtNonWorkDayfirstSlot + oSortedInterventiDateData[j].MINDIFFORAINIFINE;

								// } // End of if((new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[i].DATAINTERVENTO))).toString() === oInterventoNextDate.toString() && (oSortedInterventiDateData[j].FLAGCONT)									

							});

							// *********************  Check for RIP  ************************
							if ((new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[j].DATAINTERVENTO))).toString() ===
								oInterventoNextDate.toString() && (oSortedInterventiDateData[j].FLAGCONT)) {

								// RIP Flag is required when below values are entered by User
								// Interventi Date	Ora Inizio	Ora Fine	RIPOSI
								// 16-10-2020		220:00		00:00		4H (0 Multi)
								// 16-10-2020		08:29		08:30	
								// 17-10-2020		08:30		11:00

								// For above entered values "uniqueInterventiDateRiposi" has below values so here 'RIPFLAG' = true is required to get RiposiValue: "8H" value. 
								// If 'RIPFLAG' is not checked then incorrect value is evaluated and displayed.
								// uniqueInterventiDateRiposi
								// (2)[{…}, {…}]
								// 0:
								// 	InterventiDate: "16-10-2020"
								// RiposiValue: "4H"
								// multi: "(0 Multi)"
								// __proto__: Object
								// 1:
								// 	InterventiDate: "16-10-2020"
								// RiposiValue: "8H"
								// multi: "(0 Multi)"
								// __proto__: Object
								// length: 2
								// __proto__: Array(0)

								that.RIPFLAG = true;

								// *********** Check whether next Interventi Day (Interventi Day + 1 - RIP Checked one) is working or non-working day - Logic discarded *************
								// Irrespective of whether it is Working Day or Non Working Day, consider MINDIFFORAINIFINE of RIP day and add in previous Interventi Riposi Calculation (as per explained in sheet)
								// RIP MINDIFFORAINIFINE value will always be starting from 08:30 AM (Ora Inizio) so to consider first slot for calculation
								sumOraIniFineMinsDIffSameIntervtDtNonWorkDayfirstSlot = sumOraIniFineMinsDIffSameIntervtDtNonWorkDayfirstSlot +
									oSortedInterventiDateData[j].MINDIFFORAINIFINE;

							} // End of if((new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[i].DATAINTERVENTO))).toString() === oInterventoNextDate.toString() && (oSortedInterventiDateData[j].FLAGCONT)									

							for (var j = 0; j < oRiposiNonWorkingDay.length; ++j) {

								if ((oRiposiNonWorkingDay[j].DURATA_MIN === 240 && oRiposiNonWorkingDay[j].DURATA_MAX === 480) ||
									(oRiposiNonWorkingDay[j].DURATA_MIN === 480 && oRiposiNonWorkingDay[j].DURATA_MAX === 1440)
								) {
									// First Slot (08:30:00 AM - 11:00:00 PM - In fact to consider 10:00 PM) 
									// Check if Ora Inizio and Ora Fine value minutes difference is in range between FASCIO_INIZIO and FASCIO_FINE value for same day 
									if ((oRiposiNonWorkingDay[j].DURATA_MIN) < sumOraIniFineMinsDIffSameIntervtDtNonWorkDayfirstSlot && (
											sumOraIniFineMinsDIffSameIntervtDtNonWorkDayfirstSlot <=
											oRiposiNonWorkingDay[j].DURATA_MAX)) {

										// *************** Check if OraInzio Timestamp and Ora Fine Timestamp is between FASCIA_INIZIO and FASCIA_FINE timestamp
										// First slot - 08:30 AM - 10:00 PM (22:00)
										oInterventiOraInizioTimestamp = oSortedInterventiDateData[i].ORAINIZIOTIMESTAMP;
										oInterventiOraFineTimestamp = oSortedInterventiDateData[i].ORAFINETIMESTAMP;
										oInterventiCurrentDayDate = new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[i].DATAINTERVENTO));

										oFascioInizioCurrentDayDate = new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[i].DATAINTERVENTO)); // Fascio Inizio current day
										oFascioFineSameDayDate = new Date(oInterventiCurrentDayDate); // Fascio Fine current day

										oFascoInizioCurrentDayTimestamp = new Date(oFascioInizioCurrentDayDate.getFullYear(), oFascioInizioCurrentDayDate.getMonth(),
											oFascioInizioCurrentDayDate.getDate(), "08", "30", "00");

										// Check if Ora Inizio and Ora Fine Timestamp is between 08:30 AM (FASCIO_INIZIO of IDREGOLA = 10) - 10:00 PM (FASCIO_FINE of IDREGOLA = 14). NOTE - Here we are not considering FASCIO_FINE(11:00 PM) of IDREGOLA = 10 
										oFascioFineSameDayTimestamp = new Date(oFascioFineSameDayDate.getFullYear(), oFascioFineSameDayDate.getMonth(),
											oFascioFineSameDayDate.getDate(), "22", "00", "00");

										// Check if Ora Inizio and Ora Fine value is range between FASCIO_INIZIO and FASCIO_FINE value for same day/first slot
										if ((oInterventiOraInizioTimestamp >= oFascoInizioCurrentDayTimestamp && oInterventiOraInizioTimestamp <=
												oFascioFineSameDayTimestamp) && oInterventiOraFineTimestamp >= oFascoInizioCurrentDayTimestamp &&
											oInterventiOraFineTimestamp <= oFascioFineSameDayTimestamp) {
											if (checkOKCountDatewise < 3) {
												riposiJsonData = {
													"InterventiDate": interventDate,
													"RiposiValue": (oRiposiNonWorkingDay[j].VALORE * 8).toString() + "H",
													"multi": "(" + 0 + " Multi)"
												};
											} else {
												riposiJsonData = {
													"InterventiDate": interventDate,
													"RiposiValue": (oRiposiNonWorkingDay[j].VALORE * 8).toString() + "H",
													"multi": "(" + multi.toString() + " Multi)"
												};
											}
											// Logic added on 28th Sep
											riposiArray.push(riposiJsonData);
											riposiJsonData = {};

											riposiflag = true;
											break;
										} // New logic added on 28th Sep
										// Check for overlapping time
										// Check if Ora Inizio and Ora Fine value is overlapping e.g. Ora Inizio is 20:00 PM and Ora Fine is 00:00 AM
										// FASCIO_INIZIO = 10:00 PM (Current day) and FASCIO_FINE = 08:30 AM (Next day)										
										else if (oInterventiOraInizioTimestamp < oFascoInizioCurrentDayTimestamp &&
											(oInterventiOraFineTimestamp >= oFascoInizioCurrentDayTimestamp && oInterventiOraFineTimestamp <=
												oFascioFineNextDayTimestamp)
										) {
											if (checkOKCountDatewise < 3) {
												riposiJsonData = {
													"InterventiDate": interventDate,
													"RiposiValue": (oRiposiNonWorkingDay[j].VALORE * 8).toString() + "H",
													"multi": "(" + 0 + " Multi)"
												};
											} else {
												riposiJsonData = {
													"InterventiDate": interventDate,
													"RiposiValue": (oRiposiNonWorkingDay[j].VALORE * 8).toString() + "H",
													"multi": "(" + multi.toString() + " Multi)"
												};
											}
											// Logic added on 28th Sep
											riposiArray.push(riposiJsonData);
											riposiJsonData = {};

											riposiflag = true;
											break;
										}
										// New logic added on 28th Sep
										// riposiArray.push(riposiJsonData);
										// riposiJsonData = {};

										// riposiflag = true;
										// break;
									}
								}
								// Second Slot (10:00:00 PM - 08:30:00 AM) 
								// Check if Ora Inizio and Ora Fine value minutes difference is in range between FASCIO_INIZIO for same day and FASCIO_FINE value of next day
								else {
									if ((oRiposiNonWorkingDay[j].DURATA_MIN === 60 && oRiposiNonWorkingDay[j].DURATA_MAX === 120) ||
										(oRiposiNonWorkingDay[j].DURATA_MIN === 120 && oRiposiNonWorkingDay[j].DURATA_MAX === 240) ||
										(oRiposiNonWorkingDay[j].DURATA_MIN === 240 && oRiposiNonWorkingDay[j].DURATA_MAX === 1440)
									) {
										if ((oRiposiNonWorkingDay[j].DURATA_MIN) < sumOraIniFineMinsDIffSameIntervtDtNonWorkDaysecSlot && (
												sumOraIniFineMinsDIffSameIntervtDtNonWorkDaysecSlot <=
												oRiposiNonWorkingDay[j].DURATA_MAX)) {

											// *************** Check if OraInzio Timestamp and Ora Fine Timestamp is between FASCIA_INIZIO and FASCIA_FINE timestamp 
											// Second slot - 22:00 PM - 08:30 AM
											oInterventiOraInizioTimestamp = oSortedInterventiDateData[i].ORAINIZIOTIMESTAMP;
											oInterventiOraFineTimestamp = oSortedInterventiDateData[i].ORAFINETIMESTAMP;
											oInterventiCurrentDayDate = new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[i].DATAINTERVENTO));
											oFascioFineoNextDayDate = new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[i].DATAINTERVENTO));
											oFascioFineoNextDayDate.setDate(oInterventiCurrentDayDate.getDate() + 1); // Fascio Fine Next day

											// Fascio Inizio Current Day Timestamp 
											oFascoInizioCurrentDayTimestamp = new Date(oInterventiCurrentDayDate.getFullYear(), oInterventiCurrentDayDate.getMonth(),
												oInterventiCurrentDayDate.getDate(), "22", "00", "00");

											// Fascio Fine Next Day Timestamp
											oFascioFineNextDayTimestamp = new Date(oFascioFineoNextDayDate.getFullYear(), oFascioFineoNextDayDate.getMonth(),
												oFascioFineoNextDayDate.getDate(), "08", "30", "00");

											// Check if Ora Inizio and Ora Fine value is range between FASCIO_INIZIO and FASCIO_FINE value for next slot
											// 22:00 PM - 08:30 AM
											if ((oInterventiOraInizioTimestamp >= oFascoInizioCurrentDayTimestamp && oInterventiOraInizioTimestamp <=
													oFascioFineNextDayTimestamp) && oInterventiOraFineTimestamp >= oFascoInizioCurrentDayTimestamp &&
												oInterventiOraFineTimestamp <= oFascioFineNextDayTimestamp) {
												if (checkOKCountDatewise < 3) {
													riposiJsonData = {
														"InterventiDate": interventDate,
														"RiposiValue": (oRiposiNonWorkingDay[j].VALORE * 8).toString() + "H",
														"multi": "(" + 0 + " Multi)"
													};
												} else {
													riposiJsonData = {
														"InterventiDate": interventDate,
														"RiposiValue": (oRiposiNonWorkingDay[j].VALORE * 8).toString() + "H",
														"multi": "(" + multi.toString() + " Multi)"
													};
												}
												// Logic added on 28th Sep
												riposiArray.push(riposiJsonData);
												riposiJsonData = {};

												riposiflag = true;
												break;
											}

										}
										// Logic added on 28th Sep
										// riposiArray.push(riposiJsonData);
										// riposiJsonData = {};

										// riposiflag = true;
										// break;
									}

								}
							}

							/// ---------------------- END OF GIORNI = 5 For Loop

							// Below code commented on 29th Sep
							// if (!riposiflag) {
							// 	if (checkOKCountDatewise >= 3) {
							// 		multiJsonData = {
							// 			"InterventiDate": interventDate,
							// 			"RiposiValue": "0H",
							// 			"multi": "(" + multi.toString() + " Multi)"
							// 		};
							// 		riposiArray.push(multiJsonData);
							// 		multiJsonData = {};
							// 	}
							// 	// Below code commented on 28th Sep
							// 	// else {
							// 	// 	multiJsonData = {
							// 	// 		"InterventiDate": interventDate,
							// 	// 		"RiposiValue": "0H",
							// 	// 		"multi": "(" + 0 + " Multi)"
							// 	// 	};
							// 	// }

							// 	// riposiArray.push(multiJsonData);
							// 	// multiJsonData = {};
							// }
						}
					}

				} // End of for loop
				// ---------------------------------------- END OF NEW CODE ---------------------------------

				// ---------------------------------- COMMENTED BELOW CODE AS ON 1st Sep to implement changes
				// for (var i = 0; i < oSortedInterventiDateData.getData().length; ++i) {

				// 	// Need to execute loop every time for given Interventi Date in order to get Riposi value for given Interventi Date									
				// 	if (oSortedInterventiDateData.getData()[i].DATAINTERVENTO === interventDate.toString()) {
				// 		if (oSortedInterventiDateData.getData()[i].WORKINGDAY) { // Return for GIORNI = 1

				// 			for (var j = 0; j < oRiposiWorkingDay.length; ++j) {

				// 				// Check whether minute difference of Ora Inizio and Ora Fine is between DURATA_MIN & DURATA_MAX
				// 				if ((oRiposiWorkingDay[j].DURATA_MIN < sumOraIniFineMinsDIffSameIntervtDt && (sumOraIniFineMinsDIffSameIntervtDt <=
				// 						oRiposiWorkingDay[j].DURATA_MAX))) {

				// 					if (checkOKCountDatewise < 3) {
				// 						riposiJsonData = {
				// 							"InterventiDate": interventDate,
				// 							"RiposiValue": (oRiposiWorkingDay[j].VALORE * 8).toString() + "H",
				// 							"multi": "(" + 0 + " Multi)"
				// 						};
				// 					} else {
				// 						riposiJsonData = {
				// 							"InterventiDate": interventDate,
				// 							"RiposiValue": (oRiposiWorkingDay[j].VALORE * 8).toString() + "H",
				// 							"multi": "(" + multi.toString() + " Multi)"
				// 						};
				// 					}

				// 					riposiArray.push(riposiJsonData);
				// 					riposiJsonData = {};

				// 					riposiflag = true;
				// 					break;
				// 				}

				// 			}

				// 			if (!riposiflag) {
				// 				if (checkOKCountDatewise >= 3) {
				// 					multiJsonData = {
				// 						"InterventiDate": interventDate,
				// 						"RiposiValue": "0 H",
				// 						"multi": "(" + multi.toString() + " Multi)"
				// 					};

				// 					//riposiArray.push(riposiJsonData);
				// 					//riposiJsonData = {};
				// 				} else {
				// 					multiJsonData = {
				// 						"InterventiDate": interventDate,
				// 						"RiposiValue": "0 H",
				// 						"multi": "(" + 0 + " Multi)"
				// 					};

				// 					// riposiArray.push(riposiJsonData);
				// 					// riposiJsonData = {};
				// 					riposiArray.push(multiJsonData);
				// 					multiJsonData = {};									
				// 				}
				// 			}

				// 		} else { // Return for GIORNI = 5

				// 			for (var j = 0; j < oRiposiNonWorkingDay.length; ++j) {

				// 				// Overlapping Range
				// 				// 240 - 480 
				// 				// 240 - 1440 
				// 				if ((oRiposiNonWorkingDay[j].DURATA_MIN === 240 && oRiposiNonWorkingDay[j].DURATA_MAX === 480) && (oRiposiNonWorkingDay[j]
				// 						.DURATA_MIN <
				// 						sumOraIniFineMinsDIffSameIntervtDt && (sumOraIniFineMinsDIffSameIntervtDt <= oRiposiNonWorkingDay[j].DURATA_MAX))) {

				// 					oInterventiOraInizioTimestamp = oSortedInterventiDateData.getData()[i].ORAINIZIOTIMESTAMP;
				// 					oInterventiOraFineTimestamp = oSortedInterventiDateData.getData()[i].ORAFINETIMESTAMP;
				// 					oInterventiCurrentDayDate = new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData.getData()[i].DATAINTERVENTO));
				// 					oFascioInizioCurrentDayDate = new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData.getData()[i].DATAINTERVENTO)); // Fascio Inizio current day
				// 					oFascioFineSameDayDate = new Date(oInterventiCurrentDayDate); // Fascio Fine current day

				// 					oFascoInizioCurrentDayTimestamp = new Date(oFascioInizioCurrentDayDate.getFullYear(), oFascioInizioCurrentDayDate.getMonth(),
				// 						oFascioInizioCurrentDayDate.getDate(), (oRiposiNonWorkingDay[j].FASCIA_INIZIO).split(":")[0], (oRiposiNonWorkingDay[j].FASCIA_INIZIO)
				// 						.split(":")[1], "00");

				// 					// Check if Ora Inizio and Ora Fine Timestamp is between 08:30 AM (FASCIO_INIZIO of IDREGOLA = 10) - 10:00 PM (FASCIO_FINE of IDREGOLA = 14). NOTE - Here we are not considering FASCIO_FINE(11:00 PM) of IDREGOLA = 10 
				// 					oFascioFineSameDayTimestamp = new Date(oFascioFineSameDayDate.getFullYear(), oFascioFineSameDayDate.getMonth(),
				// 						oFascioFineSameDayDate.getDate(), "22", "00", "00");

				// 					// Check if Ora Inizio and Ora Fine value is range between FASCIO_INIZIO and FASCIO_FINE value for same day 
				// 					// It mean to consider IDREGOLA = 10 and not IDREGOLA = 14 if below condition is true
				// 					if ((oInterventiOraInizioTimestamp > oFascoInizioCurrentDayTimestamp && oInterventiOraInizioTimestamp <=
				// 							oFascioFineSameDayTimestamp) && oInterventiOraFineTimestamp > oFascoInizioCurrentDayTimestamp &&
				// 						oInterventiOraFineTimestamp <= oFascioFineSameDayTimestamp) {

				// 						if (checkOKCountDatewise < 3) {
				// 							riposiJsonData = {
				// 								"InterventiDate": interventDate,
				// 								"RiposiValue": "0.5".toString() + "H", // IDREGOLA = 10 (Rule no. 10). VALORE = 0.5
				// 								"multi": "(" + 0 + " Multi)"
				// 							};
				// 						} else {
				// 							riposiJsonData = {
				// 								"InterventiDate": interventDate,
				// 								"RiposiValue": "0.5".toString() + "H",
				// 								"multi": "(" + multi.toString() + " Multi)"
				// 							};
				// 						}
				// 					} else { // If Ora Inizio Timestamp is > 08:30 AM & Ora Fine Timestamp is > 10:00 PM. In all other cases VALORE = 1, IDREGOLA = 14
				// 						if (checkOKCountDatewise < 3) {
				// 							riposiJsonData = {
				// 								"InterventiDate": interventDate,
				// 								"RiposiValue": "8".toString() + "H",
				// 								"multi": "(" + 0 + " Multi)"
				// 							};
				// 						} else {
				// 							riposiJsonData = {
				// 								"InterventiDate": interventDate,
				// 								"RiposiValue": "8".toString() + "H",
				// 								"multi": "(" + multi.toString() + " Multi)"
				// 							};
				// 						}
				// 					}

				// 					riposiArray.push(riposiJsonData);
				// 					riposiJsonData = {};

				// 					riposiflag = true;
				// 					break;

				// 				} else {
				// 					if ((oRiposiNonWorkingDay[j].DURATA_MIN < sumOraIniFineMinsDIffSameIntervtDt && (sumOraIniFineMinsDIffSameIntervtDt <=
				// 							oRiposiNonWorkingDay[j].DURATA_MAX))) {

				// 						if (checkOKCountDatewise < 3) {
				// 							riposiJsonData = {
				// 								"InterventiDate": interventDate,
				// 								"RiposiValue": (oRiposiNonWorkingDay[j].VALORE * 8).toString() + "H",
				// 								"multi": "(" + 0 + " Multi)"
				// 							};
				// 						} else {
				// 							riposiJsonData = {
				// 								"InterventiDate": interventDate,
				// 								"RiposiValue": (oRiposiNonWorkingDay[j].VALORE * 8).toString() + "H",
				// 								"multi": "(" + multi.toString() + " Multi)"
				// 							};
				// 						}

				// 						riposiArray.push(riposiJsonData);
				// 						riposiJsonData = {};

				// 						riposiflag = true;
				// 						break;
				// 					}
				// 				}
				// 			}

				// 			if (!riposiflag) {
				// 				if (checkOKCountDatewise >= 3) {
				// 					multiJsonData = {
				// 						"InterventiDate": interventDate,
				// 						"RiposiValue": "0 H",
				// 						"multi": "(" + multi.toString() + " Multi)"
				// 					};
				// 				} 
				// 				// *************** Commented below line of code as 0 H (0 Multi) should not be displayed as Riposi Value
				// 				// else {
				// 				// 	multiJsonData = {
				// 				// 		"InterventiDate": interventDate,
				// 				// 		"RiposiValue": "0 H",
				// 				// 		"multi": "(" + 0 + " Multi)"
				// 				// 	};
				// 				// }

				// 				riposiArray.push(riposiJsonData);
				// 				riposiJsonData = {};
				// 			}
				// 		}
				// 	}
				// } // End of for loop
				// ------------------------------------------------END OF EXISTING CODE ---------------------------------------------------------------

				var uniqueInterventiDateRiposi = [];

				// Below condition implies that for NONWORKING DAY if uniqueInterventiDateRiposi contains more than 1 records
				// It implies that both first slot and second slot RIPOSI value exits For e.g. below - To consider highest array value
				// as this contains RIPOSI value of sum of first slot and second slot.
				// uniqueInterventiDateRiposi array value below:
				// 0:
				// InterventiDate: "26-09-2020"
				// RiposiValue: "4H"
				// multi: "(0 Multi)"
				// 1:
				// InterventiDate: "26-09-2020"
				// RiposiValue: "8H"
				// multi: "(0 Multi)"
				// length: 2

				if (nonWorkingDayFlag) {

					if (riposiArray.length > 0) {
						uniqueInterventiDateRiposi.push(riposiArray[riposiArray.length - 1]);

						// Below working code commented on 25th Nov to implement below logic
						// // Logic to calculate total RIPOSI value for same Interventi Date 
						// for (var i = 0; i < riposiArray.length; ++i) {
						// 	if (riposiArray.length == 1) {
						// 		if (riposiArray[i].RiposiValue !== "" && riposiArray[i].RiposiValue !== undefined &&
						// 			riposiArray[i].RiposiValue !== null) {
						// 			riposi = riposiArray[i].RiposiValue;
						// 			totRiposiValue = parseInt(riposi.substr(0, (riposi.indexOf("H"))));
						// 		} else {
						// 			totRiposiValue = 0;
						// 		}
						// 	} else {
						// 		if (riposiArray[i].RiposiValue !== "" && riposiArray[i].RiposiValue !== undefined &&
						// 			riposiArray[i].RiposiValue !== null) {
						// 			riposi = riposiArray[i].RiposiValue;
						// 			totRiposiValue = totRiposiValue + parseInt(riposi.substr(0, (riposi.indexOf("H"))));
						// 		}
						// 	}
						// }

						// Logic added on 25th Nov - Bug fix
						// The issue was when 2 Interventions exists for same Non-Working day for either first slots (both) or secode slots (both)
						// then "riposiArray" contains two different 'RiposiValue' one for each first slot. Here the locic to calculate total RIPOSI value for same Interventi Date
						// does summation of both first slot 'RiposiValue' which is incorrect as above logic already does summation of 'MINDIFFORAINIFINE' of each first slot
						// e.g. 
						//	Interventi Date					Ora Inizio			Ora Fine	Riposi
						//	29-11-2020						10:00				13:00		4H (0 Multi)
						//	29-11-2020						17:00				19:00		4H (0 Multi)
						// Output - Here instead of 4H it returns 8H which is incorrect
						// Conclusion - Here if 2 Interventions of same Interventi Date is for 2 different slots (first and second) then existing logic works but if 2 Intervntions of same
						// Interventi Data is for same slots (first or second) then the issue occurs. Above logic is implemented to fix the issue

						// Multiple slots exists for "firstslot" and not "secondslot"
						if (sumOraIniFineMinsDIffSameIntervtDtNonWorkDayfirstSlot !== 0 && sumOraIniFineMinsDIffSameIntervtDtNonWorkDaysecSlot === 0) {
							// Get 'Riposi' calculated value of 1st record as all the records will contain same calculated Riposi value
							if (riposiArray[0].RiposiValue !== "" && riposiArray[0].RiposiValue !== undefined &&
								riposiArray[0].RiposiValue !== null) {
								riposi = riposiArray[0].RiposiValue;
								totRiposiValue = parseInt(riposi.substr(0, (riposi.indexOf("H"))));
							}
						}
						// Multiple slots exists for "secondslot" and not "firstslot"
						else if (sumOraIniFineMinsDIffSameIntervtDtNonWorkDaysecSlot !== 0 && sumOraIniFineMinsDIffSameIntervtDtNonWorkDayfirstSlot ===
							0) {
							// Get 'Riposi' calculated value of 1st record as all the records will contain same calculated Riposi value
							if (riposiArray[0].RiposiValue !== "" && riposiArray[0].RiposiValue !== undefined &&
								riposiArray[0].RiposiValue !== null) {
								riposi = riposiArray[0].RiposiValue;
								totRiposiValue = parseInt(riposi.substr(0, (riposi.indexOf("H"))));
							}
						} else {
							// Need to check below condition - If multiple slots exists for both first and second slot of same Interventi Date
							// else if(sumOraIniFineMinsDIffSameIntervtDtNonWorkDaysecSlot !== 0 && sumOraIniFineMinsDIffSameIntervtDtNonWorkDayfirstSlot !== 0){

							// }

							// Logic to calculate total RIPOSI value for same Interventi Date 
							for (var i = 0; i < riposiArray.length; ++i) {
								if (riposiArray.length == 1) {
									if (riposiArray[i].RiposiValue !== "" && riposiArray[i].RiposiValue !== undefined &&
										riposiArray[i].RiposiValue !== null) {
										riposi = riposiArray[i].RiposiValue;
										totRiposiValue = parseInt(riposi.substr(0, (riposi.indexOf("H"))));
									} else {
										totRiposiValue = 0;
									}
								} else {
									if (riposiArray[i].RiposiValue !== "" && riposiArray[i].RiposiValue !== undefined &&
										riposiArray[i].RiposiValue !== null) {
										riposi = riposiArray[i].RiposiValue;
										totRiposiValue = totRiposiValue + parseInt(riposi.substr(0, (riposi.indexOf("H"))));
									}
								}
							}
						}
						if (totRiposiValue > 8) {
							totRiposiValue = 8; // If RIPOSI value is greater than 8 then reset the value to "8"
						}

						uniqueInterventiDateRiposi[0].RiposiValue = totRiposiValue + "H";
					}
				} else if (workingDayFlag && that.RIPFLAG) {

					// Get max index value of 'uniqueInterventiDateRiposi' array (e.g. below RiposiValue: "8H") as "that.unique(riposiArray)" function will return both the values
					// uniqueInterventiDateRiposi array value below:
					// 0:
					// InterventiDate: "26-09-2020"
					// RiposiValue: "4H"
					// multi: "(0 Multi)"
					// 1:
					// InterventiDate: "26-09-2020"
					// RiposiValue: "8H"
					// multi: "(0 Multi)"
					// length: 2					

					if (riposiArray.length > 0) {
						uniqueInterventiDateRiposi.push(riposiArray[riposiArray.length - 1]);
					}

				} else if (workingDayFlag && (!that.RIPFLAG)) { // RIP condition is false (not checked)
					if (riposiArray.length > 0) {
						// Check below code if doesnt work then uncomment next line of code
						uniqueInterventiDateRiposi = that.unique(riposiArray);
					}
				}

				////var uniqueInterventiDateRiposi = that.unique(riposiArray);
				var oInterventiDateModel = that.getView().byId("idTableInterventi").getModel("RepintInterventiModel");

				// KAPIL - Please check below code. Commented to fix riposi issue as on 5th Aug
				// Below code uncommented on 29th Sep
				for (var index = 0; index < oSortedInterventiDateData.length; ++index) {
					for (var indexDt = 0; indexDt < uniqueInterventiDateRiposi.length; ++indexDt) {
						//////// if ((new Date(Formatter.formatDateToMMDDYYYY(oSortedInterventiDateData[index].DATAINTERVENTO))).toString() === (
						// 		uniqueInterventiDateRiposi[indexDt].InterventiDate).toString()) {
						if (oSortedInterventiDateData[index].DATAINTERVENTO === uniqueInterventiDateRiposi[indexDt].InterventiDate) {

							// // Below condition implies that for NONWORKING DAY if uniqueInterventiDateRiposi contains more than 1 records
							// // It implies that both first slot and second slot RIPOSI value exits e.g. below than to consider highest array value
							// // as this contains RIPOSI value of sum of first slot and second slot.
							// // uniqueInterventiDateRiposi array value below:
							// // 0:
							// // InterventiDate: "26-09-2020"
							// // RiposiValue: "4H"
							// // multi: "(0 Multi)"
							// // 1:
							// // InterventiDate: "26-09-2020"
							// // RiposiValue: "8H"
							// // multi: "(0 Multi)"
							// // length: 2

							// if(oSortedInterventiDateData[index].NONWORKINGDAY && uniqueInterventiDateRiposi.length > 1)
							// {			
							// 	indexDt = uniqueInterventiDateRiposi.length - 1;
							// }							
							// // Below line of code added on 29th Sep
							// // If RIPOSI value is greater than 8 reset it to 8
							// if(uniqueInterventiDateRiposi[indexDt].RiposiValue > 8){
							// 	uniqueInterventiDateRiposi[indexDt].RiposiValue = 8;
							// }

							oInterventiDateModel.getData()[index].RIPOSI = uniqueInterventiDateRiposi[indexDt].RiposiValue + " " +
								uniqueInterventiDateRiposi[indexDt].multi; // Always first index for new Interventi date
							//oSortedInterventiDateData[index].RIPOSI = uniqueInterventiDateRiposi[indexDt].RiposiValue; // Always first index for new Interventi date
							uniqueInterventiDateRiposi.splice(0, 1);
							break;
						}
					}
				}

				// Logic added on 28th Sep 
				// Below code commented on 29th Sep
				// totRiposiValue = 0;
				// riposi = 0;
				// for (var index = 0; index < oSortedInterventiDateData.length; ++index) {
				// 	for (var indexDt = 0; indexDt < uniqueInterventiDateRiposi.length; ++indexDt) {
				// 		if (oSortedInterventiDateData[index].DATAINTERVENTO === uniqueInterventiDateRiposi[indexDt].InterventiDate) {

				// 			// Logic to calculate total RIPOSI value for same Interventi Date
				// 			for (var i = 0; i < riposiArray.length; ++i) {
				// 				if (riposiArray.length == 1) {
				// 					if (riposiArray[i].RiposiValue !== "" && riposiArray[i].RiposiValue !== undefined &&
				// 						riposiArray[i].RiposiValue !== null) {
				// 						riposi = riposiArray[i].RiposiValue;
				// 						totRiposiValue = parseInt(riposi.substr(0, (riposi.indexOf("H"))));
				// 					} else {
				// 						totRiposiValue = 0;
				// 					}
				// 				} else {
				// 					if (riposiArray[i].RiposiValue !== "" && riposiArray[i].RiposiValue !== undefined &&
				// 						riposiArray[i].RiposiValue !== null) {
				// 						riposi = riposiArray[i].RiposiValue;
				// 						totRiposiValue = totRiposiValue + parseInt(riposi.substr(0, (riposi.indexOf("H"))));
				// 					}
				// 				}
				// 			}
				// 			if (totRiposiValue > 8) {
				// 				totRiposiValue = 8; // If RIPOSI value is greater than 8 then reset the value to "8"
				// 			}
				// 			oInterventiDateModel.getData()[index].RIPOSI = totRiposiValue + "H " + uniqueInterventiDateRiposi[indexDt].multi; // Always first index for new Interventi date
				// 			uniqueInterventiDateRiposi.splice(0, 1);
				// 		}
				// 	}
				// 	break;
				// }

				// KAPIL - Below code added on 5th Aug 
				// for (var index = 0; index < oSortedInterventiDateData.length; ++index) {
				// 	for (var indexDt = 0; indexDt < uniqueInterventiDateRiposi.length; ++indexDt) {
				// 		if (oSortedInterventiDateData[index].DATAINTERVENTO === uniqueInterventiDateRiposi[indexDt].InterventiDate) {
				// 			for (var k = indexDt; k < uniqueInterventiDateRiposi.length; ++k) {
				// 				// Always first index for new Interventi date
				// 				oInterventiDateModel.getData()[index].RIPOSI = oInterventiDateModel.getData()[index].RIPOSI +
				// 					uniqueInterventiDateRiposi[k].RiposiValue + " " + uniqueInterventiDateRiposi[k].multi;
				// 				uniqueInterventiDateRiposi.splice(0, 1);
				// 			}
				// 			//break;
				// 			///indexInter = indexDt + 1; 
				// 		}
				// 	}
				// 	break;
				// }

				oInterventiDateModel.updateBindings(true);

			});

		},

		setStessacausaleToZeroForAllInterventiRec: function (oSortedInterventiModelData) {

			// Reset all 'STESSACAUSALE' value to 0 for all Interventi Records so as to update it with latest value
			for (var i = 0; i < oSortedInterventiModelData.length; ++i) {
				oSortedInterventiModelData[i].STESSACAUSALE = 0;
			}
		},

		setStessacausale: function (oInterventiDateModel) {
			var j = 0;
			var ind = 0;
			var indexInter = 0;
			var oGroupByInterventiDateArray;
			var uniqueinterventDates = $.unique(oInterventiDateModel.getData().map(function (value) {
				return value.DATAINTERVENTO;
			})); // Get Unique Interventi Dates

			var oSortedInterventiModelData = oInterventiDateModel.getData();

			this.setStessacausaleToZeroForAllInterventiRec(oSortedInterventiModelData);

			//Iterate through unique Interventi Dates to get set of Interventi records group by unique Interventi Dates
			uniqueinterventDates.map(function (interventDate) {

				//  Below code will return set of Interventi records group by Interventi Dates
				oGroupByInterventiDateArray = jQuery.grep(oSortedInterventiModelData, function (a) {
					return (a.DATAINTERVENTO == interventDate);
				});

				// Riposi	DATAINTERVENTO	RIP	IDINTERVENTO	CONTINTERVENTO	FLAGCONT 	STESSACAUSALE
				// 			8/6/2020				1				0				0			0
				// 			8/6/2020				2				0				0			1
				// 			8/6/2020				3				0				0			1
				// 			8/6/2020				4				0				0			1
				//   4H		9/6/2020				5				0				0			0	
				// 			9/6/2020				6				0				0			5
				// 			10/6/2020				7				0				0			0
				// 			10/6/2020				8				9				0			7
				// 			11/6/2020		X		9				0				1			7
				//			11/6/2020				10				11				0			9
				//			12/6/2020		X		11				0				1			9
				//			13/6/2020		X		12				0				1			9/11 ??

				// oGroupByInterventiDateArray below:
				// 8/6/2020
				// 9/6/2020
				// 10/6/2020
				// 11/6/2020
				// 12/6/2020
				// 13/6/2020

				// Logic to set STESSACAUSALE
				for (var i = 0; i < oGroupByInterventiDateArray.length; ++i) {
					if (oGroupByInterventiDateArray.length === 1) {
						oGroupByInterventiDateArray[0].STESSACAUSALE = 0;
						break;
					} else if (i === oGroupByInterventiDateArray.length - 1) {
						// CHECK 
						//////oGroupByInterventiDateArray[i + 1].STESSACAUSALE = oGroupByInterventiDateArray[0].IDINTERVENTO;
						break;
					}
					j = i + 1;

					// Set first Interventi Record "IDINTERVENTO" in all subsequent Interventi Records
					oGroupByInterventiDateArray[j].STESSACAUSALE = oGroupByInterventiDateArray[0].IDINTERVENTO;
				}

				// 8/06
				// 8/06
				// 9/06
				// 9/06
				// 10/06
				// 10/06

				// indexInter=0
				// x=0, x < 6

				// m = 0, ind=0, oSortedInterventiModelData[0]=oGroupByInterventiDateArray[0]
				// indexInter = 1
				// m = 1, ind = 1, oSortedInterventiModelData[1] = oGroupByInterventiDateArray[1]
				// indexInter = 2

				// x = 2, x < 6,
				// m = 0, ind = 2, oSortedInterventiModelData[2] = oGroupByInterventiDateArray[0]
				// indexInter = 3
				// m = 1, ind = 3, oSortedInterventiModelData[3] = oGroupByInterventiDateArray[1]
				// indexInter = 4

				// x = 4, x < 6
				// m = 0, ind = 4, oSortedInterventiModelData[4] = oGroupByInterventiDateArray[0]
				// indexInter = 5
				// m = 1, ind = 5 oSortedInterventiModelData[5] = oGroupByInterventiDateArray[1]
				// indexInter = 6

				// Updating original oSortedInterventiModelData records with updated oGroupByInterventiDateArray values
				//indexInter = 0;
				//ind = 0;

				// for (var x = 0; x < oSortedInterventiModelData.length; x = x + indexInter) {
				// 	if (oSortedInterventiModelData[x].DATAINTERVENTO === interventDate) {
				// 		for (var m = 0; m < oGroupByInterventiDateArray.length; ++m) {
				// 			ind = x + m;
				// 			oSortedInterventiModelData[ind] = oGroupByInterventiDateArray[m]; // Update values are proper index of oSortedInterventiModelData records
				// 			//indexInter = indexInter + ind;
				// 			indexInter = ind + 1;
				// 		}
				// 	}
				// }
				for (var x = indexInter; x < oSortedInterventiModelData.length; ++x) {
					if (oSortedInterventiModelData[x].DATAINTERVENTO === interventDate) {
						for (var m = 0; m < oGroupByInterventiDateArray.length; ++m) {
							ind = x + m;
							oSortedInterventiModelData[ind] = oGroupByInterventiDateArray[m]; // Update values are proper index of oSortedInterventiModelData records
							indexInter = ind + 1;
						}
					}
					break;
				}

			});

			console.log("********** SET STESSACAUSALE *********");
			console.log(oSortedInterventiModelData);
			this.setStessacausaleForRIP(uniqueinterventDates, oSortedInterventiModelData);
		},

		// Below function is called after 'STESSACAUSALE' is set for all Interventi records to update 'STESSACAUSALE' for RIP checked Interventi record
		setStessacausaleForRIP: function (uniqueinterventDates, oSortedInterventiModelData) {

			var oFirstInterventiDateWiseRecordArray = [];
			var oGroupByInterventiDateArray;
			var j = 0;
			var ind = 0;
			var indexInter = 0;

			//Iterate through unique Interventi Dates to get set of Interventi records group by unique Interventi Dates
			uniqueinterventDates.map(function (interventDate) {

				//  Below code will return set of Interventi records group by Interventi Dates
				oGroupByInterventiDateArray = jQuery.grep(oSortedInterventiModelData, function (a) {
					return (a.DATAINTERVENTO == interventDate);
				});

				// Riposi	DATAINTERVENTO	RIP	IDINTERVENTO	CONTINTERVENTO	FLAGCONT 	STESSACAUSALE
				// 			8/6/2020				1				0				0			0
				// 			8/6/2020				2				0				0			1
				// 			8/6/2020				3				0				0			1
				// 			8/6/2020				4				0				0			1
				//   4H		9/6/2020				5				0				0			0	
				// 			9/6/2020				6				0				0			5
				// 			10/6/2020				7				0				0			0
				// 			10/6/2020				8				9				0			7
				// 			11/6/2020		X		9				0				1			7
				//			11/6/2020				10				11				0			9
				//			12/6/2020		X		11				0				1			9
				//			13/6/2020		X		12				0				1			9/11 ??

				// oGroupByInterventiDateArray below:
				// 8/6/2020
				// 9/6/2020
				// 10/6/2020
				// 11/6/2020
				// 12/6/2020
				// 13/6/2020

				// Logic to set STESSACAUSALE
				//var oFirstInterventiDateWiseRecord;
				//var firstIdInterventi;

				// Create an array of each first Interventi Record - Group by date
				oFirstInterventiDateWiseRecordArray.push(oGroupByInterventiDateArray[0]);

				// oFirstInterventiDateWiseRecordArray contains below records
				// Riposi	DATAINTERVENTO	RIP	IDINTERVENTO	CONTINTERVENTO	FLAGCONT 	STESSACAUSALE
				// 			8/6/2020				1				0				0			0
				//   4H		9/6/2020				5				0				0			0									
				// 			10/6/2020				7				0				0			0
				// 			11/6/2020		X		9				0				1			7
				//			12/6/2020		X		11				0				1			9
				//			13/6/2020		X		12				0				1			11 ??		

			});

			// Logic to set 'STESSACAUSALE' for each Interventi record containing RIP = X with pervious record IDINTERVENTO
			for (var i = 0; i < oFirstInterventiDateWiseRecordArray.length; ++i) {
				if (oFirstInterventiDateWiseRecordArray.length === 1) {
					oFirstInterventiDateWiseRecordArray[0].STESSACAUSALE = 0;
					break;
				} else if (i === oFirstInterventiDateWiseRecordArray.length - 1) { // Indicates last Interventi record with RIP checked
					break;
				}
				j = i + 1;

				// If next oFirstInterventiDateWiseRecordArray record RIP is checked then set previous record 'IDINTERVENTO' value to this record's 'STESSACAUSALE' value
				if (oFirstInterventiDateWiseRecordArray[j].FLAGCONT) {
					oFirstInterventiDateWiseRecordArray[j].STESSACAUSALE = oFirstInterventiDateWiseRecordArray[i].IDINTERVENTO;
				}
			}

			//Iterate through unique Interventi Dates to get set of Interventi records group by unique Interventi Dates
			// uniqueinterventDates.map(function (interventDate) {
			// 	// Updating original oSortedInterventiModelData records with updated oFirstInterventiDateWiseRecordArray values
			// 	for (var x = indexInter; x < oSortedInterventiModelData.length; ++x) { 
			// 		if (oSortedInterventiModelData[x].DATAINTERVENTO === interventDate) {
			// 			for (var m = 0; m < oFirstInterventiDateWiseRecordArray.length; ++m) {
			// 				ind = x + m;
			// 				oSortedInterventiModelData[ind] = oFirstInterventiDateWiseRecordArray[m]; // Update values are proper index of oSortedInterventiModelData records
			// 				indexInter = ind + 1;
			// 			} 
			// 		}
			// 		break;
			// 	}				

			// });

			//oSortedInterventiModelData
			//DATAINTERVENTO	RIP	IDINTERVENTO	CONTINTERVENTO	FLAGCONT 	STESSACAUSALE
			// 9/6/2020					5				0				0			0
			// 9/6/2020					6				0				0			5
			// 10/6/2020				7				0				0			0
			// 10/6/2020				8				9				0			7
			// 11/6/2020		X		9				0				1			7

			// oFirstInterventiDateWiseRecordArray
			// 9/6/2020	
			// 10/6/2020
			// 11/6/2020

			for (var x = 0; x < oSortedInterventiModelData.length; ++x) {
				for (var j = 0; j < oFirstInterventiDateWiseRecordArray.length; ++j) {
					if (oSortedInterventiModelData[x].DATAINTERVENTO === oFirstInterventiDateWiseRecordArray[j].DATAINTERVENTO) {
						oSortedInterventiModelData[x] = oFirstInterventiDateWiseRecordArray[j]; // Update values are proper index of oSortedInterventiModelData records	
						oFirstInterventiDateWiseRecordArray.splice(j, 1);
						break;
					}
				}
			}

			// uniqueinterventDates.map(function (interventDate) {
			// 	// Updating original oSortedInterventiModelData records with updated oFirstInterventiDateWiseRecordArray values
			// 	for (var x = 0; x < oSortedInterventiModelData.length; ++x) { 
			// 		if (oSortedInterventiModelData[x].DATAINTERVENTO === interventDate) {
			// 			for(var j = 0 ; j < oFirstInterventiDateWiseRecordArray.length ; ++j){
			// 				if(oFirstInterventiDateWiseRecordArray[j].DATAINTERVENTO === interventDate){
			// 					oSortedInterventiModelData[x] = oFirstInterventiDateWiseRecordArray[j]; // Update values are proper index of oSortedInterventiModelData records	
			// 					break;
			// 				}
			// 			}
			// 		}
			// 	}				
			//});
			console.log("********** SET STESSACAUSALE FOR RIP *********");
			console.log(oSortedInterventiModelData);

			this.calcTotGioRipCompIntDett(oSortedInterventiModelData);
		},

		calcTotGioRipCompIntDett: function (oSortedInterventiModelData) {
			var IdsIntervento = "";
			var totRiposiValue = 0;
			var riposi;
			// Total summation of this value for all Interventi records is required to push in backend table for Reporting functionality
			this.TOTALE_GIORNI_RIPOSI_COMPENSATIVI = this.getOwnerComponent().getModel("viewProperties").getProperty(
				"/TOTALE_GIORNI_RIPOSI_COMPENSATIVI");

			for (var i = 0; i < oSortedInterventiModelData.length; ++i) {
				if (oSortedInterventiModelData.length == 1) {
					if (oSortedInterventiModelData[i].RIPOSI !== "" && oSortedInterventiModelData[i].RIPOSI !== undefined &&
						oSortedInterventiModelData[i].RIPOSI !== null) {
						riposi = oSortedInterventiModelData[i].RIPOSI;
						totRiposiValue = parseInt(riposi.substr(0, (riposi.indexOf("H"))));
					} else {
						totRiposiValue = 0;
					}
					IdsIntervento = (oSortedInterventiModelData[i].IDINTERVENTO).toString();
				} else {
					if (oSortedInterventiModelData[i].RIPOSI !== "" && oSortedInterventiModelData[i].RIPOSI !== undefined &&
						oSortedInterventiModelData[i].RIPOSI !== null) {
						riposi = oSortedInterventiModelData[i].RIPOSI;
						totRiposiValue = totRiposiValue + parseInt(riposi.substr(0, (riposi.indexOf("H"))));
					}
					if (i === oSortedInterventiModelData.length - 1) {
						IdsIntervento = IdsIntervento + (oSortedInterventiModelData[i].IDINTERVENTO).toString();
					} else {
						IdsIntervento = IdsIntervento + (oSortedInterventiModelData[i].IDINTERVENTO).toString() + ",";
					}
				}
			}

			for (var j = 0; j < oSortedInterventiModelData.length; ++j) {
				oSortedInterventiModelData[j].TOTALE_GIORNI_RIPOSI_COMPENSATIVI = (totRiposiValue / 8);
				// Commented below line of code on 4th Feb - Identified as a bug perhaps (Check)
				///////this.TOTALE_GIORNI_RIPOSI_COMPENSATIVI = this.TOTALE_GIORNI_RIPOSI_COMPENSATIVI + oSortedInterventiModelData[j].TOTALE_GIORNI_RIPOSI_COMPENSATIVI;
				oSortedInterventiModelData[j].INTERVENTI_DETTAGLIO = IdsIntervento;
			}

			// Added below line of code on 4th Feb
			this.TOTALE_GIORNI_RIPOSI_COMPENSATIVI = (totRiposiValue / 8);			
			
			// Update value with total of "this.TOTALE_GIORNI_RIPOSI_COMPENSATIVI" value for all Interventi Records
			this.getOwnerComponent().getModel("viewProperties").setProperty("/TOTALE_GIORNI_RIPOSI_COMPENSATIVI", this.TOTALE_GIORNI_RIPOSI_COMPENSATIVI);
			console.log("********** calcTotGioRipCompIntDett *********");
			console.log(oSortedInterventiModelData);

			this.handleCreateAfterSubmit(oSortedInterventiModelData);
		},

		// handleInterDateLPNChange: function (oEvent) {
		// 	var oRepDateModel = this.getView().byId("idTableReperibilita").getModel("RepintReperibilitaModel");

		// 	var oInterventiDateModel = this.getView().byId("idTableInterventi").getModel("RepintInterventiModel");
		// 	var indexInterventi = oEvent.getSource().getParent().getParent().indexOfItem(oEvent.getSource().getParent());

		// 	var Dtflag = false;

		// 	for (var j = 0; j < oRepDateModel.getData().length; ++j) {
		// 		if (oInterventiDateModel.getData()[indexInterventi].DATAINTERVENTO === oRepDateModel.getData()[j].DATAREPERIBILITA) {
		// 			Dtflag = true;
		// 		}
		// 	}
		// 	if ((!Dtflag) && oInterventiDateModel.getData()[indexInterventi].FLAGNOTTURNO !== true) {
		// 		oInterventiDateModel.getData()[indexInterventi].DATAINTERVENTO = null;
		// 		oInterventiDateModel.updateBindings(true);
		// 		MessageBox.error("Per l'intervento inserire una data presente in Reperibilità");
		// 		return;
		// 	}

		// },

		handleInterDateLPNChange: function (oEvent) {
			var oRepDateModel = this.getView().byId("idTableReperibilita").getModel("RepintReperibilitaModel");

			var oInterventiDateModel = this.getView().byId("idTableInterventi").getModel("RepintInterventiModel");
			var indexInterventi = oEvent.getSource().getParent().getParent().indexOfItem(oEvent.getSource().getParent());
			var oInterventiTable = this.getView().byId("idTableInterventi");

			var Dtflag = false;

			for (var j = 0; j < oRepDateModel.getData().length; ++j) {
				if (oInterventiDateModel.getData()[indexInterventi].DATAINTERVENTO === oRepDateModel.getData()[j].DATAREPERIBILITA) {
					Dtflag = true;
				}
			}
			if (Dtflag && oInterventiDateModel.getData()[indexInterventi].FLAGNOTTURNO === true && (oInterventiDateModel.getData()[
						indexInterventi].DATAINTERVENTO !== "" &&
					oInterventiDateModel.getData()[indexInterventi].DATAINTERVENTO !== undefined && oInterventiDateModel.getData()[indexInterventi].DATAINTERVENTO !==
					null)) { // Not allowed - If LPN is checked and Reperibilita date equals to Interventi Date
				oInterventiDateModel.getData()[indexInterventi].DATAINTERVENTO = null;
				oInterventiDateModel.updateBindings(true);
				oInterventiTable.getItems()[indexInterventi].getCells()[2].setValueState(sap.ui.core.ValueState.Error);
				MessageBox.error("La data di Intervento selezionata non deve essere uguale a nessuna data di ripetibilità inserita");
				return false;
			} else {
				oInterventiTable.getItems()[indexInterventi].getCells()[2].setValueState(sap.ui.core.ValueState.None);
			}
			if ((!Dtflag) && oInterventiDateModel.getData()[indexInterventi].FLAGNOTTURNO !== true && (oInterventiDateModel.getData()[
						indexInterventi].DATAINTERVENTO !== "" &&
					oInterventiDateModel.getData()[indexInterventi].DATAINTERVENTO !== undefined && oInterventiDateModel.getData()[indexInterventi].DATAINTERVENTO !==
					null)) {
				oInterventiDateModel.getData()[indexInterventi].DATAINTERVENTO = null;
				oInterventiDateModel.updateBindings(true);
				oInterventiTable.getItems()[indexInterventi].getCells()[2].setValueState(sap.ui.core.ValueState.Error);
				// Below code commented on 7th Dec 2020
				// On selection of Chaimatoda dropdown value initially if 'Interventi' date is not selected (blank) application use to show error message to user to that 'Interventi' date cannot be blank
				// But now the change is - Not to show error message on selection of Chaimatoda dropdown value
				// For any other field validation need to show message as usual
				//////MessageBox.error("Per l'intervento inserire una data presente in Reperibilità");
				return false;
			} else {
				oInterventiTable.getItems()[indexInterventi].getCells()[2].setValueState(sap.ui.core.ValueState.None);
			}
			return true;
		},

		onAddItems1: function () {
			var data = this.getView().byId("idTableReperibilita").getModel("RepintReperibilitaModel").getProperty("/");
			var oDate = new Date(this.getOwnerComponent().getModel("viewProperties").getProperty("/ANNOMESE"));
			var firstDay = new Date(oDate.getFullYear(), oDate.getMonth(), 1);
			var lastDay = new Date(oDate.getFullYear(), oDate.getMonth() + 1, 0);

			// that.getView().byId("dpAnnoMese").setDisplayFormat(month + "-" + oEvent.getSource().getDateValue().getFullYear());
			// that.getView().byId("dpAnnoMese").setValueFormat(month + "-" + oEvent.getSource().getDateValue().getFullYear());

			//var today = new Date();
			//var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
			//var lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

			if (data.length === 1) {
				data[0].oButton2 = true;
			}

			var oEntry = {
				"IDSCHEDA": "",
				//"DATAREPERIBILITA": data.DATAREPERIBILITA,
				"DATAREPERIBILITA": "",
				"IDREPERIBILITA": "",
				"Fer": false,
				"Sab": false,
				"Dom": false,
				"minDate": firstDay,
				"maxDate": lastDay,
				"oButton1": true,
				"oButton2": true
			};

			// var oEntry = {
			// 	"Data": "",
			// 	"Fer": false, 
			// 	"Sab": false,
			// 	"Dom": false,
			// 	"Aggiorna": "",
			// 	"Elimina": "",
			// 	"minDate": firstDay,
			// 	"maxDate": lastDay,
			// };

			data.push(oEntry);
			this.getView().byId("idTableReperibilita").getModel("RepintReperibilitaModel").setProperty("/", data);
			this.getView().byId("txtAggiorna").setText(data.length);
			this.getView().byId("txtElimina").setText(data.length);
		},

		onAddItems1New: function () {
			var data = [];
			if (this.getView().byId("idTableReperibilita").getModel("RepintReperibilitaModel") === undefined || this.getView().byId(
					"idTableReperibilita").getModel("RepintReperibilitaModel") === null || this.getView().byId("idTableReperibilita").getModel(
					"RepintReperibilitaModel").getData() === null || this.getView().byId("idTableReperibilita").getModel("RepintReperibilitaModel")
				.getData() ===
				undefined) {
				data = [];
			} else {
				data = this.getView().byId("idTableReperibilita").getModel("RepintReperibilitaModel").getProperty("/");
			}

			// var today = new Date();
			// var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
			// var lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

			//var oDate = new Date(this.getOwnerComponent().getModel("viewProperties").getProperty("/annomeseDateValue")); 
			//			var oDate = new Date(this.getOwnerComponent().getModel("viewProperties").getProperty("/ANNOMESE"));
			var oDate = new Date(this.getOwnerComponent().getModel("viewProperties").getProperty("/ANNOMESE"));
			//var vMonth = oDate.getMonth() + 1;
			// var month = "";
			// if (vMonth < 10) {
			// 	month = "0" + vMonth;
			// } else {
			// 	month = vMonth;
			// }			

			//that.getView().byId("dpAnnoMese").setDisplayFormat(month + "-" + oDate.getFullYear());
			//that.getView().byId("dpAnnoMese").setValueFormat(month + "-" + oDate.getFullYear());

			var firstDay = new Date(oDate.getFullYear(), oDate.getMonth(), 1);
			var lastDay = new Date(oDate.getFullYear(), oDate.getMonth() + 1, 0);

			// var data = this.getView().byId("idTableReperibilita").getModel("RepintReperibilitaModel").getProperty("/");
			// var today = new Date();
			// var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
			// var lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

			//data.setProperty("/minDate",firstDay);
			//data.setProperty("/maxDate",lastDay);

			var oEntry = {
				"IDSCHEDA": "",
				//"DATAREPERIBILITA": data.DATAREPERIBILITA,
				"DATAREPERIBILITA": "",
				"IDREPERIBILITA": "",
				"Fer": false,
				"Sab": false,
				"Dom": false,
				"minDate": firstDay,
				"maxDate": lastDay,
				"oButton1": true,
				"oButton2": false
			};

			data.push(oEntry);

			if (this.getView().byId("idTableReperibilita").getModel("RepintReperibilitaModel") === undefined || this.getView().byId(
					"idTableReperibilita").getModel("RepintReperibilitaModel").getData() === null) {
				var _oNewModel = new sap.ui.model.json.JSONModel();
				_oNewModel.setData(data);
				this.getView().byId("idTableReperibilita").setModel(_oNewModel, "RepintReperibilitaModel");
			} else {
				this.getView().byId("idTableReperibilita").getModel("RepintReperibilitaModel").setProperty("/", data);
			}

			this.getView().byId("txtAggiorna").setText(data.length);
			this.getView().byId("txtElimina").setText(data.length);
		},

		onDeleteCategory1: function (oEvent) {
			var data = this.getView().byId("idTableReperibilita").getModel("RepintReperibilitaModel").getProperty("/");
			var dataInterventi = this.getView().byId("idTableInterventi").getModel("RepintInterventiModel").getProperty("/");
			var index = oEvent.getSource().getParent().getParent().indexOfItem(oEvent.getSource().getParent());

			// for(var i = 0; i < dataInterventi.length ; ++i){
			// 	if(data[index].DATAREPERIBILITA === dataInterventi[i].DATAINTERVENTO){
			// 		dataInterventi.splice(i,1);
			// 	}
			// }
			var i = dataInterventi.length;
			while (i--) {
				if (data[index].DATAREPERIBILITA === dataInterventi[i].DATAINTERVENTO) {
					dataInterventi.splice(i, 1);
				}
			}

			console.log(dataInterventi);

			data.splice(index, 1);
			this.chkFer(false);
			this.chkSab(false);
			this.chkDom(false);

			// if (data.length === 1) {
			// 	data[0].bDelete = false;
			// 	data[0].bAdd = true;
			// }
			// if (data.length === 0) {
			// 	data[0].bAdd = true;
			// 	data[0].bDelete = false;
			// }			
			// if (data.length - 1 === index) {
			// 	data[index - 1].bAdd = true;
			// }
			// data.splice(index, 1);
			// if (data.length === 1) {
			// 	data[0].bDelete = false;
			// 	data[0].bAdd = true;
			// }

			//this.getView().getModel("MainModel").setProperty("/ItemsInfo", data);
			this.getView().byId("idTableReperibilita").getModel("RepintReperibilitaModel").setProperty("/", data);
			this.getView().byId("txtAggiorna").setText(data.length);
			this.getView().byId("txtElimina").setText(data.length);

			if (data.length === 0) {
				this.getView().byId("txtAggiorna1").setText(1);
				this.getView().byId("txtElimina1").setText(1);
			} else {
				this.getView().byId("idTableInterventi").getModel("RepintInterventiModel").setProperty("/", dataInterventi);
				this.getView().byId("txtAggiorna1").setText(data.length);
				this.getView().byId("txtElimina1").setText(data.length);
			}

			if (data.length === 0) { // No record
				this.onAddItems1New();
			}
			if (dataInterventi.length === 0) // No record in Interventi table
			{
				this.chk1h(false);
				this.chk12h(false);
				this.chk24h(false);
				this.chk46h(false);
				this.chk68h(false);
				this.chk8h(false);
				this.onAddItems2New();
			}

		},
		onAddItems2: function () {

			//var data = this.getView().getModel("MainModel1").getProperty("/ItemsInfo1");
			var data = this.getView().byId("idTableInterventi").getModel("RepintInterventiModel").getProperty("/");
			var oDate = new Date(this.getOwnerComponent().getModel("viewProperties").getProperty("/ANNOMESE"));
			var firstDay = new Date(oDate.getFullYear(), oDate.getMonth(), 1);
			var lastDay = new Date(oDate.getFullYear(), oDate.getMonth() + 1, 0);

			//var today = new Date();
			//var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
			//var lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

			// var oEntry = {
			// 	"n": data.length + 1,
			// 	"Lpn": false,
			// 	"Data": "",
			// 	"OraInizio": "",
			// 	"OraFine": "",
			// 	"Chiamatoda": "",  ??
			// 	"Rip": "", ??
			// 	"Causa": "",
			// 	"Riposi": "", ??
			// 	"h1h": false,
			// 	"h12h": false,
			// 	"h24h": false,
			// 	"h46h": false,
			// 	"h68h": false,
			// 	"h8h": false,
			// 	"Aggiorna": "",
			// 	"Elimina": "",
			// 	"minDate": firstDay,
			// 	"maxDate": lastDay,
			// 	"oButton1": true,
			// 	"oButton2": true
			// };

			// "IDINTERVENTO": oInterventiModelData[j].IDINTERVENTO,
			// "DATAINTERVENTO": "2020-05-01T00:00:00", //"2020-05-01T00:00:00" HARDCODED
			// "ORAINIZIO": oInterventiModelData[j].ORAINIZIO,
			// "ORAFINE": oInterventiModelData[j].ORAFINE,
			// "CHIAMATODA": oInterventiModelData[j].CHIAMATODA,
			// "CAUSA": oInterventiModelData[j].CAUSA,
			// "FASCIA": parseInt(oInterventiModelData[j].FASCIA),
			// "IDSCHEDA": oInterventiModelData[j].IDSCHEDA,
			// "STESSACAUSALE": parseInt(oInterventiModelData[j].STESSACAUSALE),
			// "DURATA": parseInt(oInterventiModelData[j].DURATA),
			// "CONTINTERVENTO": parseInt(oInterventiModelData[j].CONTINTERVENTO),
			// "FLAGNOTTURNO": parseInt(oInterventiModelData[j].FLAGNOTTURNO), // LPN?
			// "FLAGCONT": parseInt(oInterventiModelData[j].FLAGCONT)

			if (data.length === 1) {
				data[0].oButton2 = true;
			}

			var oEntry = {
				"n": data.length + 1,
				//"LPN": false,
				"CAUSA": "",
				"h1h": false,
				"h12h": false,
				"h24h": false,
				"h46h": false,
				"h68h": false,
				"h8h": false,
				"oButton1": true,
				"oButton2": true,
				"minDate": firstDay,
				"maxDate": lastDay,
				// "CHIAMATODA": "",
				// "CONTINTERVENTO": oDataIn.INTERVENTI.results[j].CONTINTERVENTO,
				"DATAINTERVENTO": "",
				// "DURATA": oDataIn.INTERVENTI.results[j].DURATA,
				// "FASCIA": oDataIn.INTERVENTI.results[j].FASCIA,
				// "FLAGCONT": oDataIn.INTERVENTI.results[j].FLAGCONT,
				// "FLAGNOTTURNO": oDataIn.INTERVENTI.results[j].FLAGNOTTURNO,
				// "IDINTERVENTO": oDataIn.INTERVENTI.results[j].IDINTERVENTO,
				// "IDSCHEDA": oDataIn.INTERVENTI.results[j].IDSCHEDA,
				"FASCIA": 0,
				"STESSACAUSALE": 0,
				"DURATA": 0,
				"CONTINTERVENTO": 0,
				"FLAGNOTTURNO": false,
				"FLAGCONT": false,
				"ORAFINE": "",
				"ORAINIZIO": "",
				"IDINTERVENTO": "",
				"IDSCHEDA": "",
				"WORKINGDAY": "",
				"NONWORKINGDAY": "",
				"MINDIFFORAINIFINE": "",
				"ORAINIZIOTIMESTAMP": "",
				"ORAFINETIMESTAMP": "",
				"CHECKOK": "",
				"RIPOSI": "",
				"CHIAMATODA_ALTRO": "",
				"CHIAMATODA": ""
					//"STESSACAUSALE": oDataIn.INTERVENTI.results[j].STESSACAUSALE
			};

			data.push(oEntry);

			this.getView().byId("idTableInterventi").getModel("RepintInterventiModel").setProperty("/", data);
			//this.getView().getModel("MainModel1").setProperty("/ItemsInfo1", data);
			this.getView().byId("txtAggiorna1").setText(data.length);
			this.getView().byId("txtElimina1").setText(data.length);
		},

		onAddItems2New: function () {
			var data = [];
			if (this.getView().byId("idTableInterventi").getModel("RepintInterventiModel") === undefined || this.getView().byId(
					"idTableInterventi").getModel("RepintInterventiModel") === null || this.getView().byId("idTableInterventi").getModel(
					"RepintInterventiModel").getData() === null ||
				this.getView().byId("idTableInterventi").getModel("RepintInterventiModel").getData() === undefined) {
				data = [];
			} else {
				data = this.getView().byId("idTableInterventi").getModel("RepintInterventiModel").getProperty("/");
			}
			// var today = new Date();
			// var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
			// var lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

			var oDate = new Date(this.getOwnerComponent().getModel("viewProperties").getProperty("/ANNOMESE"));
			var firstDay = new Date(oDate.getFullYear(), oDate.getMonth(), 1);
			var lastDay = new Date(oDate.getFullYear(), oDate.getMonth() + 1, 0);

			var oEntry = {
				"n": data.length + 1,
				//"LPN": false,
				"CAUSA": "",
				"h1h": false,
				"h12h": false,
				"h24h": false,
				"h46h": false,
				"h68h": false,
				"h8h": false,
				"oButton1": true,
				"oButton2": false,
				"minDate": firstDay,
				"maxDate": lastDay,
				// "CHIAMATODA": "",
				// "CONTINTERVENTO": oDataIn.INTERVENTI.results[j].CONTINTERVENTO,
				"DATAINTERVENTO": "",
				// "DURATA": oDataIn.INTERVENTI.results[j].DURATA,
				// "FASCIA": oDataIn.INTERVENTI.results[j].FASCIA,
				// "FLAGCONT": oDataIn.INTERVENTI.results[j].FLAGCONT,
				// "FLAGNOTTURNO": oDataIn.INTERVENTI.results[j].FLAGNOTTURNO,
				// "IDINTERVENTO": oDataIn.INTERVENTI.results[j].IDINTERVENTO,
				// "IDSCHEDA": oDataIn.INTERVENTI.results[j].IDSCHEDA,
				"FASCIA": 0,
				"STESSACAUSALE": 0,
				"DURATA": 0,
				"CONTINTERVENTO": 0,
				"FLAGNOTTURNO": false,
				"FLAGCONT": false,
				"ORAFINE": "",
				"ORAINIZIO": "",
				"IDINTERVENTO": "",
				"IDSCHEDA": "",
				"WORKINGDAY": "",
				"NONWORKINGDAY": "",
				"MINDIFFORAINIFINE": "",
				"ORAINIZIOTIMESTAMP": "",
				"ORAFINETIMESTAMP": "",
				"CHECKOK": "",
				"RIPOSI": "",
				"CHIAMATODA_ALTRO": "",
				"CHIAMATODA": ""
					//"STESSACAUSALE": oDataIn.INTERVENTI.results[j].STESSACAUSALE
			};

			data.push(oEntry);

			if (this.getView().byId("idTableInterventi").getModel("RepintInterventiModel") === undefined || this.getView().byId(
					"idTableInterventi").getModel("RepintInterventiModel").getData() === null) {
				var _oNewModel = new sap.ui.model.json.JSONModel();
				_oNewModel.setData(data);
				this.getView().byId("idTableInterventi").setModel(_oNewModel, "RepintInterventiModel");

				//this.getView().byId("idTableInterventi").setModel((new sap.ui.model.json.JSONModel()).setData(data), "RepintInterventiModel");
			} else {
				this.getView().byId("idTableInterventi").getModel("RepintInterventiModel").setProperty("/", data);
			}

			this.getView().byId("txtAggiorna1").setText(data.length);
			this.getView().byId("txtElimina1").setText(data.length);
		},

		onDeleteCategory2: function (oEvent) {
			//var data = this.getView().getModel("MainModel1").getProperty("/ItemsInfo1");

			// Below code commented on 16th Dec 2020
			// Line of code added on 10th Dec to fix performance impact issue on 'Delete' Interventi Records
			////this.getView().byId("idButDeleteRefresh").setVisible(true);

			var data = this.getView().byId("idTableInterventi").getModel("RepintInterventiModel").getProperty("/");
			var index = oEvent.getSource().getParent().getParent().indexOfItem(oEvent.getSource().getParent());
			var oRepDateModel = this.getView().byId("idTableReperibilita").getModel("RepintReperibilitaModel");
			var oInterventiDateModel = this.getView().byId("idTableInterventi").getModel("RepintInterventiModel");
			var oInterventiTable = this.getView().byId("idTableInterventi");

			oInterventiTable.getItems()[index].getCells()[3].setValueState(sap.ui.core.ValueState.None);

			// if (data.length - 1 === index) {
			// 	data[index - 1].bAdd = true;
			// }
			data.splice(index, 1);
			if (data.length === 1) {
				data[0].bDelete = false;
				data[0].bAdd = true;
			}
			//this.getView().getModel("MainModel1").setProperty("/ItemsInfo1", data);
			this.getView().byId("idTableInterventi").getModel("RepintInterventiModel").setProperty("/", data);
			this.getView().byId("txtAggiorna1").setText(data.length);
			this.getView().byId("txtElimina1").setText(data.length);

			if (data.length === 0) { // No record
				this.chk1h(false);
				this.chk12h(false);
				this.chk24h(false);
				this.chk46h(false);
				this.chk68h(false);
				this.chk8h(false);
				this.onAddItems2New();
			} else {
				// Below line uncommented on 16th Dec 2020
				// Logic implemented on 10th Dec 2020
				// **************** Below code commented to fix performance issue on 'Delete' Interventi records
				this.filterRiposiSet(this.getView().byId("idTableInterventi"), oRepDateModel, oInterventiDateModel, index, false);

			}
		},

		// Below line commented on 16th Dec 2020
		// Below function implemented on 10th Dec 2020 
		// **************** Below function added to fix performance issue on 'Delete' Interventi records
		// onDeleteRefresh: function(oEvent){
		// 	this._busyDialog.open();
		// 	//var data = this.getView().byId("idTableInterventi").getModel("RepintInterventiModel").getProperty("/");
		// 	///var index = oEvent.getSource().getParent().getParent().indexOfItem(oEvent.getSource().getParent());
		// 	var oRepDateModel = this.getView().byId("idTableReperibilita").getModel("RepintReperibilitaModel");
		// 	var oInterventiDateModel = this.getView().byId("idTableInterventi").getModel("RepintInterventiModel");
		// 	//var oInterventiTable = this.getView().byId("idTableInterventi");

		// 	this.filterRiposiSet(this.getView().byId("idTableInterventi"), oRepDateModel, oInterventiDateModel, 0, false);
		// 	this._busyDialog.close();
		// },

		chkFer: function (oEvent) {
			var data = this.getView().byId("idTableReperibilita").getModel("RepintReperibilitaModel").getProperty("/");
			var count1 = 0;

			if (oEvent) {
				for (var i = 0; i < data.length; i++) {
					if (data[i].Fer == true) {
						count1 = count1 + 1;
					}
				}
				this.getView().byId("txtFer").setText(count1);
			} else {
				count1 = data.length;
				for (var i = 0; i < data.length; i++) {
					if (data[i].Fer == false) {
						count1 = count1 - 1;
					}
				}
				this.getView().byId("txtFer").setText(count1);
			}
		},
		chkSab: function (oEvent) {
			var data = this.getView().byId("idTableReperibilita").getModel("RepintReperibilitaModel").getProperty("/");
			var count1 = 0;

			if (oEvent) {
				for (var i = 0; i < data.length; i++) {
					if (data[i].Sab == true) {
						count1 = count1 + 1;
					}
				}
				this.getView().byId("txtSab").setText(count1);
			} else {
				count1 = data.length;
				for (var i = 0; i < data.length; i++) {
					if (data[i].Sab == false) {
						count1 = count1 - 1;
					}
				}
				this.getView().byId("txtSab").setText(count1);
			}
		},
		chkDom: function (oEvent) {
			var data = this.getView().byId("idTableReperibilita").getModel("RepintReperibilitaModel").getProperty("/");
			var count1 = 0;

			if (oEvent) {
				for (var i = 0; i < data.length; i++) {
					if (data[i].Dom == true) {
						count1 = count1 + 1;
					}
				}
				this.getView().byId("txtDom").setText(count1);
			} else {
				count1 = data.length;
				for (var i = 0; i < data.length; i++) {
					if (data[i].Dom == false) {
						count1 = count1 - 1;
					}
				}
				this.getView().byId("txtDom").setText(count1);
			}
		},
		chk1h: function (oEvent) {
			var data = this.getView().byId("idTableInterventi").getModel("RepintInterventiModel").getProperty("/");
			var count1 = 0;

			if (oEvent) {
				for (var i = 0; i < data.length; i++) {
					if (data[i].h1h === true) {
						count1 = count1 + 1;
					}
				}
				this.getView().byId("txt1h").setText(count1);
			} else {
				count1 = data.length;
				for (var i = 0; i < data.length; i++) {
					if (data[i].h1h === false) {
						count1 = count1 - 1;
					}
				}
				this.getView().byId("txt1h").setText(count1);
			}
		},
		chk12h: function (oEvent) {
			var data = this.getView().byId("idTableInterventi").getModel("RepintInterventiModel").getProperty("/");
			var count1 = 0;

			if (oEvent) {
				for (var i = 0; i < data.length; i++) {
					if (data[i].h12h === true) {
						count1 = count1 + 1;
					}
				}
				this.getView().byId("txt12h").setText(count1);
			} else {
				count1 = data.length;
				for (var i = 0; i < data.length; i++) {
					if (data[i].h12h === false) {
						count1 = count1 - 1;
					}
				}
				this.getView().byId("txt12h").setText(count1);
			}
		},

		chk24h: function (oEvent) {
			var data = this.getView().byId("idTableInterventi").getModel("RepintInterventiModel").getProperty("/");
			var count1 = 0;

			if (oEvent) {
				for (var i = 0; i < data.length; i++) {
					if (data[i].h24h === true) {
						count1 = count1 + 1;
					}
				}
				this.getView().byId("txt24h").setText(count1);
			} else {
				count1 = data.length;
				for (var i = 0; i < data.length; i++) {
					if (data[i].h24h === false) {
						count1 = count1 - 1;
					}
				}
				this.getView().byId("txt24h").setText(count1);
			}

		},
		chk46h: function (oEvent) {
			var data = this.getView().byId("idTableInterventi").getModel("RepintInterventiModel").getProperty("/");
			var count1 = 0;

			if (oEvent) {
				for (var i = 0; i < data.length; i++) {
					if (data[i].h46h === true) {
						count1 = count1 + 1;
					}
					// that.chk1h(false);
					// that.chk12h(false);
					// that.chk24h(false);
					// that.chk46h(false);
					// that.chk68h(false);
					// that.chk8h(false);

					// data[i].h1h = false;
					// data[i].h12h = false;
					// data[i].h24h = false;
					// data[i].h46h = false;
					// data[i].h68h = false;
					// data[i].h8h = false;					

					// if (data[i].Fer == true) {
					// 	count1 = count1 + 1;
					// }
				}
				this.getView().byId("txt46h").setText(count1);
			} else {
				count1 = data.length;
				for (var i = 0; i < data.length; i++) {
					if (data[i].h46h === false) {
						count1 = count1 - 1;
					}
				}
				this.getView().byId("txt46h").setText(count1);
			}

			// var data = this.getView().getModel("MainModel1").getProperty("/ItemsInfo1");
			// var index = oEvent.getSource().getParent().getParent().indexOfItem(oEvent.getSource().getParent());
			// var count1 = 0;

			// if (oEvent.getParameter("selected")) {
			// 	data[index].h46h = true;
			// 	for (var i = 0; i < data.length; i++) {
			// 		if (data[i].h46h == true) {
			// 			count1 = count1 + 1;
			// 		}
			// 	}
			// 	this.getView().getModel("MainModel1").setProperty("/ItemsInfo1", data);
			// 	this.getView().byId("txt46h").setText(count1);
			// } else {
			// 	count1 = data.length;
			// 	data[index].h46h = false;
			// 	for (var i = 0; i < data.length; i++) {
			// 		if (data[i].h46h == false) {
			// 			count1 = count1 - 1;
			// 		}
			// 	}
			// 	this.getView().getModel("MainModel1").setProperty("/ItemsInfo1", data);
			// 	this.getView().byId("txt46h").setText(count1);

			// }
		},
		chk68h: function (oEvent) {
			var data = this.getView().byId("idTableInterventi").getModel("RepintInterventiModel").getProperty("/");
			var count1 = 0;

			if (oEvent) {
				for (var i = 0; i < data.length; i++) {
					if (data[i].h68h === true) {
						count1 = count1 + 1;
					}
				}
				this.getView().byId("txt68h").setText(count1);
			} else {
				count1 = data.length;
				for (var i = 0; i < data.length; i++) {
					if (data[i].h68h === false) {
						count1 = count1 - 1;
					}
				}
				this.getView().byId("txt68h").setText(count1);
			}

		},
		chk8h: function (oEvent) {
			var data = this.getView().byId("idTableInterventi").getModel("RepintInterventiModel").getProperty("/");
			var count1 = 0;

			if (oEvent) {
				for (var i = 0; i < data.length; i++) {
					if (data[i].h8h === true) {
						count1 = count1 + 1;
					}
				}
				this.getView().byId("txt8h").setText(count1);
			} else {
				count1 = data.length;
				for (var i = 0; i < data.length; i++) {
					if (data[i].h8h === false) {
						count1 = count1 - 1;
					}
				}
				this.getView().byId("txt8h").setText(count1);
			}
		},
		handleAnnoMese: function (oEvent) {
			// var oAnnomeseDt = sap.ui.core.format.DateFormat.getDateTimeInstance({
			// 						pattern: "yyyy-MM-dd"
			// 						}).format(new Date(oEvent.getSource().getDateValue()), true);
			var that = this;
			// Below condition added on 7th Dec 2020
			that.invioBozzaFlag = false;
			that.invioFlag = false;

			that.getView().byId("idScheda").setText("");
			that.getView().byId("idApprovazione1").setText("");
			that.getView().byId("idApprovazione2").setText("");
			that.getView().byId("idApprovazione3").setText("");
			that.getView().byId("idRepintCambioResp").setValue("");
			that.getView().byId("txt1h").setText(0);
			that.getView().byId("txt12h").setText(0);
			that.getView().byId("txt24h").setText(0);
			that.getView().byId("txt46h").setText(0);
			that.getView().byId("txt68h").setText(0);
			that.getView().byId("txt8h").setText(0);
			that.getView().byId("txtFer").setText(0);
			that.getView().byId("txtSab").setText(0);
			that.getView().byId("txtDom").setText(0);
			//that.getView().byId("idChiamatoda").setSelectedKey("");
			//that.getView().byId('idChiamatoda').setForceSelection(false);

			var oReperbilitadataModel = that.getView().byId("idTableReperibilita").getModel("RepintReperibilitaModel");

			if (oReperbilitadataModel !== undefined && oReperbilitadataModel !== null && oReperbilitadataModel !== "") {
				if (oReperbilitadataModel.getProperty("/") !== null && oReperbilitadataModel.getProperty("/") !== undefined &&
					oReperbilitadataModel.getProperty("/") !== "") {
					var dataReperbilita = oReperbilitadataModel.getProperty("/");
					var reperbilitaItems = oReperbilitadataModel.getData().length;
					while (reperbilitaItems--) {
						dataReperbilita.splice(reperbilitaItems, 1);
					}

					if (oReperbilitadataModel) {
						that.getView().byId("txtAggiorna").setText(0);
						that.getView().byId("txtElimina").setText(0);

						that.getView().byId("idTableReperibilita").removeAllItems();
						oReperbilitadataModel.destroy();
						oReperbilitadataModel.setData(null);
						oReperbilitadataModel.updateBindings(true);
					}
				}
			} else {
				that.getView().byId("txtAggiorna").setText(0);
				that.getView().byId("txtElimina").setText(0);
			}

			var oInternventidataModel = that.getView().byId("idTableInterventi").getModel("RepintInterventiModel");
			if (oInternventidataModel !== undefined && oInternventidataModel !== null && oInternventidataModel !== "") {
				if (oInternventidataModel.getProperty("/") !== null && oInternventidataModel.getProperty("/") !== undefined &&
					oInternventidataModel.getProperty("/") !== "") {
					var dataInterventi = oInternventidataModel.getProperty("/");
					var interventiItems = oInternventidataModel.getData().length;
					while (interventiItems--) {
						dataInterventi.splice(interventiItems, 1);
					}
					if (oInternventidataModel) {
						this.getView().byId("txtAggiorna1").setText(0);
						this.getView().byId("txtElimina1").setText(0);

						that.getView().byId("idTableInterventi").removeAllItems();
						oInternventidataModel.destroy();
						oInternventidataModel.setData(null);
						oInternventidataModel.updateBindings(true);
					}
				}
			} else {
				this.getView().byId("txtAggiorna1").setText(1);
				this.getView().byId("txtElimina1").setText(1);
			}

			if (oEvent.getSource().getDateValue() === null || oEvent.getSource().getDateValue() === undefined || oEvent.getSource().getDateValue() ===
				"") {
				MessageBox.error("Il campo Mese/Anno deve essere valorizzato");
				return;
			} else {
				that.getView().byId("dpAnnoMese").setValue(Formatter.formatMeseAnno(oEvent.getSource().getDateValue()));
				that.getOwnerComponent().getModel("viewProperties").setProperty("/ANNOMESE", that.getView().byId("dpAnnoMese").getValue());

				var xsoBaseModel = that.getOwnerComponent().getModel("basexsoModel");
				that.getEmpData(xsoBaseModel);
			}

			// //////////that.getView().byId("dpAnnoMese").setDisplayFormat(month + "-" + oDate.getFullYear());
			// that.getView().byId("dpAnnoMese").setValue(oDate);
			// ////////that.getView().byId("dpAnnoMese").setValueFormat(month + "-" + oDate.getFullYear());
			// ////that.getOwnerComponent().getModel("viewProperties").setProperty("/ANNOMESE", that.getView().byId("dpAnnoMese").getProperty("valueFormat"));

			// that.getOwnerComponent().getModel("viewProperties").setProperty("/annomeseDateValue", oEvent.getSource().getDateValue());
			// var today = new Date();
			// var vMonth = today.getMonth() + 1;
			// var month = "";
			// if (vMonth < 10) {
			// 	month = "0" + vMonth;
			// } else {
			// 	month = vMonth;
			// }

			// that.getView().byId("dpAnnoMese").setDisplayFormat(month + "-" + today.getFullYear());
			// that.getView().byId("dpAnnoMese").setValueFormat(month + "-" + today.getFullYear());

			// that.getOwnerComponent().getModel("viewProperties").setProperty("/ANNOMESE", that.getView().byId("dpAnnoMese").getProperty(
			// 	"valueFormat"));

		},

		// tpChange1: function (oEvent) {

		// 	var oTP = oEvent.getSource(),
		// 		sValue = oEvent.getParameter("value"),
		// 		bValid = oEvent.getParameter("valid");

		// 	var oRepDateModel = this.getView().byId("idTableReperibilita").getModel("RepintReperibilitaModel");
		// 	var oInterventiDateModel = this.getView().byId("idTableInterventi").getModel("RepintInterventiModel");
		// 	var indexInterventi = oEvent.getSource().getParent().getParent().indexOfItem(oEvent.getSource().getParent());
		// 	var orainizio = oInterventiDateModel.getData()[indexInterventi].ORAINIZIO;
		// 	var orafine = oInterventiDateModel.getData()[indexInterventi].ORAFINE;
		// 	var dateintervento = oInterventiDateModel.getData()[indexInterventi].DATAINTERVENTO;

		// 	var oInterventiDate;
		// 	var oInterventiMonth;
		// 	var oInterventiYear;
		// 	var oInterventiToday;

		// 	var oInterventoNextDate; //= new Date();
		// 	//oInterventoNextDate = Formatter.formatDate(oInterventoNextDate);
		// 	var oInterventiNextYear;
		// 	var oInterventiNextMonth;
		// 	var oInterventiNextDay;

		// 	var OraInizioDateTimestamp;
		// 	var validFlag = false;

		// 	// var Dtflag = false;

		// 	if (dateintervento === "" || dateintervento === undefined || dateintervento === null) {
		// 		this.getView().byId("idTableReperibilita").getItems()[indexInterventi].getCells()[2].setValueState(sap.ui.core.ValueState.Error);
		// 		MessageBox.error("Nella sezione Interventi valorizzata il campo data");
		// 		return;
		// 	}

		// 	for (var j = 0; j < oRepDateModel.getData().length; ++j) {
		// 		//if (sValue === oRepDateModel.getData()[j].DATAREPERIBILITA) {
		// 		if (dateintervento === oRepDateModel.getData()[j].DATAREPERIBILITA || oInterventiDateModel.getData()[indexInterventi].LPN) {

		// 			if (orainizio === "" || orainizio === null) {
		// 				this.getOwnerComponent().getModel("viewProperties").setProperty("/OraInizioDateTimestamp", null);
		// 				oTP.setValueState(ValueState.Error);
		// 				MessageBox.error("Il campo Ora Inizio deve essere valorizzato");
		// 				return;
		// 			}

		// 			oInterventiDate = new Date(Formatter.formatDateToMMDDYYYY(dateintervento));
		// 			oInterventoNextDate = new Date(Formatter.formatDateToMMDDYYYY(dateintervento));
		// 			oInterventiYear = oInterventiDate.getFullYear();
		// 			oInterventiMonth = oInterventiDate.getMonth();
		// 			oInterventiToday = oInterventiDate.getDate();

		// 			//oInterventoNextDate = oInterventiDate.getDate() + 1;
		// 			oInterventoNextDate.setDate(oInterventiDate.getDate() + 1);

		// 			oInterventiNextYear = oInterventoNextDate.getFullYear();
		// 			oInterventiNextMonth = oInterventoNextDate.getMonth();
		// 			oInterventiNextDay = oInterventoNextDate.getDate();

		// 			if (oRepDateModel.getData()[j].Fer) { // Weekday (L)  17:30 - 0:30

		// 				//if( this.getTimeAsNumberOfMinutes(orainizio) > this.getTimeAsNumberOfMinutes("08:30")  this.getTimeAsNumberOfMinutes(orainizio) < this.getTimeAsNumberOfMinutes("17:30"))

		// 				if (this.getTimeAsNumberOfMinutes(orainizio) < this.getTimeAsNumberOfMinutes("17:30") && this.getTimeAsNumberOfMinutes(
		// 						orainizio) > this.getTimeAsNumberOfMinutes("08:30")) {
		// 					oInterventiDateModel.getData()[indexInterventi].ORAINIZIO = null;
		// 					this.getOwnerComponent().getModel("viewProperties").setProperty("/OraInizioDateTimestamp", null);
		// 					oTP.setValueState(ValueState.Error);
		// 					MessageBox.error("Per i giorni lavorativi \"Ora Inizio\" deve essere compresa tra le 17:30 e le 08:30 del giorno successivo");
		// 					return;
		// 				}

		// 				if (orafine !== "" && orafine !== null) {
		// 					// Check for Ora Inizio
		// 					if (this.getTimeAsNumberOfMinutes(orainizio) > this.getTimeAsNumberOfMinutes("08:30") && this.getTimeAsNumberOfMinutes(
		// 							orainizio) < this.getTimeAsNumberOfMinutes("17:30")) { // Same day invalid Time
		// 						oInterventiDateModel.getData()[indexInterventi].ORAINIZIO = null;
		// 						this.getOwnerComponent().getModel("viewProperties").setProperty("/OraInizioDateTimestamp", null);
		// 						oTP.setValueState(ValueState.Error);
		// 						MessageBox.error("Per i giorni lavorativi \"Ora Inizio\" deve essere compresa tra le 17:30 e le 08:30 del giorno successivo");
		// 						return;
		// 					} else { // Valid Ora Inizio value - Repint day
		// 						if (this.getTimeAsNumberOfMinutes(orainizio) >= this.getTimeAsNumberOfMinutes("17:30") && this.getTimeAsNumberOfMinutes(
		// 								orainizio) <= this.getTimeAsNumberOfMinutes("23:59")) { // Same day valid Time

		// 							OraInizioDateTimestamp = new Date(oInterventiYear, oInterventiMonth, oInterventiToday, orainizio.split(":")[0], orainizio.split(
		// 								":")[1], "00");

		// 							// Check for Ora Fine orafine
		// 							if (OraInizioDateTimestamp > this.getOwnerComponent().getModel("viewProperties").getProperty("/OraFineoDateTimestamp")) {
		// 								oInterventiDateModel.getData()[indexInterventi].ORAINIZIO = null;
		// 								this.getOwnerComponent().getModel("viewProperties").setProperty("/OraInizioDateTimestamp", null);
		// 								oTP.setValueState(ValueState.Error);
		// 								MessageBox.error("Il valore inserito in \"Ora Inizio\" non può essere maggiore di quello inserito in \"Ora Fine\" ");
		// 								return;
		// 							} else {
		// 								this.getOwnerComponent().getModel("viewProperties").setProperty("/OraInizioDateTimestamp", OraInizioDateTimestamp);
		// 								validFlag = true;
		// 							}
		// 						} else if (this.getTimeAsNumberOfMinutes(orainizio) >= this.getTimeAsNumberOfMinutes("00:00") && this.getTimeAsNumberOfMinutes(
		// 								orainizio) <= this.getTimeAsNumberOfMinutes("08:30")) { // Repint + 1 day valid time

		// 							OraInizioDateTimestamp = new Date(oInterventiNextYear, oInterventiNextMonth, oInterventiNextDay, orainizio.split(":")[0],
		// 								orainizio.split(":")[1], "00");

		// 							// Check for Ora Fine orafine
		// 							if (OraInizioDateTimestamp > this.getOwnerComponent().getModel("viewProperties").getProperty("/OraFineoDateTimestamp")) {
		// 								oInterventiDateModel.getData()[indexInterventi].ORAINIZIO = null;
		// 								this.getOwnerComponent().getModel("viewProperties").setProperty("/OraInizioDateTimestamp", null);
		// 								oTP.setValueState(ValueState.Error);
		// 								MessageBox.error("Il valore inserito in \"Ora Inizio\" non può essere maggiore di quello inserito in \"Ora Fine\" ");
		// 								return;
		// 							} else {
		// 								this.getOwnerComponent().getModel("viewProperties").setProperty("/OraInizioDateTimestamp", OraInizioDateTimestamp);
		// 								validFlag = true;
		// 							}
		// 						}
		// 					}
		// 				} else { // Set only Ora Inizio value

		// 					if (this.getTimeAsNumberOfMinutes(orainizio) >= this.getTimeAsNumberOfMinutes("17:30") && this.getTimeAsNumberOfMinutes(
		// 							orainizio) <= this.getTimeAsNumberOfMinutes("23:59")) { // Same day valid Time

		// 						OraInizioDateTimestamp = new Date(oInterventiYear, oInterventiMonth, oInterventiToday, orainizio.split(":")[0], orainizio.split(
		// 							":")[1], "00");

		// 						this.getOwnerComponent().getModel("viewProperties").setProperty("/OraInizioDateTimestamp", OraInizioDateTimestamp);
		// 						oTP.setValueState(ValueState.None);
		// 					} else if (this.getTimeAsNumberOfMinutes(orainizio) >= this.getTimeAsNumberOfMinutes("00:00") && this.getTimeAsNumberOfMinutes(
		// 							orainizio) <= this.getTimeAsNumberOfMinutes("08:30")) { // Repint + 1 day valid time

		// 						OraInizioDateTimestamp = new Date(oInterventiNextYear, oInterventiNextMonth, oInterventiNextDay, orainizio.split(":")[0],
		// 							orainizio.split(":")[1], "00");

		// 						this.getOwnerComponent().getModel("viewProperties").setProperty("/OraInizioDateTimestamp", OraInizioDateTimestamp);
		// 						oTP.setValueState(ValueState.None);
		// 					}
		// 				}

		// 			} else { // Weekend or Holidays (S and F)

		// 				if (orafine !== "" && orafine !== null) {
		// 					// Check for Ora Inizio - Repint day
		// 					if (this.getTimeAsNumberOfMinutes(orainizio) > this.getTimeAsNumberOfMinutes("08:30") && this.getTimeAsNumberOfMinutes(
		// 							orainizio) <= this.getTimeAsNumberOfMinutes("23:59")) { // Same day valid Time

		// 						OraInizioDateTimestamp = new Date(oInterventiYear, oInterventiMonth, oInterventiToday, orainizio.split(":")[0], orainizio.split(
		// 							":")[1], "00");

		// 						// Check for Ora Fine  
		// 						if (OraInizioDateTimestamp > this.getOwnerComponent().getModel("viewProperties").getProperty("/OraFineoDateTimestamp")) {
		// 							oInterventiDateModel.getData()[indexInterventi].ORAINIZIO = null;
		// 							this.getOwnerComponent().getModel("viewProperties").setProperty("/OraInizioDateTimestamp", null);
		// 							oTP.setValueState(ValueState.Error);
		// 							MessageBox.error("Il valore inserito in \"Ora Inizio\" non può essere maggiore di quello inserito in \"Ora Fine\" ");
		// 							return;
		// 						} else {
		// 							this.getOwnerComponent().getModel("viewProperties").setProperty("/OraInizioDateTimestamp", OraInizioDateTimestamp);
		// 							validFlag = true;
		// 						}
		// 					} else if (this.getTimeAsNumberOfMinutes(orainizio) >= this.getTimeAsNumberOfMinutes("00:00") && this.getTimeAsNumberOfMinutes(
		// 							orainizio) <= this.getTimeAsNumberOfMinutes("08:30")) { // Repint + 1 day valid time

		// 						OraInizioDateTimestamp = new Date(oInterventiNextYear, oInterventiNextMonth, oInterventiNextDay, orainizio.split(":")[0],
		// 							orainizio.split(":")[1], "00");

		// 						// Check for Ora Fine
		// 						if (OraInizioDateTimestamp > this.getOwnerComponent().getModel("viewProperties").getProperty("/OraFineoDateTimestamp")) {
		// 							oInterventiDateModel.getData()[indexInterventi].ORAINIZIO = null;
		// 							this.getOwnerComponent().getModel("viewProperties").setProperty("/OraInizioDateTimestamp", null);
		// 							oTP.setValueState(ValueState.Error);
		// 							MessageBox.error("Il valore inserito in \"Ora Inizio\" non può essere maggiore di quello inserito in \"Ora Fine\" ");
		// 							return;
		// 						} else {
		// 							this.getOwnerComponent().getModel("viewProperties").setProperty("/OraInizioDateTimestamp", OraInizioDateTimestamp);
		// 							validFlag = true;
		// 						}
		// 					}
		// 				} else { // Set only Ora Inizio value

		// 					if (this.getTimeAsNumberOfMinutes(orainizio) > this.getTimeAsNumberOfMinutes("08:30") && this.getTimeAsNumberOfMinutes(
		// 							orainizio) <= this.getTimeAsNumberOfMinutes("23:59")) { // Same day valid Time

		// 						OraInizioDateTimestamp = new Date(oInterventiYear, oInterventiMonth, oInterventiToday, orainizio.split(":")[0], orainizio.split(
		// 							":")[1], "00");

		// 						this.getOwnerComponent().getModel("viewProperties").setProperty("/OraInizioDateTimestamp", OraInizioDateTimestamp);
		// 						oTP.setValueState(ValueState.None);
		// 					} else if (this.getTimeAsNumberOfMinutes(orainizio) >= this.getTimeAsNumberOfMinutes("00:00") && this.getTimeAsNumberOfMinutes(
		// 							orainizio) <= this.getTimeAsNumberOfMinutes("08:30")) { // Repint + 1 day valid time

		// 						OraInizioDateTimestamp = new Date(oInterventiNextYear, oInterventiNextMonth, oInterventiNextDay, orainizio.split(":")[0],
		// 							orainizio.split(":")[1], "00");

		// 						this.getOwnerComponent().getModel("viewProperties").setProperty("/OraInizioDateTimestamp", OraInizioDateTimestamp);
		// 						oTP.setValueState(ValueState.None);
		// 					}
		// 				}

		// 			}
		// 		}
		// 	}
		// 	// if ((!Dtflag) && oInterventiDateModel.getData()[indexInterventi].LPN !== true) {
		// 	// 	oEvent.getSource().setDateValue(null);
		// 	// 	MessageBox.error("Per l'intervento inserire una data presente in Reperibilità");
		// 	// 	return;
		// 	// }

		// 	if (validFlag) {
		// 		oTP.setValueState(ValueState.None);

		// 		var res = Math.abs(this.getOwnerComponent().getModel("viewProperties").getProperty("/OraInizioDateTimestamp") - this.getOwnerComponent()
		// 			.getModel("viewProperties").getProperty("/OraFineoDateTimestamp")) / 1000;
		// 		oInterventiDateModel.getData()[indexInterventi].MINDIFFORAINIFINE = Math.floor(res / 60);
		// 		// Below values of OraInizio and OraFine timestamp required while calculating Riposi
		// 		oInterventiDateModel.getData()[indexInterventi].ORAINIZIOTIMESTAMP = this.getOwnerComponent().getModel("viewProperties").getProperty(
		// 			"/OraInizioDateTimestamp");
		// 		oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP = this.getOwnerComponent().getModel("viewProperties").getProperty(
		// 			"/OraFineoDateTimestamp");

		// 		//this.startTime = oEvent.getSource().getDateValue().getTime();

		// 		//var repintInterventiModel = this.getView().byId("idTableInterventi").getModel("RepintInterventiModel");
		// 		var data = oInterventiDateModel.getProperty("/");
		// 		//var index = oEvent.getSource().getParent().getParent().indexOfItem(oEvent.getSource().getParent());
		// 		var counth1h = 0;
		// 		var counth12h = 0;
		// 		var counth24h = 0;
		// 		var counth46h = 0;
		// 		var counth68h = 0;
		// 		var counth8h = 0;
		// 		if (orafine !== "" && orafine !== undefined && orafine !== null) {
		// 			//var diffInSeconds = (((this.endTime - this.startTime) / 1000) / 60) / 60;
		// 			var diffInHours = oInterventiDateModel.getData()[indexInterventi].MINDIFFORAINIFINE / 60;
		// 			////data[indexInterventi].FASCIA = diffInHours; 
		// 			if (diffInHours) {
		// 				data[indexInterventi].h1h = false;
		// 				data[indexInterventi].h12h = false;
		// 				data[indexInterventi].h24h = false;
		// 				data[indexInterventi].h46h = false;
		// 				data[indexInterventi].h68h = false;
		// 				data[indexInterventi].h8h = false;
		// 				if (diffInHours > 0 && diffInHours <= 1) {
		// 					data[indexInterventi].h1h = true;
		// 					data[indexInterventi].FASCIA = 1;
		// 				} else if (diffInHours > 1 && diffInHours <= 2) {
		// 					data[indexInterventi].h12h = true;
		// 					data[indexInterventi].FASCIA = 2;
		// 				} else if (diffInHours > 2 && diffInHours <= 4) {
		// 					data[indexInterventi].h24h = true;
		// 					data[indexInterventi].FASCIA = 3;
		// 				} else if (diffInHours > 4 && diffInHours <= 6) {
		// 					data[indexInterventi].h46h = true;
		// 					data[indexInterventi].FASCIA = 4;
		// 				} else if (diffInHours > 6 && diffInHours <= 8) {
		// 					data[indexInterventi].h68h = true;
		// 					data[indexInterventi].FASCIA = 4;
		// 				} else if (diffInHours > 8) {
		// 					data[indexInterventi].h8h = true;
		// 					data[indexInterventi].FASCIA = 4;
		// 				}
		// 			}
		// 		}
		// 		for (var i = 0; i < oInterventiDateModel.getData().length; i++) {
		// 			if (oInterventiDateModel.getData()[i].h1h == true) {
		// 				counth1h = counth1h + 1;
		// 			}
		// 			if (oInterventiDateModel.getData()[i].h12h == true) {
		// 				counth12h = counth12h + 1;
		// 			}
		// 			if (oInterventiDateModel.getData()[i].h24h == true) {
		// 				counth24h = counth24h + 1;
		// 			}
		// 			if (oInterventiDateModel.getData()[i].h46h == true) {
		// 				counth46h = counth46h + 1;
		// 			}
		// 			if (oInterventiDateModel.getData()[i].h68h == true) {
		// 				counth68h = counth68h + 1;
		// 			}
		// 			if (oInterventiDateModel.getData()[i].h8h == true) {
		// 				counth8h = counth8h + 1;
		// 			}
		// 		}
		// 		this.getView().byId("txt1h").setText(counth1h);
		// 		this.getView().byId("txt12h").setText(counth12h);
		// 		this.getView().byId("txt24h").setText(counth24h);
		// 		this.getView().byId("txt46h").setText(counth46h);
		// 		this.getView().byId("txt68h").setText(counth68h);
		// 		this.getView().byId("txt8h").setText(counth8h);

		// 		oInterventiDateModel.setProperty("/", data);

		// 		this.filterRiposiSet(this.getView().byId("idTableInterventi"), oRepDateModel, oInterventiDateModel, indexInterventi);

		// 		//this.filterRiposiSet(oRepDateModel, oInterventiDateModel, indexInterventi);
		// 		//	}

		// 		//if (validFlag) {
		// 		// oTP.setValueState(ValueState.None);

		// 		// this.startTime = oEvent.getSource().getDateValue().getTime();
		// 		// var repintInterventiModel = this.getView().byId("idTableInterventi").getModel("RepintInterventiModel");
		// 		// var data = repintInterventiModel.getProperty("/");
		// 		// var index = oEvent.getSource().getParent().getParent().indexOfItem(oEvent.getSource().getParent());
		// 		// var counth1h = 0;
		// 		// var counth12h = 0;
		// 		// var counth24h = 0;
		// 		// var counth46h = 0;
		// 		// var counth68h = 0;
		// 		// var counth8h = 0;
		// 		// if (this.endTime) {
		// 		// 	var diffInSeconds = (((this.endTime - this.startTime) / 1000) / 60) / 60;
		// 		// 	data[index].FASCIA = diffInSeconds;
		// 		// 	if (diffInSeconds) {
		// 		// 		data[index].h1h = false;
		// 		// 		data[index].h12h = false;
		// 		// 		data[index].h24h = false;
		// 		// 		data[index].h46h = false;
		// 		// 		data[index].h68h = false;
		// 		// 		data[index].h8h = false;
		// 		// 		if (diffInSeconds > 0 && diffInSeconds <= 1) {
		// 		// 			data[index].h1h = true;
		// 		// 		} else if (diffInSeconds > 1 && diffInSeconds <= 2) {
		// 		// 			data[index].h12h = true;
		// 		// 		} else if (diffInSeconds > 2 && diffInSeconds <= 4) {
		// 		// 			data[index].h24h = true;
		// 		// 		} else if (diffInSeconds > 4 && diffInSeconds <= 6) {
		// 		// 			data[index].h46h = true;
		// 		// 		} else if (diffInSeconds > 6 && diffInSeconds <= 8) {
		// 		// 			data[index].h68h = true;
		// 		// 		} else if (diffInSeconds > 8) {
		// 		// 			data[index].h8h = true;
		// 		// 		}
		// 		// 	}
		// 		// }
		// 		// for (var i = 0; i < repintInterventiModel.getData().length; i++) {
		// 		// 	if (repintInterventiModel.getData()[i].h1h == true) {
		// 		// 		counth1h = counth1h + 1;
		// 		// 	}
		// 		// 	if (repintInterventiModel.getData()[i].h12h == true) {
		// 		// 		counth12h = counth12h + 1;
		// 		// 	}
		// 		// 	if (repintInterventiModel.getData()[i].h24h == true) {
		// 		// 		counth24h = counth24h + 1;
		// 		// 	}
		// 		// 	if (repintInterventiModel.getData()[i].h46h == true) {
		// 		// 		counth46h = counth46h + 1;
		// 		// 	}
		// 		// 	if (repintInterventiModel.getData()[i].h68h == true) {
		// 		// 		counth68h = counth68h + 1;
		// 		// 	}
		// 		// 	if (repintInterventiModel.getData()[i].h8h == true) {
		// 		// 		counth8h = counth8h + 1;
		// 		// 	}
		// 		// }
		// 		// this.getView().byId("txt1h").setText(counth1h);
		// 		// this.getView().byId("txt12h").setText(counth12h);
		// 		// this.getView().byId("txt24h").setText(counth24h);
		// 		// this.getView().byId("txt46h").setText(counth46h);
		// 		// this.getView().byId("txt68h").setText(counth68h);
		// 		// this.getView().byId("txt8h").setText(counth8h);

		// 		// repintInterventiModel.setProperty("/", data);

		// 		// this.filterRiposiSet(oRepDateModel, oInterventiDateModel, indexInterventi);

		// 	}
		// 	// else {
		// 	// 	oTP.setValueState(ValueState.Error);
		// 	// }

		// },

		tpChange1: function (oEvent) {

			var oTP = oEvent.getSource(),
				sValue = oEvent.getParameter("value"),
				bValid = oEvent.getParameter("valid");

			var oRepDateModel = this.getView().byId("idTableReperibilita").getModel("RepintReperibilitaModel");
			var oInterventiDateModel = this.getView().byId("idTableInterventi").getModel("RepintInterventiModel");
			var indexInterventi = oEvent.getSource().getParent().getParent().indexOfItem(oEvent.getSource().getParent());
			///////var orainizio = oInterventiDateModel.getData()[indexInterventi].ORAINIZIO;
			var orainizio = sValue;
			var orafine = oInterventiDateModel.getData()[indexInterventi].ORAFINE;
			var dateintervento = oInterventiDateModel.getData()[indexInterventi].DATAINTERVENTO;

			var oInterventiDate;
			var oInterventiMonth;
			var oInterventiYear;
			var oInterventiToday;

			var oInterventoNextDate; //= new Date();
			//oInterventoNextDate = Formatter.formatDate(oInterventoNextDate);
			var oInterventiNextYear;
			var oInterventiNextMonth;
			var oInterventiNextDay;

			var OraInizioDateTimestamp;
			var validFlag = false;

			// Reset 'FLAGCOUNT' (RIP) to unchecked			
			oInterventiDateModel.getData()[indexInterventi].FLAGCONT = false;
			// Reset 'RIPOSI' value
			oInterventiDateModel.getData()[indexInterventi].RIPOSI = null;

			if (dateintervento === "" || dateintervento === undefined || dateintervento === null) {
				if (this.getView().byId("idTableReperibilita").getItems()[indexInterventi] !== undefined) {
					this.getView().byId("idTableReperibilita").getItems()[indexInterventi].getCells()[2].setValueState(sap.ui.core.ValueState.Error);
				}
				MessageBox.error("Nella sezione Interventi valorizzata il campo data");
				return;
			}

			for (var j = 0; j < oRepDateModel.getData().length; ++j) {
				//if (sValue === oRepDateModel.getData()[j].DATAREPERIBILITA) {
				if (dateintervento === oRepDateModel.getData()[j].DATAREPERIBILITA || oInterventiDateModel.getData()[indexInterventi].FLAGNOTTURNO) {

					if (orainizio === "" || orainizio === null) {
						////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraInizioDateTimestamp", null);
						oInterventiDateModel.getData()[indexInterventi].ORAINIZIOTIMESTAMP = null;
						oTP.setValueState(ValueState.Error);
						MessageBox.error("Il campo Ora Inizio deve essere valorizzato");
						return;
					}

					oInterventiDate = new Date(Formatter.formatDateToMMDDYYYY(dateintervento));
					oInterventoNextDate = new Date(Formatter.formatDateToMMDDYYYY(dateintervento));
					oInterventiYear = oInterventiDate.getFullYear();
					oInterventiMonth = oInterventiDate.getMonth();
					oInterventiToday = oInterventiDate.getDate();

					//oInterventoNextDate = oInterventiDate.getDate() + 1;
					oInterventoNextDate.setDate(oInterventiDate.getDate() + 1);

					oInterventiNextYear = oInterventoNextDate.getFullYear();
					oInterventiNextMonth = oInterventoNextDate.getMonth();
					oInterventiNextDay = oInterventoNextDate.getDate();

					if (oInterventiDateModel.getData()[indexInterventi].FLAGNOTTURNO) { // LPN Checked

						//New conditon added on 19th Oct
						//For LPN, the time slot is 17.30 to 08.30, if a user inserts a LPN and a time slot different we will propose the message:
						//Occorre inserire delle ore comprese nella fascia oraria 17:30 – 08:30
						// Here irrespective of Working Day or Non Working Day same condtion applies

						if (this.getTimeAsNumberOfMinutes(orainizio) < this.getTimeAsNumberOfMinutes("17:30") && this.getTimeAsNumberOfMinutes(
								orainizio) > this.getTimeAsNumberOfMinutes("08:30")) {
							oInterventiDateModel.getData()[indexInterventi].ORAINIZIO = null;
							////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraInizioDateTimestamp", null);
							oInterventiDateModel.getData()[indexInterventi].ORAINIZIOTIMESTAMP = null;
							oTP.setValueState(ValueState.Error);
							//////MessageBox.error("Per i giorni lavorativi \"Ora Inizio\" deve essere compresa tra le 17:30 e le 08:30 del giorno successivo");
							MessageBox.error("Occorre inserire delle ore comprese nella fascia oraria 17:30 – 08:30");
							return;
						}

						if (orafine !== "" && orafine !== null) {
							// Check for Ora Inizio
							if (this.getTimeAsNumberOfMinutes(orainizio) > this.getTimeAsNumberOfMinutes("08:30") && this.getTimeAsNumberOfMinutes(
									orainizio) < this.getTimeAsNumberOfMinutes("17:30")) { // Same day invalid Time
								oInterventiDateModel.getData()[indexInterventi].ORAINIZIO = null;
								////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraInizioDateTimestamp", null);
								oInterventiDateModel.getData()[indexInterventi].ORAINIZIOTIMESTAMP = null;
								oTP.setValueState(ValueState.Error);
								////MessageBox.error("Per i giorni lavorativi \"Ora Inizio\" deve essere compresa tra le 17:30 e le 08:30 del giorno successivo");
								MessageBox.error("Occorre inserire delle ore comprese nella fascia oraria 17:30 – 08:30");
								return;
							} else { // Valid Ora Inizio value - Repint day
								if (this.getTimeAsNumberOfMinutes(orainizio) >= this.getTimeAsNumberOfMinutes("17:30") && this.getTimeAsNumberOfMinutes(
										orainizio) <= this.getTimeAsNumberOfMinutes("23:59")) { // Same day valid Time

									OraInizioDateTimestamp = new Date(oInterventiYear, oInterventiMonth, oInterventiToday, orainizio.split(":")[0], orainizio
										.split(
											":")[1], "00");

									// Check for Ora Fine orafine

									////if (OraInizioDateTimestamp > this.getOwnerComponent().getModel("viewProperties").getProperty("/OraFineoDateTimestamp")) {
									if (OraInizioDateTimestamp > oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP) {
										oInterventiDateModel.getData()[indexInterventi].ORAINIZIO = null;
										/////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraInizioDateTimestamp", null);
										oInterventiDateModel.getData()[indexInterventi].ORAINIZIOTIMESTAMP = null;
										oTP.setValueState(ValueState.Error);
										MessageBox.error("Il valore inserito in \"Ora Inizio\" non può essere maggiore di quello inserito in \"Ora Fine\" ");
										return;
									} else {
										////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraInizioDateTimestamp", OraInizioDateTimestamp);
										oInterventiDateModel.getData()[indexInterventi].ORAINIZIOTIMESTAMP = OraInizioDateTimestamp;
										validFlag = true;
									}
								} else if (this.getTimeAsNumberOfMinutes(orainizio) >= this.getTimeAsNumberOfMinutes("00:00") && this.getTimeAsNumberOfMinutes(
										orainizio) <= this.getTimeAsNumberOfMinutes("08:30")) { // Repint + 1 day valid time

									OraInizioDateTimestamp = new Date(oInterventiNextYear, oInterventiNextMonth, oInterventiNextDay, orainizio.split(":")[0],
										orainizio.split(":")[1], "00");

									// Check for Ora Fine orafine
									////if (OraInizioDateTimestamp > this.getOwnerComponent().getModel("viewProperties").getProperty("/OraFineoDateTimestamp")) {
									if (OraInizioDateTimestamp > oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP) {
										oInterventiDateModel.getData()[indexInterventi].ORAINIZIO = null;
										////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraInizioDateTimestamp", null);
										oInterventiDateModel.getData()[indexInterventi].ORAINIZIOTIMESTAMP = null;
										oTP.setValueState(ValueState.Error);
										MessageBox.error("Il valore inserito in \"Ora Inizio\" non può essere maggiore di quello inserito in \"Ora Fine\" ");
										return;
									} else {
										////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraInizioDateTimestamp", OraInizioDateTimestamp);
										oInterventiDateModel.getData()[indexInterventi].ORAINIZIOTIMESTAMP = OraInizioDateTimestamp;
										validFlag = true;
									}
								}
							}
						} else { // Set only Ora Inizio value

							if (this.getTimeAsNumberOfMinutes(orainizio) >= this.getTimeAsNumberOfMinutes("17:30") && this.getTimeAsNumberOfMinutes(
									orainizio) <= this.getTimeAsNumberOfMinutes("23:59")) { // Same day valid Time

								OraInizioDateTimestamp = new Date(oInterventiYear, oInterventiMonth, oInterventiToday, orainizio.split(":")[0], orainizio.split(
									":")[1], "00");

								////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraInizioDateTimestamp", OraInizioDateTimestamp);
								oInterventiDateModel.getData()[indexInterventi].ORAINIZIOTIMESTAMP = OraInizioDateTimestamp;
								oTP.setValueState(ValueState.None);
							} else if (this.getTimeAsNumberOfMinutes(orainizio) >= this.getTimeAsNumberOfMinutes("00:00") && this.getTimeAsNumberOfMinutes(
									orainizio) <= this.getTimeAsNumberOfMinutes("08:30")) { // Repint + 1 day valid time

								OraInizioDateTimestamp = new Date(oInterventiNextYear, oInterventiNextMonth, oInterventiNextDay, orainizio.split(":")[0],
									orainizio.split(":")[1], "00");

								////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraInizioDateTimestamp", OraInizioDateTimestamp);
								oInterventiDateModel.getData()[indexInterventi].ORAINIZIOTIMESTAMP = OraInizioDateTimestamp;
								oTP.setValueState(ValueState.None);
							}
						}

						// Commented below working code on 19th Oct 2020. **** CHECK BEFORE DELETE *****
						// ************************************* START *********************************************

						// Working Day
						// if (oInterventiDateModel.getData()[indexInterventi].WORKINGDAY) { // Weekday (L)
						// 	// Weekday (L)  
						// 	//if( this.getTimeAsNumberOfMinutes(orainizio) > this.getTimeAsNumberOfMinutes("08:30")  this.getTimeAsNumberOfMinutes(orainizio) < this.getTimeAsNumberOfMinutes("17:30"))

						// 	if (this.getTimeAsNumberOfMinutes(orainizio) < this.getTimeAsNumberOfMinutes("17:30") && this.getTimeAsNumberOfMinutes(
						// 			orainizio) > this.getTimeAsNumberOfMinutes("08:30")) {
						// 		oInterventiDateModel.getData()[indexInterventi].ORAINIZIO = null;
						// 		////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraInizioDateTimestamp", null);
						// 		oInterventiDateModel.getData()[indexInterventi].ORAINIZIOTIMESTAMP = null;
						// 		oTP.setValueState(ValueState.Error);
						// 		MessageBox.error("Per i giorni lavorativi \"Ora Inizio\" deve essere compresa tra le 17:30 e le 08:30 del giorno successivo");
						// 		return;
						// 	}

						// 	if (orafine !== "" && orafine !== null) {
						// 		// Check for Ora Inizio
						// 		if (this.getTimeAsNumberOfMinutes(orainizio) > this.getTimeAsNumberOfMinutes("08:30") && this.getTimeAsNumberOfMinutes(
						// 				orainizio) < this.getTimeAsNumberOfMinutes("17:30")) { // Same day invalid Time
						// 			oInterventiDateModel.getData()[indexInterventi].ORAINIZIO = null;
						// 			////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraInizioDateTimestamp", null);
						// 			oInterventiDateModel.getData()[indexInterventi].ORAINIZIOTIMESTAMP = null;
						// 			oTP.setValueState(ValueState.Error);
						// 			MessageBox.error("Per i giorni lavorativi \"Ora Inizio\" deve essere compresa tra le 17:30 e le 08:30 del giorno successivo");
						// 			return;
						// 		} else { // Valid Ora Inizio value - Repint day
						// 			if (this.getTimeAsNumberOfMinutes(orainizio) >= this.getTimeAsNumberOfMinutes("17:30") && this.getTimeAsNumberOfMinutes(
						// 					orainizio) <= this.getTimeAsNumberOfMinutes("23:59")) { // Same day valid Time

						// 				OraInizioDateTimestamp = new Date(oInterventiYear, oInterventiMonth, oInterventiToday, orainizio.split(":")[0], orainizio
						// 					.split(
						// 						":")[1], "00");

						// 				// Check for Ora Fine orafine

						// 				////if (OraInizioDateTimestamp > this.getOwnerComponent().getModel("viewProperties").getProperty("/OraFineoDateTimestamp")) {
						// 				if (OraInizioDateTimestamp > oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP) {
						// 					oInterventiDateModel.getData()[indexInterventi].ORAINIZIO = null;
						// 					/////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraInizioDateTimestamp", null);
						// 					oInterventiDateModel.getData()[indexInterventi].ORAINIZIOTIMESTAMP = null;
						// 					oTP.setValueState(ValueState.Error);
						// 					MessageBox.error("Il valore inserito in \"Ora Inizio\" non può essere maggiore di quello inserito in \"Ora Fine\" ");
						// 					return;
						// 				} else {
						// 					////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraInizioDateTimestamp", OraInizioDateTimestamp);
						// 					oInterventiDateModel.getData()[indexInterventi].ORAINIZIOTIMESTAMP = OraInizioDateTimestamp;
						// 					validFlag = true;
						// 				}
						// 			} else if (this.getTimeAsNumberOfMinutes(orainizio) >= this.getTimeAsNumberOfMinutes("00:00") && this.getTimeAsNumberOfMinutes(
						// 					orainizio) <= this.getTimeAsNumberOfMinutes("08:30")) { // Repint + 1 day valid time

						// 				OraInizioDateTimestamp = new Date(oInterventiNextYear, oInterventiNextMonth, oInterventiNextDay, orainizio.split(":")[0],
						// 					orainizio.split(":")[1], "00");

						// 				// Check for Ora Fine orafine
						// 				////if (OraInizioDateTimestamp > this.getOwnerComponent().getModel("viewProperties").getProperty("/OraFineoDateTimestamp")) {
						// 				if (OraInizioDateTimestamp > oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP) {
						// 					oInterventiDateModel.getData()[indexInterventi].ORAINIZIO = null;
						// 					////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraInizioDateTimestamp", null);
						// 					oInterventiDateModel.getData()[indexInterventi].ORAINIZIOTIMESTAMP = null;
						// 					oTP.setValueState(ValueState.Error);
						// 					MessageBox.error("Il valore inserito in \"Ora Inizio\" non può essere maggiore di quello inserito in \"Ora Fine\" ");
						// 					return;
						// 				} else {
						// 					////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraInizioDateTimestamp", OraInizioDateTimestamp);
						// 					oInterventiDateModel.getData()[indexInterventi].ORAINIZIOTIMESTAMP = OraInizioDateTimestamp;
						// 					validFlag = true;
						// 				}
						// 			}
						// 		}
						// 	} else { // Set only Ora Inizio value

						// 		if (this.getTimeAsNumberOfMinutes(orainizio) >= this.getTimeAsNumberOfMinutes("17:30") && this.getTimeAsNumberOfMinutes(
						// 				orainizio) <= this.getTimeAsNumberOfMinutes("23:59")) { // Same day valid Time

						// 			OraInizioDateTimestamp = new Date(oInterventiYear, oInterventiMonth, oInterventiToday, orainizio.split(":")[0], orainizio.split(
						// 				":")[1], "00");

						// 			////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraInizioDateTimestamp", OraInizioDateTimestamp);
						// 			oInterventiDateModel.getData()[indexInterventi].ORAINIZIOTIMESTAMP = OraInizioDateTimestamp;
						// 			oTP.setValueState(ValueState.None);
						// 		} else if (this.getTimeAsNumberOfMinutes(orainizio) >= this.getTimeAsNumberOfMinutes("00:00") && this.getTimeAsNumberOfMinutes(
						// 				orainizio) <= this.getTimeAsNumberOfMinutes("08:30")) { // Repint + 1 day valid time

						// 			OraInizioDateTimestamp = new Date(oInterventiNextYear, oInterventiNextMonth, oInterventiNextDay, orainizio.split(":")[0],
						// 				orainizio.split(":")[1], "00");

						// 			////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraInizioDateTimestamp", OraInizioDateTimestamp);
						// 			oInterventiDateModel.getData()[indexInterventi].ORAINIZIOTIMESTAMP = OraInizioDateTimestamp;
						// 			oTP.setValueState(ValueState.None);
						// 		}
						// 	}
						// }
						// Non Working Day
						// else {
						// 	// Weekend or Holidays (S and F)
						// 	if (orafine !== "" && orafine !== null) {
						// 		// Check for Ora Inizio - Repint day
						// 		if (this.getTimeAsNumberOfMinutes(orainizio) >= this.getTimeAsNumberOfMinutes("08:30") && this.getTimeAsNumberOfMinutes(
						// 				orainizio) <= this.getTimeAsNumberOfMinutes("23:59")) { // Same day valid Time

						// 			OraInizioDateTimestamp = new Date(oInterventiYear, oInterventiMonth, oInterventiToday, orainizio.split(":")[0], orainizio.split(
						// 				":")[1], "00");

						// 			// Check for Ora Fine  
						// 			////if (OraInizioDateTimestamp > this.getOwnerComponent().getModel("viewProperties").getProperty("/OraFineoDateTimestamp")) {
						// 			if (OraInizioDateTimestamp > oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP) {
						// 				oInterventiDateModel.getData()[indexInterventi].ORAINIZIO = null;
						// 				////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraInizioDateTimestamp", null);
						// 				oInterventiDateModel.getData()[indexInterventi].ORAINIZIOTIMESTAMP = null;
						// 				oTP.setValueState(ValueState.Error);
						// 				MessageBox.error("Il valore inserito in \"Ora Inizio\" non può essere maggiore di quello inserito in \"Ora Fine\" ");
						// 				return;
						// 			} else {
						// 				////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraInizioDateTimestamp", OraInizioDateTimestamp);
						// 				oInterventiDateModel.getData()[indexInterventi].ORAINIZIOTIMESTAMP = OraInizioDateTimestamp;
						// 				validFlag = true;
						// 			}
						// 		} else if (this.getTimeAsNumberOfMinutes(orainizio) >= this.getTimeAsNumberOfMinutes("00:00") && this.getTimeAsNumberOfMinutes(
						// 				orainizio) < this.getTimeAsNumberOfMinutes("08:30")) { // Repint + 1 day valid time

						// 			OraInizioDateTimestamp = new Date(oInterventiNextYear, oInterventiNextMonth, oInterventiNextDay, orainizio.split(":")[0],
						// 				orainizio.split(":")[1], "00");

						// 			// Check for Ora Fine
						// 			////if (OraInizioDateTimestamp > this.getOwnerComponent().getModel("viewProperties").getProperty("/OraFineoDateTimestamp")) {
						// 			if (OraInizioDateTimestamp > oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP) {
						// 				oInterventiDateModel.getData()[indexInterventi].ORAINIZIO = null;
						// 				////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraInizioDateTimestamp", null);
						// 				oInterventiDateModel.getData()[indexInterventi].ORAINIZIOTIMESTAMP = null;
						// 				oTP.setValueState(ValueState.Error);
						// 				MessageBox.error("Il valore inserito in \"Ora Inizio\" non può essere maggiore di quello inserito in \"Ora Fine\" ");
						// 				return;
						// 			} else {
						// 				///this.getOwnerComponent().getModel("viewProperties").setProperty("/OraInizioDateTimestamp", OraInizioDateTimestamp);
						// 				oInterventiDateModel.getData()[indexInterventi].ORAINIZIOTIMESTAMP = OraInizioDateTimestamp;
						// 				validFlag = true;
						// 			}
						// 		}
						// 	} else { // Set only Ora Inizio value

						// 		if (this.getTimeAsNumberOfMinutes(orainizio) >= this.getTimeAsNumberOfMinutes("08:30") && this.getTimeAsNumberOfMinutes(
						// 				orainizio) <= this.getTimeAsNumberOfMinutes("23:59")) { // Same day valid Time

						// 			OraInizioDateTimestamp = new Date(oInterventiYear, oInterventiMonth, oInterventiToday, orainizio.split(":")[0], orainizio.split(
						// 				":")[1], "00");

						// 			////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraInizioDateTimestamp", OraInizioDateTimestamp);
						// 			oInterventiDateModel.getData()[indexInterventi].ORAINIZIOTIMESTAMP = OraInizioDateTimestamp;
						// 			oTP.setValueState(ValueState.None);
						// 		} else if (this.getTimeAsNumberOfMinutes(orainizio) >= this.getTimeAsNumberOfMinutes("00:00") && this.getTimeAsNumberOfMinutes(
						// 				orainizio) < this.getTimeAsNumberOfMinutes("08:30")) { // Repint + 1 day valid time

						// 			OraInizioDateTimestamp = new Date(oInterventiNextYear, oInterventiNextMonth, oInterventiNextDay, orainizio.split(":")[0],
						// 				orainizio.split(":")[1], "00");

						// 			////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraInizioDateTimestamp", OraInizioDateTimestamp);
						// 			oInterventiDateModel.getData()[indexInterventi].ORAINIZIOTIMESTAMP = OraInizioDateTimestamp;
						// 			oTP.setValueState(ValueState.None);
						// 		}
						// 	}

						// }
						// ************************************* END *********************************************

					} else { // LPN unchecked
						if (oRepDateModel.getData()[j].Fer) { // Weekday (L)  
							if (this.getTimeAsNumberOfMinutes(orainizio) < this.getTimeAsNumberOfMinutes("17:30") && this.getTimeAsNumberOfMinutes(
									orainizio) > this.getTimeAsNumberOfMinutes("08:30")) {
								oInterventiDateModel.getData()[indexInterventi].ORAINIZIO = null;
								////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraInizioDateTimestamp", null);
								oInterventiDateModel.getData()[indexInterventi].ORAINIZIOTIMESTAMP = null;
								oTP.setValueState(ValueState.Error);
								MessageBox.error("Per i giorni lavorativi \"Ora Inizio\" deve essere compresa tra le 17:30 e le 08:30 del giorno successivo");
								return;
							}

							if (orafine !== "" && orafine !== null) {
								// Check for Ora Inizio
								if (this.getTimeAsNumberOfMinutes(orainizio) > this.getTimeAsNumberOfMinutes("08:30") && this.getTimeAsNumberOfMinutes(
										orainizio) < this.getTimeAsNumberOfMinutes("17:30")) { // Same day invalid Time
									oInterventiDateModel.getData()[indexInterventi].ORAINIZIO = null;
									////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraInizioDateTimestamp", null);
									oInterventiDateModel.getData()[indexInterventi].ORAINIZIOTIMESTAMP = null;
									oTP.setValueState(ValueState.Error);
									MessageBox.error("Per i giorni lavorativi \"Ora Inizio\" deve essere compresa tra le 17:30 e le 08:30 del giorno successivo");
									return;
								} else { // Valid Ora Inizio value - Repint day
									if (this.getTimeAsNumberOfMinutes(orainizio) >= this.getTimeAsNumberOfMinutes("17:30") && this.getTimeAsNumberOfMinutes(
											orainizio) <= this.getTimeAsNumberOfMinutes("23:59")) { // Same day valid Time

										OraInizioDateTimestamp = new Date(oInterventiYear, oInterventiMonth, oInterventiToday, orainizio.split(":")[0], orainizio
											.split(
												":")[1], "00");

										// Check for Ora Fine orafine

										////if (OraInizioDateTimestamp > this.getOwnerComponent().getModel("viewProperties").getProperty("/OraFineoDateTimestamp")) {
										if (OraInizioDateTimestamp > oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP) {
											oInterventiDateModel.getData()[indexInterventi].ORAINIZIO = null;
											/////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraInizioDateTimestamp", null);
											oInterventiDateModel.getData()[indexInterventi].ORAINIZIOTIMESTAMP = null;
											oTP.setValueState(ValueState.Error);
											MessageBox.error("Il valore inserito in \"Ora Inizio\" non può essere maggiore di quello inserito in \"Ora Fine\" ");
											return;
										} else {
											////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraInizioDateTimestamp", OraInizioDateTimestamp);
											oInterventiDateModel.getData()[indexInterventi].ORAINIZIOTIMESTAMP = OraInizioDateTimestamp;
											validFlag = true;
										}
									} else if (this.getTimeAsNumberOfMinutes(orainizio) >= this.getTimeAsNumberOfMinutes("00:00") && this.getTimeAsNumberOfMinutes(
											orainizio) <= this.getTimeAsNumberOfMinutes("08:30")) { // Repint + 1 day valid time

										OraInizioDateTimestamp = new Date(oInterventiNextYear, oInterventiNextMonth, oInterventiNextDay, orainizio.split(":")[0],
											orainizio.split(":")[1], "00");

										// Check for Ora Fine orafine
										////if (OraInizioDateTimestamp > this.getOwnerComponent().getModel("viewProperties").getProperty("/OraFineoDateTimestamp")) {
										if (OraInizioDateTimestamp > oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP) {
											oInterventiDateModel.getData()[indexInterventi].ORAINIZIO = null;
											////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraInizioDateTimestamp", null);
											oInterventiDateModel.getData()[indexInterventi].ORAINIZIOTIMESTAMP = null;
											oTP.setValueState(ValueState.Error);
											MessageBox.error("Il valore inserito in \"Ora Inizio\" non può essere maggiore di quello inserito in \"Ora Fine\" ");
											return;
										} else {
											////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraInizioDateTimestamp", OraInizioDateTimestamp);
											oInterventiDateModel.getData()[indexInterventi].ORAINIZIOTIMESTAMP = OraInizioDateTimestamp;
											validFlag = true;
										}
									}
								}
							} else { // Set only Ora Inizio value

								if (this.getTimeAsNumberOfMinutes(orainizio) >= this.getTimeAsNumberOfMinutes("17:30") && this.getTimeAsNumberOfMinutes(
										orainizio) <= this.getTimeAsNumberOfMinutes("23:59")) { // Same day valid Time

									OraInizioDateTimestamp = new Date(oInterventiYear, oInterventiMonth, oInterventiToday, orainizio.split(":")[0], orainizio.split(
										":")[1], "00");

									////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraInizioDateTimestamp", OraInizioDateTimestamp);
									oInterventiDateModel.getData()[indexInterventi].ORAINIZIOTIMESTAMP = OraInizioDateTimestamp;
									oTP.setValueState(ValueState.None);
								} else if (this.getTimeAsNumberOfMinutes(orainizio) >= this.getTimeAsNumberOfMinutes("00:00") && this.getTimeAsNumberOfMinutes(
										orainizio) <= this.getTimeAsNumberOfMinutes("08:30")) { // Repint + 1 day valid time

									OraInizioDateTimestamp = new Date(oInterventiNextYear, oInterventiNextMonth, oInterventiNextDay, orainizio.split(":")[0],
										orainizio.split(":")[1], "00");

									////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraInizioDateTimestamp", OraInizioDateTimestamp);
									oInterventiDateModel.getData()[indexInterventi].ORAINIZIOTIMESTAMP = OraInizioDateTimestamp;
									oTP.setValueState(ValueState.None);
								}
							}

						} else { // Weekend or Holidays (S and F)

							if (orafine !== "" && orafine !== null) {
								// Check for Ora Inizio - Repint day
								if (this.getTimeAsNumberOfMinutes(orainizio) >= this.getTimeAsNumberOfMinutes("08:30") && this.getTimeAsNumberOfMinutes(
										orainizio) <= this.getTimeAsNumberOfMinutes("23:59")) { // Same day valid Time

									OraInizioDateTimestamp = new Date(oInterventiYear, oInterventiMonth, oInterventiToday, orainizio.split(":")[0], orainizio.split(
										":")[1], "00");

									// Check for Ora Fine  
									////if (OraInizioDateTimestamp > this.getOwnerComponent().getModel("viewProperties").getProperty("/OraFineoDateTimestamp")) {
									if (OraInizioDateTimestamp > oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP) {
										oInterventiDateModel.getData()[indexInterventi].ORAINIZIO = null;
										////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraInizioDateTimestamp", null);
										oInterventiDateModel.getData()[indexInterventi].ORAINIZIOTIMESTAMP = null;
										oTP.setValueState(ValueState.Error);
										MessageBox.error("Il valore inserito in \"Ora Inizio\" non può essere maggiore di quello inserito in \"Ora Fine\" ");
										return;
									} else {
										////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraInizioDateTimestamp", OraInizioDateTimestamp);
										oInterventiDateModel.getData()[indexInterventi].ORAINIZIOTIMESTAMP = OraInizioDateTimestamp;
										validFlag = true;
									}
								} else if (this.getTimeAsNumberOfMinutes(orainizio) >= this.getTimeAsNumberOfMinutes("00:00") && this.getTimeAsNumberOfMinutes(
										orainizio) < this.getTimeAsNumberOfMinutes("08:30")) { // Repint + 1 day valid time

									OraInizioDateTimestamp = new Date(oInterventiNextYear, oInterventiNextMonth, oInterventiNextDay, orainizio.split(":")[0],
										orainizio.split(":")[1], "00");

									// Check for Ora Fine
									////if (OraInizioDateTimestamp > this.getOwnerComponent().getModel("viewProperties").getProperty("/OraFineoDateTimestamp")) {
									if (OraInizioDateTimestamp > oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP) {
										oInterventiDateModel.getData()[indexInterventi].ORAINIZIO = null;
										////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraInizioDateTimestamp", null);
										oInterventiDateModel.getData()[indexInterventi].ORAINIZIOTIMESTAMP = null;
										oTP.setValueState(ValueState.Error);
										MessageBox.error("Il valore inserito in \"Ora Inizio\" non può essere maggiore di quello inserito in \"Ora Fine\" ");
										return;
									} else {
										///this.getOwnerComponent().getModel("viewProperties").setProperty("/OraInizioDateTimestamp", OraInizioDateTimestamp);
										oInterventiDateModel.getData()[indexInterventi].ORAINIZIOTIMESTAMP = OraInizioDateTimestamp;
										validFlag = true;
									}
								}
							} else { // Set only Ora Inizio value

								if (this.getTimeAsNumberOfMinutes(orainizio) >= this.getTimeAsNumberOfMinutes("08:30") && this.getTimeAsNumberOfMinutes(
										orainizio) <= this.getTimeAsNumberOfMinutes("23:59")) { // Same day valid Time

									OraInizioDateTimestamp = new Date(oInterventiYear, oInterventiMonth, oInterventiToday, orainizio.split(":")[0], orainizio.split(
										":")[1], "00");

									////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraInizioDateTimestamp", OraInizioDateTimestamp);
									oInterventiDateModel.getData()[indexInterventi].ORAINIZIOTIMESTAMP = OraInizioDateTimestamp;
									oTP.setValueState(ValueState.None);
								} else if (this.getTimeAsNumberOfMinutes(orainizio) >= this.getTimeAsNumberOfMinutes("00:00") && this.getTimeAsNumberOfMinutes(
										orainizio) < this.getTimeAsNumberOfMinutes("08:30")) { // Repint + 1 day valid time

									OraInizioDateTimestamp = new Date(oInterventiNextYear, oInterventiNextMonth, oInterventiNextDay, orainizio.split(":")[0],
										orainizio.split(":")[1], "00");

									////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraInizioDateTimestamp", OraInizioDateTimestamp);
									oInterventiDateModel.getData()[indexInterventi].ORAINIZIOTIMESTAMP = OraInizioDateTimestamp;
									oTP.setValueState(ValueState.None);
								}
							}
						}

					}

				}
			}
			// if ((!Dtflag) && oInterventiDateModel.getData()[indexInterventi].FLAGNOTTURNO !== true) {
			// 	oEvent.getSource().setDateValue(null);
			// 	MessageBox.error("Per l'intervento inserire una data presente in Reperibilità");
			// 	return;
			// }

			//			if (validFlag) {
			if (true) {
				oTP.setValueState(ValueState.None);

				// var res = Math.abs(this.getOwnerComponent().getModel("viewProperties").getProperty("/OraInizioDateTimestamp") - this.getOwnerComponent()
				// 	.getModel("viewProperties").getProperty("/OraFineoDateTimestamp")) / 1000;

				// CHECK
				//var res = Math.abs(oInterventiDateModel.getData()[indexInterventi].ORAINIZIOTIMESTAMP - oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP) / 1000;

				var res = Math.abs(oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP - oInterventiDateModel.getData()[
					indexInterventi].ORAINIZIOTIMESTAMP) / 1000;

				oInterventiDateModel.getData()[indexInterventi].MINDIFFORAINIFINE = Math.floor(res / 60);
				// Below values of OraInizio and OraFine timestamp required while calculating Riposi
				// oInterventiDateModel.getData()[indexInterventi].ORAINIZIOTIMESTAMP = this.getOwnerComponent().getModel("viewProperties").getProperty(
				// 	"/OraInizioDateTimestamp");
				// oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP = this.getOwnerComponent().getModel("viewProperties").getProperty(
				// 	"/OraFineoDateTimestamp");

				//this.startTime = oEvent.getSource().getDateValue().getTime();

				//var repintInterventiModel = this.getView().byId("idTableInterventi").getModel("RepintInterventiModel");
				var data = oInterventiDateModel.getProperty("/");
				//var index = oEvent.getSource().getParent().getParent().indexOfItem(oEvent.getSource().getParent());
				var counth1h = 0;
				var counth12h = 0;
				var counth24h = 0;
				var counth46h = 0;
				var counth68h = 0;
				var counth8h = 0;
				if (orafine !== "" && orafine !== undefined && orafine !== null) {
					//var diffInSeconds = (((this.endTime - this.startTime) / 1000) / 60) / 60;
					var diffInHours = oInterventiDateModel.getData()[indexInterventi].MINDIFFORAINIFINE / 60;
					////data[indexInterventi].FASCIA = diffInHours; 
					if (diffInHours) {
						data[indexInterventi].h1h = false;
						data[indexInterventi].h12h = false;
						data[indexInterventi].h24h = false;
						data[indexInterventi].h46h = false;
						data[indexInterventi].h68h = false;
						data[indexInterventi].h8h = false;
						if (diffInHours > 0 && diffInHours <= 1) {
							data[indexInterventi].h1h = true;
							data[indexInterventi].FASCIA = 1;
						} else if (diffInHours > 1 && diffInHours <= 2) {
							data[indexInterventi].h12h = true;
							data[indexInterventi].FASCIA = 2;
						} else if (diffInHours > 2 && diffInHours <= 4) {
							data[indexInterventi].h24h = true;
							data[indexInterventi].FASCIA = 3;
						} else if (diffInHours > 4 && diffInHours <= 6) {
							data[indexInterventi].h46h = true;
							data[indexInterventi].FASCIA = 4;
						} else if (diffInHours > 6 && diffInHours <= 8) {
							data[indexInterventi].h68h = true;
							data[indexInterventi].FASCIA = 5;
						} else if (diffInHours > 8) {
							data[indexInterventi].h8h = true;
							data[indexInterventi].FASCIA = 6;
						}
					}
				}
				for (var i = 0; i < oInterventiDateModel.getData().length; i++) {
					if (oInterventiDateModel.getData()[i].h1h == true) {
						counth1h = counth1h + 1;
					}
					if (oInterventiDateModel.getData()[i].h12h == true) {
						counth12h = counth12h + 1;
					}
					if (oInterventiDateModel.getData()[i].h24h == true) {
						counth24h = counth24h + 1;
					}
					if (oInterventiDateModel.getData()[i].h46h == true) {
						counth46h = counth46h + 1;
					}
					if (oInterventiDateModel.getData()[i].h68h == true) {
						counth68h = counth68h + 1;
					}
					if (oInterventiDateModel.getData()[i].h8h == true) {
						counth8h = counth8h + 1;
					}
				}
				this.getView().byId("txt1h").setText(counth1h);
				this.getView().byId("txt12h").setText(counth12h);
				this.getView().byId("txt24h").setText(counth24h);
				this.getView().byId("txt46h").setText(counth46h);
				this.getView().byId("txt68h").setText(counth68h);
				this.getView().byId("txt8h").setText(counth8h);

				oInterventiDateModel.setProperty("/", data);

				// Below functionsortInterventiDataForOraInzio() added on 30th Jan to fix bug 
				// Inserting two INTERVENTI in order to create a RIP case, the RIP box was not flagged. The rows for these two interventi were not placed in sequence.
				// This logic does the sorting of combination of "Interventi Date" and "Ora Inzio" value
				var oInterventiTable = this.getView().byId("idTableInterventi");
				var oSortedInterventiOraInzioDataModel = new sap.ui.model.json.JSONModel();
				var oSortedInterventiDateData = this.sortInterventiDataForOraInzio(oInterventiDateModel)
				oSortedInterventiOraInzioDataModel.setData(oSortedInterventiDateData);
				oInterventiTable.setModel(oSortedInterventiOraInzioDataModel, "RepintInterventiModel");

				//////this.filterRiposiSet(this.getView().byId("idTableInterventi"), oRepDateModel, oInterventiDateModel, indexInterventi, false);
				this.filterRiposiSet(this.getView().byId("idTableInterventi"), oRepDateModel, oInterventiDateModel, indexInterventi, false);

				//this.filterRiposiSet(oRepDateModel, oInterventiDateModel, indexInterventi);
				//	}

				//if (validFlag) {
				// oTP.setValueState(ValueState.None);

				// this.startTime = oEvent.getSource().getDateValue().getTime();
				// var repintInterventiModel = this.getView().byId("idTableInterventi").getModel("RepintInterventiModel");
				// var data = repintInterventiModel.getProperty("/");
				// var index = oEvent.getSource().getParent().getParent().indexOfItem(oEvent.getSource().getParent());
				// var counth1h = 0;
				// var counth12h = 0;
				// var counth24h = 0;
				// var counth46h = 0;
				// var counth68h = 0;
				// var counth8h = 0;
				// if (this.endTime) {
				// 	var diffInSeconds = (((this.endTime - this.startTime) / 1000) / 60) / 60;
				// 	data[index].FASCIA = diffInSeconds;
				// 	if (diffInSeconds) {
				// 		data[index].h1h = false;
				// 		data[index].h12h = false;
				// 		data[index].h24h = false;
				// 		data[index].h46h = false;
				// 		data[index].h68h = false;
				// 		data[index].h8h = false;
				// 		if (diffInSeconds > 0 && diffInSeconds <= 1) {
				// 			data[index].h1h = true;
				// 		} else if (diffInSeconds > 1 && diffInSeconds <= 2) {
				// 			data[index].h12h = true;
				// 		} else if (diffInSeconds > 2 && diffInSeconds <= 4) {
				// 			data[index].h24h = true;
				// 		} else if (diffInSeconds > 4 && diffInSeconds <= 6) {
				// 			data[index].h46h = true;
				// 		} else if (diffInSeconds > 6 && diffInSeconds <= 8) {
				// 			data[index].h68h = true;
				// 		} else if (diffInSeconds > 8) {
				// 			data[index].h8h = true;
				// 		}
				// 	}
				// }
				// for (var i = 0; i < repintInterventiModel.getData().length; i++) {
				// 	if (repintInterventiModel.getData()[i].h1h == true) {
				// 		counth1h = counth1h + 1;
				// 	}
				// 	if (repintInterventiModel.getData()[i].h12h == true) {
				// 		counth12h = counth12h + 1;
				// 	}
				// 	if (repintInterventiModel.getData()[i].h24h == true) {
				// 		counth24h = counth24h + 1;
				// 	}
				// 	if (repintInterventiModel.getData()[i].h46h == true) {
				// 		counth46h = counth46h + 1;
				// 	}
				// 	if (repintInterventiModel.getData()[i].h68h == true) {
				// 		counth68h = counth68h + 1;
				// 	}
				// 	if (repintInterventiModel.getData()[i].h8h == true) {
				// 		counth8h = counth8h + 1;
				// 	}
				// }
				// this.getView().byId("txt1h").setText(counth1h);
				// this.getView().byId("txt12h").setText(counth12h);
				// this.getView().byId("txt24h").setText(counth24h);
				// this.getView().byId("txt46h").setText(counth46h);
				// this.getView().byId("txt68h").setText(counth68h);
				// this.getView().byId("txt8h").setText(counth8h);

				// repintInterventiModel.setProperty("/", data);

				// this.filterRiposiSet(oRepDateModel, oInterventiDateModel, indexInterventi);

			}
			// else {
			// 	oTP.setValueState(ValueState.Error);
			// }

		},

		tpChange2: function (oEvent) {

			var oTP = oEvent.getSource(),
				sValue = oEvent.getParameter("value"),
				bValid = oEvent.getParameter("valid");

			var oRepDateModel = this.getView().byId("idTableReperibilita").getModel("RepintReperibilitaModel");
			var oInterventiDateModel = this.getView().byId("idTableInterventi").getModel("RepintInterventiModel");
			var indexInterventi = oEvent.getSource().getParent().getParent().indexOfItem(oEvent.getSource().getParent());

			var orainizio = oInterventiDateModel.getData()[indexInterventi].ORAINIZIO;
			////var orafine = oInterventiDateModel.getData()[indexInterventi].ORAFINE;
			var orafine = sValue;
			var dateintervento = oInterventiDateModel.getData()[indexInterventi].DATAINTERVENTO;

			var oInterventiDate;
			var oInterventiMonth;
			var oInterventiYear;
			var oInterventiToday;

			var oInterventoNextDate; // = new Date();
			//oInterventoNextDate = Formatter.formatDate(oInterventoNextDate);
			var oInterventiNextYear;
			var oInterventiNextMonth;
			var oInterventiNextDay;

			var OraFineoDateTimestamp;
			var validFlag = false;

			// Reset 'FLAGCOUNT' (RIP) to unchecked			
			oInterventiDateModel.getData()[indexInterventi].FLAGCONT = false;
			// Reset 'RIPOSI' value
			oInterventiDateModel.getData()[indexInterventi].RIPOSI = null;

			if (dateintervento === "" || dateintervento === undefined || dateintervento === null) {
				if (this.getView().byId("idTableReperibilita").getItems()[indexInterventi] !== undefined) {
					this.getView().byId("idTableReperibilita").getItems()[indexInterventi].getCells()[2].setValueState(sap.ui.core.ValueState.Error);
				}
				MessageBox.error("Nella sezione Interventi valorizzata il campo data");
				return;
			}

			for (var j = 0; j < oRepDateModel.getData().length; ++j) {
				//if (sValue === oRepDateModel.getData()[j].DATAREPERIBILITA) {
				///if ((oInterventiDateModel.getData()[indexInterventi].DATAINTERVENTO === oRepDateModel.getData()[j].DATAREPERIBILITA) ||
				if ((dateintervento === oRepDateModel.getData()[j].DATAREPERIBILITA) ||
					oInterventiDateModel.getData()[indexInterventi].FLAGNOTTURNO) {

					if (orafine === "" || orafine === null) {
						oInterventiDateModel.getData()[indexInterventi].ORAFINE = null;
						////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraFineoDateTimestamp", null);
						oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP = null;
						oTP.setValueState(ValueState.Error);
						MessageBox.error("Il campo \"Ora Fine\" non può essere lasciato vuoto");
						return;
					}

					oInterventiDate = new Date(Formatter.formatDateToMMDDYYYY(dateintervento));
					oInterventoNextDate = new Date(Formatter.formatDateToMMDDYYYY(dateintervento));
					oInterventiYear = oInterventiDate.getFullYear();
					oInterventiMonth = oInterventiDate.getMonth();
					oInterventiToday = oInterventiDate.getDate();

					//var oInterventoNextDate = new Date();
					oInterventoNextDate.setDate(oInterventiDate.getDate() + 1);

					//oInterventoNextDate = oInterventiDate.getDate() + 1;
					oInterventiNextYear = oInterventoNextDate.getFullYear();
					oInterventiNextMonth = oInterventoNextDate.getMonth();
					oInterventiNextDay = oInterventoNextDate.getDate();

					if (oInterventiDateModel.getData()[indexInterventi].FLAGNOTTURNO) { // LPN Checked

						//New conditon added on 19th Oct
						//For LPN, the time slot is 17.30 to 08.30, if a user inserts a LPN and a time slot different we will propose the message:
						//Occorre inserire delle ore comprese nella fascia oraria 17:30 – 08:30
						// Here irrespective of Working Day or Non Working Day same condtion applies

						if (this.getTimeAsNumberOfMinutes(orafine) < this.getTimeAsNumberOfMinutes("17:30") && this.getTimeAsNumberOfMinutes(
								orafine) > this.getTimeAsNumberOfMinutes("08:30")) {
							oInterventiDateModel.getData()[indexInterventi].ORAFINE = null;
							////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraFineoDateTimestamp", null);
							oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP = null;
							oTP.setValueState(ValueState.Error);
							////MessageBox.error("For Weekdays - Ora Fine value should be between 17:30 for same day and 08:30 for Repint + 1 day");
							MessageBox.error("Occorre inserire delle ore comprese nella fascia oraria 17:30 – 08:30");
							return;
						}

						if (orainizio !== "" && orainizio !== null) {
							// Check for Ora Fine   
							if (this.getTimeAsNumberOfMinutes(orafine) > this.getTimeAsNumberOfMinutes("08:30") && this.getTimeAsNumberOfMinutes(
									orafine) < this.getTimeAsNumberOfMinutes("17:30")) { // Same day invalid Time
								oInterventiDateModel.getData()[indexInterventi].ORAFINE = null;
								////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraFineoDateTimestamp", null);
								oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP = null;
								oTP.setValueState(ValueState.Error);
								////MessageBox.error("For Weekdays - Ora Fine value should be between 17:30 for same day and 08:30 for Repint + 1 day");
								MessageBox.error("Occorre inserire delle ore comprese nella fascia oraria 17:30 – 08:30");
							} else { // Valid Ora Fine value - Repint day
								if (this.getTimeAsNumberOfMinutes(orafine) >= this.getTimeAsNumberOfMinutes("17:30") && this.getTimeAsNumberOfMinutes(
										orafine) <= this.getTimeAsNumberOfMinutes("23:59")) { // Same day valid Time

									OraFineoDateTimestamp = new Date(oInterventiYear, oInterventiMonth, oInterventiToday, orafine.split(":")[0], orafine.split(
										":")[1], "00");

									// Check for Ora Fine
									////if (OraFineoDateTimestamp < this.getOwnerComponent().getModel("viewProperties").getProperty("/OraInizioDateTimestamp")) {
									if (OraFineoDateTimestamp < oInterventiDateModel.getData()[indexInterventi].ORAINIZIOTIMESTAMP) {
										oInterventiDateModel.getData()[indexInterventi].ORAFINE = null;
										////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraFineoDateTimestamp", null);
										oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP = null;
										oTP.setValueState(ValueState.Error);
										MessageBox.error("Il valore inserito in \"Ora Inizio\" non può essere maggiore di quello inserito in \"Ora Fine\"");
										return;
									} else {
										////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraFineoDateTimestamp", OraFineoDateTimestamp);
										oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP = OraFineoDateTimestamp;
										validFlag = true;
									}
								} else if (this.getTimeAsNumberOfMinutes(orafine) >= this.getTimeAsNumberOfMinutes("00:00") && this.getTimeAsNumberOfMinutes(
										orafine) <= this.getTimeAsNumberOfMinutes("08:30")) { // Repint + 1 day valid time

									OraFineoDateTimestamp = new Date(oInterventiNextYear, oInterventiNextMonth, oInterventiNextDay, orafine.split(":")[0],
										orafine.split(":")[1], "00");

									// Check for Ora Fine
									/////if (OraFineoDateTimestamp < this.getOwnerComponent().getModel("viewProperties").getProperty("/OraInizioDateTimestamp")) {\
									if (OraFineoDateTimestamp < oInterventiDateModel.getData()[indexInterventi].ORAINIZIOTIMESTAMP) {
										oInterventiDateModel.getData()[indexInterventi].ORAFINE = null;
										////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraFineoDateTimestamp", null);
										oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP = null;
										oTP.setValueState(ValueState.Error);
										MessageBox.error("Il valore inserito in \"Ora Inizio\" non può essere maggiore di quello inserito in \"Ora Fine\"");
										return;
									} else {
										////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraFineoDateTimestamp", OraFineoDateTimestamp);
										oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP = OraFineoDateTimestamp;
										validFlag = true;
									}
								}
							}
						} else { // Set only Ora Fine value
							if (this.getTimeAsNumberOfMinutes(orafine) >= this.getTimeAsNumberOfMinutes("17:30") && this.getTimeAsNumberOfMinutes(
									orafine) <= this.getTimeAsNumberOfMinutes("23:59")) { // Same day valid Time

								OraFineoDateTimestamp = new Date(oInterventiYear, oInterventiMonth, oInterventiToday, orafine.split(":")[0], orafine.split(
									":")[1], "00");

								////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraFineoDateTimestamp", OraFineoDateTimestamp);
								oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP = OraFineoDateTimestamp;
								oTP.setValueState(ValueState.None);
							} else if (this.getTimeAsNumberOfMinutes(orafine) >= this.getTimeAsNumberOfMinutes("00:00") && this.getTimeAsNumberOfMinutes(
									orafine) <= this.getTimeAsNumberOfMinutes("08:30")) { // Repint + 1 day valid time

								OraFineoDateTimestamp = new Date(oInterventiNextYear, oInterventiNextMonth, oInterventiNextDay, orafine.split(":")[0],
									orafine.split(":")[1], "00");

								////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraFineoDateTimestamp", OraFineoDateTimestamp);
								oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP = OraFineoDateTimestamp;
								oTP.setValueState(ValueState.None);
							}
						}

						// Commented below working code on 19th Oct 2020. **** CHECK BEFORE DELETE *****
						// ************************************* START *********************************************
						// Working Day
						// if (oInterventiDateModel.getData()[indexInterventi].WORKINGDAY) { // Weekday (L)

						// 	if (this.getTimeAsNumberOfMinutes(orafine) < this.getTimeAsNumberOfMinutes("17:30") && this.getTimeAsNumberOfMinutes(
						// 			orafine) > this.getTimeAsNumberOfMinutes("08:30")) {
						// 		oInterventiDateModel.getData()[indexInterventi].ORAFINE = null;
						// 		////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraFineoDateTimestamp", null);
						// 		oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP = null;
						// 		oTP.setValueState(ValueState.Error);
						// 		MessageBox.error("For Weekdays - Ora Fine value should be between 17:30 for same day and 08:30 for Repint + 1 day");
						// 		return;
						// 	}

						// 	if (orainizio !== "" && orainizio !== null) {
						// 		// Check for Ora Fine   
						// 		if (this.getTimeAsNumberOfMinutes(orafine) > this.getTimeAsNumberOfMinutes("08:30") && this.getTimeAsNumberOfMinutes(
						// 				orafine) < this.getTimeAsNumberOfMinutes("17:30")) { // Same day invalid Time
						// 			oInterventiDateModel.getData()[indexInterventi].ORAFINE = null;
						// 			////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraFineoDateTimestamp", null);
						// 			oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP = null;
						// 			oTP.setValueState(ValueState.Error);
						// 			MessageBox.error("For Weekdays - Ora Fine value should be between 17:30 for same day and 08:30 for Repint + 1 day");
						// 		} else { // Valid Ora Fine value - Repint day
						// 			if (this.getTimeAsNumberOfMinutes(orafine) >= this.getTimeAsNumberOfMinutes("17:30") && this.getTimeAsNumberOfMinutes(
						// 					orafine) <= this.getTimeAsNumberOfMinutes("23:59")) { // Same day valid Time

						// 				OraFineoDateTimestamp = new Date(oInterventiYear, oInterventiMonth, oInterventiToday, orafine.split(":")[0], orafine.split(
						// 					":")[1], "00");

						// 				// Check for Ora Fine
						// 				////if (OraFineoDateTimestamp < this.getOwnerComponent().getModel("viewProperties").getProperty("/OraInizioDateTimestamp")) {
						// 				if (OraFineoDateTimestamp < oInterventiDateModel.getData()[indexInterventi].ORAINIZIOTIMESTAMP) {
						// 					oInterventiDateModel.getData()[indexInterventi].ORAFINE = null;
						// 					////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraFineoDateTimestamp", null);
						// 					oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP = null;
						// 					oTP.setValueState(ValueState.Error);
						// 					MessageBox.error("Il valore inserito in \"Ora Inizio\" non può essere maggiore di quello inserito in \"Ora Fine\"");
						// 					return;
						// 				} else {
						// 					////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraFineoDateTimestamp", OraFineoDateTimestamp);
						// 					oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP = OraFineoDateTimestamp;
						// 					validFlag = true;
						// 				}
						// 			} else if (this.getTimeAsNumberOfMinutes(orafine) >= this.getTimeAsNumberOfMinutes("00:00") && this.getTimeAsNumberOfMinutes(
						// 					orafine) <= this.getTimeAsNumberOfMinutes("08:30")) { // Repint + 1 day valid time

						// 				OraFineoDateTimestamp = new Date(oInterventiNextYear, oInterventiNextMonth, oInterventiNextDay, orafine.split(":")[0],
						// 					orafine.split(":")[1], "00");

						// 				// Check for Ora Fine
						// 				/////if (OraFineoDateTimestamp < this.getOwnerComponent().getModel("viewProperties").getProperty("/OraInizioDateTimestamp")) {\
						// 				if (OraFineoDateTimestamp < oInterventiDateModel.getData()[indexInterventi].ORAINIZIOTIMESTAMP) {
						// 					oInterventiDateModel.getData()[indexInterventi].ORAFINE = null;
						// 					////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraFineoDateTimestamp", null);
						// 					oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP = null;
						// 					oTP.setValueState(ValueState.Error);
						// 					MessageBox.error("Il valore inserito in \"Ora Inizio\" non può essere maggiore di quello inserito in \"Ora Fine\"");
						// 					return;
						// 				} else {
						// 					////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraFineoDateTimestamp", OraFineoDateTimestamp);
						// 					oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP = OraFineoDateTimestamp;
						// 					validFlag = true;
						// 				}
						// 			}
						// 		}
						// 	} else { // Set only Ora Fine value
						// 		if (this.getTimeAsNumberOfMinutes(orafine) >= this.getTimeAsNumberOfMinutes("17:30") && this.getTimeAsNumberOfMinutes(
						// 				orafine) <= this.getTimeAsNumberOfMinutes("23:59")) { // Same day valid Time

						// 			OraFineoDateTimestamp = new Date(oInterventiYear, oInterventiMonth, oInterventiToday, orafine.split(":")[0], orafine.split(
						// 				":")[1], "00");

						// 			////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraFineoDateTimestamp", OraFineoDateTimestamp);
						// 			oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP = OraFineoDateTimestamp;
						// 			oTP.setValueState(ValueState.None);
						// 		} else if (this.getTimeAsNumberOfMinutes(orafine) >= this.getTimeAsNumberOfMinutes("00:00") && this.getTimeAsNumberOfMinutes(
						// 				orafine) <= this.getTimeAsNumberOfMinutes("08:30")) { // Repint + 1 day valid time

						// 			OraFineoDateTimestamp = new Date(oInterventiNextYear, oInterventiNextMonth, oInterventiNextDay, orafine.split(":")[0],
						// 				orafine.split(":")[1], "00");

						// 			////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraFineoDateTimestamp", OraFineoDateTimestamp);
						// 			oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP = OraFineoDateTimestamp;
						// 			oTP.setValueState(ValueState.None);
						// 		}
						// 	}
						// }
						// Non Working Day
						// else { // Weekend or Holidays (S and F) 

						// 	Below working code commented on 19th Oct - DO NOT DELETE ******************
						// 	if (orainizio !== "" && orainizio !== null) {
						// 		// Check for Ora Fine   
						// 		if (this.getTimeAsNumberOfMinutes(orafine) > this.getTimeAsNumberOfMinutes("08:30") && this.getTimeAsNumberOfMinutes(
						// 				orafine) <= this.getTimeAsNumberOfMinutes("23:59")) { // Same day valid Time

						// 			OraFineoDateTimestamp = new Date(oInterventiYear, oInterventiMonth, oInterventiToday, orafine.split(":")[0], orafine.split(
						// 				":")[
						// 				1], "00");

						// 			// Check for Ora Fine
						// 			////if (OraFineoDateTimestamp < this.getOwnerComponent().getModel("viewProperties").getProperty("/OraInizioDateTimestamp")) {
						// 			if (OraFineoDateTimestamp < oInterventiDateModel.getData()[indexInterventi].ORAINIZIOTIMESTAMP) {
						// 				oInterventiDateModel.getData()[indexInterventi].ORAFINE = null;
						// 				////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraFineoDateTimestamp", null);
						// 				oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP = null;
						// 				oTP.setValueState(ValueState.Error);
						// 				MessageBox.error("Il valore inserito in \"Ora Inizio\" non può essere maggiore di quello inserito in \"Ora Fine\"");
						// 				return;
						// 			} else {
						// 				////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraFineoDateTimestamp", OraFineoDateTimestamp);
						// 				oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP = OraFineoDateTimestamp;
						// 				validFlag = true;
						// 			}
						// 		} else if (this.getTimeAsNumberOfMinutes(orafine) >= this.getTimeAsNumberOfMinutes("00:00") && this.getTimeAsNumberOfMinutes(
						// 				orafine) <= this.getTimeAsNumberOfMinutes("08:30")) { // Repint + 1 day valid time

						// 			OraFineoDateTimestamp = new Date(oInterventiNextYear, oInterventiNextMonth, oInterventiNextDay, orafine.split(":")[0],
						// 				orafine.split(":")[1], "00");

						// 			// Check for Ora Inizio
						// 			////if (OraFineoDateTimestamp < this.getOwnerComponent().getModel("viewProperties").getProperty("/OraInizioDateTimestamp")) {
						// 			if (OraFineoDateTimestamp < oInterventiDateModel.getData()[indexInterventi].ORAINIZIOTIMESTAMP) {
						// 				oInterventiDateModel.getData()[indexInterventi].ORAFINE = null;
						// 				////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraFineoDateTimestamp", null);
						// 				oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP = null;
						// 				oTP.setValueState(ValueState.Error);
						// 				MessageBox.error("Il valore inserito in \"Ora Inizio\" non può essere maggiore di quello inserito in \"Ora Fine\"");
						// 				return;
						// 			} else {
						// 				////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraFineoDateTimestamp", OraFineoDateTimestamp);
						// 				oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP = OraFineoDateTimestamp;
						// 				validFlag = true;
						// 			}
						// 		}
						// 	} else { // Set only Ora Fine value
						// 		if (this.getTimeAsNumberOfMinutes(orafine) > this.getTimeAsNumberOfMinutes("08:30") && this.getTimeAsNumberOfMinutes(
						// 				orafine) <= this.getTimeAsNumberOfMinutes("23:59")) { // Same day valid Time

						// 			OraFineoDateTimestamp = new Date(oInterventiYear, oInterventiMonth, oInterventiToday, orafine.split(":")[0], orafine.split(
						// 				":")[
						// 				1], "00");

						// 			////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraFineoDateTimestamp", OraFineoDateTimestamp);
						// 			oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP = OraFineoDateTimestamp;
						// 			oTP.setValueState(ValueState.None);
						// 		} else if (this.getTimeAsNumberOfMinutes(orafine) >= this.getTimeAsNumberOfMinutes("00:00") && this.getTimeAsNumberOfMinutes(
						// 				orafine) <= this.getTimeAsNumberOfMinutes("08:30")) { // Repint + 1 day valid time

						// 			OraFineoDateTimestamp = new Date(oInterventiNextYear, oInterventiNextMonth, oInterventiNextDay, orafine.split(":")[0],
						// 				orafine.split(":")[1], "00");

						// 			////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraFineoDateTimestamp", OraFineoDateTimestamp);
						// 			oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP = OraFineoDateTimestamp;
						// 			oTP.setValueState(ValueState.None);
						// 		}
						// 	}
						// }

						// ************************************** END ********************************************						

					} else { // LPN unchecked

						if (oRepDateModel.getData()[j].Fer) { // Weekday (L)

							if (this.getTimeAsNumberOfMinutes(orafine) < this.getTimeAsNumberOfMinutes("17:30") && this.getTimeAsNumberOfMinutes(
									orafine) > this.getTimeAsNumberOfMinutes("08:30")) {
								oInterventiDateModel.getData()[indexInterventi].ORAFINE = null;
								////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraFineoDateTimestamp", null);
								oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP = null;
								oTP.setValueState(ValueState.Error);
								MessageBox.error("Per i giorni lavorativi \"Ora Inizio\" deve essere compresa tra le 17:30 e le 08:30 del giorno successivo");
								return;
							}

							if (orainizio !== "" && orainizio !== null) {
								// Check for Ora Fine   
								if (this.getTimeAsNumberOfMinutes(orafine) > this.getTimeAsNumberOfMinutes("08:30") && this.getTimeAsNumberOfMinutes(
										orafine) < this.getTimeAsNumberOfMinutes("17:30")) { // Same day invalid Time
									oInterventiDateModel.getData()[indexInterventi].ORAFINE = null;
									////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraFineoDateTimestamp", null);
									oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP = null;
									oTP.setValueState(ValueState.Error);
									MessageBox.error("Per i giorni lavorativi \"Ora Inizio\" deve essere compresa tra le 17:30 e le 08:30 del giorno successivo");
								} else { // Valid Ora Fine value - Repint day
									if (this.getTimeAsNumberOfMinutes(orafine) >= this.getTimeAsNumberOfMinutes("17:30") && this.getTimeAsNumberOfMinutes(
											orafine) <= this.getTimeAsNumberOfMinutes("23:59")) { // Same day valid Time

										OraFineoDateTimestamp = new Date(oInterventiYear, oInterventiMonth, oInterventiToday, orafine.split(":")[0], orafine.split(
											":")[1], "00");

										// Check for Ora Fine
										////if (OraFineoDateTimestamp < this.getOwnerComponent().getModel("viewProperties").getProperty("/OraInizioDateTimestamp")) {
										if (OraFineoDateTimestamp < oInterventiDateModel.getData()[indexInterventi].ORAINIZIOTIMESTAMP) {
											oInterventiDateModel.getData()[indexInterventi].ORAFINE = null;
											////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraFineoDateTimestamp", null);
											oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP = null;
											oTP.setValueState(ValueState.Error);
											MessageBox.error("Il valore inserito in \"Ora Inizio\" non può essere maggiore di quello inserito in \"Ora Fine\"");
											return;
										} else {
											////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraFineoDateTimestamp", OraFineoDateTimestamp);
											oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP = OraFineoDateTimestamp;
											validFlag = true;
										}
									} else if (this.getTimeAsNumberOfMinutes(orafine) >= this.getTimeAsNumberOfMinutes("00:00") && this.getTimeAsNumberOfMinutes(
											orafine) <= this.getTimeAsNumberOfMinutes("08:30")) { // Repint + 1 day valid time

										OraFineoDateTimestamp = new Date(oInterventiNextYear, oInterventiNextMonth, oInterventiNextDay, orafine.split(":")[0],
											orafine.split(":")[1], "00");

										// Check for Ora Fine
										/////if (OraFineoDateTimestamp < this.getOwnerComponent().getModel("viewProperties").getProperty("/OraInizioDateTimestamp")) {\
										if (OraFineoDateTimestamp < oInterventiDateModel.getData()[indexInterventi].ORAINIZIOTIMESTAMP) {
											oInterventiDateModel.getData()[indexInterventi].ORAFINE = null;
											////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraFineoDateTimestamp", null);
											oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP = null;
											oTP.setValueState(ValueState.Error);
											MessageBox.error("Il valore inserito in \"Ora Inizio\" non può essere maggiore di quello inserito in \"Ora Fine\"");
											return;
										} else {
											////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraFineoDateTimestamp", OraFineoDateTimestamp);
											oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP = OraFineoDateTimestamp;
											validFlag = true;
										}
									}
								}
							} else { // Set only Ora Fine value
								if (this.getTimeAsNumberOfMinutes(orafine) >= this.getTimeAsNumberOfMinutes("17:30") && this.getTimeAsNumberOfMinutes(
										orafine) <= this.getTimeAsNumberOfMinutes("23:59")) { // Same day valid Time

									OraFineoDateTimestamp = new Date(oInterventiYear, oInterventiMonth, oInterventiToday, orafine.split(":")[0], orafine.split(
										":")[1], "00");

									////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraFineoDateTimestamp", OraFineoDateTimestamp);
									oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP = OraFineoDateTimestamp;
									oTP.setValueState(ValueState.None);
								} else if (this.getTimeAsNumberOfMinutes(orafine) >= this.getTimeAsNumberOfMinutes("00:00") && this.getTimeAsNumberOfMinutes(
										orafine) <= this.getTimeAsNumberOfMinutes("08:30")) { // Repint + 1 day valid time

									OraFineoDateTimestamp = new Date(oInterventiNextYear, oInterventiNextMonth, oInterventiNextDay, orafine.split(":")[0],
										orafine.split(":")[1], "00");

									////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraFineoDateTimestamp", OraFineoDateTimestamp);
									oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP = OraFineoDateTimestamp;
									oTP.setValueState(ValueState.None);
								}
							}
						} else { // Weekend or Holidays (S and F) 
							if (orainizio !== "" && orainizio !== null) {

								// Changes done on 24th Nov - condtion changed from <= this.getTimeAsNumberOfMinutes("08:30") to < this.getTimeAsNumberOfMinutes("08:30")

								// New condition added on 19th Oct 
								// When a date in Reperibilità is TIPOGIORNO <> L time slot is 17:30 to 08:30, if a user inserts a different slot we will propose the message:
								// Dalle 08.30 del <data nella view reperibilità> fino alle 8.30 del <data nella view reperibilità + 1gg
								if (this.getTimeAsNumberOfMinutes(orainizio) >= this.getTimeAsNumberOfMinutes("00:00") && this.getTimeAsNumberOfMinutes(
										orainizio) < this.getTimeAsNumberOfMinutes("08:30")) { // Repint + 1 day valid time							

									if (this.getTimeAsNumberOfMinutes(orafine) > this.getTimeAsNumberOfMinutes("08:30")) {
										oInterventiDateModel.getData()[indexInterventi].ORAFINE = null;
										oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP = null;
										oTP.setValueState(ValueState.Error);
										/////MessageBox.error("Il valore inserito in \"Ora Inizio\" non può essere maggiore di quello inserito in \"Ora Fine\"");
										MessageBox.error("Dalle 08.30 del " + Formatter.formatDateInterventi(oInterventiDate) + " fino alle 8.30 del " + Formatter.formatDateInterventi(
											oInterventoNextDate));
										return;
									}
								}

								// Check for Ora Fine   
								if (this.getTimeAsNumberOfMinutes(orafine) > this.getTimeAsNumberOfMinutes("08:30") && this.getTimeAsNumberOfMinutes(
										orafine) <= this.getTimeAsNumberOfMinutes("23:59")) { // Same day valid Time

									OraFineoDateTimestamp = new Date(oInterventiYear, oInterventiMonth, oInterventiToday, orafine.split(":")[0], orafine.split(
										":")[
										1], "00");

									// Check for Ora Fine
									////if (OraFineoDateTimestamp < this.getOwnerComponent().getModel("viewProperties").getProperty("/OraInizioDateTimestamp")) {
									if (OraFineoDateTimestamp < oInterventiDateModel.getData()[indexInterventi].ORAINIZIOTIMESTAMP) {
										oInterventiDateModel.getData()[indexInterventi].ORAFINE = null;
										////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraFineoDateTimestamp", null);
										oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP = null;
										oTP.setValueState(ValueState.Error);
										MessageBox.error("Il valore inserito in \"Ora Inizio\" non può essere maggiore di quello inserito in \"Ora Fine\"");
										///////MessageBox.error("Dalle 08.30 del " + Formatter.formatDateInterventi(oInterventiDate) + " fino alle 8.30 del " + Formatter.formatDateInterventi(oInterventoNextDate)); 
										return;
									} else {
										////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraFineoDateTimestamp", OraFineoDateTimestamp);
										oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP = OraFineoDateTimestamp;
										validFlag = true;
									}

								} else if (this.getTimeAsNumberOfMinutes(orafine) >= this.getTimeAsNumberOfMinutes("00:00") && this.getTimeAsNumberOfMinutes(
										orafine) <= this.getTimeAsNumberOfMinutes("08:30")) { // Repint + 1 day valid time

									OraFineoDateTimestamp = new Date(oInterventiNextYear, oInterventiNextMonth, oInterventiNextDay, orafine.split(":")[0],
										orafine.split(":")[1], "00");

									// Check for Ora Inizio
									////if (OraFineoDateTimestamp < this.getOwnerComponent().getModel("viewProperties").getProperty("/OraInizioDateTimestamp")) {
									if (OraFineoDateTimestamp < oInterventiDateModel.getData()[indexInterventi].ORAINIZIOTIMESTAMP) {
										oInterventiDateModel.getData()[indexInterventi].ORAFINE = null;
										////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraFineoDateTimestamp", null);
										oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP = null;
										oTP.setValueState(ValueState.Error);
										MessageBox.error("Il valore inserito in \"Ora Inizio\" non può essere maggiore di quello inserito in \"Ora Fine\"");
										///////MessageBox.error("Dalle 08.30 del " + Formatter.formatDateInterventi(oInterventiDate) + " fino alle 8.30 del " + Formatter.formatDateInterventi(oInterventoNextDate)); 
										return;
									} else {
										////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraFineoDateTimestamp", OraFineoDateTimestamp);
										oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP = OraFineoDateTimestamp;
										validFlag = true;
									}
								}
							} else { // Set only Ora Fine value
								if (this.getTimeAsNumberOfMinutes(orafine) > this.getTimeAsNumberOfMinutes("08:30") && this.getTimeAsNumberOfMinutes(
										orafine) <= this.getTimeAsNumberOfMinutes("23:59")) { // Same day valid Time

									OraFineoDateTimestamp = new Date(oInterventiYear, oInterventiMonth, oInterventiToday, orafine.split(":")[0], orafine.split(
										":")[
										1], "00");

									////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraFineoDateTimestamp", OraFineoDateTimestamp);
									oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP = OraFineoDateTimestamp;
									oTP.setValueState(ValueState.None);
								} else if (this.getTimeAsNumberOfMinutes(orafine) >= this.getTimeAsNumberOfMinutes("00:00") && this.getTimeAsNumberOfMinutes(
										orafine) <= this.getTimeAsNumberOfMinutes("08:30")) { // Repint + 1 day valid time

									OraFineoDateTimestamp = new Date(oInterventiNextYear, oInterventiNextMonth, oInterventiNextDay, orafine.split(":")[0],
										orafine.split(":")[1], "00");

									////this.getOwnerComponent().getModel("viewProperties").setProperty("/OraFineoDateTimestamp", OraFineoDateTimestamp);
									oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP = OraFineoDateTimestamp;
									oTP.setValueState(ValueState.None);
								}
							}
						}
					}

				}
			}
			if (validFlag) {
				oTP.setValueState(ValueState.None);

				// var res = Math.abs(this.getOwnerComponent().getModel("viewProperties").getProperty("/OraInizioDateTimestamp") - this.getOwnerComponent()
				// 	.getModel("viewProperties").getProperty("/OraFineoDateTimestamp")) / 1000;

				// CHECK
				var res = Math.abs(oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP - oInterventiDateModel.getData()[
					indexInterventi].ORAINIZIOTIMESTAMP) / 1000;

				oInterventiDateModel.getData()[indexInterventi].MINDIFFORAINIFINE = Math.floor(res / 60);

				// oInterventiDateModel.getData()[indexInterventi].ORAINIZIOTIMESTAMP = this.getOwnerComponent().getModel("viewProperties").getProperty(
				// 	"/OraInizioDateTimestamp");
				// oInterventiDateModel.getData()[indexInterventi].ORAFINETIMESTAMP = this.getOwnerComponent().getModel("viewProperties").getProperty(
				// 	"/OraFineoDateTimestamp");

				var data = oInterventiDateModel.getProperty("/");
				//var index = oEvent.getSource().getParent().getParent().indexOfItem(oEvent.getSource().getParent());
				var counth1h = 0;
				var counth12h = 0;
				var counth24h = 0;
				var counth46h = 0;
				var counth68h = 0;
				var counth8h = 0;
				//if (this.startTime) {
				if (orainizio !== "" && orainizio !== undefined && orainizio !== null) {
					//var diffInSeconds = (((this.endTime - this.startTime) / 1000) / 60) / 60;
					var diffInHours = oInterventiDateModel.getData()[indexInterventi].MINDIFFORAINIFINE / 60;
					//////data[indexInterventi].FASCIA = diffInHours;
					if (diffInHours) {
						data[indexInterventi].h1h = false;
						data[indexInterventi].h12h = false;
						data[indexInterventi].h24h = false;
						data[indexInterventi].h46h = false;
						data[indexInterventi].h68h = false;
						data[indexInterventi].h8h = false;
						if (diffInHours > 0 && diffInHours <= 1) {
							data[indexInterventi].h1h = true;
							data[indexInterventi].FASCIA = 1;
						} else if (diffInHours > 1 && diffInHours <= 2) {
							data[indexInterventi].h12h = true;
							data[indexInterventi].FASCIA = 2;
						} else if (diffInHours > 2 && diffInHours <= 4) {
							data[indexInterventi].h24h = true;
							data[indexInterventi].FASCIA = 3;
						} else if (diffInHours > 4 && diffInHours <= 6) {
							data[indexInterventi].h46h = true;
							data[indexInterventi].FASCIA = 4;
						} else if (diffInHours > 6 && diffInHours <= 8) {
							data[indexInterventi].h68h = true;
							data[indexInterventi].FASCIA = 5;
						} else if (diffInHours > 8) {
							data[indexInterventi].h8h = true;
							data[indexInterventi].FASCIA = 6;
						}
					}
				}
				for (var i = 0; i < oInterventiDateModel.getData().length; i++) {
					if (oInterventiDateModel.getData()[i].h1h == true) {
						counth1h = counth1h + 1;
					}
					if (oInterventiDateModel.getData()[i].h12h == true) {
						counth12h = counth12h + 1;
					}
					if (oInterventiDateModel.getData()[i].h24h == true) {
						counth24h = counth24h + 1;
					}
					if (oInterventiDateModel.getData()[i].h46h == true) {
						counth46h = counth46h + 1;
					}
					if (oInterventiDateModel.getData()[i].h68h == true) {
						counth68h = counth68h + 1;
					}
					if (oInterventiDateModel.getData()[i].h8h == true) {
						counth8h = counth8h + 1;
					}
				}
				this.getView().byId("txt1h").setText(counth1h);
				this.getView().byId("txt12h").setText(counth12h);
				this.getView().byId("txt24h").setText(counth24h);
				this.getView().byId("txt46h").setText(counth46h);
				this.getView().byId("txt68h").setText(counth68h);
				this.getView().byId("txt8h").setText(counth8h);

				oInterventiDateModel.setProperty("/", data);

				this.filterRiposiSet(this.getView().byId("idTableInterventi"), oRepDateModel, oInterventiDateModel, indexInterventi, false);
			}
			// else {
			// 	oTP.setValueState(ValueState.Error);
			// }

		},

		// tpChange2: function (oEvent) {
		// 	var oTP = oEvent.getSource(),
		// 		sValue = oEvent.getParameter("value"),
		// 		bValid = oEvent.getParameter("valid");

		// 	var oRepDateModel = this.getView().byId("idTableReperibilita").getModel("RepintReperibilitaModel");
		// 	var oInterventiDateModel = this.getView().byId("idTableInterventi").getModel("RepintInterventiModel");
		// 	var indexInterventi = oEvent.getSource().getParent().getParent().indexOfItem(oEvent.getSource().getParent());

		// 	// var Dtflag = false;
		// 	for (var j = 0; j < oRepDateModel.getData().length; ++j) {
		// 		//if (sValue === oRepDateModel.getData()[j].DATAREPERIBILITA) {
		// 		if (oInterventiDateModel.getData()[indexInterventi].DATAINTERVENTO === oRepDateModel.getData()[j].DATAREPERIBILITA) {
		// 			if (oRepDateModel.getData()[j].Fer) { // Weekday (L)  

		// 				if (oInterventiDateModel.getData()[indexInterventi].ORAINIZIO === "" || oInterventiDateModel.getData()[indexInterventi].ORAINIZIO ===
		// 					null) {
		// 					MessageBox.error("Il campo Ora Inizio deve essere valorizzato");
		// 					return;
		// 				}

		// 				if (
		// 					(this.getTimeAsNumberOfMinutes(oInterventiDateModel.getData()[indexInterventi].ORAINIZIO) >= this.getTimeAsNumberOfMinutes(
		// 						"17:30")) && (this.getTimeAsNumberOfMinutes(oInterventiDateModel.getData()[indexInterventi].ORAINIZIO) <= this.getTimeAsNumberOfMinutes(
		// 						"23:59"))
		// 				) {
		// 					if ((this.getTimeAsNumberOfMinutes(sValue) >= this.getTimeAsNumberOfMinutes("17:30")) && (this.getTimeAsNumberOfMinutes(sValue) <=
		// 							this.getTimeAsNumberOfMinutes("23:59"))) {
		// 						if (this.getTimeAsNumberOfMinutes(sValue) < this.getTimeAsNumberOfMinutes(oInterventiDateModel.getData()[indexInterventi].ORAINIZIO)) {
		// 							MessageBox.error("Ora Fine value should be greater than or equal to Ora Inizio value");
		// 							oInterventiDateModel.getData()[indexInterventi].ORAFINE = null;
		// 							return;
		// 						}
		// 					}

		// 					// else if ((this.getTimeAsNumberOfMinutes(sValue) >= this.getTimeAsNumberOfMinutes("00:00")) && (this.getTimeAsNumberOfMinutes(
		// 					// 		sValue) <= this.getTimeAsNumberOfMinutes("08:30"))) {
		// 					// 	MessageBox.error("Ora Fine value should be greater than or equal to Ora Inizio value");
		// 					// 	oInterventiDateModel.getData()[indexInterventi].ORAFINE = null;
		// 					// 	return;
		// 					// }

		// 				}
		// 				if (
		// 					(this.getTimeAsNumberOfMinutes(oInterventiDateModel.getData()[indexInterventi].ORAINIZIO) >= this.getTimeAsNumberOfMinutes(
		// 						"00:00")) && (this.getTimeAsNumberOfMinutes(oInterventiDateModel.getData()[indexInterventi].ORAINIZIO) <= this.getTimeAsNumberOfMinutes(
		// 						"08:30"))) {
		// 					if ((this.getTimeAsNumberOfMinutes(sValue) >= this.getTimeAsNumberOfMinutes("00:00")) && (this.getTimeAsNumberOfMinutes(sValue) <=
		// 							this.getTimeAsNumberOfMinutes("08:30"))) {

		// 						if (this.getTimeAsNumberOfMinutes(sValue) < this.getTimeAsNumberOfMinutes(oInterventiDateModel.getData()[indexInterventi].ORAINIZIO)) {
		// 							MessageBox.error("Ora Fine value should be greater than or equal to Ora Inizio value");
		// 							oInterventiDateModel.getData()[indexInterventi].ORAFINE = null;
		// 							return;
		// 						}

		// 					} else if ((this.getTimeAsNumberOfMinutes(sValue) >= this.getTimeAsNumberOfMinutes("17:30")) && (this.getTimeAsNumberOfMinutes(
		// 								sValue) <=
		// 							this.getTimeAsNumberOfMinutes("23:59"))) {
		// 						MessageBox.error("Ora Fine value should be greater than or equal to Ora Inizio value");
		// 						oInterventiDateModel.getData()[indexInterventi].ORAFINE = null;
		// 						return;
		// 					}

		// 				}

		// 				// if ( 
		// 				// 		(this.getTimeAsNumberOfMinutes(oInterventiDateModel.getData()[indexInterventi].ORAINIZIO) >= this.getTimeAsNumberOfMinutes("17:30"))
		// 				// 	&&  (this.getTimeAsNumberOfMinutes(oInterventiDateModel.getData()[indexInterventi].ORAINIZIO) <= this.getTimeAsNumberOfMinutes("23:59"))
		// 				// 	)
		// 				// {
		// 				// 	if( (this.getTimeAsNumberOfMinutes(sValue) >= this.getTimeAsNumberOfMinutes("17:30")) 
		// 				// 	&&  (this.getTimeAsNumberOfMinutes(sValue) <= this.getTimeAsNumberOfMinutes("23:59"))
		// 				// 	)
		// 				// 	{
		// 				// 		if( this.getTimeAsNumberOfMinutes(sValue) >= this.getTimeAsNumberOfMinutes(oInterventiDateModel.getData()[indexInterventi].ORAINIZIO)){
		// 				// 				MessageBox.error("Ora Fine value should be greater than or equal to Ora Inizio value");
		// 				// 				oInterventiDateModel.getData()[indexInterventi].ORAFINE = null;
		// 				// 			return;	
		// 				// 		}
		// 				// 	}

		// 				// }
		// 				if (this.getTimeAsNumberOfMinutes(sValue) >= this.getTimeAsNumberOfMinutes("17:30") && this.getTimeAsNumberOfMinutes(
		// 						sValue) <= this.getTimeAsNumberOfMinutes("23:59")) {
		// 					// Go
		// 				} else if (this.getTimeAsNumberOfMinutes(sValue) >= this.getTimeAsNumberOfMinutes("00:00") && this.getTimeAsNumberOfMinutes(
		// 						sValue) <= this.getTimeAsNumberOfMinutes("08:30")) {
		// 					// Go
		// 				} else {
		// 					MessageBox.error(
		// 						"For Weekdays Ora Fine value should be between >= 17:30 & <= 00:00 for same day and >= 00:00 & <=08:30 for day +1");
		// 					oInterventiDateModel.getData()[indexInterventi].ORAFINE = null;
		// 					return;
		// 				}

		// 				// if (sValue > "08:30") {
		// 				// 	MessageBox.error("Ora Fine date value should be <= 08:30 for Weekdays");
		// 				// 	oInterventiDateModel.getData()[indexInterventi].ORAFINE = null;
		// 				// 	return;
		// 				// }
		// 				// if (oInterventiDateModel.getData()[indexInterventi].ORAINIZIO < "17:30") {
		// 				// 	MessageBox.error("Ora Inizio date value should be >= 17:30 for Weekdays");
		// 				// 	oInterventiDateModel.getData()[indexInterventi].ORAINIZIO = null;
		// 				// 	return;
		// 				// }

		// 				// Time difference Calculations
		// 				// 24:00 - oInterventiDateModel.getData()[indexInterventi].ORAINIZIO + sValue 
		// 				// if(sValue > oInterventiDateModel.getData()[indexInterventi].ORAINIZIO){ // Same day before 00:00
		// 				// 	var totaltime = sValue - oInterventiDateModel.getData()[indexInterventi].ORAINIZIO;
		// 				// }else{ // Next day after 00:00
		// 				// 	var fromtime = "23:59" - oInterventiDateModel.getData()[indexInterventi].ORAINIZIO;
		// 				// 	var totime = sValue;
		// 				// 	var totaltime = fromtime + totime;
		// 				// }

		// 			} else { // Weekend or Holiday(S and F)

		// 				if (oInterventiDateModel.getData()[indexInterventi].ORAINIZIO === "" || oInterventiDateModel.getData()[indexInterventi].ORAINIZIO ===
		// 					null) {
		// 					MessageBox.error("Il campo Ora Inizio deve essere valorizzato");
		// 					return;
		// 				}

		// 				// if (this.getTimeAsNumberOfMinutes(sValue) < this.getTimeAsNumberOfMinutes(oInterventiDateModel.getData()[
		// 				// 		indexInterventi].ORAINIZIO)) {
		// 				// 	MessageBox.error("Ora Fine value should be greater than or equal to Ora Inizio value");
		// 				// 	oInterventiDateModel.getData()[indexInterventi].ORAFINE = null;
		// 				// 	return;
		// 				// } 

		// 				if (
		// 					(this.getTimeAsNumberOfMinutes(oInterventiDateModel.getData()[indexInterventi].ORAINIZIO) >= this.getTimeAsNumberOfMinutes(
		// 						"08:30")) && (this.getTimeAsNumberOfMinutes(oInterventiDateModel.getData()[indexInterventi].ORAINIZIO) <= this.getTimeAsNumberOfMinutes(
		// 						"23:59"))
		// 				) {
		// 					if ((this.getTimeAsNumberOfMinutes(sValue) >= this.getTimeAsNumberOfMinutes("08:30")) && (this.getTimeAsNumberOfMinutes(sValue) <=
		// 							this.getTimeAsNumberOfMinutes("23:59"))) {
		// 						if (this.getTimeAsNumberOfMinutes(sValue) < this.getTimeAsNumberOfMinutes(oInterventiDateModel.getData()[indexInterventi].ORAINIZIO)) {
		// 							MessageBox.error("Ora Fine value should be greater than or equal to Ora Inizio value");
		// 							oInterventiDateModel.getData()[indexInterventi].ORAFINE = null;
		// 							return;
		// 						}
		// 					}

		// 					// else if ((this.getTimeAsNumberOfMinutes(sValue) >= this.getTimeAsNumberOfMinutes("00:00")) && (this.getTimeAsNumberOfMinutes(
		// 					// 		sValue) <= this.getTimeAsNumberOfMinutes("08:30"))) {
		// 					// 	MessageBox.error("Ora Fine value should be greater than or equal to Ora Inizio value");
		// 					// 	oInterventiDateModel.getData()[indexInterventi].ORAFINE = null;
		// 					// 	return;
		// 					// }

		// 				}
		// 				if (
		// 					(this.getTimeAsNumberOfMinutes(oInterventiDateModel.getData()[indexInterventi].ORAINIZIO) >= this.getTimeAsNumberOfMinutes(
		// 						"00:00")) && (this.getTimeAsNumberOfMinutes(oInterventiDateModel.getData()[indexInterventi].ORAINIZIO) <= this.getTimeAsNumberOfMinutes(
		// 						"08:30"))) {
		// 					if ((this.getTimeAsNumberOfMinutes(sValue) >= this.getTimeAsNumberOfMinutes("00:00")) && (this.getTimeAsNumberOfMinutes(sValue) <=
		// 							this.getTimeAsNumberOfMinutes("08:30"))) {

		// 						if (this.getTimeAsNumberOfMinutes(sValue) < this.getTimeAsNumberOfMinutes(oInterventiDateModel.getData()[indexInterventi].ORAINIZIO)) {
		// 							MessageBox.error("Ora Fine value should be greater than or equal to Ora Inizio value");
		// 							oInterventiDateModel.getData()[indexInterventi].ORAFINE = null;
		// 							return;
		// 						}
		// 					} else if ((this.getTimeAsNumberOfMinutes(sValue) >= this.getTimeAsNumberOfMinutes("08:30")) && (this.getTimeAsNumberOfMinutes(
		// 								sValue) <=
		// 							this.getTimeAsNumberOfMinutes("23:59"))) {
		// 						MessageBox.error("Ora Fine value should be greater than or equal to Ora Inizio value");
		// 						oInterventiDateModel.getData()[indexInterventi].ORAFINE = null;
		// 						return;
		// 					}
		// 				}

		// 				if (this.getTimeAsNumberOfMinutes(sValue) >= this.getTimeAsNumberOfMinutes("08:30") && this.getTimeAsNumberOfMinutes(
		// 						sValue) <=
		// 					this.getTimeAsNumberOfMinutes("23:59")) {
		// 					// Go						
		// 				} else if (this.getTimeAsNumberOfMinutes(sValue) >= this.getTimeAsNumberOfMinutes("00:00") && this.getTimeAsNumberOfMinutes(
		// 						sValue) <=
		// 					this.getTimeAsNumberOfMinutes("8:30")) {
		// 					// Go	
		// 				} else {
		// 					MessageBox.error(
		// 						"For Weekends and Holidays Ora Fine value should be between >= 08:30 & <= 00:00 for same day and >=00:00 & <=08:30 for day + 1"
		// 					);
		// 					oInterventiDateModel.getData()[indexInterventi].ORAFINE = null;
		// 					return;
		// 				}

		// 				// if (oInterventiDateModel.getData()[indexInterventi].ORAINIZIO < "08:30") {
		// 				// 	MessageBox.error("Ora Inizio date value should be >= 08:30 for Weekends");
		// 				// 	oInterventiDateModel.getData()[indexInterventi].ORAINIZIO = null;
		// 				// 	return;
		// 				// }

		// 				// Time difference Calculations
		// 				// if(sValue < oInterventiDateModel.getData()[indexInterventi].ORAINIZIO){ // Indicated next day time
		// 				// 	var fromtime = "23:59" - oInterventiDateModel.getData()[indexInterventi].ORAINIZIO;
		// 				// 	var totime = sValue;
		// 				// 	var totaltime = fromtime + totime;
		// 				// }else{
		// 				// 	var totaltime = sValue - oInterventiDateModel.getData()[indexInterventi].ORAINIZIO;
		// 				// }
		// 			}
		// 		}
		// 	}

		// 	if (bValid) {
		// 		oTP.setValueState(ValueState.None);
		// 		this.endTime = oEvent.getSource().getDateValue().getTime();
		// 		var repintInterventiModel = this.getView().byId("idTableInterventi").getModel("RepintInterventiModel");
		// 		var data = repintInterventiModel.getProperty("/");
		// 		var index = oEvent.getSource().getParent().getParent().indexOfItem(oEvent.getSource().getParent());
		// 		var counth1h = 0;
		// 		var counth12h = 0;
		// 		var counth24h = 0;
		// 		var counth46h = 0;
		// 		var counth68h = 0;
		// 		var counth8h = 0;
		// 		if (this.startTime) {
		// 			var diffInSeconds = (((this.endTime - this.startTime) / 1000) / 60) / 60;
		// 			data[index].FASCIA = diffInSeconds;
		// 			if (diffInSeconds) {
		// 				data[index].h1h = false;
		// 				data[index].h12h = false;
		// 				data[index].h24h = false;
		// 				data[index].h46h = false;
		// 				data[index].h68h = false;
		// 				data[index].h8h = false;
		// 				if (diffInSeconds > 0 && diffInSeconds <= 1) {
		// 					data[index].h1h = true;
		// 				} else if (diffInSeconds > 1 && diffInSeconds <= 2) {
		// 					data[index].h12h = true;
		// 				} else if (diffInSeconds > 2 && diffInSeconds <= 4) {
		// 					data[index].h24h = true;
		// 				} else if (diffInSeconds > 4 && diffInSeconds <= 6) {
		// 					data[index].h46h = true;
		// 				} else if (diffInSeconds > 6 && diffInSeconds <= 8) {
		// 					data[index].h68h = true;
		// 				} else if (diffInSeconds > 8) {
		// 					data[index].h8h = true;
		// 				}
		// 			}
		// 		}
		// 		for (var i = 0; i < repintInterventiModel.getData().length; i++) {
		// 			if (repintInterventiModel.getData()[i].h1h == true) {
		// 				counth1h = counth1h + 1;
		// 			}
		// 			if (repintInterventiModel.getData()[i].h12h == true) {
		// 				counth12h = counth12h + 1;
		// 			}
		// 			if (repintInterventiModel.getData()[i].h24h == true) {
		// 				counth24h = counth24h + 1;
		// 			}
		// 			if (repintInterventiModel.getData()[i].h46h == true) {
		// 				counth46h = counth46h + 1;
		// 			}
		// 			if (repintInterventiModel.getData()[i].h68h == true) {
		// 				counth68h = counth68h + 1;
		// 			}
		// 			if (repintInterventiModel.getData()[i].h8h == true) {
		// 				counth8h = counth8h + 1;
		// 			}
		// 		}
		// 		this.getView().byId("txt1h").setText(counth1h);
		// 		this.getView().byId("txt12h").setText(counth12h);
		// 		this.getView().byId("txt24h").setText(counth24h);
		// 		this.getView().byId("txt46h").setText(counth46h);
		// 		this.getView().byId("txt68h").setText(counth68h);
		// 		this.getView().byId("txt8h").setText(counth8h);

		// 		repintInterventiModel.setProperty("/", data);

		// 	} else {
		// 		oTP.setValueState(ValueState.Error);
		// 	}

		// },

		getTimeAsNumberOfMinutes: function (time) {
			var timeParts = time.split(":");

			// if (timeParts[0] === "00") {
			// 	timeParts[0] = parseInt(24);
			// }

			var timeInMinutes = (parseInt(timeParts[0]) * 60) + parseInt(timeParts[1]);

			return parseInt(timeInMinutes);
		},

		// getNextDate: function(curDate) {
		// 	var format = new java.text.SimpleDateFormat("dd-MM-yyyy");
		// 	final Date date = format.parse(curDate);
		// 	final Calendar calendar = Calendar.getInstance();
		// 	calendar.setTime(date);
		// 	calendar.add(Calendar.DAY_OF_YEAR, 1);
		// 	return format.format(calendar.getTime()); 
		// },

		// onChiamatodaChange: function (oEvent) {
		// 	var data = this.getView().byId("idTableInterventi").getModel("RepintInterventiModel").getProperty("/");
		// 	var index = oEvent.getSource().getParent().getParent().indexOfItem(oEvent.getSource().getParent());
		// 	var oRepDateModel = this.getView().byId("idTableReperibilita").getModel("RepintReperibilitaModel");
		// 	var oInterventiDateModel = this.getView().byId("idTableInterventi").getModel("RepintInterventiModel");
		// 	var oInterventiTable = this.getView().byId("idTableInterventi");

		// 	data[index].CHIAMATODA = oEvent.getParameter("selectedItem").getText();

		// 	if (oEvent.getParameter("selectedItem").getText() === "Others") {
		// 		oInterventiTable.getItems()[index].getCells()[6].setEnabled(true);
		// 		data[index].FLAGNOTTURNO = false;
		// 	} else {
		// 		oInterventiTable.getItems()[index].getCells()[6].setEnabled(false);
		// 		oInterventiTable.getItems()[index].getCells()[6].setValue(""); 

		// 		// Check for condition - If LPN selected then Interventi Date should not be equal to any of the existing Reperibilita Date
		// 		if (oEvent.getParameter("selectedItem").getText() === "LPN") {
		// 			data[index].FLAGNOTTURNO = true;
		// 			var Dtflag = false;
		// 			for (var j = 0; j < oRepDateModel.getData().length; ++j) {
		// 				if (oInterventiDateModel.getData()[index].DATAINTERVENTO === oRepDateModel.getData()[j].DATAREPERIBILITA) {
		// 					Dtflag = true;
		// 				}
		// 			}
		// 			if (Dtflag) {
		// 				this.resetInterventiValues(oInterventiTable, oInterventiDateModel, index);
		// 				oInterventiTable.getItems()[index].getCells()[2].setDateValue(null);
		// 				oInterventiTable.getItems()[index].getCells()[2].setValueState(sap.ui.core.ValueState.Error);
		// 				MessageBox.error("La data di Intervento selezionata non deve essere uguale a nessuna data di ripetibilità inserita");
		// 				return;
		// 			}else{
		// 				oInterventiTable.getItems()[index].getCells()[2].setValueState(sap.ui.core.ValueState.None);
		// 			}
		// 		} else {
		// 			data[index].FLAGNOTTURNO = false;
		// 		}
		// 		this.getView().byId("idTableInterventi").getModel("RepintInterventiModel").setProperty("/", data);
		// 		this.getView().byId("idTableInterventi").getModel("RepintInterventiModel").updateBindings(true);
		// 		this.handleInterDateLPNChange(oEvent);

		// 		this.filterRiposiSet(this.getView().byId("idTableInterventi"), oRepDateModel, oInterventiDateModel, index);
		// 	}
		// },

		//	Working on below code - KAPIL
		// onChiamatodaChange: function (oEvent) {
		// 	var data = this.getView().byId("idTableInterventi").getModel("RepintInterventiModel").getProperty("/");
		// 	var index = oEvent.getSource().getParent().getParent().indexOfItem(oEvent.getSource().getParent());
		// 	var oRepDateModel = this.getView().byId("idTableReperibilita").getModel("RepintReperibilitaModel");
		// 	var oInterventiDateModel = this.getView().byId("idTableInterventi").getModel("RepintInterventiModel");
		// 	var oInterventiTable = this.getView().byId("idTableInterventi");

		// 	data[index].CHIAMATODA = oEvent.getParameter("selectedItem").getText();

		// 	if (oEvent.getParameter("selectedItem").getText() === "Others") {
		// 		oInterventiTable.getItems()[index].getCells()[6].setEditable(true);
		// 		data[index].FLAGNOTTURNO = false;
		// 	} else {
		// 		oInterventiTable.getItems()[index].getCells()[6].setEditable(false);
		// 		oInterventiTable.getItems()[index].getCells()[6].setValue("");
		// 	}
		// 	// Check for condition - If LPN selected then Interventi Date should not be equal to any of the existing Reperibilita Date
		// 	if (oEvent.getParameter("selectedItem").getText() === "LPN") {
		// 		data[index].FLAGNOTTURNO = true;
		// 		var Dtflag = false;
		// 		for (var j = 0; j < oRepDateModel.getData().length; ++j) {
		// 			if (oInterventiDateModel.getData()[index].DATAINTERVENTO === oRepDateModel.getData()[j].DATAREPERIBILITA) {
		// 				Dtflag = true;
		// 			}
		// 		}
		// 		if (Dtflag) {
		// 			this.resetInterventiValues(oInterventiTable, oInterventiDateModel, index);
		// 			oInterventiTable.getItems()[index].getCells()[2].setDateValue(null);
		// 			oInterventiTable.getItems()[index].getCells()[2].setValueState(sap.ui.core.ValueState.Error);
		// 			MessageBox.error("La data di Intervento selezionata non deve essere uguale a nessuna data di ripetibilità inserita");
		// 			return;
		// 		} else {
		// 			oInterventiTable.getItems()[index].getCells()[2].setValueState(sap.ui.core.ValueState.None);
		// 		}
		// 	} else {
		// 		data[index].FLAGNOTTURNO = false;
		// 		this.handleInterDateLPNChange(oEvent);
		// 	}

		// 	this.getView().byId("idTableInterventi").getModel("RepintInterventiModel").setProperty("/", data);
		// 	this.getView().byId("idTableInterventi").getModel("RepintInterventiModel").updateBindings(true);
		// 	///////this.handleInterDateLPNChange(oEvent);

		// 	this.filterRiposiSet(this.getView().byId("idTableInterventi"), oRepDateModel, oInterventiDateModel, index);
		// //	}
		// },

		// onChiamatodaChange: function (oEvent) {

		// 	var data = this.getView().byId("idTableInterventi").getModel("RepintInterventiModel").getProperty("/");
		// 	var index = oEvent.getSource().getParent().getParent().indexOfItem(oEvent.getSource().getParent());
		// 	var oRepDateModel = this.getView().byId("idTableReperibilita").getModel("RepintReperibilitaModel");
		// 	var oInterventiDateModel = this.getView().byId("idTableInterventi").getModel("RepintInterventiModel");
		// 	var oInterventiTable = this.getView().byId("idTableInterventi");
		// 	data[index].CHIAMATODA = oEvent.getParameter("selectedItem").getText();
		// 		oInterventiTable.getItems()[index].getCells()[6].setEnabled(true); 
		// 	if (oEvent.getParameter("selectedItem").getText() === "Others") {
		// 		oInterventiTable.getItems()[index].getCells()[6].setValue("aaaa");
		// 		oInterventiTable.getItems()[index].getCells()[6].setEditable(false); 
		// 		oInterventiTable.getItems()[index].getCells()[6].setValue("bbbb");
		// 		data[index].FLAGNOTTURNO = false;
		// 	} else {
		// 		oInterventiTable.getItems()[index].getCells()[6].setEnabled(false);
		// 		oInterventiTable.getItems()[index].getCells()[6].setValue("");
		// 	}
		// 	// if (oEvent.getParameter("selectedItem").getText() == "LPN") {
		// 	// 	data[index].FLAGNOTTURNO = true;
		// 	// } else {
		// 	// 	data[index].FLAGNOTTURNO = false;
		// 	// }
		// 	// oInterventiDateModel.setProperty("/", data);
		// 	// oInterventiDateModel.refresh();
		// 	// oInterventiDateModel.updateBindings(true);
		// 	// this.handleInterDateLPNChange(oEvent);

		// 	// this.filterRiposiSet(this.getView().byId("idTableInterventi"), oRepDateModel, oInterventiDateModel, index);

		// },

		// Below latest deployed code
		// onChiamatodaChange: function (oEvent) {

		// 	var data = this.getView().byId("idTableInterventi").getModel("RepintInterventiModel").getProperty("/");
		// 	var index = oEvent.getSource().getParent().getParent().indexOfItem(oEvent.getSource().getParent());
		// 	var oRepDateModel = this.getView().byId("idTableReperibilita").getModel("RepintReperibilitaModel");
		// 	var oInterventiDateModel = this.getView().byId("idTableInterventi").getModel("RepintInterventiModel");
		// 	var oInterventiTable = this.getView().byId("idTableInterventi");

		// 	data[index].CHIAMATODA = oEvent.getParameter("selectedItem").getText();

		// 	if (oEvent.getParameter("selectedItem").getText() === "Others") {
		// 		oInterventiTable.getItems()[index].getCells()[6].setEditable(true);
		// 	} else {
		// 		oInterventiTable.getItems()[index].getCells()[6].setValue("");
		// 		oInterventiTable.getItems()[index].getCells()[6].setEditable(false);
		// 	}
		// 	oInterventiDateModel.updateBindings(true);

		// 	if (oEvent.getParameter("selectedItem").getText() === "LPN") {
		// 		data[index].FLAGNOTTURNO = true;
		// 	} else {
		// 		data[index].FLAGNOTTURNO = false;
		// 	}
		// 	oInterventiDateModel.setProperty("/", data);
		// 	oInterventiDateModel.updateBindings(true);
		// 	oInterventiDateModel.refresh();

		// 	this.handleInterDateLPNChange(oEvent);

		// 	this.filterRiposiSet(this.getView().byId("idTableInterventi"), oRepDateModel, oInterventiDateModel, index);
		// 	//}
		// },

		onChiamatodaChange: function (oEvent) {

			var data = this.getView().byId("idTableInterventi").getModel("RepintInterventiModel").getProperty("/");
			var index = oEvent.getSource().getParent().getParent().indexOfItem(oEvent.getSource().getParent());
			var oRepDateModel = this.getView().byId("idTableReperibilita").getModel("RepintReperibilitaModel");
			var oInterventiDateModel = this.getView().byId("idTableInterventi").getModel("RepintInterventiModel");
			var oInterventiTable = this.getView().byId("idTableInterventi");

			data[index].CHIAMATODA = oEvent.getParameter("selectedItem").getText();

			if (oEvent.getParameter("selectedItem").getText() == "Others") {
				// oInterventiTable.getItems()[index].getCells()[6].setEditable(true);
				// oInterventiTable.getItems()[index].getCells()[6].setEnabled(true);
				data[index].FLAGNOTTURNO = false;
			} else {
				oInterventiTable.getItems()[index].getCells()[6].setValue("");
				// oInterventiTable.getItems()[index].getCells()[6].setEditable(false);
				// oInterventiTable.getItems()[index].getCells()[6].setEnabled(false);			
				if (oEvent.getParameter("selectedItem").getText() == "LPN") {
					data[index].FLAGNOTTURNO = true;

				} else {
					data[index].FLAGNOTTURNO = false;
				}
				oInterventiDateModel.setProperty("/", data);
				oInterventiDateModel.updateBindings(true);
			}
			// if(this.handleInterDateLPNChange(oEvent)){
			// 		this.filterRiposiSet(this.getView().byId("idTableInterventi"), oRepDateModel, oInterventiDateModel, index);	
			// }		
			if (this.handleInterDateLPNChange(oEvent)) {
				////this.filterRiposiSet(this.getView().byId("idTableInterventi"), oRepDateModel, oInterventiDateModel, index);

				// Below condition added on 7th Dec 2020
				// On selection of Chaimatoda dropdown value initially if 'Interventi' date is not selected (blank) application use to show error message to user to that 'Interventi' date cannot be blank
				// But now the change is - Not to show error message on selection of Chaimatoda dropdown value
				// For any other field validation need to show message as usual
				// So passing 'true' while calling filterRiposiSet() on selection of 'Chiamatoda' dropdown value else passing 'false'
				this.filterRiposiSet(this.getView().byId("idTableInterventi"), oRepDateModel, oInterventiDateModel, index, true);
			}
		},

		onEnterChaimatodaFreeTxt: function (oEvent) {
			//var data = this.getView().byId("idTableInterventi").getModel("RepintInterventiModel").getProperty("/");
			var index = oEvent.getSource().getParent().getParent().indexOfItem(oEvent.getSource().getParent());
			//var oRepDateModel = this.getView().byId("idTableReperibilita").getModel("RepintReperibilitaModel");
			//var oInterventiDateModel = this.getView().byId("idTableInterventi").getModel("RepintInterventiModel");
			var oInterventiTable = this.getView().byId("idTableInterventi");

			if (oInterventiTable.getItems()[index].getCells()[5].getSelectedItem().getText() !== "Others") {
				oInterventiTable.getItems()[index].getCells()[6].setValue(null);
				// oInterventiTable.getItems()[index].getCells()[6].setEditable(true);
				// oInterventiTable.getItems()[index].getCells()[6].setEnabled(true);
			}
			//oInterventiTable.getItems()[index].getCells()[6].getValue()
		},

		onEnterCausa: function (oEvent) {
			var index = oEvent.getSource().getParent().getParent().indexOfItem(oEvent.getSource().getParent());
			var oRepDateModel = this.getView().byId("idTableReperibilita").getModel("RepintReperibilitaModel");
			var oInterventiDateModel = this.getView().byId("idTableInterventi").getModel("RepintInterventiModel");
			var data = oInterventiDateModel.getProperty("/");

			if (data.length > 0) { // No record
				this.filterRiposiSet(this.getView().byId("idTableInterventi"), oRepDateModel, oInterventiDateModel, index, false);
			}
		},

		validateData: function (oEmpdata, oReperibilitaModelData, oInterventiModelData) {
			var that = this;
			var validData = true;
			//var oReperibilitaModelData = that.getView().byId("idTableReperibilita").getModel("RepintReperibilitaModel").getProperty("/");
			//var oInterventiModelData = that.getView().byId("idTableInterventi").getModel("RepintInterventiModel").getProperty("/");
			//var oEmpdata = that.getView().getModel("RepintEmpdataModel").getData();

			// ************** Validate Employee Header data *************************

			if (that.getOwnerComponent().getModel("viewProperties").getProperty("/ANNOMESE") === "" || that.getOwnerComponent().getModel(
					"viewProperties").getProperty("/ANNOMESE") === null || that.getOwnerComponent().getModel("viewProperties").getProperty(
					"/ANNOMESE") === undefined) {
				that.getOwnerComponent().getModel("viewProperties").setProperty("/validData", false);
				MessageBox.error("Il campo Mese/Anno deve essere valorizzato");
				validData = false;
				return;
			}

			if ((oReperibilitaModelData === null || oReperibilitaModelData === undefined || oReperibilitaModelData === "") || (
					oInterventiModelData === null || oInterventiModelData === undefined || oInterventiModelData === "")) {
				that.getOwnerComponent().getModel("viewProperties").setProperty("/validData", false);
				validData = false;
				return;
			}

			// Below condition added on 21st Jan to fix bug:
			// After the user insert or change the Delegato and (re)send (when he receives back the form when rejected) and than send again the form to the Manager, the Manager doesn't receive the form (form ID :  167823)
			if ((that.getOwnerComponent().getModel("viewProperties").getProperty("/MATRICOLA_DEPUTY") === undefined || that.getOwnerComponent()
					.getModel("viewProperties").getProperty("/MATRICOLA_DEPUTY") === "") && (oEmpdata[0].MATRICOLA_RESP === "" || oEmpdata[0].MATRICOLA_RESP ==
					undefined)) {
				that.getOwnerComponent().getModel("viewProperties").setProperty("/validData", false);
				MessageBox.error("Resp. Servizio and Deputy Manager value both cannot be null");
				validData = false;
				return;
			}

			// ***************  Validate Reperibilita table data **********************
			// If below condition is true it implies no record exists for Reperibilita Table but record is valid. Here no Reperbilita record exists so no Interventi record would exists.
			// But here user might have changed Header data so will have to call Salva operation
			if ((oReperibilitaModelData.length === 1) && (oReperibilitaModelData[0].DATAREPERIBILITA === "" || oReperibilitaModelData[0].DATAREPERIBILITA ===
					null ||
					oReperibilitaModelData[0].DATAREPERIBILITA === undefined)) {
				that.getOwnerComponent().getModel("viewProperties").setProperty("/validData", true);
				that.getOwnerComponent().getModel("viewProperties").setProperty("/ReperibilitaStatus", false);
				//MessageBox.error("Non sono stati inserite giornate di reperibilità e interventi eseguiti o programmati");
				//validData = false;
				// Below code commentd on 14th Jan
				//return;
			} else {
				that.getOwnerComponent().getModel("viewProperties").setProperty("/ReperibilitaStatus", true);
				var oReperibilitaTable = this.getView().byId("idTableReperibilita");

				for (var i = 0; i < oReperibilitaModelData.length; ++i) {
					if (oReperibilitaModelData[i].DATAREPERIBILITA === "" || oReperibilitaModelData[i].DATAREPERIBILITA === null ||
						oReperibilitaModelData[i].DATAREPERIBILITA === undefined) {
						oReperibilitaTable.getItems()[i].getCells()[0].setValueState(sap.ui.core.ValueState.Error);
						that.getOwnerComponent().getModel("viewProperties").setProperty("/validData", false);
						//validData = false;
						MessageBox.error("La data della \"Reperibilità\" deve essere valorizzata");
						validData = false;
						return;
					} else {
						oReperibilitaTable.getItems()[i].getCells()[0].setValueState(sap.ui.core.ValueState.None);
					}
				}
			}

			// ***************  Validate Interventi table data **********************

			////var oSortedInterventiDateData = that.sortInterventiDateData(oInterventiDateModel);

			// Setting sorted Invertenti model to Interventi Table. Required in order to set 'ValueState' to Error at proper index of Interventi table
			// Sorted Model order should be same as record in Interventi table
			var oSortedInterventiDateDataModel = new sap.ui.model.json.JSONModel();
			var oInterventiDateModel = this.getView().byId("idTableInterventi").getModel("RepintInterventiModel");
			var oInterventiTable = this.getView().byId("idTableInterventi");
			var oSortedInterventiDateData = that.sortInterventiDateData(oInterventiDateModel);
			oSortedInterventiDateDataModel.setData(oSortedInterventiDateData);
			oInterventiTable.setModel(oSortedInterventiDateDataModel, "RepintInterventiModel");

			// If below condition is true it implies no record exists for Interventi Table so it is valid
			if ((oSortedInterventiDateData.length === 1) &&
				(oSortedInterventiDateData[0].DATAINTERVENTO === "" || oSortedInterventiDateData[0].DATAINTERVENTO === null ||
					oSortedInterventiDateData[0].DATAINTERVENTO === undefined) &&
				(oSortedInterventiDateData[0].ORAINIZIO === "" || oSortedInterventiDateData[0].ORAINIZIO === null || oSortedInterventiDateData[
						0]
					.ORAINIZIO ===
					undefined) &&
				(oSortedInterventiDateData[0].ORAFINE === "" || oSortedInterventiDateData[0].ORAFINE === null || oSortedInterventiDateData[0].ORAFINE ===
					undefined) &&
				(oSortedInterventiDateData[0].CHIAMATODA === "" || oSortedInterventiDateData[0].CHIAMATODA === null || oSortedInterventiDateData[
						0]
					.CHIAMATODA ===
					undefined) &&
				(oSortedInterventiDateData[0].CAUSA === "" || oSortedInterventiDateData[0].CAUSA === null || oSortedInterventiDateData[0].CAUSA ===
					undefined)
			) {
				that.getOwnerComponent().getModel("viewProperties").setProperty("/validData", true); // Implies no Interventi record exists so it is valid
				that.getOwnerComponent().getModel("viewProperties").setProperty("/InterventiStatus", false);
				///////that.getOwnerComponent().getModel("viewProperties").setProperty("/InterventiStatus", false);
			}
			// If below condition is true it implies that only 1 Interventi valid record exists
			else if ((oSortedInterventiDateData.length === 1) &&
				(oSortedInterventiDateData[0].DATAINTERVENTO !== "" && oSortedInterventiDateData[0].DATAINTERVENTO !== null &&
					oSortedInterventiDateData[0].DATAINTERVENTO !== undefined) && (oSortedInterventiDateData[0].ORAINIZIO !== "" &&
					oSortedInterventiDateData[0].ORAINIZIO !== null && oSortedInterventiDateData[0].ORAINIZIO !== undefined) && (
					oSortedInterventiDateData[0].ORAFINE !== "" && oSortedInterventiDateData[0].ORAFINE !== null && oSortedInterventiDateData[0].ORAFINE !==
					undefined)

			) {
				// Check if 'CHIAMATODA_ALTRO' value is blank if 'Chaimato da' value from dropdown is "Others". It should not be blank.
				if ((oSortedInterventiDateData[0].CHIAMATODA === "Others") && (oSortedInterventiDateData[0].CHIAMATODA_ALTRO === "" ||
						oSortedInterventiDateData[0].CHIAMATODA_ALTRO === undefined || oSortedInterventiDateData[0].CHIAMATODA_ALTRO === undefined)) {
					that.getOwnerComponent().getModel("viewProperties").setProperty("/validData", false);
					that.getOwnerComponent().getModel("viewProperties").setProperty("/InterventiStatus", false);
					MessageBox.error("Il campo \"Altro\" deve essere valorizzato quando si selzione in \"Chiamato da\" il valore \"Altro\"");
					validData = false;
					return;
				} else {
					that.getOwnerComponent().getModel("viewProperties").setProperty("/validData", true);
					that.getOwnerComponent().getModel("viewProperties").setProperty("/InterventiStatus", true);
					//validData = false;
					//return;
				}
			}

			if (that.getOwnerComponent().getModel("viewProperties").getProperty("/ReperibilitaStatus") &&
				(oSortedInterventiDateData.length === 1) &&
				(oSortedInterventiDateData[0].DATAINTERVENTO === "" || oSortedInterventiDateData[0].DATAINTERVENTO === null ||
					oSortedInterventiDateData[0].DATAINTERVENTO === undefined) &&
				(oSortedInterventiDateData[0].ORAINIZIO === "" || oSortedInterventiDateData[0].ORAINIZIO === null || oSortedInterventiDateData[
						0]
					.ORAINIZIO ===
					undefined) &&
				(oSortedInterventiDateData[0].ORAFINE === "" || oSortedInterventiDateData[0].ORAFINE === null || oSortedInterventiDateData[0].ORAFINE ===
					undefined) &&
				(oSortedInterventiDateData[0].CHIAMATODA === "" || oSortedInterventiDateData[0].CHIAMATODA === null || oSortedInterventiDateData[
						0]
					.CHIAMATODA ===
					undefined) &&
				(oSortedInterventiDateData[0].CAUSA === "" || oSortedInterventiDateData[0].CAUSA === null || oSortedInterventiDateData[0].CAUSA ===
					undefined)
			) {
				that.getOwnerComponent().getModel("viewProperties").setProperty("/validData", true); // Implies no Interventi record exists so it is valid
				that.getOwnerComponent().getModel("viewProperties").setProperty("/InterventiStatus", false);
				///////that.getOwnerComponent().getModel("viewProperties").setProperty("/InterventiStatus", false);
			} else {
				if (that.getOwnerComponent().getModel("viewProperties").getProperty("/ReperibilitaStatus") &&
					(oSortedInterventiDateData.length === 1) &&
					(oSortedInterventiDateData[0].DATAINTERVENTO === "" || oSortedInterventiDateData[0].DATAINTERVENTO === null ||
						oSortedInterventiDateData[0].DATAINTERVENTO === undefined)
				) {
					that.getOwnerComponent().getModel("viewProperties").setProperty("/validData", false);
					MessageBox.error("Nella sezione Interventi valorizzata il campo data");
					validData = false;
					return;
				} else if (that.getOwnerComponent().getModel("viewProperties").getProperty("/ReperibilitaStatus") &&
					(oSortedInterventiDateData.length === 1) &&
					(oSortedInterventiDateData[0].ORAINIZIO === "" || oSortedInterventiDateData[0].ORAINIZIO === null || oSortedInterventiDateData[0]
						.ORAINIZIO ===
						undefined)
				) {
					that.getOwnerComponent().getModel("viewProperties").setProperty("/validData", false);
					MessageBox.error("Il campo Ora Inizio deve essere valorizzato");
					validData = false;
					return;
				} else if (that.getOwnerComponent().getModel("viewProperties").getProperty("/ReperibilitaStatus") &&
					(oSortedInterventiDateData.length === 1) &&
					(oSortedInterventiDateData[0].ORAFINE === "" || oSortedInterventiDateData[0].ORAFINE === null || oSortedInterventiDateData[0].ORAFINE ===
						undefined)

				) {
					that.getOwnerComponent().getModel("viewProperties").setProperty("/validData", false);
					MessageBox.error("Il campo \"Ora Fine\" non può essere lasciato vuoto");
					validData = false;
					return;
				} else if (that.getOwnerComponent().getModel("viewProperties").getProperty("/ReperibilitaStatus") &&
					(oSortedInterventiDateData.length === 1) &&
					(oSortedInterventiDateData[0].CHIAMATODA === "" || oSortedInterventiDateData[0].CHIAMATODA === null || oSortedInterventiDateData[
							0]
						.CHIAMATODA ===
						undefined)

				) {
					that.getOwnerComponent().getModel("viewProperties").setProperty("/validData", false);
					MessageBox.error("Il campo \"Chiamato da\" deve essere valorizzato");
					validData = false;
					return;
				} else if (that.getOwnerComponent().getModel("viewProperties").getProperty("/ReperibilitaStatus") &&
					(oSortedInterventiDateData.length === 1) && (oSortedInterventiDateData[0].CHIAMATODA === "Others")) {
					if (oSortedInterventiDateData[0].CHIAMATODA_ALTRO === "" || oSortedInterventiDateData[0].CHIAMATODA_ALTRO === undefined ||
						oSortedInterventiDateData[0].CHIAMATODA_ALTRO === undefined) {
						that.getOwnerComponent().getModel("viewProperties").setProperty("/validData", false);
						MessageBox.error("Il campo \"Altro\" deve essere valorizzato quando si selzione in \"Chiamato da\" il valore \"Altro\"");
						validData = false;
						return;
					}
				} else if (that.getOwnerComponent().getModel("viewProperties").getProperty("/ReperibilitaStatus") &&
					(oSortedInterventiDateData.length === 1) &&
					(oSortedInterventiDateData[0].CAUSA === "" || oSortedInterventiDateData[0].CAUSA === null || oSortedInterventiDateData[0].CAUSA ===
						undefined)

				) {
					that.getOwnerComponent().getModel("viewProperties").setProperty("/validData", false);
					MessageBox.error("Il campo \"Causa\" deve essere valorizzato");
					validData = false;
					return;
				}
			}
			///else if ((oSortedInterventiDateData.length === 1) &&

			// Commented on 15th Jan
			//else {

			if (oSortedInterventiDateData.length > 1) {
				that.getOwnerComponent().getModel("viewProperties").setProperty("/InterventiStatus", true);

				// Check if any of the Interventi data is blank/null/undefined
				for (var checknull = 0; checknull < oSortedInterventiDateData.length; ++checknull) {
					if ((oSortedInterventiDateData[checknull].DATAINTERVENTO === null) || (oSortedInterventiDateData[checknull].DATAINTERVENTO ===
							"") ||
						(oSortedInterventiDateData[checknull].DATAINTERVENTO === undefined)) {
						oInterventiTable.getItems()[checknull].getCells()[2].setValueState(sap.ui.core.ValueState.Error);
						that.getOwnerComponent().getModel("viewProperties").setProperty("/validData", false);
						MessageBox.error("Nella sezione Interventi valorizzata il campo data");
						validData = false;
						return;
					} else {
						oInterventiTable.getItems()[checknull].getCells()[2].setValueState(sap.ui.core.ValueState.None);
					}
					if ((oSortedInterventiDateData[checknull].ORAINIZIO === null) || (oSortedInterventiDateData[checknull].ORAINIZIO === "") ||
						(
							oSortedInterventiDateData[checknull].ORAINIZIO === undefined)) {
						oInterventiTable.getItems()[checknull].getCells()[3].setValueState(sap.ui.core.ValueState.Error);
						that.getOwnerComponent().getModel("viewProperties").setProperty("/validData", false);
						//validData = false;
						MessageBox.error("Il campo Ora Inizio deve essere valorizzato");
						validData = false;
						return;
					} else {
						oInterventiTable.getItems()[checknull].getCells()[3].setValueState(sap.ui.core.ValueState.None);
					}
					if ((oSortedInterventiDateData[checknull].ORAFINE === null) || (oSortedInterventiDateData[checknull].ORAFINE === "") ||
						(
							oSortedInterventiDateData[checknull].ORAFINE === undefined)) {
						oInterventiTable.getItems()[checknull].getCells()[4].setValueState(sap.ui.core.ValueState.Error);
						that.getOwnerComponent().getModel("viewProperties").setProperty("/validData", false);
						//validData = false;
						MessageBox.error("Il campo \"Ora Fine\" non può essere lasciato vuoto");
						validData = false;
						return;
					} else {
						oInterventiTable.getItems()[checknull].getCells()[4].setValueState(sap.ui.core.ValueState.None);
					}
					if ((oSortedInterventiDateData[checknull].CHIAMATODA === null) || (oSortedInterventiDateData[checknull].CHIAMATODA === "") ||
						(
							oSortedInterventiDateData[checknull].CHIAMATODA === undefined)) {
						oInterventiTable.getItems()[checknull].getCells()[5].setValueState(sap.ui.core.ValueState.Error);
						that.getOwnerComponent().getModel("viewProperties").setProperty("/validData", false);
						//validData = false;
						MessageBox.error("Il campo \"Chiamato da\" deve essere valorizzato");
						validData = false;
						return;
					} else {
						oInterventiTable.getItems()[checknull].getCells()[5].setValueState(sap.ui.core.ValueState.None);
					}
					if (oSortedInterventiDateData[checknull].CHIAMATODA === "Others") {
						if (oSortedInterventiDateData[checknull].CHIAMATODA_ALTRO === "" || oSortedInterventiDateData[checknull].CHIAMATODA_ALTRO ===
							undefined ||
							oSortedInterventiDateData[checknull].CHIAMATODA_ALTRO === undefined) {
							oInterventiTable.getItems()[checknull].getCells()[6].setValueState(sap.ui.core.ValueState.Error);
							that.getOwnerComponent().getModel("viewProperties").setProperty("/validData", false);
							MessageBox.error("Il campo \"Altro\" deve essere valorizzato quando si selzione in \"Chiamato da\" il valore \"Altro\"");
							validData = false;
							return;
						}
					} else {
						oInterventiTable.getItems()[checknull].getCells()[6].setValueState(sap.ui.core.ValueState.None);
					}
					if ((oSortedInterventiDateData[checknull].CAUSA === null) || (oSortedInterventiDateData[checknull].CAUSA === "") ||
						(
							oSortedInterventiDateData[checknull].CAUSA === undefined)) {
						oInterventiTable.getItems()[checknull].getCells()[8].setValueState(sap.ui.core.ValueState.Error);
						that.getOwnerComponent().getModel("viewProperties").setProperty("/validData", false);
						//validData = false;
						MessageBox.error("Il campo \"Causa\" deve essere valorizzato");
						validData = false;
						return;
					} else {
						oInterventiTable.getItems()[checknull].getCells()[8].setValueState(sap.ui.core.ValueState.None);
					}
					if (oSortedInterventiDateData[checknull].ORAINIZIOTIMESTAMP === "" || oSortedInterventiDateData[checknull].ORAINIZIOTIMESTAMP ===
						undefined || oSortedInterventiDateData[checknull].ORAINIZIOTIMESTAMP === null) {
						oInterventiTable.getItems()[checknull].getCells()[3].setValueState(sap.ui.core.ValueState.Error);
						oInterventiTable.getItems()[checknull].getCells()[4].setValueState(sap.ui.core.ValueState.Error);
						MessageBox.error("For Interventi Date " + oSortedInterventiDateData[checknull].DATAINTERVENTO +
							" Ora Inizio and Ora Fine value cannot be blank");
						that.getOwnerComponent().getModel("viewProperties").setProperty("/validData", false);
						validData = false;
						return;
					} else {
						oInterventiTable.getItems()[checknull].getCells()[3].setValueState(sap.ui.core.ValueState.None);
						oInterventiTable.getItems()[checknull].getCells()[4].setValueState(sap.ui.core.ValueState.None);
					}

					if (oSortedInterventiDateData[checknull].ORAFINETIMESTAMP === "" || oSortedInterventiDateData[checknull].ORAFINETIMESTAMP ===
						undefined ||
						oSortedInterventiDateData[checknull].ORAFINETIMESTAMP === null) {
						oInterventiTable.getItems()[checknull].getCells()[3].setValueState(sap.ui.core.ValueState.Error);
						oInterventiTable.getItems()[checknull].getCells()[4].setValueState(sap.ui.core.ValueState.Error);
						that.getOwnerComponent().getModel("viewProperties").setProperty("/validData", false);
						MessageBox.error("For Interventi Date " + oSortedInterventiDateData.getData()[checknull].DATAINTERVENTO +
							" Ora Inizio and Ora Fine value cannot be blank");
						validData = false;
						return;
					} else {
						oInterventiTable.getItems()[checknull].getCells()[3].setValueState(sap.ui.core.ValueState.None);
						oInterventiTable.getItems()[checknull].getCells()[4].setValueState(sap.ui.core.ValueState.None);
					}
				}
			}

			// Commented on 15th Jan
			//	}

			that.getOwnerComponent().getModel("viewProperties").setProperty("/validData", validData);
		},

		// Calling handleCreateAfterSubmit() for DeepInsert again so as to update CONTINTERVENTO, FLAGCONT, STESSACAUSALE, TOTALE_GIORNI_RIPOSI_COMPENSATIVI, INTERVENTI_DETTAGLIO value 
		// after getting IDINTERVENTO Ids in first handleCreate() function call 
		// Below function may or may not get called based on Interventi Records
		handleCreateAfterSubmit: function (oSortedInterventiModelData) {

			//var oSortedInterventiModelData = oInterventiDateModel.getData();

			var that = this;

			that.getLPNReperSet();

			var oReperibilitaModelData = that.getView().byId("idTableReperibilita").getModel("RepintReperibilitaModel").getProperty("/");
			var oInterventiModelData = that.getView().byId("idTableInterventi").getModel("RepintInterventiModel").getProperty("/");
			var oInterventiDateModel = that.getView().byId("idTableInterventi").getModel("RepintInterventiModel");
			//var oSortedInterventiModelData = that.getView().byId("idTableInterventi").getModel("RepintInterventiModel").getData();
			var datearr = [];

			var oEmpdata = that.getView().getModel("RepintEmpdataModel").getData();

			//that.validateData(oEmpdata, oReperibilitaModelData, oInterventiModelData);

			//if (that.getOwnerComponent().getModel("viewProperties").getProperty("/validData")) { // Validation Success

			////var uniqueinterventDates = $.unique(oInterventiDateModel.getData().map(function (value) {
			var uniqueinterventDates = $.unique(oSortedInterventiModelData.map(function (value) {
				return value.DATAINTERVENTO;
			})); // Get Unique Interventi Dates

			var oChild1Json = [];
			var oChild1JsonData = {};
			var oChild2Json = [];
			var oChild2JsonData = {};

			if (that.getOwnerComponent().getModel("viewProperties").getProperty("/ReperibilitaStatus")) { // Implies at least one Reperibilita record exists
				for (var i = 0; i < oReperibilitaModelData.length; ++i) {

					if (oReperibilitaModelData[i].Dom === true) {
						oReperibilitaModelData[i].TIPOGIORNO = "F";
					} else if (oReperibilitaModelData[i].Sab === true) {
						oReperibilitaModelData[i].TIPOGIORNO = "S";
					} else {
						oReperibilitaModelData[i].TIPOGIORNO = "L";
					}
					datearr = [];
					datearr = oReperibilitaModelData[i].DATAREPERIBILITA.split("-");
					////////oReperibilitaModelData[i].DATAREPERIBILITA = datearr[2] + "-" + datearr[1] + "-" + datearr[0] + "T00:00:00";

					oChild1JsonData = {
						"IDSCHEDA": oReperibilitaModelData[i].IDSCHEDA,
						"IDREPERIBILITA": oReperibilitaModelData[i].IDREPERIBILITA,
						"DATAREPERIBILITA": datearr[2] + "-" + datearr[1] + "-" + datearr[0] + "T00:00:00",
						"TIPOGIORNO": oReperibilitaModelData[i].TIPOGIORNO
					};
					oChild1Json.push(oChild1JsonData);
					oChild1JsonData = {};
				}
			} else { // Implies no Reperibilita record exists
				oChild1Json = [];
			}

			if (that.getOwnerComponent().getModel("viewProperties").getProperty("/InterventiStatus")) { // Implies at least one Interventi record exists
				datearr = []; // Reset date

				var utcOraInizioTimeStamp;
				var utcOraFineTimeStamp;
				for (var j = 0; j < oInterventiModelData.length; ++j) {
					datearr = [];
					datearr = oInterventiModelData[j].DATAINTERVENTO.split("-");

					// if (oInterventiModelData[j].FLAGNOTTURNO) {
					// 	oInterventiModelData[j].FLAGNOTTURNO = 1;
					// } else {
					// 	oInterventiModelData[j].FLAGNOTTURNO = 0;
					// }

					// utcOraInizioTimeStamp = new Date(oInterventiModelData[j].ORAINIZIOTIMESTAMP.getTime() + oInterventiModelData[j].ORAINIZIOTIMESTAMP.getTimezoneOffset() * 60000);
					// utcOraFineTimeStamp = new Date(oInterventiModelData[j].ORAFINETIMESTAMP.getTime() + oInterventiModelData[j].ORAFINETIMESTAMP.getTimezoneOffset() * 60000);
					utcOraInizioTimeStamp = oInterventiModelData[j].ORAINIZIOTIMESTAMP.toUTCString();
					utcOraFineTimeStamp = oInterventiModelData[j].ORAFINETIMESTAMP.toUTCString();

					oChild2JsonData = {
						"IDINTERVENTO": oInterventiModelData[j].IDINTERVENTO,
						"DATAINTERVENTO": datearr[2] + "-" + datearr[1] + "-" + datearr[0] + "T00:00:00",
						"ORAINIZIO": oInterventiModelData[j].ORAINIZIO,
						"ORAFINE": oInterventiModelData[j].ORAFINE,
						"CHIAMATODA": (oInterventiModelData[j].CHIAMATODA === undefined) ? "" : oInterventiModelData[j].CHIAMATODA,
						"CAUSA": (oInterventiModelData[j].CAUSA === null || oInterventiModelData[j].CAUSA === undefined) ? "" : oInterventiModelData[
								j]
							.CAUSA,
						"FASCIA": parseInt(oInterventiModelData[j].FASCIA),
						"IDSCHEDA": oInterventiModelData[j].IDSCHEDA,
						"STESSACAUSALE": oInterventiModelData[j].STESSACAUSALE,
						"CONTINTERVENTO": (oInterventiModelData[j].CONTINTERVENTO === "" || oInterventiModelData[j].CONTINTERVENTO === null) ? 0 : (
							oInterventiModelData[j].CONTINTERVENTO),
						"FLAGNOTTURNO": (oInterventiModelData[j].FLAGNOTTURNO) ? 1 : 0, // LPN Checkbox value
						//"FLAGNOTTURNO": (oInterventiModelData[j].FLAGNOTTURNO === 0) ? false : true, // LPN Checkbox value
						"FLAGCONT": (oInterventiModelData[j].FLAGCONT) ? 1 : 0, // RIP Checkbox value
						// "ORAFINETIMESTAMP": Formatter.formatUTCDate(oInterventiModelData[j].ORAFINETIMESTAMP) + ":00",
						// "ORAINIZIOTIMESTAMP": Formatter.formatUTCDate(oInterventiModelData[j].ORAINIZIOTIMESTAMP) + ":00",
						"ORAFINETIMESTAMP": Formatter.formatUTCDate(utcOraFineTimeStamp),
						"ORAINIZIOTIMESTAMP": Formatter.formatUTCDate(utcOraInizioTimeStamp),
						"WORKINGDAY": (oInterventiModelData[j].WORKINGDAY) ? 1 : 0,
						"NONWORKINGDAY": (oInterventiModelData[j].NONWORKINGDAY) ? 1 : 0,
						"CHECKOK": oInterventiModelData[j].CHECKOK,
						"RIPOSI": oInterventiModelData[j].RIPOSI,
						"CHIAMATODA_ALTRO": (oInterventiModelData[j].CHIAMATODA_ALTRO === undefined || oInterventiModelData[j].CHIAMATODA_ALTRO ===
							null || oInterventiModelData[j].CHIAMATODA_ALTRO === "") ? "" : oInterventiModelData[j].CHIAMATODA_ALTRO,
						"RIPOSI_HH": (oInterventiModelData[j].RIPOSI === "") ? 0 : parseInt(oInterventiModelData[j].RIPOSI.substr(0, (
							oInterventiModelData[j].RIPOSI.indexOf("H")))),
						"DURATA": parseInt(oInterventiModelData[j].MINDIFFORAINIFINE), // DURATA is same as MINDIFFORAINIFINE as "MINDIFFORAINIFINE" is added later
						"MINDIFFORAINIFINE": parseInt(oInterventiModelData[j].MINDIFFORAINIFINE),
						//"TOTALE_GIORNI_RIPOSI_COMPENSATIVI": oInterventiModelData[j].TOTALE_GIORNI_RIPOSI_COMPENSATIVI
						"TOTALE_GIORNI_RIPOSI_COMPENSATIVI": oInterventiModelData[j].TOTALE_GIORNI_RIPOSI_COMPENSATIVI,
						"INTERVENTI_DETTAGLIO": oInterventiModelData[j].INTERVENTI_DETTAGLIO
					};
					oChild2Json.push(oChild2JsonData);
					oChild2JsonData = {};
				}
			} else {
				oChild2Json = [];
			}

			var Header = {};
			datearr = []; // Reset date

			// Below condition added on 21st Jan to fix bug:
			// After the user insert or change the Delegato and (re)send (when he receives back the form when rejected) and than send again the form to the Manager, the Manager doesn't receive the form (form ID :  167823)
			if ((that.getOwnerComponent().getModel("viewProperties").getProperty("/MATRICOLA_DEPUTY") === undefined || that.getOwnerComponent()
					.getModel("viewProperties").getProperty("/MATRICOLA_DEPUTY") === "") && oEmpdata[0].MATRICOLA_RESP !==
				"") {
				//matricolaRespVal = oEmpdata[0].MATRICOLA_RESP;
				oEmpdata[0].MATRICOLA_DEPUTY = "";
			} else {
				//oEmpdata[0].MATRICOLA_RESP = "";
				oEmpdata[0].MATRICOLA_DEPUTY = that.getOwnerComponent().getModel("viewProperties").getProperty("/MATRICOLA_DEPUTY");
				//matricolaRespVal = 
			}

			// var now = new Date();
			// var utcCreationDt = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
			var utcCreationDt = (new Date()).toUTCString(); // Current date and time

			// Below condition added on 7th Dec 2020
			var STATO;
			if (that.invioBozzaFlag && (!that.invioFlag)) {
				STATO = 0;
			} else if (that.invioFlag && (!that.invioBozzaFlag)) {
				STATO = 100;
			}

			Header = {

				"IDSCHEDA": that.getOwnerComponent().getModel("viewProperties").getProperty("/IDSCHEDA"),
				"ANNOMESE": that.getOwnerComponent().getModel("viewProperties").getProperty("/ANNOMESE").split("-")[0] + "-" + that.getOwnerComponent()
					.getModel("viewProperties").getProperty("/ANNOMESE").split("-")[1] + "-01",
				//"STATO": 100, // Submit for approval
				"STATO": STATO,
				"DATACREAZIONE": Formatter.formatUTCDate(utcCreationDt),
				"ID": oEmpdata[0].ID,
				"MATRICOLA": oEmpdata[0].MATRICOLA,
				"COGNOME": oEmpdata[0].COGNOME,
				"NOME": oEmpdata[0].NOME,
				"CDC": oEmpdata[0].CDC,
				"EMAIL": oEmpdata[0].EMAIL,
				"STABILIMENTO_ATTUALE": oEmpdata[0].STABILIMENTO_ATTUALE,
				"LIVELLO": oEmpdata[0].LIVELLO,
				"MATRICOLA_RESP": oEmpdata[0].MATRICOLA_RESP,
				"MATRICOLA_DEPUTY": oEmpdata[0].MATRICOLA_DEPUTY,
				"UNITAORGANIZZATIVA": oEmpdata[0].UNITAORGANIZZATIVA,
				"DEPARTMENT": oEmpdata[0].DEPARTMENT,
				"ManagerFirstName": oEmpdata[0].ManagerFirstName,
				"ManagerLastName": oEmpdata[0].ManagerLastName,

				"Child1": oChild1Json,
				"Child2": oChild2Json
			};

			var sPayload = {
				"Object": {
					"Header": Header
				}
			};

			console.log("********** handleCreateAfterSubmit *********");
			console.log("PAYLOAD AFTER SUBMIT");
			console.log(sPayload);

			// ********************************** Below Kapil Code. Alternative code to Jay code
			this.sServiceUrl = this.getOwnerComponent().getModel().sServiceUrl;

			$.ajax({
				url: this.sServiceUrl + "/",
				type: "GET",
				beforeSend: function (xhr) {
					xhr.setRequestHeader("X-CSRF-Token", "Fetch"); //Passing CSRF token fetch request in header of GET 
				},
				success: function (data, textStatus, XMLHttpRequest) {
					var token = XMLHttpRequest.getResponseHeader('X-CSRF-Token');
					$.ajax({
						url: "/HANAMDC/REPINT/RepintEmployee/xsjs/DeepInsert.xsjs",
						type: "POST",
						contentType: 'application/json',
						data: JSON.stringify(sPayload),
						//dataType: 'jsonp',
						beforeSend: function (xhr) {
							xhr.setRequestHeader("X-CSRF-Token", token); //Passing actual CSRF token we got from previous GET request
						},
						success: function (data1, textStatus1, XMLHttpRequest1) {
							console.log("*********** SUCCESS HANDLE CREATE AFTER SUBMIT ******************");
							// MessageBox.success(
							// 	"Scheda inviata in approvazione"
							// );
							console.log(data1);
							console.log(textStatus1);

							// that.getView().byId("idApprovazione1").setText(sap.ui.core.format.DateFormat.getDateTimeInstance({
							// 	pattern: "yyyy-MM-dd HH:MM"
							// }).format(new Date(), true));

							// Below logic to enable/disable "Delete" button from both Reperibilita and Interventi tables
							// var oReperibilitaModelData1 = that.getView().byId("idTableReperibilita").getModel("RepintReperibilitaModel");
							// var oInterventiModelData1 = that.getView().byId("idTableInterventi").getModel("RepintInterventiModel");
							// if ((oReperibilitaModelData1.getProperty("/").length === 1) && (oReperibilitaModelData1.getProperty(
							// 		"/0/DATAREPERIBILITA") !== "") && (oReperibilitaModelData1.getProperty("/0/DATAREPERIBILITA") !== null) && (
							// 		oReperibilitaModelData1.getProperty("/0/DATAREPERIBILITA") != undefined)) {
							// 	oReperibilitaModelData1.setProperty("/0/oButton2", true);
							// }
							// if ((oInterventiModelData1.getProperty("/").length === 1) && (oInterventiModelData1.getProperty("/0/DATAINTERVENTO") !==
							// 		"") && (oInterventiModelData1.getProperty("/0/DATAINTERVENTO") !== null) && (oInterventiModelData1.getProperty(
							// 		"/0/DATAINTERVENTO") != undefined)) {
							// 	oInterventiModelData1.setProperty("/0/oButton2", true);
							// }
							// that.getOwnerComponent().getModel("viewProperties").setProperty("/IDSCHEDA", parseInt(data1.data[1].substr((data1.data[1]
							// 	.indexOf(":") + 2))));

							//////that.getExpandData("success");
						},
						error: function (data1, textStatus1, XMLHttpRequest1) {
							console.log("Error in DeepInsert");
							MessageBox.error(
								"Errore nell'invio della scheda. Contatta l'amministratore");
							jQuery.sap.log.getLogger().error(
								"Error while perfoming Invio operation in handleCreateAfterSubmit(). Please contact administrator." + textStatus1.toString()
							);
							console.log(textStatus1);

						}
					});
				}
			});

			//	}

			/// ---------------------------------------------------------------------------------------------------------------

			// for (var i = 0; i < oReperibilitaModelData.length; ++i) {
			// 	if (oReperibilitaModelData[i].Dom === true) {
			// 		oReperibilitaModelData[i].TIPOGIORNO = "F";
			// 	} else if (oReperibilitaModelData[i].Sab === true) {
			// 		oReperibilitaModelData[i].TIPOGIORNO = "S";
			// 	} else {
			// 		oReperibilitaModelData[i].TIPOGIORNO = "L";
			// 	}

			// 	datearr = oReperibilitaModelData[i].DATAREPERIBILITA.split("-");
			// 	oReperibilitaModelData[i].DATAREPERIBILITA = datearr[2] + "-" + datearr[1] + "-" + datearr[0] + "T00:00:00";
			// }

			//...............................................................................................................................
			// 		var header_xcsrf_token = "";
			// 		OData.request({
			// 			requestUri: this.sServiceUrl + "/",
			// 			method: "GET",
			// 			async: false,
			// 			headers: {
			// 				"X-Requested-With": "XMLHttpRequest",
			// 				"Content-Type": "application/atom+xml",
			// 				"DataServiceVersion": "2.0",
			// 				"X-CSRF-Token": "Fetch"
			// 			}
			// 		}, function (data, response) {
			// 			header_xcsrf_token = response.headers['x-csrf-token'];
			// 		});

			// 		var sUrl = "/HANAMDC/REPINT/RepintEmployee/xsjs/DeepInsert.xsjs";
			// 		$.ajax({
			// 				url: sUrl,
			// 				async: false,
			// 				TYPE: "POST",
			// 				data: JSON.stringify(sPayload),
			// 				headers: {
			// 					"X-CSRF-Token": header_xcsrf_token
			// 				},
			// 				method: "POST",
			// 			    dataType: "json",
			// 				success: function (data) {
			// 				alert("hi");
			// 				},
			// 				error: function (err) {
			// alert("hello");
			// 				}
			// 			});

			// ********************************** Below Kapil Code. Alternative code to Jay code
			// $.ajax({
			// 	url: "/XSHANA_SSO/ccep/stargate/xs/dataplatform/archiveDPRows.xsjs",  
			// 	type: "GET",
			// 	beforeSend: function(xhr) {
			// 		xhr.setRequestHeader("X-CSRF-Token", "Fetch"); //Passing CSRF token fetch request in header of GET 
			// 	},
			// 	success: function(data, textStatus, XMLHttpRequest) {
			// 		var token = XMLHttpRequest.getResponseHeader('X-CSRF-Token');
			// 		$.ajax({
			// 			url: "/HANAMDC/REPINT/RepintEmployee/xsjs/DeepInsert.xsjs", 
			// 			type: "POST",
			// 			contentType: 'application/json',
			// 			data: JSON.stringify(del_row_data),
			// 			//dataType: 'jsonp',
			// 			beforeSend: function(xhr) {
			// 				xhr.setRequestHeader("X-CSRF-Token", token); //Passing actual CSRF token we got from previous GET request
			// 			},
			// 			success: function(data, textStatus, XMLHttpRequest) { //After SKU entry is uploaded in to table fetch it again and re-bind the table in UI
			// 				sap.ui.getCore().byId("dpApp").getParent().getController().onSearch();  

			// 				var msg = "Selected rows archived successfully !!";
			// 				messageToast.show(msg);
			// 			},
			// 			error: function(data, textStatus, XMLHttpRequest) {
			// 				var msg = "Failed to delete rows.";
			// 				messageToast.show(msg);
			// 			}
			// 		});
			// 	}
			// });				

		},

		getLPNReperSet: function () {
			var that = this;
			var xsoBaseModel = that.getOwnerComponent().getModel("basexsoModel");
			var repintRepInventModel = that.getView().byId("idTableInterventi").getModel("RepintInterventiModel");
			var TOTALE_IMPORTI_REPERIBILITA = 0;
			var TOTALE_GIORNI_REPERIBILITA = 0;
			var TOTALE_LPN = 0;
			var LPNFlag = false;
			var REPERFlag = false;
			that.INTERFlag = false;

			xsoBaseModel.attachRequestSent(function () {
				that._busyDialog.open();
			});
			xsoBaseModel.attachRequestCompleted(function () {
				if (LPNFlag && REPERFlag && that.INTERFlag) {

					var header = {
						"IDSCHEDA": idScheda,
						"TOTALE_GIORNI_RIPOSI_COMPENSATIVI": that.getOwnerComponent().getModel("viewProperties").getProperty(
							"/TOTALE_GIORNI_RIPOSI_COMPENSATIVI"),
						"TOTALE_LPN": TOTALE_LPN,
						"TOTALE_IMPORTI_REPERIBILITA": TOTALE_IMPORTI_REPERIBILITA,
						"TOTALE_IMPORTI_INTERVENTO": that.getOwnerComponent().getModel("viewProperties").getProperty(
							"/TOTALE_IMPORTI_INTERVENTO"),
						"TOTALE_GIORNI_REPERIBILITA": TOTALE_GIORNI_REPERIBILITA
					};

					var payload = {
						"Object": {
							"Header": header
						}
					};

					console.log("TOTALE REPORT - Payload");
					console.log(payload);
					// https://italybfmyao56da.hana.ondemand.com/REPINT/RepintEmployee/xsjs/insertSchedeRieplogo.xsjs 

					var sServiceUrl = that.getOwnerComponent().getModel().sServiceUrl;
					$.ajax({
						url: sServiceUrl + "/",
						type: "GET",
						beforeSend: function (xhr) {
							xhr.setRequestHeader("X-CSRF-Token", "Fetch"); //Passing CSRF token fetch request in header of GET 
						},
						success: function (data, textStatus, XMLHttpRequest) {
							var token = XMLHttpRequest.getResponseHeader('X-CSRF-Token');
							$.ajax({
								url: "/HANAMDC/REPINT/RepintEmployee/xsjs/insertSchedeRieplogo.xsjs",
								type: "POST",
								contentType: 'application/json',
								data: JSON.stringify(payload),
								//dataType: 'jsonp',
								beforeSend: function (xhr) {
									xhr.setRequestHeader("X-CSRF-Token", token); //Passing actual CSRF token we got from previous GET request
								},
								success: function (data1, textStatus1, XMLHttpRequest1) {
									console.log("*********** getLPNReperSet SUCCESS ******************");
									LPNFlag = false;
									REPERFlag = false;
									that.INTERFlag = false;
								},
								error: function (data1, textStatus1, XMLHttpRequest1) {
									console.log("Error in getLPNReperSet");
									MessageBox.error("Errore nell'invio della scheda. Contatta l'amministratore");
									jQuery.sap.log.getLogger().error(
										"Error while perfoming Invio operation in getLPNReperSet() function. Please contact administrator." + textStatus1.toString()
									);
								}
							});
						}
					});

				}
				that._busyDialog.close();
			});

			var idScheda = that.getOwnerComponent().getModel("viewProperties").getProperty("/IDSCHEDA");

			var oFilters = [];
			var filter11 = new sap.ui.model.Filter("IDSCHEDA", sap.ui.model.FilterOperator.EQ, idScheda);
			oFilters.push(filter11);

			// Getting LPNSET data to calculate LPN value
			var repintLPNSETModel = new sap.ui.model.json.JSONModel();
			var oRepintLPNSETJson = [];
			var oRepintLPNSETJsonData = {};
			var TOTALE_IMPORTI_INTERVENTO = 0;

			xsoBaseModel.read("/LPNSET", {
				filters: oFilters,
				success: function (oDataIn, oResponse) {
					for (var i = 0; i < oDataIn.results.length; ++i) {
						oRepintLPNSETJsonData = {
							"IDSCHEDA": oDataIn.results[i].IDSCHEDA,
							"LIVELLO": oDataIn.results[i].LIVELLO,
							"DATAINTERVENTO": Formatter.formatDate(oDataIn.results[i].DATAINTERVENTO),
							"CC_DIFFERENCE": oDataIn.results[i].CC_DIFFERENCE,
							"VALORE": oDataIn.results[i].VALORE
						};
						TOTALE_LPN = TOTALE_LPN + parseInt(oDataIn.results[i].VALORE);

						oRepintLPNSETJson.push(oRepintLPNSETJsonData);
						oRepintLPNSETJsonData = {};
					}
					console.log("LPNSET");
					console.log(oRepintLPNSETJson);
					repintLPNSETModel.setData(oRepintLPNSETJson);
					that.getView().setModel(repintLPNSETModel, "LPNSetModel");
					LPNFlag = true;
				}.bind(that),
				error: function (oError) {
					//Handle the error
					MessageBox.error("Data fetch failed for LPNSET. Please contact administrator.");
					jQuery.sap.log.getLogger().error("Data fetch failed for LPNSET. Please contact administrator." + oError.toString());
				}.bind(that)
			});

			//Getting REPERSET data to calculate value for each row with Reperibilita = "X" (Initial value)
			var repintREPERSETModel = new sap.ui.model.json.JSONModel();
			var oRepintREPERSETJson = [];
			var oRepintREPERSETJsonData = {};

			xsoBaseModel.read("/REPERSET", {
				filters: oFilters,
				success: function (oDataIn, oResponse) {
					TOTALE_GIORNI_REPERIBILITA = oDataIn.results.length;
					for (var i = 0; i < oDataIn.results.length; ++i) {
						oRepintREPERSETJsonData = {
							"IDSCHEDA": oDataIn.results[i].IDSCHEDA,
							"LIVELLO": oDataIn.results[i].LIVELLO,
							"DATAREPERIBILITA": Formatter.formatDate(oDataIn.results[i].DATAREPERIBILITA),
							"GIORNI": oDataIn.results[i].GIORNI,
							"IMPORTO": oDataIn.results[i].IMPORTO
						};
						TOTALE_IMPORTI_REPERIBILITA = TOTALE_IMPORTI_REPERIBILITA + parseInt(oDataIn.results[i].IMPORTO);

						oRepintREPERSETJson.push(oRepintREPERSETJsonData);
						oRepintREPERSETJsonData = {};
					}
					console.log("REPERSET");
					console.log(oRepintREPERSETJson);
					repintREPERSETModel.setData(oRepintREPERSETJson);
					that.getView().setModel(repintREPERSETModel, "ReperSetModel");
					REPERFlag = true;
					///that.setReperibilitaInterventiReperibilita(repintRepInventModel);
				}.bind(that),
				error: function (oError) {
					//Handle the error
					MessageBox.error("Data fetch failed for REPERSET. Please contact administrator.");
					jQuery.sap.log.getLogger().error("Data fetch failed for REPERSET. Please contact administrator." + oError.toString());
				}.bind(that)
			});

			//Getting INTERVENTICAL data to calculate value for each row with Interventi = "X" (Initial value) 
			var oFilters1 = [];
			var filter2 = new sap.ui.model.Filter("IDSCHEDA", sap.ui.model.FilterOperator.EQ, idScheda);
			oFilters1.push(filter2);

			///////var xsoDataModel1 = new sap.ui.model.odata.ODataModel("/HANAMDC/REPINT/RepintApproval/xsodata/RepintApproval.xsodata/");

			var repintInterventoModel = new sap.ui.model.json.JSONModel();
			var oRepintInterventoJson = [];
			var oRepintInterventoJsonData = {};

			xsoBaseModel.read("/INTERVENTIEMP", {
				filters: oFilters1,

				/////xsoDataModel1.read("/INTERVENTICAL?$filter=IDSCHEDA eq " + idScheda, {

				success: function (oDataIn, oResponse) {
					for (var i = 0; i < oDataIn.results.length; ++i) {

						oRepintInterventoJsonData = {
							"IDSCHEDA": oDataIn.results[i].IDSCHEDA,
							"LIVELLO": oDataIn.results[i].LIVELLO,
							"DATAINTERVENTO": Formatter.formatInterventiDate(oDataIn.results[i].DATAINTERVENTO),
							"INTERVENTO_DATE": oDataIn.results[i].INTERVENTO_DATE,
							"INTERVENTO_DAY": oDataIn.results[i].INTERVENTO_DAY,
							"INTERVENTO_DAYNAME": oDataIn.results[i].INTERVENTO_DAYNAME,
							"FLAGNOTTURNO": oDataIn.results[i].FLAGNOTTURNO,
							"ORAINIZIO": oDataIn.results[i].ORAINIZIO,
							"ORAFINE": oDataIn.results[i].ORAFINE,
							"WORKINGDAY": oDataIn.results[i].WORKINGDAY,
							"NONWORKINGDAY": oDataIn.results[i].NONWORKINGDAY,
							"TimeSlot": "",
							"amount": ""
						};

						oRepintInterventoJson.push(oRepintInterventoJsonData);
						oRepintInterventoJsonData = {};
					}
					console.log("Interventoset");
					console.log(oRepintLPNSETJson);
					repintInterventoModel.setData(oRepintInterventoJson);
					that.getView().setModel(repintInterventoModel, "InterventoSetModel");

					that.getIMPORTIINTERVENTI2018(repintInterventoModel, repintRepInventModel, that.INTERFlag);
					console.log("AFTER getIMPORTIINTERVENTI2018");

				}.bind(that),
				error: function (oError) {
					//Handle the error
					MessageBox.error("Data fetch failed for INTERVENTIEMP. Please contact administrator.");
					jQuery.sap.log.getLogger().error("Data fetch failed for INTERVENTIEMP. Please contact administrator." + oError.toString());
				}.bind(that)
			});
			console.log("IN THE END");
		},

		getIMPORTIINTERVENTI2018: function (repintInterventoModel, repintRepInventModel, INTERFlag) {

			// getting IMPORTIINTERVENTI2018 table data 
			var that = this;
			var repintIINTERVENTI2018Model = new sap.ui.model.json.JSONModel();
			var oRepintIINTERVENTI2018Json = [];
			var oRepintIINTERVENTI2018JsonData = {};
			var oLevel;
			if (that.getView().getModel("RepintEmpdataModel") !== undefined) {
				oLevel = that.getView().getModel("RepintEmpdataModel").getProperty("/0/LIVELLO").toString();
			}

			var oFilters = [];
			var filter11 = new sap.ui.model.Filter("LIVELLO", sap.ui.model.FilterOperator.EQ, oLevel);
			oFilters.push(filter11);
			var xsoBaseModel = that.getOwnerComponent().getModel("basexsoModel");

			///var xsoDataModel1 = new sap.ui.model.odata.ODataModel("/HANAMDC/REPINT/RepintApproval/xsodata/RepintApproval.xsodata/");
			// xsoDataModel1.attachRequestSent(function () {
			// 	that._busyDialog.open();
			// });
			// xsoDataModel1.attachRequestCompleted(function () {
			// 	that._busyDialog.close();
			// });

			xsoBaseModel.read("/IMPORTIINTERVENTI2018", {
				filters: oFilters,

				////xsoDataModel1.read("/IMPORTIINTERVENTI2018?$filter=LIVELLO eq '" + oLevel + "'", {
				success: function (oDataIn, oResponse) {
					for (var i = 0; i < oDataIn.results.length; ++i) {
						oRepintIINTERVENTI2018JsonData = {
							"IDIMPORTIINTERVENTO": oDataIn.results[i].IDIMPORTIINTERVENTO,
							"IDTIPOGIORNO": oDataIn.results[i].IDTIPOGIORNO,
							"ORA_INI": oDataIn.results[i].ORA_INI,
							"MIN_INI": oDataIn.results[i].MIN_INI,
							"ORA_FINE": oDataIn.results[i].ORA_FINE,
							"MIN_FINE": oDataIn.results[i].MIN_FINE,
							"VALORE": oDataIn.results[i].VALORE,
							"LIVELLO": oDataIn.results[i].LIVELLO,
							"ORAINIZIO": oDataIn.results[i].ORAINIZIO,
							"ORAFINE": oDataIn.results[i].ORAFINE,
							"ORA_INI_NORM_830": oDataIn.results[i].ORA_INI_NORM_830,
							"ORA_FINE_NORM_830": oDataIn.results[i].ORA_FINE_NORM_830
						};

						oRepintIINTERVENTI2018Json.push(oRepintIINTERVENTI2018JsonData);
						oRepintIINTERVENTI2018JsonData = {};
					}
					repintIINTERVENTI2018Model.setData(oRepintIINTERVENTI2018Json);
					that.getView().setModel(repintIINTERVENTI2018Model, "IINTERVENTI2018SetModel");

					that.calculateIntervento(repintInterventoModel, repintIINTERVENTI2018Model, repintRepInventModel, INTERFlag);
				}.bind(that),
				error: function (oError) {
					//Handle the error
					MessageBox.error("Data fetch failed for IMPORTIINTERVENTI2018. Please contact administrator.");
					jQuery.sap.log.getLogger().error("IMPORTIINTERVENTI2018 data fetch failed" + oError.toString());
				}.bind(that)
			});

		},

		calculateIntervento: function (repintInterventoModel, repintIINTERVENTI2018Model, repintRepInventModel, INTERFlag) {
			var that = this;
			var oInterventoModelData;
			var oIINTERVENTI2018ModelData;
			var aConvertedArray = [];
			var aGlobalArray = [];
			var aGlobalArrayFinal = [];
			var aGlobalArrayFinalCalc = [];
			var st1flag = false;
			var st2flag = false;
			var st3flag = false;
			if (that.getView().getModel("InterventoSetModel") !== undefined) {
				if (that.getView().getModel("InterventoSetModel").getData().length > 0) {
					oInterventoModelData = that.sortInterventiDateData(repintInterventoModel);
					aConvertedArray = this.convDeepStarct(oInterventoModelData);
				}
			}
			// getting data from the IINTERVENTI2018Model model
			if (that.getView().getModel("IINTERVENTI2018SetModel") !== undefined) {
				if (that.getView().getModel("IINTERVENTI2018SetModel").getData().length > 0) {
					oIINTERVENTI2018ModelData = that.getView().getModel("IINTERVENTI2018SetModel").getData();
				}
			}
			//---------------------------------------------------------------------------------------------------------------------------
			var oLevel;
			if (that.getView().getModel("RepintEmpdataModel") !== undefined) {
				oLevel = that.getView().getModel("RepintEmpdataModel").getProperty("/0/LIVELLO").toString();
			}
			if (aConvertedArray && oIINTERVENTI2018ModelData) {
				for (var i = 0; i < aConvertedArray.length; i++) {
					aGlobalArray = [];
					if (aConvertedArray[i].WORKINGDAY === 1) { //logic for working days : 17.30 to 23.00 = TS2 , 23.00 to 8.30 = TS3
						for (var j = 0; j < aConvertedArray[i].childnode.length; j++) {
							if (aConvertedArray[i].childnode[j].ORAINIZIO > 111220201730 &&
								aConvertedArray[i].childnode[j].ORAINIZIO <= 111220202300 &&
								aConvertedArray[i].childnode[j].ORAFINE > 111220201730 &&
								aConvertedArray[i].childnode[j].ORAFINE <= 111220202300) {
								/*var selectedData1 = oIINTERVENTI2018ModelData.map(function (o2018ModelData) {
									if (o2018ModelData.ORAINIZIO === "17:30" && o2018ModelData.ORAFINE === "23:00" &&
										o2018ModelData.LIVELLO === oLevel && o2018ModelData.IDTIPOGIORNO == 1) {
										return o2018ModelData;
									} 
								});*/
								var selectedData1 = oIINTERVENTI2018ModelData.filter(function (o2018ModelData) {
									return (o2018ModelData.ORAINIZIO === "17:30" && o2018ModelData.ORAFINE === "23:00" &&
										o2018ModelData.LIVELLO === oLevel && o2018ModelData.IDTIPOGIORNO === 1);
								});
								if (selectedData1.length > 0) {
									var oEntry = {
										"IDSCHEDA": aConvertedArray[i].childnode[j].IDSCHEDA,
										"LIVELLO": aConvertedArray[i].childnode[j].LIVELLO,
										"DATAINTERVENTO": aConvertedArray[i].childnode[j].DATAINTERVENTO,
										"INTERVENTO_DATE": aConvertedArray[i].childnode[j].INTERVENTO_DATE,
										"INTERVENTO_DAY": aConvertedArray[i].childnode[j].INTERVENTO_DAY,
										"INTERVENTO_DAYNAME": aConvertedArray[i].childnode[j].INTERVENTO_DAYNAME,
										"FLAGNOTTURNO": aConvertedArray[i].childnode[j].FLAGNOTTURNO,
										"ORAINIZIO": aConvertedArray[i].childnode[j].ORAINIZIO,
										"ORAFINE": aConvertedArray[i].childnode[j].ORAFINE,
										"WORKINGDAY": aConvertedArray[i].childnode[j].WORKINGDAY,
										"NONWORKINGDAY": aConvertedArray[i].childnode[j].NONWORKINGDAY,
										"TimeSlot": "ST2",
										"amount": selectedData1[0].VALORE
									};
									aGlobalArray.push(oEntry);
									aGlobalArrayFinal.push(oEntry);
									oEntry = {};
								}

							} else if (aConvertedArray[i].childnode[j].ORAINIZIO > 111220202300 &&
								aConvertedArray[i].childnode[j].ORAINIZIO <= 121220200830 &&
								aConvertedArray[i].childnode[j].ORAFINE > 111220202300 &&
								aConvertedArray[i].childnode[j].ORAFINE <= 121220200830) {

								/*	var selectedData2 = oIINTERVENTI2018ModelData.map(function (o2018ModelData) {
										if (o2018ModelData.ORAINIZIO === "23:00" && o2018ModelData.ORAFINE === "08:30" &&
											o2018ModelData.LIVELLO === oLevel && o2018ModelData.IDTIPOGIORNO === 1) {
											return o2018ModelData;
										}
									});*/
								var selectedData2 = oIINTERVENTI2018ModelData.filter(function (o2018ModelData) {
									return (o2018ModelData.ORAINIZIO === "23:00" && o2018ModelData.ORAFINE === "08:30" &&
										o2018ModelData.LIVELLO === oLevel && o2018ModelData.IDTIPOGIORNO === 1);
								});
								if (selectedData2.length > 0) {

									var oEntry = {
										"IDSCHEDA": aConvertedArray[i].childnode[j].IDSCHEDA,
										"LIVELLO": aConvertedArray[i].childnode[j].LIVELLO,
										"DATAINTERVENTO": aConvertedArray[i].childnode[j].DATAINTERVENTO,
										"INTERVENTO_DATE": aConvertedArray[i].childnode[j].INTERVENTO_DATE,
										"INTERVENTO_DAY": aConvertedArray[i].childnode[j].INTERVENTO_DAY,
										"INTERVENTO_DAYNAME": aConvertedArray[i].childnode[j].INTERVENTO_DAYNAME,
										"FLAGNOTTURNO": aConvertedArray[i].childnode[j].FLAGNOTTURNO,
										"ORAINIZIO": aConvertedArray[i].childnode[j].ORAINIZIO,
										"ORAFINE": aConvertedArray[i].childnode[j].ORAFINE,
										"WORKINGDAY": aConvertedArray[i].childnode[j].WORKINGDAY,
										"NONWORKINGDAY": aConvertedArray[i].childnode[j].NONWORKINGDAY,
										"TimeSlot": "ST3",
										"amount": selectedData2[0].VALORE
									};
									aGlobalArray.push(oEntry);
									aGlobalArrayFinal.push(oEntry);
									oEntry = {};
								}

							} else if (aConvertedArray[i].childnode[j].ORAINIZIO > 111220201730 &&
								aConvertedArray[i].childnode[j].ORAINIZIO <= 111220202300 &&
								aConvertedArray[i].childnode[j].ORAFINE > 111220202300 &&
								aConvertedArray[i].childnode[j].ORAFINE <= 121220200830) {
								//if (aGlobalArray.length > 0) {} else {}

								////-------------------------checking for existing st2 and st3------------------------------
								st2flag = false;
								st3flag = false;
								var glbArry1 = aGlobalArray.filter(function (aGlobalArray1) {
									if (aGlobalArray1.TimeSlot === "ST2") {
										st2flag = true;
									}
									return st2flag;
								});
								var glbArry2 = aGlobalArray.filter(function (aGlobalArray1) {
									if (aGlobalArray1.TimeSlot === "ST3") {
										st3flag = true;
									}
									return st3flag;
								});
								// if ST1 presence then it the entry should fall under ST2 and if ST2 presence then it should fall in ST1
								if (st2flag === true) {
									var selectedData12 = oIINTERVENTI2018ModelData.filter(function (o2018ModelData) {
										return (o2018ModelData.ORAINIZIO === "23:00" && o2018ModelData.ORAFINE === "08:30" &&
											o2018ModelData.LIVELLO === oLevel && o2018ModelData.IDTIPOGIORNO === 1);
									});

									if (selectedData12.length > 0) {
										var oEntry = {
											"IDSCHEDA": aConvertedArray[i].childnode[j].IDSCHEDA,
											"LIVELLO": aConvertedArray[i].childnode[j].LIVELLO,
											"DATAINTERVENTO": aConvertedArray[i].childnode[j].DATAINTERVENTO,
											"INTERVENTO_DATE": aConvertedArray[i].childnode[j].INTERVENTO_DATE,
											"INTERVENTO_DAY": aConvertedArray[i].childnode[j].INTERVENTO_DAY,
											"INTERVENTO_DAYNAME": aConvertedArray[i].childnode[j].INTERVENTO_DAYNAME,
											"FLAGNOTTURNO": aConvertedArray[i].childnode[j].FLAGNOTTURNO,
											"ORAINIZIO": aConvertedArray[i].childnode[j].ORAINIZIO,
											"ORAFINE": aConvertedArray[i].childnode[j].ORAFINE,
											"WORKINGDAY": aConvertedArray[i].childnode[j].WORKINGDAY,
											"NONWORKINGDAY": aConvertedArray[i].childnode[j].NONWORKINGDAY,
											"TimeSlot": "ST3",
											"amount": selectedData12[0].VALORE
										};
										aGlobalArray.push(oEntry);
										aGlobalArrayFinal.push(oEntry);
										oEntry = {};
									}
								} else if (st3flag === true) {

									var selectedData12 = oIINTERVENTI2018ModelData.filter(function (o2018ModelData) {
										return (o2018ModelData.ORAINIZIO === "17:30" && o2018ModelData.ORAFINE === "23:00" &&
											o2018ModelData.LIVELLO === oLevel && o2018ModelData.IDTIPOGIORNO === 1);
									});
									if (selectedData12.length > 0) {
										var oEntry = {
											"IDSCHEDA": aConvertedArray[i].childnode[j].IDSCHEDA,
											"LIVELLO": aConvertedArray[i].childnode[j].LIVELLO,
											"DATAINTERVENTO": aConvertedArray[i].childnode[j].DATAINTERVENTO,
											"INTERVENTO_DATE": aConvertedArray[i].childnode[j].INTERVENTO_DATE,
											"INTERVENTO_DAY": aConvertedArray[i].childnode[j].INTERVENTO_DAY,
											"INTERVENTO_DAYNAME": aConvertedArray[i].childnode[j].INTERVENTO_DAYNAME,
											"FLAGNOTTURNO": aConvertedArray[i].childnode[j].FLAGNOTTURNO,
											"ORAINIZIO": aConvertedArray[i].childnode[j].ORAINIZIO,
											"ORAFINE": aConvertedArray[i].childnode[j].ORAFINE,
											"WORKINGDAY": aConvertedArray[i].childnode[j].WORKINGDAY,
											"NONWORKINGDAY": aConvertedArray[i].childnode[j].NONWORKINGDAY,
											"TimeSlot": "ST2",
											"amount": selectedData12[0].VALORE
										};
										aGlobalArray.push(oEntry);
										aGlobalArrayFinal.push(oEntry);
										oEntry = {};
									}

								} else {
									// if nothing is found then it always go to ST3
									var selectedData12 = oIINTERVENTI2018ModelData.filter(function (o2018ModelData) {
										return (o2018ModelData.ORAINIZIO === "23:00" && o2018ModelData.ORAFINE === "08:30" &&
											o2018ModelData.LIVELLO === oLevel && o2018ModelData.IDTIPOGIORNO === 1);
									});
									if (selectedData12.length > 0) {
										var oEntry = {
											"IDSCHEDA": aConvertedArray[i].childnode[j].IDSCHEDA,
											"LIVELLO": aConvertedArray[i].childnode[j].LIVELLO,
											"DATAINTERVENTO": aConvertedArray[i].childnode[j].DATAINTERVENTO,
											"INTERVENTO_DATE": aConvertedArray[i].childnode[j].INTERVENTO_DATE,
											"INTERVENTO_DAY": aConvertedArray[i].childnode[j].INTERVENTO_DAY,
											"INTERVENTO_DAYNAME": aConvertedArray[i].childnode[j].INTERVENTO_DAYNAME,
											"FLAGNOTTURNO": aConvertedArray[i].childnode[j].FLAGNOTTURNO,
											"ORAINIZIO": aConvertedArray[i].childnode[j].ORAINIZIO,
											"ORAFINE": aConvertedArray[i].childnode[j].ORAFINE,
											"WORKINGDAY": aConvertedArray[i].childnode[j].WORKINGDAY,
											"NONWORKINGDAY": aConvertedArray[i].childnode[j].NONWORKINGDAY,
											"TimeSlot": "ST3",
											"amount": selectedData12[0].VALORE
										};
										aGlobalArray.push(oEntry);
										aGlobalArrayFinal.push(oEntry);
										oEntry = {};
									}

								}

								////---------------------------------------------------------------------------------------

							}
						}
					} else {
						//logic for weekend and holidays days :08.30 to 17.30 = TS1, 17.30 to 23.00 = TS2 , 23.00 to 8.30 = TS3
						aGlobalArray = [];
						for (var j = 0; j < aConvertedArray[i].childnode.length; j++) {
							if (aConvertedArray[i].childnode[j].ORAINIZIO > 121220200830 &&
								aConvertedArray[i].childnode[j].ORAINIZIO <= 121220201730 &&
								aConvertedArray[i].childnode[j].ORAFINE > 121220200830 &&
								aConvertedArray[i].childnode[j].ORAFINE <= 121220201730) {
								/*	var selectedData4 = oIINTERVENTI2018ModelData.map(function (o2018ModelData) {
										if (o2018ModelData.ORAINIZIO === "08:30" && o2018ModelData.ORAFINE === "17:30" &&
											o2018ModelData.LIVELLO === oLevel && o2018ModelData.IDTIPOGIORNO === 2) {
											return o2018ModelData;
										}
									});*/
								var selectedData4 = oIINTERVENTI2018ModelData.filter(function (o2018ModelData) {
									return (o2018ModelData.ORAINIZIO === "08:30" && o2018ModelData.ORAFINE === "17:30" &&
										o2018ModelData.LIVELLO === oLevel && o2018ModelData.IDTIPOGIORNO === 2);
								});
								if (selectedData4.length > 0) {
									var oEntry = {
										"IDSCHEDA": aConvertedArray[i].childnode[j].IDSCHEDA,
										"LIVELLO": aConvertedArray[i].childnode[j].LIVELLO,
										"DATAINTERVENTO": aConvertedArray[i].childnode[j].DATAINTERVENTO,
										"INTERVENTO_DATE": aConvertedArray[i].childnode[j].INTERVENTO_DATE,
										"INTERVENTO_DAY": aConvertedArray[i].childnode[j].INTERVENTO_DAY,
										"INTERVENTO_DAYNAME": aConvertedArray[i].childnode[j].INTERVENTO_DAYNAME,
										"FLAGNOTTURNO": aConvertedArray[i].childnode[j].FLAGNOTTURNO,
										"ORAINIZIO": aConvertedArray[i].childnode[j].ORAINIZIO,
										"ORAFINE": aConvertedArray[i].childnode[j].ORAFINE,
										"WORKINGDAY": aConvertedArray[i].childnode[j].WORKINGDAY,
										"NONWORKINGDAY": aConvertedArray[i].childnode[j].NONWORKINGDAY,
										"TimeSlot": "ST1",
										"amount": selectedData4[0].VALORE
									};
									aGlobalArray.push(oEntry);
									aGlobalArrayFinal.push(oEntry);
									oEntry = {};
								}

							} else if (aConvertedArray[i].childnode[j].ORAINIZIO > 111220201730 &&
								aConvertedArray[i].childnode[j].ORAINIZIO <= 111220202300 &&
								aConvertedArray[i].childnode[j].ORAFINE > 111220201730 &&
								aConvertedArray[i].childnode[j].ORAFINE <= 111220202300) {
								/*var selectedData1 = oIINTERVENTI2018ModelData.map(function (o2018ModelData) {
									if (o2018ModelData.ORAINIZIO === "17:30" && o2018ModelData.ORAFINE === "23:00" &&
										o2018ModelData.LIVELLO === oLevel && o2018ModelData.IDTIPOGIORNO === 2) {
										return o2018ModelData;
									}
								});*/
								var selectedData1 = oIINTERVENTI2018ModelData.filter(function (o2018ModelData) {
									return (o2018ModelData.ORAINIZIO === "17:30" && o2018ModelData.ORAFINE === "23:00" &&
										o2018ModelData.LIVELLO === oLevel && o2018ModelData.IDTIPOGIORNO === 2);
								});
								if (selectedData1.length > 0) {
									var oEntry = {
										"IDSCHEDA": aConvertedArray[i].childnode[j].IDSCHEDA,
										"LIVELLO": aConvertedArray[i].childnode[j].LIVELLO,
										"DATAINTERVENTO": aConvertedArray[i].childnode[j].DATAINTERVENTO,
										"INTERVENTO_DATE": aConvertedArray[i].childnode[j].INTERVENTO_DATE,
										"INTERVENTO_DAY": aConvertedArray[i].childnode[j].INTERVENTO_DAY,
										"INTERVENTO_DAYNAME": aConvertedArray[i].childnode[j].INTERVENTO_DAYNAME,
										"FLAGNOTTURNO": aConvertedArray[i].childnode[j].FLAGNOTTURNO,
										"ORAINIZIO": aConvertedArray[i].childnode[j].ORAINIZIO,
										"ORAFINE": aConvertedArray[i].childnode[j].ORAFINE,
										"WORKINGDAY": aConvertedArray[i].childnode[j].WORKINGDAY,
										"NONWORKINGDAY": aConvertedArray[i].childnode[j].NONWORKINGDAY,
										"TimeSlot": "ST2",
										"amount": selectedData1[0].VALORE
									};
									aGlobalArray.push(oEntry);
									aGlobalArrayFinal.push(oEntry);
									oEntry = {};
								}

							} else if (aConvertedArray[i].childnode[j].ORAINIZIO > 111220202300 &&
								aConvertedArray[i].childnode[j].ORAINIZIO <= 121220200830 &&
								aConvertedArray[i].childnode[j].ORAFINE > 111220202300 &&
								aConvertedArray[i].childnode[j].ORAFINE <= 121220200830) {

								/*	var selectedData2 = oIINTERVENTI2018ModelData.map(function (o2018ModelData) {
										if (o2018ModelData.ORAINIZIO === "23:00" && o2018ModelData.ORAFINE === "08:30" &&
											o2018ModelData.LIVELLO === oLevel && o2018ModelData.IDTIPOGIORNO === 2) {
											return o2018ModelData;
										}
									});*/
								var selectedData2 = oIINTERVENTI2018ModelData.filter(function (o2018ModelData) {
									return (o2018ModelData.ORAINIZIO === "23:00" && o2018ModelData.ORAFINE === "08:30" &&
										o2018ModelData.LIVELLO === oLevel && o2018ModelData.IDTIPOGIORNO === 2);
								});
								if (selectedData2.length > 0) {
									var oEntry = {
										"IDSCHEDA": aConvertedArray[i].childnode[j].IDSCHEDA,
										"LIVELLO": aConvertedArray[i].childnode[j].LIVELLO,
										"DATAINTERVENTO": aConvertedArray[i].childnode[j].DATAINTERVENTO,
										"INTERVENTO_DATE": aConvertedArray[i].childnode[j].INTERVENTO_DATE,
										"INTERVENTO_DAY": aConvertedArray[i].childnode[j].INTERVENTO_DAY,
										"INTERVENTO_DAYNAME": aConvertedArray[i].childnode[j].INTERVENTO_DAYNAME,
										"FLAGNOTTURNO": aConvertedArray[i].childnode[j].FLAGNOTTURNO,
										"ORAINIZIO": aConvertedArray[i].childnode[j].ORAINIZIO,
										"ORAFINE": aConvertedArray[i].childnode[j].ORAFINE,
										"WORKINGDAY": aConvertedArray[i].childnode[j].WORKINGDAY,
										"NONWORKINGDAY": aConvertedArray[i].childnode[j].NONWORKINGDAY,
										"TimeSlot": "ST3",
										"amount": selectedData2[0].VALORE
									};
									aGlobalArray.push(oEntry);
									aGlobalArrayFinal.push(oEntry);
									oEntry = {};
								}

							} else if (aConvertedArray[i].childnode[j].ORAINIZIO > 121220200830 &&
								aConvertedArray[i].childnode[j].ORAINIZIO <= 121220201730 &&
								aConvertedArray[i].childnode[j].ORAFINE > 111220201730 &&
								aConvertedArray[i].childnode[j].ORAFINE <= 111220202300) {
								//	if (aGlobalArray.length > 0) {} else {}

								////-------------------------checking for existing st1 and st2------------------------------
								st1flag = false;
								st2flag = false;
								var glbArry1 = aGlobalArray.filter(function (aGlobalArray1) {
									if (aGlobalArray1.TimeSlot === "ST1") {
										st1flag = true;
									}
									return st1flag;
								});
								var glbArry2 = aGlobalArray.filter(function (aGlobalArray1) {
									if (aGlobalArray1.TimeSlot === "ST2") {
										st2flag = true;
									}
									return st2flag;
								});
								// if ST1 presence then it the entry should fall under ST2 and if ST2 presence then it should fall in ST1
								if (st1flag === true) {
									var selectedData12 = oIINTERVENTI2018ModelData.filter(function (o2018ModelData) {
										return (o2018ModelData.ORAINIZIO === "17:30" && o2018ModelData.ORAFINE === "23:00" &&
											o2018ModelData.LIVELLO === oLevel && o2018ModelData.IDTIPOGIORNO === 2);
									});
									if (selectedData12.length > 0) {
										var oEntry = {
											"IDSCHEDA": aConvertedArray[i].childnode[j].IDSCHEDA,
											"LIVELLO": aConvertedArray[i].childnode[j].LIVELLO,
											"DATAINTERVENTO": aConvertedArray[i].childnode[j].DATAINTERVENTO,
											"INTERVENTO_DATE": aConvertedArray[i].childnode[j].INTERVENTO_DATE,
											"INTERVENTO_DAY": aConvertedArray[i].childnode[j].INTERVENTO_DAY,
											"INTERVENTO_DAYNAME": aConvertedArray[i].childnode[j].INTERVENTO_DAYNAME,
											"FLAGNOTTURNO": aConvertedArray[i].childnode[j].FLAGNOTTURNO,
											"ORAINIZIO": aConvertedArray[i].childnode[j].ORAINIZIO,
											"ORAFINE": aConvertedArray[i].childnode[j].ORAFINE,
											"WORKINGDAY": aConvertedArray[i].childnode[j].WORKINGDAY,
											"NONWORKINGDAY": aConvertedArray[i].childnode[j].NONWORKINGDAY,
											"TimeSlot": "ST2",
											"amount": selectedData12[0].VALORE
										};
										aGlobalArray.push(oEntry);
										aGlobalArrayFinal.push(oEntry);
										oEntry = {};
									}
								} else if (st2flag === true) {

									var selectedData12 = oIINTERVENTI2018ModelData.filter(function (o2018ModelData) {
										return (o2018ModelData.ORAINIZIO === "08:30" && o2018ModelData.ORAFINE === "17:30" &&
											o2018ModelData.LIVELLO === oLevel && o2018ModelData.IDTIPOGIORNO === 2);
									});
									if (selectedData12.length > 0) {
										var oEntry = {
											"IDSCHEDA": aConvertedArray[i].childnode[j].IDSCHEDA,
											"LIVELLO": aConvertedArray[i].childnode[j].LIVELLO,
											"DATAINTERVENTO": aConvertedArray[i].childnode[j].DATAINTERVENTO,
											"INTERVENTO_DATE": aConvertedArray[i].childnode[j].INTERVENTO_DATE,
											"INTERVENTO_DAY": aConvertedArray[i].childnode[j].INTERVENTO_DAY,
											"INTERVENTO_DAYNAME": aConvertedArray[i].childnode[j].INTERVENTO_DAYNAME,
											"FLAGNOTTURNO": aConvertedArray[i].childnode[j].FLAGNOTTURNO,
											"ORAINIZIO": aConvertedArray[i].childnode[j].ORAINIZIO,
											"ORAFINE": aConvertedArray[i].childnode[j].ORAFINE,
											"WORKINGDAY": aConvertedArray[i].childnode[j].WORKINGDAY,
											"NONWORKINGDAY": aConvertedArray[i].childnode[j].NONWORKINGDAY,
											"TimeSlot": "ST1",
											"amount": selectedData12[0].VALORE
										};
										aGlobalArray.push(oEntry);
										aGlobalArrayFinal.push(oEntry);
										oEntry = {};
									}

								} else {
									// if nothing is found then it always go to ST2
									var selectedData12 = oIINTERVENTI2018ModelData.filter(function (o2018ModelData) {
										return (o2018ModelData.ORAINIZIO === "17:30" && o2018ModelData.ORAFINE === "23:00" &&
											o2018ModelData.LIVELLO === oLevel && o2018ModelData.IDTIPOGIORNO === 2);
									});
									if (selectedData12.length > 0) {
										var oEntry = {
											"IDSCHEDA": aConvertedArray[i].childnode[j].IDSCHEDA,
											"LIVELLO": aConvertedArray[i].childnode[j].LIVELLO,
											"DATAINTERVENTO": aConvertedArray[i].childnode[j].DATAINTERVENTO,
											"INTERVENTO_DATE": aConvertedArray[i].childnode[j].INTERVENTO_DATE,
											"INTERVENTO_DAY": aConvertedArray[i].childnode[j].INTERVENTO_DAY,
											"INTERVENTO_DAYNAME": aConvertedArray[i].childnode[j].INTERVENTO_DAYNAME,
											"FLAGNOTTURNO": aConvertedArray[i].childnode[j].FLAGNOTTURNO,
											"ORAINIZIO": aConvertedArray[i].childnode[j].ORAINIZIO,
											"ORAFINE": aConvertedArray[i].childnode[j].ORAFINE,
											"WORKINGDAY": aConvertedArray[i].childnode[j].WORKINGDAY,
											"NONWORKINGDAY": aConvertedArray[i].childnode[j].NONWORKINGDAY,
											"TimeSlot": "ST2",
											"amount": selectedData12[0].VALORE
										};
										aGlobalArray.push(oEntry);
										aGlobalArrayFinal.push(oEntry);
										oEntry = {};
									}
								}

								////---------------------------------------------------------------------------------------

							} else if (aConvertedArray[i].childnode[j].ORAINIZIO > 111220201730 &&
								aConvertedArray[i].childnode[j].ORAINIZIO <= 111220202300 &&
								aConvertedArray[i].childnode[j].ORAFINE > 111220202300 &&
								aConvertedArray[i].childnode[j].ORAFINE <= 121220200830) {
								//	if (aGlobalArray.length > 0) {} else {}

								////-------------------------checking for existing st2 and st3------------------------------
								st2flag = false;
								st3flag = false;
								var glbArry1 = aGlobalArray.filter(function (aGlobalArray1) {
									if (aGlobalArray1.TimeSlot === "ST2") {
										st2flag = true;
									}
									return st2flag;
								});
								var glbArry2 = aGlobalArray.filter(function (aGlobalArray1) {
									if (aGlobalArray1.TimeSlot === "ST3") {
										st3flag = true;
									}
									return st3flag;
								});
								// if ST1 presence then it the entry should fall under ST2 and if ST2 presence then it should fall in ST1
								if (st2flag === true) {
									var selectedData12 = oIINTERVENTI2018ModelData.filter(function (o2018ModelData) {
										return (o2018ModelData.ORAINIZIO === "23:00" && o2018ModelData.ORAFINE === "08:30" &&
											o2018ModelData.LIVELLO === oLevel && o2018ModelData.IDTIPOGIORNO === 2);
									});

									if (selectedData12.length > 0) {
										var oEntry = {
											"IDSCHEDA": aConvertedArray[i].childnode[j].IDSCHEDA,
											"LIVELLO": aConvertedArray[i].childnode[j].LIVELLO,
											"DATAINTERVENTO": aConvertedArray[i].childnode[j].DATAINTERVENTO,
											"INTERVENTO_DATE": aConvertedArray[i].childnode[j].INTERVENTO_DATE,
											"INTERVENTO_DAY": aConvertedArray[i].childnode[j].INTERVENTO_DAY,
											"INTERVENTO_DAYNAME": aConvertedArray[i].childnode[j].INTERVENTO_DAYNAME,
											"FLAGNOTTURNO": aConvertedArray[i].childnode[j].FLAGNOTTURNO,
											"ORAINIZIO": aConvertedArray[i].childnode[j].ORAINIZIO,
											"ORAFINE": aConvertedArray[i].childnode[j].ORAFINE,
											"WORKINGDAY": aConvertedArray[i].childnode[j].WORKINGDAY,
											"NONWORKINGDAY": aConvertedArray[i].childnode[j].NONWORKINGDAY,
											"TimeSlot": "ST3",
											"amount": selectedData12[0].VALORE
										};
										aGlobalArray.push(oEntry);
										aGlobalArrayFinal.push(oEntry);
										oEntry = {};
									}
								} else if (st3flag === true) {

									var selectedData12 = oIINTERVENTI2018ModelData.filter(function (o2018ModelData) {
										return (o2018ModelData.ORAINIZIO === "17:30" && o2018ModelData.ORAFINE === "23:00" &&
											o2018ModelData.LIVELLO === oLevel && o2018ModelData.IDTIPOGIORNO === 2);
									});
									if (selectedData12.length > 0) {
										var oEntry = {
											"IDSCHEDA": aConvertedArray[i].childnode[j].IDSCHEDA,
											"LIVELLO": aConvertedArray[i].childnode[j].LIVELLO,
											"DATAINTERVENTO": aConvertedArray[i].childnode[j].DATAINTERVENTO,
											"INTERVENTO_DATE": aConvertedArray[i].childnode[j].INTERVENTO_DATE,
											"INTERVENTO_DAY": aConvertedArray[i].childnode[j].INTERVENTO_DAY,
											"INTERVENTO_DAYNAME": aConvertedArray[i].childnode[j].INTERVENTO_DAYNAME,
											"FLAGNOTTURNO": aConvertedArray[i].childnode[j].FLAGNOTTURNO,
											"ORAINIZIO": aConvertedArray[i].childnode[j].ORAINIZIO,
											"ORAFINE": aConvertedArray[i].childnode[j].ORAFINE,
											"WORKINGDAY": aConvertedArray[i].childnode[j].WORKINGDAY,
											"NONWORKINGDAY": aConvertedArray[i].childnode[j].NONWORKINGDAY,
											"TimeSlot": "ST2",
											"amount": selectedData12[0].VALORE
										};
										aGlobalArray.push(oEntry);
										aGlobalArrayFinal.push(oEntry);
										oEntry = {};
									}

								} else {
									// if nothing is found then it always go to ST3
									var selectedData12 = oIINTERVENTI2018ModelData.filter(function (o2018ModelData) {
										return (o2018ModelData.ORAINIZIO === "23:00" && o2018ModelData.ORAFINE === "08:30" &&
											o2018ModelData.LIVELLO === oLevel && o2018ModelData.IDTIPOGIORNO === 2);
									});
									if (selectedData12.length > 0) {
										var oEntry = {
											"IDSCHEDA": aConvertedArray[i].childnode[j].IDSCHEDA,
											"LIVELLO": aConvertedArray[i].childnode[j].LIVELLO,
											"DATAINTERVENTO": aConvertedArray[i].childnode[j].DATAINTERVENTO,
											"INTERVENTO_DATE": aConvertedArray[i].childnode[j].INTERVENTO_DATE,
											"INTERVENTO_DAY": aConvertedArray[i].childnode[j].INTERVENTO_DAY,
											"INTERVENTO_DAYNAME": aConvertedArray[i].childnode[j].INTERVENTO_DAYNAME,
											"FLAGNOTTURNO": aConvertedArray[i].childnode[j].FLAGNOTTURNO,
											"ORAINIZIO": aConvertedArray[i].childnode[j].ORAINIZIO,
											"ORAFINE": aConvertedArray[i].childnode[j].ORAFINE,
											"WORKINGDAY": aConvertedArray[i].childnode[j].WORKINGDAY,
											"NONWORKINGDAY": aConvertedArray[i].childnode[j].NONWORKINGDAY,
											"TimeSlot": "ST3",
											"amount": selectedData12[0].VALORE
										};
										aGlobalArray.push(oEntry);
										aGlobalArrayFinal.push(oEntry);
										oEntry = {};
									}

								}

								////---------------------------------------------------------------------------------------

							}
						}

					}

				}

			}
			// sum value amount
			if (aGlobalArrayFinal) {

				var uniqaGlobalArrayFinal = this.uniqueInterCalcu(aGlobalArrayFinal);

				var amounttotal = 0;
				for (var j = 0; j < uniqaGlobalArrayFinal.length; j++) {
					amounttotal = parseInt(amounttotal) + parseInt(uniqaGlobalArrayFinal[j].amount);
				}
				that.INTERFlag = true;
				this.getOwnerComponent().getModel("viewProperties").setProperty("/TOTALE_IMPORTI_INTERVENTO", amounttotal);
			}
		},
		/*
				var aConvertedArray1 = this.convDeepStarct(aGlobalArrayFinal);
				var aSumArray = [];
				var amounttotal = 0;
				for (var i = 0; i < aConvertedArray1.length; i++) {
					aSumArray = [];
					amounttotal = 0;
					aSumArray = [];
					for (var j = 0; j < aConvertedArray1[i].childnode.length; j++) {
						//                           var index = aSumArray.indexOf(aConvertedArray1[i].childnode[j].amount);
						var index1 = aSumArray.indexOf(aConvertedArray1[i].childnode[j].TimeSlot);
						if (index1 < 0) {
							amounttotal = parseInt(amounttotal) + parseInt(aConvertedArray1[i].childnode[j].amount);
							//                        aSumArray.push(aConvertedArray1[i].childnode[j].amount);
							aSumArray.push(aConvertedArray1[i].childnode[j].TimeSlot);
						} else {
							//                        aSumArray.push(aConvertedArray1[i].childnode[j].amount);
							aSumArray.push(aConvertedArray1[i].childnode[j].TimeSlot);

						}
					}
					for (var j = 0; j < aConvertedArray1[i].childnode.length; j++) {
						var oEntry = {
							"IDSCHEDA": aConvertedArray1[i].childnode[j].IDSCHEDA,
							"LIVELLO": aConvertedArray1[i].childnode[j].LIVELLO,
							"DATAINTERVENTO": aConvertedArray1[i].childnode[j].DATAINTERVENTO,
							"INTERVENTO_DATE": aConvertedArray1[i].childnode[j].INTERVENTO_DATE,
							"INTERVENTO_DAY": aConvertedArray1[i].childnode[j].INTERVENTO_DAY,
							"INTERVENTO_DAYNAME": aConvertedArray1[i].childnode[j].INTERVENTO_DAYNAME,
							"FLAGNOTTURNO": aConvertedArray1[i].childnode[j].FLAGNOTTURNO,
							"ORAINIZIO": aConvertedArray1[i].childnode[j].ORAINIZIO,
							"ORAFINE": aConvertedArray1[i].childnode[j].ORAFINE,
							"WORKINGDAY": aConvertedArray1[i].childnode[j].WORKINGDAY,
							"NONWORKINGDAY": aConvertedArray1[i].childnode[j].NONWORKINGDAY,
							"TimeSlot": aConvertedArray1[i].childnode[j].TimeSlot,
							"amount": amounttotal
						};
						aGlobalArrayFinalCalc.push(oEntry);
						oEntry = {};
					}
				}
			//}
			// 
			// if (aGlobalArrayFinalCalc && repintRepInventModel) {
			// 	that.setInterventiCalculation(aGlobalArrayFinalCalc, repintRepInventModel, INTERFlag);
			// }
		},

		// setInterventiCalculation: function (aGlobalArrayFinalCalc, repintRepInventModel, INTERFlag) {

		// 	var that = this;
		// 	var interflag1 = false;
		// 	var interflag2 = false;
		// 	var selInterRecord;
		// 	var oInterModelData;
		// 	var obj = [];
		// 	if (aGlobalArrayFinalCalc) {
		// 		interflag1 = true;
		// 	}
		// 	if (repintRepInventModel !== undefined) {
		// 		if (repintRepInventModel.getData().length > 0) {
		// 			that.sortRepintRepInventModel(repintRepInventModel); 
		// 			interflag2 = true;
		// 		}
		// 	}

		// 	if (interflag1 && interflag2) {
		// 		for (var i = 0; i < repintRepInventModel.getData().length; ++i) {
		// 			// Filter records from ReperSetModel based on selected record date value of Reperibilita ("X")
		// 			selInterRecord = jQuery.grep(aGlobalArrayFinalCalc, function (a) {
		// 				return (a.DATAINTERVENTO === repintRepInventModel.getData()[i].DATAINTERVENTO);
		// 			});
		// 			if (selInterRecord.length > 0) {
		// 			//	if (repintRepInventModel.getData()[i].Intervento === "X") {
		// 					var indx = obj.indexOf(selInterRecord[0].DATAINTERVENTO);
		// 					if (indx < 0) {
		// 											repintRepInventModel.getData()[i].Intervento = selInterRecord[0].amount;
		// 						repintRepInventModel.getData()[i].DATAINTERVENTO = selInterRecord[0].DATAINTERVENTO;
		// 						repintRepInventModel.updateBindings(true);
		// 						obj.push(selInterRecord[0].DATAINTERVENTO);
		// 					} else {
		// 						/*                       repintRepInventModel.getData()[i].Intervento = "";
		// 						                           repintRepInventModel.getData()[i].DATE = "";
		// 						                           repintRepInventModel.updateBindings(true);*/
		// 						repintRepInventModel.getData()[i].Intervento = selInterRecord[0].amount;
		// 						obj.push(selInterRecord[0].DATAINTERVENTO);
		// 					}

		// 			//	}

		// 			}
		// 		}
		// 	}

		// 	// unique 
		// 	var uniqueNames = [];
		// 	$.each(repintRepInventModel.getData(), function (i, el) {
		// 		if (this.inArray(uniqueNames, el) === false) {
		// 			uniqueNames.push(el);
		// 		}
		// 	}.bind(this));
		// 	repintRepInventModel.setData(uniqueNames);
		// 	repintRepInventModel.updateBindings(true);
		// },
		// inArray: function (array, el) {
		// 	var find = false;
		// 	$.each(array, function (index, value) {
		// 		if (el.DATE === value.DATE && el.Intervento === value.Intervento && el.LPN === value.LPN && el.Reperibilita === value.Reperibilita) {
		// 			find = true;
		// 			return false;
		// 		}
		// 	});
		// 	return find;
		// },

		sortRepintRepInventModel: function (oInterventiDateModel) {
			var oSortedInterventiDateData = oInterventiDateModel.getData().sort(function (a, b) {

				if ((a.DATE !== "") && (b.DATE !== "")) {
					if (a.DATE < b.DATE) //sort Interventi Date ascending
						return -1;
					if (a.DATE > b.DATE)
						return 1;
					return 0 //default return value (no sorting)                                                                                                               
				}

			});

			return oSortedInterventiDateData;
		},
		convDeepStarct: function (data) {
			var questionSet = [];
			var convertedData = [];
			for (var i = 0; i < data.length; i++) {
				var index = questionSet.indexOf(data[i].DATAINTERVENTO);
				var fromDat,fromDat1,fromDat2,fromDat3;
				var toDat, toDat1,toDat2,toDat3;
				// adding a constant date in to the time coming from backend input by employee app from the emloyee for condition
				if (typeof data[i].ORAINIZIO !== 'number') {
					if (data[i].ORAINIZIO.indexOf(":")) {
						//	fromDat = parseInt(11122020 + (data[i].ORAINIZIO).split(":")[0] + (data[i].ORAINIZIO).split(":")[1], 10);

						
						fromDat3 = data[i].ORAINIZIO.split(":")[0];
						fromDat2 = data[i].ORAINIZIO.split(":")[1];
						
						fromDat1 = parseFloat(data[i].ORAINIZIO.split(":")[0] +  "." + data[i].ORAINIZIO.split(":")[1]);
						
						if (fromDat1 >= 0 && fromDat1 <= 17.29) {
							fromDat = parseInt("12122020" + fromDat3 + "" + fromDat2, 10);
						} else {
							fromDat = parseInt("11122020" + fromDat3 + "" + fromDat2, 10);
						}
					} else {
						fromDat = data[i].ORAINIZIO;
					}
				}
				// adding a constant date in to the time coming from backend input by employee app from the emloyee for condition
				if (typeof data[i].ORAFINE !== 'number') {
					if (data[i].ORAFINE.indexOf(":")) {
					//	toDat = parseInt(12122020 + (data[i].ORAFINE).split(":")[0] + (data[i].ORAFINE).split(":")[1], 10);
					toDat1 = parseInt(data[i].ORAFINE.split(":")[0], 10);
					toDat3 = data[i].ORAFINE.split(":")[0];
					toDat2 = data[i].ORAFINE.split(":")[1];
					
					toDat1 = parseFloat(data[i].ORAFINE.split(":")[0] +  "." + data[i].ORAFINE.split(":")[1]);
					
						if (toDat1 >= 0 && toDat1 <= 17.29) {
							toDat = parseInt("12122020" + toDat3 + "" + toDat2, 10);
						} else {
							toDat = parseInt("11122020" + toDat3 + "" + toDat2, 10);
						}
					} else {
						toDat = data[i].ORAFINE;
					}
				}
				if (index < 0) {
					var oEntry = {
						"date": data[i].DATAINTERVENTO,
						"WORKINGDAY": data[i].WORKINGDAY,
						"childnode": [{
							"IDSCHEDA": data[i].IDSCHEDA,
							"LIVELLO": data[i].LIVELLO,
							"DATAINTERVENTO": data[i].DATAINTERVENTO,
							"INTERVENTO_DATE": data[i].INTERVENTO_DATE,
							"INTERVENTO_DAY": data[i].INTERVENTO_DAY,
							"INTERVENTO_DAYNAME": data[i].INTERVENTO_DAYNAME,
							"FLAGNOTTURNO": data[i].FLAGNOTTURNO,
							"ORAINIZIO": fromDat,
							"ORAFINE": toDat,
							"WORKINGDAY": data[i].WORKINGDAY,
							"NONWORKINGDAY": data[i].NONWORKINGDAY,
							"TimeSlot": data[i].TimeSlot,
							"amount": data[i].amount

						}]
					};
					convertedData.push(oEntry);
					questionSet.push(data[i].DATAINTERVENTO);

				} else {
					var oEntry = {
						"IDSCHEDA": data[i].IDSCHEDA,
						"LIVELLO": data[i].LIVELLO,
						"DATAINTERVENTO": data[i].DATAINTERVENTO,
						"INTERVENTO_DATE": data[i].INTERVENTO_DATE,
						"INTERVENTO_DAY": data[i].INTERVENTO_DAY,
						"INTERVENTO_DAYNAME": data[i].INTERVENTO_DAYNAME,
						"FLAGNOTTURNO": data[i].FLAGNOTTURNO,
						"ORAINIZIO": fromDat,
						"ORAFINE": toDat,
						"WORKINGDAY": data[i].WORKINGDAY,
						"NONWORKINGDAY": data[i].NONWORKINGDAY,
						"TimeSlot": data[i].TimeSlot,
						"amount": data[i].amount

					};
					convertedData[index].childnode.push(oEntry);
				}
			}
			return convertedData;
		},

		handleCreate: function (oEvent) {
			var that = this;
			// Below condition added on 7th Dec 2020
			that.invioBozzaFlag = false;
			that.invioFlag = false;
			var oReperibilitaModelData = that.getView().byId("idTableReperibilita").getModel("RepintReperibilitaModel").getProperty("/");
			var oInterventiModelData = that.getView().byId("idTableInterventi").getModel("RepintInterventiModel").getProperty("/");
			var oInterventiDateModel = that.getView().byId("idTableInterventi").getModel("RepintInterventiModel");
			var oSortedInterventiModelData = that.getView().byId("idTableInterventi").getModel("RepintInterventiModel").getData();
			var datearr = [];
			// Initiate "TOTALE_GIORNI_RIPOSI_COMPENSATIVI" = 0.0. This value is required to be push in table for Reporting functionality in "Repint Approval" App
			that.getOwnerComponent().getModel("viewProperties").setProperty("/TOTALE_GIORNI_RIPOSI_COMPENSATIVI", 0.0);

			// Below condition added on 7th Dec 2020
			that.invioFlag = true;

			/////var oEmpHdrData = that.getView().getModel("RepintEmpHdrModel").getData();
			var oEmpdata = that.getView().getModel("RepintEmpdataModel").getData();

			that.validateData(oEmpdata, oReperibilitaModelData, oInterventiModelData);

			if (that.getOwnerComponent().getModel("viewProperties").getProperty("/InterventiStatus") !== undefined &&
				that.getOwnerComponent().getModel("viewProperties").getProperty("/ReperibilitaStatus") !== undefined &&
				(!that.getOwnerComponent().getModel("viewProperties").getProperty("/InterventiStatus")) &&
				(!that.getOwnerComponent().getModel("viewProperties").getProperty("/ReperibilitaStatus"))
			) {
				MessageBox.error("Non sono stati inserite giornate di reperibilità e interventi eseguiti o programmati");
				return;
			}

			if (that.getOwnerComponent().getModel("viewProperties").getProperty("/validData")) { // Validation Success

				var uniqueinterventDates = $.unique(oInterventiDateModel.getData().map(function (value) {
					return value.DATAINTERVENTO;
				})); // Get Unique Interventi Dates

				//this.setStessacausale(oInterventiDateModel);
				//this.setStessacausaleForRIP(uniqueinterventDates, oSortedInterventiModelData);

				//if (true) {
				var oChild1Json = [];
				var oChild1JsonData = {};
				var oChild2Json = [];
				var oChild2JsonData = {};

				if (that.getOwnerComponent().getModel("viewProperties").getProperty("/ReperibilitaStatus")) { // Implies at least one Reperibilita record exists
					for (var i = 0; i < oReperibilitaModelData.length; ++i) {

						if (oReperibilitaModelData[i].Dom === true) {
							oReperibilitaModelData[i].TIPOGIORNO = "F";
						} else if (oReperibilitaModelData[i].Sab === true) {
							oReperibilitaModelData[i].TIPOGIORNO = "S";
						} else {
							oReperibilitaModelData[i].TIPOGIORNO = "L";
						}
						datearr = [];
						datearr = oReperibilitaModelData[i].DATAREPERIBILITA.split("-");
						////////oReperibilitaModelData[i].DATAREPERIBILITA = datearr[2] + "-" + datearr[1] + "-" + datearr[0] + "T00:00:00";

						oChild1JsonData = {
							"IDSCHEDA": oReperibilitaModelData[i].IDSCHEDA,
							///IDSCHEDA": parseInt("5"), // HARDCODED
							"IDREPERIBILITA": oReperibilitaModelData[i].IDREPERIBILITA,
							//"IDREPERIBILITA": parseInt("5"), // HARDCODED
							////////"DATAREPERIBILITA": oReperibilitaModelData[i].DATAREPERIBILITA,
							"DATAREPERIBILITA": datearr[2] + "-" + datearr[1] + "-" + datearr[0] + "T00:00:00",
							//"DATAREPERIBILITA": "2020-05-01T00:00:00", //"2020-05-01T00:00:00" HARDCODED
							"TIPOGIORNO": oReperibilitaModelData[i].TIPOGIORNO
						};
						oChild1Json.push(oChild1JsonData);
						oChild1JsonData = {};
					}
				} else { // Implies no Reperibilita record exists
					oChild1Json = [];
				}

				if (that.getOwnerComponent().getModel("viewProperties").getProperty("/InterventiStatus")) { // Implies at least one Interventi record exists
					datearr = []; // Reset date

					// for (var k = 0; k < oInterventiModelData.length; ++k) {
					// 	datearr = oInterventiModelData[k].DATAINTERVENTO.split("-");
					// 	oInterventiModelData[k].DATAINTERVENTO = datearr[2] + "-" + datearr[1] + "-" + datearr[0] + "T00:00:00";

					// 	if (oInterventiModelData[k].LPN) {
					// 		oInterventiModelData[k].FLAGNOTTURNO = 1;
					// 	} else {
					// 		oInterventiModelData[k].FLAGNOTTURNO = 0;
					// 	}
					// }

					var utcOraInizioTimeStamp;
					var utcOraFineTimeStamp;

					for (var j = 0; j < oInterventiModelData.length; ++j) {
						datearr = [];
						datearr = oInterventiModelData[j].DATAINTERVENTO.split("-");
						///////oInterventiModelData[j].DATAINTERVENTO = datearr[2] + "-" + datearr[1] + "-" + datearr[0] + "T00:00:00";

						// if (oInterventiModelData[j].LPN) {
						// 	oInterventiModelData[j].FLAGNOTTURNO = 1;
						// } else {
						// 	oInterventiModelData[j].FLAGNOTTURNO = 0;
						// }

						// utcOraInizioTimeStamp = new Date(oInterventiModelData[j].ORAINIZIOTIMESTAMP.getTime() + oInterventiModelData[j].ORAINIZIOTIMESTAMP.getTimezoneOffset() * 60000);
						// utcOraFineTimeStamp = new Date(oInterventiModelData[j].ORAFINETIMESTAMP.getTime() + oInterventiModelData[j].ORAFINETIMESTAMP.getTimezoneOffset() * 60000);

						utcOraInizioTimeStamp = oInterventiModelData[j].ORAINIZIOTIMESTAMP.toUTCString();
						utcOraFineTimeStamp = oInterventiModelData[j].ORAFINETIMESTAMP.toUTCString();

						oChild2JsonData = {
							"IDINTERVENTO": oInterventiModelData[j].IDINTERVENTO,
							//"IDINTERVENTO": parseInt("5"), // HARDCODED
							/////////////"DATAINTERVENTO": oInterventiModelData[j].DATAINTERVENTO,
							"DATAINTERVENTO": datearr[2] + "-" + datearr[1] + "-" + datearr[0] + "T00:00:00",
							//"DATAINTERVENTO": "2020-05-01T00:00:00", //"2020-05-01T00:00:00" HARDCODED
							"ORAINIZIO": oInterventiModelData[j].ORAINIZIO,
							"ORAFINE": oInterventiModelData[j].ORAFINE,
							// CHECK HARDCODED
							"CHIAMATODA": (oInterventiModelData[j].CHIAMATODA === undefined) ? "" : oInterventiModelData[j].CHIAMATODA,
							///"CHIAMATODA": "NOC", // HARDCODED
							"CAUSA": (oInterventiModelData[j].CAUSA === null || oInterventiModelData[j].CAUSA === undefined) ? "" : oInterventiModelData[
									j]
								.CAUSA,
							//"CAUSA": "Causa1", // HARDCODED
							"FASCIA": parseInt(oInterventiModelData[j].FASCIA),
							"IDSCHEDA": oInterventiModelData[j].IDSCHEDA,
							"STESSACAUSALE": oInterventiModelData[j].STESSACAUSALE,
							//"DURATA": parseInt(oInterventiModelData[j].DURATA), // ???
							"CONTINTERVENTO": (oInterventiModelData[j].CONTINTERVENTO === "" || oInterventiModelData[j].CONTINTERVENTO === null) ? 0 : (
								oInterventiModelData[j].CONTINTERVENTO),
							//"FLAGNOTTURNO": parseInt(oInterventiModelData[j].FLAGNOTTURNO) ? 1 : 0, // LPN Checkbox value
							////"FLAGNOTTURNO": oInterventiModelData[j].FLAGNOTTURNO, // LPN Checkbox value
							"FLAGNOTTURNO": (oInterventiModelData[j].FLAGNOTTURNO) ? 1 : 0, // LPN Checkbox value
							"FLAGCONT": (oInterventiModelData[j].FLAGCONT) ? 1 : 0, // RIP Checkbox value
							// "ORAFINETIMESTAMP": Formatter.formatUTCDate(oInterventiModelData[j].ORAFINETIMESTAMP) + ":00",
							// "ORAINIZIOTIMESTAMP": Formatter.formatUTCDate(oInterventiModelData[j].ORAINIZIOTIMESTAMP) + ":00",
							"ORAFINETIMESTAMP": Formatter.formatUTCDate(utcOraFineTimeStamp),
							"ORAINIZIOTIMESTAMP": Formatter.formatUTCDate(utcOraInizioTimeStamp),
							"WORKINGDAY": (oInterventiModelData[j].WORKINGDAY) ? 1 : 0,
							"NONWORKINGDAY": (oInterventiModelData[j].NONWORKINGDAY) ? 1 : 0,
							"CHECKOK": oInterventiModelData[j].CHECKOK,
							"RIPOSI": oInterventiModelData[j].RIPOSI,
							"CHIAMATODA_ALTRO": (oInterventiModelData[j].CHIAMATODA_ALTRO === undefined || oInterventiModelData[j].CHIAMATODA_ALTRO ===
								null || oInterventiModelData[j].CHIAMATODA_ALTRO === "") ? "" : oInterventiModelData[j].CHIAMATODA_ALTRO,
							"RIPOSI_HH": (oInterventiModelData[j].RIPOSI === "") ? 0 : parseInt(oInterventiModelData[j].RIPOSI.substr(0, (
								oInterventiModelData[j].RIPOSI.indexOf("H")))),
							"DURATA": parseInt(oInterventiModelData[j].MINDIFFORAINIFINE), // DURATA is same as MINDIFFORAINIFINE as "MINDIFFORAINIFINE" is added later
							"MINDIFFORAINIFINE": parseInt(oInterventiModelData[j].MINDIFFORAINIFINE),
							//"TOTALE_GIORNI_RIPOSI_COMPENSATIVI": oInterventiModelData[j].TOTALE_GIORNI_RIPOSI_COMPENSATIVI
							"TOTALE_GIORNI_RIPOSI_COMPENSATIVI": 0.0,
							"INTERVENTI_DETTAGLIO": ""
						};
						oChild2Json.push(oChild2JsonData);
						oChild2JsonData = {};
					}
				} else {
					oChild2Json = [];
				}

				var Header = {};
				datearr = []; // Reset date
				//var matricolaRespVal = "";

				// if (that.getOwnerComponent().getModel("viewProperties").getProperty("/MATRICOLA_DEPUTY") === undefined && (oEmpdata[0].MATRICOLA_RESP ===
				// 		"" || oEmpdata[0].MATRICOLA_RESP == undefined)) {
				// 	matricolaRespVal = null;
				// 	MessageBox.error("Resp. Servizio and Deputy Manager value both cannot be null");
				// 	return;

				// }

				// Below condition added on 21st Jan to fix bug:
				// After the user insert or change the Delegato and (re)send (when he receives back the form when rejected) and than send again the form to the Manager, the Manager doesn't receive the form (form ID :  167823)
				if ((that.getOwnerComponent().getModel("viewProperties").getProperty("/MATRICOLA_DEPUTY") === undefined || that.getOwnerComponent()
						.getModel("viewProperties").getProperty("/MATRICOLA_DEPUTY") === "") && oEmpdata[0].MATRICOLA_RESP !==
					"") {
					//matricolaRespVal = oEmpdata[0].MATRICOLA_RESP;
					oEmpdata[0].MATRICOLA_DEPUTY = "";
				} else {
					//oEmpdata[0].MATRICOLA_RESP = "";
					oEmpdata[0].MATRICOLA_DEPUTY = that.getOwnerComponent().getModel("viewProperties").getProperty("/MATRICOLA_DEPUTY");
					//matricolaRespVal = 
				}

				// for (var i = 0; i < oEmpdata.length; ++i) {
				// 	"DATA_ASSUNZIONE": "2020-05-01T00:00:00",
				// 	"DATA_CESSAZIONE": "2020-05-01T00:00:00",
				// 	"DATETIME_CR": "2020-05-01T00:00:00",
				// 	"DATETIME_LM": "2020-05-01T00:00:00"
				// }

				//for (var l = 0; l < oEmpHdrData.length; ++l) {

				//var now = new Date();
				////var utcCreationDt = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
				var utcCreationDt = (new Date()).toUTCString(); // Current date and time
				Header = {

					"IDSCHEDA": that.getOwnerComponent().getModel("viewProperties").getProperty("/IDSCHEDA"),
					// "ANNOMESE": that.getOwnerComponent().getModel("viewProperties").getProperty("/ANNOMESE").split("-")[0] + "-" + this.getOwnerComponent()
					// 	.getModel("viewProperties").getProperty("/ANNOMESE").split("-")[1] + "-01", // + "-" + "01T00:00:00",
					///////"ANNOMESE": that.getOwnerComponent().getModel("viewProperties").getProperty("/ANNOMESE") + "-01",
					"ANNOMESE": that.getOwnerComponent().getModel("viewProperties").getProperty("/ANNOMESE").split("-")[0] + "-" + that.getOwnerComponent()
						.getModel("viewProperties").getProperty("/ANNOMESE").split("-")[1] + "-01",
					"STATO": 100, // Submit for approval
					"DATACREAZIONE": Formatter.formatUTCDate(utcCreationDt),
					//"DATE_MANAGER": Formatter.formatUTCDate(utcCreationDt),
					"ID": oEmpdata[0].ID,
					"MATRICOLA": oEmpdata[0].MATRICOLA,
					"COGNOME": oEmpdata[0].COGNOME,
					"NOME": oEmpdata[0].NOME,
					"CDC": oEmpdata[0].CDC,
					"EMAIL": oEmpdata[0].EMAIL,
					"STABILIMENTO_ATTUALE": oEmpdata[0].STABILIMENTO_ATTUALE,
					"LIVELLO": oEmpdata[0].LIVELLO,
					//"MATRICOLA_RESP": oEmpdata[0].MATRICOLA_RESP,
					"MATRICOLA_RESP": oEmpdata[0].MATRICOLA_RESP,
					"MATRICOLA_DEPUTY": oEmpdata[0].MATRICOLA_DEPUTY,
					"UNITAORGANIZZATIVA": oEmpdata[0].UNITAORGANIZZATIVA,
					"DEPARTMENT": oEmpdata[0].DEPARTMENT,
					"ManagerFirstName": oEmpdata[0].ManagerFirstName,
					"ManagerLastName": oEmpdata[0].ManagerLastName,

					//"ID": oEmpdata[0].ID,
					//"SUPERID": (oEmpdata[0].SUPERID === undefined) ? "" : oEmpdata[0].SUPERID,
					//"MATRICOLA": oEmpdata[0].MATRICOLA,
					//"COGNOME": oEmpdata[0].COGNOME,
					//"NOME": oEmpdata[0].NOME,
					//"CODICE_FISCALE": (oEmpdata[0].CODICE_FISCALE === undefined) ? "" : oEmpdata[0].CODICE_FISCALE,
					//"STATUS_DIPENDENTE": (oEmpdata[0].STATUS_DIPENDENTE === undefined) ? "" : oEmpdata[0].STATUS_DIPENDENTE,
					//"DATA_ASSUNZIONE": (oEmpdata[0].DATA_ASSUNZIONE === undefined) ? "" : oEmpdata[0].DATA_ASSUNZIONE,
					//"DATA_CESSAZIONE": (oEmpdata[0].DATA_CESSAZIONE === undefined) ? "" : oEmpdata[0].DATA_CESSAZIONE,
					//"CDC": oEmpdata[0].CDC,
					//"CDC_DBCENTRALE": (oEmpdata[0].CDC_DBCENTRALE === undefined) ? "" : oEmpdata[0].CDC_DBCENTRALE,
					//"DIPART_ID": (oEmpdata[0].DIPART_ID === undefined) ? "" : oEmpdata[0].DIPART_ID,
					//"EMAIL": oEmpdata[0].EMAIL,
					//"ACCOUNTNT": (oEmpdata[0].ACCOUNTNT === undefined) ? "" : oEmpdata[0].ACCOUNTNT,
					//"N_TIPO": (oEmpdata[0].N_TIPO === undefined) ? "" : oEmpdata[0].N_TIPO,
					//"STABILIMENTO_ATTUALE": oEmpdata[0].STABILIMENTO_ATTUALE,
					/// "STABILIMENTO": oEmpdata[0].STABILIMENTO_ATTUALE, /// PENDING
					//"RUOLO_PROF": (oEmpdata[0].RUOLO_PROF === undefined) ? "" : oEmpdata[0].RUOLO_PROF,
					//"HR1_PAYGRADE": (oEmpdata[0].HR1_PAYGRADE === undefined) ? "" : oEmpdata[0].HR1_PAYGRADE,
					//"DATETIME_CR": "2020-05-01T00:00:00", // oEmpdata[0].DATETIME_CR,
					//"DATETIME_CR": oEmpdata[0].DATETIME_CR,
					//"DATETIME_LM": "2020-05-01T00:00:00", //oEmpdata[0].DATETIME_LM,
					//"DATETIME_LM": oEmpdata[0].DATETIME_LM,
					//"LIVELLO": oEmpdata[0].LIVELLO,
					//"MATRICOLA_RESP": oEmpdata[0].MATRICOLA_RESP,
					//"UNITAORGANIZZATIVA": (oEmpdata[0].UNITAORGANIZZATIVA === undefined) ? "" : oEmpdata[0].UNITAORGANIZZATIVA,

					"Child1": oChild1Json,
					"Child2": oChild2Json
				};
				//}

				var sPayload = {
					"Object": {
						"Header": Header
					}
				};

				console.log("PAYLOAD");
				console.log(sPayload);

				// ********************************** Below Kapil Code. Alternative code to Jay code
				this.sServiceUrl = this.getOwnerComponent().getModel().sServiceUrl;

				$.ajax({
					url: this.sServiceUrl + "/",
					type: "GET",
					beforeSend: function (xhr) {
						xhr.setRequestHeader("X-CSRF-Token", "Fetch"); //Passing CSRF token fetch request in header of GET 
					},
					success: function (data, textStatus, XMLHttpRequest) {
						var token = XMLHttpRequest.getResponseHeader('X-CSRF-Token');
						$.ajax({
							url: "/HANAMDC/REPINT/RepintEmployee/xsjs/DeepInsert.xsjs",
							type: "POST",
							contentType: 'application/json',
							data: JSON.stringify(sPayload),
							//dataType: 'jsonp',
							beforeSend: function (xhr) {
								xhr.setRequestHeader("X-CSRF-Token", token); //Passing actual CSRF token we got from previous GET request
							},
							success: function (data1, textStatus1, XMLHttpRequest1) {
								console.log("*********** SUBMIT SUCCESS ******************");
								MessageBox.success(
									"Scheda inviata in approvazione"
								);

								that.getView().byId("idApprovazione1").setText(sap.ui.core.format.DateFormat.getDateTimeInstance({
									pattern: "yyyy-MM-dd HH:MM"
								}).format(new Date(), true));

								// Below logic to enable/disable "Delete" button from both Reperibilita and Interventi tables
								var oReperibilitaModelData1 = that.getView().byId("idTableReperibilita").getModel("RepintReperibilitaModel");
								var oInterventiModelData1 = that.getView().byId("idTableInterventi").getModel("RepintInterventiModel");
								if ((oReperibilitaModelData1.getProperty("/").length === 1) && (oReperibilitaModelData1.getProperty(
										"/0/DATAREPERIBILITA") !== "") && (oReperibilitaModelData1.getProperty("/0/DATAREPERIBILITA") !== null) && (
										oReperibilitaModelData1.getProperty("/0/DATAREPERIBILITA") != undefined)) {
									oReperibilitaModelData1.setProperty("/0/oButton2", true);
								}
								if ((oInterventiModelData1.getProperty("/").length === 1) && (oInterventiModelData1.getProperty("/0/DATAINTERVENTO") !==
										"") && (oInterventiModelData1.getProperty("/0/DATAINTERVENTO") !== null) && (oInterventiModelData1.getProperty(
										"/0/DATAINTERVENTO") != undefined)) {
									oInterventiModelData1.setProperty("/0/oButton2", true);
								}
								that.getOwnerComponent().getModel("viewProperties").setProperty("/IDSCHEDA", parseInt(data1.data[1].substr((data1.data[
										1]
									.indexOf(":") + 2))));

								that.getExpandData("success");

								// Logic to send Email notification to approver
								that.emailTrigerOnInvio();

							},
							error: function (data1, textStatus1, XMLHttpRequest1) {
								console.log("Error in DeepInsert");
								MessageBox.error("Errore nell'invio della scheda. Contatta l'amministratore");
								jQuery.sap.log.getLogger().error(
									"Error while perfoming Invio operation in handleCreate() function. Please contact administrator." + textStatus1.toString()
								);
								console.log(textStatus1);

							}
						});
					}
				});

			}

			/// ---------------------------------------------------------------------------------------------------------------

			// for (var i = 0; i < oReperibilitaModelData.length; ++i) {
			// 	if (oReperibilitaModelData[i].Dom === true) {
			// 		oReperibilitaModelData[i].TIPOGIORNO = "F";
			// 	} else if (oReperibilitaModelData[i].Sab === true) {
			// 		oReperibilitaModelData[i].TIPOGIORNO = "S";
			// 	} else {
			// 		oReperibilitaModelData[i].TIPOGIORNO = "L";
			// 	}

			// 	datearr = oReperibilitaModelData[i].DATAREPERIBILITA.split("-");
			// 	oReperibilitaModelData[i].DATAREPERIBILITA = datearr[2] + "-" + datearr[1] + "-" + datearr[0] + "T00:00:00";
			// }

			//...............................................................................................................................
			// 		var header_xcsrf_token = "";
			// 		OData.request({
			// 			requestUri: this.sServiceUrl + "/",
			// 			method: "GET",
			// 			async: false,
			// 			headers: {
			// 				"X-Requested-With": "XMLHttpRequest",
			// 				"Content-Type": "application/atom+xml",
			// 				"DataServiceVersion": "2.0",
			// 				"X-CSRF-Token": "Fetch"
			// 			}
			// 		}, function (data, response) {
			// 			header_xcsrf_token = response.headers['x-csrf-token'];
			// 		});

			// 		var sUrl = "/HANAMDC/REPINT/RepintEmployee/xsjs/DeepInsert.xsjs";
			// 		$.ajax({
			// 				url: sUrl,
			// 				async: false,
			// 				TYPE: "POST",
			// 				data: JSON.stringify(sPayload),
			// 				headers: {
			// 					"X-CSRF-Token": header_xcsrf_token
			// 				},
			// 				method: "POST",
			// 			    dataType: "json",
			// 				success: function (data) {
			// 				alert("hi");
			// 				},
			// 				error: function (err) {
			// alert("hello");
			// 				}
			// 			});

			// ********************************** Below Kapil Code. Alternative code to Jay code
			// $.ajax({
			// 	url: "/XSHANA_SSO/ccep/stargate/xs/dataplatform/archiveDPRows.xsjs",  
			// 	type: "GET",
			// 	beforeSend: function(xhr) {
			// 		xhr.setRequestHeader("X-CSRF-Token", "Fetch"); //Passing CSRF token fetch request in header of GET 
			// 	},
			// 	success: function(data, textStatus, XMLHttpRequest) {
			// 		var token = XMLHttpRequest.getResponseHeader('X-CSRF-Token');
			// 		$.ajax({
			// 			url: "/HANAMDC/REPINT/RepintEmployee/xsjs/DeepInsert.xsjs", 
			// 			type: "POST",
			// 			contentType: 'application/json',
			// 			data: JSON.stringify(del_row_data),
			// 			//dataType: 'jsonp',
			// 			beforeSend: function(xhr) {
			// 				xhr.setRequestHeader("X-CSRF-Token", token); //Passing actual CSRF token we got from previous GET request
			// 			},
			// 			success: function(data, textStatus, XMLHttpRequest) { //After SKU entry is uploaded in to table fetch it again and re-bind the table in UI
			// 				sap.ui.getCore().byId("dpApp").getParent().getController().onSearch();  

			// 				var msg = "Selected rows archived successfully !!";
			// 				messageToast.show(msg);
			// 			},
			// 			error: function(data, textStatus, XMLHttpRequest) {
			// 				var msg = "Failed to delete rows.";
			// 				messageToast.show(msg);
			// 			}
			// 		});
			// 	}
			// });				

		},

		handleDraft: function (oEvent) {

			var that = this;
			// Below condition added on 7th Dec 2020
			that.invioBozzaFlag = false;
			that.invioFlag = false;
			var oReperibilitaModelData = that.getView().byId("idTableReperibilita").getModel("RepintReperibilitaModel").getProperty("/");
			var oInterventiModelData = that.getView().byId("idTableInterventi").getModel("RepintInterventiModel").getProperty("/");
			var oInterventiDateModel = that.getView().byId("idTableInterventi").getModel("RepintInterventiModel");
			var oSortedInterventiModelData = that.getView().byId("idTableInterventi").getModel("RepintInterventiModel").getData();
			var datearr = [];

			// Below condition added on 7th Dec 2020
			that.invioBozzaFlag = true;

			/////var oEmpHdrData = that.getView().getModel("RepintEmpHdrModel").getData();
			var oEmpdata = that.getView().getModel("RepintEmpdataModel").getData();

			that.validateData(oEmpdata, oReperibilitaModelData, oInterventiModelData);

			if (that.getOwnerComponent().getModel("viewProperties").getProperty("/InterventiStatus") !== undefined &&
				that.getOwnerComponent().getModel("viewProperties").getProperty("/ReperibilitaStatus") !== undefined &&
				(!that.getOwnerComponent().getModel("viewProperties").getProperty("/InterventiStatus")) &&
				(!that.getOwnerComponent().getModel("viewProperties").getProperty("/ReperibilitaStatus"))
			) {
				MessageBox.error("Non sono stati inserite giornate di reperibilità e interventi eseguiti o programmati");
				return;
			}

			if (that.getOwnerComponent().getModel("viewProperties").getProperty("/validData")) { // Validation Success

				var uniqueinterventDates = $.unique(oInterventiDateModel.getData().map(function (value) {
					return value.DATAINTERVENTO;
				})); // Get Unique Interventi Dates

				//this.setStessacausale(oInterventiDateModel);
				//this.setStessacausaleForRIP(uniqueinterventDates, oSortedInterventiModelData);

				//if (true) {
				var oChild1Json = [];
				var oChild1JsonData = {};
				var oChild2Json = [];
				var oChild2JsonData = {};

				if (that.getOwnerComponent().getModel("viewProperties").getProperty("/ReperibilitaStatus")) { // Implies at least one Reperibilita record exists
					for (var i = 0; i < oReperibilitaModelData.length; ++i) {

						if (oReperibilitaModelData[i].Dom === true) {
							oReperibilitaModelData[i].TIPOGIORNO = "F";
						} else if (oReperibilitaModelData[i].Sab === true) {
							oReperibilitaModelData[i].TIPOGIORNO = "S";
						} else {
							oReperibilitaModelData[i].TIPOGIORNO = "L";
						}
						datearr = [];
						datearr = oReperibilitaModelData[i].DATAREPERIBILITA.split("-");
						////////oReperibilitaModelData[i].DATAREPERIBILITA = datearr[2] + "-" + datearr[1] + "-" + datearr[0] + "T00:00:00";

						oChild1JsonData = {
							"IDSCHEDA": oReperibilitaModelData[i].IDSCHEDA,
							///IDSCHEDA": parseInt("5"), // HARDCODED
							"IDREPERIBILITA": oReperibilitaModelData[i].IDREPERIBILITA,
							//"IDREPERIBILITA": parseInt("5"), // HARDCODED
							////////"DATAREPERIBILITA": oReperibilitaModelData[i].DATAREPERIBILITA,
							"DATAREPERIBILITA": datearr[2] + "-" + datearr[1] + "-" + datearr[0] + "T00:00:00",
							//"DATAREPERIBILITA": "2020-05-01T00:00:00", //"2020-05-01T00:00:00" HARDCODED
							"TIPOGIORNO": oReperibilitaModelData[i].TIPOGIORNO
						};
						oChild1Json.push(oChild1JsonData);
						oChild1JsonData = {};
					}
				} else { // Implies no Reperibilita record exists
					oChild1Json = [];
				}

				if (that.getOwnerComponent().getModel("viewProperties").getProperty("/InterventiStatus")) { // Implies at least one Interventi record exists
					datearr = []; // Reset date

					// for (var k = 0; k < oInterventiModelData.length; ++k) {
					// 	datearr = oInterventiModelData[k].DATAINTERVENTO.split("-");
					// 	oInterventiModelData[k].DATAINTERVENTO = datearr[2] + "-" + datearr[1] + "-" + datearr[0] + "T00:00:00";

					// 	if (oInterventiModelData[k].LPN) {
					// 		oInterventiModelData[k].FLAGNOTTURNO = 1;
					// 	} else {
					// 		oInterventiModelData[k].FLAGNOTTURNO = 0;
					// 	}
					// }

					var utcOraInizioTimeStamp;
					var utcOraFineTimeStamp;

					for (var j = 0; j < oInterventiModelData.length; ++j) {
						datearr = [];
						datearr = oInterventiModelData[j].DATAINTERVENTO.split("-");
						///////oInterventiModelData[j].DATAINTERVENTO = datearr[2] + "-" + datearr[1] + "-" + datearr[0] + "T00:00:00";
						// if (oInterventiModelData[j].LPN) {
						// 	oInterventiModelData[j].FLAGNOTTURNO = 1;
						// } else {
						// 	oInterventiModelData[j].FLAGNOTTURNO = 0;
						// }

						// utcOraInizioTimeStamp = new Date(oInterventiModelData[j].ORAINIZIOTIMESTAMP.getTime() + oInterventiModelData[j].ORAINIZIOTIMESTAMP.getTimezoneOffset() * 60000);
						// utcOraFineTimeStamp = new Date(oInterventiModelData[j].ORAFINETIMESTAMP.getTime() + oInterventiModelData[j].ORAFINETIMESTAMP.getTimezoneOffset() * 60000);

						utcOraInizioTimeStamp = oInterventiModelData[j].ORAINIZIOTIMESTAMP.toUTCString();
						utcOraFineTimeStamp = oInterventiModelData[j].ORAFINETIMESTAMP.toUTCString();

						oChild2JsonData = {
							"IDINTERVENTO": oInterventiModelData[j].IDINTERVENTO,
							//"IDINTERVENTO": parseInt("5"), // HARDCODED
							/////////////"DATAINTERVENTO": oInterventiModelData[j].DATAINTERVENTO,
							"DATAINTERVENTO": datearr[2] + "-" + datearr[1] + "-" + datearr[0] + "T00:00:00",
							//"DATAINTERVENTO": "2020-05-01T00:00:00", //"2020-05-01T00:00:00" HARDCODED
							"ORAINIZIO": oInterventiModelData[j].ORAINIZIO,
							"ORAFINE": oInterventiModelData[j].ORAFINE,
							// CHECK HARDCODED
							"CHIAMATODA": (oInterventiModelData[j].CHIAMATODA === undefined) ? "" : oInterventiModelData[j].CHIAMATODA,
							///"CHIAMATODA": "NOC", // HARDCODED
							"CAUSA": (oInterventiModelData[j].CAUSA === null || oInterventiModelData[j].CAUSA === undefined) ? "" : oInterventiModelData[
									j]
								.CAUSA,
							//"CAUSA": "Causa1", // HARDCODED
							"FASCIA": parseInt(oInterventiModelData[j].FASCIA),
							"IDSCHEDA": oInterventiModelData[j].IDSCHEDA,
							"STESSACAUSALE": oInterventiModelData[j].STESSACAUSALE,
							//"DURATA": parseInt(oInterventiModelData[j].DURATA), // ???
							"CONTINTERVENTO": (oInterventiModelData[j].CONTINTERVENTO === "" || oInterventiModelData[j].CONTINTERVENTO === null) ? 0 : (
								oInterventiModelData[j].CONTINTERVENTO),
							///"FLAGNOTTURNO": oInterventiModelData[j].FLAGNOTTURNO, // LPN Checkbox value
							"FLAGNOTTURNO": (oInterventiModelData[j].FLAGNOTTURNO) ? 1 : 0, // LPN Checkbox value
							////"FLAGNOTTURNO": parseInt(oInterventiModelData[j].FLAGNOTTURNO) ? 1 : 0, // LPN Checkbox value
							"FLAGCONT": (oInterventiModelData[j].FLAGCONT) ? 1 : 0, // RIP Checkbox value
							// "ORAFINETIMESTAMP": Formatter.formatUTCDate(oInterventiModelData[j].ORAFINETIMESTAMP) + ":00",
							// "ORAINIZIOTIMESTAMP": Formatter.formatUTCDate(oInterventiModelData[j].ORAINIZIOTIMESTAMP) + ":00",
							"ORAFINETIMESTAMP": Formatter.formatUTCDate(utcOraFineTimeStamp),
							"ORAINIZIOTIMESTAMP": Formatter.formatUTCDate(utcOraInizioTimeStamp),
							"WORKINGDAY": (oInterventiModelData[j].WORKINGDAY) ? 1 : 0,
							"NONWORKINGDAY": (oInterventiModelData[j].NONWORKINGDAY) ? 1 : 0,
							"CHECKOK": oInterventiModelData[j].CHECKOK,
							"RIPOSI": oInterventiModelData[j].RIPOSI,
							"CHIAMATODA_ALTRO": (oInterventiModelData[j].CHIAMATODA_ALTRO === undefined || oInterventiModelData[j].CHIAMATODA_ALTRO ===
								null || oInterventiModelData[j].CHIAMATODA_ALTRO === "") ? "" : oInterventiModelData[j].CHIAMATODA_ALTRO,
							"RIPOSI_HH": (oInterventiModelData[j].RIPOSI === "") ? 0 : parseInt(oInterventiModelData[j].RIPOSI.substr(0, (
								oInterventiModelData[j].RIPOSI.indexOf("H")))),
							"DURATA": parseInt(oInterventiModelData[j].MINDIFFORAINIFINE), // DURATA is same as MINDIFFORAINIFINE as "MINDIFFORAINIFINE" is added later
							"MINDIFFORAINIFINE": parseInt(oInterventiModelData[j].MINDIFFORAINIFINE),
							//"TOTALE_GIORNI_RIPOSI_COMPENSATIVI": oInterventiModelData[j].TOTALE_GIORNI_RIPOSI_COMPENSATIVI
							"TOTALE_GIORNI_RIPOSI_COMPENSATIVI": 0.0,
							"INTERVENTI_DETTAGLIO": ""
						};
						oChild2Json.push(oChild2JsonData);
						oChild2JsonData = {};
					}
				} else {
					oChild2Json = [];
				}

				var Header = {};
				datearr = []; // Reset date
				//var matricolaRespVal = "";

				// if (that.getOwnerComponent().getModel("viewProperties").getProperty("/MATRICOLA_DEPUTY") === undefined && (oEmpdata[0].MATRICOLA_RESP ===
				// 		"" || oEmpdata[0].MATRICOLA_RESP == undefined)) {
				// 	matricolaRespVal = null;
				// 	MessageBox.error("Resp. Servizio and Deputy Manager value both cannot be null");
				// 	return;

				// } 

				// Below condition added on 21st Jan to fix bug:
				// After the user insert or change the Delegato and (re)send (when he receives back the form when rejected) and than send again the form to the Manager, the Manager doesn't receive the form (form ID :  167823)
				if ((that.getOwnerComponent().getModel("viewProperties").getProperty("/MATRICOLA_DEPUTY") === undefined || that.getOwnerComponent()
						.getModel("viewProperties").getProperty("/MATRICOLA_DEPUTY") === "") && oEmpdata[0].MATRICOLA_RESP !==
					"") {
					//matricolaRespVal = oEmpdata[0].MATRICOLA_RESP;
					oEmpdata[0].MATRICOLA_DEPUTY = "";
				} else {
					//oEmpdata[0].MATRICOLA_RESP = "";
					oEmpdata[0].MATRICOLA_DEPUTY = that.getOwnerComponent().getModel("viewProperties").getProperty("/MATRICOLA_DEPUTY");
					//matricolaRespVal = 
				}

				// for (var i = 0; i < oEmpdata.length; ++i) {
				// 	"DATA_ASSUNZIONE": "2020-05-01T00:00:00",
				// 	"DATA_CESSAZIONE": "2020-05-01T00:00:00",
				// 	"DATETIME_CR": "2020-05-01T00:00:00",
				// 	"DATETIME_LM": "2020-05-01T00:00:00"
				// }

				//for (var l = 0; l < oEmpHdrData.length; ++l) {

				//var now = new Date();
				////var utcCreationDt = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
				var utcCreationDt = (new Date()).toUTCString(); // Current date and time
				Header = {

					"IDSCHEDA": that.getOwnerComponent().getModel("viewProperties").getProperty("/IDSCHEDA"),
					// "ANNOMESE": that.getOwnerComponent().getModel("viewProperties").getProperty("/ANNOMESE").split("-")[0] + "-" + this.getOwnerComponent()
					// 	.getModel("viewProperties").getProperty("/ANNOMESE").split("-")[1] + "-01", // + "-" + "01T00:00:00",
					///////"ANNOMESE": that.getOwnerComponent().getModel("viewProperties").getProperty("/ANNOMESE") + "-01",
					"ANNOMESE": that.getOwnerComponent().getModel("viewProperties").getProperty("/ANNOMESE").split("-")[0] + "-" + that.getOwnerComponent()
						.getModel("viewProperties").getProperty("/ANNOMESE").split("-")[1] + "-01",
					"STATO": 0, // Submit for Draft
					"DATACREAZIONE": Formatter.formatUTCDate(utcCreationDt),
					"ID": oEmpdata[0].ID,
					"MATRICOLA": oEmpdata[0].MATRICOLA,
					"COGNOME": oEmpdata[0].COGNOME,
					"NOME": oEmpdata[0].NOME,
					"CDC": oEmpdata[0].CDC,
					"EMAIL": oEmpdata[0].EMAIL,
					"STABILIMENTO_ATTUALE": oEmpdata[0].STABILIMENTO_ATTUALE,
					"LIVELLO": oEmpdata[0].LIVELLO,
					//"MATRICOLA_RESP": oEmpdata[0].MATRICOLA_RESP,
					"MATRICOLA_RESP": oEmpdata[0].MATRICOLA_RESP,
					"MATRICOLA_DEPUTY": oEmpdata[0].MATRICOLA_DEPUTY,
					"UNITAORGANIZZATIVA": oEmpdata[0].UNITAORGANIZZATIVA,
					"DEPARTMENT": oEmpdata[0].DEPARTMENT,
					"ManagerFirstName": oEmpdata[0].ManagerFirstName,
					"ManagerLastName": oEmpdata[0].ManagerLastName,

					//"ID": oEmpdata[0].ID,
					//"SUPERID": (oEmpdata[0].SUPERID === undefined) ? "" : oEmpdata[0].SUPERID,
					//"MATRICOLA": oEmpdata[0].MATRICOLA,
					//"COGNOME": oEmpdata[0].COGNOME,
					//"NOME": oEmpdata[0].NOME,
					//"CODICE_FISCALE": (oEmpdata[0].CODICE_FISCALE === undefined) ? "" : oEmpdata[0].CODICE_FISCALE,
					//"STATUS_DIPENDENTE": (oEmpdata[0].STATUS_DIPENDENTE === undefined) ? "" : oEmpdata[0].STATUS_DIPENDENTE,
					//"DATA_ASSUNZIONE": (oEmpdata[0].DATA_ASSUNZIONE === undefined) ? "" : oEmpdata[0].DATA_ASSUNZIONE,
					//"DATA_CESSAZIONE": (oEmpdata[0].DATA_CESSAZIONE === undefined) ? "" : oEmpdata[0].DATA_CESSAZIONE,
					//"CDC": oEmpdata[0].CDC,
					//"CDC_DBCENTRALE": (oEmpdata[0].CDC_DBCENTRALE === undefined) ? "" : oEmpdata[0].CDC_DBCENTRALE,
					//"DIPART_ID": (oEmpdata[0].DIPART_ID === undefined) ? "" : oEmpdata[0].DIPART_ID,
					//"EMAIL": oEmpdata[0].EMAIL,
					//"ACCOUNTNT": (oEmpdata[0].ACCOUNTNT === undefined) ? "" : oEmpdata[0].ACCOUNTNT,
					//"N_TIPO": (oEmpdata[0].N_TIPO === undefined) ? "" : oEmpdata[0].N_TIPO,
					//"STABILIMENTO_ATTUALE": oEmpdata[0].STABILIMENTO_ATTUALE,
					/// "STABILIMENTO": oEmpdata[0].STABILIMENTO_ATTUALE, /// PENDING
					//"RUOLO_PROF": (oEmpdata[0].RUOLO_PROF === undefined) ? "" : oEmpdata[0].RUOLO_PROF,
					//"HR1_PAYGRADE": (oEmpdata[0].HR1_PAYGRADE === undefined) ? "" : oEmpdata[0].HR1_PAYGRADE,
					//"DATETIME_CR": "2020-05-01T00:00:00", // oEmpdata[0].DATETIME_CR,
					//"DATETIME_CR": oEmpdata[0].DATETIME_CR,
					//"DATETIME_LM": "2020-05-01T00:00:00", //oEmpdata[0].DATETIME_LM,
					//"DATETIME_LM": oEmpdata[0].DATETIME_LM,
					//"LIVELLO": oEmpdata[0].LIVELLO,
					//"MATRICOLA_RESP": oEmpdata[0].MATRICOLA_RESP,
					//"UNITAORGANIZZATIVA": (oEmpdata[0].UNITAORGANIZZATIVA === undefined) ? "" : oEmpdata[0].UNITAORGANIZZATIVA,

					"Child1": oChild1Json,
					"Child2": oChild2Json
				};
				//}

				var sPayload = {
					"Object": {
						"Header": Header
					}
				};

				console.log("PAYLOAD");
				console.log(sPayload);

				// ********************************** Below Kapil Code. Alternative code to Jay code
				this.sServiceUrl = this.getOwnerComponent().getModel().sServiceUrl;

				$.ajax({
					url: this.sServiceUrl + "/",
					type: "GET",
					beforeSend: function (xhr) {
						xhr.setRequestHeader("X-CSRF-Token", "Fetch"); //Passing CSRF token fetch request in header of GET 
					},
					success: function (data, textStatus, XMLHttpRequest) {
						var token = XMLHttpRequest.getResponseHeader('X-CSRF-Token');
						$.ajax({
							url: "/HANAMDC/REPINT/RepintEmployee/xsjs/DeepInsert.xsjs",
							type: "POST",
							contentType: 'application/json',
							data: JSON.stringify(sPayload),
							//dataType: 'jsonp',
							beforeSend: function (xhr) {
								xhr.setRequestHeader("X-CSRF-Token", token); //Passing actual CSRF token we got from previous GET request
							},
							success: function (data1, textStatus1, XMLHttpRequest1) {
								console.log("*********** DRAFT SUCCESS ******************");
								MessageBox.success(
									"Scheda salvata in bozza"
								);
								// console.log(data1);
								// console.log(textStatus1);

								that.getView().byId("idApprovazione1").setText(sap.ui.core.format.DateFormat.getDateTimeInstance({
									pattern: "yyyy-MM-dd HH:MM"
								}).format(new Date(), true));

								// Below logic to enable/disable "Delete" button from both Reperibilita and Interventi tables
								var oReperibilitaModelData1 = that.getView().byId("idTableReperibilita").getModel("RepintReperibilitaModel");
								var oInterventiModelData1 = that.getView().byId("idTableInterventi").getModel("RepintInterventiModel");
								if ((oReperibilitaModelData1.getProperty("/").length === 1) && (oReperibilitaModelData1.getProperty(
										"/0/DATAREPERIBILITA") !== "") && (oReperibilitaModelData1.getProperty("/0/DATAREPERIBILITA") !== null) && (
										oReperibilitaModelData1.getProperty("/0/DATAREPERIBILITA") != undefined)) {
									oReperibilitaModelData1.setProperty("/0/oButton2", true);
								}
								if ((oInterventiModelData1.getProperty("/").length === 1) && (oInterventiModelData1.getProperty("/0/DATAINTERVENTO") !==
										"") && (oInterventiModelData1.getProperty("/0/DATAINTERVENTO") !== null) && (oInterventiModelData1.getProperty(
										"/0/DATAINTERVENTO") != undefined)) {
									oInterventiModelData1.setProperty("/0/oButton2", true);
								}
								that.getOwnerComponent().getModel("viewProperties").setProperty("/IDSCHEDA", parseInt(data1.data[1].substr((data1.data[
										1]
									.indexOf(":") + 2))));

								that.getExpandData("success");

								// 29th Jan - Remove below logic - 
								// Logic to send Email notification to approver
								that.emailTrigerOnInvio();
							},
							error: function (data1, textStatus1, XMLHttpRequest1) {
								console.log("Error in DeepInsert");
								MessageBox.error("Errore nel salvataggio in bozza della scheda. Contatta l'amministratore");
								jQuery.sap.log.getLogger().error("Error while perfoming Invio Bozza. Please contact administrator." + textStatus1.toString());
								console.log(textStatus1);

							}
						});
					}
				});

			}

			/// ---------------------------------------------------------------------------------------------------------------

			// for (var i = 0; i < oReperibilitaModelData.length; ++i) {
			// 	if (oReperibilitaModelData[i].Dom === true) {
			// 		oReperibilitaModelData[i].TIPOGIORNO = "F";
			// 	} else if (oReperibilitaModelData[i].Sab === true) {
			// 		oReperibilitaModelData[i].TIPOGIORNO = "S";
			// 	} else {
			// 		oReperibilitaModelData[i].TIPOGIORNO = "L";
			// 	}

			// 	datearr = oReperibilitaModelData[i].DATAREPERIBILITA.split("-");
			// 	oReperibilitaModelData[i].DATAREPERIBILITA = datearr[2] + "-" + datearr[1] + "-" + datearr[0] + "T00:00:00";
			// }

			//...............................................................................................................................
			// 		var header_xcsrf_token = "";
			// 		OData.request({
			// 			requestUri: this.sServiceUrl + "/",
			// 			method: "GET",
			// 			async: false,
			// 			headers: {
			// 				"X-Requested-With": "XMLHttpRequest",
			// 				"Content-Type": "application/atom+xml",
			// 				"DataServiceVersion": "2.0",
			// 				"X-CSRF-Token": "Fetch"
			// 			}
			// 		}, function (data, response) {
			// 			header_xcsrf_token = response.headers['x-csrf-token'];
			// 		});

			// 		var sUrl = "/HANAMDC/REPINT/RepintEmployee/xsjs/DeepInsert.xsjs";
			// 		$.ajax({
			// 				url: sUrl,
			// 				async: false,
			// 				TYPE: "POST",
			// 				data: JSON.stringify(sPayload),
			// 				headers: {
			// 					"X-CSRF-Token": header_xcsrf_token
			// 				},
			// 				method: "POST",
			// 			    dataType: "json",
			// 				success: function (data) {
			// 				alert("hi");
			// 				},
			// 				error: function (err) {
			// alert("hello");
			// 				}
			// 			});

			// ********************************** Below Kapil Code. Alternative code to Jay code
			// $.ajax({
			// 	url: "/XSHANA_SSO/ccep/stargate/xs/dataplatform/archiveDPRows.xsjs",  
			// 	type: "GET",
			// 	beforeSend: function(xhr) {
			// 		xhr.setRequestHeader("X-CSRF-Token", "Fetch"); //Passing CSRF token fetch request in header of GET 
			// 	},
			// 	success: function(data, textStatus, XMLHttpRequest) {
			// 		var token = XMLHttpRequest.getResponseHeader('X-CSRF-Token');
			// 		$.ajax({
			// 			url: "/HANAMDC/REPINT/RepintEmployee/xsjs/DeepInsert.xsjs", 
			// 			type: "POST",
			// 			contentType: 'application/json',
			// 			data: JSON.stringify(del_row_data),
			// 			//dataType: 'jsonp',
			// 			beforeSend: function(xhr) {
			// 				xhr.setRequestHeader("X-CSRF-Token", token); //Passing actual CSRF token we got from previous GET request
			// 			},
			// 			success: function(data, textStatus, XMLHttpRequest) { //After SKU entry is uploaded in to table fetch it again and re-bind the table in UI
			// 				sap.ui.getCore().byId("dpApp").getParent().getController().onSearch();  

			// 				var msg = "Selected rows archived successfully !!";
			// 				messageToast.show(msg);
			// 			},
			// 			error: function(data, textStatus, XMLHttpRequest) {
			// 				var msg = "Failed to delete rows.";
			// 				messageToast.show(msg);
			// 			}
			// 		});
			// 	} 
			// });				

		},

		handleStornata: function () {
			var that = this;
			var authData = that.getOwnerComponent().getModel("EmpAuthoModel");
			var idScheda = that.getOwnerComponent().getModel("viewProperties").getProperty("/IDSCHEDA");
			var annomeseValue = that.getOwnerComponent().getModel("viewProperties").getProperty("/ANNOMESE").split("-")[0] + "-" + that.getOwnerComponent()
				.getModel("viewProperties").getProperty("/ANNOMESE").split("-")[1] + "-01T00:00:00";
			var path = "/DATEDIPROCESSOSet?$filter=MESEANNO eq datetime'" + annomeseValue + "'"; // "2020-07-01T00:00:00"

			var oRepintDateDiProcessoJsonData = {};
			var oRepintDateDiProcessoSetModel = new sap.ui.model.json.JSONModel();
			var oRepintDateDiProcessoetJson = [];

			var xsoDataModel1 = new sap.ui.model.odata.ODataModel("/HANAMDC/REPINT/RepintApproval/xsodata/RepintApproval.xsodata/");
			xsoDataModel1.attachRequestSent(function () {
				that._busyDialog.open();
			});
			xsoDataModel1.attachRequestCompleted(function () {
				that._busyDialog.close();
			});

			xsoDataModel1.read(path, {
				success: function (oDataIn, oResponse) {
					console.log(" DateSet ");
					console.log(oDataIn);

					if (oDataIn.results.length === 0) {
						MessageBox.error("Impossibile effettuare il richiamo della scheda per questo mese. Contatta l'amministratore Area HR");
						return;
					} else {
						oRepintDateDiProcessoJsonData = {
							"MESEANNO": Formatter.formatUTCDate(oDataIn.results[0].MESEANNO),
							"DIPENDENTE": Formatter.formatUTCDate(oDataIn.results[0].DIPENDENTE)
						};
						var utcCreationDt = (new Date()).toUTCString(); // Current date and time
						var currentDate = Formatter.formatUTCDate(utcCreationDt);
						if ((authData.getData()[0].ROLE_EMP === "X") && currentDate <= oRepintDateDiProcessoJsonData.DIPENDENTE) {
							var oEntry = {};
							oEntry.STATO = 300;

							var xsoBaseModel = that.getOwnerComponent().getModel("basexsoModel");
							xsoBaseModel.update("/RepintEmpHeader(" + idScheda + ")",
								oEntry, {
									success: function (oResponse) {
										that.getExpandData("onload");
										MessageBox.success("La scheda è stata richiamata con successo");
									},
									error: function (oError) {
										MessageBox.error("Il richiamo della scheda non è andato a buon fine. Contatta l'amministratore");
										jQuery.sap.log.getLogger().error("Update failed" + oError.toString());
									}
								});
						} else {
							MessageBox.error("La data è maggiore del mese/anno da richiamare. Contatta l'ammnistratore");
						}
					}

				}.bind(this),
				error: function (oError) {
					//Handle the error
					MessageBox.error("Impossibile ottenere le informazioni per richiamare la scheda. Contatta l'amministratore");
					jQuery.sap.log.getLogger().error("Data fetch failed for DATEDIPROCESSOSet.Please contact administrator." + oError.toString());
				}.bind(this)
			});

		},

		// This function is called to trigger email notification for approval on performing "Invio" operation
		emailTrigerOnInvio: function () {
			var that = this;
			//var _name = "";
			//var _FULLNAME = "";
			//var _FULLMATRICOLA_DEPUTY = "";
			var body;
			var _SURNAME = "";
			var _NAME = "";
			var _SURNAMEMATDEP = "";
			var _NAMEMATDEP = "";
			var validFlag = false;
			var oEmpdata = that.getView().getModel("RepintEmpdataModel").getData();

			// if ((that.getOwnerComponent().getModel("viewProperties").getProperty("/MATRICOLA_DEPUTY") === undefined || that.getOwnerComponent()
			// 		.getModel("viewProperties").getProperty("/MATRICOLA_DEPUTY") === "") && oEmpdata[0].MATRICOLA_RESP !==
			// 	"") {
			if ((that.getView().byId("idRepintCambioResp").getValue() === "" || that.getView().byId("idRepintCambioResp").getValue() ===
					undefined || that.getView().byId("idRepintCambioResp").getValue() === null) && oEmpdata[0].MATRICOLA_RESP !== "") {
				validFlag = true;
				
				//_name = oEmpdata[0].MATRICOLA_RESP;
				//_FULLNAME = that.getView().byId("idLineMgr").getValue();

				_NAME = oEmpdata[0].ManagerFirstName;
				_SURNAME = oEmpdata[0].ManagerLastName;
				
				// Email Trigger
				body = "<html><head></head>MATRIDMGR = "+ oEmpdata[0].MATRICOLA_RESP +"<body><font>Nella tua inbox per app approval c'è la scheda per il dipendente<b> " + _SURNAME + " " +  _NAME + ".</b></font></body></html>";
				
							$.ajax({
								url: "/email/http/REPINT_Manager_Deputy_Card_Approval",
								type: "POST",
								data: body,
								dataType: "text",
								contentType: "text/xml; charset=\"utf-8\"",
								success: function (data, textStatus, jqXHR) {},
								error: function (xhr, status) {}
							});								
				
				
			} else {
				//oEmpdata[0].MATRICOLA_RESP = "";
				/////_name = that.getOwnerComponent().getModel("viewProperties").getProperty("/MATRICOLA_DEPUTY");
				///_FULLMATRICOLA_DEPUTY = that.getView().byId("idRepintCambioResp").getValue();

				// Getting Matricola Delegato data
				var matricolaDeputy = that.getView().getModel("RepintEmpHdrModel").getData()[0].MATRICOLA_DEPUTY;
				if (matricolaDeputy !== "" && matricolaDeputy !== null && matricolaDeputy !== undefined) {
					validFlag = true;
					var RepintCambioRespModelData = that.getView().byId("idRepintCambioResp").getModel("RepintCambioRespModel").getData();

					// Filter records from RepintCambioRespModel based on "Matricola_Deputy" value
					var matricolaDeputyData = jQuery.grep(RepintCambioRespModelData, function (a) {
						return (a.MATRICOLA_DEPUTY == matricolaDeputy);
					});
					console.log("MATRICOLA DEPUTY EMAIL");
					console.log(matricolaDeputyData);

					if (matricolaDeputyData) {
						if (matricolaDeputyData.length > 0) {
							_NAMEMATDEP = matricolaDeputyData[0].NOME_DELEGATO;
							_SURNAMEMATDEP = matricolaDeputyData[0].COGNOME_DELEGATO;
							
							// Email Trigger
    						body = "<html><head></head><body><font>Nella tua inbox per app approval c'è la scheda per il dipendente<b> " + _SURNAMEMATDEP + " " +  _NAMEMATDEP + ".</b></font> <br> <font><b>" + matricolaDeputy  + "</b>" + "</font></body></html>";							
							//body = "<html><head></head><body><font>Nella tua inbox per app approval c'è la scheda per il dipendente<b> " + _SURNAMEMATDEP + " " + _NAMEMATDEP + ".</b></font></body></html>";
				
							$.ajax({
								url: "/email/http/REPINT_Manager_Deputy_Card_Approval",
								type: "POST",
								data: body,
								dataType: "text",
								contentType: "text/xml; charset=\"utf-8\"",
								success: function (data, textStatus, jqXHR) {},
								error: function (xhr, status) {}
							});								
						}
					}
				}
			}

			if (!validFlag) {
				MessageBox.error(
					"Mail notification cannot be triggered as the data of approver is not properly maintained"
				);
			}
		}

	});

});