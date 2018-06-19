var selected_date;
var SR_array = [];

$(document).ready(function () {
    $('#effort_entries_list').hide();
    $('#effort_entry_form').hide();

    const eff_date_sel = document.querySelector('#eff_date_sel');


    eff_date_sel.addEventListener('change', () => {
        console.log('Effort Date Changed');
        if (eff_date_sel.value != "" && typeof (eff_date_sel.value) == "string") {
            $("#sr").hide();
            $('#effort_entry_form').show();
            // console.log(selectDate.options[selectDate.selectedIndex].value);
            selected_date = eff_date_sel.value;
            $("#selected_date_td").html(`${selected_date}`);
            fetchTSEntries(user.name, eff_date_sel.value);
            fetchTasks(user.name, eff_date_sel.value)
        }
    });


});

function fetchTasks(name, date) {
    showLoaderFor('effort_entry_form');
    console.log('fetchTasks' + 'triggerd');
    $.ajax({
        url: "/fetchTasks",
        type: "POST",
        data: {
            username: name,
            date: date
        },
        success: function (res, status, xhr, $form) {
            console.log('fetchTasks:success' + 'triggerd');
            // console.log(res);
            addTasksToSelect(res);
        },
        error: function (e) {

        }
    });
}

function addTasksToSelect(res) {
    tasks = res;
    // console.log(tasks);

    SR_array = [];
    $("#selectTask").children('option:not(:first)').remove();
    tasks.rows.forEach(SR => {
        SR_array.push(SR);
        $("#selectTask").append('<option value="' + SR.sr_number + '">' + SR.sr_number + '</option>');
    });
    // console.log(SR_array);
    removeLoaderFor('effort_entry_form');

}

function fetchTSEntries(name, date) {
    showLoaderFor('effort_dt_sel');
    console.log('fetchTSEntries ' + 'triggerd');
    $.ajax({
        url: "/fetchTSEntries",
        type: "POST",
        data: {
            username: name,
            date: date
        },
        success: function (res, status, xhr, $form) {
            console.log('fetchTSEntries:success' + 'triggerd');
            // console.log(res);
            addTSEntriesToList(res);
        },
        error: function (e) {

        }
    });
}

function addTSEntriesToList(res) {
    tasks = res;
    // console.log(tasks);

    TSE_array = [];
    $("#effortEntriesListTable tbody").children().remove();
    tasks.rows.forEach(TSE => {
        TSE_array.push(TSE);
        var row_id = random_id();
        markup = '<tr row_id="' + row_id + '">' +
            '<td><div class="row_SR_Num" col_name="srNumber">' + TSE.srNumber + '</td>' +
            '<td><div class="row_data" edit_type="click" col_name="effortHrs">' + TSE.effortHrs + '</td>'
            // show edit button
            +
            '<td><span class="btn_edit"><a href="#" class="btn btn-link " row_id="' + row_id + '" > Edit</a>' + '</span>'
            // Show save,cancel and delete buttons if edit is clicked 
            +
            '<span class="btn_save"><a href="#" class="btn btn-link"  row_id="' + row_id + '"> Save</a> |' + '</span>' +
            '<span class="btn_cancel"><a href="#" class="btn btn-link"  row_id="' + row_id + '"> Cancel</a> |' + '</td></span>' +
            '</tr>'
        $("#effortEntriesListTable tbody").append(markup);
        $(document).find('.btn_save').hide();
        $(document).find('.btn_cancel').hide();
    });

    // console.log(SR_array);
    removeLoaderFor('effort_dt_sel');

    $('#effort_entries_list').show();
}

$(document).on('click', '.btn_edit', function (event) {
    event.preventDefault();
    var tbl_row = $(this).closest('tr');

    var row_id = tbl_row.attr('row_id');

    tbl_row.find('.btn_save').show();
    tbl_row.find('.btn_cancel').show();

    //hide edit button
    tbl_row.find('.btn_edit').hide();

    //make the whole row editable
    tbl_row.find('.row_data')
        .attr('contenteditable', 'true')
        .attr('edit_type', 'button')
        .addClass('bg-warning')
        .css('padding', '3px')

    //--->add the original entry > start
    tbl_row.find('.row_data').each(function (index, val) {
        //this will help in case user decided to click on cancel button
        $(this).attr('original_entry', $(this).html());
    });
    //--->add the original entry > end

});
//--->button > edit > end

//--->button > cancel > start	
$(document).on('click', '.btn_cancel', function (event) {
    event.preventDefault();

    var tbl_row = $(this).closest('tr');

    var row_id = tbl_row.attr('row_id');

    //hide save and cacel buttons
    tbl_row.find('.btn_save').hide();
    tbl_row.find('.btn_cancel').hide();

    //show edit button
    tbl_row.find('.btn_edit').show();

    //make the whole row uneditable
    tbl_row.find('.row_data')
        // .attr('edit_type', 'click')	
        .attr('contenteditable', 'false')
        .removeClass('bg-warning')
        .css('padding', '')

    tbl_row.find('.row_data').each(function (index, val) {
        $(this).html($(this).attr('original_entry'));
    });
});
//--->button > cancel > end


//--->save whole row entery > start	
$(document).on('click', '.btn_save', function (event) {
    event.preventDefault();
    var tbl_row = $(this).closest('tr');

    var row_id = tbl_row.attr('row_id');


    //hide save and cacel buttons
    tbl_row.find('.btn_save').hide();
    tbl_row.find('.btn_cancel').hide();

    //show edit button
    tbl_row.find('.btn_edit').show();


    //make the whole row editable
    tbl_row.find('.row_data')
        // .attr('edit_type', 'click')	
        .attr('contenteditable', 'false')
        .removeClass('bg-warning')
        .css('padding', '')

    //--->get row data > start
    var arr = {};
    tbl_row.find('.row_data').each(function (index, val) {
        var col_name = $(this).attr('col_name');
        var col_val = $(this).html();
        arr[col_name] = col_val;
    });
    //--->get row data > end

    tbl_row.find('.row_SR_Num').each(function (index, val) {
        var col_name = $(this).attr('col_name');
        var col_val = $(this).html();
        arr[col_name] = col_val;
    });


    //use the "arr"	object for your ajax call
    $.extend(arr, {
        username: user.name
    });
    $.extend(arr, {
        date: selected_date
    });
    console.log(arr);

    //out put to show
    show_alert(JSON.stringify(arr), 'success', 2000)
    // $('.post_msg').html('<pre class="bg-success">' + JSON.stringify(arr, null, 2) + '</pre>');




});
//--->save whole row entery > end