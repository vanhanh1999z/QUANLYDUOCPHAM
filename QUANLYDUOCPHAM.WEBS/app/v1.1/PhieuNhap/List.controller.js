sap.ui.define([
    'sap/ui/core/Core',
    'sap/ui/core/mvc/Controller',
    'sap/m/MessageToast',
    'app/ext/CoreJsonModel',
    'app/globalformatter',
    "sap/ui/core/Fragment",
    'sap/ui/export/library',
    'sap/ui/export/Spreadsheet',


], function(Core, Controller, MessageToast, CoreJsonModel, GlobalFormatter, Fragment,exportLibrary,Spreadsheet ) {
    'use strict';
    var EdmType = exportLibrary.EdmType;
    const oController = {
        fs: GlobalFormatter,
        mainModel: new CoreJsonModel(),
        onInit: function() {
            this.router = sap.ui.core.UIComponent.getRouterFor(this);
            this.bus = sap.ui.getCore().getEventBus();
            this.getView().setModel(this.mainModel, 'mainModel');
            this.bus.subscribe('PhieuNhapChanel', 'closePhieuNhapAdd', this.closePhieuNhapAdd, this);
            this.bus.subscribe('PhieuNhapChanel', 'closeEdit', this.closeEdit, this);
            this.bus.subscribe('PhieuNhapChanel', 'switchToEditPage', this.switchToEditPage, this)
            this.loadDataInit();
            console.log(this.formatter);
        },
        onExit: function() {
            this.bus.unsubscribe('PhieuNhapChanel', 'closePhieuNhapAdd', this.closePhieuNhapAdd, this)
            this.bus.unsubscribe('PhieuNhapChanel', 'closeEdit', this.closeEdit, this)
            this.bus.unsubscribe('PhieuNhapChanel', 'switchToEditPage', this.switchToEditPage, this)
        },
        loadDataInit: function() {
            let root = this;
            this.mainModel.getAll(sdConfig.adminApiEndpoint + "phieunhap/getall").success(dt => {
                if (dt) {
                    console.log(dt);
                    for (var i = 0; i < dt.data.length; i++) {
                        dt.data[i]['STT'] = i + 1;
                    }
                    root.mainModel.setData(dt.data)
                } else return [];
            })
        },

        onAddButtonPress: function() {
            const root = this;
            if (!this._addPhieuNhap) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.PhieuNhap.Add",
                    type: "XML",
                    controller: this
                }).then(function(frag) {
                    root._addPhieuNhap = frag;
                    root._addPhieuNhap.open();
                });
            } else {
                root._addPhieuNhap.open();
            }
        },
        closePhieuNhapAdd: function() {
            this._addPhieuNhap.close();
            this.loadDataInit();
        },
        loadEditPage: function(id) {
            let root = this;
            if (!this._editPhieuNhap) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.PhieuNhap.Edit",
                    type: "XML",
                    controller: this
                }).then(function(frag) {
                    root._editPhieuNhap = frag.open();
                    root.bus.publish('PhieuNhapChanel', 'loadEditPage', {
                        Id: id
                    });
                });
            } else {
                this._editPhieuNhap.open();
                this.bus.publish('PhieuNhapChanel', 'loadEditPage', {
                    Id: id
                });

            }
            if (this._PhieuNhapDetail) {
                this._PhieuNhapDetail.close();
            }
        },
        onRowEdit: function(oEvent) {
            let selectedId = this.getView().getModel('mainModel').getProperty('ID', oEvent.getParameter('row').getBindingContext('mainModel'));
            this.loadEditPage(selectedId)

        },
        switchToEditPage: function(oChanel, oEvent, oData) {
            this.loadEditPage(oData.Id)
        },
        closeEdit: function() {
            this._editPhieuNhap.close();
            this.loadDataInit();
        },
        onRowDelete: function(oEvent) {
            let root = this;
            let selectedId = this.getView().getModel('mainModel').getProperty('ID', oEvent.getParameter('row').getBindingContext('mainModel'));
            new CoreJsonModel().deleteById(sdConfig.adminApiEndpoint + "phieunhap/delete/" + selectedId).success(dt => {
                MessageToast.show(dt.message);
                root.loadDataInit();
            })
        },
        onCellClick: function(oEvent) {
            let selected = this.getView().getModel('mainModel').getProperty('', oEvent.getParameter('rowBindingContext'));
            if (selected) {
                const root = this;
                if (!this._PhieuNhapDetail) {
                    Fragment.load({
                        id: root.getView().getId(),
                        name: "app.PhieuNhap.Detail",
                        type: "XML",
                        controller: this
                    }).then(function(frag) {
                        root._PhieuNhapDetail = frag;
                        root._PhieuNhapDetail.open();
                        root.bus.publish('PhieuNhapChanel', 'loadDetailPage', {
                            Id: selected.ID
                        });
                    });
                } else {
                    root._PhieuNhapDetail.open();
                    root.bus.publish('PhieuNhapChanel', 'loadDetailPage', {
                        Id: selected.ID
                    });
                }
            }
        },
        onClosePhieuNhapDetail: function() {
            this._PhieuNhapDetail.close();
            this.loadDataInit();
        },
        sortAscending: function(oEvent) {
            console.log('sortingasc');
            const col = oEvent.getSource().getParent().getParent();
            col.setSorted(true);
            col.setSortOrder("Ascending");
            const colName = col.getSortProperty();
            for (let i = 0; i < this.selector.Orders.length; i++) {
                if (this.selector.Orders[i].Name == colName) {
                    this.selector.Orders[i].Type = OrderType.Ascending;
                    this.reloadData();
                    MessageToast.show('??p d???ng th??nh c??ng!', {
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
            MessageToast.show('??p d???ng th??nh c??ng!', {
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
                    MessageToast.show('??p d???ng th??nh c??ng!', {
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
            MessageToast.show('??p d???ng th??nh c??ng!', {
                width: '30em',
                duration: 5000
            });
        },
        createColumnConfig: function () {
            var aCols = [];
            aCols.push({
                label: 'ID',
                type: EdmType.Number,
                property: 'STT',
                scale: 0
            });

            aCols.push({
                label: 'Ng??y nh???p',
                property: 'NGAYNHAP',
                type: EdmType.Date,
                inputFormat: 'yyyymmdd',
            });

            aCols.push({
                label: 'T??n kho',
                property: 'TENKHO',
                type: EdmType.String
            });

            aCols.push({
                label: '?????a ch??? kho',
                property: 'DIACHIKHO',
                type: EdmType.String
            });

            aCols.push({
                label: 'M?? ????n mua',
                property: 'IDDONMUA',
                type: EdmType.String
            });

            aCols.push({
                label: 'Nh?? cung c???p',
                property: 'TENNCC',
                type: EdmType.String
            });

            aCols.push({
                label: '?????a ch??? NCC',
                property: 'DIACHINCC',
                type: EdmType.String
            });

            aCols.push({
                label: 'S??? ??i???n tho???i NCC',
                property: 'DIENTHOAINCC',
                type: EdmType.Number
            });

            aCols.push({
                label: 'Tr???ng th??i nh???n',
                property: 'TRANGTHAINHAN',
                trueValue: "???? nh???n",
                falseValue: "Ch??a nh???n",
                type: EdmType.Boolean,
                textAlight: 'center'
            });


            return aCols;
        },
        exportExcel: function () {
            var aCols, oRowBinding, oSettings, oSheet, oTable;
            if (!this._oTable) {
                this._oTable = this.byId('mainTable');
            }

            oTable = this._oTable;
            oRowBinding = oTable.getBinding('rows');
            console.log(oRowBinding);
            aCols = this.createColumnConfig();
            console.log(aCols);

            oSettings = {
                fileName: "PhieuNhap.xlsx",
                workbook: {
                    columns: aCols,
                    hierarchyLevel: 'Level',
                    context: {
                        sheetName: "Danh s??ch",
                        title: "Danh s??ch Phi???u nh???p",
                        application: "Ph???n m???m qu???n l?? kho d?????c ph???m",
                        modifiedBy: "L??u V??n H???nh"
                    }
                },
                dataSource: oRowBinding,
            };

            oSheet = new Spreadsheet(oSettings);
            oSheet.build().finally(function () {
                oSheet.destroy();
            });
        }
        //#endregion
        //#endregion
    };
    return Controller.extend('app.PhieuNhap.List', oController);
});