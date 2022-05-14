sap.ui.define(
    [
        "sap/ui/core/ComponentContainer",
        "app/ext/Auth.Connector.Adal",
        "sap/ui/core/Busyindicator",
    ],
    function(ComponentContainer, Connector, Busyindicator) {
        "use strict";
        Busyindicator.show();
        new ComponentContainer({
            name: "app",
            settings: {
                id: "app.init",
            },
            async: true,
        }).placeAt("hmibodyContent");
        Busyindicator.hide();
        let data = {

        };
        appRuntime.Features = data.Features;
        appRuntime.Menus = data.Menus;

    }
);