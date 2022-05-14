
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
], function (Core, Controller, MessageToast, MessageBox, Connector, CoreJsonModel, GlobalFormatter, Spreadsheet, Device, Fragment,) {
    'use strict';
    const oController = {
        fs: GlobalFormatter,
        mainModel: new CoreJsonModel(),
        onInit: function () {
            this.router = sap.ui.core.UIComponent.getRouterFor(this);
            this.bus = sap.ui.getCore().getEventBus();
            this.getView().setModel(this.mainModel, 'mainModel');
            this.bus.subscribe('DongMuaChanel', 'closeDongMuaAdd', this.closeDongMuaAdd, this);
            this.bus.subscribe('DongMuaChanel', 'closeEdit', this.closeEdit, this);
            this.bus.subscribe('DongMuaChanel', 'switchToEditPage', this.switchToEditPage, this)
            this.loadDataInit();
        },
        onExit: function () {
            this.bus.unsubscribe('DongMuaChanel', 'closeDongMuaAdd', this.closeDongMuaAdd, this)
            this.bus.unsubscribe('DongMuaChanel', 'closeEdit', this.closeEdit, this)
            this.bus.unsubscribe('DongMuaChanel', 'switchToEditPage', this.switchToEditPage, this)
        },
        loadDataInit: function () {
            let root = this;
            this.mainModel.getAll(sdConfig.adminApiEndpoint + "dongmua/getall").success(dt => {
                if (dt) {
                    for (var i = 0; i < dt.data.length; i++) {
                        dt.data[i]['STT'] = i + 1;
                    }
                    root.mainModel.setData(dt.data)
                    console.log(root.mainModel)
                } else return [];
            })
        },
        onAddButtonPress: function () {
            const root = this;
            if (!this._addDongMua) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.DongMua.Add",
                    type: "XML",
                    controller: this
                }).then(function (frag) {
                    root._addDongMua = frag;
                    root._addDongMua.open();
                });
            } else {
                root._addDongMua.open();
            }
        },
        closeDongMuaAdd: function () {
            this._addDongMua.close();
            this.loadDataInit();
        },
        loadEditPage: function (id) {
            let root = this;
            if (!this._editDongMua) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.DongMua.Edit",
                    type: "XML",
                    controller: this
                }).then(function (frag) {
                    root._editDongMua = frag;
                    root._editDongMua.open();
                    root.bus.publish('DongMuaChanel', 'loadEditPage', {
                        Id: id
                    }); //null
                });
            } else {
                root._editDongMua.open();
                this.bus.publish('DongMuaChanel', 'loadEditPage', {
                    Id: id
                }); //null
            }
            if (this._DongMuaDetail) {
                this._DongMuaDetail.close();
            }
        },
        onRowEdit: function (oEvent) {
            let selectedId = this.getView().getModel('mainModel').getProperty('iddonmua', oEvent.getParameter('row').getBindingContext('mainModel'));
            this.loadEditPage(selectedId)

        },
        switchToEditPage: function (oChanel, oEvent, oData) {
            this.loadEditPage(oData.Id)
        },
        closeEdit: function () {
            this._editDongMua.close();
            this.loadDataInit();
        },
        onRowDelete: function (oEvent) {
            let root = this;
            let selectedId = this.getView().getModel('mainModel').getProperty('iddonmua', oEvent.getParameter('row').getBindingContext('mainModel'));
            new CoreJsonModel().deleteById(sdConfig.adminApiEndpoint + "dongmua/delete/" + selectedId).success(dt => {
                MessageToast.show(dt.message);
                root.loadDataInit();
            })
        },
        onCellClick: function (oEvent) {
            let selected = this.getView().getModel('mainModel').getProperty('', oEvent.getParameter('rowBindingContext'));
            if (selected) {
                const root = this;
                if (!this._DongMuaDetail) {
                    Fragment.load({
                        id: root.getView().getId(),
                        name: "app.DongMua.Detail",
                        type: "XML",
                        controller: this
                    }).then(function (frag) {
                        root._DongMuaDetail = frag;
                        root._DongMuaDetail.open();
                        root.bus.publish('DongMuaChanel', 'loadDetailPage', {
                            Id: selected.iddonmua
                        });
                    });
                } else {
                    root._DongMuaDetail.open();
                    root.bus.publish('DongMuaChanel', 'loadDetailPage', {
                        Id: selected.iddonmua
                    });
                }
            }
        },
        onCloseDongMuaDetail: function () {
            this._DongMuaDetail.close();
            this.loadDataInit();
        }
        //#endregion
        //#endregion
    };
    return Controller.extend('app.DongMua.List', oController);
});
