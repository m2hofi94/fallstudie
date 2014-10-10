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
    return {
        getQuestionsWithToken: function (req, res) {
            connection.query('SELECT * FROM tokens WHERE token = ?', [req.params.token], function (err, rows, fields) {
                console.log(rows);
                if (err) throw err;
                if(rows.length > 0){
                    var result = rows[0];
                    // console.log(result);
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
            connection.query('SELECT * FROM surveys WHERE userID = ?', [req.user.id], function (err, rows, fields) {

                // console.log(rows);
                if (err) throw err;
                res.jsonp(rows);
            });
        },
        
        getQuestions : function (req, res) {
            connection.query('SELECT * FROM questions WHERE surveyID = ?', [req.params.id], function (err, rows, fields) {
                // console.log(rows);
                if (err) throw err;
                res.jsonp(rows);
            });
        },

        getAnswers : function (req, res) {
            connection.query('SELECT * FROM answers WHERE surveyID = ?', [req.params.id], function (err, rows, fields) {
                // console.log(rows);
                if (err) throw err;
                res.jsonp(rows);
            });
        },

        getRecipients : function (req, res) {
            connection.query('SELECT * FROM recipients WHERE surveyID = ?', [req.params.id], function (err, rows, fields) {
                // console.log(rows);
                if (err) throw err;
                res.jsonp(rows);
            });
        },

        changeStatus: function(req, res) {
            connection.query('UPDATE surveys SET status = ? WHERE id= ?', [req.body[1], req.body[0]],function(err, rows, fields) {
                if (err) return res.status(500);

                if(req.body[1] == 'closed'){
                   connection.query('UPDATE surveys SET endDate = ? WHERE id= ?', [formatDate(new Date()), req.body[0]],function(err, rows, fields) {
                     connection.query('DELETE FROM tokens WHERE surveyId= ?', [req.body[0]],function(err, rows, fields) {
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
                res.jsonp(rows);
            });
        },

        createSurvey: function (req, res) {
            console.log(req.body);
            // Insert into table surveys, questions into table questions and then the recipients
            var survey = {userID : req.user.id, title : req.body[0], status : req.body[2]};
            connection.query('INSERT INTO surveys SET ?', [survey], function(err, rows, fields) {
                if (err) throw err;
				console.log(rows);
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
                console.log(req.body[3]);
				var finalStatement = qInsStatement + rInsStatement;
			console.log(finalStatement);
				connection.query(finalStatement, function(err, rows, fields){
				   if(err) throw err;

					return res.status(200).jsonp({insertId: surveyId});
				});
            });
        }

    };
};
