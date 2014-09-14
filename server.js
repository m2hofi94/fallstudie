// BASE SETUP
// =============================================================================

var express    = require('express'),
    app        = express(),
    bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

var port = 61701;

// ROUTES FOR OUR API
// =============================================================================
var router = require('./app/routes')(express);

app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
