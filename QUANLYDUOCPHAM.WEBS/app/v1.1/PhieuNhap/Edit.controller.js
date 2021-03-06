sap.ui.define([
    'sap/ui/core/Core',
    'sap/ui/core/mvc/Controller',
    'sap/m/MessageToast',
    'sap/m/MessageBox',
    'app/ext/Auth.Connector.Adal',
    'app/ext/CoreJsonModel',
    'app/globalformatter',
    'sap/ui/core/Fragment',
    'sap/ui/export/Spreadsheet',
    'sap/ui/Device',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
], function (Core, Controller, MessageToast, MessageBox, Connector, CoreJsonModel, GlobalFormatter, Fragment, Spreadsheet, Device, Filter, FilterOperator) {
    'use strict';
    const oController = {
        globalFormatter: GlobalFormatter,
        mainModel: new CoreJsonModel(),
        khoModel: new CoreJsonModel(),
        donMuaModel: new CoreJsonModel(),
        onInit: function () {
            this.router = sap.ui.core.UIComponent.getRouterFor(this);
            this.bus = sap.ui.getCore().getEventBus();
            this.getView().setModel(this.mainModel, 'mainModel');
            this.bus.subscribe('PhieuNhapChanel', 'loadEditPage', this.loadEditPage, this);
            this.getView().setModel(this.khoModel, 'khoModel');
            this.getView().setModel(this.donMuaModel, 'donMuaModel');
            this.loadDataKho();
            this.loadDataDonMua();
        },
        onExit: function () {
            this.bus.unsubscribe('PhieuNhapChanel', 'loadEditPage', this.loadEditPage, this);
        },
        loadEditPage: function (sChanel, sEvent, oData) {
            let root = this;

            new CoreJsonModel().getById(sdConfig.adminApiEndpoint + 'phieunhap', String(oData.Id).trim()).success(dt => {
                if (dt.success === true) {
                    root.mainModel.setData({
                        ...dt.data[0]
                    });
                    root.getView().byId('maKho').setSelectedKey(dt.data[0].IDKHO);
                } else {
                    MessageToast.show(dt.message)
                }
            })
        },
        loadDataKho: function () {
            let root = this;
            new CoreJsonModel().getAll(sdConfig.adminApiEndpoint + 'kho/getall').success(dt => {
                if (dt) root.khoModel.setData({
                    ...dt.data
                });
                else return [];
            })
        },
        loadDataDonMua: function () {
            let root = this;
            new CoreJsonModel().getAll(sdConfig.adminApiEndpoint + 'donmua/getall').success(dt => {
                if (dt) root.donMuaModel.setData({
                    ...dt.data
                });
                else return [];
            })
        },
        clearForm: function () {

            this.getView().byId('maPhieu').setValue('');
            this.setState("maPhieu", 'None');

            // this.getView().byId('ngayNhap').setValue('');
            // this.setState("ngayNhap", 'None');

            this.getView().byId('tongTienNhap').setValue('0');
            this.setState("tongTienNhap", 'None');

            // this.getView().byId('maKho').setValue('');
            // this.setState("maKho", 'None');

            this.getView().byId('maDonMua').setValue('');
            this.setState("maDonMua", 'None');
            this.setState("trangThaiNhan", 'None');

        },
        getTextInput: function () {
            let ngnhap = this.getView().byId("ngayNhap").getValue();
            let tongTienNhap = this.getView().byId('tongTienNhap').getValue();
            let currency = Number(tongTienNhap.replace(/[^0-9,-]+/g, ""));
            let trangThaiNhan = Number(this.getView().byId('trangThaiNhan').getSelectedKey());
            trangThaiNhan === 1 ? trangThaiNhan = true : trangThaiNhan = false
            let bodyData = {
                id: String(this.getView().byId('maPhieu').getValue()).trim(),
                ngaynhap: String(this.converDate(ngnhap).trim()),
                tongtiennhap: currency,
                idkho: String(this.getView().byId('maKho').getSelectedKey()).trim(),
                iddonmua: String(this.getView().byId('maDonMua').getValue()).trim(),
                trangthainhan: trangThaiNhan,
            };
            return bodyData
        },
        onCancel: function () {
            this.bus.publish('PhieuNhapChanel', 'closeEdit')
            this.clearForm();

        },
        save: function () {
            let dataBody = this.getTextInput();
            if (this.validate() == true) {
                let addModel = new CoreJsonModel();
                addModel.postToAPI(sdConfig.adminApiEndpoint + "phieunhap/update", dataBody).success(dt => {
                    if (dt.success) {
                        MessageToast.show(dt.message)
                    };
                }).error(() => {
                    MessageToast.show('???? x???y ra s??? c???, vui l??ng ki???m tra l???i!');
                });
                this.onCancel();
                this.clearForm();
            }
        },
        validate: function () {
            let isCheck = false;
            let {
                id,
                ngaynhap,
                tongtiennhap,
                iddonmua,
                trangthainhan
            } = this.getTextInput()
            if (id == '') {
                this.setState('maPhieu', 'Error', 'Tr?????ng n??y kh??ng ???????c ????? tr???ng');
            } else if (id.length > 6) {
                this.setState('maPhieu', 'Error', 'M?? phi???u nh???p kh??ng th??? v?????t qu?? 6 k?? t???!')
            } else {
                this.setState('maPhieu', 'None')
                isCheck = true;
            };

            if (tongtiennhap === '') {
                this.setState('tongTienNhap', 'Error', 'Tr?????ng n??y kh??ng ???????c ????? tr???ng');
                isCheck = false;
            } else {
                this.setState('tongTienNhap', 'None');
                isCheck = true;
            }

            if (trangthainhan === '') {
                this.setState('trangThaiNhan', 'Error', 'Tr?????ng n??y kh??ng ???????c ????? tr???ng');
                isCheck = false;
            } else {
                this.setState('trangThaiNhan', 'None');
                isCheck = true;
            }

            if (iddonmua === '') {
                this.setState('maDonMua', 'Error', 'Tr?????ng n??y kh??ng ???????c ????? tr???ng');
                isCheck = false;
            } else {
                this.setState('maDonMua', 'None');
                isCheck = true;
            }
            return isCheck;
        },
        setState: function (id, state, valueState = '') {
            this.getView().byId(id).setValueState(state);
            this.getView().byId(id).setValueStateText(valueState);
        },
        onValueHelpRequest: function () {
            var oView = this.getView();
            if (!this._pValueHelpDialog) {
                this._pValueHelpDialog = Fragment.load({
                    id: oView.getId(),
                    name: "app.PhieuNhap.Fragment.Select",
                    controller: this
                }).then(function (oValueHelpDialog) {
                    oView.addDependent(oValueHelpDialog);
                    return oValueHelpDialog;
                });
            }
            this._pValueHelpDialog.then(function (oValueHelpDialog) {
                oValueHelpDialog.open();
            }.bind(this));
        },
        onValueHelpDialogClose: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput = this.byId("maDonMua");

            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }

            oInput.setValue(oSelectedItem.getTitle());
        },
        onSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("id", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter([oFilter]);
        },
        converDate: function (date) {
            let arr;
            arr = date.split('/');
            arr = arr.reverse().join('-')
            return arr;
        }
    };
    return Controller.extend('app.PhieuNhap.List', oController);
});