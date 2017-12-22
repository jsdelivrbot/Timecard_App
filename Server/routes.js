var PV = require('./passverification');
var FT = require('./fetchTasks');

module.exports = function(app) {

    app.get('/', function(req, res){
          res.render('pages/index');
    });

    app.post('/', function(req, res){
        //console.log(req.body['user'],req.body['pass']);
        PV.verifyPass(req.body['user'],req.body['pass'],function(err,userObject){
            if(!userObject){
                res.status(400).send(err);
            }else{
                res.status(200).send(userObject);
            }
        })
        
    });

    app.post('/fetchTasks', function(req, res){
        FT.getUserTasks(req.body['usersso'],function(err,userTasks){
            if(!userTasks){
                res.status(400).send(err);
            }else{
                res.status(200).send(userTasks);
            }
        });
        
        
    });
};