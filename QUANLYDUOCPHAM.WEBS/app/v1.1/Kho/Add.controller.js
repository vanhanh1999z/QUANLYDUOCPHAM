
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

                    this.getView().byId('maKho').setValue('');
                    this.setState("maKho", 'None');
                    
                    this.getView().byId('tenKho').setValue('');
                    this.setState("tenKho", 'None');
                    
                    this.getView().byId('diaChi').setValue('');
                    this.setState("diaChi", 'None');
                    
            },
            closeArea: function () {
                this.clearForm();
                this.bus.publish('KhoChanel', "closeKhoAdd")
            },
            save: function () {
                var root = this;
                if (true) {
                    let dataBody = this.getTextInput();
                    let addModel = new CoreJsonModel();
                    addModel.postToAPI(sdConfig.adminApiEndpoint + "kho/add", dataBody).success(dt => {
                        MessageToast.show(dt.message);
                        root.closeArea();
                    })
                    this.clearForm();
                }
            },

            getTextInput: function () {
                let bodyData = {

    id: String(this.getView().byId('maKho').getValue()).trim(),
    
    tenkho: String(this.getView().byId('tenKho').getValue()).trim(),
    
    diachi: String(this.getView().byId('diaChi').getValue()).trim(),
    
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
    