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
    "sap/ui/core/Fragment",
    'sap/m/Token',

], function(Core, Controller, MessageToast, MessageBox, Connector, CoreJsonModel, GlobalFormatter, Spreadsheet, Device, Fragment, Token) {
    'use strict';
    const oController = {
        fs: GlobalFormatter,
        nccModel: new CoreJsonModel(),
        onInit: function() {
            this.bus = Core.getEventBus();
            this.bus = sap.ui.getCore().getEventBus();
            this.getView().setModel(this.nccModel)
            this.loadNCCData();
        },
        onExit: function() {},
        loadNCCData: function() {
            let root = this;
            new CoreJsonModel().getAll(sdConfig.adminApiEndpoint + 'nhaccungcap/getall').success(dt => {
                if (dt.success === true) {
                    let oData = dt.data.map(d => d);
                    oData.unshift({
                        id: '-1',
                        tenncc: 'Lựa chọn nhà cung cấp'
                    })
                    root.nccModel.setData({ NhaCungCap: oData });
                    console.log(root.nccModel)
                } else {
                    MessageToast.show(dt.message)
                }
            })
        },

    };
    return Controller.extend('app.DonMua.Main', oController);
});