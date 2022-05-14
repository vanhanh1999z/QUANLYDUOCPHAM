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
    const oController = {
        globalFormatter: GlobalFormatter,
        mainModel: new CoreJsonModel(),
        khoModel: new CoreJsonModel(),
        donDatModel: new CoreJsonModel(),
        orgData: {},
        Base: new Base(),
        onInit: function() {
            this.router = sap.ui.core.UIComponent.getRouterFor(this);
            this.bus = sap.ui.getCore().getEventBus();

            this.getView().setModel(this.mainModel, 'mainModel');
            this.getView().setModel(this.khoModel, 'khoModel');
            this.getView().setModel(this.donDatModel, 'donDatModel');

            this.bus.subscribe('PhieuGiaoChanel', 'loadEditPage', this.loadEditPage, this);

            this.initialize();
        },
        initialize: function() {
            this.loadDataDonDat();
            this.loadDataKho();
        },
        onExit: function() {
            this.bus.unsubscribe('PhieuGiaoChanel', 'loadEditPage', this.loadEditPage, this);
        },
        loadEditPage: function(sChanel, sEvent, oData) {
            let root = this;
            new CoreJsonModel().getById(sdConfig.adminApiEndpoint + 'phieugiao', String(oData.Id).trim()).success(dt => {
                if (dt.success === true) {
                    root.mainModel.setData({
                        ...dt.data[0]
                    });
                    this.orgData = {...dt.data[0] }
                } else {
                    MessageToast.show(dt.message)
                }
            })
        },
        loadDataKho: function() {
            let root = this;
            new CoreJsonModel().getAll(sdConfig.adminApiEndpoint + 'kho/getall').success(dt => {
                if (dt.success === true) {
                    root.khoModel.setData({
                        ...dt.data
                    });
                    this.orgData = {...dt.data[0] }
                } else {
                    MessageToast.show(dt.message)
                }
            })
        },
        loadDataDonDat: function() {
            let root = this;
            new CoreJsonModel().getAll(sdConfig.adminApiEndpoint + 'dondat/getall').success(dt => {
                if (dt.success === true) {
                    root.donDatModel.setData({
                        ...dt.data
                    });
                    this.orgData = {...dt.data[0] }
                } else {
                    MessageToast.show(dt.message)
                }
            })
        },
        clearForm: function() {
            this.mainModel.setData({...this.orgData });
        },
        onCancel: function() {
            this.bus.publish('PhieuGiaoChanel', 'closeEdit')
            this.clearForm();

        },
        save: function() {
            var root = this;
            if (true) {
                let dataBody = {...this.mainModel.getData() };
                dataBody.trangthainhan === 'true' ?
                    dataBody.trangthainhan = true :
                    dataBody.trangthainhan = false;
                let addModel = new CoreJsonModel();
                addModel.postToAPI(sdConfig.adminApiEndpoint + "PhieuGiao/update", dataBody).success(dt => {
                    MessageToast.show(dt.message);
                    root.onCancel();
                })
                this.clearForm();
            }
        },
        onValueHelpRequest: function() {
            var oView = this.getView();
            if (!this._pValueHelpDialog) {
                this._pValueHelpDialog = Fragment.load({
                    id: oView.getId(),
                    name: "app.PhieuGiao.Fragment.Select",
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
                oInput = this.byId("maDonDat");

            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }

            oInput.setValue(oSelectedItem.getTitle());
        },
        onSearch: function(oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("id", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter([oFilter]);
        },
    };
    return Controller.extend('app.PhieuGiao.List', oController);
});