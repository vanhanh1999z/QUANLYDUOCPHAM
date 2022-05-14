
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
    'app/ext/Base.Controller',

], function (Core, Controller, MessageToast, MessageBox, Connector, CoreJsonModel, GlobalFormatter, Fragment, Spreadsheet, Device, Base) {
    'use strict';
    const GROUP_NAME = 'addGroup';
    const oController = {
        fs: GlobalFormatter,
        selectedId: {},
        Base: new Base(),
        nccModel: new CoreJsonModel(),
        hangModel: new CoreJsonModel(),
        onInit: function () {
            this.router = sap.ui.core.UIComponent.getRouterFor(this);
            this.bus = Core.getEventBus();
            this.getView().setModel(this.nccModel);
            this.getView().setModel(this.hangModel, 'hangModel');

            this.initialize();
        },
        initialize: function () {
            this.loadDataHang();
            this.loadDataNCC();
        },
        onExit: function () {
        },
        clearForm: function () {

        },
        closeArea: function () {
            this.clearForm();
            this.bus.publish('DongMuaChanel', "closeDongMuaAdd")
        },
        save: async function () {
            var root = this;
            let { id, idncc, ngaymua, idhang, soluong } = {
                ...this.Base.getDataFromGroup(GROUP_NAME),
                ...this.selectedId
            }

            console.log({ iddonmua: id, idhang, soluong })
            console.log({ id, idncc, ngaymua })
            if (true) {
                await new CoreJsonModel().postToAPI(sdConfig.adminApiEndpoint + "donmua/add", { id, idncc, ngaymua }).success(dt => {
                    MessageToast.show(dt.message);
                    root.closeArea();
                })

                await new CoreJsonModel().postToAPI(sdConfig.adminApiEndpoint + "dongmua/add", { iddonmua: id, idhang, soluong }).success(dt => {
                    MessageToast.show(dt.message);
                    root.closeArea();
                })
                this.clearForm();
            }
        },

        loadDataNCC: function () {
            let root = this;
            new CoreJsonModel().getAll(sdConfig.adminApiEndpoint + 'nhaccungcap/getall').success(dt => {
                if (dt.success === true) {
                    root.nccModel.setData({
                        NhaCungCap: {
                            ...dt.data
                        }
                    });
                } else {
                    MessageToast.show(dt.message)
                }
            })
        },
        loadDataHang: function () {
            let root = this;
            new CoreJsonModel().getAll(sdConfig.adminApiEndpoint + 'hang/getallwithoutpaning').success(dt => {
                if (dt.success === true) {
                    root.hangModel.setData({
                        ...dt.data
                    });
                } else {
                    MessageToast.show(dt.message)
                }
            })
        },
        handleValueHelpHang: function () {
            var oView = this.getView();
            if (!this._pValueHelpDialog) {
                this._pValueHelpDialog = Fragment.load({
                    id: oView.getId(),
                    name: "app.Frag.Hang",
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
        handleValueHelpNCC: function () {
            var oView = this.getView();
            if (!this._pValueHelpDialogDonDat) {
                this._pValueHelpDialogDonDat = Fragment.load({
                    id: oView.getId(),
                    name: "app.Frag.NhaCungCap",
                    controller: this
                }).then(function (oValueHelpDialog) {
                    oView.addDependent(oValueHelpDialog);
                    return oValueHelpDialog;
                });
            }
            this._pValueHelpDialogDonDat.then(function (oValueHelpDialog) {
                oValueHelpDialog.open();
            }.bind(this));
        },
        handleSearch: function (oEvent) {
            let sValue = oEvent.getParameter("value");
            let oFilter = new Filter('id', FilterOperator.Contains, sValue);
            let oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([oFilter]);
        },

        handleClose: function (oEvent) {
            let root = this;
            let idElement = (oEvent.getSource().sId).split('-').pop();;
            let oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([]);
            let aContexts = oEvent.getParameter("selectedContexts");
            if (aContexts && aContexts.length) {
                let itemSelected = aContexts.map(function (oContext) {
                    return oContext.getObject()
                });
                switch (idElement) {
                    case "dialogNCC":
                        this.byId('idncc').setValue(itemSelected[0].tenncc);
                        this.selectedId.idncc = itemSelected[0].id;
                        break;
                    case "hangDialog":
                        root.getView().byId('idhang').setValue(itemSelected[0].tenhang);
                        this.selectedId.idhang = itemSelected[0].id;
                        break;
                    default:
                        break;
                }
            }
        },



    };

    return Controller.extend('app.Device.List', oController);
});
