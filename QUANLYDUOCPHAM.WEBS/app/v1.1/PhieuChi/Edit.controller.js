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
        mainModel: new CoreJsonModel(),
        nccModel: new CoreJsonModel(),
        phieuNhapModel: new CoreJsonModel(),
        orgModel: new Object(),
        onInit: function() {
            this.router = sap.ui.core.UIComponent.getRouterFor(this);
            this.bus = sap.ui.getCore().getEventBus();
            //SET MODEL
            this.getView().setModel(this.mainModel, 'mainModel');
            this.getView().setModel(this.phieuNhapModel, 'phieuNhapModel');
            this.getView().setModel(this.nccModel, 'nccModel');
            //PROPS DATA
            this.bus.subscribe('PhieuChiChanel', 'loadEditPage', this.loadEditPage, this);
            //LOAD INITIALIZE FUNCTION
            this.initialize();
        },
        onExit: function() {
            this.bus.unsubscribe('PhieuChiChanel', 'loadEditPage', this.loadEditPage, this);
        },
        initialize: function() {
            this.loadNCCData();
            this.loadPhieuNhapData();
        },
        loadEditPage: function(sChanel, sEvent, oData) {
            let root = this;
            new CoreJsonModel().getById(sdConfig.adminApiEndpoint + 'phieuchi', String(oData.Id).trim()).success(dt => {
                if (dt.success === true) {
                    root.mainModel.setData({
                        ...dt.data[0]
                    });
                    this.orgModel = {...dt.data[0] }
                } else {
                    MessageToast.show(dt.message)
                }
            })
        },
        loadNCCData: function() {
            let root = this;
            new CoreJsonModel().getAll(sdConfig.adminApiEndpoint + 'nhaccungcap/getall').success(dt => {
                if (dt.success === true) {
                    let oData = dt.data.map(dt => dt);
                    oData.unshift({
                        id: '-1',
                        tenncc: 'Vui lòng lựa chọn nhà cung cấp...'
                    })
                    root.nccModel.setData(oData);
                } else {
                    MessageToast.show(dt.message)
                }
            })
        },
        loadPhieuNhapData: function() {
            let root = this;
            new CoreJsonModel().getAll(sdConfig.adminApiEndpoint + 'phieunhap/getall').success(dt => {
                if (dt.success === true) {
                    let oData = dt.data.map(dt => dt);
                    root.phieuNhapModel.setData(oData);
                } else {
                    MessageToast.show(dt.message)
                }
            })
        },
        clearForm: function() {
            this.mainModel.setData({...this.orgModel });
        },
        onCancel: function() {
            this.bus.publish('PhieuChiChanel', 'closeEdit')
            this.clearForm();
        },
        save: function() {
            var root = this;
            if (true) {
                let dataBody = this.mainModel.getData();
                dataBody.ngaychi = moment(this.getView().byId('ngayChi').getDateValue()).format('yyyy-MM-DD')
                new CoreJsonModel().postToAPI(sdConfig.adminApiEndpoint + "PhieuChi/update", dataBody).success(dt => {
                    MessageToast.show(dt.message);
                    root.onCancel();
                })
                this.clearForm();
            }
        },
        onValueHelpRequest: function() {
            var oView = this.getView();
            if (!this._pValueHelpDialog) {
                this._pValueHelpDialog = Fragment.load({
                    id: oView.getId(),
                    name: "app.PhieuChi.Fragment.Select",
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
                oInput = this.byId("idPhieuNhap");

            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }
            oInput.setValue(oSelectedItem.getTitle());
        },
        onSearch: function(oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("ID", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter([oFilter]);
        },
    };
    return Controller.extend('app.PhieuChi.List', oController);
});