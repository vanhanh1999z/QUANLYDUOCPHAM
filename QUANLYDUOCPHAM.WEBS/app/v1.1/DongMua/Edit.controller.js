
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
], function (Core, Controller, MessageToast, MessageBox, Connector, CoreJsonModel, GlobalFormatter, Fragment, Spreadsheet, Device) {
    'use strict';
    const oController = {
        globalFormatter: GlobalFormatter,
        mainModel: new CoreJsonModel(),
        hangModel: new CoreJsonModel(),
        nccModel: new CoreJsonModel(),
        selectedId: {},
        onInit: function () {
            this.router = sap.ui.core.UIComponent.getRouterFor(this);
            this.bus = sap.ui.getCore().getEventBus();
            this.getView().setModel(this.mainModel, 'mainModel');
            this.getView().setModel(this.hangModel, 'hangModel');
            this.getView().setModel(this.nccModel);
            this.bus.subscribe('DongMuaChanel', 'loadEditPage', this.loadEditPage, this);
            this.initialize();
        },
        initialize: function () {
            this.loadDataHang();
            this.loadDataNCC();
        },
        onExit: function () {
            this.bus.unsubscribe('DongMuaChanel', 'loadEditPage', this.loadEditPage, this);
        },
        loadEditPage: function (sChanel, sEvent, oData) {
            let root = this;
            new CoreJsonModel().getById(sdConfig.adminApiEndpoint + 'dongmua', String(oData.Id).trim()).success(dt => {
                if (dt.success === true) {
                    root.mainModel.setData({
                        ...dt.data[0]
                    });
                } else {
                    MessageToast.show(dt.message)
                }
            })
        },
        clearForm: function () {


        },

        onCancel: function () {
            this.bus.publish('DongMuaChanel', 'closeEdit')
            this.clearForm();

        },
        save: async function () {
            var root = this;

            let { iddonmua, ngaymua, soluong } = this.mainModel.getData();
            let idhang = this.mainModel.getData().idhang,
                idncc = this.mainModel.getData().idncc;

            if (this.selectedId.idhang) {
                idhang = this.selectedId.idhang;
            }
            if (this.selectedId.idncc) {
                idncc = this.selectedId.idncc;
            }



            await new CoreJsonModel().postToAPI(sdConfig.adminApiEndpoint + "dongmua/update", { iddonmua, idhang, soluong: Number(soluong) }).success(dt => {
            })

            await new CoreJsonModel().postToAPI(sdConfig.adminApiEndpoint + "donmua/update", { id: iddonmua, ngaymua, idncc }).success(dt => {
                MessageToast.show(dt.message);
                console.log(123123)

                root.onCancel();
                console.log(12312)
            })
            this.clearForm();

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
    return Controller.extend('app.DongMua.List', oController);
});
