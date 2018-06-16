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
        var row_id = random_id();
        markup='<tr row_id="'+row_id+'">'
        +'<td><div col_name="srNumber">'+TSE.srNumber+'</td>'
        +'<td><div class="row_data" edit_type="click" col_name="effortHrs">'+TSE.effortHrs+'</td>'
        // show edit button
        +'<td><span class="btn_edit"><a href="#" class="btn btn-link " row_id="'+row_id+'" > Edit</a>'+'</span>'
        // Show save,cancel and delete buttons if edit is clicked 
        +'<span class="btn_save"><a href="#" class="btn btn-link"  row_id="'+row_id+'"> Save</a> |'+'</span>'
        +'<span class="btn_cancel"><a href="#" class="btn btn-link"  row_id="'+row_id+'"> Cancel</a> |'+'</td></span>'
        +'</tr>'
        $("#effortEntriesListTable tbody").append(markup);
        $(document).find('.btn_save').hide();
	    $(document).find('.btn_cancel').hide();
    });

    // console.log(SR_array);
    removeLoaderFor('effort_dt_sel');
    
    $('#effort_entries_list').show();
}

function actionMarkups(){
    return "";
}


var random_id = function  () 
	{
		var id_num = Math.random().toString(9).substr(2,3);
		var id_str = Math.random().toString(36).substr(2);
		
		return id_num + id_str;
    }
    
$(document).on('click', '.btn_edit', function(event){
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
    .css('padding','3px')

    //--->add the original entry > start
    tbl_row.find('.row_data').each(function(index, val) 
    {  
        //this will help in case user decided to click on cancel button
        $(this).attr('original_entry', $(this).html());
    }); 		
    //--->add the original entry > end

});
//--->button > edit > end

