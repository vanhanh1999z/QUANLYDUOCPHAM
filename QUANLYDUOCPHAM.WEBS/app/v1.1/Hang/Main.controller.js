sap.ui.define([
    'sap/ui/core/Core',
    'sap/ui/core/mvc/Controller',
    'sap/ui/core/mvc/XMLView',
    'sap/ui/core/Fragment',
], function(Core, Controller, XMLView, Fragment) {
    'use strict';
    const oController = {
        onInit: function() {
            this.bus = Core.getEventBus();
            this.mainLayout = this.byId('pageLayout');
            this.listPage = 'app.Hang.List';
            let page = new XMLView({
                id: this.listPage,
                viewName: 'app.Hang.List'
            });
            this.mainLayout.addBeginColumnPage(page);
            this.bus.subscribe('HangChanel', 'switchToViewPage', this.switchToViewPage, this);
            this.bus.subscribe('HangChanel', 'switchToAddPage', this.switchToAddPage, this);
            this.bus.subscribe('HangChanel', 'switchToEditPage', this.switchToEditPage, this);
            this.bus.subscribe('HangChanel', 'switchToListPage', this.switchToListPage, this);

            this.bus.subscribe('HangChanel', 'switchToActivityViewPage', this.switchToActivityViewPage, this);
            this.bus.subscribe('HangChanel', 'switchToActivityAddPage', this.switchToActivityAddPage, this);
            this.bus.subscribe('HangChanel', 'switchToActivityEditPage', this.switchToActivityEditPage, this);
            this.bus.subscribe('HangChanel', 'switchToDevHistoryAddPage', this.switchToDevHistoryAddPage, this);
            this.bus.subscribe('HangChanel', 'switchToDevHistoryDetailPage', this.switchToDevHistoryDetailPage, this);
            this.bus.subscribe('HangChanel', 'switchToDevHistoryEditPage', this.switchToDevHistoryEditPage, this);
            this.bus.subscribe('HangChanel', 'switchToMaintenanceViewPage', this.switchToMaintenanceViewPage, this);
            this.bus.subscribe('HangChanel', 'switchToMaintenanceAddPage', this.switchToMaintenanceAddPage, this);
            this.bus.subscribe('HangChanel', 'switchToMaintenanceEditPage', this.switchToMaintenanceEditPage, this);

            this.bus.subscribe('HangChanel', 'closeMidColumn', this.closeMidColumn, this);
            this.bus.subscribe('HangChanel', 'onCloseSoftwareAdd', this.onCloseSoftwareAdd, this);
            this.bus.subscribe('HangChanel', 'onCloseSoftwareDetail', this.onCloseSoftwareDetail, this);
            this.bus.subscribe('HangChanel', 'onCloseSoftwareEdit', this.onCloseSoftwareEdit, this);

            this.bus.subscribe('HangChanel', 'onCloseActivitySoftwareAdd', this.onCloseActivitySoftwareAdd, this);
            this.bus.subscribe('HangChanel', 'onCloseSoftwareActivityDetail', this.onCloseSoftwareActivityDetail, this);
            this.bus.subscribe('HangChanel', 'onCloseActivitySoftwareEdit', this.onCloseActivitySoftwareEdit, this);
            this.bus.subscribe('HangChanel', 'onCloseDevHistorySoftwareEdit', this.onCloseDevHistorySoftwareEdit, this);
            this.bus.subscribe('HangChanel', 'onCloseDevHistorySoftwareAdd', this.onCloseDevHistorySoftwareAdd, this);
            this.bus.subscribe('HangChanel', 'onCloseDevHistorySoftwareDetail', this.onCloseDevHistorySoftwareDetail, this);
            this.bus.subscribe('HangChanel', 'onCloseSoftwareMaintenanceDetail', this.onCloseSoftwareMaintenanceDetail, this);
        },
        onExit: function() {
            this.bus.unsubscribe('HangChanel', 'switchToViewPage', this.switchToViewPage, this);
            this.bus.unsubscribe('HangChanel', 'switchToAddPage', this.switchToAddPage, this);
            this.bus.unsubscribe('HangChanel', 'switchToEditPage', this.switchToEditPage, this);

            this.bus.unsubscribe('HangChanel', 'switchToActivityViewPage', this.switchToActivityViewPage, this);
            this.bus.unsubscribe('HangChanel', 'switchToActivityAddPage', this.switchToActivityAddPage, this);
            this.bus.unsubscribe('HangChanel', 'switchToActivityEditPage', this.switchToActivityEditPage, this);

            this.bus.unsubscribe('HangChanel', 'switchToDevHistoryAddPage', this.switchToDevHistoryAddPage, this);
            this.bus.unsubscribe('HangChanel', 'switchToDevHistoryDetailPage', this.switchToDevHistoryDetailPage, this);
            this.bus.unsubscribe('HangChanel', 'switchToDevHistoryEditPage', this.switchToDevHistoryEditPage, this);

            this.bus.unsubscribe('HangChanel', 'switchToMaintenanceViewPage', this.switchToMaintenanceViewPage, this);
            this.bus.unsubscribe('HangChanel', 'switchToMaintenanceAddPage', this.switchToMaintenanceAddPage, this);
            this.bus.unsubscribe('HangChanel', 'switchToMaintenanceEditPage', this.switchToMaintenanceEditPage, this);

            this.bus.unsubscribe('HangChanel', 'closeMidColumn', this.closeMidColumn, this);
            this.bus.unsubscribe('HangChanel', 'onCloseSoftwareAdd', this.onCloseSoftwareAdd, this);
            this.bus.unsubscribe('HangChanel', 'onCloseSoftwareDetail', this.onCloseSoftwareDetail, this);
            this.bus.unsubscribe('HangChanel', 'onCloseSoftwareEdit', this.onCloseSoftwareEdit, this);

            this.bus.unsubscribe('HangChanel', 'onCloseActivitySoftwareAdd', this.onCloseActivitySoftwareAdd, this);
            this.bus.unsubscribe('HangChanel', 'onCloseSoftwareActivityDetail', this.onCloseSoftwareActivityDetail, this);
            this.bus.unsubscribe('HangChanel', 'onCloseActivitySoftwareEdit', this.onCloseActivitySoftwareEdit, this);

            this.bus.unsubscribe('HangChanel', 'onCloseDevHistorySoftwareEdit', this.onCloseDevHistorySoftwareEdit, this);
            this.bus.unsubscribe('HangChanel', 'onCloseDevHistorySoftwareAdd', this.onCloseDevHistorySoftwareAdd, this);
            this.bus.unsubscribe('HangChanel', 'onCloseDevHistorySoftwareDetail', this.onCloseDevHistorySoftwareDetail, this);

            this.bus.unsubscribe('HangChanel', 'onCloseSoftwareMaintenanceDetail', this.onCloseSoftwareMaintenanceDetail, this);
        },
        switchToAddPage: function() {
            //if (!this.addPage) {
            //  this.addPage = 'app.Software.Add';
            //  var page = new XMLView({
            //    id: this.addPage,
            //    viewName: 'app.Software.Add'
            //  });
            //  this.mainLayout.addBeginColumnPage(page);
            //}
            //this.mainLayout.toBeginColumnPage(this.addPage);
            const root = this;

            if (!this._softwareAdd) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.Hang.Add",
                    type: "XML",
                    controller: this
                }).then(function(frag) {
                    root._softwareAdd = frag;
                    root._softwareAdd.open();
                });
            } else {
                root._softwareAdd.open();
            }
        },
        onCloseSoftwareAdd: function() {
            this._softwareAdd.close();
        },
        switchToViewPage: function(sChanel, sEvent, oData) {
            const root = this;
            if (!this._softwareDetail) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.Hang.Detail",
                    type: "XML",
                    controller: this
                }).then(function(frag) {
                    root._softwareDetail = frag;
                    root._softwareDetail.open();
                    root.bus.publish('SoftwareChannel', 'loadDetailPage', {
                        Id: oData.Id
                    });

                });
            } else {
                root._softwareDetail.open();
                root.bus.publish('SoftwareChannel', 'loadDetailPage', {
                    Id: oData.Id
                });
            }
        },

        onCloseSoftwareDetail: function() {
            this._softwareDetail.close();
        },

        switchToEditPage: function(sChanel, sEvent, oData) {
            //if (!this.editPage) {
            //    this.editPage = 'app.Software.Edit';
            //    var page = new XMLView({
            //        id: this.editPage,
            //        viewName: 'app.Software.Edit'
            //    });
            //    this.mainLayout.addMidColumnPage(page);
            //}
            //this.mainLayout.toMidColumnPage(this.editPage);
            //this.showMidColumn();
            //this.bus.publish('SoftwareChannel', 'loadEditPage', { Id: oData.Id });
            const root = this;
            if (!this._softwareEdit) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.Software.Edit",
                    type: "XML",
                    controller: this
                }).then(function(frag) {
                    root._softwareEdit = frag;
                    root._softwareEdit.open();
                    root.bus.publish('SoftwareChannel', 'loadEditPage', {
                        Id: oData.Id
                    });

                });
            } else {
                root._softwareEdit.open();
                root.bus.publish('SoftwareChannel', 'loadEditPage', {
                    Id: oData.Id
                });
            }
        },
        onCloseSoftwareEdit: function() {
            this._softwareEdit.close();
        },

        switchToActivityAddPage: function(sChanel, sEvent, oData) {
            //if (!this.addActivityPage) {
            //    this.addActivityPage = 'app.Software.Activity.Add';
            //    var page = new XMLView({
            //        id: this.addActivityPage,
            //        viewName: 'app.Software.Activity.Add'
            //    });
            //    this.mainLayout.addMidColumnPage(page);
            //}
            //this.mainLayout.toMidColumnPage(this.addActivityPage);
            //this.bus.publish('SoftwareChannel', 'loadAddActivityPage', oData);
            //this.showMidColumn();
            const root = this;
            if (!this._activitySoftwareAdd) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.Software.Activity.Add",
                    type: "XML",
                    controller: this
                }).then(function(frag) {
                    root._activitySoftwareAdd = frag;
                    root._activitySoftwareAdd.open();
                    root.bus.publish('SoftwareChannel', 'loadAddActivityPage', oData);
                });
            } else {
                root._activitySoftwareAdd.open();
                root.bus.publish('SoftwareChannel', 'loadAddActivityPage', oData);
            }
        },
        onCloseActivitySoftwareAdd: function() {
            this._activitySoftwareAdd.close();
        },

        switchToActivityViewPage: function(sChanel, sEvent, oData) {
            //if (!this.viewActivityPage) {
            //    this.viewActivityPage = 'app.Software.Activity.Detail';
            //    var page = new XMLView({
            //        id: this.viewActivityPage,
            //        viewName: 'app.Software.Activity.Detail'
            //    });
            //    this.mainLayout.addMidColumnPage(page);
            //}
            //this.mainLayout.toMidColumnPage(this.viewActivityPage);
            //this.bus.publish('SoftwareChannel', 'loadDetailActivityPage', oData);
            //this.showMidColumn();
            const root = this;
            if (!this._activitySoftwareDetail) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.Software.Activity.Detail",
                    type: "XML",
                    controller: this
                }).then(function(frag) {
                    root._activitySoftwareDetail = frag;
                    root._activitySoftwareDetail.open();
                    root.bus.publish('SoftwareChannel', 'loadDetailActivityPage', oData);
                });
            } else {
                root._activitySoftwareDetail.open();
                root.bus.publish('SoftwareChannel', 'loadDetailActivityPage', oData);
            }
        },
        onCloseSoftwareActivityDetail: function() {
            this._activitySoftwareDetail.close();
        },
        switchToActivityEditPage: function(sChanel, sEvent, oData) {
            const root = this;
            if (!this._activitySoftwareEdit) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.Software.Activity.Edit",
                    type: "XML",
                    controller: this
                }).then(function(frag) {
                    root._activitySoftwareEdit = frag;
                    root._activitySoftwareEdit.open();
                    root.bus.publish('SoftwareChannel', 'loadEditActivityPage', oData);
                });
            } else {
                root._activitySoftwareEdit.open();
                root.bus.publish('SoftwareChannel', 'loadEditActivityPage', oData);
            }
        },
        onCloseActivitySoftwareEdit: function() {
            this._activitySoftwareEdit.close();
        },

        switchToMaintenanceAddPage: function(sChanel, sEvent, oData) {
            if (!this.addMaintenancePage) {
                this.addMaintenancePage = 'app.Software.Maintenance.Add';
                var page = new XMLView({
                    id: this.addMaintenancePage,
                    viewName: 'app.Software.Maintenance.Add'
                });
                this.mainLayout.addMidColumnPage(page);
            }
            this.mainLayout.toMidColumnPage(this.addMaintenancePage);
            this.bus.publish('SoftwareChannel', 'loadAddMaintenancePage', oData);
            this.showMidColumn();
        },
        switchToMaintenanceViewPage: function(sChanel, sEvent, oData) {
            //if (!this.viewMaintenancePage) {
            //    this.viewMaintenancePage = 'app.Software.Maintenance.Detail';
            //    var page = new XMLView({
            //        id: this.viewMaintenancePage,
            //        viewName: 'app.Software.Maintenance.Detail'
            //    });
            //    this.mainLayout.addMidColumnPage(page);
            //}
            //this.mainLayout.toMidColumnPage(this.viewMaintenancePage);
            //this.bus.publish('SoftwareChannel', 'loadDetailMaintenancePage', oData);
            //this.showMidColumn();
            const root = this;
            if (!this._maintenanceSoftwareDetail) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.Software.Maintenance.Detail",
                    type: "XML",
                    controller: this
                }).then(function(frag) {
                    root._maintenanceSoftwareDetail = frag;
                    root._maintenanceSoftwareDetail.open();
                    root.bus.publish('SoftwareChannel', 'loadDetailMaintenancePage', oData);
                });
            } else {
                root._maintenanceSoftwareDetail.open();
                root.bus.publish('SoftwareChannel', 'loadDetailMaintenancePage', oData);
            }
        },
        onCloseSoftwareMaintenanceDetail: function() {
            this._maintenanceSoftwareDetail.close();
        },
        switchToMaintenanceEditPage: function(sChanel, sEvent, oData) {
            if (!this.editMaintenancePage) {
                this.editMaintenancePage = 'app.Software.Maintenance.Edit';
                var page = new XMLView({
                    id: this.editMaintenancePage,
                    viewName: 'app.Software.Maintenance.Edit'
                });
                this.mainLayout.addMidColumnPage(page);
            }
            this.mainLayout.toMidColumnPage(this.editMaintenancePage);
            this.showMidColumn();
            this.bus.publish('SoftwareChannel', 'loadEditMaintenancePage', oData);
        },

        //#region lịch sử phát triển
        switchToDevHistoryDetailPage: function(sChanel, sEvent, oData) {
            const root = this;
            if (!this._devHistorySoftwareDetail) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.Software.DevHistory.Detail",
                    type: "XML",
                    controller: this
                }).then(function(frag) {
                    root._devHistorySoftwareDetail = frag;
                    root._devHistorySoftwareDetail.open();
                    root.bus.publish('SoftwareChannel', 'loadDetailDevHistoryPage', oData);
                });
            } else {
                root._devHistorySoftwareDetail.open();
                root.bus.publish('SoftwareChannel', 'loadDetailDevHistoryPage', oData);
            }
        },
        onCloseDevHistorySoftwareDetail: function() {
            this._devHistorySoftwareDetail.close();
        },
        switchToDevHistoryAddPage: function(sChanel, sEvent, oData) {
            const root = this;
            if (!this._devHistorySoftwareAdd) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.Software.DevHistory.Add",
                    type: "XML",
                    controller: this
                }).then(function(frag) {
                    root._devHistorySoftwareAdd = frag;
                    root._devHistorySoftwareAdd.open();
                    root.bus.publish('SoftwareChannel', 'loadAddlDevHistoryPage', oData);
                });
            } else {
                root._devHistorySoftwareAdd.open();
                root.bus.publish('SoftwareChannel', 'loadAddlDevHistoryPage', oData);
            }
        },
        onCloseDevHistorySoftwareAdd: function() {
            this._devHistorySoftwareAdd.close();
        },
        switchToDevHistoryEditPage: function(sChanel, sEvent, oData) {
            const root = this;
            if (!this._devHistorySoftwareEdit) {
                Fragment.load({
                    id: root.getView().getId(),
                    name: "app.Software.DevHistory.Edit",
                    type: "XML",
                    controller: this
                }).then(function(frag) {
                    root._devHistorySoftwareEdit = frag;
                    root._devHistorySoftwareEdit.open();
                    root.bus.publish('SoftwareChannel', 'loadEditDevHistoryPage', oData);
                });
            } else {
                root._devHistorySoftwareEdit.open();
                root.bus.publish('SoftwareChannel', 'loadEditDevHistoryPage', oData);
            }
        },
        onCloseDevHistorySoftwareEdit: function() {
            this._devHistorySoftwareEdit.close();
        },
        //#endregion


        showMidColumn: function() {
            var layout = this.mainLayout.getLayout();
            if (layout === 'OneColumn')
                this.mainLayout.setLayout('TwoColumnsBeginExpanded');
            else if (layout === 'EndColumnFullScreen' || layout === 'ThreeColumnsEndExpanded' || layout === 'ThreeColumnsMidExpanded')
                this.mainLayout.setLayout('TwoColumnsMidExpanded');
        },
        closeMidColumn: function() {
            this.mainLayout.setLayout('OneColumn');
        },
        switchToListPage: function() {
            this.mainLayout.setLayout('OneColumn');
            this.mainLayout.toBeginColumnPage(this.listPage);
        },
    };
    return Controller.extend('app.Hang.Main', oController);
});