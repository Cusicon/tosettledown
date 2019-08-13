$(document).ready(() => {
    let message = $("div#messages ul");
    // let image = $("div#messages ul").attr('data-src');
    let text = $("div#messages ul li").text();
    let mode = $("div#messages ul").attr("class");

    if (text != "") {
        alert(mode, mode, text);
    }
    message.html("");
});

function alert(icon, mode, msg) {
    let upperMode = mode.replace(mode.charAt(0), mode.charAt(0).toUpperCase());
    swal({
        title: upperMode,
        text: msg,
        icon: icon || null,
        closeOnEsc: true,
        closeOnClickOutside: true
    });
}

String.prototype.trunc = function( n, useWordBoundary ){
    if (this.length <= n) { return this; }
    let subString = this.substr(0, n-1);
    return (useWordBoundary
        ? subString.substr(0, subString.lastIndexOf(' '))
        : subString) + "&hellip;";
};

if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
}

Date.prototype.getUnixTime = function() { return Date.now() / 1000 | 0 };
