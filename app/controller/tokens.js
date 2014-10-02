/*jslint node:true */
'use strict';

var connection = require('./../config/db.js')(100);

module.exports = function () {
    return {
        publishForAll : function(req, res){
            connection.query('INSERT INTO tokens SET surveyId = ?', [req.params.id], function(err, rows, fields){
                if (err) throw err;
                res.jsonp(rows);
            });
        }
    };
};
