
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
                this.bus.subscribe('DonDatChanel', 'closeDonDatAdd', this.closeDonDatAdd, this);
                this.bus.subscribe('DonDatChanel', 'closeEdit', this.closeEdit, this);
                this.bus.subscribe('DonDatChanel', 'switchToEditPage', this.switchToEditPage, this)
                this.loadDataInit();
            },
            onExit: function() {
                this.bus.unsubscribe('DonDatChanel', 'closeDonDatAdd', this.closeDonDatAdd, this)
                this.bus.unsubscribe('DonDatChanel', 'closeEdit', this.closeEdit, this)
                this.bus.unsubscribe('DonDatChanel', 'switchToEditPage', this.switchToEditPage, this)
            },
            loadDataInit: function() {
                let root = this;
                this.mainModel.getAll(sdConfig.adminApiEndpoint + "dondat/getall").success(dt => {
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
                if (!this._addDonDat) {
                    Fragment.load({
                        id: root.getView().getId(),
                        name: "app.DonDat.Add",
                        type: "XML",
                        controller: this
                    }).then(function(frag) {
                        root._addDonDat = frag;
                        root._addDonDat.open();
                    });
                } else {
                    root._addDonDat.open();
                }
            },
            closeDonDatAdd: function() {
                this._addDonDat.close();
                this.loadDataInit();
            },
            loadEditPage: function(id) {
                let root = this;
                if (!this._editDonDat) {
                    Fragment.load({
                        id: root.getView().getId(),
                        name: "app.DonDat.Edit",
                        type: "XML",
                        controller: this
                    }).then(function(frag) {
                        root._editDonDat = frag;
                        root._editDonDat.open();
                        root.bus.publish('DonDatChanel', 'loadEditPage', {
                            Id: id
                        }); //null
                    });
                } else {
                    root._editDonDat.open();
                    this.bus.publish('DonDatChanel', 'loadEditPage', {
                        Id: id
                    }); //null
                }
                if (this._DonDatDetail) {
                    this._DonDatDetail.close();
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
                this._editDonDat.close();
                this.loadDataInit();
            },
            onRowDelete: function(oEvent) {
                let root = this;
                let selectedId = this.getView().getModel('mainModel').getProperty('id', oEvent.getParameter('row').getBindingContext('mainModel'));
                new CoreJsonModel().deleteById(sdConfig.adminApiEndpoint + "dondat/delete/" + selectedId).success(dt => {
                    MessageToast.show(dt.message);
                    root.loadDataInit();
                })
            },
            onCellClick: function(oEvent) {
                let selected = this.getView().getModel('mainModel').getProperty('', oEvent.getParameter('rowBindingContext'));
                if (selected) {
                    const root = this;
                    if (!this._DonDatDetail) {
                        Fragment.load({
                            id: root.getView().getId(),
                            name: "app.DonDat.Detail",
                            type: "XML",
                            controller: this
                        }).then(function(frag) {
                            root._DonDatDetail = frag;
                            root._DonDatDetail.open();
                            root.bus.publish('DonDatChanel', 'loadDetailPage', {
                                Id: selected.id
                            });
                        });
                    } else {
                        root._DonDatDetail.open();
                        root.bus.publish('DonDatChanel', 'loadDetailPage', {
                            Id: selected.id
                        });
                    }
                }
            },
            onCloseDonDatDetail: function() {
                    this._DonDatDetail.close();
                    this.loadDataInit();
                }
                //#endregion
                //#endregion
        };
        return Controller.extend('app.DonDat.List', oController);
    });
    