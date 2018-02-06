const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const logger = require('morgan');
const passport = require('passport');
const helpers = require('./Server/config/helpers');
const flash = require('connect-flash');
var favicon = require('serve-favicon');
const PORT = process.env.PORT || 5000;

var dotenv = require('dotenv');
// Load environment variables from .env file
dotenv.load();

var app = express();

// Log requests to the console.
app.use(logger('dev'));


app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'lang-logo.png')));

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// required for passport
console.log('secret => ' + process.env.SESSION_SECRET);

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
// // The flash middleware let's us use req.flash('error', 'Shit!'), which will then pass that message to the next page the user requests
app.use(flash());

app.use((req, res, next) => {
  res.locals.h = helpers;
  res.locals.flashes = req.flash();
  res.locals.user = req.user || null;
  res.locals.currentPath = req.path;
  next();
}); // use connect-flash for flash messages stored in session

require('./Server/config/passport')(passport); // pass passport for configuration

require('./Server/routes')(app, passport);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.render('pages/404');
  next(err);
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));