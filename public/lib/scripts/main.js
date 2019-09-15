$(document).ready(() => {
    let message = $("div#messages ul");
    // let image = $("div#messages ul").attr('data-src');
    let text = $("div#messages ul li").text();
    let mode = $("div#messages ul").attr("class");

    if (text !== "") {
        alert(mode, mode, text);
    }
    message.html("");



});

// Share a profile
function share(text) {
    var $temp = $("<input>"); // Create and invisible input tag
    $("body").append($temp); // Append it to body
    text = $temp.val(text).select(); // 
    text = String(text);
    document.execCommand("copy");
    $temp.remove();

    mySnackbar(`Link copied!`);
}

function alert(icon, mode, msg, buttons = [], buttonAction) {
    let upperMode = mode.replace(mode.charAt(0), mode.charAt(0).toUpperCase());
    swal({
        title: upperMode,
        text: msg,
        icon: icon || null,
        closeOnEsc: (icon.toLowerCase() == "warning") || (icon.toLowerCase() == "success") || (icon.toLowerCase() == "info") ? true : false,
        closeOnClickOutside: false,
        dangerMode: (icon.toLowerCase() == "warning") || (icon.toLowerCase() == "success") || (icon.toLowerCase() == "info") ? false : true,
        buttons: buttons.length > 0 ? buttons : null // If buttons length is more than 0, then execute the function 
    }).then(actions => {
        if (actions) {
            if (buttonAction && typeof (buttonAction) === 'function')
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
// Load this functions at App routes only!!!
(() => {
    if (location.href.includes('/app/') && !location.href.includes('/signin/out')) {
        console.log("At app")
        if (window.outerWidth > 576) {
            makeDisplayWindowScreenHeight([
                ".displayWindow",
                ".ChatList",
                ".ChatWindowBody"
            ]);
        }
    } else {
        console.log("Not at app")
    }
})();

function makeDisplayWindowScreenHeight(selectors = []) {
    var documentHeight = document.documentElement.clientHeight;
    if (!location.href.includes("encounters")) {
        selectors.forEach(element => {

            if (element.toString().includes(".ChatWindowBody")) {
                let ChatWindowHeadHeight = $(".ChatWindowHead").height(),
                    ChatWindowFooterHeight = $(".ChatWindowFooter").height(),
                    totalHeight = ChatWindowHeadHeight + ChatWindowFooterHeight,
                    ChatWindowBodyHeight = documentHeight - totalHeight;
                $(element).css({
                    "height": `${ChatWindowBodyHeight - 40}`
                });
            } else {

                $(element).css({
                    "height": `${documentHeight}`
                });

            }
        })
    }
}
