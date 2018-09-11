var selected_date;
var TASK_array = [];
var TSE_array = [];

$(document).ready(function () {
    console.log('begin');
    
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
            fetchTSEntries(user.name, user.sso, eff_date_sel.value);
            fetchTasks(user.name, user.sso, eff_date_sel.value)
        }
    });


});

function fetchTasks(name,sso, date) {
    showLoaderFor('effort_entry_form');
    console.log('fetchTasks' + 'triggerd');
    $.ajax({
        url: "/fetchTasks",
        type: "POST",
        data: {
            username: name,
            sso:sso,
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

    TASK_array = [];
    $("#selectTask").children('option:not(:first)').remove();
    tasks.rows.forEach(TASK => {
        TASK_array.push(TASK);
        $("#selectTask").append('<option value="' + TASK.task + '">' + TASK.task + '</option>');
    });
    // console.log(TASK_array);
    removeLoaderFor('effort_entry_form');

}

function fetchTSEntries(name,sso, date) {
    showLoaderFor('effort_dt_sel');
    showLoaderFor('effort_entries_list');
    console.log('fetchTSEntries ' + 'triggerd');
    $.ajax({
        url: "/fetchTSEntries",
        type: "POST",
        data: {
            username: name,
            sso:sso,
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
            '<td><div class="row_SR_Num" col_name="srNumber">' + TSE.task + '</td>' +
            '<td><div class="row_data" edit_type="click" col_name="effortHrs">' + TSE.effortHrs + '</td>'
            // show edit and delete button
            +
            '<td><span class="btn_edit"><a href="#" class="btn btn-link " row_id="' + row_id + '" > Edit</a> |' + '</span>' +
            '<span class="btn_delete"><a href="#" class="btn btn-link " row_id="' + row_id + '" > Delete</a>' + '</span>'
            // Show update,cancel buttons if edit is clicked 
            +
            '<span class="btn_save"><a href="#" class="btn btn-link"  row_id="' + row_id + '"> Update</a> |' + '</span>' +
            '<span class="btn_cancel"><a href="#" class="btn btn-link"  row_id="' + row_id + '"> Cancel</a> |' + '</td></span>' +
            '</tr>'
        $("#effortEntriesListTable tbody").append(markup);
        $(document).find('.btn_save').hide();
        $(document).find('.btn_cancel').hide();
    });

    // console.log(TASK_array);
    removeLoaderFor('effort_dt_sel');
    removeLoaderFor('effort_entries_list')

    $('#effort_entries_list').show();
}

function handleSave(user, effort) {
    showLoaderFor('effort_entry_form');
    showLoaderFor('effort_dt_sel');
    showLoaderFor('effort_entries_list');
    console.log('submit_TS' + 'triggerd');
    $.ajax({
        url: "/submit_TS",
        type: "POST",
        data: {
            username: user.name,
            sso:user.sso,
            effort: [effort]
        },
        success: function (res, status, xhr, $form) {
            console.log('submit_TS : success' + 'triggerd');
            // console.log(res);
            show_alert("Time entry saved", "success", 4000);
            removeLoaderFor('effort_entry_form');
            removeLoaderFor('effort_dt_sel');
            fetchTSEntries(user.name, user.sso, selected_date);
            clearTimeEntryForm();
        },
        error: function (e) {
            show_alert("There was an error while recording your timesheets.\n Please connect with the admin to resolve the issue", "danger", 4000);
        }
    });
}

function validateNewEntry(sr_number, hrs_spent) {

    if (sr_number == 'Select Task') {
        return false;
    }


    if (hrs_spent == NaN || hrs_spent == 0 || hrs_spent < 0 || hrs_spent > 24 || hrs_spent == '') {
        return false;
    }
    return true;
}

function clearTimeEntryForm() {
    $('#hrsTmst').val('');
    fetchTasks(user.name,user.sso, selected_date);
}

$(document).on('click', '.btn_edit', function (event) {
    event.preventDefault();
    var tbl_row = $(this).closest('tr');

    var row_id = tbl_row.attr('row_id');

    tbl_row.find('.btn_save').show();
    tbl_row.find('.btn_cancel').show();

    //hide edit button
    tbl_row.find('.btn_edit').hide();
    tbl_row.find('.btn_delete').hide();

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
    tbl_row.find('.btn_delete').show();

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


//--->update whole row entery > start	
$(document).on('click', '.btn_save', function (event) {
    event.preventDefault();
    var tbl_row = $(this).closest('tr');

    var row_id = tbl_row.attr('row_id');


    //hide save and cacel buttons
    tbl_row.find('.btn_save').hide();
    tbl_row.find('.btn_cancel').hide();

    //show edit button
    tbl_row.find('.btn_edit').show();
    tbl_row.find('.btn_delete').show();


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
        username: user.name,
        sso:user.sso,
        date: selected_date
    });
    console.log(arr);
    if (arr.effortHrs > 0 && arr.effortHrs<=24) {
        //out put to show
        // show_alert(JSON.stringify(arr), 'success', 4000)
        // $('.post_msg').html('<pre class="bg-success">' + JSON.stringify(arr, null, 2) + '</pre>');
        handleUpdate(arr);
    } else {
        show_alert('hours should be between 0 and 24', 'danger', 4000);
    }



});
//--->update whole row entery > end

//--->delete whole row entery > start	
$(document).on('click', '.btn_delete', function (event) {
    event.preventDefault();
    var tbl_row = $(this).closest('tr');

    changeConfimationModal("Are you sure to delete this time entry", "Delete", "Cancel");
    $('#confirm').modal({
            backdrop: 'static',
            keyboard: false
        })
        .one('click', '#confirm_btn_positive', function (e) {
            

            // var row_id = tbl_row.attr('row_id');

            //--->get row data > start
            var del_arr = {};
            tbl_row.find('.row_data').each(function (index, val) {
                var col_name = $(this).attr('col_name');
                var col_val = $(this).html();
                del_arr[col_name] = col_val;
            });
            //--->get row data > end

            tbl_row.find('.row_SR_Num').each(function (index, val) {
                var col_name = $(this).attr('col_name');
                var col_val = $(this).html();
                del_arr[col_name] = col_val;
            });


            //use the "del_arr"	object for your ajax call
            $.extend(del_arr, {
                username: user.name,
                sso:user.sso,
                date: selected_date
            });
            console.log(del_arr);

            //out put to show
            // show_alert(JSON.stringify(del_arr), 'success', 4000)
            // $('.post_msg').html('<pre class="bg-success">' + JSON.stringify(del_arr, null, 2) + '</pre>');

            handleDelete(del_arr);
        });


});
//--->delete whole row entry > end

//--->save new entry > start	
$(document).on('click', '#save', function (event) {
    event.preventDefault();
    const sr_number = $('#selectTask option:selected').val();
    const hrs_spent = $('#hrsTmst').val();

    if (!validateNewEntry(sr_number, hrs_spent)) {
        show_alert("Please select and enter valid task and hours spent.", "danger", 2000);
        return false;
    }

    effort = {
        date: `${selected_date}`,
        sr_number: `${sr_number}`,
        hrs_spent: parseFloat(hrs_spent)
    };
    console.log(user, [effort]);
    handleSave(user, effort);



});
//--->save  new entery > end

function handleUpdate(updated_effort) {
    showLoaderFor('effort_entry_form');
    showLoaderFor('effort_dt_sel');
    showLoaderFor('effort_entries_list');
    console.log('update_TS ' + 'triggerd');
    $.ajax({
        url: "/update_TS",
        type: "POST",
        data: {
            username: user.name,
            sso:user.sso,
            date: updated_effort.date,
            srNumber: updated_effort.srNumber,
            effortHrs: updated_effort.effortHrs
        },
        success: function (res, status, xhr, $form) {
            console.log('update_TS : success ' + 'triggerd');
            // console.log(res);
            show_alert("Time entry updated", "success", 4000);
            removeLoaderFor('effort_entry_form');
            removeLoaderFor('effort_dt_sel');
            fetchTSEntries(user.name, user.sso, selected_date);
            clearTimeEntryForm();
        },
        error: function (e) {
            show_alert("There was an error while updating your timesheets.\n Please Try agin or connect with the admin to resolve the issue", "danger", 4000);
        }
    });
}

function handleDelete(delete_effort) {
    showLoaderFor('effort_entry_form');
    showLoaderFor('effort_dt_sel');
    showLoaderFor('effort_entries_list');
    console.log('delete_TS ' + 'triggerd');
    $.ajax({
        url: "/delete_TS",
        type: "POST",
        data: {
            username: user.name,
            sso:user.sso,
            date: delete_effort.date,
            srNumber: delete_effort.srNumber
        },
        success: function (res, status, xhr, $form) {
            console.log('delete_TS : success ' + 'triggerd');
            // console.log(res);
            show_alert("Time entry deleted", "success", 4000);
            removeLoaderFor('effort_entry_form');
            removeLoaderFor('effort_dt_sel');
            fetchTSEntries(user.name,user.sso, selected_date);
            clearTimeEntryForm();
        },
        error: function (e) {
            console.log(e);
            show_alert("There was an error while deleting your time entry.\n Please retry again or connect with the admin to resolve the issue", "danger", 4000);
        }
    });
}