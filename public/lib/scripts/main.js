$(document).ready(() => {
    var message = $("div#messages ul");
    // var image = $("div#messages ul").attr('data-src');
    var text = $("div#messages ul li").text();
    var mode = $("div#messages ul").attr("class");

    if (text != "") {
        alert(mode, mode, text);
    }
    message.html("");
});

function alert(icon, mode, msg, buttons = [], buttonAction) {
    var upperMode = mode.replace(mode.charAt(0), mode.charAt(0).toUpperCase());
    swal({
        title: upperMode,
        text: msg,
        icon: icon || null,
        closeOnEsc: true,
        closeOnClickOutside: true,
        dangerMode: true,
        buttons: buttons.length > 0 ? buttons : null // If buttons length is more than 0, then execute the function 
    }).then(actions => {
        if (actions) {
            buttonAction(); // Action for the first button from the right.
        } else {
            swal.close();
        }
    });
}

String.prototype.trunc = function (n, useWordBoundary) {
    if (this.length <= n) {
        return this;
    }
    let subString = this.substr(0, n - 1);
    return (useWordBoundary ?
        subString.substr(0, subString.lastIndexOf(' ')) :
        subString) + "&hellip;";
};

if (!Date.now) {
    Date.now = function () {
        return new Date().getTime();
    }
}

Date.prototype.getUnixTime = function () {
    return Date.now() / 1000 | 0
};

if (!Array.last) {
    Array.prototype.last = function () {
        return this[this.length - 1];
    };
}