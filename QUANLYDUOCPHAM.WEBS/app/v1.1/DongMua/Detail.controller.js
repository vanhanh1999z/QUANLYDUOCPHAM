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
        fs: GlobalFormatter,
        mainModel: new CoreJsonModel(),
        onInit: function () {
            this.router = sap.ui.core.UIComponent.getRouterFor(this);
            this.bus = Core.getEventBus();
            this.bus.subscribe('DongMuaChanel', 'loadDetailPage', this.loadDetailPage, this);
            this.bus.subscribe('DongMuaChanel', 'closeEdit', this.closeEdit, this);
            this.getView().setModel(this.mainModel, 'mainModel');
        },
        onExit: function () {
            this.bus.unsubscribe('DongMuaChanel', 'loadDetailPage', this.loadDetailPage, this);

        },
        loadDetailPage: function (oChanel, oEvent, oData) {
            let root = this;
            new CoreJsonModel().getById(sdConfig.adminApiEndpoint + 'DongMua', String(oData.Id).trim()).success(dt => {
                if (dt.success === true) {
                    root.mainModel.setData({
                        ...dt.data[0]
                    });
                } else {
                    MessageToast.show(dt.message)
                }
            })
        },
        onEditButtonPress: function () {
            let selectedId = this.getView().getModel('mainModel').getData();
            this.bus.publish('DongMuaChanel', 'switchToEditPage', {
                Id: selectedId.iddonmua
            })
        },
    };
    return Controller.extend('app.DongMua.List', oController);
});
