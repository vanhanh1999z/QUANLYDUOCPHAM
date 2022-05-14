
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
                this.bus.subscribe('PhieuThuChanel', 'closePhieuThuAdd', this.closePhieuThuAdd, this);
                this.bus.subscribe('PhieuThuChanel', 'closeEdit', this.closeEdit, this);
                this.bus.subscribe('PhieuThuChanel', 'switchToEditPage', this.switchToEditPage, this)
                this.loadDataInit();
            },
            onExit: function() {
                this.bus.unsubscribe('PhieuThuChanel', 'closePhieuThuAdd', this.closePhieuThuAdd, this)
                this.bus.unsubscribe('PhieuThuChanel', 'closeEdit', this.closeEdit, this)
                this.bus.unsubscribe('PhieuThuChanel', 'switchToEditPage', this.switchToEditPage, this)
            },
            loadDataInit: function() {
                let root = this;
                this.mainModel.getAll(sdConfig.adminApiEndpoint + "phieuthu/getall").success(dt => {
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
                if (!this._addPhieuThu) {
                    Fragment.load({
                        id: root.getView().getId(),
                        name: "app.PhieuThu.Add",
                        type: "XML",
                        controller: this
                    }).then(function(frag) {
                        root._addPhieuThu = frag;
                        root._addPhieuThu.open();
                    });
                } else {
                    root._addPhieuThu.open();
                }
            },
            closePhieuThuAdd: function() {
                this._addPhieuThu.close();
                this.loadDataInit();
            },
            loadEditPage: function(id) {
                let root = this;
                if (!this._editPhieuThu) {
                    Fragment.load({
                        id: root.getView().getId(),
                        name: "app.PhieuThu.Edit",
                        type: "XML",
                        controller: this
                    }).then(function(frag) {
                        root._editPhieuThu = frag;
                        root._editPhieuThu.open();
                        root.bus.publish('PhieuThuChanel', 'loadEditPage', {
                            Id: id
                        }); //null
                    });
                } else {
                    root._editPhieuThu.open();
                    this.bus.publish('PhieuThuChanel', 'loadEditPage', {
                        Id: id
                    }); //null
                }
                if (this._PhieuThuDetail) {
                    this._PhieuThuDetail.close();
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
                this._editPhieuThu.close();
                this.loadDataInit();
            },
            onRowDelete: function(oEvent) {
                let root = this;
                let selectedId = this.getView().getModel('mainModel').getProperty('id', oEvent.getParameter('row').getBindingContext('mainModel'));
                new CoreJsonModel().deleteById(sdConfig.adminApiEndpoint + "phieuthu/delete/" + selectedId).success(dt => {
                    MessageToast.show(dt.message);
                    root.loadDataInit();
                })
            },
            onCellClick: function(oEvent) {
                let selected = this.getView().getModel('mainModel').getProperty('', oEvent.getParameter('rowBindingContext'));
                if (selected) {
                    const root = this;
                    if (!this._PhieuThuDetail) {
                        Fragment.load({
                            id: root.getView().getId(),
                            name: "app.PhieuThu.Detail",
                            type: "XML",
                            controller: this
                        }).then(function(frag) {
                            root._PhieuThuDetail = frag;
                            root._PhieuThuDetail.open();
                            root.bus.publish('PhieuThuChanel', 'loadDetailPage', {
                                Id: selected.id
                            });
                        });
                    } else {
                        root._PhieuThuDetail.open();
                        root.bus.publish('PhieuThuChanel', 'loadDetailPage', {
                            Id: selected.id
                        });
                    }
                }
            },
            onClosePhieuThuDetail: function() {
                    this._PhieuThuDetail.close();
                    this.loadDataInit();
                }
                //#endregion
                //#endregion
        };
        return Controller.extend('app.PhieuThu.List', oController);
    });
    