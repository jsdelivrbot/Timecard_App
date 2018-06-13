const tse= require ('../model/ts_entry')
    
    exports.getUserTSEntries = function(username, date, callback){
        // console.log(username);
        
        tse.findTSEntriesOnDate(username, date, (err,res)=>{
            if (err) {
                return callback(err, null);
            } else {
                // console.log(res);
                return callback(null, res);
            }
        });
    }