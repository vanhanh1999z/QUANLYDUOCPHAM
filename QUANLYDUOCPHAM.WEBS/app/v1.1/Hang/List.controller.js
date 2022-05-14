sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/m/MessageToast",
        "app/ext/CoreJsonModel",
        "app/globalformatter",
        "sap/ui/export/Spreadsheet",
        "sap/ui/core/Fragment",
        "sap/ui/export/library",
    ],
    function(
        Controller,
        MessageToast,
        CoreJsonModel,
        GlobalFormatter,
        Spreadsheet,
        Fragment,
        exportLibrary
    ) {
        "use strict";
        var EdmType = exportLibrary.EdmType;
        const NUMBER_PAGING = 5;
        const oController = {
            globalFormatter: GlobalFormatter,
            orgPaging: [],
            objPaging: [],
            mainModel: new CoreJsonModel(),
            panigation: {
                page: 1,
                pageSize: 20,
            },
            pagingModel: new CoreJsonModel(),
            count: 0,
            onInit: function() {
                this.router = sap.ui.core.UIComponent.getRouterFor(this);
                this.bus = sap.ui.getCore().getEventBus();
                this.getView().setModel(this.mainModel, "mainModel");
                this.getView().setModel(this.pagingModel, "pagingModel");
                this.bus.subscribe(
                    "HangChanel",
                    "closeHangAdd",
                    this.closeHangAdd,
                    this
                );
                this.bus.subscribe("HangChanel", "closeEdit", this.closeEdit, this);
                this.bus.subscribe(
                    "HangChanel",
                    "switchToEditPage",
                    this.switchToEditPage,
                    this
                );
                this.loadDataInit();
                this.createBtnPaging();
            },
            onExit: function() {
                this.bus.unsubscribe(
                    "HangChanel",
                    "closeHangAdd",
                    this.closeHangAdd,
                    this
                );
                this.bus.unsubscribe("HangChanel", "closeEdit", this.closeEdit, this);
                this.bus.unsubscribe(
                    "HangChanel",
                    "switchToEditPage",
                    this.switchToEditPage,
                    this
                );
            },
            loadDataInit: async function(pani = this.panigation) {
                let root = this;
                await this.mainModel
                    .postToAPI(sdConfig.adminApiEndpoint + "hang/getall", pani)
                    .success((dt) => {
                        if (dt.data) {
                            for (var i = 0; i < dt.data.length; i++) {
                                dt.data[i]["STT"] = i + 1;
                            }
                            root.mainModel.setData(dt.data);
                            root.count = dt.totalCount;
                        } else return [];
                    });
            },
            //PAGING
            createBtnPaging: function() {
                this.byId("page").setShowFooter(true);
                let dt = this.count,
                    numberPaging = Math.ceil(dt / this.panigation.pageSize);
                if (numberPaging > 1) {
                    for (let i = 0; i < numberPaging; i++) {
                        this.orgPaging.push({
                            key: i + 1,
                            text: i + 1,
                        });
                    }
                    for (let i = 0; i < NUMBER_PAGING; i++) {
                        this.objPaging.push({
                            ...this.orgPaging[i],
                        });
                    }
                    this.pushPaging(this.objPaging);
                    this.unshiftPaging(this.objPaging);
                    this.pagingModel.setData(this.objPaging);
                } else {
                    this.byId("page").setShowFooter(false);
                }
            },
            onPressReload: function(oEvent) {
                // -1 = prePage, -2 = nextPage
                let dt = this.count,
                    numberPaging = Math.ceil(dt / this.panigation.pageSize),
                    pageIndex = oEvent.getSource().getSelectedKey();
                console.log();

                /** @param first NAVTO FIRST PAGING */
                /** @param numberPaging navTo LAST PAGING */
                /**
                 *! numberPaging = data.length  / pageSize
                 *? key = -1 -> next page
                 *! key = -2 -> pre page
                 */
                if (String(pageIndex).trim() === "first") {
                    console.log("firstPage");
                    this.bindCenterPaging(oEvent, 1);
                    pageIndex = 1;
                }
                if (Number(pageIndex) === numberPaging) {
                    console.log("lastPage");
                    this.bindCenterPaging(oEvent, String(numberPaging));
                    pageIndex = numberPaging;
                }
                if (String(pageIndex) === "-1") {
                    this.panigation.page = this.panigation.page - 1;
                    if (Number(this.panigation.page) >= Math.round(NUMBER_PAGING / 2)) {
                        this.bindCenterPaging(oEvent, this.panigation.page);
                    } else {
                        oEvent.getSource().setSelectedKey(String(this.panigation.page));
                    }
                    this.loadDataInit(this.panigation);
                    return;
                }
                if (String(pageIndex) === "transPagePre") {
                    let temp = [];
                    for (let i = 1; i <= NUMBER_PAGING; i++) {
                        temp.push(
                            this.orgPaging[
                                this.centerIndex +
                                i -
                                Math.floor(NUMBER_PAGING / 2) -
                                NUMBER_PAGING
                            ]
                        );
                    }
                    this.centerIndex = temp[Math.floor(NUMBER_PAGING / 2)].key;
                    this.pushPaging(temp);
                    this.unshiftPaging(temp);
                    this.pagingModel.setData(temp);
                    oEvent.getSource().setSelectedKey(String(this.centerIndex));
                    return;
                } else if (String(pageIndex) === "transPageNext") {
                    let temp = [];
                    console.log(this.centerIndex);
                    if (!this.centerIndex) {
                        this.centerIndex = Math.ceil(NUMBER_PAGING / 2);
                    }
                    for (let i = 0; i < NUMBER_PAGING; i++) {
                        temp.push(
                            this.orgPaging[
                                this.centerIndex + i + Math.floor(NUMBER_PAGING / 2)
                            ]
                        );
                    }
                    this.centerIndex = temp[Math.floor(NUMBER_PAGING / 2)].key;
                    this.pushPaging(temp);
                    this.unshiftPaging(temp);
                    this.pagingModel.setData(temp);
                    oEvent.getSource().setSelectedKey(String(this.centerIndex));
                    return;
                }
                if (String(pageIndex) === "-2") {
                    this.panigation.page = Number(this.panigation.page) + 1;
                    if (Number(this.panigation.page) >= Math.round(NUMBER_PAGING / 2)) {
                        this.bindCenterPaging(oEvent, this.panigation.page);
                    } else {
                        oEvent.getSource().setSelectedKey(String(this.panigation.page));
                    }
                    this.loadDataInit(this.panigation);
                    return;
                }
                if (Number(pageIndex) >= Math.round(NUMBER_PAGING / 2)) {
                    this.bindCenterPaging(oEvent, pageIndex);
                }
                this.panigation.page = pageIndex;
                this.loadDataInit(this.panigation);
            },
            bindCenterPaging: function(oEvent, pageIndex) {
                let dt = this.count,
                    numberPaging = Math.ceil(dt / this.panigation.pageSize),
                    tempObj = [];
                this.centerIndex = Number(pageIndex);
                tempObj.push({
                    ...this.orgPaging[this.centerIndex - 1],
                });
                if (pageIndex > numberPaging || pageIndex < 1) return;
                else if (
                    pageIndex >= Math.floor(NUMBER_PAGING / 2) /* 5/2 = 2  */ &&
                    pageIndex < numberPaging - Math.round(NUMBER_PAGING / 2)
                ) {
                    for (
                        let i = 1; i < Math.round(NUMBER_PAGING / 2) /* 5/2 = 3  */ ; i++
                    ) {
                        tempObj.unshift({
                            ...this.orgPaging[this.centerIndex - i - 1],
                        });
                        tempObj.push({
                            ...this.orgPaging[this.centerIndex + i - 1],
                        });
                    }
                } else if (pageIndex >= numberPaging - Math.round(NUMBER_PAGING / 2)) {
                    tempObj = [];
                    for (let i = 0; i < Math.round(NUMBER_PAGING); i++) {
                        tempObj.unshift({
                            ...this.orgPaging[numberPaging - i - 1],
                        });
                        console.log(this.orgPaging[numberPaging - i - 1]);
                    }
                } else {
                    for (let i = 1; i < Math.round(NUMBER_PAGING); i++) {
                        tempObj.push({
                            ...this.orgPaging[this.centerIndex + i - 1],
                        });
                    }
                }
                this.pushPaging(tempObj);
                this.unshiftPaging(tempObj);
                this.pagingModel.setData(tempObj);
                oEvent.getSource().setSelectedKey(String(this.centerIndex));
            },
            pushPaging: function(obj) {
                let dt = this.count,
                    numberPaging = Math.ceil(dt / this.panigation.pageSize);
                obj.push({
                        icon: "sap-icon://navigation-right-arrow",
                        key: "-2",
                        text: "",
                    },
                    // {
                    //     icon: "sap-icon://slim-arrow-right",
                    //     key: "transPageNext",
                    //     text: "",
                    //     tooltip: "Trang trước",
                    // },
                    {
                        icon: "sap-icon://open-command-field",
                        key: numberPaging,
                        text: "",
                        tooltip: "Trang cuối",
                    });
            },
            unshiftPaging: function(obj) {
                obj.unshift({
                        icon: "sap-icon://close-command-field",
                        key: "first",
                        text: "",
                        tooltip: "Trang đầu",
                    },
                    // {
                    //     icon: "sap-icon://slim-arrow-left",
                    //     key: "transPagePre",
                    //     text: "",
                    // }                ,
                    {
                        icon: "sap-icon://navigation-left-arrow",
                        key: "-1",
                        text: "",
                        tooltip: "Trang trước",
                    });
            },
            onAddButtonPress: function() {
                const root = this;
                if (!this._addHang) {
                    Fragment.load({
                        id: root.getView().getId(),
                        name: "app.Hang.Add",
                        type: "XML",
                        controller: this,
                    }).then(function(frag) {
                        root._addHang = frag;
                        root._addHang.open();
                    });
                } else {
                    root._addHang.open();
                }
            },

            //PAGING
            closeHangAdd: function() {
                this._addHang.close();
                this.loadDataInit();
            },
            loadEditPage: function(id) {
                let root = this;
                if (!this._editHang) {
                    Fragment.load({
                        id: root.getView().getId(),
                        name: "app.Hang.Edit",
                        type: "XML",
                        controller: this,
                    }).then(function(frag) {
                        root._editHang = frag;
                        root._editHang.open();
                        root.bus.publish("HangChanel", "loadEditPage", {
                            Id: id,
                        }); //null
                    });
                } else {
                    root._editHang.open();
                    this.bus.publish("HangChanel", "loadEditPage", {
                        Id: id,
                    }); //null
                }
                if (this._hangDetail) {
                    this._hangDetail.close();
                }
            },
            onRowEdit: function(oEvent) {
                let selectedId = this.getView()
                    .getModel("mainModel")
                    .getProperty(
                        "id",
                        oEvent.getParameter("row").getBindingContext("mainModel")
                    );
                this.loadEditPage(selectedId);
            },
            switchToEditPage: function(oChanel, oEvent, oData) {
                this.loadEditPage(oData.Id);
            },
            closeEdit: function() {
                this._editHang.close();
                this.loadDataInit();
            },
            onRowDelete: function(oEvent) {
                let root = this;
                let selectedId = this.getView()
                    .getModel("mainModel")
                    .getProperty(
                        "id",
                        oEvent.getParameter("row").getBindingContext("mainModel")
                    );
                new CoreJsonModel()
                    .deleteById(sdConfig.adminApiEndpoint + "hang/" + selectedId)
                    .success((dt) => {
                        MessageToast.show(dt.message);
                        root.loadDataInit();
                    });
            },
            onCellClick: function(oEvent) {
                let selected = this.getView()
                    .getModel("mainModel")
                    .getProperty("", oEvent.getParameter("rowBindingContext"));
                if (selected) {
                    const root = this;
                    if (!this._hangDetail) {
                        Fragment.load({
                            id: root.getView().getId(),
                            name: "app.Hang.Detail",
                            type: "XML",
                            controller: this,
                        }).then(function(frag) {
                            root._hangDetail = frag;
                            root._hangDetail.open();
                            root.bus.publish("HangChanel", "loadDetailPage", {
                                Id: selected.id,
                            });
                        });
                    } else {
                        root._hangDetail.open();
                        root.bus.publish("HangChanel", "loadDetailPage", {
                            Id: selected.id,
                        });
                    }
                }
            },
            onCloseHangDetail: function() {
                this._hangDetail.close();
                this.loadDataInit();
            },
            //#endregion
            //#endregion
            sortAscending: function(oEvent) {
                const col = oEvent.getSource().getParent().getParent();
                col.setSorted(true);
                col.setSortOrder("Ascending");
                const colName = col.getSortProperty();
                for (let i = 0; i < this.selector.Orders.length; i++) {
                    if (this.selector.Orders[i].Name == colName) {
                        this.selector.Orders[i].Type = OrderType.Ascending;
                        this.reloadData();
                        MessageToast.show("Áp dụng thành công!", {
                            width: "30em",
                            duration: 5000,
                        });
                        return;
                    }
                }
                this.selector.Orders.push({
                    Name: colName,
                    Type: OrderType.Ascending,
                });
                this.reloadData();
                MessageToast.show("Áp dụng thành công!", {
                    width: "30em",
                    duration: 5000,
                });
            },
            sortDescending: function(oEvent) {
                const col = oEvent.getSource().getParent().getParent();
                col.setSorted(true);
                col.setSortOrder("Descending");
                const colName = col.getSortProperty();
                for (let i = 0; i < this.selector.Orders.length; i++) {
                    if (this.selector.Orders[i].Name == colName) {
                        this.selector.Orders[i].Type = OrderType.Descending;
                        this.reloadData();
                        MessageToast.show("Áp dụng thành công!", {
                            width: "30em",
                            duration: 5000,
                        });
                        return;
                    }
                }
                this.selector.Orders.push({
                    Name: colName,
                    Type: OrderType.Descending,
                });
                this.reloadData();
                MessageToast.show("Áp dụng thành công!", {
                    width: "30em",
                    duration: 5000,
                });
            },
            createColumnConfig: function() {
                var aCols = [];
                aCols.push({
                    label: "ID",
                    type: EdmType.Number,
                    property: "STT",
                    scale: 0,
                });

                aCols.push({
                    label: "Tên hàng hóa",
                    property: "tenhang",
                    type: EdmType.String,
                });

                aCols.push({
                    label: "Mô tả",
                    property: "mota",
                    type: EdmType.String,
                });

                aCols.push({
                    label: "Đơn vị",
                    property: "donvi",
                    type: EdmType.String,
                });

                return aCols;
            },
            exportExcel: function() {
                var aCols, oRowBinding, oSettings, oSheet, oTable;
                if (!this._oTable) {
                    this._oTable = this.byId("mainTable");
                }

                oTable = this._oTable;
                oRowBinding = oTable.getBinding("rows");
                console.log(oRowBinding);
                aCols = this.createColumnConfig();

                oSettings = {
                    fileName: "HangHoa.xlsx",
                    workbook: {
                        columns: aCols,
                        hierarchyLevel: "Level",
                        context: {
                            sheetName: "Danh sách",
                            title: "Danh sách hàng hóa",
                            application: "Phần mềm quản lý kho dược phẩm",
                            modifiedBy: "Lưu Văn Hạnh",
                        },
                    },
                    dataSource: oRowBinding,
                };

                oSheet = new Spreadsheet(oSettings);
                oSheet.build().finally(function() {
                    oSheet.destroy();
                });
            },
        };
        return Controller.extend("app.Hang.List", oController);
    }
);