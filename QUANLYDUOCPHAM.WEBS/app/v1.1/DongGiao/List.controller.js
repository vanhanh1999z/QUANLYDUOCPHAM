
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
                this.bus.subscribe('DongGiaoChanel', 'closeDongGiaoAdd', this.closeDongGiaoAdd, this);
                this.bus.subscribe('DongGiaoChanel', 'closeEdit', this.closeEdit, this);
                this.bus.subscribe('DongGiaoChanel', 'switchToEditPage', this.switchToEditPage, this)
                this.loadDataInit();
            },
            onExit: function() {
                this.bus.unsubscribe('DongGiaoChanel', 'closeDongGiaoAdd', this.closeDongGiaoAdd, this)
                this.bus.unsubscribe('DongGiaoChanel', 'closeEdit', this.closeEdit, this)
                this.bus.unsubscribe('DongGiaoChanel', 'switchToEditPage', this.switchToEditPage, this)
            },
            loadDataInit: function() {
                let root = this;
                this.mainModel.getAll(sdConfig.adminApiEndpoint + "donggiao/getall").success(dt => {
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
                if (!this._addDongGiao) {
                    Fragment.load({
                        id: root.getView().getId(),
                        name: "app.DongGiao.Add",
                        type: "XML",
                        controller: this
                    }).then(function(frag) {
                        root._addDongGiao = frag;
                        root._addDongGiao.open();
                    });
                } else {
                    root._addDongGiao.open();
                }
            },
            closeDongGiaoAdd: function() {
                this._addDongGiao.close();
                this.loadDataInit();
            },
            loadEditPage: function(id) {
                let root = this;
                if (!this._editDongGiao) {
                    Fragment.load({
                        id: root.getView().getId(),
                        name: "app.DongGiao.Edit",
                        type: "XML",
                        controller: this
                    }).then(function(frag) {
                        root._editDongGiao = frag;
                        root._editDongGiao.open();
                        root.bus.publish('DongGiaoChanel', 'loadEditPage', {
                            Id: id
                        }); //null
                    });
                } else {
                    root._editDongGiao.open();
                    this.bus.publish('DongGiaoChanel', 'loadEditPage', {
                        Id: id
                    }); //null
                }
                if (this._DongGiaoDetail) {
                    this._DongGiaoDetail.close();
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
                this._editDongGiao.close();
                this.loadDataInit();
            },
            onRowDelete: function(oEvent) {
                let root = this;
                let selectedId = this.getView().getModel('mainModel').getProperty('id', oEvent.getParameter('row').getBindingContext('mainModel'));
                new CoreJsonModel().deleteById(sdConfig.adminApiEndpoint + "donggiao/delete/" + selectedId).success(dt => {
                    MessageToast.show(dt.message);
                    root.loadDataInit();
                })
            },
            onCellClick: function(oEvent) {
                let selected = this.getView().getModel('mainModel').getProperty('', oEvent.getParameter('rowBindingContext'));
                if (selected) {
                    const root = this;
                    if (!this._DongGiaoDetail) {
                        Fragment.load({
                            id: root.getView().getId(),
                            name: "app.DongGiao.Detail",
                            type: "XML",
                            controller: this
                        }).then(function(frag) {
                            root._DongGiaoDetail = frag;
                            root._DongGiaoDetail.open();
                            root.bus.publish('DongGiaoChanel', 'loadDetailPage', {
                                Id: selected.id
                            });
                        });
                    } else {
                        root._DongGiaoDetail.open();
                        root.bus.publish('DongGiaoChanel', 'loadDetailPage', {
                            Id: selected.id
                        });
                    }
                }
            },
            onCloseDongGiaoDetail: function() {
                    this._DongGiaoDetail.close();
                    this.loadDataInit();
                }
                //#endregion
                //#endregion
        };
        return Controller.extend('app.DongGiao.List', oController);
    });
    