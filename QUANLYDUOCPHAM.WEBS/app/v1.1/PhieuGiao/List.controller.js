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
            this.bus.subscribe('PhieuGiaoChanel', 'closePhieuGiaoAdd', this.closePhieuGiaoAdd, this);
            this.bus.subscribe('PhieuGiaoChanel', 'closeEdit', this.closeEdit, this);
            this.bus.subscribe('PhieuGiaoChanel', 'switchToEditPage', this.switchToEditPage, this)
            this.loadDataInit();
        },
        onAfterRendering: function() {
            // let table = this.getView().byId('mainTable');
            // for (let i = 0; i < table.getColumns().length; i++) {
            //     table.autoResizeColumn(i);
            // }
            MessageToast.show('Tải xong dữ liệu...')
        },
        onExit: function() {
            this.bus.unsubscribe('PhieuGiaoChanel', 'closePhieuGiaoAdd', this.closePhieuGiaoAdd, this)
            this.bus.unsubscribe('PhieuGiaoChanel', 'closeEdit', this.closeEdit, this)
            this.bus.unsubscribe('PhieuGiaoChanel', 'switchToEditPage', this.switchToEditPage, this)
        },
        loadDataInit: function() {
            let root = this;
            this.mainModel.getAll(sdConfig.adminApiEndpoint + "phieugiao/getall").success(dt => {
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
            if (!this._addPhieuGiao) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.PhieuGiao.Add",
                    type: "XML",
                    controller: this
                }).then(function(frag) {
                    root._addPhieuGiao = frag;
                    root._addPhieuGiao.open();
                });
            } else {
                root._addPhieuGiao.open();
            }
        },
        closePhieuGiaoAdd: function() {
            this._addPhieuGiao.close();
            this.loadDataInit();
        },
        loadEditPage: function(id) {
            let root = this;
            if (!this._editPhieuGiao) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.PhieuGiao.Edit",
                    type: "XML",
                    controller: this
                }).then(function(frag) {
                    root._editPhieuGiao = frag;
                    root._editPhieuGiao.open();
                    root.bus.publish('PhieuGiaoChanel', 'loadEditPage', {
                        Id: id
                    }); //null
                });
            } else {
                root._editPhieuGiao.open();
                this.bus.publish('PhieuGiaoChanel', 'loadEditPage', {
                    Id: id
                }); //null
            }
            if (this._PhieuGiaoDetail) {
                this._PhieuGiaoDetail.close();
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
            this._editPhieuGiao.close();
            this.loadDataInit();
        },
        onRowDelete: function(oEvent) {
            let root = this;
            let selectedId = this.getView().getModel('mainModel').getProperty('id', oEvent.getParameter('row').getBindingContext('mainModel'));
            new CoreJsonModel().deleteById(sdConfig.adminApiEndpoint + "phieugiao/delete/" + selectedId).success(dt => {
                MessageToast.show(dt.message);
                root.loadDataInit();
            })
        },
        onCellClick: function(oEvent) {
            let selected = this.getView().getModel('mainModel').getProperty('', oEvent.getParameter('rowBindingContext'));
            if (selected) {
                const root = this;
                if (!this._PhieuGiaoDetail) {
                    Fragment.load({
                        id: root.getView().getId(),
                        name: "app.PhieuGiao.Detail",
                        type: "XML",
                        controller: this
                    }).then(function(frag) {
                        root._PhieuGiaoDetail = frag;
                        root._PhieuGiaoDetail.open();
                        root.bus.publish('PhieuGiaoChanel', 'loadDetailPage', {
                            Id: selected.id
                        });
                    });
                } else {
                    root._PhieuGiaoDetail.open();
                    root.bus.publish('PhieuGiaoChanel', 'loadDetailPage', {
                        Id: selected.id
                    });
                }
            }
        },
        onClosePhieuGiaoDetail: function() {
            this._PhieuGiaoDetail.close();
            this.loadDataInit();
        },
        sortAscending: function(oEvent) {
            const col = oEvent.getSource().getParent().getParent();
            col.setSorted(true);
            col.setSortOrder("Ascending");
            // const colName = col.getSortProperty();
            // for (let i = 0; i < this.selector.Orders.length; i++) {
            //     if (this.selector.Orders[i].Name == colName) {
            //         this.selector.Orders[i].Type = OrderType.Ascending;
            //         this.reloadData();
            //         MessageToast.show('Áp dụng thành công!', {
            //             width: '30em',
            //             duration: 5000
            //         });
            //         return;
            //     }
            // }
            // this.selector.Orders.push({
            //     Name: colName,
            //     Type: OrderType.Ascending
            // })
            // this.reloadData();
            MessageToast.show('Áp dụng thành công!', {
                width: '30em',
                duration: 5000
            });
        },
        sortDescending: function(oEvent) {
            const col = oEvent.getSource().getParent().getParent();
            console.log(col);
            col.setSorted(true);
            col.setSortOrder("Descending");
            // const colName = col.getSortProperty();
            // for (let i = 0; i < this.selector.Orders.length; i++) {
            //     if (this.selector.Orders[i].Name == colName) {
            //         this.selector.Orders[i].Type = OrderType.Descending;
            //         this.reloadData();
            //         MessageToast.show('Áp dụng thành công!', {
            //             width: '30em',
            //             duration: 5000
            //         });
            //         return;
            //     }
            // }
            // this.selector.Orders.push({
            //     Name: colName,
            //     Type: OrderType.Descending
            // })
            // this.reloadData();
            MessageToast.show('Áp dụng thành công!', {
                width: '30em',
                duration: 5000
            });
        },
        //#endregion
        //#endregion
    };
    return Controller.extend('app.PhieuGiao.List', oController);
});