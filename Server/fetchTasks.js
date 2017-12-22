const fs = require ('fs');
const xml2js = require('xml2js');


var parser = new xml2js.Parser({
    explicitCharKey: false,
    trim: true,
    explicitRoot: true,
    mergeAttrs: true
});
var sso = '0';
var tasks = {};

readTasks();

function readTasks(){
fs.readFile(__dirname + '/tasks.xml',function(err,data){
    
    parser.parseString(data, function(err,result){
        // console.dir(JSON.stringify(result));
        tasks = result.Tasks.task;
        // console.log(tasks);
        
        
    });
});
}

exports.getUserTasks = function(sso, callback){
    readTasks();
    var userTasks = tasks.filter(tasks => tasks.assigneeSso[0] === sso);
    if(userTasks.size === 0){
        callback(null,null);
    }else{
        callback(null,userTasks);
    }
}