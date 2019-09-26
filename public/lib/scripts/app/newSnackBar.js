function mySnackbar(content, type = null, buttons = [] || null, buttonAction = null) {
    type = type.toLowerCase();

    // Get the snackbar DIV
    let __snackbar = document.getElementById("snackbar")
    let success = '<i class="mdi mdi-check-circle"></i>';
    let error = '<i class="mdi mdi-close-circle"></i>';
    let warning = '<i class="typcn typcn-warning"></i>';
    let info = '<i class="mdi mdi-information"></i>';
    let tsd = '<img src="/lib/img/logo/favicon.png" width="25px" alt="Tosettledown">';


    // Add the "show" class to DIV
    __snackbar.className = "show-snackbar";

    switch (type) {
        case 'success':
            __snackbar.innerHTML = `
            <div style="vertical-align: middle;">
                ${type ? `<span class="float-left text-success" style="padding: 0px 5px 0px 25px; font-size: 25px;" id="type">${success}</span>` : '' }
                <span class="text-center" id="contents">${content}</span>
                ${buttons ? '<span class="text-right" id="buttons"></span>' : '' }
            </div>`;
            break;

        case 'error':
            __snackbar.innerHTML = `
            <div style="vertical-align: middle;">
                ${type ? `<span class="float-left text-danger" style="padding: 0px 5px 0px 25px; font-size: 25px;" id="type">${error}</span>` : '' }
                <span class="text-center" id="contents">${content}</span>
                ${buttons ? '<span class="text-right" id="buttons"></span>' : '' }
            </div>`;
            break;

        case 'warning':
            __snackbar.innerHTML = `
            <div style="vertical-align: middle;">
                ${type ? `<span class="float-left text-warning" style="padding: 0px 5px 0px 25px; font-size: 25px;" id="type">${warning}</span>` : '' }
                <span class="text-center" id="contents">${content}</span>
                ${buttons ? '<span class="text-right" id="buttons"></span>' : '' }
            </div>`;
            break;

        case 'info':
            __snackbar.innerHTML = `
            <div style="vertical-align: middle;">
                ${type ? `<span class="float-left text-info" style="padding: 0px 5px 0px 25px; font-size: 25px;" id="type">${info}</span>` : '' }
                <span class="text-center" id="contents">${content}</span>
                ${buttons ? '<span class="text-right" id="buttons"></span>' : '' }
            </div>`;
            break;

        default:
            __snackbar.innerHTML = `
            <div style="vertical-align: middle;">
                ${type ? `<span class="text-left" id="type">${tsd}</span>` : '' }
                <span class="text-center" id="contents" style="padding: 0px 10px;">${content}</span>
                ${buttons ? '<span class="text-right" id="buttons"></span>' : '' }
            </div>`;
            break;
    }

    // After 3 seconds, remove the show class from DIV
    // setTimeout(function () {
    // __snackbar.className = __snackbar.className.replace("show-", "");
    // }, 3000);
}