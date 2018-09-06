const TSE= require ('../model/ts_entry')
    
    exports.deleteTS = function(assignee, sso, date, task, callback){
        TSE.deleteTSEntries(assignee, sso, date, task, (err,res)=>{
            if (err) {
                return callback(err, null);
            } else {
                // console.log(res);
                return callback(null, res);
            }
        });
    }