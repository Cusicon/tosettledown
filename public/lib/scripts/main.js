// Close any popUp, by hitting 'Esc' button
function closeOnEscBtn() {
    // Close on Hit 'Esc' button
    $('body').keyup((e) => {
        if (e.keyCode == 27) { // Escape key
            $(".popUp textarea").val("");
            $(".overlayNav").css({
                "background-color": "transparent"
            });
            $(".popUp").css({
                "bottom": "-50%"
            }).hide();
        }
    });
}
closeOnEscBtn();

// show quickMessagePopUp
function quickMessagePopUp() {
    var sendAMessageBtn = $("#sendAMessage");
    sendAMessageBtn.click(() => {
        $(".overlayNav").css({
            "background-color": "#00000066"
        });
        $(".quickMessagePopUp").css({
            "bottom": "-10%"
        }).show(300);
    });

    // Close on Click 'x' button
    $('#closeQuickMessagePopUp').click(() => {
        $(".quickMessagePopUp textarea").val("");
        $(".overlayNav").css({
            "background-color": "transparent"
        });
        $(".quickMessagePopUp").css({
            "bottom": "-50%"
        }).hide(500);
    });
}
quickMessagePopUp();

// navigate Images in Encounters
function navigateImages() {
    $('div.imageWindow').keyup((e) => {
        if (e.keyCode == 37) { // Left Arrow
            alert("Left Arrow");
        } else if (e.keyCode == 39) { // Right Arrow
            alert("Right Arrow");
        }
    });
}
navigateImages();

function activeProfileMenu() {
    $(".profileFooter header a.photos").click((e) => {
        $(".profileFooter header a span").removeClass('active');
        $(".profileFooter header a.photos span").addClass('active');
    });

    $(".profileFooter header a.shop").click((e) => {
        $(".profileFooter header a span").removeClass('active');
        $(".profileFooter header a.shop span").addClass('active');
    });
}
activeProfileMenu();

function displaymoreDetails() {
    var dropdownToggleBtn = $("#dropdownToggleBtn");
    var moreDetails = $(".moreDetails");
    moreDetails.slideUp();
    dropdownToggleBtn.click(() => {
        moreDetails.slideToggle();
    });
}
displaymoreDetails();

// Encounter Displaying and Shuffling
function encounterDisplayingAndShuffling() {
    if (location.href.toLowerCase().includes("encounters")) {
        function activeProfileClass() {
            var elem = $(".statusBar a").get(0);
            return $(elem).addClass("activeProfile hasStories");
        }
        activeProfileClass();
    }

    function getUsersDetails() {
        $.ajax({
            url: "/app/encounters/getUsers",
            method: "GET",
            success: (users) => {
                var usersDetails = users;
                console.log(usersDetails);

            },
            
        });
    }

    function displayUserDetails() {
        if (location.href.toLowerCase().includes("encounters")) {
            var activeUserValue;
            activeUserValue = activeProfileClass().context.dataset; // collected all value from the active user.
            // Assign values to the variables
            var fullname = activeUserValue.fullname;
            var username = activeUserValue.username;
            var age = activeUserValue.age;
            var bio = activeUserValue.bio;
            var height = activeUserValue.height;
            var language = activeUserValue.language;
            var _location = activeUserValue.location;
            var userDirectorieslocation = activeUserValue.userDirectorieslocation;

            // Assign variables to html tags
            $("span#fullname").text(`${fullname}`);
            $("#age").text(`${age}`);
            $("#username").text(`@${username}`).attr({
                "title": `Visit ${fullname}'s profile`,
                "href": `/app/profile/${username}`
            });
            $("#bio").html(`${bio}`);
            $("#height").html(`${height}`);
            $("#language").html(`${language}`);
            $("#location").html(`${_location}`);
            // console.log(`Values: \nBio: ${bio}\nHeight: ${height}\nLanguage: ${language}\n location: ${_location}`);
        }
        getUsersDetails();

    }
    displayUserDetails();
}
encounterDisplayingAndShuffling();

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

function showDropdown() {
    // DROPDOWN CODE...
    /* When the user clicks on the button, 
    toggle between hiding and showing the dropdown content */
    $("#dropBtn").click((e) => {
        e.preventDefault();
        dropdownFunction()
    });

    if (document.getElementById("dropBtn") != null) {
        var dropBtn = document.getElementById("dropBtn").children.item(0);
        var dropdownContent = document.getElementById("dropdownContent");
    }

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