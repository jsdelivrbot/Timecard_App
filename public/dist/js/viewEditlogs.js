$(document).ready(function () {
   
    const show_eff_logs = document.querySelector('#show_eff_logs');
    const eff_date_sel = document.querySelector('#eff_date_sel');
    $('#effort_entries_list').hide();
    
    show_eff_logs.addEventListener('click', () => {
        console.log('Click'+'triggerd');
        if (eff_date_sel.value != "" && typeof(eff_date_sel.value) == "string") {
            $("#effort_entries_list").hide();
            // console.log(selectDate.options[selectDate.selectedIndex].value);
            fetchTSEntries(user.name, eff_date_sel.value);
        }
    });
    
    
});


function fetchTSEntries(name,date){
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
        $("#effortEntriesListTable tbody").append('<tr><td>'+TSE.srNumber+'</td><td>'+TSE.effortHrs+'</td></tr>');
    });
    // console.log(SR_array);
    removeLoaderFor('effort_dt_sel');
    
    $('#effort_entries_list').show();
}

