var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session      = require('express-session');
var passport = require('passport');
var flash    = require('connect-flash');
var exphbs = require('express-handlebars');

var add_gl = require('./routes/add_gl');
var add_wbs = require('./routes/add_wbs');
var convert_pcm_export = require('./routes/convert_pcm_export');
var convert_sap_export = require('./routes/convert_sap_export');
var gl_log = require('./routes/gl_log');
var index = require('./routes/index');
var logout = require('./routes/logout');
var users = require('./routes/users');
var wbs_log = require('./routes/wbs_log');
var uploadDoc = require('./routes/uploadDoc');

var app = express();

// Create `ExpressHandlebars` instance with a default layout.
var hbs = exphbs.create({
    defaultLayout: 'main',
    layoutsDir: 'views/layouts/',
    partialsDir: 'views/partials/',
    compilerOptions: undefined
});

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// required for passport
app.use(session({ secret: 'npdcpcmcommoncostbeninnnpc' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', isAuthenticated, users);
app.use('/logout', isAuthenticated, logout);
app.use('/wbs_log', isAuthenticated, wbs_log);
app.use('/convert_sap_export', isAuthenticated, convert_sap_export);
app.use('/convert_pcm_export', isAuthenticated, convert_pcm_export);
app.use('/gl_log', isAuthenticated, gl_log);
app.use('/add_wbs', isAuthenticated, add_wbs);
app.use('/add_gl', isAuthenticated, add_gl);
app.use('/server/uploads', isAuthenticated, uploadDoc);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

function isAuthenticated(req, res, next) {

// if user is authenticated in the session, carry on
    if ( true) //req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

module.exports = app;
