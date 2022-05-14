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
], function(Core, Controller, MessageToast, MessageBox, Connector, CoreJsonModel, GlobalFormatter, Fragment, Spreadsheet, Device) {
    'use strict';
    const oController = {
        globalFormatter: GlobalFormatter,
        donMuaModel: new CoreJsonModel(),
        onInit: function() {
            this.router = sap.ui.core.UIComponent.getRouterFor(this);
            this.getView().setModel(this.donMuaModel, 'donMuaModel')
            this.bus = Core.getEventBus();
            this.loadDataDonMua();

        },

        loadDataDonMua: function() {
            let root = this;
            new CoreJsonModel().getAll(sdConfig.adminApiEndpoint + 'donmua/getall').success(dt => {
                if (dt) root.donMuaModel.setData({
                    ...dt.data
                });
                else return [];
            })
        },


        _handleValueHelpSearch: function(oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter(
                "Name",
                FilterOperator.Contains, sValue
            );
            oEvent.getSource().getBinding("items").filter([oFilter]);
        },

        _handleValueHelpClose: function(oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem");
            if (oSelectedItem) {
                var productInput = this.byId(this._sInputId);
                productInput.setValue(oSelectedItem.getTitle());
            }
            oEvent.getSource().getBinding("items").filter([]);
        }
    };

    return Controller.extend('app.PhieuNhap.Fragment.Select', oController);
});