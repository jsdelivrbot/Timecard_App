const db = require('../controllers/db');

// methods ======================
// find sr based on SR_NUMBER
exports.findSrOnNumber =  (srNumber, DBdone)=>{
    db.query(`SELECT * FROM srtracker.SR_DIM WHERE task=$1`, [srNumber], (err, res) => {
        if (err) {
            return DBdone(err, null);
        } else {
            return DBdone(null,res);
        }
    });
};

// find all active sr based on assignee 
exports.findSrOnNumber =  (assignee, DBdone)=>{
    db.query(`SELECT * FROM srtracker.SR_DIM WHERE assignee_name=$1 and UPPER(active_ind) =UPPER('OPEN')`, [assignee], (err, res) => {
        if (err) {
            return DBdone(err, null);
        } else {
            return DBdone(null,res);
        }
    });
};

// find all OPEN and todays closed  sr  based on assignee 
exports.findSrOnAssignee =  (assignee, sso, effort_dt, DBdone)=>{
    const query = {
        // text: 'SELECT * FROM srtracker.sr_dim WHERE assignee=$1 and status =\'OPEN\' UNION select * from srtracker.SR_DIM where assignee=$1 and status = \'CLOSED\' and last_update_date::timestamp::date = $2',
        text: `SELECT * FROM (SELECT * FROM srtracker.sr_dim WHERE assignee_sso=$1 and UPPER(active_ind) =UPPER('OPEN') UNION select * from srtracker.SR_DIM where assignee_sso=$1 and UPPER(active_ind) =UPPER('CLOSED') and last_modified_dt::timestamp::date = $2) ALL_SR WHERE task NOT IN (select task from srtracker.timesheet_entry where effort_dt::timestamp::date = $2 )`,
        //SELECT * FROM (SELECT * FROM srtracker.sr_dim WHERE UPPER(assignee)=upper($1) and status ='OPEN' UNION select * from srtracker.SR_DIM where UPPER(assignee)=upper($1) and status = 'CLOSED' and last_update_date::timestamp::date = $2) ALL_SR WHERE sr_number NOT IN (select "srNumber" from srtracker.timesheet_entry where date::timestamp::date = $2 )
        //SELECT * FROM (SELECT * FROM srtracker.sr_dim WHERE UPPER(assignee)=upper('Mayur Devgaonkar') and status ='OPEN' UNION select * from srtracker.SR_DIM where UPPER(assignee)=upper('Mayur Devgaonkar') and status = 'CLOSED' and last_update_date::timestamp::date = '2018-10-02') ALL_SR WHERE sr_number NOT IN (select "srNumber" from srtracker.timesheet_entry where date::timestamp::date = '2018-10-02' )
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