let rettro = {};

// General
rettro.token = "";
rettro.ajax_header = {};
rettro.profile_settings = {};
rettro.profile_id = '';
rettro.post_init_message = '';
rettro.events_bound = false;

// Menu
rettro.show_menu = false;
rettro.editing_profile_name = false;
rettro.profile_img_icons = [];
rettro.is_dark_theme = false;

// Pending flags
rettro.pending_paused_update = false;
rettro.pending_profile_name_update = false;

rettro.init = function () {
    const dummy_data = {
        user: {
            email: 'email@email.com',
            display_name: 'dummy_user'
        },
        profile: {
            is_dark_theme: false,
            is_paused: true,
            last_active_date: "2019-06-07T17:27:44.410Z",
            last_paused_date: "2019-06-07T17:27:43.130Z",
            name: 'Bug Demo Profile',
            _id: "user_id_goes_here"
        }
    };
    rettro.render_init(dummy_data);
};

rettro.render_init = function (data) {
    rettro.profile_settings = data.profile;
    rettro.profile_id = rettro.profile_settings._id;

    // Record theme settings
    rettro.is_dark_theme = rettro.profile_settings['is_dark_theme'];

    // Create and set toggle button programmatically
    rettro.create_toggle_button(rettro.profile_settings.is_paused, false);

    // Set styles
    rettro.set_dark_theme_styles();
    rettro.set_profile_styles();

    // Bind event handlers
    if (!rettro.events_bound) {
        rettro.set_event_handlers();
    }
};

rettro.create_toggle_button = function (is_paused, animate) {

    // Build toggle wrapper title ..............................
    // .........................................................
    let title_el = $("#toggle-wrapper-title");
    title_el.html('');

    const status_dot_styles = 'background:' + (is_paused ? '#FF625D' : '#1DDA93') + ';';

    let title_div = document.createElement('div');
    title_div.setAttribute("id", "status-dot");
    title_div.setAttribute("style", status_dot_styles);

    let title_p = document.createElement('p');
    title_p.setAttribute("id", "status-text");
    title_p.setAttribute("class", "noselect");
    title_p.innerHTML = is_paused ? 'Paused' : 'Active';

    title_el.append(title_div);
    title_el.append(title_p);


    // Build toggle wrapper ....................................
    // .........................................................
    let el = $("#toggle-wrapper");
    el.html('');

    const bg_style = 'background:' + (is_paused ? '#FF625D' : '#1DDA93') + ';';
    const border_style = 'border:' + (is_paused ? '3px solid #FF625D' : '3px solid #1DDA93') + ';';
    const btn_styles = bg_style + border_style;


    let dot_styles = '';
    if (!animate) {
        dot_styles = 'left:' + (is_paused ? 'calc(100% - 18px)' : '0') + ';';
    } else {
        // Let's do some Javascript animations!
        if (is_paused) {
            // Going from left to right
            dot_styles = 'left: 0;';
        } else {
            // Going from right to left
            dot_styles = 'left: calc(100% - 18px);';
        }
    }

    const html = '<div class="dot" style="' + dot_styles + '"></div>';

    let div = document.createElement('div');
    div.setAttribute("id", "is-paused-toggle-btn");
    div.setAttribute("style", btn_styles);
    div.innerHTML = html;
    el.append(div);

    // Set event handler .......................................
    // .........................................................
    $("#is-paused-toggle-btn").click(function () {
        rettro.toggle_paused();
    });

    // Trigger animations ......................................
    // .........................................................
    if (animate) {
        anime({
            targets: '#is-paused-toggle-btn .dot',
            translateX: is_paused ? 16 : -16,
            easing: 'easeInOutExpo',
            duration: 500
        });
    }
};

rettro.set_event_handlers = function () {
    rettro.events_bound = true;

    $("#dark-theme-toggle-bg").click(function () {
        rettro.toggle_dark_theme();
    });

    $(".right-wrapper .menu-wrapper .profile-wrapper").click(function () {
        rettro.show_menu = !rettro.show_menu;
        rettro.render_menu();
    });

    $("#bg-cover").click(function () {
        rettro.handle_bg_cover_tapped();
    });

    // ------------------------------------------
    // ------------- Purge All Data -------------
    // ------------------------------------------
    $("#purge").on("click", function () {
        rettro_helper.display_confirmation_box("delete_all", function (confirmed) {
            if (confirmed) {
                // Actual AJAX call would go here
                rettro.post_init_message = "Successfully deleted all saved links";
                rettro.init();
            }
        });
    });

    // ----------------------------------
    // ------------- Logout -------------
    // ----------------------------------
    $("#logout").on("click", function () {
        rettro.handle_logout_button_tapped();
    });

    $("#profile-name-menu").on("change paste keyup", function () {
        rettro.update_profile_name_edit_num($(this).val());
    }).focus(function () {
        $(this).select();
        rettro.update_profile_name_edit_num($(this).val());
        $("#profile-menu-wrapper .profile-name-wrapper").css("width", "190px");
        setTimeout(function () {
            $("#profile-name-letter-count").css("visibility", "visible");
            $("#profile-name-edit-icon").css("visibility", "visible");
        }, 250);
    }).blur(function () {
        $("#profile-name-letter-count").css("visibility", "hidden");
        $("#profile-name-edit-icon").css("visibility", "hidden");

        setTimeout(function () {
            $("#profile-menu-wrapper .profile-name-wrapper").css("width", "220px");
        }, 250);
        const val = $(this).val();
        if (val !== rettro.profile_settings.name && val.length !== 0 && val.length <= 25) {
            // Blur with saving
            rettro.submit_edit_profile_name(val);
        }
        rettro.set_profile_styles();
    }).keypress(function (event) {
        let keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode === 13) {
            $(this).blur();
        }
    });

    $("#profile-icon-menu").click(function () {
        rettro.render_profile_image_list();
    });

    $("#profile-icon-list-wrapper").click(function () {
        rettro.profile_icon_select.hide();
    });

    $("#profile-menu-wrapper .cell").mouseenter(function () {
        const el = $(this).find($(".main-icon"));
        let src = el.attr("data-src");
        let hvr = el.attr("data-hover");
        if (hvr && hvr === "red") {
            if (rettro.is_dark_theme) {
                // Do nothing
            } else {
                // Flip color
                el.attr("src", "/images/icons/menu/" + src + "-w.svg");
            }
        } else if (hvr && hvr === "normal") {
            if (rettro.is_dark_theme) {
                // Flip color
                el.attr("src", "/images/icons/menu/" + src + "-b.svg");
            } else {
                // Flip color
                el.attr("src", "/images/icons/menu/" + src + "-w.svg");
            }
        }
    }).mouseleave(function () {
        const el = $(this).find($(".main-icon"));
        let src = el.attr("data-src");
        let hvr = el.attr("data-hover");
        if (hvr && hvr === "red") {
            if (rettro.is_dark_theme) {
                // Do nothing
            } else {
                // Flip color
                el.attr("src", "/images/icons/menu/" + src + "-b.svg");
            }
        } else if (hvr && hvr === "normal") {
            if (rettro.is_dark_theme) {
                // Flip color
                el.attr("src", "/images/icons/menu/" + src + "-w.svg");
            } else {
                // Flip color
                el.attr("src", "/images/icons/menu/" + src + "-b.svg");
            }
        }
    });

};


// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------
// --------------------------------------- Dark Theme Setup ---------------------------------------
// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------
rettro.set_dark_theme_styles = function () {
    // if (typeof rettro_theme !== "undefined") {
    //     rettro_theme.init();
    // }
};

rettro.toggle_dark_theme = function () {
    // rettro.is_dark_theme = !rettro.is_dark_theme;
    //
    // // Apply theme change
    // rettro.set_dark_theme_styles();
    //
    // // Save theme change in DB
    //
    // // Update title
    // rettro.set_profile_menu_title();
};


// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------
// ----------------------------------- Profile Icon Settings --------------------------------------
// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------
rettro.render_profile_image_list = function () {
    // const dummy_data = [
    //     {
    //         name: "Rick",
    //         url: "https://s3-us-west-2.amazonaws.com/rettro-profile-icons/rick.png"
    //     },
    //     {
    //         name: "Morty",
    //         url: "https://s3-us-west-2.amazonaws.com/rettro-profile-icons/morty.png"
    //     },
    //     {
    //         name: "F-Society",
    //         url: "https://s3-us-west-2.amazonaws.com/rettro-profile-icons/fsociety.png"
    //     },
    //     {
    //         name: "Anon",
    //         url: "https://s3-us-west-2.amazonaws.com/rettro-profile-icons/anon.png"
    //     },
    //     {
    //         name: "Avatar",
    //         url: "https://s3-us-west-2.amazonaws.com/rettro-profile-icons/avatar.png"
    //     },
    //     {
    //         name: "Hal 9000",
    //         url: "https://s3-us-west-2.amazonaws.com/rettro-profile-icons/hal_9000.png"
    //     },
    //     {
    //         name: "Pennywise",
    //         url: "https://s3-us-west-2.amazonaws.com/rettro-profile-icons/pennywise.png"
    //     }
    // ];
    // rettro.profile_img_icons = dummy_data;
    // rettro.profile_icon_select.show();
};

rettro.profile_icon_select = {
    show: function () {
        // if (rettro.profile_img_icons.length > 0) {
        //     $("#profile-icon-list-wrapper").css("visibility", "visible");
        //
        //     // Render selections
        //     const select_wrapper = $("#profile-icon-list-wrapper .select-wrapper");
        //     select_wrapper.html("");
        //     rettro.profile_img_icons.forEach(function (el) {
        //         let div = document.createElement('div');
        //         div.setAttribute("class", "icon-wrapper");
        //         div.innerHTML = '<img src="' + el.url + '" alt="icon"><p>' + el.name + '</p>';
        //         select_wrapper.append(div);
        //     });
        //
        //     // Apply event handlers
        //     $("#profile-icon-list-wrapper .select-wrapper .icon-wrapper").click(function () {
        //         rettro.handle_new_profile_icon_selected(this.childNodes[0].src);
        //     });
        // }
    },
    hide: function () {

    }
};

rettro.handle_new_profile_icon_selected = function (url) {
    // rettro.profile_icon_select.hide();
    // if (url) {
    //     rettro.profile_settings.icon = url;
    //     rettro_helper.flash_message("Successfully Updated Profile Icon");
    //     rettro.set_profile_styles();
    // }
};

rettro.handle_logout_button_tapped = function () {
    console.log("logout button clicked");
};

rettro.handle_bg_cover_tapped = function () {
    // Hide menu
    rettro.show_menu = false;
    rettro.render_menu();
};

rettro.toggle_paused = function () {
    if (!rettro.pending_paused_update && rettro.profile_settings['_id']) {
        // Update UI
        rettro.create_toggle_button(!rettro.profile_settings.is_paused, true);
        rettro.pending_paused_update = true;
        rettro.pending_paused_update = false;
        rettro.profile_settings.is_paused = !rettro.profile_settings.is_paused;
        if (rettro.profile_settings.is_paused) {
            rettro.profile_settings['last_paused_date'] = moment();
        } else {
            rettro.profile_settings['last_active_date'] = moment();
        }
        //rettro.force_background_refresh();
        rettro.set_profile_styles();
        if (rettro.profile_settings.is_paused) {
            rettro_helper.flash_message("Successfully Paused Link Recordings");
        } else {
            rettro_helper.flash_message("Successfully Activated Link Recordings");
        }
    }
};

rettro.force_background_refresh = function () {
    console.log("force bg reset");
};

rettro.update_profile_name_edit_num = function (val) {
    const num = 25 - val.length;
    let color = "#B0BAC2";
    let img = "/images/icons/check-green.svg";
    if (val.length === 0) {
        color = "#F44239";
        img = "/images/icons/cancel-red.svg";
    } else if (num > 10) {
        color = "#00C06D"
    } else if (num >= 0) {
        color = "#FE9120"
    } else {
        color = "#F44239";
        img = "/images/icons/cancel-red.svg";
    }
    $("#profile-name-letter-count").text(num).css("color", color);
    $("#profile-name-edit-icon").attr("src", img);
};

rettro.submit_edit_profile_name = function (val) {
    if (!rettro.pending_profile_name_update && rettro.profile_settings['_id']) {
        rettro.pending_profile_name_update = true;
        // AJAX call goes here
        rettro.pending_profile_name_update = false;
        rettro.profile_settings.name = val;
        rettro_helper.flash_message("Successfully Updated Profile Name");
    }
};

rettro.set_profile_styles = function () {
    // Set current profile status
    rettro.set_profile_menu_title();

    // Set profile name
    $('#profile-name').text(rettro.profile_settings.name);
    $('#profile-name-menu').val(rettro.profile_settings.name);

    // Set profile icon
    let icon = rettro.profile_settings.icon || "/images/astronaut-helmet.svg";
    $('#profile-icon').attr("src", icon);
    $('#profile-icon-menu').attr("src", icon);

    // Email
    $('#account-email').text(rettro.profile_settings.email);
};



rettro.render_menu = function () {
    $('#bg-cover').css("height", rettro.show_menu ? "100%" : "0");
    $('#profile-menu-wrapper').css("display", rettro.show_menu ? "block" : "none");
    rettro.set_profile_menu_title();
};

rettro.set_profile_menu_title = function () {
    let profile_title_html = "<p>Current Profile</p>";
    if (rettro.profile_settings.is_paused) {
        profile_title_html += "<div class='status-dot red'></div><p class='red'>Paused " + moment(rettro.profile_settings['last_paused_date']).fromNow() + " ago</p>";
    } else {
        profile_title_html += "<div class='status-dot green'></div><p class='green'>Active for " + moment(rettro.profile_settings['last_active_date']).fromNow() + "</p>";
    }
    $('#profile-menu-wrapper .body .title').html(profile_title_html);
};

// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------
// ---------------------------------------- INIT POPUP ----------------------------------------
// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------
$(document).ready(function () {
    rettro.token = 'this_is_not_the_real_token';
    rettro.init();
});
