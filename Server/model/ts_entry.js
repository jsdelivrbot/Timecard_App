const db = require('../controllers/db');


// methods ======================

exports.insertTSEntries =  (ts_entries, DBdone)=>{
    const query = {
        text: `INSERT INTO "srtracker"."timesheet_entry"("date","srNumber","effortHrs", "assignee","assignee_sso") VALUES ${ts_entries}`
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
exports.findTSEntriesOnDate =  (assignee, sso, date, DBdone)=>{
    const query = {
        text: 'SELECT * FROM srtracker.timesheet_entry WHERE assignee_sso=$1 and date::timestamp::date = $2',
        values: [sso, date]
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
exports.updateTSEntries =  (assignee, sso, date, task,hrs,DBdone)=>{
    const query = {
        text: 'UPDATE srtracker.timesheet_entry SET "effortHrs"=$3 WHERE assignee_sso=$4 and date::timestamp::date = $1 and "srNumber"=$2' ,
        values: [date,task,hrs, sso]
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
exports.deleteTSEntries =  (assignee,sso,  date, task,DBdone)=>{
    const query = {
        text: 'DELETE FROM srtracker.timesheet_entry WHERE assignee_sso=$3 and date::timestamp::date = $1 and "srNumber"=$2' ,
        values: [date,task,sso]
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