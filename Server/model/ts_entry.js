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