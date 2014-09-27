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
            console.log(req.body);
            // var survey = {userID : req.user.id, title : req.body[0], status : 'Entwurf'};
            connection.query('INSERT INTO surveys SET userID = ?, title = ?, status = ?', [req.user.id, req.body[0], req.body[2]], function(err, rows, fields) {
                if (err) throw err;
                // console.log(rows);
                for(var i = 0; i < req.body.length; i++){
                    req.body[1][i].surveyId = rows.insertId;
                    connection.query('INSERT INTO questions SET ?', [req.body[1][i]], function(err, rows, fields){
                        if (err) throw err;
                        // console.log(rows);
                        // res.status(200);
                    });
                }
                return;
            });
            return;
        }

    };
};
