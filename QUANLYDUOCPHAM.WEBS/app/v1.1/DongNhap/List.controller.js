
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
            globalFormatter: GlobalFormatter,
            mainModel: new CoreJsonModel(),
            onInit: function() {
                this.router = sap.ui.core.UIComponent.getRouterFor(this);
                this.bus = sap.ui.getCore().getEventBus();
                this.getView().setModel(this.mainModel, 'mainModel');
                this.bus.subscribe('DongNhapChanel', 'closeDongNhapAdd', this.closeDongNhapAdd, this);
                this.bus.subscribe('DongNhapChanel', 'closeEdit', this.closeEdit, this);
                this.bus.subscribe('DongNhapChanel', 'switchToEditPage', this.switchToEditPage, this)
                this.loadDataInit();
            },
            onExit: function() {
                this.bus.unsubscribe('DongNhapChanel', 'closeDongNhapAdd', this.closeDongNhapAdd, this)
                this.bus.unsubscribe('DongNhapChanel', 'closeEdit', this.closeEdit, this)
                this.bus.unsubscribe('DongNhapChanel', 'switchToEditPage', this.switchToEditPage, this)
            },
            loadDataInit: function() {
                let root = this;
                this.mainModel.getAll(sdConfig.adminApiEndpoint + "dongnhap/getall").success(dt => {
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
                if (!this._addDongNhap) {
                    Fragment.load({
                        id: root.getView().getId(),
                        name: "app.DongNhap.Add",
                        type: "XML",
                        controller: this
                    }).then(function(frag) {
                        root._addDongNhap = frag;
                        root._addDongNhap.open();
                    });
                } else {
                    root._addDongNhap.open();
                }
            },
            closeDongNhapAdd: function() {
                this._addDongNhap.close();
                this.loadDataInit();
            },
            loadEditPage: function(id) {
                let root = this;
                if (!this._editDongNhap) {
                    Fragment.load({
                        id: root.getView().getId(),
                        name: "app.DongNhap.Edit",
                        type: "XML",
                        controller: this
                    }).then(function(frag) {
                        root._editDongNhap = frag;
                        root._editDongNhap.open();
                        root.bus.publish('DongNhapChanel', 'loadEditPage', {
                            Id: id
                        }); //null
                    });
                } else {
                    root._editDongNhap.open();
                    this.bus.publish('DongNhapChanel', 'loadEditPage', {
                        Id: id
                    }); //null
                }
                if (this._DongNhapDetail) {
                    this._DongNhapDetail.close();
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
                this._editDongNhap.close();
                this.loadDataInit();
            },
            onRowDelete: function(oEvent) {
                let root = this;
                let selectedId = this.getView().getModel('mainModel').getProperty('id', oEvent.getParameter('row').getBindingContext('mainModel'));
                new CoreJsonModel().deleteById(sdConfig.adminApiEndpoint + "dongnhap/delete/" + selectedId).success(dt => {
                    MessageToast.show(dt.message);
                    root.loadDataInit();
                })
            },
            onCellClick: function(oEvent) {
                let selected = this.getView().getModel('mainModel').getProperty('', oEvent.getParameter('rowBindingContext'));
                if (selected) {
                    const root = this;
                    if (!this._DongNhapDetail) {
                        Fragment.load({
                            id: root.getView().getId(),
                            name: "app.DongNhap.Detail",
                            type: "XML",
                            controller: this
                        }).then(function(frag) {
                            root._DongNhapDetail = frag;
                            root._DongNhapDetail.open();
                            root.bus.publish('DongNhapChanel', 'loadDetailPage', {
                                Id: selected.id
                            });
                        });
                    } else {
                        root._DongNhapDetail.open();
                        root.bus.publish('DongNhapChanel', 'loadDetailPage', {
                            Id: selected.id
                        });
                    }
                }
            },
            onCloseDongNhapDetail: function() {
                    this._DongNhapDetail.close();
                    this.loadDataInit();
                }
                //#endregion
                //#endregion
        };
        return Controller.extend('app.DongNhap.List', oController);
    });
    