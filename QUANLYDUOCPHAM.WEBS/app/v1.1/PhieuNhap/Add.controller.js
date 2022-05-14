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
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"

], function(Core, Controller, MessageToast, MessageBox, Connector, CoreJsonModel, GlobalFormatter, Fragment, Spreadsheet, Device, Filter, FilterOperator) {
    'use strict';
    const oController = {
        globalFormatter: GlobalFormatter,
        khoModel: new CoreJsonModel(),
        donMuaModel: new CoreJsonModel(),
        _data: {
            "number": [""]
        },
        onInit: function() {
            var oModel = new CoreJsonModel(this._data);
            this.getView().setModel(oModel);

            this.router = sap.ui.core.UIComponent.getRouterFor(this);
            this.getView().setModel(this.khoModel, 'khoModel')
            this.getView().setModel(this.donMuaModel, 'donMuaModel')
            this.bus = Core.getEventBus();
            this.loadInitFunc();
            this.setInitDateValue();

        },
        onExit: function() {},
        loadInitFunc: function() {
            this.loadDataKho();
            this.loadDataDonMua();
        },
        setInitDateValue() {
            let now = new Date();
            this.getView().byId('ngayNhap').setDateValue(now);
        },
        clearForm: function() {

            this.getView().byId('maPhieu').setValue('');
            this.setState("maPhieu", 'None');

            this.setInitDateValue();

            this.getView().byId('tongTienNhap').setValue('');
            this.setState("tongTienNhap", 'None');

            this.getView().byId('trangThaiNhan').setSelectedKey(-1);
            this.setState("trangThaiNhan", 'None');

        },
        closeArea: function() {
            this.clearForm();
            this.bus.publish('PhieuNhapChanel', "closePhieuNhapAdd")
        },
        save: function() {
            let dataBody = this.getTextInput();
            if (this.validate() == true) {
                let addModel = new CoreJsonModel();
                addModel.postToAPI(sdConfig.adminApiEndpoint + "phieunhap/add", dataBody).success(dt => {
                    if (dt.success) {
                        MessageToast.show(dt.message)
                    };
                }).error(() => {
                    MessageToast.show('Đã xảy ra sự cố, vui lòng kiểm tra lại!');
                });
                this.closeArea();
                this.clearForm();
            }
        },
        loadDataKho: function() {
            let root = this;
            new CoreJsonModel().getAll(sdConfig.adminApiEndpoint + 'kho/getall').success(dt => {
                if (dt) root.khoModel.setData({
                    ...dt.data
                });
                else return [];
            })
        },
        loadDataDonMua: function() {
            let root = this;
            new CoreJsonModel().getAll(sdConfig.adminApiEndpoint + 'donmua/getall').success(dt => {
                if (dt) root.donMuaModel.setData({
                    ...dt.data
                });
                else return [];
            })
        },
        onValueHelpRequest: function() {
            var oView = this.getView();
            if (!this._pValueHelpDialog) {
                this._pValueHelpDialog = Fragment.load({
                    id: oView.getId(),
                    name: "app.PhieuNhap.Fragment.Select",
                    controller: this
                }).then(function(oValueHelpDialog) {
                    oView.addDependent(oValueHelpDialog);
                    return oValueHelpDialog;
                });
            }
            this._pValueHelpDialog.then(function(oValueHelpDialog) {
                oValueHelpDialog.open();
            }.bind(this));
        },
        onValueHelpDialogClose: function(oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput = this.byId("maDonMua");

            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }

            oInput.setValue(oSelectedItem.getTitle());
        },
        onSearch: function(oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("id", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter([oFilter]);
        },


        getTextInput: function() {
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
        setState: function(id, state, valueState = '') {
            this.getView().byId(id).setValueState(state);
            this.getView().byId(id).setValueStateText(valueState);
        },
        validate: function() {
            let isCheck = false;
            let {
                id,
                ngaynhap,
                tongtiennhap,
                iddonmua,
                trangthainhan
            } = this.getTextInput()
            if (id == '') {
                this.setState('maPhieu', 'Error', 'Trường này không được để trống');
            } else if (id.length > 6) {
                this.setState('maPhieu', 'Error', 'Mã phiếu nhập không thể vượt quá 6 ký tự!')
            } else {
                this.setState('maPhieu', 'None')
                isCheck = true;
            };

            if (tongtiennhap === '') {
                this.setState('tongTienNhap', 'Error', 'Trường này không được để trống');
                isCheck = false;
            } else {
                this.setState('tongTienNhap', 'None');
                isCheck = true;
            }

            if (trangthainhan === '') {
                this.setState('trangThaiNhan', 'Error', 'Trường này không được để trống');
                isCheck = false;
            } else {
                this.setState('trangThaiNhan', 'None');
                isCheck = true;
            }

            if (iddonmua === '') {
                this.setState('maDonMua', 'Error', 'Trường này không được để trống');
                isCheck = false;
            } else {
                this.setState('maDonMua', 'None');
                isCheck = true;
            }
            return isCheck;
        },
        converDate: function(date) {
            let arr;
            arr = date.split('/');
            arr = arr.reverse().join('-')
            return arr;
        }
    };

    return Controller.extend('app.Device.List', oController);
});