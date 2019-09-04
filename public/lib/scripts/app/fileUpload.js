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
						style: "display: inline-block; margin: auto .2%;",
						height: 232,
						alt: "Photo"
					})
					.prependTo(placeToInsertImagePreview);
			};

			reader.readAsDataURL(input.files[i]);
		}
	}
};

// Photos preview
$("#addPhotos").on("change", function () {
	if (this.files.length != 0) {
		if (this.files.length <= 5) {
			$("div.addPhotosCon .info center")
				.html("")
				.hide();
			// Empty displayCon, before changing it's value
			$("div.addPhotosCon .info .displayCon div").html("");
			$("div.addPhotosCon .info .displayCon div").html(
				addPhotosPreview(this, "div.addPhotosCon .info .displayCon div")
			);
		} else {
			alert("warning", "Warning", "Only, 5 photos are permitted!");
		}
	} else {
		var PreviewInfo = `
				<center>
					<div style="margin: 10% 0%; text-align: center; width: 100%;">
						<h4 style="font-weight: lighter;">Click &nbsp;<b>+</b>&nbsp; to
							select your photos</h4>
						<p style="margin-bottom: 10px; display: block; color: #ccc;">Note:
							To upload photos, select all images at once.</p>
					</div>
				</center>
			`;
		$("div.addPhotosCon .info").html(PreviewInfo);
	}
});
