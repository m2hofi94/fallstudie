/*jslint node:true */
'use strict';

var connection = require('./../config/db.js')(100);

module.exports = function () {
    return {
        getQuestionsWithToken: function (req, res) {
            connection.query('SELECT * FROM tokens WHERE id = ?', [req.params.token], function (err, rows, fields) {
                if (err) throw err;
                if(rows.length > 0){
                    var result = rows[0];
                    connection.query('SELECT * FROM surveys WHERE id = ?', [result.surveyID], function (err, rows, fields) {
                        if (err) throw err;
                        var title = rows[0].title;

                        connection.query('SELECT * FROM questions WHERE surveyID = ?', [result.surveyID], function (err, rows, fields) {
                            if (err) throw err;
                            // console.log(rows);
                            res.jsonp([title, rows]);
                        });
                    });

                }else{
                    res.status(403);
                }
                // res.jsonp(rows);
            });
        },

        getSurveys: function (req, res) {
            connection.query('SELECT * FROM surveys WHERE userID = ?', [req.user.id], function (err, rows, fields) {
                // console.log(rows);
                if (err) throw err;
                res.jsonp(rows);
            });
        },

        activateSurvey: function(req, res) {
            connection.query('UPDATE surveys SET status = ? WHERE id= ?', ['active', req.params.id],function(err, rows, fields) {
                if (err) return res.status(500);
                console.log(rows);
                res.jsonp(rows);
            });
        },

        deleteSurvey: function(req, res) {
            connection.query('DELETE FROM surveys WHERE id = ?', [req.params.id],function(err, rows, fields) {
                if (err) return res.status(500);

                connection.query('DELETE FROM questions WHERE surveyId = ?', [req.params.id],function(err, rows, fields) {
                    if (err) return res.status(500);

                    connection.query('DELETE FROM tokens WHERE surveyId = ?', [req.params.id],function(err, rows, fields) {
                    if (err) return res.status(500);
                });
                });
            });
        },

        createSurvey: function (req, res) {
            var survey = {userID : req.user.id, title : req.body[0], status : req.body[2]};

            connection.query('INSERT INTO surveys SET ?', [survey], function(err, rows, fields) {
                if (err) throw err;
                for(var i = 0; i < req.body[1].length; i++){
                    var insert = {surveyID : rows.insertId, title : req.body[1][i].title, type : req.body[1][i].type};

                    connection.query('INSERT INTO questions SET ?', [insert], function(err, rows, fields){
                        if (err) throw err;
                        // res.status(200);
                    });
                }
                res.jsonp(rows);
            });
            return;
        }

    };
};
