// load all the things we need
const LocalStrategy = require('passport-local').Strategy;
const db = require('../controllers/db');
const user = require('../model/user');

// load up the user model
// var User            = require('../app/models/user');

// expose this function to our app using module.exports
module.exports = function (passport) {

        // =========================================================================
        // passport session setup ==================================================
        // =========================================================================
        // required for persistent login sessions
        // passport needs ability to serialize and unserialize users out of session

        // used to serialize the user for the session
        passport.serializeUser(function (user, done) {
            // console.log('serialising');
            // console.log(user);

            done(null, user.sso);
        });

        // used to deserialize the user
        passport.deserializeUser(function (sso, done) {
            user.findUser(sso,(err, res) => {
                if (err) {
                    return done(err);
                } else {
                    // console.log(res.rows[0]);

                    done(err, res.rows[0]);
                }
            });
            
        });

        // =========================================================================
        // LOCAL SIGNUP ============================================================
        // =========================================================================
        // we are using named strategies since we have one for login and one for signup
        // by default, if there was no name, it would just be called 'local'

        passport.use('local-signup', new LocalStrategy({
                // by default, local strategy uses username and password, we will override with email
                usernameField: 'sso',
                passwordField: 'password',
                passReqToCallback: true // allows us to pass back the entire request to the callback
            },
            function (req, sso, password, done) {



                // asynchronous
                // User.findOne wont fire unless data is sent back
                process.nextTick(function () {
                    // console.log(req.body['firstName'] + ' ' + sso + ' ' + password);
                    // find a user whose sso is the same as the forms sso
                    // we are checking to see if the user trying to login already exists
                    user.findUser(sso, (err,res) => {
                        if (err) {
                            return done(err);
                        } else {
                            processRes(res);
                        }
                    });

                    

                    function processRes(res) {
                        // console.log(res.rows.length)
                        if (res.rows.length > 0) {
                            return done(null, false, req.flash('signupMessage', 'That SSO is already registered.'));
                        } else {
                            // set the user's local credentials
                            const name = req.body['firstName'] + ' ' + req.body['lastName'];
                            const ssoLocal = sso;
                            const hashedPassword = user.generateHash(password); 
                            // console.log(name + ' ' + sso + ' ' + hashedPassword);
                            const newUser = {
                                name : name,
                                sso : sso,
                                password : hashedPassword
                            }
                            user.insertNewUser(newUser,(err,res)=>{
                                if (err) {
                                    return done(err);
                                } else {
                                    // return done(null, false, req.flash('signupMessage', 'Hurrah!, That SSO is now registered.'));
                                    console.info('inserted row');
                                    
                                    // console.log(res.rows[0]);
                                    return done(null, res.rows[0]); //done(null, res.rows[0]);
                                }
                            });
                        }
                    }

                    
                });

            }));

        // =========================================================================
        // LOCAL LOGIN =============================================================
        // =========================================================================
        // we are using named strategies since we have one for login and one for signup
        // by default, if there was no name, it would just be called 'local'

        passport.use('local-login', new LocalStrategy({
                    // by default, local strategy uses username and password, we will override with email
                    usernameField: 'sso',
                    passwordField: 'password',
                    passReqToCallback: true // allows us to pass back the entire request to the callback
                },
                function (req, sso, password, done) { // callback with email and password from our form

                    // find a user whose sso is the same as the forms sso
                    // we are checking to see if the user trying to login already exists

                    user.findUser(sso,(err,res)=>{
                        // if there are any errors, return the error before anything else
                        if (err) 
                        return done(err);

                        // if no user is found, return the message
                        if (res.rowCount == 0) 
                        return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

                        if (res.rowCount == 1){
                            // if the user is found but the password is wrong
                            if (!user.validPassword(password, res.rows[0].password))
                                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                            // all is well, return successful user
                            else return done(null, res.rows[0]);
                        }

                    });
                    


        }));
    }