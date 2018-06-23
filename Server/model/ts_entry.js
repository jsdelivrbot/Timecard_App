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

//update ts_entry based on user,task,date
exports.updateTSEntries =  (assignee, date, task,hrs,DBdone)=>{
    const query = {
        text: 'UPDATE srtracker.timesheet_entry SET "effortHrs"=$4 WHERE UPPER(assignee)=UPPER($1) and date::timestamp::date = $2 and "srNumber"=$3 RETURNING *' ,
        values: [assignee, date,task,hrs]
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

//delete ts_entry based on user,task,date
exports.deleteTSEntries =  (assignee, date, task,DBdone)=>{
    const query = {
        text: 'DELETE FROM srtracker.timesheet_entry WHERE UPPER(assignee)=UPPER($1) and date::timestamp::date = $2 and "srNumber"=$3' ,
        values: [assignee, date,task]
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