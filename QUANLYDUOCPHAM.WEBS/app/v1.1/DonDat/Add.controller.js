
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

                    this.getView().byId('maDonDat').setValue('');
                    this.setState("maDonDat", 'None');
                    
                    this.getView().byId('maKH').setValue('');
                    this.setState("maKH", 'None');
                    
                    this.getView().byId('ngayDat').setValue('');
                    this.setState("ngayDat", 'None');
                    
            },
            closeArea: function () {
                this.clearForm();
                this.bus.publish('DonDatChanel', "closeDonDatAdd")
            },
            save: function () {
                var root = this;
                if (true) {
                    let dataBody = this.getTextInput();
                    let addModel = new CoreJsonModel();
                    addModel.postToAPI(sdConfig.adminApiEndpoint + "dondat/add", dataBody).success(dt => {
                        MessageToast.show(dt.message);
                        root.closeArea();
                    })
                    this.clearForm();
                }
            },

            getTextInput: function () {
                let bodyData = {

    id: String(this.getView().byId('maDonDat').getValue()).trim(),
    
    makh: String(this.getView().byId('maKH').getValue()).trim(),
    
    ngaydat: String(this.getView().byId('ngayDat').getValue()).trim(),
    
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
    