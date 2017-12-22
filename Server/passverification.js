const fs = require ('fs');
const xml2js = require('xml2js');


var parser = new xml2js.Parser({
    explicitCharKey: false,
    trim: true,
    explicitRoot: true,
    mergeAttrs: true
});
var users = {};
    
readUsers();

exports.verifyPass = function(user, pass, callback){
    // console.log(user,pass);
    readUsers();
    let userObject = users.find(o => o.username[0] === user);
    // console.log(userObject.username[0], userObject.password[0]);
    if(!userObject){
        callback('Invalid username');
    }else{
    if(userObject.password[0] === pass){
        callback(null,userObject);
    }else{
        callback('Invalid Password');
    }
    }
    
}

function readUsers(){
    fs.readFile(__dirname + '/users.xml',function(err,data){

        parser.parseString(data, function(err,result){
            // console.dir(JSON.stringify(result));
            users = result.Users.User;
            //console.log(users);
            
        });
    });
}