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
        mainModel: new CoreJsonModel(),
        onInit: function() {
            this.router = sap.ui.core.UIComponent.getRouterFor(this);
            this.bus = sap.ui.getCore().getEventBus();
            this.getView().setModel(this.mainModel, 'mainModel');
            this.bus.subscribe('DonMuaChanel', 'closeDonMuaAdd', this.closeDonMuaAdd, this);
            this.bus.subscribe('DonMuaChanel', 'closeEdit', this.closeEdit, this);
            this.bus.subscribe('DonMuaChanel', 'switchToEditPage', this.switchToEditPage, this)
            this.loadDataInit();
        },
        onExit: function() {
            this.bus.unsubscribe('DonMuaChanel', 'closeDonMuaAdd', this.closeDonMuaAdd, this)
            this.bus.unsubscribe('DonMuaChanel', 'closeEdit', this.closeEdit, this)
            this.bus.unsubscribe('DonMuaChanel', 'switchToEditPage', this.switchToEditPage, this)
        },
        loadDataInit: function() {
            let root = this;
            this.mainModel.getAll(sdConfig.adminApiEndpoint + "donmua/getall").success(dt => {
                if (dt) {
                    for (var i = 0; i < dt.data.length; i++) {
                        dt.data[i]['STT'] = i + 1;
                    }
                    root.mainModel.setData(dt.data)
                } else return [];
            })
        },
        onAddButtonPress: function() {
            const root = this;
            if (!this._addDonMua) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.DonMua.Add",
                    type: "XML",
                    controller: this
                }).then(function(frag) {
                    root._addDonMua = frag;
                    root._addDonMua.open();
                });
            } else {
                root._addDonMua.open();
            }
        },
        closeDonMuaAdd: function() {
            this._addDonMua.close();
            this.loadDataInit();
        },
        loadEditPage: function(id) {
            let root = this;
            if (!this._editDonMua) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.DonMua.Edit",
                    type: "XML",
                    controller: this
                }).then(function(frag) {
                    root._editDonMua = frag;
                    root._editDonMua.open();
                    root.bus.publish('DonMuaChanel', 'loadEditPage', {
                        Id: id
                    }); //null
                });
            } else {
                root._editDonMua.open();
                this.bus.publish('DonMuaChanel', 'loadEditPage', {
                    Id: id
                }); //null
            }
            if (this._DonMuaDetail) {
                this._DonMuaDetail.close();
            }
        },
        onRowEdit: function(oEvent) {
            let selectedId = this.getView().getModel('mainModel').getProperty('id', oEvent.getParameter('row').getBindingContext('mainModel'));
            this.loadEditPage(selectedId)

        },
        switchToEditPage: function(oChanel, oEvent, oData) {
            this.loadEditPage(oData.Id)
        },
        closeEdit: function() {
            this._editDonMua.close();
            this.loadDataInit();
        },
        onRowDelete: function(oEvent) {
            let root = this;
            let selectedId = this.getView().getModel('mainModel').getProperty('id', oEvent.getParameter('row').getBindingContext('mainModel'));
            new CoreJsonModel().deleteById(sdConfig.adminApiEndpoint + "donmua/delete/" + selectedId).success(dt => {
                MessageToast.show(dt.message);
                root.loadDataInit();
            })
        },
        onCellClick: function(oEvent) {
            let selected = this.getView().getModel('mainModel').getProperty('', oEvent.getParameter('rowBindingContext'));
            if (selected) {
                const root = this;
                if (!this._DonMuaDetail) {
                    Fragment.load({
                        id: root.getView().getId(),
                        name: "app.DonMua.Detail",
                        type: "XML",
                        controller: this
                    }).then(function(frag) {
                        root._DonMuaDetail = frag;
                        root._DonMuaDetail.open();
                        root.bus.publish('DonMuaChanel', 'loadDetailPage', {
                            Id: selected.id
                        });
                    });
                } else {
                    root._DonMuaDetail.open();
                    root.bus.publish('DonMuaChanel', 'loadDetailPage', {
                        Id: selected.id
                    });
                }
            }
        },
        onCloseDonMuaDetail: function() {
                this._DonMuaDetail.close();
                this.loadDataInit();
            }
            //#endregion
            //#endregion
    };
    return Controller.extend('app.DonMua.List', oController);
});