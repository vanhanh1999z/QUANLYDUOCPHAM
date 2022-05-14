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
    "sap/ui/core/Fragment",
    'sap/ui/export/library',

], function(Core, Controller, MessageToast, MessageBox, Connector, CoreJsonModel, GlobalFormatter, Spreadsheet, Device, Fragment, exportLibrary) {
    'use strict';
    var EdmType = exportLibrary.EdmType;
    const oController = {
        fs: GlobalFormatter,
        mainModel: new CoreJsonModel(),
        onInit: function() {
            this.router = sap.ui.core.UIComponent.getRouterFor(this);
            this.bus = sap.ui.getCore().getEventBus();
            this.getView().setModel(this.mainModel, 'mainModel');
            this.bus.subscribe('NhaCungCapChanel', 'closeNhaCungCapAdd', this.closeNhaCungCapAdd, this);
            this.bus.subscribe('NhaCungCapChanel', 'closeEdit', this.closeEdit, this);
            this.bus.subscribe('NhaCungCapChanel', 'switchToEditPage', this.switchToEditPage, this)
            this.loadDataInit();
        },
        onExit: function() {
            this.bus.unsubscribe('NhaCungCapChanel', 'closeNhaCungCapAdd', this.closeNhaCungCapAdd, this)
            this.bus.unsubscribe('NhaCungCapChanel', 'closeEdit', this.closeEdit, this)
            this.bus.unsubscribe('NhaCungCapChanel', 'switchToEditPage', this.switchToEditPage, this)
        },
        loadDataInit: function() {
            let root = this;
            this.mainModel.getAll(sdConfig.adminApiEndpoint + "nhaccungcap/getall").success(dt => {
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
            if (!this._addNhaCungCap) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.NhaCungCap.Add",
                    type: "XML",
                    controller: this
                }).then(function(frag) {
                    root._addNhaCungCap = frag;
                    root._addNhaCungCap.open();
                });
            } else {
                root._addNhaCungCap.open();
            }
        },
        closeNhaCungCapAdd: function() {
            this._addNhaCungCap.close();
            this.loadDataInit();
        },
        loadEditPage: function(id) {
            let root = this;
            if (!this._editNhaCungCap) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.NhaCungCap.Edit",
                    type: "XML",
                    controller: this
                }).then(function(frag) {
                    root._editNhaCungCap = frag;
                    root._editNhaCungCap.open();
                    root.bus.publish('NhaCungCapChanel', 'loadEditPage', {
                        Id: id
                    }); //null
                });

            } else {
                root._editNhaCungCap.open();
                this.bus.publish('NhaCungCapChanel', 'loadEditPage', {
                    Id: id
                }); //null
            }

            if (this._NhaCungCapDetail) {
                this._NhaCungCapDetail.close();
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
            this._editNhaCungCap.close();
            this.loadDataInit();

        },
        onRowDelete: function(oEvent) {
            let root = this;
            let selectedId = this.getView().getModel('mainModel').getProperty('id', oEvent.getParameter('row').getBindingContext('mainModel'));
            new CoreJsonModel().deleteById(sdConfig.adminApiEndpoint + "nhaccungcap/delete/" + selectedId).success(dt => {
                MessageToast.show(dt.message);
                root.loadDataInit();
            })
        },
        onCellClick: function(oEvent) {
            let selected = this.getView().getModel('mainModel').getProperty('', oEvent.getParameter('rowBindingContext'));
            if (selected) {
                const root = this;
                if (!this._NhaCungCapDetail) {
                    Fragment.load({
                        id: root.getView().getId(),
                        name: "app.NhaCungCap.Detail",
                        type: "XML",
                        controller: this
                    }).then(function(frag) {
                        root._NhaCungCapDetail = frag;
                        root._NhaCungCapDetail.open();
                        root.bus.publish('NhaCungCapChanel', 'loadDetailPage', {
                            Id: selected.id
                        });
                    });
                } else {
                    root._NhaCungCapDetail.open();
                    root.bus.publish('NhaCungCapChanel', 'loadDetailPage', {
                        Id: selected.id
                    });
                }
            }
        },
        onCloseNhaCungCapDetail: function() {
            this._NhaCungCapDetail.close();
            this.loadDataInit();
        },
        sortAscending: function(oEvent) {
            const col = oEvent.getSource().getParent().getParent();
            col.setSorted(true);
            col.setSortOrder("Ascending");
            const colName = col.getSortProperty();
            for (let i = 0; i < this.selector.Orders.length; i++) {
                if (this.selector.Orders[i].Name == colName) {
                    this.selector.Orders[i].Type = OrderType.Ascending;
                    this.reloadData();
                    MessageToast.show('Áp dụng thành công!', {
                        width: '30em',
                        duration: 5000
                    });
                    return;
                }
            }
            this.selector.Orders.push({
                Name: colName,
                Type: OrderType.Ascending
            })
            this.reloadData();
            MessageToast.show('Áp dụng thành công!', {
                width: '30em',
                duration: 5000
            });
        },
        sortDescending: function(oEvent) {
            const col = oEvent.getSource().getParent().getParent();
            col.setSorted(true);
            col.setSortOrder("Descending");
            const colName = col.getSortProperty();
            for (let i = 0; i < this.selector.Orders.length; i++) {
                if (this.selector.Orders[i].Name == colName) {
                    this.selector.Orders[i].Type = OrderType.Descending;
                    this.reloadData();
                    MessageToast.show('Áp dụng thành công!', {
                        width: '30em',
                        duration: 5000
                    });
                    return;
                }
            }
            this.selector.Orders.push({
                Name: colName,
                Type: OrderType.Descending
            })
            this.reloadData();
            MessageToast.show('Áp dụng thành công!', {
                width: '30em',
                duration: 5000
            });
        },
        createColumnConfig: function() {
            var aCols = [];
            aCols.push({
                label: 'ID',
                type: EdmType.Number,
                property: 'STT',
                scale: 0
            });

            aCols.push({
                label: 'Tên NCC',
                property: 'tenncc',
                type: EdmType.String
            });

            aCols.push({
                label: 'Địa chỉ',
                property: 'diachi',
                type: EdmType.String
            });

            aCols.push({
                label: 'Số điện thoại',
                property: 'dienthoai',
                type: EdmType.Number
            });


            return aCols;
        },
        exportExcel: function() {
                var aCols, oRowBinding, oSettings, oSheet, oTable;
                if (!this._oTable) {
                    this._oTable = this.byId('mainTable');
                }

                oTable = this._oTable;
                oRowBinding = oTable.getBinding('rows');
                console.log(oRowBinding);
                aCols = this.createColumnConfig();

                oSettings = {
                    fileName: "NhaCungCap.xlsx",
                    workbook: {
                        columns: aCols,
                        hierarchyLevel: 'Level',
                        context: {
                            sheetName: "Danh sách",
                            title: "Danh sách nhà cung cáp",
                            application: "Phần mềm quản lý kho dược phẩm",
                            modifiedBy: "Lưu Văn Hạnh"
                        }
                    },
                    dataSource: oRowBinding,
                };

                oSheet = new Spreadsheet(oSettings);
                oSheet.build().finally(function() {
                    oSheet.destroy();
                });
            }
            //#endregion
            //#endregion
    };
    return Controller.extend('app.NhaCungCap.List', oController);
});