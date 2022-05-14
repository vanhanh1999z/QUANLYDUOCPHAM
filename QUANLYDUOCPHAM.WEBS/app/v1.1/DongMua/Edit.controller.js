
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
                this.bus.subscribe('DongMuaChanel', 'loadEditPage', this.loadEditPage, this);
            },
            onExit: function() {
                this.bus.unsubscribe('DongMuaChanel', 'loadEditPage', this.loadEditPage, this);
            },
            loadEditPage: function(sChanel, sEvent, oData) {
                let root = this;
                new CoreJsonModel().getById(sdConfig.adminApiEndpoint + 'dongmua', String(oData.Id).trim()).success(dt => {
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
            
                    this.getView().byId('iddonmua').setValue('');
                    this.setState("iddonmua", 'None');
                
                    this.getView().byId('idhang').setValue('');
                    this.setState("idhang", 'None');
                
                    this.getView().byId('soluong').setValue('');
                    this.setState("soluong", 'None');
                
        },
        getTextInput: function() {
            let bodyData = {

                    iddonmua : String(this.getView().byId('iddonmua').getValue()).trim(),
                
                    idhang : String(this.getView().byId('idhang').getValue()).trim(),
                
                    soluong : String(this.getView().byId('soluong').getValue()).trim(),
                
            };
            return bodyData
        },
            onCancel: function() {
                this.bus.publish('DongMuaChanel', 'closeEdit')
                this.clearForm();

            },
            save: function() {
                var root = this;
                if (true) {
                    let dataBody = this.getTextInput();
                    let addModel = new CoreJsonModel();
                    addModel.postToAPI(sdConfig.adminApiEndpoint + "DongMua/update", dataBody).success(dt => {
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
        return Controller.extend('app.DongMua.List', oController);
    });
    