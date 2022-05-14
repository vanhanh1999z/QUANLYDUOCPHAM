sap.ui.define([
    'sap/ui/core/Core',
    'sap/ui/core/mvc/Controller',
    'sap/m/MessageBox',
    'app/globalformatter',
    'app/ext/Auth.Connector.Adal',
    'app/ext/CoreJsonModel',
    'sap/ui/core/Fragment'
], function (Core, Controller, MessageBox, GlobalFormatter, Connector, CoreJsonModel, Fragment) {
    'use strict';
    return Controller.extend('app.Root', {
        userModel: new CoreJsonModel(),
        notificationModel: new CoreJsonModel(),
        md_countNotif: new CoreJsonModel(0),
        globalFormatter: GlobalFormatter,
        resourceModel: {},
        onInit: function () {
            const root = this;
            this.bus = Core.getEventBus();
            this.bus.subscribe('appRoot', 'toggleMasterMenu', this.toggleMasterMenu, this);
            this.bus.subscribe('appRoot', 'togglePinMasterMenu', this.togglePinMasterMenu, this);
            this.loadAvailableFeatures();
            this.userModel.setData(currentUser);
            this.getView().setModel(this.md_countNotif, 'md_countNotif');
            this.getView().setModel(this.userModel, 'userModel');

        },
        loadAvailableFeatures: function () {
            const root = this;
            let data = {
                Menus: [
                    {
                        "Icon": "sap-icon://home",
                        "Position": "main",
                        "RequirePermission": true,
                        "Endpoint": "quanlyhang",
                        "Expanded": true,
                        "Index": 1,
                        "Parent": "",
                        "Level": 1,
                        "Key": "QUANLYKHOHANG",
                        "Value": "Quản lý kho hàng"
                    },
                    {
                        "Icon": "sap-icon://chart-axis",
                        "Position": "main",
                        "RequirePermission": true,
                        "Endpoint": "quanlyhang",
                        "Expanded": true,
                        "Index": 1,
                        "Parent": "QUANLYKHOHANG",
                        "Level": 2,
                        "Key": "QUANLYHANG",
                        "Value": "Quản lý hàng"
                    },
                    {
                        "Icon": "sap-icon://add-product",
                        "Position": "main",
                        "RequirePermission": true,
                        "Endpoint": "quanlykho",
                        "Expanded": true,
                        "Index": 1,
                        "Parent": "QUANLYKHOHANG",
                        "Level": 2,
                        "Key": "quanlykho",
                        "Value": "Quản lý kho "
                    },
                    {
                        "Icon": "sap-icon://bbyd-dashboard",
                        "Position": "main",
                        "RequirePermission": true,
                        "Endpoint": "capnhatkhohang",
                        "Expanded": true,
                        "Index": 1,
                        "Parent": "QUANLYKHOHANG",
                        "Level": 2,
                        "Key": "capnhatkhohang",
                        "Value": "Cập nhật kho hàng"
                    },
                    {
                        "Icon": "sap-icon://add-process",
                        "Position": "main",
                        "RequirePermission": true,
                        "Endpoint": "capnhatphieunhap",
                        "Expanded": true,
                        "Index": 1,
                        "Parent": "QUANLYKHOHANG",
                        "Level": 2,
                        "Key": "capnhatphieunhap",
                        "Value": "Cập nhật phiếu nhập"
                    },
                    {
                        "Icon": "sap-icon://add",
                        "Position": "main",
                        "RequirePermission": true,
                        "Endpoint": "capnhatphieugiao",
                        "Expanded": true,
                        "Index": 1,
                        "Parent": "QUANLYKHOHANG",
                        "Level": 2,
                        "Key": "capnhatphieugiao",
                        "Value": "Cập nhật phiếu giao"
                    },
                    {
                        "Icon": "sap-icon://employee",
                        "Position": "main",
                        "RequirePermission": true,
                        "Endpoint": "quanlykhachhang",
                        "Expanded": true,
                        "Index": 1,
                        "Parent": "",
                        "Level": 1,
                        "Key": "QUANLYKHACHHANG",
                        "Value": "Khách hàng & Nhà cung cấp"
                    },
                    {
                        "Icon": "sap-icon://employee-lookup",
                        "Position": "main",
                        "RequirePermission": true,
                        "Endpoint": "quanlykhachhang",
                        "Expanded": true,
                        "Index": 1,
                        "Parent": "QUANLYKHACHHANG",
                        "Level": 2,
                        "Key": "KHACHHANG",
                        "Value": "Khách hàng"
                    },
                    {
                        "Icon": "sap-icon://factory",
                        "Position": "main",
                        "RequirePermission": true,
                        "Endpoint": "quanlyncc",
                        "Expanded": true,
                        "Index": 1,
                        "Parent": "QUANLYKHACHHANG",
                        "Level": 2,
                        "Key": "NCC",
                        "Value": "Nhà cung cấp"
                    },
                    {
                        "Icon": "sap-icon://add-activity",
                        "Position": "main",
                        "RequirePermission": true,
                        "Endpoint": "nhaphang",
                        "Expanded": true,
                        "Index": 1,
                        "Parent": "",
                        "Level": 1,
                        "Key": "NHAPHANG",
                        "Value": "Nhập hàng"
                    },
                    {
                        "Icon": "sap-icon://cart-3",
                        "Position": "main",
                        "RequirePermission": true,
                        "Endpoint": "nhaphang",
                        "Expanded": true,
                        "Index": 1,
                        "Parent": "NHAPHANG",
                        "Level": 1,
                        "Key": "PHIEUNHAP",
                        "Value": "Phiếu nhập"
                    },
                    {
                        "Icon": "sap-icon://batch-payments",
                        "Position": "main",
                        "RequirePermission": true,
                        "Endpoint": "donmua",
                        "Expanded": true,
                        "Index": 1,
                        "Parent": "NHAPHANG",
                        "Level": 1,
                        "Key": "DONMUA",
                        "Value": "Đơn mua"
                    },
                    {
                        "Icon": "sap-icon://batch-payments",
                        "Position": "main",
                        "RequirePermission": true,
                        "Endpoint": "dongmua",
                        "Expanded": true,
                        "Index": 1,
                        "Parent": "NHAPHANG",
                        "Level": 1,
                        "Key": "DONGMUA",
                        "Value": "Dòng mua hàng"
                    },
                    {
                        "Icon": "sap-icon://enter-more",
                        "Position": "main",
                        "RequirePermission": true,
                        "Endpoint": "phieuchi",
                        "Expanded": true,
                        "Index": 1,
                        "Parent": "NHAPHANG",
                        "Level": 1,
                        "Key": "PHIEUCHI",
                        "Value": "Phiếu chi"
                    },
                    {
                        "Icon": "sap-icon://filter-analytics",
                        "Position": "main",
                        "RequirePermission": true,
                        "Endpoint": "khohang",
                        "Expanded": true,
                        "Index": 1,
                        "Parent": "NHAPHANG",
                        "Level": 1,
                        "Key": "TONKHO",
                        "Value": "Quản lý tồn kho"
                    },
                    {
                        "Icon": "sap-icon://shipping-status",
                        "Position": "main",
                        "RequirePermission": true,
                        "Endpoint": "xuathang",
                        "Expanded": true,
                        "Index": 1,
                        "Parent": "",
                        "Level": 1,
                        "Key": "XUATHANG",
                        "Value": "Xuất hàng"
                    },
                    {
                        "Icon": "sap-icon://bbyd-dashboard",
                        "Position": "main",
                        "RequirePermission": true,
                        "Endpoint": "baocao",
                        "Expanded": true,
                        "Index": 1,
                        "Parent": "",
                        "Level": 1,
                        "Key": "BAOCAO",
                        "Value": "Báo cáo"
                    },


                ],
                Features: [
                    "QUANLYKHOHANG"
                ]
            };
            appRuntime.Features = data.Features;
            appRuntime.Menus = data.Menus;
            root.bus.publish('rootBus', 'renderSidebar');
        },
        onCloseNotificationPopover: function (oEvent) {
            this.notificationPopover.close();
        },
        onItemSelect: function (oEvent) {
            var item = oEvent.getParameter('item');
            var routeKey = item.getKey();
            if (routeKey && routeKey !== '') {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo(item.getKey());
            }
        },
        //#endregion
        onSignoutClick: function () {
            var bCompact = !!this.getView().$().closest('.sapUiSizeCompact').length;
            MessageBox.confirm(this.resourceModel.getText('LogoutConfirm'), {
                styleClass: bCompact ? 'sapUiSizeCompact' : '',
                onClose: function (sAction) {
                    if (sAction === sap.m.MessageBox.Action.OK) {
                        authContext.logOut();
                    }
                }
            }
            );
        },
        toggleMasterMenu: function () {
            var splitApp = this.getView().byId('appRoot');
            if (splitApp.isMasterShown())
                splitApp.hideMaster();
            else
                splitApp.showMaster();
        },
        togglePinMasterMenu: function (sChanel, sEvent, oData) {
            var splitApp = this.getView().byId('appRoot');
            if (oData.pined)
                splitApp.setMode('ShowHideMode');
            else
                splitApp.setMode('HideMode');
        },
        onAccountClick: function (oEvent) {
            if (!this.accPopover) {
                this.accPopover = sap.ui.xmlfragment('app.fragments.AccountPopover', this);
                this.getView().addDependent(this.accPopover);
            }
            this.accPopover.openBy(oEvent.getSource());
        }
    });
});