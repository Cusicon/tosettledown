function displaymoreDetails() {
    let dropdownToggleBtn = $("#dropdownToggleBtn");
    let moreDetails = $(".moreDetails");
    moreDetails.slideUp();
    dropdownToggleBtn.click(() => {
        moreDetails.slideToggle();
    });
}
displaymoreDetails();