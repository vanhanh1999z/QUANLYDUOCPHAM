
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
                this.bus.subscribe('PhieuChiChanel', 'closePhieuChiAdd', this.closePhieuChiAdd, this);
                this.bus.subscribe('PhieuChiChanel', 'closeEdit', this.closeEdit, this);
                this.bus.subscribe('PhieuChiChanel', 'switchToEditPage', this.switchToEditPage, this)
                this.loadDataInit();
            },
            onExit: function() {
                this.bus.unsubscribe('PhieuChiChanel', 'closePhieuChiAdd', this.closePhieuChiAdd, this)
                this.bus.unsubscribe('PhieuChiChanel', 'closeEdit', this.closeEdit, this)
                this.bus.unsubscribe('PhieuChiChanel', 'switchToEditPage', this.switchToEditPage, this)
            },
            loadDataInit: function() {
                let root = this;
                this.mainModel.getAll(sdConfig.adminApiEndpoint + "phieuchi/getall").success(dt => {
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
                if (!this._addPhieuChi) {
                    Fragment.load({
                        id: root.getView().getId(),
                        name: "app.PhieuChi.Add",
                        type: "XML",
                        controller: this
                    }).then(function(frag) {
                        root._addPhieuChi = frag;
                        root._addPhieuChi.open();
                    });
                } else {
                    root._addPhieuChi.open();
                }
            },
            closePhieuChiAdd: function() {
                this._addPhieuChi.close();
                this.loadDataInit();
            },
            loadEditPage: function(id) {
                let root = this;
                if (!this._editPhieuChi) {
                    Fragment.load({
                        id: root.getView().getId(),
                        name: "app.PhieuChi.Edit",
                        type: "XML",
                        controller: this
                    }).then(function(frag) {
                        root._editPhieuChi = frag;
                        root._editPhieuChi.open();
                        root.bus.publish('PhieuChiChanel', 'loadEditPage', {
                            Id: id
                        }); //null
                    });
                } else {
                    root._editPhieuChi.open();
                    this.bus.publish('PhieuChiChanel', 'loadEditPage', {
                        Id: id
                    }); //null
                }
                if (this._PhieuChiDetail) {
                    this._PhieuChiDetail.close();
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
                this._editPhieuChi.close();
                this.loadDataInit();
            },
            onRowDelete: function(oEvent) {
                let root = this;
                let selectedId = this.getView().getModel('mainModel').getProperty('id', oEvent.getParameter('row').getBindingContext('mainModel'));
                new CoreJsonModel().deleteById(sdConfig.adminApiEndpoint + "phieuchi/delete/" + selectedId).success(dt => {
                    MessageToast.show(dt.message);
                    root.loadDataInit();
                })
            },
            onCellClick: function(oEvent) {
                let selected = this.getView().getModel('mainModel').getProperty('', oEvent.getParameter('rowBindingContext'));
                if (selected) {
                    const root = this;
                    if (!this._PhieuChiDetail) {
                        Fragment.load({
                            id: root.getView().getId(),
                            name: "app.PhieuChi.Detail",
                            type: "XML",
                            controller: this
                        }).then(function(frag) {
                            root._PhieuChiDetail = frag;
                            root._PhieuChiDetail.open();
                            root.bus.publish('PhieuChiChanel', 'loadDetailPage', {
                                Id: selected.id
                            });
                        });
                    } else {
                        root._PhieuChiDetail.open();
                        root.bus.publish('PhieuChiChanel', 'loadDetailPage', {
                            Id: selected.id
                        });
                    }
                }
            },
            onClosePhieuChiDetail: function() {
                    this._PhieuChiDetail.close();
                    this.loadDataInit();
                }
                //#endregion
                //#endregion
        };
        return Controller.extend('app.PhieuChi.List', oController);
    });
    