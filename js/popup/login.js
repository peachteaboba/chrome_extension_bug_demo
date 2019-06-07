// The rettro_login object will expose some login specific functions to popup.js
let rettro_login = {};
rettro_login.current_page = 1;
rettro_login.current_page_el = null;

rettro_login.activate = function () {

    // Display login bg wrapper
    $('#login-bg-wrapper').css({"height": "100%", "display": "block"}).particleground({
        dotColor: 'rgba(255,255,255,0.1)',
        lineColor: 'rgba(255,255,255,0.1)',
        particleRadius: 3,
        lineWidth: 1,
        parallax: false
    });

    // Bind event handlers
    rettro_login.bind_event_handlers();

    // Animate page 1
    setTimeout(function () {
        $('#login-p1').css({"animation": "login-page-ani 0.5s ease-in-out 1 forwards"});
        rettro_login.current_page_el = $('#login-p1');
        rettro_login.init_nav_buttons();
        rettro_login.animate_nav_buttons();
    }, 250);

};

rettro_login.bind_event_handlers = function () {

    $("#login-header .logo-img").on("click", function () {
        const url = rettro_config.website_url;
        chrome.tabs.create({url: url});
    });

    $("#login-footer .login-footer-website").on("click", function () {
        const url = rettro_config.website_url;
        chrome.tabs.create({url: url});
    });

    $("#login-footer .login").on("click", function () {
        const url = rettro_config.website_url + "/login";
        chrome.tabs.create({url: url});
    });

    $("#login-footer .reg").on("click", function () {
        const url = rettro_config.website_url + "/signup";
        chrome.tabs.create({url: url});
    });

    $("#login-footer .login-footer-cta span").on("click", function () {
        const url = rettro_config.website_url + "/pro";
        chrome.tabs.create({url: url});
    });

    $("#login-next-wrapper").on("click", function () {
        rettro_login.handle_nav_button_pressed(true);
    });

    $("#login-prev-wrapper").on("click", function () {
        rettro_login.handle_nav_button_pressed(false);
    });

};

rettro_login.handle_nav_button_pressed = function (is_next) {
    if (is_next) {
        // Next button tapped
        if (rettro_login.current_page !== 3) {
            rettro_login.current_page++;
            rettro_login.nav_to_new_page(is_next);
        }
    } else {
        // Prev button tapped
        if (rettro_login.current_page !== 1) {
            rettro_login.current_page--;
            rettro_login.nav_to_new_page(is_next);
        }
    }
};

rettro_login.nav_to_new_page = function (is_next) {

    // 1) Fade current page to background .....................................
    // ........................................................................
    const current_temp = rettro_login.current_page_el;
    if (rettro_login.current_page_el) {
        rettro_login.current_page_el.css({"animation": "login-page-fade-ani 0.25s ease-in-out 1"});
        setTimeout(function () {
            current_temp.css({"animation": "unset", "right": "-15%", "opacity": "0"});
        }, 500);
    }

    setTimeout(function () {

        // 2) Animate login buttons ...............................................
        // ........................................................................
        if (rettro_login.current_page === 3) {
            $("#login-footer .login-footer-cta").removeClass("p3").addClass("p3");
            $("#login-footer .login-footer-cta p").css({"display": "block"});
        } else {
            $("#login-footer .login-footer-cta").removeClass("p3");
            $("#login-footer .login-footer-cta p").css({"display": "none"});
        }

        // 3) Display new current page ............................................
        // ........................................................................
        rettro_login.current_page_el = $('#login-p' + rettro_login.current_page);
        if (rettro_login.current_page_el) {
            if (is_next) {
                rettro_login.current_page_el.css({"animation": "login-page-ani 0.5s ease-in-out 1 forwards"});
            } else {
                rettro_login.current_page_el.css({"animation": "login-page-ani-reverse 0.5s ease-in-out 1 forwards"});
            }
        }

        // 4) Display new nav buttons .............................................
        // ........................................................................
        rettro_login.init_nav_buttons();

    }, 100);

};

rettro_login.init_nav_buttons = function () {
    let prev = "none";
    let next = "none";

    // Determine styles
    if (rettro_login.current_page === 1) {
        next = "inline-block";
    } else if (rettro_login.current_page === 2) {
        next = "inline-block";
        prev = "inline-block";
    } else {
        prev = "inline-block";
    }

    // Apply styles
    $("#login-prev-wrapper").css({"display": prev});
    $("#login-next-wrapper").css({"display": next});
};


rettro_login.animate_nav_buttons = function () {
    setTimeout(function () {
        $('#login-next-wrapper img').css({"animation": "login-next-arrow-ani 2.5s ease-in-out infinite forwards"});
    }, 2500);
};

