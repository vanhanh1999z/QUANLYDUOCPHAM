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
], function(Core, Controller, MessageToast, MessageBox, Connector, CoreJsonModel, GlobalFormatter, Fragment, Spreadsheet, Device) {
    'use strict';
    const oController = {
        fs: GlobalFormatter,
        mainModel: new CoreJsonModel(),

        nccModel: new CoreJsonModel(),
        mainObject: {
            id: null,
            idncc: '',
            ngaymua: null,
        },
        onInit: function() {
            this.router = sap.ui.core.UIComponent.getRouterFor(this);
            this.bus = sap.ui.getCore().getEventBus();
            this.getView().setModel(this.mainModel, 'mainModel');
            this.getView().setModel(this.nccModel);
            this.bus.subscribe('DonMuaChanel', 'loadEditPage', this.loadEditPage, this);
            this.loadNCCData();
        },
        onExit: function() {
            this.bus.unsubscribe('DonMuaChanel', 'loadEditPage', this.loadEditPage, this);
        },
        loadEditPage: function(sChanel, sEvent, oData) {
            let root = this;
            if (oData && oData.Id) {
                this.mainObject.id = oData.Id;
            }
            new CoreJsonModel().getById(sdConfig.adminApiEndpoint + 'donmua', String(oData.Id).trim()).success(dt => {
                if (dt.success === true) {
                    root.mainModel.setData({
                        ...dt.data[0]
                    });
                    root.mainObject = {...dt.data[0] };
                } else {
                    MessageToast.show(dt.message)
                }
            })
        },
        loadNCCData: function() {
            let root = this;
            new CoreJsonModel().getAll(sdConfig.adminApiEndpoint + 'nhaccungcap/getall').success(dt => {
                if (dt.success === true) {
                    let nData = dt.data.map(dt => { return {...dt } });
                    root.nccModel.setData({ NhaCungCap: nData });
                } else {
                    MessageToast.show(dt.message)
                }
            })
        },
        onCancel: function() {
            this.bus.publish('DonMuaChanel', 'closeEdit')
            this.clearForm();
        },

        save: function() {
            var root = this;
            if (true) {
                let dataBody = this.mainModel.getData();
                if (!this.id) {
                    return;
                }
                dataBody.idncc = this.id;
                let addModel = new CoreJsonModel();
                addModel.postToAPI(sdConfig.adminApiEndpoint + "DonMua/update", dataBody).success(dt => {
                    MessageToast.show(dt.message);
                    root.onCancel();
                })
                this.clearForm();
            }
        },
        clearForm: function() {
            this.mainModel.setData({...this.mainObject });
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
            }
        },
    };
    return Controller.extend('app.DonMua.List', oController);
});