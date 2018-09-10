const db = require('../controllers/db');


// methods ======================

exports.insertTSEntries =  (ts_entries, DBdone)=>{
    const query = {
        text: `INSERT INTO "srtracker"."timesheet_entry"("effort_dt","task","effortHrs", "assignee_name","assignee_sso") VALUES ${ts_entries}`
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

// find all ts_entries based on assignee and effort_dt 
exports.findTSEntriesOnDate =  (assignee, sso, effort_dt, DBdone)=>{
    const query = {
        text: `SELECT * FROM srtracker.timesheet_entry WHERE assignee_sso=$1 and effort_dt::timestamp::date = $2`,
        values: [sso, effort_dt]
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

//update ts_entry based on user,task,effort_dt
exports.updateTSEntries =  (assignee, sso, effort_dt, task,hrs,DBdone)=>{
    const query = {
        text: `UPDATE srtracker.timesheet_entry SET "effortHrs"=$3 WHERE assignee_sso=$4 and effort_dt::timestamp::date = $1 and task=$2` ,
        values: [effort_dt,task,hrs, sso]
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

//delete ts_entry based on user,task,effort_dt
exports.deleteTSEntries =  (assignee,sso,  effort_dt, task,DBdone)=>{
    const query = {
        text: `DELETE FROM srtracker.timesheet_entry WHERE assignee_sso=$3 and effort_dt::timestamp::date = $1 and task=$2` ,
        values: [effort_dt,task,sso]
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