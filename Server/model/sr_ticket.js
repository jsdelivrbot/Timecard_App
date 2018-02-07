const db = require('../controllers/db');

// methods ======================
// find sr based on SR_NUMBER
exports.findSrOnNumber =  (srNumber, DBdone)=>{
    db.query('SELECT * FROM srtracker.SR_DIM WHERE srNumber=$1', [srNumber], (err, res) => {
        if (err) {
            return DBdone(err, null);
        } else {
            return DBdone(null,res);
        }
    });
};

// find all active sr based on assignee 
exports.findSrOnNumber =  (assignee, DBdone)=>{
    db.query('SELECT * FROM srtracker.SR_DIM WHERE assignee=$1 and status =\'OPEN\'', [assignee], (err, res) => {
        if (err) {
            return DBdone(err, null);
        } else {
            return DBdone(null,res);
        }
    });
};

// find all OPEN and todays closed  sr  based on assignee 
exports.findSrOnAssignee =  (assignee, date, DBdone)=>{
    const query = {
        text: 'SELECT * FROM srtracker.sr_dim WHERE assignee=$1 and status =\'OPEN\' UNION select * from srtracker.SR_DIM where assignee=$1 and status = \'CLOSED\' and last_update_date::timestamp::date = $2',
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