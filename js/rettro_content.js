(function rettro_content_init() {
    console.log("[ rettro_content_init ] Hello from rettro_content.js ( rettro.app )");

    // Notify background.js that we are on rettro domains
    chrome.runtime.sendMessage({"message": "on_rettro"});

    chrome.runtime.onMessage.addListener(
        function (request) {
            if (request.message === "listen_for_rettro_login_token") {
                // background.js needs rettro_login_token
                get_rettro_login_token(function (token) {
                    chrome.runtime.sendMessage({"message": "got_rettro_login_token", "token": token});
                });
            } else if (request.message === "delete_rettro_login_token") {
                // User has logged out via popup.js
                localStorage.removeItem("rettro_login_token");
                location.reload();
            }
        }
    );

})();


function get_rettro_login_token(cb) {
    const token = localStorage.getItem("rettro_login_token");
    if (typeof token !== "undefined" && token) {
        cb(token);
    } else {
        // console.log("[ get_rettro_login_token ] token not in localstorage, trying again in 1 second");
        setTimeout(function () {
            get_rettro_login_token(cb);
        }, 1000);
    }
}
