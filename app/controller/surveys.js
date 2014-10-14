/*jslint node:true */
'use strict';

var connection = require('./../config/db.js')(100);

var formatDate = function(date) {
	date = date.getUTCFullYear() + '-' +
    ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
    ('00' + date.getUTCDate()).slice(-2) + ' ' +
    ('00' + date.getUTCHours()).slice(-2) + ':' +
    ('00' + date.getUTCMinutes()).slice(-2) + ':' +
    ('00' + date.getUTCSeconds()).slice(-2);
console.log(date);
	return date;
};

module.exports = function () {
    Array.prototype.contains = function(obj) {
        var i = this.length;
        while (i--) {
            if (this[i] === obj) {
                return true;
            }
        }
        return false;
    };

    return {
        getQuestionsWithToken: function (req, res) {
            connection.query('SELECT * FROM tokens WHERE token = ? AND valid = true AND used = false', [req.params.token], function (err, rows, fields) {
                if (err) throw err;
                if(rows.length > 0){
                    var result = rows[0];
                    connection.query('SELECT * FROM surveys WHERE id = ?', [result.surveyID], function (err, rows, fields) {
                        if (err) throw err;
                        var title = rows[0].title;

                        connection.query('SELECT * FROM questions WHERE surveyID = ?', [result.surveyID], function (err, rows, fields) {
                            if (err) throw err;
                            res.jsonp([title, rows, result.surveyID]);
                        });
                    });

                }else{
                    res.status(403);
                    res.jsonp(rows);
                }
                // res.jsonp(rows);
            });
        },

        getSurveys: function (req, res) {
            // var count = {recipients : [], answers : []};
            connection.query('SELECT * FROM surveys WHERE userID = ?', [req.user.id], function (err, rows, fields) {
                if (err) throw err;
                /*
                var selStatementRec = '';
                var selStatementAns = '';
                // Need to do it this way, because when using mutliple single select statements in a for loop, response is sent before
                // every statement has been executed
                if(rows.length > 0){
                    for(var i = 0; i < rows.length; i++){
                        selStatementRec = selStatementRec + 'SELECT * FROM recipients WHERE surveyID = ' + rows[i].id + ';';
                        selStatementAns = selStatementAns + 'SELECT * FROM answers WHERE surveyID = ' + rows[i].id + ';';
                    }
                    connection.query(selStatementRec, function(err, rows2, fields){
                        if (err) throw err;
                        // if rows.length == 1 --> rows2 looks like [ .. ]
                        // if rows.length >= 2 --> rows2 looks lkie [ [..],[..] ]

                        // Get count of recipients // if 0 survey is open for everyone
                        var rec = [];
                        if(rows.length == 1)
                            rows2 = [rows2];
                        for(var j = 0; j < rows2.length; j++)
                            rec[j] = rows2[j].length;

                        connection.query(selStatementAns, function(err, rows3, fields){
                            if (err) throw err;
                            var ans = [];
                            if(rows.length == 1)
                                rows3 = [rows3];
                            for(var j = 0; j < rows3.length; j++){
                                // get count of answers divided by count of questions for this survey
                                var count = [];
                                for(var k = 0; k < rows3[j].length; k++){
                                    if(!count.contains(rows3[j][k].questionID))
                                       count.push(rows3[j][k].questionID);
                                }
                                ans[j] = rows3[j].length / count.length;
                            }
                            console.log(rec);
                            res.jsonp({surveys : rows, count : {recipients : rec, answers : ans}});
                        });

                    });
                }
                */
                res.jsonp(rows);
            });
        },
        
        getQuestions : function (req, res) {
            connection.query('SELECT * FROM questions WHERE surveyID = ?', [req.params.id], function (err, rows, fields) {
                if (err) throw err;
                res.jsonp(rows);
            });
        },

        getAnswers : function (req, res) {
            connection.query('SELECT * FROM answers WHERE surveyID = ?', [req.params.id], function (err, rows, fields) {
                if (err) throw err;
                res.jsonp(rows);
            });
        },

        getRecipients : function (req, res) {
            connection.query('SELECT * FROM recipients WHERE surveyID = ?', [req.params.id], function (err, rows, fields) {
                if (err) throw err;
                res.jsonp(rows);
            });
        },

        changeStatus: function(req, res) {
            connection.query('UPDATE surveys SET status = ? WHERE id= ?', [req.body[1], req.body[0]],function(err, rows, fields) {
                if (err) return res.status(500);

                if(req.body[1] == 'closed'){
                   connection.query('UPDATE surveys SET endDate = ? WHERE id= ?', [formatDate(new Date()), req.body[0]],function(err, rows, fields) {
                     connection.query('UPDATE tokens SET valid = false WHERE surveyId= ?', [req.body[0]],function(err, rows, fields) {
                         if (err) return res.status(500);
                         res.jsonp(rows);
                     });
                });
                }else{
                    res.jsonp(rows);
                }
            });
        },

        deleteSurvey: function(req, res) {
            connection.query('DELETE FROM surveys WHERE id = ?', [req.params.id],function(err, rows, fields) {
                if (err) return res.status(500);
                connection.query('UPDATE tokens SET valid = 0 WHERE surveyID = ?', [req.params.id], function(err, rows, fields){
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

            var survey = {userID : req.user.id, title : req.body[0], status : req.body[2], countRecipients : rec};
            connection.query('INSERT INTO surveys SET ?', [survey], function(err, rows, fields) {
                if (err) throw err;
                var surveyId = rows.insertId;
				var qInsStatement = '';
				for(var i = 0; i < req.body[1].length; i++){
                    qInsStatement = qInsStatement + 'INSERT INTO questions SET surveyID=' + rows.insertId + ',title="' + req.body[1][i].title + '",type="' + req.body[1][i].type + '";';
                }
				var rInsStatement = '';
				if(req.body[3] !== null){
					rInsStatement = '';
					for(var j = 0; j < req.body[3].length; j++){
						rInsStatement = rInsStatement + 'INSERT INTO recipients SET email="' + req.body[3][j] + '",surveyId=' + rows.insertId + ';';
					}
				}
				var finalStatement = qInsStatement + rInsStatement;
				connection.query(finalStatement, function(err, rows, fields){
				   if(err) throw err;

					return res.status(200).jsonp({insertId: surveyId});
				});
            });
        }

    };
};

/*
                var selStatement = '';

                // Need to do it this way, because when using mutliple single select statements in a for loop, response is sent before
                // every statement has been executed
                if(rows.length > 0){
                    for(var i = 0; i < rows.length; i++){
                        selStatement = selStatement + 'SELECT * FROM tokens WHERE surveyID = ' + rows[i].id + ';';
                    }
                    connection.query(selStatement, function(err, rows2, fields){
                        if (err) throw err;
                        console.log(rows2);
                        var multiple = false;
                        // if only one token in db, rows2 looks [..], otherwise it is multidimensional [ [..], [..] ]
                        if(rows2.length == 1){
                            multiple = rows2[0].keepAfterUse;
                            rows2 = [rows2];
                        }
                        for(var j = 0; j < rows2.length; j++){
                            count.answers[j] = 0;
                            for(var k = 0; k < rows2[j].length; k++){
                                if(rows2[j][k].used)
                                 count.answers[j]++;
                            }
                            count.recipients[j] = rows2[j].length;

                        }
                        console.log(count);
                        res.jsonp({surveys : rows, count : count, multiple : multiple});
                     });
                 }
*/
