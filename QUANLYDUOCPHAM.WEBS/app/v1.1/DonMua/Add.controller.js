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
    'sap/m/Token',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
], function(Core, Controller, MessageToast, MessageBox, Connector, CoreJsonModel, GlobalFormatter, Fragment, Spreadsheet, Device, Base, Token, Filter, FilterOperator) {
    'use strict';
    const GROUP_NAME = 'addGroup';
    const oController = {
        fs: GlobalFormatter,
        nccModel: new CoreJsonModel(),
        orgModel: new CoreJsonModel(),
        onInit: function() {
            this.router = sap.ui.core.UIComponent.getRouterFor(this);
            this.getView().setModel(this.nccModel);
            this.getView().setModel(this.orgModel, 'orgModel');
            this.bus = Core.getEventBus();
            this.loadNCCData();
            this.loadInitValue();

        },
        onBeforeRendering: function() {},
        onExit: function() {},
        clearForm: function() {
            this.loadInitValue();
        },
        onAfterRendering: function() {},
        loadInitValue: function() {
            let dateNow = moment().format('yyyy-DD-MM')
            this.orgModel.setData({
                id: '',
                idncc: '-1',
                ngaymua: dateNow,
            })
        },
        loadNCCData: function() {
            let root = this;
            new CoreJsonModel().getAll(sdConfig.adminApiEndpoint + 'nhaccungcap/getall').success(dt => {
                if (dt.success === true) {
                    let oData = dt.data.map(d => d);
                    root.nccModel.setData({ NhaCungCap: oData });
                } else {
                    MessageToast.show(dt.message)
                }
            })
        },
        closeArea: function() {
            this.clearForm();
            this.bus.publish('DonMuaChanel', "closeDonMuaAdd")
        },
        save: function() {
            let dt = new Base().getDataFromGroup(GROUP_NAME);
            let root = this;
            dt.idncc = this.id
            if (true) {
                let addModel = new CoreJsonModel();
                addModel.postToAPI(sdConfig.adminApiEndpoint + "donmua/add", dt).success(dt => {
                    root.closeArea();
                    MessageToast.show(dt.message);
                })
                this.clearForm();
            }
        },
        handleValueHelp: function() {
            var oView = this.getView();
            if (!this._pValueHelpDialog) {
                this._pValueHelpDialog = Fragment.load({
                    id: oView.getId(),
                    name: "app.DonMua.Frag.Select",
                    controller: this
                }).then(function(oValueHelpDialog) {
                    oView.addDependent(oValueHelpDialog);
                    return oValueHelpDialog;
                });
            }
            this._pValueHelpDialog.then(function(oValueHelpDialog) {
                this._configValueHelpDialog();
                oValueHelpDialog.open();
            }.bind(this));
        },
        _configValueHelpDialog: function() {
            var sInputValue = this.byId("idncc").getValue(),
                oModel = this.getView().getModel(),
                aProducts = oModel.getProperty("/NhaCungCap");
            aProducts.forEach(function(oProduct) {
                oProduct.selected = (oProduct.Name === sInputValue);
            });
            oModel.setProperty("/NhaCungCap", aProducts);
        },
        handleSearch: function(oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("tenncc", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([oFilter]);
        },

        handleClose: function(oEvent) {
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([]);
            var aContexts = oEvent.getParameter("selectedContexts");
            if (aContexts && aContexts.length) {
                this.id = aContexts.map(function(oContext) { return oContext.getObject().id; }).join(", ")
                let value = aContexts.map(function(oContext) { return oContext.getObject().tenncc; }).join(", ")
                this.byId("idncc").setValue(value);
                MessageToast.show("You have chosen " + this.id);
            }
        },
    };

    return Controller.extend('app.Device.List', oController);
});