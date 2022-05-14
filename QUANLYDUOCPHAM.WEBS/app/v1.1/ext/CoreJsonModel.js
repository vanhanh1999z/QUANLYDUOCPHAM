sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "app/ext/Auth.Connector.Adal",
    "app/ext/SavListBinding",
    'sap/m/MessageBox'
], function (JSONModel, AdalConnector, SavListBinding, MessageBox) {
    "use strict";
    return JSONModel.extend("HMI.Core.JSONModel", {
        getAll: function (sURL) {
            let that = this;
            let oData = jQuery.ajax({
                type: "GET",
                contentType: "application/json",
                url: sURL,
                dataType: "json",
                async: false,
            })
            return oData
        },
        getById: function (sURL,id) {
            let that = this;
            let oData = jQuery.ajax({
                type: "GET",
                contentType: "application/json",
                url: sURL+'/'+id,
                dataType: "json",
                async: false,
            })
            return oData
        },
        postToAPI: function (sURL,data) {
            let oData = jQuery.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: sURL,
                data: JSON.stringify(data),
                dataType: "json",
                async: false,
            })
            return oData
        },
        deleteById: function (sURL) {
            let oData = jQuery.ajax({
                type: "DELETE",
                contentType: "application/json; charset=utf-8",
                url: sURL,
                dataType: "json",
                async: false,
            })
            return oData
        }
    });

});