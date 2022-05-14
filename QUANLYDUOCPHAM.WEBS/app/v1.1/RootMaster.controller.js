sap.ui.define([
    'sap/ui/core/Core',
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
], function (Core, Controller, JSONModel, Filter, FilterOperator) {
    'use strict';
    return Controller.extend('app.Root', {
        sideBarModel: new JSONModel(),
        onInit: function () {
            this.bus = Core.getEventBus();
            this.bus.subscribe('rootBus', 'renderSidebar', this.renderSidebar, this);
            this.getView().setModel(this.sideBarModel, 'sideBarModel');
        },
        renderSidebar: function () {
            this.sideBarModel.setData({
                main: this.buildHierarchySideBarItems(appRuntime.Menus, 'main'),
                fixed: this.buildFlatSideBarItems(appRuntime.Menus, 'fixed')
            });
        },
        buildHierarchySideBarItems: function (flat, position) {
            if (flat && flat !== null) {
                var map = {};
                for (var i = 0; i < flat.length; i++) {
                    var obj = flat[i];
                    if (obj['Position'] === position) {
                        obj.items = [];
                        map[obj.Key] = obj;
                        var parent = obj.Parent || '';
                        if (!map[parent]) {
                            map[parent] = {
                                items: []
                            };
                        }
                        map[parent].items.push(obj);
                    }
                }
                return map[''].items;
            }
            return null;
        },
        buildFlatSideBarItems: function (flat, position) {
            if (flat && flat !== null) {
                var items = [];
                for (var i = 0; i < flat.length; i++) {
                    var obj = flat[i];
                    if (obj['Position'] === position) {
                        items.push(obj);
                    }
                }
                return items;
            }
            return null;
        },
        onItemSelect: function (oControlEvent) {
            var oItem = oControlEvent.getParameters().listItem;
            var oContext = oItem.getBindingContext('sideBarModel');
            appRuntime.selectedFeature = oContext.getObject();
            let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            if (appRuntime.selectedFeature.Endpoint) {
                oRouter.navTo(appRuntime.selectedFeature.Endpoint);
            }
            if (appRuntime.selectedFeature.Parent === '' && appRuntime.selectedFeature.Level == 1 || appRuntime.selectedFeature.Endpoint == 'ManageDevice' || appRuntime.selectedFeature.Endpoint == 'ManageDigitalSignature') {
                const id = oControlEvent.getParameter('listItem').sId;
                const index = id.lastIndexOf('-');
                const indexItem = parseInt(id.slice(index + 1, id.length));
                this.getView().byId('sidebarItem').expand(indexItem);
            }
            this.bus.publish('appRoot', 'toggleMasterMenu');
        },
        onSearchTyping: function (oEvent) {
            let aFilter = [];
            let sQuery = oEvent.getParameters().newValue;

            if (sQuery && sQuery.length > 0) {
                aFilter.push(new Filter('Value', FilterOperator.Contains, sQuery));
                this.getView().byId('sidebarItem').expandToLevel(3);
            }
            let oList = this.byId('sidebarItem');
            let oBinding = oList.getBinding('items');
            oBinding.filter(aFilter);
        },
        onFixedButtonPress: function (oEvent) {
            appRuntime.selectedFeature = oEvent.getSource().getBindingContext('sideBarModel').getObject();
            let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            if (appRuntime.selectedFeature.Endpoint) {
                oRouter.navTo(appRuntime.selectedFeature.Endpoint);
            }
        },
        onTogglePinMenu: function (oControlEvent) {
            var pressed = oControlEvent.getParameter('pressed');
            this.bus.publish('appRoot', 'togglePinMasterMenu', { pined: pressed });
        }
    });
}
);