const db = require('../controllers/db');


// methods ======================

exports.insertTSEntries =  (ts_entries, DBdone)=>{
    const query = {
        text: `INSERT INTO "srtracker"."timesheet_entry"("date","srNumber","effortHrs", "assignee") VALUES ${ts_entries} RETURNING *`
      }
      
    db.query(query, (err, res) => {
        if (err) {
            console.log(err);

            return DBdone(err, null);
        } else {
            return DBdone(null,res);
        }
    });
};

// find all ts_entries based on assignee and date 
exports.findTSEntriesOnDate =  (assignee, date, DBdone)=>{
    const query = {
        text: 'SELECT * FROM srtracker.timesheet_entry WHERE assignee=$1 and date::timestamp::date = $2',
        values: [assignee, date]
      }
      
    db.query(query, (err, res) => {
        if (err) {
            console.log(err);

            return DBdone(err, null);
        } else {
            return DBdone(null,res);
        }
    });
};