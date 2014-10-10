/*jslint node:true */
'use strict';

var mysql      = require('mysql');

module.exports = function(num) {
    return mysql.createPool({
      connectionLimit : num,
      host     : 'localhost',
      user     : 'afs',
      password : 'EgDetVuWeHewitye',
      port: 3306,
      database: 'afs',
	  multipleStatements: true
    });
};
