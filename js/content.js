// content.js
window.rettro_content = {};
window.rettro_content.parse_url = function (url) {
    let parser = document.createElement('a');
    parser.href = url;
    let url_obj = {};
    for (var property in parser) {
      if (typeof parser[property] === "string" && parser[property].length > 0) {
        url_obj[property] = parser[property];
      }
    }
    return url_obj;
};

window.rettro_content.test = function () {
  var temp = $(".hP").innerText;
  console.log(temp);
};

// This script will be used to scrape relevant website data, to be sent to background.js for processing
(function rettro_all_content_init () {
    console.log("hello from content.js ( all pages )");
    // We will do all our client side scraping here
    let url = window.rettro_content.parse_url(location.href);
    console.log(url);

    console.log(window);
    var t = $("h1");
    console.log(t);

    // $( document ).ready(function() {
    //     console.log( "ready!" );
    //
    //     setTimeout(function() {
    //       console.log("---");
    //       var temp = $(".hP").innerText;
    //       console.log(temp);
    //
    //
    //       // if (url && url.host && url.host.length > 0) {
    //       //   // G-Mail specific scraping
    //       //   if (url.host === "mail.google.com") {
    //       //     // Check to see if we are viewing an Email
    //       //     let subject_el = $(".hP");
    //       //     if (subject_el) {
    //       //       let subject_txt = subject_el.innerText;
    //       //       console.log(subject_txt);
    //       //     }
    //       //   }
    //       // }
    //     }, 10000);
    //
    //
    //
    //
    //
    //
    // });





})();
