let rettro_theme = {};

rettro_theme.init = function () {

    // Dark theme toggle button
    $('#dark-theme-toggle-core').css({"left": rettro.is_dark_theme ? "calc(100% - 20px)" : "0"});
    $('#dark-theme-toggle-core-icon').attr("src", rettro.is_dark_theme ? "/images/icons/moon.svg" : "/images/icons/sun.svg");

    // Settings icons
    $("#profile-menu-wrapper .main-icon").each(function () {
        let src = $(this).attr("data-src");
        src = "/images/icons/menu/" + src + (rettro.is_dark_theme ? "-w" : "-b") + ".svg";
        $(this).attr("src", src);
    });

    if (rettro.is_dark_theme) {

        // Main
        $("#header").removeClass("dark").addClass("dark");
        $("#body").removeClass("dark").addClass("dark");

        // Dark theme toggle button
        $("#dark-theme-toggle-bg").removeClass("dark").addClass("dark");
        $("#dark-theme-toggle-core").removeClass("dark").addClass("dark");

        // Set profile menu theme styles
        $("#profile-menu-wrapper").removeClass("dark").addClass("dark");
        $("#bg-cover").removeClass("dark").addClass("dark");
        $("#profile-settings-button img").attr("src", "/images/icons/menu/dots-w.svg");

        // Groups Panel
        $("#groups .domain-el .latest-icon").attr("src", "/images/icons/menu/latest-w.svg");
        $("#groups .domain-el .count img").attr("src", "/images/icons/menu/star/star-y-f.svg");

        // Links Panel
        $("#links .link-el .time-wrapper img").attr("src", "/images/icons/menu/eye-w.svg");
        $("#groups .domain-el .hover-el img").attr("src", "/images/icons/menu/dots-gd.svg");

        // Group Edit Panel
        $("#edit-panel-wrapper .close img").attr("src", "/images/icons/menu/x-w.svg");
        $(".domain-title-el-wrapper img").attr("src", "/images/icons/menu/question-w.svg");

        $("#delete-collection-btn img").attr("src", "/images/icons/menu/trash/delete-w.svg");
        $("#star-collection-btn img").attr("src", "/images/icons/menu/star/star-w.svg");


    } else {

        // Main
        $("#header").removeClass("dark");
        $("#body").removeClass("dark");

        // Dark theme toggle button
        $("#dark-theme-toggle-bg").removeClass("dark");
        $("#dark-theme-toggle-core").removeClass("dark");

        // Set profile menu theme styles
        $("#profile-menu-wrapper").removeClass("dark");
        $("#bg-cover").removeClass("dark");
        $("#profile-settings-button img").attr("src", "/images/icons/menu/dots-b.svg");

        // Groups Panel
        $("#groups .domain-el .latest-icon").attr("src", "/images/icons/menu/latest-b.svg");
        $("#groups .domain-el .count img").attr("src", "/images/icons/menu/star/star-yd-f.svg");

        // Links Panel
        $("#links .link-el .time-wrapper img").attr("src", "/images/icons/menu/eye-b.svg");
        $("#groups .domain-el .hover-el img").attr("src", "/images/icons/menu/dots-g.svg");

        // Group Edit Panel
        $("#edit-panel-wrapper .close img").attr("src", "/images/icons/menu/x-b.svg");
        $(".domain-title-el-wrapper img").attr("src", "/images/icons/menu/question-b.svg");
        $("#delete-collection-btn img").attr("src", "/images/icons/menu/trash/delete-b.svg");
        $("#star-collection-btn img").attr("src", "/images/icons/menu/star/star-b.svg");

    }

};

