
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
                this.bus.subscribe('KhachHangChanel', 'loadEditPage', this.loadEditPage, this);
            },
            onExit: function() {
                this.bus.unsubscribe('KhachHangChanel', 'loadEditPage', this.loadEditPage, this);
            },
            loadEditPage: function(sChanel, sEvent, oData) {
                let root = this;
                new CoreJsonModel().getById(sdConfig.adminApiEndpoint + 'khachhang', String(oData.Id).trim()).success(dt => {
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
            
                    this.setTextInput('maKh');
                    this.setState("maKh", 'None');
                
                    this.setTextInput('tenKh');
                    this.setState("tenKh", 'None');
                
                    this.setTextInput('diaChi');
                    this.setState("diaChi", 'None');
                
                    this.setTextInput('dienThoai');
                    this.setState("dienThoai", 'None');
                
        },
            onCancel: function() {
                this.bus.publish('KhachHangChanel', 'closeEdit')
                this.clearForm();

            },
            save: function() {
                var root = this;
                if (true) {
                    let dataBody = this.getTextInput();
                    let addModel = new CoreJsonModel();
                    addModel.postToAPI(sdConfig.adminApiEndpoint + "KhachHang/update", dataBody).success(dt => {
                        MessageToast.show(dt.message);
                        root.bus.publish('KhachHangChanel', 'reloadModelDetail')
                        root.onCancel();
                    })
                    this.clearForm();
                }
            },
            getTextInput: function () {
                let bodyData = {
                    id: String(this.getView().byId('maKh').getValue()).trim(),
                    tenkh: String(this.getView().byId('tenKh').getValue()).trim(),
                    diachi: String(this.getView().byId('diaChi').getValue()).trim(),
                    dienthoai: String(this.getView().byId('dienThoai').getValue()).trim(),
                };
                return bodyData
            },
            setTextInput: function (id, input = '') {
                switch (id) {
                    case 'maKh':
                        this.getView().byId('maKh').setValue(input);
                        break;
                    case 'tenKh':
                        this.getView().byId('tenKh').setValue(input);
                        break;
                    case 'diaChi':
                        this.getView().byId('diaChi').setValue(input);
                        break;
                    case 'dienThoai':
                        this.getView().byId('dienThoai').setValue(input);

                }
            },
            setState: function(id, state, valueState = '') {
                this.getView().byId(id).setValueState(state);
                this.getView().byId(id).setValueStateText(valueState);
            }
        };
        return Controller.extend('app.KhachHang.List', oController);
    });
    