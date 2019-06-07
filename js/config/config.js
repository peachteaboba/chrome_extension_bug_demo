// ::::: Change this when updating which server to use :::::
const is_prod = false;

let rettro_config = {};
rettro_config.website_url = "";
rettro_config.server_url = "";
(function () {
    if (is_prod) {
        rettro_config.server_url = "https://rettro.app";
        rettro_config.website_url = "https://rettro.app";
    } else {
        // rettro_config.server_url = "http://localhost:3001";
        // rettro_config.website_url = "http://localhost:3000";
        rettro_config.server_url = "http://192.168.1.176:3001";
        rettro_config.website_url = "http://192.168.1.176:3000";
    }
})();
