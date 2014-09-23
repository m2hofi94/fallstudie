/*jslint node:true */
'use strict';

var connection = require('./../config/db.js')(100);

module.exports = function() {
    return {
        getQuestions : function(req, res) {
            connection.query('SELECT * FROM questions', function(err, rows, fields) {
              if (err) throw err;
              console.log(fields + " ... " + rows);
              res.jsonp(rows);
            });
        },

        addQuestion : function(req, res) {
         connection.query('INSERT INTO questions SET ?', [req.body], function(err, rows, fields){
               if (err) throw err;
               console.log(fields + " ... " + rows);
            });
        }
    };
};
