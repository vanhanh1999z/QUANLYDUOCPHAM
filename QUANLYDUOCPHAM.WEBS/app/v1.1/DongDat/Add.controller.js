
    sap.ui.define([
        'sap/ui/core/Core',
        'sap/ui/core/mvc/Controller',
        'sap/m/MessageToast',
        'sap/m/MessageBox',
        'app/ext/Auth.Connector.Adal',
        'app/ext/CoreJsonModel',
        'app/globalformatter',
        'sap/ui/core/Fragment',
        'sap/ui/export/Spreadsheet',
        'sap/ui/Device'
    ], function (Core, Controller, MessageToast, MessageBox, Connector, CoreJsonModel, GlobalFormatter, Fragment, Spreadsheet, Device) {
        'use strict';
        const oController = {
            globalFormatter: GlobalFormatter,
            onInit: function () {
                this.router = sap.ui.core.UIComponent.getRouterFor(this);
                this.bus = Core.getEventBus();
            },
            onExit: function () {
            },
            clearForm: function () {

                    this.getView().byId('iddondat').setValue('');
                    this.setState("iddondat", 'None');
                    
                    this.getView().byId('idhang').setValue('');
                    this.setState("idhang", 'None');
                    
                    this.getView().byId('soluong').setValue('');
                    this.setState("soluong", 'None');
                    
            },
            closeArea: function () {
                this.clearForm();
                this.bus.publish('DongDatChanel', "closeDongDatAdd")
            },
            save: function () {
                var root = this;
                if (true) {
                    let dataBody = this.getTextInput();
                    let addModel = new CoreJsonModel();
                    addModel.postToAPI(sdConfig.adminApiEndpoint + "dongdat/add", dataBody).success(dt => {
                        MessageToast.show(dt.message);
                        root.closeArea();
                    })
                    this.clearForm();
                }
            },

            getTextInput: function () {
                let bodyData = {

    iddondat: String(this.getView().byId('iddondat').getValue()).trim(),
    
    idhang: String(this.getView().byId('idhang').getValue()).trim(),
    
    soluong: String(this.getView().byId('soluong').getValue()).trim(),
    
                };
                return bodyData
            },


            setState: function (id, state, valueState = '') {
                this.getView().byId(id).setValueState(state);
                this.getView().byId(id).setValueStateText(valueState);
            }
        };

        return Controller.extend('app.Device.List', oController);
    });
    