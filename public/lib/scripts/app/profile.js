function displaymoreDetails() {
    let dropdownToggleBtn = $("#dropdownToggleBtn");
    let moreDetails = $(".moreDetails");
    moreDetails.slideUp();
    dropdownToggleBtn.click(() => {
        moreDetails.slideToggle();
    });
}
displaymoreDetails();

// Multiple images preview engine in browser
function addPhotosPreview(input, placeToInsertImagePreview) {
    if (input.files) {
        var filesAmount = input.files.length;

        for (var i = 0; i < filesAmount; i++) {
            var reader = new FileReader();

            reader.onload = function (event) {
                $($.parseHTML("<img>"))
                    .attr({
                        src: event.target.result,
                        style: "margin: auto .2%; max-width: 50%;",
                        id: "selectedPhoto",
                        alt: "Photo"
                    })
                    .prependTo(placeToInsertImagePreview);
            };

            reader.readAsDataURL(input.files[i]);
        }
    }
};

function showPhotosSelected() {
    // Photos preview
    $("#addPhotos").on("change", function () {
        if (this.files.length != 0) {
            if (this.files.length <= 5) {
                $("div.addPhotosCon .info center").html('');
                // Empty displayCon, before changing it's value
                $("div.addPhotosCon .info .displayCon div#container").html("");
                $("div.addPhotosCon .info .displayCon div#container").removeClass("hide").html(
                    addPhotosPreview(this, "div.addPhotosCon .info .displayCon div#container")
                );
            } else {
                alert("warning", "Warning", "Only, 5 photos are permitted!");
            }
        } else {
            var previewInfo = `
            <div style="text-align: center; width: 100%; padding-top: 72px; height: 232px;">
            <h4 style="font-weight: lighter;">Click &nbsp;<b>+</b>&nbsp; to
            select your photos</h4>
            <p style="margin-bottom: 10px; display: block; color: #ccc;">Note:
            To upload photos, select all images at once.</p>
            </div>
            `;
            $("div.addPhotosCon .info .displayCon").html('').addClass("hide");
            $("div.addPhotosCon .info center").html(previewInfo);
        }
    });
}
showPhotosSelected();

function cropImage() {
    const selectedPhoto = document.getElementById('selectedPhoto');
    const cropper = new Cropper(selectedPhoto, {
        aspectRatio: 1 / 1,
        crop(event) {
            console.log(event.detail.x);
            console.log(event.detail.y);
            console.log(event.detail.width);
            console.log(event.detail.height);
            console.log(event.detail.rotate);
            console.log(event.detail.scaleX);
            console.log(event.detail.scaleY);
        },
    });
}

$("#like").on('click', function(e){
    let value = $(this).data('username');

    $.ajax({
        url: '/app/encounters/addLike',
        data: {
            username: value,
            type: 'like',
        },
        method: "GET",
        success: (response) => {
            mySnackbar(response.data.message)
        },
    });
})

$("#favourite, #favourite-dropdown").on('click', function(e){
    let value = $(this).data('username');

    $.ajax({
        url: '/app/encounters/addFavourite',
        data: {
            username: value,
        },
        method: "GET",
        success: (response) => {
            mySnackbar(response.data.message)
        },
    });
})