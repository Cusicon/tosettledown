// Close any popUp, by hitting 'Esc' button
function closeOnEscBtn() {
    // Close on Hit 'Esc' button
    $('body').keyup((e) => {
        var popUp = $(".popUp");
        if (e.keyCode == 27) {
            popUp.children("input").val("");
            $(".overlayNav").css({ "background-color": "transparent" });
            popUp.css({ "bottom": "-50%" }).hide(500);
        }
    });
} closeOnEscBtn();

// show quickMessagePopUp
function quickMessagePopUp() {
    var sendAMessageBtn = $("#sendAMessage");
    sendAMessageBtn.click(() => {
        $(".overlayNav").css({ "background-color": "#00000066" });
        $(".quickMessagePopUp").css({ "bottom": "-10%" }).show(300);
    });

    // Close on Click 'x' button
    $('#closeQuickMessagePopUp').click(() => {
        $(".quickMessagePopUp input").val("");
        $(".overlayNav").css({ "background-color": "transparent" });
        $(".quickMessagePopUp").css({ "bottom": "-50%" }).hide(500);
    });
} quickMessagePopUp();

// navigate Images in Encounters
function navigateImages() {
    $('div.imageWindow').keyup((e) => {
        if (e.keyCode == 37) { // Left Arrow
            alert("Left Arrow");
        }
        else if (e.keyCode == 39) { // Right Arrow
            alert("Right Arrow");
        }
    });
} navigateImages();

// function generateDynamicInput(element) {
//     var diHtml = `<>`
//     return alert(element);
// }

// function dynamicInput() {
//     var parent = $('input[data-type="dynamicInput"]');
//     generateDynamicInput(parent.get());
// } dynamicInput();
