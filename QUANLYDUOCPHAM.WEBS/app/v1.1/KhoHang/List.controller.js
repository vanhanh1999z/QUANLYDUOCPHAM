
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
                this.bus.subscribe('KhoHangChanel', 'closeKhoHangAdd', this.closeKhoHangAdd, this);
                this.bus.subscribe('KhoHangChanel', 'closeEdit', this.closeEdit, this);
                this.bus.subscribe('KhoHangChanel', 'switchToEditPage', this.switchToEditPage, this)
                this.loadDataInit();
            },
            onExit: function() {
                this.bus.unsubscribe('KhoHangChanel', 'closeKhoHangAdd', this.closeKhoHangAdd, this)
                this.bus.unsubscribe('KhoHangChanel', 'closeEdit', this.closeEdit, this)
                this.bus.unsubscribe('KhoHangChanel', 'switchToEditPage', this.switchToEditPage, this)
            },
            loadDataInit: function() {
                let root = this;
                this.mainModel.getAll(sdConfig.adminApiEndpoint + "khohang/getall").success(dt => {
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
                if (!this._addKhoHang) {
                    Fragment.load({
                        id: root.getView().getId(),
                        name: "app.KhoHang.Add",
                        type: "XML",
                        controller: this
                    }).then(function(frag) {
                        root._addKhoHang = frag;
                        root._addKhoHang.open();
                    });
                } else {
                    root._addKhoHang.open();
                }
            },
            closeKhoHangAdd: function() {
                this._addKhoHang.close();
                this.loadDataInit();
            },
            loadEditPage: function(id) {
                let root = this;
                if (!this._editKhoHang) {
                    Fragment.load({
                        id: root.getView().getId(),
                        name: "app.KhoHang.Edit",
                        type: "XML",
                        controller: this
                    }).then(function(frag) {
                        root._editKhoHang = frag;
                        root._editKhoHang.open();
                        root.bus.publish('KhoHangChanel', 'loadEditPage', {
                            Id: id
                        }); //null
                    });
                } else {
                    root._editKhoHang.open();
                    this.bus.publish('KhoHangChanel', 'loadEditPage', {
                        Id: id
                    }); //null
                }
                if (this._KhoHangDetail) {
                    this._KhoHangDetail.close();
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
                this._editKhoHang.close();
                this.loadDataInit();
            },
            onRowDelete: function(oEvent) {
                let root = this;
                let selectedId = this.getView().getModel('mainModel').getProperty('id', oEvent.getParameter('row').getBindingContext('mainModel'));
                new CoreJsonModel().deleteById(sdConfig.adminApiEndpoint + "khohang/delete/" + selectedId).success(dt => {
                    MessageToast.show(dt.message);
                    root.loadDataInit();
                })
            },
            onCellClick: function(oEvent) {
                let selected = this.getView().getModel('mainModel').getProperty('', oEvent.getParameter('rowBindingContext'));
                if (selected) {
                    const root = this;
                    if (!this._KhoHangDetail) {
                        Fragment.load({
                            id: root.getView().getId(),
                            name: "app.KhoHang.Detail",
                            type: "XML",
                            controller: this
                        }).then(function(frag) {
                            root._KhoHangDetail = frag;
                            root._KhoHangDetail.open();
                            root.bus.publish('KhoHangChanel', 'loadDetailPage', {
                                Id: selected.id
                            });
                        });
                    } else {
                        root._KhoHangDetail.open();
                        root.bus.publish('KhoHangChanel', 'loadDetailPage', {
                            Id: selected.id
                        });
                    }
                }
            },
            onCloseKhoHangDetail: function() {
                    this._KhoHangDetail.close();
                    this.loadDataInit();
                }
                //#endregion
                //#endregion
        };
        return Controller.extend('app.KhoHang.List', oController);
    });
    