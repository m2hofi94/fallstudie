/*jslint node:true */
'use strict';

var connection = require('./../config/db.js')(100);

module.exports = function () {
    return {
        getQuestions: function (req, res) {
            connection.query('SELECT * FROM questions', function (err, rows, fields) {
                if (err) throw err;
                res.jsonp(rows);
            });
        },

        createSurvey: function (req, res) {
            connection.query('INSERT INTO surveys SET userID = ?', req.user.id, function(err, rows, fields) {
                if (err) throw err;
                console.log(rows);
                for(var i = 0; i < req.body.length; i++){
                    req.body[i].surveyId = rows.insertId;
                    connection.query('INSERT INTO questions SET ?', [req.body[i]], function(err, rows, fields){
                        if (err) throw err;
                        console.log(rows);
                        res.status(200);
                    });
                }
            });
        }

    };
};
