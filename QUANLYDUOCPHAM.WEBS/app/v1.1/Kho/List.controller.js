
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
                this.bus.subscribe('KhoChanel', 'closeKhoAdd', this.closeKhoAdd, this);
                this.bus.subscribe('KhoChanel', 'closeEdit', this.closeEdit, this);
                this.bus.subscribe('KhoChanel', 'switchToEditPage', this.switchToEditPage, this)
                this.loadDataInit();
            },
            onExit: function() {
                this.bus.unsubscribe('KhoChanel', 'closeKhoAdd', this.closeKhoAdd, this)
                this.bus.unsubscribe('KhoChanel', 'closeEdit', this.closeEdit, this)
                this.bus.unsubscribe('KhoChanel', 'switchToEditPage', this.switchToEditPage, this)
            },
            loadDataInit: function() {
                let root = this;
                this.mainModel.getAll(sdConfig.adminApiEndpoint + "kho/getall").success(dt => {
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
                if (!this._addKho) {
                    Fragment.load({
                        id: root.getView().getId(),
                        name: "app.Kho.Add",
                        type: "XML",
                        controller: this
                    }).then(function(frag) {
                        root._addKho = frag;
                        root._addKho.open();
                    });
                } else {
                    root._addKho.open();
                }
            },
            closeKhoAdd: function() {
                this._addKho.close();
                this.loadDataInit();
            },
            loadEditPage: function(id) {
                let root = this;
                if (!this._editKho) {
                    Fragment.load({
                        id: root.getView().getId(),
                        name: "app.Kho.Edit",
                        type: "XML",
                        controller: this
                    }).then(function(frag) {
                        root._editKho = frag;
                        root._editKho.open();
                        root.bus.publish('KhoChanel', 'loadEditPage', {
                            Id: id
                        }); //null
                    });
                } else {
                    root._editKho.open();
                    this.bus.publish('KhoChanel', 'loadEditPage', {
                        Id: id
                    }); //null
                }
                if (this._KhoDetail) {
                    this._KhoDetail.close();
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
                this._editKho.close();
                this.loadDataInit();
            },
            onRowDelete: function(oEvent) {
                let root = this;
                let selectedId = this.getView().getModel('mainModel').getProperty('id', oEvent.getParameter('row').getBindingContext('mainModel'));
                new CoreJsonModel().deleteById(sdConfig.adminApiEndpoint + "kho/delete/" + selectedId).success(dt => {
                    MessageToast.show(dt.message);
                    root.loadDataInit();
                })
            },
            onCellClick: function(oEvent) {
                let selected = this.getView().getModel('mainModel').getProperty('', oEvent.getParameter('rowBindingContext'));
                if (selected) {
                    const root = this;
                    if (!this._KhoDetail) {
                        Fragment.load({
                            id: root.getView().getId(),
                            name: "app.Kho.Detail",
                            type: "XML",
                            controller: this
                        }).then(function(frag) {
                            root._KhoDetail = frag;
                            root._KhoDetail.open();
                            root.bus.publish('KhoChanel', 'loadDetailPage', {
                                Id: selected.id
                            });
                        });
                    } else {
                        root._KhoDetail.open();
                        root.bus.publish('KhoChanel', 'loadDetailPage', {
                            Id: selected.id
                        });
                    }
                }
            },
            onCloseKhoDetail: function() {
                    this._KhoDetail.close();
                    this.loadDataInit();
                }
                //#endregion
                //#endregion
        };
        return Controller.extend('app.Kho.List', oController);
    });
    