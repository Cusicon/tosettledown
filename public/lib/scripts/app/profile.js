// Multiple images preview engine in browser
function addPhotosPreview(input, placeToInsertImagePreview) {
    if (input.files) {
        let reader = new FileReader();
        reader.onload = function (event) {
            $('.addPhotosCon').css('padding-right', '0px')
            $(placeToInsertImagePreview).html($($.parseHTML("<img>"))
                .attr({
                    src: event.target.result,
                    style: `width: 100%; max-height: ${window.outerHeight - 50}px`,
                    id: "selectedPhoto",
                    class: "cropper-img-holder",
                    alt: "Photo"
                })
            ).removeClass("hide");
            initCropper('.cropper-img-holder');
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function initCropper(imageHolder) {
    let image = $(imageHolder)[0];
    let cropper = new Cropper(image, {
        aspectRatio: 1 / 1,
        // autoCropArea: 0,
        minCropBoxWidth: "400",
        minCropBoxHeight: "400",
        minCanvasWidth: "400",
        minCanvasHeight: "400",
        guides: false,
        highlight: false,
        cropBoxResizable: false,
        crop: function (e) {
        }
    });

    // On crop button clicked
    $('#crop_button').on('click', function (e) {
        e.preventDefault();
        let fileData = document.getElementById('addPhotos').files.item(0);
        if(cropper && fileData){
            let imgDataUrl = cropper.getCroppedCanvas().toDataURL(fileData.type, 60);

            let formData = {
                base64Data :imgDataUrl,
                name :fileData.name,
                mimetype :fileData.type,
                size :fileData.size,
            };

            $.ajax('/app/profile/addPhotos', {
                method: "POST",
                data: formData,
                beforeSend: () => {
                    $('#crop_button').html(`<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>`)  ;
                },
                success(response) {
                    $("div.addPhotosCon").addClass('hide').modal('hide');
                    mySnackbar(response.message)
                    appendImageToDOM(response.data.photo, 'ul.images-holder');
                    cropper = null;
                    $('#crop_button').html(`Done`);
                },
                error(err) {
                    mySnackbar(err.message);
                    $('#crop_button').html(`Done`);
                },
            });
        }else{
            mySnackbar('Select a photo to upload first');
        }
        return false;
    });
}

function appendImageToDOM(photo, container) {
    let html = `<li class="col-md-4 col-sm-6">
                    <a href="javascript:void(0);" data-toggle="modal" data-target=".displayPhotosCon"
                        style="background-image: url('${photo.location}'); width: 100%;"
                        data-image-id="${photo._id}"
                        class="userPhoto"></a>
                </li>`;

    if ($('.no-picture-message').length > 0) {
        $('.image-holder-container').html(`<ul class="images-holder row"> </ul>`)
    }
    $(container).prepend(html);
    resetCropBox();
}

function resetCropBox(){
    let previewInfo = `
                <div style="text-align: center; background-color: #54535214;">
                    <div
                        style="text-align: center; width: 100%; padding-top: 56px; height: 232px;">
                        <h4 style="font-weight: lighter;">Click &nbsp;<b>+</b>&nbsp; to
                            select your photos</h4>
                        <p style="margin-bottom: 10px; display: block;"
                           class="text-menu-dark">Note:
                            To upload photos, select one at a time.</p>
                    </div>
                </div>
             `;
    $("div.addPhotosCon .info .displayCon div#container").html(previewInfo).removeClass("hide");
}

$(document).on('ready', function () {
    if ($('.num_photo').length > 0) {
        alert("/lib/img/logo/favicon.png", "Must upload a photo", "Sorry, you are required to upload at least one photo!", [null, "Upload photo"], () => {
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

    $("#addPhotos").on("change", function () {
        if (this.files.length !== 0) {
            if (this.files.length <= 5) {
                addPhotosPreview(this, "div.addPhotosCon .info .displayCon div#container")
            } else {
                alert("warning", "Warning", "Only, 5 photos are permitted!");
            }
        } else {
            resetCropBox();
        }
    });

    $('.addPhotoBtn').on('click', e => {
        $('#addPhotos').trigger('click');
        $('.addPhotosCon').modal({
            backdrop: 'static',
            keyboard: false
        });
        e.preventDefault();
    })

    $('.image-upload-action-holder #cancel_button').on('click', function () {
        $("div.addPhotosCon").addClass('hide').modal('hide');
        resetCropBox();
    });

    $("#like").on('click', function () {
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

    $("#favourite, #favourite-drpdown").on('click', function () {
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
        // let image_link = element.css('background-image').replace('url(','').replace(')','').replace(/"/gi, "");
        let image_link = element.css('background-image')
        image_link = image_link.slice(5, image_link.length - 2);
        let image_id = element.data('image-id');
        if ($('#displayImage').length > 0) {
            $('#displayImage').attr('src', image_link)
        }
        if ($('#setAvatarBtn').length > 0) {
            $('#setAvatarBtn').attr('data-image-id', image_id)
        }
        $('.displayPhotosCon').modal({
                backdrop: 'static',
                keyboard: false
        });
    })

    $(document).on('click', '.setAvatarBtn' , function(e) {
        e.preventDefault();
        let element = $(this);
        let image_id = element.attr('data-image-id');

        $.ajax({
            url: `/app/profile/avatar/update`,
            method: "POST",
            data :{photo_id : image_id},
            beforeSend: () => {
                $('#setAvatarBtn').html(`<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>`)  ;
            },
            success: function(response) {
                if(response.status === 'success'){
                    let location = response.data.photo.location;
                    setTimeout(() => {
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
                        mySnackbar(response.message)
                        $('#setAvatarBtn').html(`Set as Display Picture`)
                    }, 1000)
                }else{
                    mySnackbar(response.message)
                }
            },
            error: function () {
                mySnackbar('Error Occur While Updating Profile Picture');
                $('#setAvatarBtn').html(`Set as Display Picture`)
            }
        });
    })
});