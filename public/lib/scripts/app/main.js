
// Close any popUp, by hitting 'Esc' button
function closeOnEscBtn() {
    // Close on Hit 'Esc' button
    $('body').keyup((e) => {
        if (e.keyCode == 27) { // Escape key
            $(".popUp input[type='text']").val("");
            $(".overlayNav").css({ "background-color": "transparent" });
            $(".popUp").css({ "bottom": "-50%" }).hide(500);
        }
    });
} closeOnEscBtn();

// function floatIn(element, bottomPercentage)

// show quickMessagePopUp
function quickMessagePopUp() {
    var sendAMessageBtn = $("#sendAMessage");
    sendAMessageBtn.click(() => {
        $(".overlayNav").css({ "background-color": "#00000066" });
        $(".quickMessagePopUp").css({ "bottom": "-10%" }).show(300);
    });

    // Close on Click 'x' button
    $('#closeQuickMessagePopUp').click(() => {
        $(".quickMessagePopUp input[type='text']").val("");
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

function activeProfileMenu() {
    $(".profileFooter header a.photos").click((e) => {
        $(".profileFooter header a span").removeClass('active');
        $(".profileFooter header a.photos span").addClass('active');
    });

    $(".profileFooter header a.shop").click((e) => {
        $(".profileFooter header a span").removeClass('active');
        $(".profileFooter header a.shop span").addClass('active');
    });
} activeProfileMenu();


function displayOtherForms() {
    var dropdownToggleBtn = $("#dropdownToggleBtn");
    var otherForms = $(".OtherForms");
    otherForms.slideUp();
    dropdownToggleBtn.click(() => {
        otherForms.slideToggle();
    });
} displayOtherForms();

function onclickWindow(clickedBtn, containerClass) {
    // Close the dropdown menu if the user clicks outside of it
    window.onclick = function (e) {
        // Close the dropdown menu if the user clicks outside of it
        if (e.target != clickedBtn) {

            var dropdowns = document.getElementsByClassName(containerClass);
            var i;
            for (i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    }
} 

function showModal() {
    // Get the modal
    var modal = document.getElementById('myModal');

    // Get the button that opens the modal
    var btn = document.getElementById("myBtn");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks the button, open the modal
    btn.onclick = function () {
        modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }

    // // When the user clicks anywhere outside of the modal, close it
    // window.onclick = function (event) {
    //     if (event.target == modal) {
    //         modal.style.display = "none";
    //     }
    // }
}

function showDropdown() {
    // DROPDOWN CODE...
    /* When the user clicks on the button, 
    toggle between hiding and showing the dropdown content */
    $("#dropBtn").click((e) => {
        e.preventDefault();
        dropdownFunction()
    });

    var dropBtn = document.getElementById("dropBtn").children.item(0);
    var dropdownContent = document.getElementById("dropdownContent");
    function dropdownFunction() {
        dropdownContent.classList.toggle("show");
        // Close any popUp, by hitting 'Esc' button
        $('body').keyup((e) => {
            if (e.keyCode == 27) { // Escape key
                dropdownContent.classList.remove("show");
            }
        });
    }

    // Close the dropdown menu if the user clicks outside of it
    onclickWindow(dropBtn, "dropdownContent");
}
showDropdown();
showModal();
