
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
        phieuNhapModel: new CoreJsonModel(),
        phieuGiaoModel: new CoreJsonModel(),
        phieuNhapData: [],
        phieuGiaoData: [],
        onInit: function () {
            this.router = sap.ui.core.UIComponent.getRouterFor(this);
            this.bus = Core.getEventBus();
            this.getView().setModel(this.phieuNhapModel, 'phieuNhapModel');
            this.getView().setModel(this.phieuGiaoModel, 'phieuGiaoModel');
            this.initialize();
        },
        onExit: function () {
        },
        initialize: function () {
            this.loadDataHang();
            this.loadDataKho();
            this.dataBodyToApi();
        },
        clearForm: function () {

        },
        closeArea: function () {
            this.clearForm();
            this.bus.publish('KhoHangChanel', "closeKhoHangAdd")
        },
        save: function () {
            var root = this;
            if (true) {
                let dataBody = this.getTextInput();
                let addModel = new CoreJsonModel();
                addModel.postToAPI(sdConfig.adminApiEndpoint + "khohang/add", dataBody).success(dt => {
                    MessageToast.show(dt.message);
                    root.closeArea();
                })
                this.clearForm();
            }
        },
        dataBodyToApi: function () {
            console.log(this.phieuNhapData)
        },
        loadDataKho: async function () {
            var root = this;
            if (true) {
                await new CoreJsonModel().getAll(sdConfig.adminApiEndpoint + "phieunhap/getall").success(dt => {
                    if (dt) {
                        root.phieuNhapModel.setData({ ...dt.data });
                        this.phieuNhapData = dt.data.map(dt => dt);
                    }
                })
                this.clearForm();
            }
        },
        loadDataHang: async function () {
            var root = this;
            if (true) {
                await new CoreJsonModel().getAll(sdConfig.adminApiEndpoint + "phieugiao/getall").success(dt => {
                    if (dt) {
                        root.phieuGiaoModel.setData({ ...dt.data });
                        this.phieuGiaoData = dt.data.map(dt => dt);
                    }
                })
                this.clearForm();
            }
        },

        getTextInput: function () {
            let bodyData = {

                idkho: String(this.getView().byId('idkho').getValue()).trim(),

                idhang: String(this.getView().byId('idhang').getValue()).trim(),

            };
            return bodyData
        },



    };

    return Controller.extend('app.Device.List', oController);
});
