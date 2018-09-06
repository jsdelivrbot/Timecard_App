const sr= require ('../model/sr_ticket')
    
    exports.getUserTasks = function(username, sso, date, callback){
        // console.log(username);
        
        sr.findSrOnAssignee(username, sso, date, (err,res)=>{
            if (err) {
                return callback(err, null);
            } else {
                // console.log(res);
                return callback(null, res);
            }
        });
    }