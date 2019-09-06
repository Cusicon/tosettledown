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

$("#favourite, #favourite-drpdown").on('click', function(e){
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

$(document).on('ready', function (e) {
    if($('.nophoto').length > 0){
        alert("/lib/img/logo/favicon.ico", "Must upload a photo", "Sorry, you are required to upload at least one photo!", [null,"Upload photo"], () => {
            $('#addPhotosBtn').trigger('click');
        });
    }

    $('#editProfileForm').on('submit',  function (e) {
        e.preventDefault();

        console.log($(this).serialize())
    })

    $('.userPhoto').on('click', function (e) {

        let element = $(this);
        let image_link = element.css('background-image').replace('url(','').replace(')','').replace(/\"/gi, "");
        let image_id = element.data('image-id');
        if($('#displayImage').length > 0){
            console.log(element)
            $('#displayImage').attr('src', image_link)
        }
        if($('#setAvatarBtn').length > 0){
            $('#setAvatarBtn').attr('data-image-id', image_id)
        }
    })

    $('#setAvatarBtn').on('click', function (e) {
        e.preventDefault();
        let element = $(this)
        let image_id = element.data('image-id')

        console.log(image_id)
        /* Ajax Request For Updating Profile Picture*/
        $.ajax({
            url: `/app/profile/avatar/update`,
            method: "POST",
            data :{photo_id : image_id},
            success: function(response) {
                console.log(response);

                if(response.status === 'success'){
                    mySnackbar(response.message)
                    let location = response.photo.location;

                    if($('.profileImg').length > 0){
                        $('.profileImg').each(function () {
                            $(this).css('background-image', `url('${location}')`);
                        })
                    }
                    if($('.profileImage').length > 0){
                        $('.profileImage').each(function () {
                            $(this).css('background-image', `url('${location}')`);
                        })
                    }
                }else{
                    mySnackbar(response.message)
                }
            },
            error: function () {
                mySnackbar('Error Occur While Updating Profile Picture');
            }
        });


    })







})