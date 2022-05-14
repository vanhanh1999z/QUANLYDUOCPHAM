sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
], function(Controller, JSONModel) {
    "use strict";
    return Controller.extend("app.Base.Controller", {
        resetDataFromGroup: function(nameGroup) {
            var grControl = sap.ui.getCore().byFieldGroupId(nameGroup);
            let obj = {};
            grControl.forEach((item, index) => {
                let oControl = sap.ui.getCore().byId(item.getId());
                let name = oControl.mProperties.name;
                let sType = oControl.getMetadata().getName();
                // let value = '';
                switch (sType) {
                    case 'sap.m.Select':
                        oControl.setSelectedKey('-1');
                        break;
                    case 'sap.m.Input':
                        oControl.setValue('')
                        break;
                    case 'sap.m.DatePicker':
                        let value = moment().format('yyyy-MM-DD');
                        oControl.setValue(value)
                        break;
                    default:
                        break;
                }
            });
        },
        getDataFromGroup: function(nameGroup) {
            var grControl = sap.ui.getCore().byFieldGroupId(nameGroup);
            let obj = {};
            grControl.forEach((item, index) => {
                let oControl = sap.ui.getCore().byId(item.getId());
                let name = oControl.mProperties.name;
                let sType = oControl.getMetadata().getName();
                console.log(sType);
                let value = '';
                switch (sType) {
                    case 'sap.m.Select':
                        value = oControl.getSelectedKey();
                        obj[name] = value;
                        break;
                    case 'sap.m.Input':
                        this.checkValueInput(oControl);
                        value = oControl.getValue();
                        obj[name] = value;
                        break;
                    case 'sap.m.DatePicker':
                        value = moment(oControl.getDateValue()).format('yyyy-MM-DD');
                        obj[name] = value;
                        break;
                    default:
                        break;
                }

            });
            return obj;
        },

        checkValueRequired: function(oControl, textError) {
            if (oControl && oControl.getRequired()) {
                let value = oControl.getValue();
                if (!value || !value.length) {
                    if (typeof oControl.setValueState === 'function')
                        oControl.setValueState('Error');
                    if (typeof oControl.setValueStateText === 'function')
                        oControl.setValueStateText(textError);
                } else {
                    if (typeof oControl.setValueState === 'function')
                        oControl.setValueState('None');
                    if (typeof oControl.setValueStateText === 'function')
                        oControl.setValueStateText('');
                }
            }
        },
        checkValueInput: function(oControl) {
            this.checkValueRequired(oControl, 'Không được để trống');
        },
        checkValueSelect: function(element) {
            this.checkValue(element, 'Phải chọn ...');
        },

    });


});