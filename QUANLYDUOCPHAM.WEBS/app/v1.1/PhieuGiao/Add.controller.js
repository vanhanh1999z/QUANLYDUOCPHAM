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
    'sap/ui/model/FilterOperator',
    'app/ext/Base.Controller',
], function(Core, Controller, MessageToast, MessageBox, Connector, CoreJsonModel, GlobalFormatter, Fragment, Spreadsheet, Device, Filter, FilterOperator, Base) {
    'use strict';
    const GROUP_NAME = 'addGroup'
    const oController = {
        globalFormatter: GlobalFormatter,
        khoModel: new CoreJsonModel(),
        donDatModel: new CoreJsonModel(),
        selectedId: {},
        Base: new Base(),
        onInit: function() {
            this.router = sap.ui.core.UIComponent.getRouterFor(this);
            this.getView().setModel(this.khoModel, 'khoModel');
            this.getView().setModel(this.donDatModel);
            this.bus = Core.getEventBus();
            this.initialize();
        },
        onExit: function() {},
        clearForm: function() {
            this.Base.resetDataFromGroup(GROUP_NAME);
        },
        initialize: function() {
            this.loadDataKho();
            this.loadDataDonDat();
            this.getView().byId('ngaygiao').setValue(moment().format('DD/MM/YYYY'));
        },
        closeArea: function() {
            this.clearForm();
            this.bus.publish('PhieuGiaoChanel', "closePhieuGiaoAdd")
        },
        onChangeTienGiao: function(oEvent) {
            let value = oEvent.getSource().getValue();
            value = value.slice(1);
            value = value.replaceAll(',', '');
            value = this.toCurrency(Number(value), 'VND')
            oEvent.getSource().setValue(value)
        },
        toCurrency: (n, curr, LanguageFormat = undefined) =>
            Intl.NumberFormat(LanguageFormat, {
                style: 'currency',
                currency: curr,
            }).format(n),
        save: function() {
            var root = this;
            let dataBody = {
                ...this.Base.getDataFromGroup(GROUP_NAME),
                ...this.selectedId
            };

            dataBody.tongtiengiao = Number((dataBody.tongtiengiao).slice(1).replaceAll(',', ''));
            dataBody.trangthainhan = Boolean(Number(dataBody.trangthainhan))
            console.log(this.selectedId);
            if (true) {
                new CoreJsonModel().postToAPI(sdConfig.adminApiEndpoint + "phieugiao/add", dataBody).success(dt => {
                    MessageToast.show(dt.message);
                    root.closeArea();
                })
                this.clearForm();
            }
        },
        loadDataKho: function() {
            let root = this;
            new CoreJsonModel().getAll(sdConfig.adminApiEndpoint + 'kho/getall').success(dt => {
                if (dt.success === true) {
                    root.khoModel.setData({
                        ...dt.data
                    });
                } else {
                    MessageToast.show(dt.message)
                }
            })
        },
        loadDataDonDat: function() {
            let root = this;
            new CoreJsonModel().getAll(sdConfig.adminApiEndpoint + 'dondat/getall').success(dt => {
                if (dt.success === true) {
                    root.donDatModel.setData({
                        DonDat: {
                            ...dt.data
                        }
                    });
                } else {
                    MessageToast.show(dt.message)
                }
            })
        },

        handleValueHelpKho: function() {
            var oView = this.getView();
            if (!this._pValueHelpDialog) {
                this._pValueHelpDialog = Fragment.load({
                    id: oView.getId(),
                    name: "app.Frag.Kho",
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
        handleValueHelpDonDat: function() {
            var oView = this.getView();
            if (!this._pValueHelpDialogDonDat) {
                this._pValueHelpDialogDonDat = Fragment.load({
                    id: oView.getId(),
                    name: "app.Frag.DonDat",
                    controller: this
                }).then(function(oValueHelpDialog) {
                    oView.addDependent(oValueHelpDialog);
                    return oValueHelpDialog;
                });
            }
            this._pValueHelpDialogDonDat.then(function(oValueHelpDialog) {
                oValueHelpDialog.open();
            }.bind(this));
        },
        handleSearch: function(oEvent) {
            let sValue = oEvent.getParameter("value");
            let oFilter = new Filter('id', FilterOperator.Contains, sValue);
            let oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([oFilter]);
        },

        handleClose: function(oEvent) {
            let root = this;
            let idElement = (oEvent.getSource().sId).split('-').pop();;
            let oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([]);
            let aContexts = oEvent.getParameter("selectedContexts");
            if (aContexts && aContexts.length) {
                let itemSelected = aContexts.map(function(oContext) {
                    return oContext.getObject()
                });
                switch (idElement) {
                    case "khoDialog":
                        this.byId('idkho').setValue(itemSelected[0].tenkho);
                        this.selectedId.idkho = itemSelected[0].id;
                        break;
                    case "donDatDialog":
                        root.getView().byId('iddondat').setValue(itemSelected[0].makh);
                        this.selectedId.iddondat = itemSelected[0].id;
                        break;
                    default:
                        break;
                }
            }
        },
    };

    return Controller.extend('app.Device.List', oController);
});