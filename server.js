/*jslint node:true */
'use strict';

// BASE SETUP
// =============================================================================

var express    = require('express'),
    app        = express(),

    morgan = require('morgan'),
    cookieParser= require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    passport   = require('passport'),
    flash = require('connect-flash');

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

var port = 61701;

// ROUTES FOR OUR API
// =============================================================================
require('./app/config/passport')(passport);
var router = require('./app/routes')(express, passport);

app.use('/api', router);

app.get('/logout', function(req, res) {
    req.logout();
    req.session.destroy(function (err) {
        res.redirect('/'); //Inside a callback… bulletproof!
    });
});

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
