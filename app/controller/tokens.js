/*jslint node:true */
'use strict';

var connection = require('./../config/db.js')(100);
var md5 = require('MD5');

module.exports = function () {
    return {
        publishForAll : function(req, res){
            console.log(md5(".."));
            // console.log(hash);

          //  connection.query('INSERT INTO tokens SET surveyId = ?', [hash], function(err, rows, fields){
          //      if (err) throw err;
          //      res.jsonp(rows);
         //   });
        }
    };
};
