var sso = '0';
var tasks;

$(document).ready(function(){

    $('#logout').click(function(){
        logout();
    });

    $('#timesheetForm').hide();
    $('#taskInfo').hide();
    $('#tmstDate').html(moment().format('Do MMM YYYY'));
    toggleSubmit();
    $('#timecard').hide();

    // SELECT change EVENT TO READ SELECTED VALUE FROM DROPDOWN LIST.
    $('#selectTask').change(function () {
        // $('p').text('Selected Item: ' + this.options[this.selectedIndex].text);
        if(this.selectedIndex === 0 ){$('#taskInfo').hide();}
        else{
            var task = tasks.find(t => t.ticket[0] === this.options[this.selectedIndex].text);
            $('#taskInfo').show();
            $('#taskInfo').html(task.info[0]);
        }
        // if( == 0){};
    });

    $('#populateButton').click(function(){
        var selectedTask = $('#selectTask').val();
        var taskHours = $('#hrsTmst').val();
        addRowTimeCard(selectedTask,taskHours);
    });

    $('#dateTmst').change(function () {
        // $('p').text('Selected Item: ' + this.options[this.selectedIndex].text);
        $('#tmstDate').html(moment(this.value).format('Do MMM YYYY'));
        
        
    });

    $('#login').ajaxForm({
        beforeSubmit : function(formData, jqForm, options){
        },
        success	: function(responseText, status, xhr, $form){
            if (status == 'success') //window.location.href = '/';
            showLogedinUI(responseText);
            fetchTasks();
            
        },
        error : function(e){
            // alert('Invalid Credentials');
            showLoginError();
            //lv.showLoginError('Login Failure', 'Please check your username and/or password');
        }
    });

    $('#clearTimecard').click(function(){
        $("#tmstTable tbody tr").remove(); 
        toggleSubmit();
    })


});


function fetchTasks(){
    $.ajax({
        url : "/fetchTasks",
        type : "POST",
        data: {usersso: sso },
        success : function(responseText, status, xhr, $form){
            console.log(responseText);
            addTasksToSelect(responseText);
        },
        error : function(e){

        }
    });
}

function addRowTimeCard(selectedTask,taskHours){
    var markup = "<tr><th scope='row'>1</th><td>"+selectedTask+"</td><td id='taskHours'>"+taskHours+"</td><td><span id='clearTask' onClick='deleteRow(this)'><a>❌</a></span></td></tr>";  
            $("#tmstTable").append(markup);
            toggleSubmit();
}

function toggleSubmit(){
    $('#totalHours').html(sumOfColumns($('#tmstTable'), 1));
    if($('#tmstTable tbody tr').length > 0){
        $("#submitTimecard").prop('disabled', false);
    }else{
        $("#submitTimecard").prop('disabled', true);
    }

}


function deleteRow(r) {
    var i = r.parentNode.parentNode.rowIndex;
    document.getElementById("tmstTable").deleteRow(i);
    toggleSubmit();
}

function logout(){
    window.location.href = '/';
}

function showLoginError(){
    
    $('#logErr').removeClass('hidden');
    $('#logErr').removeClass('alert-danger');
    $('#logErr').addClass('alert-danger');
    $('#logErr').html('Login Failure \n Please check your username and/or password');
}

function sumOfColumns(table, columnIndex) {
    var tot = 0;
    
    $('[id*=taskHours]').each(function() {
            tot += parseFloat($(this).html());
        });
    return tot;
}

function showLogedinUI(responseText){
    $('#login').addClass('hidden');
    $('#logAlert').removeClass('alert-info');
    $('#logAlert').addClass('alert-success');
    $('#logAlert').html('Welcome '+responseText.username[0]+' ('+responseText.sso[0]+')');

    $('#logAlert').addClass('col-md-10');
    $('#logout').removeClass('hidden');
    sso = responseText.sso[0]
    $('#timesheetForm').show();
    $('#timecard').show();
}

function showLogedoutUI(responseText){
    $('#login').removeClass('hidden');
    $('#logAlert').addClass('alert-info');
    $('#logAlert').removeClass('alert-success');
    $('#logAlert').html('To enter your hours start with verifying your password.');

    $('#logAlert').removeClass('col-md-10');
    $('#logout').addClass('hidden');

    $('#timesheetForm').hide();
    $('#timecard').hide();
}

function addTasksToSelect(responseText){
    tasks = responseText;
    $.each(responseText, function (index, value) {
        $("#selectTask").append('<option value="'+value.ticket+'">'+value.ticket+'</option>');
    });
}
