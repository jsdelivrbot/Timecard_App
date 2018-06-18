// const loader = $('<img class="containerLoading" src="/images/loader.gif">');





function showLoaderFor(elementId) {
    // $(`#${elementId}`).append(loader.fadeIn(100));
    loader = $(`<div class="containerLoading" id=${random_id()}> </div>`);
    $(`#${elementId}`).append(loader);
}

function removeLoaderFor(elementId) {
    $(`#${elementId} .containerLoading`).remove();
    // fadeOut(100, function () {
    //     $(this).remove();
    // });
}

function random_id() {
    var id_num = Math.random().toString(9).substr(2, 3);
    var id_str = Math.random().toString(36).substr(2);

    return id_num + id_str;
}


function show_alert(alert_string, alert_type, alert_timeout) {
    let alert_id = random_id();
    let alert_markup = `<div class='alert alert-${alert_type}' role='alert' id='${alert_id}'>
            <button type='button' class='close' data-dismiss='alert' aria-label='Close'>
            <span aria-hidden='true'>&times;</span></button>
            ${alert_string}
            </div>`;

            // $(`#${alert_id}`).fadeTo(0, 500).slideUp(500, function () {
                $('#alert_placeholder').append(alert_markup);
            // });
    

    window.setTimeout(function () {
        $(`#${alert_id}`).fadeTo(500, 0).slideUp(500, function () {
            $(this).remove();
        });
    }, alert_timeout);

}