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
    'sap/ui/Device'
], function(Core, Controller, MessageToast, MessageBox, Connector, CoreJsonModel, GlobalFormatter, Fragment, Spreadsheet, Device) {
    'use strict';
    const oController = {
        globalFormatter: GlobalFormatter,
        mainModel: new CoreJsonModel(),
        onInit: function() {
            this.router = sap.ui.core.UIComponent.getRouterFor(this);
            this.bus = sap.ui.getCore().getEventBus();
            this.getView().setModel(this.mainModel, 'mainModel');
            this.bus.subscribe('HangChanel', 'loadEditPage', this.loadEditPage, this);
        },
        onExit: function() {
            this.bus.unsubscribe('HangChanel', 'loadEditPage', this.loadEditPage, this);
        },
        loadEditPage: function(sChanel, sEvent, oData) {
            let root = this;
            this._id = oData.Id;
            new CoreJsonModel().getById(sdConfig.adminApiEndpoint + 'hang', String(oData.Id).trim()).success(dt => {
                if (dt.success === true) {
                    root.mainModel.setData({
                        ...dt.data
                    });
                } else {
                    MessageToast.show(dt.message)
                }
            })
        },
        clearForm: function() {
            this.setTextInput('maHang');
            this.setTextInput('tenHang');
            this.setTextInput('moTa');
            this.setTextInput('donVi');
            this.setState("maHang", 'None');
            this.setState("tenHang", 'None');
            this.setState("moTa", 'None');
            this.setState("donVi", 'None');
        },
        onCancel: function() {
            this.bus.publish('HangChanel', 'closeEdit')
            this.clearForm();

        },
        save: function() {
            var root = this;
            if (this.validator()) {
                let dataBody = this.getTextInput();
                let addModel = new CoreJsonModel();
                addModel.postToAPI(sdConfig.adminApiEndpoint + "hang/update", dataBody).success(dt => {
                    MessageToast.show(dt.message);
                    root.onCancel();
                    root.bus.publish('HangChanel', 'loadDetailPage', {Id: root._id});
                });
                this.clearForm();
            }
        },
        validator: function() {
            var isCheck = false;
            let objInput = this.getTextInput();
            let {
                id,
                tenhang,
                donvi
            } = objInput;
            if (id === '') {
                this.setState('maHang', 'Error', 'Mã hàng không được để trống');
            } else if (id.length > 6) {
                this.setState('maHang', 'Error', 'Mã hàng không thể lớn hơn 6 ký tự');
            } else {
                this.setState('maHang', 'None');
                isCheck = true
            }
            if (tenhang === '') {
                this.setState('tenHang', 'Error', 'Tên hàng  không được để trống');
                isCheck = false;
            } else {
                this.setState('tenHang', 'None');
                isCheck = true
            }
            if (donvi === '') {
                this.setState('donVi', 'Error', 'Đơn vị không được để trống');
                isCheck = false;
            } else {
                this.setState('donVi', 'None');
                isCheck = true
            }
            return isCheck;
        },
        getTextInput: function() {
            let bodyData = {
                id: String(this.getView().byId('maHang').getValue()).trim(),
                tenhang: String(this.getView().byId('tenHang').getValue()).trim(),
                mota: String(this.getView().byId('moTa').getValue()).trim(),
                donvi: String(this.getView().byId('donVi').getValue()).trim(),
            };
            return bodyData
        },
        setTextInput: function(id, input = '') {
            switch (id) {
                case 'maHang':
                    this.getView().byId('maHang').setValue(input);
                    break;
                case 'tenHang':
                    this.getView().byId('tenHang').setValue(input);
                    break;
                case 'moTa':
                    this.getView().byId('moTa').setValue(input);
                    break;
                case 'donVi':
                    this.getView().byId('donVi').setValue(input);

            }
        },
        setState: function(id, state, valueState = '') {
            this.getView().byId(id).setValueState(state);
            this.getView().byId(id).setValueStateText(valueState);
        }
    };
    return Controller.extend('app.Hang.List', oController);
});