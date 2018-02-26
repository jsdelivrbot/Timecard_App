const TSE= require ('../model/ts_entry')
    
    exports.enterTS = function(username, effortEntries, callback){
        // console.log(username);

        ts_entries = prepareTSEntries(username, effortEntries).toString();
        
        TSE.insertTSEntries(ts_entries, (err,res)=>{
            if (err) {
                return callback(err, null);
            } else {
                // console.log(res);
                return callback(null, res);
            }
        });
    }

    function prepareTSEntries(username, effortEntries) {
        ts_entries = effortEntries.reduce((tse, eff_ent)=>{

            tse_str = '(';
            tse_str += `'${eff_ent.date}',`;
            tse_str += `'${eff_ent.sr_number}',`;
            tse_str += `${eff_ent.hrs_spent},`;
            tse_str += `'${username}'`;
            tse_str += ')';
            console.log(tse_str);
            
            tse.push(tse_str);
            return tse;
        }, []);

        return ts_entries;
    }