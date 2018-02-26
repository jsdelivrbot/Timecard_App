//all SR related logic is present under this file

var SR_array = [];
var date_tot_array = [];
var effort_array = [];
// const loader = $('<img class="containerLoading" src="/images/loader.gif">');
const loader = $('<div class="containerLoading"> </div>');


$(document).ready(function () {
    // console.log(user.name);
    populateDateSelector();
    const selectDate = document.querySelector('#selectDate');
    const selectTask = document.querySelector('#selectTask');
    $("#sr").hide();
    $('#summaryPanel').hide();

    selectDate.addEventListener('change', () => {
        // console.log('change'+'triggerd');
        if (selectDate.selectedIndex > 0) {
            $("#sr").hide();
            // console.log(selectDate.options[selectDate.selectedIndex].value);
            fetchTasks(user.name, selectDate.options[selectDate.selectedIndex].value);
        }
    });

    selectTask.addEventListener('change', () => {
        if (selectTask.selectedIndex > 0) {
            var SR = SR_array[selectTask.selectedIndex - 1];
            // console.log(SR);
            showSRInfo(SR);
        } else {
            $("#sr").hide();
        }
    });

    $('#save').on('click', handleSave);
    
    $('#submitForDates').on('click', handleSubmit);
});

function handleSubmit() {
    showLoaderFor('effort_entry_form');
    showLoaderFor('summaryPanel');
    console.log('submit_TS' + 'triggerd');
    $.ajax({
        url: "/submit_TS",
        type: "POST",
        data: {
            username : user.name,
            effort : effort_array
        },
        success: function (res, status, xhr, $form) {
            console.log('submit_TS : success' + 'triggerd');
            // console.log(res);
            cleanup(res);
        },
        error: function (e) {
            alert('There was an error while recording your timesheets.\n Please connect with the admin to resolve the issue'); 
        }
    });
}

function cleanup(res = {rowCount : 0}) {
    if(res.rowCount == effort_array.length){
        effort_array = [];
        $("#effortSummaryTable tbody").html('');
        refresh_totals();
        removeLoaderFor('effort_entry_form');
        removeLoaderFor('summaryPanel');
        if (effort_array.length > 0) {
            $('#summaryPanel').show();
        } else {
            $('#summaryPanel').hide();
        }
        alert('Thankyou- Your Timesheet entries have been successfully recorded');
    }else{
        alert('There was an error while recording your timesheets.\n Please connect with the admin to resolve the issue'); 
    }
}

function validateForm(date, sr_number, hrs_spent) {
    if (date == null || date == 0) {
        return false;
    }

    if (sr_number == 'Select Task') {
        return false;
    }

    if (hrs_spent == NaN || hrs_spent == 0 || hrs_spent < 0 || hrs_spent =='') {
        return false;
    }
    return true;
}

function handleSave() {

    const date = $('#selectDate option:selected').val();
    const sr_number = $('#selectTask option:selected').val();
    const hrs_spent = $('#hrsTmst').val();
    if(!validateForm(date, sr_number, hrs_spent)){
        return false;
    }
    effort = {
        date: `${date}`,
        sr_number: `${sr_number}`,
        hrs_spent: parseFloat(hrs_spent)
    };
    effortArray_pushUpdate(effort);
    effortSummary_update(effort);
    refresh_totals();
    if (effort_array.length > 0) {
        $('#summaryPanel').show();
    } else {
        $('#summaryPanel').hide();
    }
}

function refresh_totals() {
    // date_tot_array = effort_array.reduce((date_tot,effort)=>{
    //     if(!date_tot[effort.date]){
    //       date_tot[effort.date]=0;
    //     }
    //     date_tot[effort.date] += effort.hrs_spent;
    //     return date_tot;
    //   },{});
    
    date_tot_array = effort_array.reduce((tot_array,effort)=>{
        //check if the given array has the total for given effort date 
        total = tot_array.find((date)=> date[`date`] == effort.date);

        //if not
        if(!total){
            //then initialise the new total
            total = {};
            total[`date`]=effort.date;//set the date to the date of given effort object
            total[`total`]=effort.hrs_spent; //set the total hrs to that of given effort object
            total[`minFlag`]=  (parseFloat(effort.hrs_spent) >= 8) ? true : false;
            tot_array.push(total); //push the newly formed total to the array
        }else{
            //if total was found then we add the hrs from given effort object to the previous total
            total.total +=  effort.hrs_spent;
            total.minFlag =  (parseFloat(total.total) >= 8) ? true : false;
        } 
        // new_tot = tot_array.find((tot)=> tot[`date`] == effort.date);
        
        return tot_array;
      },[]);

    //   console.log(date_tot_array);
      $('#dateSummaryTable tbody').html('');
      
      date_tot_array.forEach((date_tot)=>{
          let markup = `<tr><td>${date_tot.date}</td><td>${date_tot.total}
          <span class="pull-right text-muted">${date_tot.minFlag? '': '(Must be 8 or more)'}</span></td></tr>`;
          $('#dateSummaryTable tbody').append(markup);
      });

      toggleSubmit()

    //   date_totals_markup = JSON.stringify(date_tot_array);
    //   date_totals_markup = date_totals_markup.replace('{','<tr><td>');
    //   date_totals_markup = date_totals_markup.replace(':','</td><td>');
    //   date_totals_markup = date_totals_markup.replace(',','</td><tr>');
    //   date_totals_markup = date_totals_markup.replace('}','</td></tr>');
    //   date_totals_markup = date_totals_markup.replace('"','');
      
    //   $('#dateSummaryTable tbody').html('');
    //   $('#dateSummaryTable tbody').append(date_totals_markup);


}

function toggleSubmit(){
    date_sum_chk_flg = date_tot_array.reduce((flg = true, total)=>{
        // console.log(flg);
        // console.log(total.minFlag);

        flg = flg && total.minFlag;
        return flg;
    },flg=true);
    console.log(date_sum_chk_flg);
    if(date_sum_chk_flg){
        $("#submitForDates").prop('disabled', false);
    }else{
        $("#submitForDates").prop('disabled', true);
    }

}

function effortArray_pushUpdate(effortPassed) {
    effortIndex = effort_array.findIndex((effort) => (effort.sr_number == effortPassed.sr_number && effort.date == effortPassed.date));
    if (effortIndex === -1) {
        effort_array.push(effortPassed);
    } else if (effortIndex > -1) {
        effort_array[effortIndex].hrs_spent = parseFloat(effortPassed.hrs_spent);
    }
}

function effortSummary_update(effort) {
    let summaryTableRows = document.querySelectorAll('#effortSummaryTable tbody tr');

    let newRowInd = true;

    summaryTableRows.forEach((row) => {

        if (row.cells[0].innerText === `${effort.date}` && row.cells[1].innerText === `${effort.sr_number}`) {
            row.cells[2].innerText = effort.hrs_spent;
            newRowInd = false;
        }
    });

    if (newRowInd) {
        const markup = `<tr><td>${effort.date}</td><td>${effort.sr_number}</td><td>${effort.hrs_spent}</td><td><button type="button" class="btn btn-primary btn-sm" id='clearTask' onClick='deleteRow(this)'>Delete</button></td></tr>`;
        $("#effortSummaryTable tbody").append(markup);
    }

}

function deleteRow(rowElement) {
    var rowIndex = rowElement.parentNode.parentNode.rowIndex;
    var nodeIndex = rowIndex - 1;

    let summaryTableRows = document.querySelectorAll('#effortSummaryTable tbody tr');
    let date = summaryTableRows[nodeIndex].cells[0].innerText;
    let sr_number = summaryTableRows[nodeIndex].cells[1].innerText;
    // console.log(date);
    // console.log(sr_number);
    let effortIndex = effort_array.findIndex((effort) => (effort.sr_number == sr_number && effort.date == date));
    effort_array.splice(effortIndex, 1);
    document.getElementById("effortSummaryTable").deleteRow(rowIndex);
    // toggleSubmit();
    refresh_totals();
    if (effort_array.length > 0) {
        $('#summaryPanel').show();
    } else {
        $('#summaryPanel').hide();
    }
}

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

function showSRInfo(SR) {
    // console.log(SR.sr_number);

    $("#sr_number").text(SR.sr_number);
    $("#sr_status").text(`Status: ${SR.status}`);
    $("#sr_info").text(SR.info);
    $("#sr_user").text(`User : ${SR.user}`);
    $("#sr_estimate").text(`Estimate : ${SR.estimate} Hrs`);
    $("#sr_hrs_used").text(`Hrs Used : ${SR.used} Hrs`);
    const percent_progress = Math.floor((SR.used / SR.estimate) * 100);
    $("#sr_percent_complete").text(`${percent_progress} % used`);
    $("#sr_progress").attr('aria-valuenow', percent_progress);
    if (SR.status === 'OPEN') {
        $("#sr_progress").addClass('progress-bar-success');
        $("#sr_progress").removeClass('progress-bar-danger');
    } else {
        $("#sr_progress").addClass('progress-bar-danger');
        $("#sr_progress").removeClass('progress-bar-success');
    }
    $("#sr_progress").attr("style", `width: ${percent_progress}%`);
    $("#sr_progress_fallback").text(`${percent_progress}% used (${SR.status})`);
    //show SR_INFO well
    $("#sr").show();
}

function populateDateSelector() {
    const startDate = moment().subtract(3, 'days'); //.format("MMM Do YY");
    const endDate = moment();

    var day = startDate;

    do {
        const dateOption = `<option value="${day.format("YYYY-M-D")}">${day.format("MMM Do YY")}</option>`
        $("#selectDate").append(dateOption);
        day = day.add(1, 'd');

    }
    while (day <= endDate);

}

function showLoaderFor(elementId) {
    $(`#${elementId}`).append(loader.fadeIn(100));
}

function removeLoaderFor(elementId) {
    $(`#${elementId} .containerLoading`).fadeOut(100, function () {
        $(this).remove();
    });
}