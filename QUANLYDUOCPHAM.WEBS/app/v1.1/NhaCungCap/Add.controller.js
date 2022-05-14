
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

            this.getView().byId('maNCC').setValue('');
            this.setState("maNCC", 'None');

            this.getView().byId('TenNCC').setValue('');
            this.setState("TenNCC", 'None');

            this.getView().byId('diaChi').setValue('');
            this.setState("diaChi", 'None');

            this.getView().byId('dienThoai').setValue('');
            this.setState("dienThoai", 'None');

        },
        closeArea: function () {
            this.clearForm();
            this.bus.publish('NhaCungCapChanel', "closeNhaCungCapAdd")
        },
        save: function () {
            var root = this;
            if (true) {
                let dataBody = this.getTextInput();
                let addModel = new CoreJsonModel();
                addModel.postToAPI(sdConfig.adminApiEndpoint + "nhaccungcap/add", dataBody).success(dt => {
                    MessageToast.show(dt.message);
                    root.closeArea();
                })
                this.clearForm();
            }
        },

        getTextInput: function () {
            let bodyData = {
                id: String(this.getView().byId('maNCC').getValue()).trim(),

                tenncc: String(this.getView().byId('TenNCC').getValue()).trim(),

                diachi: String(this.getView().byId('diaChi').getValue()).trim(),

                dienthoai: String(this.getView().byId('dienThoai').getValue()).trim(),
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
