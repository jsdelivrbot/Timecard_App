const TSE= require ('../model/ts_entry')
    
    exports.updateTS = function(assignee, date, task,hrs, callback){
        TSE.updateTSEntries(assignee, date, task,hrs, (err,res)=>{
            if (err) {
                return callback(err, null);
            } else {
                // console.log(res);
                return callback(null, res);
            }
        });
    }