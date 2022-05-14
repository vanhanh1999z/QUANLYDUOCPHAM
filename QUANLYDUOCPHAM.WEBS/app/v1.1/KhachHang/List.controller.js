
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

], function (Core, Controller, MessageToast, MessageBox, Connector, CoreJsonModel, GlobalFormatter, Spreadsheet, Device, Fragment,exportLibrary) {
    'use strict';
    var EdmType = exportLibrary.EdmType;

    const oController = {
        globalFormatter: GlobalFormatter,
        mainModel: new CoreJsonModel(),
        onInit: function () {
            this.router = sap.ui.core.UIComponent.getRouterFor(this);
            this.bus = sap.ui.getCore().getEventBus();
            this.getView().setModel(this.mainModel, 'mainModel');
            this.bus.subscribe('KhachHangChanel', 'closeKhachHangAdd', this.closeKhachHangAdd, this);
            this.bus.subscribe('KhachHangChanel', 'closeEdit', this.closeEdit, this);
            this.bus.subscribe('KhachHangChanel', 'switchToEditPage', this.switchToEditPage, this)
            this.loadDataInit();
        },
        onExit: function () {
            this.bus.unsubscribe('KhachHangChanel', 'closeKhachHangAdd', this.closeKhachHangAdd, this)
            this.bus.unsubscribe('KhachHangChanel', 'closeEdit', this.closeEdit, this)
            this.bus.unsubscribe('KhachHangChanel', 'switchToEditPage', this.switchToEditPage, this)
        },
        loadDataInit: function () {
            let root = this;
            this.mainModel.getAll(sdConfig.adminApiEndpoint + "khachhang/getall").success(dt => {
                if (dt) {
                    for (var i = 0; i < dt.data.length; i++) {
                        dt.data[i]['STT'] = i + 1;
                    }
                    root.mainModel.setData(dt.data)
                } else return [];
            })
        },
        onAddButtonPress: function () {
            const root = this;
            if (!this._addKhachHang) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.KhachHang.Add",
                    type: "XML",
                    controller: this
                }).then(function (frag) {
                    root._addKhachHang = frag;
                    root._addKhachHang.open();
                });
            } else {
                root._addKhachHang.open();
            }
        },
        closeKhachHangAdd: function () {
            this._addKhachHang.close();
            this.loadDataInit();
        },
        loadEditPage: function (id) {
            let root = this;
            if (!this._editKhachHang) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.KhachHang.Edit",
                    type: "XML",
                    controller: this
                }).then(function (frag) {
                    root._editKhachHang = frag;
                    root._editKhachHang.open();
                    root.bus.publish('KhachHangChanel', 'loadEditPage', {
                        Id: id
                    }); //null
                });
            } else {
                root._editKhachHang.open();
                this.bus.publish('KhachHangChanel', 'loadEditPage', {
                    Id: id
                }); //null
            }
        },
        onRowEdit: function (oEvent) {
            let selectedId = this.getView().getModel('mainModel').getProperty('id', oEvent.getParameter('row').getBindingContext('mainModel'));
            this.loadEditPage(selectedId)

        },
        switchToEditPage: function (oChanel, oEvent, oData) {
            this.loadEditPage(oData.Id)
        },
        closeEdit: function () {
            this._editKhachHang.close();
            this.loadDataInit();
        },
        onRowDelete: function (oEvent) {
            let root = this;
            let selectedId = this.getView().getModel('mainModel').getProperty('id', oEvent.getParameter('row').getBindingContext('mainModel'));
            new CoreJsonModel().deleteById(sdConfig.adminApiEndpoint + "khachhang/delete/" + selectedId).success(dt => {
                MessageToast.show(dt.message);
                root.loadDataInit();
            })
        },
        onCellClick: function (oEvent) {
            let selected = this.getView().getModel('mainModel').getProperty('', oEvent.getParameter('rowBindingContext'));
            if (selected) {
                const root = this;
                if (!this._KhachHangDetail) {
                    Fragment.load({
                        id: root.getView().getId(),
                        name: "app.KhachHang.Detail",
                        type: "XML",
                        controller: this
                    }).then(function (frag) {
                        root._KhachHangDetail = frag;
                        root._KhachHangDetail.open();
                        root.bus.publish('KhachHangChanel', 'loadDetailPage', {
                            Id: selected.id
                        });
                    });
                } else {
                    root._KhachHangDetail.open();
                    root.bus.publish('KhachHangChanel', 'loadDetailPage', {
                        Id: selected.id
                    });
                }
            }
        },
        onCloseKhachHangDetail: function () {
            this._KhachHangDetail.close();
            this.loadDataInit();
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
                label: 'Tên khách hàng',
                property: 'tenkh',
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
        exportExcel: function () {
            var aCols, oRowBinding, oSettings, oSheet, oTable;
            if (!this._oTable) {
                this._oTable = this.byId('mainTable');
            }

            oTable = this._oTable;
            oRowBinding = oTable.getBinding('rows');
            console.log(oRowBinding);
            aCols = this.createColumnConfig();

            oSettings = {
                fileName: "KhachHang.xlsx",
                workbook: {
                    columns: aCols,
                    hierarchyLevel: 'Level',
                    context: {
                        sheetName: "Danh sách",
                        title: "Danh sách khách hàng",
                        application: "Phần mềm quản lý kho dược phẩm",
                        modifiedBy: "Lưu Văn Hạnh"
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
    return Controller.extend('app.KhachHang.List', oController);
});
