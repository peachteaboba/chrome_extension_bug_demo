let rettro_helper = {};
rettro_helper.url = {};

// --------------------------------------------------------------------------
// --------------------------------------------------------------------------
// --------------------------------------------------------------------------
// -----------------                                        -----------------
// -----------------                  AJAX                  -----------------
// -----------------                                        -----------------
// --------------------------------------------------------------------------
// --------------------------------------------------------------------------
// --------------------------------------------------------------------------
rettro_helper.ajax_post = function (path, data, callback) {
    $.ajax({
        url: rettro_config.server_url + path,
        data: data,
        type: 'post',
        headers: rettro.ajax_header,
        success: function (response) {
            if (typeof callback === "function") {
                callback(response);
            }
        },
        error: function (request, status, error) {
            console.error("---------------- REQUEST ERROR ----------------");
            console.error(request);
            console.error(status);
            console.error(error);
            console.error("-----------------------------------------------");
        }
    });
};













// --------------------------------------------------------------------------
// --------------------------------------------------------------------------
// --------------------------------------------------------------------------
// -----------------                                        -----------------
// -----------------                  URL                   -----------------
// -----------------                                        -----------------
// --------------------------------------------------------------------------
// --------------------------------------------------------------------------
// --------------------------------------------------------------------------
rettro_helper.url.open = function (url) {
    if (url && url.length > 0) {
        chrome.tabs.create({url: url});
    }
};

rettro_helper.log_error = function (message, err) {
    console.error("* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *");
    console.error("* * * * * * * * * * * * * CAUGHT ERROR! * * * * * * * * * * * * *");
    console.error("* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *");
    console.error(message);
    console.error(err);
    console.error("* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *");
    console.error("* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *");
    console.error("* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *");
    // TODO: Build the error object and record in DB
};

rettro_helper.build_flex_date_str = function (date) {
    if (typeof date === "string") {
        const diff_in_days = moment().diff(date, 'days');
        let date_component = "";
        if (diff_in_days === 0) {
            // Today
            date_component = "Today";
        } else if (diff_in_days === 1) {
            // Yesterday
            date_component = "Yesterday";
        } else {
            // 2 or more days have passed, display full date
            date_component = moment(date).format('M/D/YYYY');
        }
        return date_component + ' ' + moment(date).format('h:m a');
    } else {
        return '';
    }
};

rettro_helper.build_info_box = function (id, text, width, custom_class) {
    const el = $("#" + id);
    if (el) {
        // Place html
        let div = document.createElement('div');
        div.setAttribute("style", typeof width === "string" ? "width: " + width + ";" : "width: 200px;");
        if (custom_class) {
            div.setAttribute("class", "hover-info-box " + custom_class);
        } else {
            div.setAttribute("class", "hover-info-box");
        }
        div.innerHTML = '<p>' + text + '</p>';
        el.append(div);

        // Bind event handlers
        el.mouseenter(function () {
            $(this).children(".hover-info-box").css("visibility", "visible");
        }).mouseleave(function () {
            $(this).children(".hover-info-box").css("visibility", "hidden");
        });
    }
};

rettro_helper.display_confirmation_box = function (type, callback) {
    const bg_cover_el = $('#bg-cover-confirmation');
    let msg = '';
    let cta_msg = '';
    if (type === "delete_domain") {
        msg = 'Are you sure you want to delete this collection? <span>This action cannot be undone</span>';
        cta_msg = "Yes, Delete It";
    } else if (type === "delete_all" && rettro_body.total_links_count) {
        msg = 'Are you sure you want to delete all <span>' + rettro_body.total_links_count + '</span> links saved in this profile? <span>This action cannot be undone</span>';
        cta_msg = "Yes, Delete All Links";
    }

    if (msg && bg_cover_el) {
        // Display BG Cover
        bg_cover_el.css({
            "height": "100%"
        }).html("");

        // Display confirmation box
        let div = document.createElement('div');
        div.setAttribute("id", "confirmation-box");
        div.innerHTML = '<div class="text-wrapper"><p>' + msg + '</p></div><div class="btn-wrapper"><p class="no">Nevermind</p><p class="yes">' + cta_msg + '</p></div>';
        $('#bg-cover-confirmation').append(div);

        // Apply click handlers
        $("#confirmation-box").find(".no").click(function () {
            bg_cover_el.css("height", "0").html("");
            if (typeof callback === "function") {
                callback(false);
            }
        });
        $("#confirmation-box").find(".yes").click(function () {
            bg_cover_el.css("height", "0").html("");
            if (typeof callback === "function") {
                callback(true);
            }
        });
    }
};

// rettro.launch_confirmation_box_with_input = function (type, callback) {
//     let html;
//     if (type === "purge") {
//         let msg = 'You are about to permanently delete all <span>' + rettro_body.total_links_count + '</span> links saved in this profile. <span>This action cannot be undone.</span> Please type "delete" into the input box to confirm';
//         let delete_el = '<p class="input-status">delete</p>';
//         let input_box = '<input id="delete-conf-input" name="delete-conf">';
//         let buttons = '<div class="btn-wrapper"><p class="no">Nevermind</p><p class="yes">Delete All Data</p></div>';
//         html = [
//             '<div class="text-wrapper">',
//             '<p>' + msg + '</p>',
//             '</div>',
//             delete_el,
//             input_box,
//             buttons
//         ].join('');
//     }
//
//     if (html) {
//         // Display BG Cover
//         const bg_cover_el = $('#bg-cover-confirmation');
//         bg_cover_el.css("height", "100%").html();
//         let div = document.createElement('div');
//         div.setAttribute("id", "confirmation-box");
//         div.innerHTML = html;
//         $('#bg-cover-confirmation').append(div);
//         $("#delete-conf-input").focus();
//         $("#delete-conf-input").css("border", "1px solid #D0DDE7");
//
//         // Apply input change event handlers
//         $("#confirmation-box .btn-wrapper .yes").removeClass("disabled").addClass("disabled");
//         $("#delete-conf-input").keyup(function () {
//             const val = $(this).val();
//             if (val !== "delete") {
//                 $("#delete-conf-input").css("border", "1px solid #D0DDE7");
//                 $("#confirmation-box .btn-wrapper .yes").removeClass("disabled").addClass("disabled");
//             }
//             if (val === "d") {
//                 $("#confirmation-box .input-status").html("<span>d</span>elete");
//             } else if (val === "de") {
//                 $("#confirmation-box .input-status").html("<span>de</span>lete");
//             } else if (val === "del") {
//                 $("#confirmation-box .input-status").html("<span>del</span>ete");
//             } else if (val === "dele") {
//                 $("#confirmation-box .input-status").html("<span>dele</span>te");
//             } else if (val === "delet") {
//                 $("#confirmation-box .input-status").html("<span>delet</span>e");
//             } else if (val === "delete") {
//                 $("#confirmation-box .input-status").html("<span class='confirmed'>delete</span>");
//                 $("#delete-conf-input").css("border", "1px solid #00C06D");
//                 $("#confirmation-box .btn-wrapper .yes").removeClass("disabled");
//             }
//         });
//
//         // Apply click handlers
//         $("#confirmation-box").find(".no").click(function () {
//             bg_cover_el.css("height", "0").html("");
//             if (typeof callback === "function") {
//                 callback(false);
//             }
//         });
//
//         $("#confirmation-box").find(".yes").click(function () {
//             const val = $("#delete-conf-input").val();
//             if (val === "delete") {
//                 bg_cover_el.css("height", "0").html("");
//                 if (typeof callback === "function") {
//                     callback(true);
//                 }
//             }
//         });
//
//     } else {
//         console.log("[ rettro.launch_confirmation_box_with_input ] ERROR: Unknown conf box type, not launching modal");
//     }
// };

rettro_helper.flash_message = function (message, is_error) {
    if ($('#message-wrapper p').text().length === 0) {
        let color = rettro.is_dark_theme ? "#1FB46B" : "#1FB46B";
        if (is_error) color = rettro.is_dark_theme ? "#DD4538" : "#F8524D";
        $('#message-wrapper .content-wrapper').css({"background": color});
        $('#message-wrapper p').text(message);
        $('#message-wrapper').css({"visibility": "visible"});
        rettro_helper.create_pie_countdown("prompt", function () {
            // Trigger hide animation
            anime({
                targets: '#message-wrapper',
                translateY: 60,
                duration: 1000,
                easing: 'easeInOutExpo',
                complete: function() {
                    $('#message-wrapper p').text("");
                    $('#message-wrapper').css({"visibility": "hidden"});
                }
            });
        });
        // Trigger show animation
        anime({
            targets: '#message-wrapper',
            translateY: -60,
            easing: 'spring(1, 80, 14, 15)',
            duration: 400
        });
    } else {
        console.log("[ flash_message ] Message display overlap!");
    }
};

rettro_helper.create_pie_countdown = function (type, callback) {
    if (type === "prompt") {
        $(function () {
            let timer = $("#message-wrapper-countdown"),
                pie = timer.find('.pctPie'),
                slices = pie.find('.pctSlice'),
                spinner = pie.find('.pctSpinner'),
                timerValue = 0;
            let timer_int = setInterval(function () {
                spinner.css({
                    'webkitTransform': 'rotate(' + timerValue + 'deg)',
                    'oTransform': 'rotate(' + timerValue + 'deg)',
                    'mozTransform': 'rotate(' + timerValue + 'deg)',
                    'msTransform': 'rotate(' + timerValue + 'deg)',
                    'transform': 'rotate(' + timerValue + 'deg)'
                });
                if (timer.hasClass('pctCountdown')) {
                    let color = 'white';
                    slices.css({
                        'borderColor': color,
                        'background': color
                    });
                    if (timerValue > 180) {
                        pie.removeClass('pctFull');
                    } else {
                        pie.addClass('pctFull');
                    }
                }
                if (++timerValue > 360) {
                    timerValue = 0;
                    clearInterval(timer_int);
                    if (typeof callback === "function") {
                        callback();
                    }
                }
            }, 12);
        });
    } else {
        // TODO: Handle other types?
    }
};

rettro_helper.display_loading_screen = function () {
    console.log("--- display loading screen ---");


};









































