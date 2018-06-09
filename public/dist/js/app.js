
// const loader = $('<img class="containerLoading" src="/images/loader.gif">');
const loader = $('<div class="containerLoading"> </div>');




function showLoaderFor(elementId) {
    $(`#${elementId}`).append(loader.fadeIn(100));
}

function removeLoaderFor(elementId) {
    $(`#${elementId} .containerLoading`).fadeOut(100, function () {
        $(this).remove();
    });
}