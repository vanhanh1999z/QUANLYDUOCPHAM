sap.ui.define([], function() {
    "use strict";
    return {
        trangThaiNhan: function(oValue) {
            if (oValue == true) {
                return "Đã nhận"
            } else return "Chưa nhận"
        },
        trangThaiNhanState: function(oValue) {
            if (oValue == true) {
                return 'Success'
            } else return 'Error'
        },
        telephoneNumber: function(phoneNumberString) {
            var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
            var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
            if (match) {
                return '(' + match[1] + ') ' + match[2] + '-' + match[3];
            }
            return null;
        },
        telephoneNumberState: function(oValue) {
            return 'Success'
        }
    };
});