// var PV = require('./passverification');
var FT = require('./controllers/fetchTasks');
var FTSE = require('./controllers/fetchTSEntries');
var ST = require('./controllers/submitTSEntries');
var UT = require('./controllers/updateTSEntries');
var DT = require('./controllers/deleteTSEntries');

module.exports = function (app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    // app.get('/', function(req, res) {
    //     res.render('pages/index.ejs'); // load the index.ejs file
    // });
    app.get('/blank', function (req, res) {
        res.render('pages/blank');
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/', function (req, res) {

        // render the page and pass in any flash data if it exists
        res.render('pages/login.ejs', {
            message: req.flash('loginMessage')
        });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/viewEditlogs', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function (req, res) {

        // render the page and pass in any flash data if it exists
        res.render('pages/signup.ejs', {
            message: req.flash('signupMessage')
        });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // =====================================
    // HOME SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/home', isLoggedIn, function (req, res) {
        res.render('pages/viewEditLogs', {
            user: req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // VIEW EDIT Effort Logs =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/viewEditlogs', isLoggedIn, function (req, res) {
        res.render('pages/viewEditLogs', {
            user: req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });





    // =====================================
    // FETCH TASKS =========================
    // =====================================
    app.post('/fetchTasks', function (req, res) {
        //   console.log(req.body['username']);
        //   console.log(req.body['date']);
        let username = req.body['username'];
        let sso = req.body['sso'];
        let date = req.body['date'];
        FT.getUserTasks(username, sso, date, (err, userTasks) => {
            if (!userTasks) {
                res.status(400).send(err);
            } else {
                res.status(200).send(userTasks);
            }
        });


    });
    // =====================================
    // FETCH TS_ENTRIES =========================
    // =====================================
    app.post('/fetchTSEntries', function (req, res) {
        //   console.log(req.body['username']);
        //   console.log(req.body['date']);
        let username = req.body['username'];
        let sso = req.body['sso'];
        FTSE.getUserTSEntries(username, sso, req.body['date'], (err, userTSEntries) => {
            if (!userTSEntries) {
                res.status(400).send(err);
            } else {
                res.status(200).send(userTSEntries);
            }
        });
    });

    // =====================================
    // submit TS Entries ===================
    // =====================================
    app.post('/submit_TS', function (req, res) {
        //   console.log(req.body['username']);
        console.log(req.body['effort']);
        let username = req.body['username'];
        let sso = req.body['sso'];

        ST.enterTS(username, sso, req.body['effort'], (err, userTS) => {
            if (!userTS) {
                res.status(400).send(err);
            } else {
                res.status(200).send(userTS);
            }
        });


    });

    // =====================================
    // update TS Entries ===================
    // =====================================
    app.post('/update_TS', function (req, res) {

        // {"effortHrs":"2","srNumber":"SR2315131","username":"Mayur Devgaonkar","date":"2018-10-01"}
        
        let username = req.body['username'];
        let sso = req.body['sso'];
        assignee=username;
        date=req.body['date'];
        task=req.body['srNumber'];
        hrs=req.body['effortHrs']
        UT.updateTS(assignee,sso, date, task,hrs, (err, userTS) => {
            if (!userTS) {
                res.status(400).send(err);
            } else {
                res.status(200).send(userTS);
            }
        });


    });

    // =====================================
    // Delete TS Entries ===================
    // =====================================
    app.post('/delete_TS', function (req, res) {

        // {"effortHrs":"2","srNumber":"SR2315131","username":"Mayur Devgaonkar","date":"2018-10-01"}
        let username = req.body['username'];
        let sso = req.body['sso'];
        assignee=username;
        date=req.body['date'];
        task=req.body['srNumber'];
        DT.deleteTS(assignee, sso, date, task, (err, userTS) => {
            // console.log(userTS);            
            if (!userTS) {
                res.status(400).send(err);
            } else {
                res.status(200).send(userTS);
            }
        });


    });



};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}