
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
                this.bus.subscribe('DongDatChanel', 'closeDongDatAdd', this.closeDongDatAdd, this);
                this.bus.subscribe('DongDatChanel', 'closeEdit', this.closeEdit, this);
                this.bus.subscribe('DongDatChanel', 'switchToEditPage', this.switchToEditPage, this)
                this.loadDataInit();
            },
            onExit: function() {
                this.bus.unsubscribe('DongDatChanel', 'closeDongDatAdd', this.closeDongDatAdd, this)
                this.bus.unsubscribe('DongDatChanel', 'closeEdit', this.closeEdit, this)
                this.bus.unsubscribe('DongDatChanel', 'switchToEditPage', this.switchToEditPage, this)
            },
            loadDataInit: function() {
                let root = this;
                this.mainModel.getAll(sdConfig.adminApiEndpoint + "dongdat/getall").success(dt => {
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
                if (!this._addDongDat) {
                    Fragment.load({
                        id: root.getView().getId(),
                        name: "app.DongDat.Add",
                        type: "XML",
                        controller: this
                    }).then(function(frag) {
                        root._addDongDat = frag;
                        root._addDongDat.open();
                    });
                } else {
                    root._addDongDat.open();
                }
            },
            closeDongDatAdd: function() {
                this._addDongDat.close();
                this.loadDataInit();
            },
            loadEditPage: function(id) {
                let root = this;
                if (!this._editDongDat) {
                    Fragment.load({
                        id: root.getView().getId(),
                        name: "app.DongDat.Edit",
                        type: "XML",
                        controller: this
                    }).then(function(frag) {
                        root._editDongDat = frag;
                        root._editDongDat.open();
                        root.bus.publish('DongDatChanel', 'loadEditPage', {
                            Id: id
                        }); //null
                    });
                } else {
                    root._editDongDat.open();
                    this.bus.publish('DongDatChanel', 'loadEditPage', {
                        Id: id
                    }); //null
                }
                if (this._DongDatDetail) {
                    this._DongDatDetail.close();
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
                this._editDongDat.close();
                this.loadDataInit();
            },
            onRowDelete: function(oEvent) {
                let root = this;
                let selectedId = this.getView().getModel('mainModel').getProperty('id', oEvent.getParameter('row').getBindingContext('mainModel'));
                new CoreJsonModel().deleteById(sdConfig.adminApiEndpoint + "dongdat/delete/" + selectedId).success(dt => {
                    MessageToast.show(dt.message);
                    root.loadDataInit();
                })
            },
            onCellClick: function(oEvent) {
                let selected = this.getView().getModel('mainModel').getProperty('', oEvent.getParameter('rowBindingContext'));
                if (selected) {
                    const root = this;
                    if (!this._DongDatDetail) {
                        Fragment.load({
                            id: root.getView().getId(),
                            name: "app.DongDat.Detail",
                            type: "XML",
                            controller: this
                        }).then(function(frag) {
                            root._DongDatDetail = frag;
                            root._DongDatDetail.open();
                            root.bus.publish('DongDatChanel', 'loadDetailPage', {
                                Id: selected.id
                            });
                        });
                    } else {
                        root._DongDatDetail.open();
                        root.bus.publish('DongDatChanel', 'loadDetailPage', {
                            Id: selected.id
                        });
                    }
                }
            },
            onCloseDongDatDetail: function() {
                    this._DongDatDetail.close();
                    this.loadDataInit();
                }
                //#endregion
                //#endregion
        };
        return Controller.extend('app.DongDat.List', oController);
    });
    