/*jslint node:true */
'use strict';

var mysql      = require('mysql');

module.exports = function() {
    return mysql.createConnection({
      host     : 'localhost',
      user     : 'afs',
      password : 'EgDetVuWeHewitye',
      port: 3306,
      database: 'afs'
    });
};
