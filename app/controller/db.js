/*jslint node:true */
'use strict';

var mysql      = require('mysql');

module.exports = function() {
    return mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : 'test',
      port: 3306,
      database: 'afs'
    });
};
