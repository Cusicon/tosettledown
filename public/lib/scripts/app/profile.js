// Multiple images preview engine in browser
function addPhotosPreview(input, placeToInsertImagePreview) {
    if (input.files) {
        let reader = new FileReader();
        reader.onload = function (event) {
            $(placeToInsertImagePreview).html($($.parseHTML("<img>"))
                .attr({
                    src: event.target.result,
                    style: `max-width: 100%; max-height: 500px`,
                    id: "selectedPhoto",
                    class: "cropper-img-holder",
                    alt: "Photo"
                })
            ).removeClass("hide");
            initCropper('.cropper-img-holder')
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function initCropper(imageHolder) {
    let image = $(imageHolder)[0];
    let cropper = new Cropper(image, {
        aspectRatio: 1,
        crop: function (e) {

        }
    });

        // On crop button clicked
    $('#crop_button').on('click', function (e) {
        e.preventDefault();
        let fileData = document.getElementById('addPhotos').files.item(0);
        let imgDataUrl = cropper.getCroppedCanvas().toDataURL(fileData.type, 60);

        let formData = {};

        // Pass the image file name as the third parameter if necessary.
        formData.base64Data = imgDataUrl;
        formData.name = fileData.name;
        formData.mimetype = fileData.type;
        formData.size = fileData.size;

        $.ajax('/app/profile/addPhotos', {
            method: "POST",
            data: formData,
            success(response) {
                $("div.addPhotosCon").addClass('hide').modal('hide');
                mySnackbar(response.message)
                appendImageToDOM(response.data.photo, 'ul.images-holder');

            },
            error(err) {
                mySnackbar(err.message);
            },
        });
        return false;
    });
}

function appendImageToDOM(photo, container){
    let html = `<li class="col-md-4 col-sm-6">
                    <a href="javascript:void(0);" data-toggle="modal" data-target=".displayPhotosCon"
                        style="background-image: url('${photo.location}'); width: 280px;"
                        data-image-id="${photo._id}"
                        class="userPhoto"></a>
                </li>`;

    if($('.no-picture-message').length > 0){
        $('.image-holder-container').html(`<ul class="images-holder row"> </ul>`)
    }
    $(container).prepend(html);
}

$(document).on('ready', function () {
    if($('.nophoto').length > 0){
        alert("/lib/img/logo/favicon.png", "Must upload a photo", "Sorry, you are required to upload at least one photo!", [null,"Upload photo"], () => {
            $('#addPhotosBtn').trigger('click');
        });
    }

    (function displaymoreDetails() {
        let dropdownToggleBtn = $("#dropdownToggleBtn");
        let moreDetails = $(".moreDetails");
        moreDetails.slideUp();
        dropdownToggleBtn.click(() => {
            moreDetails.slideToggle();
        });
    })();

    (function showPhotosSelected() {
        // Photos preview
        $("#addPhotos").on("change", function () {
            if (this.files.length !== 0) {
                if (this.files.length <= 5) {
                    $("div.addPhotosCon .info center").html('');
                    // Empty displayCon, before changing it's value
                    $("div.addPhotosCon .info .displayCon div#container").html("");
                    addPhotosPreview(this, "div.addPhotosCon .info .displayCon div#container")
                    // $("div.addPhotosCon .info .displayCon div#container").removeClass("hide");
                } else {
                    alert("warning", "Warning", "Only, 5 photos are permitted!");
                }
            } else {
                let previewInfo = `
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
    })();

    $("#like").on('click', function(){
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

    $("#favourite, #favourite-drpdown").on('click', function(){
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

    $(document).on('click', '.userPhoto', function () {
        let element = $(this);
        let image_link = element.css('background-image').replace('url(','').replace(')','').replace(/"/gi, "");
        let image_id = element.data('image-id');
        if($('#displayImage').length > 0){
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
                if(response.status === 'success'){
                    mySnackbar(response.message)
                    let location = response.data.photo.location;

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
});