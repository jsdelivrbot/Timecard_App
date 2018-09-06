const tse= require ('../model/ts_entry')
    
    exports.getUserTSEntries = function(username, sso, date, callback){
        // console.log(username);
        
        tse.findTSEntriesOnDate(username, sso, date, (err,res)=>{
            if (err) {
                return callback(err, null);
            } else {
                // console.log(res);
                return callback(null, res);
            }
        });
    }