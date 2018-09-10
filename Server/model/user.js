const bcrypt   = require('bcrypt-nodejs');
const db = require('../controllers/db');

// methods ======================
// generating a hash
exports.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
exports.validPassword = function(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword);
};

// we are checking to see if the user trying to login already exists
exports.findUser =  (sso, DBdone)=>{
    db.query(`SELECT * FROM srtracker.resc_dim WHERE sso=$1`, [sso], (err, res) => {
        if (err) {
            return DBdone(err, null);
        } else {
            return DBdone(null,res);
        }
    });
};

exports.insertNewUser = (newUser, DBdone)=>{
    // console.log(newUser);
    
    db.query(`INSERT INTO "srtracker"."resc_dim"("name","sso","recrd_crrnt_ind","password") VALUES ($1,$2,'T',$3)`, [newUser.name, newUser.sso, newUser.password], (err, res) => {
        if (err) {
            return DBdone(err, null);
        } else {
            return DBdone(null,res);
        }
    });

};