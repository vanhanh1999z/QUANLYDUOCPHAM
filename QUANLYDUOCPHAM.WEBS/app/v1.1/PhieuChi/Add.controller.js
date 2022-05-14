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
    'sap/ui/Device',
    'app/ext/Base.Controller',

], function(Core, Controller, MessageToast, MessageBox, Connector, CoreJsonModel, GlobalFormatter, Fragment, Spreadsheet, Device, Base) {
    'use strict';
    const GROUP_NAME = 'addGroup';
    const oController = {
        globalFormatter: GlobalFormatter,
        nccModel: new CoreJsonModel(),
        phieuNhapModel: new CoreJsonModel(),
        currencyInput: new CoreJsonModel({
            "sotientra": ["0"]
        }),
        baseControl: new Base(),
        onInit: function() {
            this.router = sap.ui.core.UIComponent.getRouterFor(this);
            this.bus = Core.getEventBus();
            this.getView().setModel(this.nccModel, 'nccModel');
            this.getView().setModel(this.currencyInput);
            this.getView().setModel(this.phieuNhapModel, 'phieuNhapModel');
            this.initialize();
        },
        initialize: function() {
            this.loadNCCData();
            this.loadPhieuNhapData();
        },
        onExit: function() {},
        clearForm: function() {
            this.baseControl.resetDataFromGroup(GROUP_NAME);
        },
        closeArea: function() {
            this.clearForm();
            this.bus.publish('PhieuChiChanel', "closePhieuChiAdd")
        },
        loadNCCData: function() {
            let root = this;
            new CoreJsonModel().getAll(sdConfig.adminApiEndpoint + 'nhaccungcap/getall').success(dt => {
                if (dt.success === true) {
                    let oData = dt.data.map(dt => dt);
                    oData.unshift({
                        id: '-1',
                        tenncc: 'Vui lòng lựa chọn nhà cung cấp...'
                    })
                    root.nccModel.setData(oData);
                } else {
                    MessageToast.show(dt.message)
                }
            })
        },
        loadPhieuNhapData: function() {
            let root = this;
            new CoreJsonModel().getAll(sdConfig.adminApiEndpoint + 'phieunhap/getall').success(dt => {
                if (dt.success === true) {
                    let oData = dt.data.map(dt => dt);
                    root.phieuNhapModel.setData(oData);
                } else {
                    MessageToast.show(dt.message)
                }
            })
        },
        save: function() {
            var root = this;
            if (true) {
                let dataBody = this.baseControl.getDataFromGroup(GROUP_NAME); {
                    let { sotientra } = this.currencyInput.getData();
                    dataBody.sotientra = sotientra;
                }
                let addModel = new CoreJsonModel();
                addModel.postToAPI(sdConfig.adminApiEndpoint + "phieuchi/add", dataBody).success(dt => {
                    MessageToast.show(dt.message);
                    root.closeArea();
                })
                this.clearForm();
            }
        },
        onValueHelpRequest: function() {
            var oView = this.getView();
            if (!this._pValueHelpDialog) {
                this._pValueHelpDialog = Fragment.load({
                    id: oView.getId(),
                    name: "app.PhieuChi.Fragment.Select",
                    controller: this
                }).then(function(oValueHelpDialog) {
                    oView.addDependent(oValueHelpDialog);
                    return oValueHelpDialog;
                });
            }
            this._pValueHelpDialog.then(function(oValueHelpDialog) {
                oValueHelpDialog.open();
            }.bind(this));
        },
        onValueHelpDialogClose: function(oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput = this.byId("idPhieuNhap");

            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }
            oInput.setValue(oSelectedItem.getTitle());
        },
        onSearch: function(oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("ID", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter([oFilter]);
        },
    };

    return Controller.extend('app.Device.List', oController);
});