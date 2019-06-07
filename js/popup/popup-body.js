let rettro_body = {};

// General
rettro_body.group_selected = "";
rettro_body.domain_list_starred = [];
rettro_body.domain_list = [];
rettro_body.links_list = [];
rettro_body.is_editing = null;
rettro_body.is_editing_prev = null;
rettro_body.max_nickname_character_count = 30;
rettro_body.total_links_count = 0;

// Used to prevent hovering animation on star icon after toggle
rettro_body.no_hover = false;

// Cache
rettro_body.cache = {};
rettro_body.cache.links = {};
rettro_body.cache.domains = {};

// Misc
rettro_body.url = {};

// Set moment locale
moment.updateLocale('en', {
    relativeTime: {
        future: "in %s",
        past: "%s",
        s: '%ds',
        ss: '%ds',
        m: "1m",
        mm: "%dm",
        h: "1h",
        hh: "%dh",
        d: "1d",
        dd: "%dd",
        M: "1M",
        MM: "%dM",
        y: "1Y",
        yy: "%dY"
    }
});







