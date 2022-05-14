
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
        mainModel: new CoreJsonModel(),
        onInit: function () {
            this.router = sap.ui.core.UIComponent.getRouterFor(this);
            this.bus = sap.ui.getCore().getEventBus();
            this.getView().setModel(this.mainModel, 'mainModel');
            this.bus.subscribe('NhaCungCapChanel', 'loadEditPage', this.loadEditPage, this);
        },
        onExit: function () {
            this.bus.unsubscribe('NhaCungCapChanel', 'loadEditPage', this.loadEditPage, this);
        },
        loadEditPage: function (sChanel, sEvent, oData) {
            let root = this;
            new CoreJsonModel().getById(sdConfig.adminApiEndpoint + 'nhaccungcap', String(oData.Id).trim()).success(dt => {
                if (dt.success === true) {
                    root.mainModel.setData({
                        ...dt.data
                    });
                } else {
                    MessageToast.show(dt.message)
                }
            })
        },
        clearForm: function () {

            this.getView().byId('maNCC').setValue('');
            this.setState("maNCC", 'None');
            this.getView().byId('TenNCC').setValue('')
            this.setState("TenNCC", 'None');
            this.getView().byId('diaChi').setValue('')
            this.setState("diaChi", 'None');
            this.getView().byId('dienThoai').setValue('')
            this.setState("dienThoai", 'None');

        },
        onCancel: function () {
            this.bus.publish('NhaCungCapChanel', 'closeEdit')
            this.clearForm();

        },
        save: function () {
            var root = this;
            if (true) {
                let dataBody = this.getTextInput();
                let addModel = new CoreJsonModel();
                addModel.postToAPI(sdConfig.adminApiEndpoint + "NhacCungCap/update", dataBody).success(dt => {
                    MessageToast.show(dt.message);
                    root.onCancel();
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
    return Controller.extend('app.NhaCungCap.List', oController);
});
