const IS_DEV_MODE = !('update_url' in chrome.runtime.getManifest());
function debugLog (str) {
    if (IS_DEV_MODE) console.log(str);
}

const rettro = {};
rettro.systemBlacklist = ["chrome://"];

rettro.server_ip = "http://192.168.1.176:3001";

rettro.init = function (force) {
    debugLog('[ background.js ] This only appears in developer mode');

    if (!window.rettro || force) {
        window.rettro = {};

        // Misc
        window.rettro.last = "";
        window.rettro.last_base = "";
        window.rettro.is_pending = false;

        // Login token
        window.rettro.login_token = "";

        // Required props to start url recording
        window.rettro.profile_id = "";
        window.rettro.blacklist = [];
        window.rettro.whitelist = [];
        window.rettro.using_whitelist = false;
        window.rettro.is_paused = false;
        window.rettro.pending_logout = false;

        //rettro.deleteToken();
        rettro.firstLoad();
    }

    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            if (request.message === "on_rettro") {
                if (window.rettro.pending_logout) {
                    window.rettro.pending_logout = false;
                    // Send a message to the active tab, notifying it that we logging out and deleting the login token from localstorage
                    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                        chrome.tabs.sendMessage(tabs[0].id, {"message": "delete_rettro_login_token"});
                    });
                } else {
                    // ------------------------------------------
                    // Called each time rettro.app domain reloads
                    // ------------------------------------------
                    rettro.getToken(function (token) {
                        if (!token) {
                            // Send a message to the active tab, notifying it that we are missing the login token
                            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                                chrome.tabs.sendMessage(tabs[0].id, {"message": "listen_for_rettro_login_token"});
                            });
                        } else {
                            console.log("[ on_rettro ] rettro_login_token already exists");
                        }
                    });
                }
            } else if (request.message === "got_rettro_login_token" && request.token) {
                // -----------------------------------------------
                // Called when a requested login token is captured
                // -----------------------------------------------
                rettro.setToken(request.token, function () {
                    console.log("[ got_rettro_login_token ] Successfully set rettro_login_token", request.token);
                    rettro.initUser(request.token);
                });
            } else if (request === "rettro_popup_token_query") {
                let dummy_token = "thisisnothteactualtoken";
                sendResponse({token: dummy_token});
                // sendResponse({token: window.rettro.login_token});
            } else {
                console.log("[ init ] Unknown message received:", request);
                console.log("[ init ] sender", sender);
            }
        }
    );
};

rettro.firstLoad = function () {
    // Check for token
    rettro.getToken(function (token) {
        if (!token) {
            console.log("[ firstLoad ] No token found");
        } else {
            console.log("[ firstLoad ] Login token found:", token);
            //rettro.initUser(token);
        }
    });
};

rettro.getToken = (cb) => {
    if (window.rettro.login_token && window.rettro.login_token.length > 0) {
        cb(window.rettro.login_token);
    } else {
        // Read it using the storage API
        chrome.storage.local.get('rettro_login_token', function (item) {
            if (item && item['rettro_login_token']) {
                // token found
                window.rettro.login_token = item['rettro_login_token'];
                cb(item['rettro_login_token']);
            } else {
                // token NOT found
                cb(false);
            }
        });
    }
};

rettro.setToken = (token, cb) => {
    chrome.storage.local.set({"rettro_login_token": token}, function () {
        window.rettro.login_token = token;
        cb();
    });
};

rettro.deleteToken = (cb) => {
    chrome.storage.local.clear(function () {
        let error = chrome.runtime.lastError;
        if (error) {
            console.error(error);
        }
        window.rettro.login_token = "";
        if (typeof cb === "function") {
            cb();
        }
    });
    chrome.browserAction.setIcon({
        path: {
            "38": "images/extension/neutral.png"
        }
    });
};

// -----------------
// Start doing stuff
// -----------------
(function () {
    rettro.init(true);
})();