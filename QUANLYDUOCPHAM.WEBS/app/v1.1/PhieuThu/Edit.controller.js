
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
                this.bus.subscribe('PhieuThuChanel', 'loadEditPage', this.loadEditPage, this);
            },
            onExit: function() {
                this.bus.unsubscribe('PhieuThuChanel', 'loadEditPage', this.loadEditPage, this);
            },
            loadEditPage: function(sChanel, sEvent, oData) {
                let root = this;
                new CoreJsonModel().getById(sdConfig.adminApiEndpoint + 'phieuthu', String(oData.Id).trim()).success(dt => {
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
            
                    this.getView().byId('maPhieu').setValue('');
                    this.setState("maPhieu", 'None');
                
                    this.getView().byId('ngayThu').setValue('');
                    this.setState("ngayThu", 'None');
                
                    this.getView().byId('soTienNop').setValue('');
                    this.setState("soTienNop", 'None');
                
                    this.getView().byId('maKH').setValue('');
                    this.setState("maKH", 'None');
                
                    this.getView().byId('tenQuanLy').setValue('');
                    this.setState("tenQuanLy", 'None');
                
                    this.getView().byId('idPhieuGiao').setValue('');
                    this.setState("idPhieuGiao", 'None');
                
        },
        getTextInput: function() {
            let bodyData = {

                    id : String(this.getView().byId('maPhieu').getValue()).trim(),
                
                    ngaythu : String(this.getView().byId('ngayThu').getValue()).trim(),
                
                    sotiennop : String(this.getView().byId('soTienNop').getValue()).trim(),
                
                    idkhach : String(this.getView().byId('maKH').getValue()).trim(),
                
                    tenquanly : String(this.getView().byId('tenQuanLy').getValue()).trim(),
                
                    idphieugiao : String(this.getView().byId('idPhieuGiao').getValue()).trim(),
                
            };
            return bodyData
        },
            onCancel: function() {
                this.bus.publish('PhieuThuChanel', 'closeEdit')
                this.clearForm();

            },
            save: function() {
                var root = this;
                if (true) {
                    let dataBody = this.getTextInput();
                    let addModel = new CoreJsonModel();
                    addModel.postToAPI(sdConfig.adminApiEndpoint + "PhieuThu/update", dataBody).success(dt => {
                        MessageToast.show(dt.message);
                        root.onCancel();
                    })
                    this.clearForm();
                }
            },
            setState: function(id, state, valueState = '') {
                this.getView().byId(id).setValueState(state);
                this.getView().byId(id).setValueStateText(valueState);
            }
        };
        return Controller.extend('app.PhieuThu.List', oController);
    });
    