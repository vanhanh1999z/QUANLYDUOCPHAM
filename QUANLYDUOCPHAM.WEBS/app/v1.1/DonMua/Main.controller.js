sap.ui.define([
    'sap/ui/core/Core',
    'sap/ui/core/mvc/Controller',
    'sap/m/MessageToast',
    'sap/m/MessageBox',
    'app/ext/Auth.Connector.Adal',
    'app/ext/CoreJsonModel',
    'app/globalformatter',
    'sap/ui/export/Spreadsheet',
    'sap/ui/Device',
    "sap/ui/core/Fragment"
], function(Core, Controller, MessageToast, MessageBox, Connector, CoreJsonModel, GlobalFormatter, Spreadsheet, Device, Fragment, ) {
    'use strict';
    const oController = {
        fs: GlobalFormatter,
        onInit: function() {
            this.bus = Core.getEventBus();
            this.bus = sap.ui.getCore().getEventBus();
            this.bus.subscribe('DonMuaChanel', 'switchValueHelpPage', this.switchValueHelpPage, this)
        },
        onExit: function() {
            this.bus.unsubscribe('DonMuaChanel', 'switchValueHelpPage', this.switchValueHelpPage, this)
        },
        switchValueHelpPage: function(oChanel, oEvent, oData) {
            console.log(12321)
            console.log(oData)
        }
    };
    return Controller.extend('app.DonMua.Main', oController);
});