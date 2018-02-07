const sr= require ('../model/sr_ticket')
    
    exports.getUserTasks = function(username, date, callback){
        // console.log(username);
        
        sr.findSrOnAssignee(username, date, (err,res)=>{
            if (err) {
                return callback(err, null);
            } else {
                // console.log(res);
                return callback(null, res);
            }
        });
    }