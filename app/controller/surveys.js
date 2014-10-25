/*jslint node:true */
'use strict';

var connection = require('./../config/db.js')(100);

var formatDate = function (date) {
    date = date.getUTCFullYear() + '-' +
        ('00' + (date.getUTCMonth() + 1)).slice(-2) + '-' +
        ('00' + date.getUTCDate()).slice(-2) + ' ' +
        ('00' + date.getUTCHours()).slice(-2) + ':' +
        ('00' + date.getUTCMinutes()).slice(-2) + ':' +
        ('00' + date.getUTCSeconds()).slice(-2);
    return date;
};

module.exports = function () {
    return {
        getQuestionsWithToken: function (req, res) {
            // See if the token is valid and not already used
            connection.query('SELECT * FROM tokens WHERE token = ? AND valid = true AND used = false', [req.params.token], function (err, rows, fields) {
                // if (err) throw err;
                if (rows.length > 0) {
                    // Get the survey and the questions which are connected to this token
                    var result = rows[0];
                    connection.query('SELECT * FROM surveys WHERE id = ?', [result.surveyID], function (err, rows, fields) {
                        if (err) throw err;
                        var title = rows[0].title;

                        connection.query('SELECT * FROM questions WHERE surveyID = ?', [result.surveyID], function (err, rows, fields) {
                            if (err) throw err;
                            res.jsonp([title, rows, result.surveyID]);
                        });
                    });

                } else {
                    res.status(418).jsonp(rows);
                }
                // res.jsonp(rows);
            });
        },

        getSurveys: function (req, res) {
            // var count = {recipients : [], answers : []};
            // Get information about the survey and the token (needed for public surveys)
            connection.query('SELECT surveys.*,token,keepAfterUse,valid,used FROM surveys Left JOIN tokens ON surveys.id = tokens.surveyID WHERE userID = ? GROUP BY surveys.id', [req.user.id], function (err, rows, fields) {
                console.log(rows);
                if (err) throw err;
                res.jsonp(rows);
            });
        },

        getQuestions: function (req, res) {
            connection.query('SELECT * FROM questions WHERE surveyID = ?', [req.params.id], function (err, rows, fields) {
                if (err) throw err;
                res.jsonp(rows);
            });
        },

        getAnswers: function (req, res) {
            connection.query('SELECT * FROM answers WHERE surveyID = ?', [req.params.id], function (err, rows, fields) {
                if (err) throw err;
                res.jsonp(rows);
            });
        },

        getRecipients: function (req, res) {
            connection.query('SELECT * FROM recipients WHERE surveyID = ?', [req.params.id], function (err, rows, fields) {
                if (err) throw err;
                res.jsonp(rows);
            });
        },

        changeStatus: function (req, res) {
            // Update status of survey. if status == 'closed' set endDate and mark every token for this survey as invalid
            connection.query('UPDATE surveys SET status = ? WHERE id= ?', [req.body[1], req.body[0]], function (err, rows, fields) {
                if (err) return res.status(500);
                if (req.body[1] == 'closed') {
                    connection.query('UPDATE surveys SET endDate = ? WHERE id= ?', [formatDate(new Date()), req.body[0]], function (err, rows, fields) {
                        connection.query('UPDATE tokens SET valid = false WHERE surveyId= ?', [req.body[0]], function (err, rows, fields) {
                            if (err) return res.status(500);
                            res.jsonp(rows);
                        });
                    });
                } else {
                    res.jsonp(rows);
                }
            });
        },

        deleteSurvey: function (req, res) {
            // If a survey is deleted, every answer/question is deleted because of the Foreign-Key Reference
            connection.query('DELETE FROM surveys WHERE id = ?', [req.params.id], function (err, rows, fields) {
                if (err) return res.status(500);
                connection.query('UPDATE tokens SET valid = 0 WHERE surveyID = ?', [req.params.id], function (err, rows, fields) {
                    res.jsonp(rows);
                });
            });
        },

        createSurvey: function (req, res) {
            // Insert into table surveys, questions into table questions and then the recipients
            // req.body[0] - title
            // req.body[1] - questions
            // req.body[2] - status
            // req.body[3] - recipients
            var rec = req.body[3] === null ? 0 : req.body[3].length;

            var survey = {
                userID: req.user.id,
                title: req.body[0],
                status: req.body[2],
                countRecipients: rec
            };
            connection.query('INSERT INTO surveys SET ?', [survey], function (err, rows, fields) {
                if (err) throw err;
                var surveyId = rows.insertId;
                // Insert questions and recipients into DB
                var qInsStatement = '';
                for (var i = 0; i < req.body[1].length; i++) {
                    qInsStatement = qInsStatement + 'INSERT INTO questions SET surveyID=' + rows.insertId + ',title="' + req.body[1][i].title + '",type="' + req.body[1][i].type + '";';
                }
                var rInsStatement = '';
                if (req.body[3] !== null) {
                    rInsStatement = '';
                    for (var j = 0; j < req.body[3].length; j++) {
                        rInsStatement = rInsStatement + 'INSERT INTO recipients SET email="' + req.body[3][j] + '",surveyId=' + rows.insertId + ';';
                    }
                }
                var finalStatement = qInsStatement + rInsStatement;
                connection.query(finalStatement, function (err, rows, fields) {
                    if (err) {
                        console.log(err.errno);
                    }

                    return res.status(200).jsonp({
                        insertId: surveyId
                    });
                });
            });
        }

    };
};
