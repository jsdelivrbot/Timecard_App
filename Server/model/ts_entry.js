const db = require('../controllers/db');


// methods ======================

exports.insertTSEntries =  (ts_entries, DBdone)=>{
    const query = {
        text: 'INSERT INTO "srtracker"."timesheet_entry"("date","srNumber","effortHrs") VALUES $1',
        values: [ts_entries]
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