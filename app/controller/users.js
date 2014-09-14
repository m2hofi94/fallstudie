/*jslint node:true */
'use strict';

exports.list = function(req, res) {
    var connection = require('./db.js')();
    connection.connect();

    connection.query('SELECT * FROM users', function(err, rows, fields) {
      if (err) throw err;

      res.jsonp(rows);
    });

    connection.end();
};

exports.create = function(req, res) {
    var connection = require('./db.js')();
    connection.connect();

    connection.query('INSERT INTO users SET ?', [req.body],function(err, rows, fields) {
        if (err) {
            if (err.errno===1062) {
                //username taken
                return res.status(400).jsonp({message: "Diese e-Mail ist bei uns bereits registriert"});
            }
            return res.status(500);
        }
      res.jsonp(rows);
    });

    connection.end();
};

exports.read = function(req, res) {
    var connection = require('./db.js')();
    connection.connect();

    connection.query('SELECT * FROM users WHERE id = ?', [req.params.userId],function(err, rows, fields) {
        if (err) return res.status(500);
        res.jsonp(rows);
    });

    connection.end();
};

exports.update = function(req, res) {
    var connection = require('./db.js')();
    connection.connect();

    connection.query('UPDATE users SET ? WHERE id= ?', [req.body, req.params.userId],function(err, rows, fields) {
        if (err) return res.status(500);
        res.jsonp(rows);
    });

    connection.end();
};

exports.delete = function(req, res) {
    var connection = require('./db.js')();
    connection.connect();

    connection.query('DELETE FROM users WHERE id = ?', [req.params.userId],function(err, rows, fields) {
        if (err) return res.status(500);
        res.jsonp(rows);
    });

    connection.end();
};

exports.login = function(req, res) {
    var connection = require('./db.js')();
    connection.connect();
	console.log(req.body.email + ".." + req.body.password);
	
	connection.query('SELECT id FROM users WHERE email = ? AND password = ?', [req.body.email, req.body.password], function(err, rows, fields) {
		if (err || rows.length === 0) {
			return res.status(500);	
        } else {
			res.jsonp(rows);
			return res.status(200);			
		}
	});

    connection.end();
};





