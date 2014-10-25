/*jslint node:true */
'use strict';

/**
DB Config file, the configuration of the database itself is documented in the sql.db file
*/

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
