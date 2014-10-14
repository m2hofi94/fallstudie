/*jslint node:true */
'use strict';

var connection = require('./../config/db.js')(100);
var md5 = require('MD5');
var mailer = require('nodemailer');
var mailSettings = require('./../config/mail.js')();

module.exports = function () {
    var transporter = mailer.createTransport(mailSettings);

    var sendMail = function(recipient, token, user, email, title){
        var body = 'Guten Tag,<br/><br/>' + user + ' hat Sie eingeladen, an der Umfrage ' + title + ' teilzunehmen.<br/><br/>Besuchen Sie zur Teilnahme die folgende Seite:<br><a href="http://afs.nunki.uberspace.de/#/participate/'+token+ '">http://afs.nunki.uberspace.de/#/participate/' +token+ '</a><br>Mit freundlichen Gr&uuml;&szlig;en ihr AnFeSys-Team.<br><br>AnFeSys: Ihr Partner für anonyme Umfragen. Noch nicht <a href="http://afs.nunki.uberspace.de/signup">registriert?</a>';

        var mailOptions = {
            from: user  + ' via AnFeSys <' + email + '>',// sender address  'Hans Wurst via <AnFeSys@gmail.com>'
            to: recipient, // list of receivers
            subject: 'Einladung zur Umfrage ' + title, // Subject line
            // Text ggf. user Name hinzufügen
            html: body // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error);
            }else{
                console.log('Message sent: ' + info.response);
            }
        });
    };

    return {
        publishOpen : function(req, res){
            var hash = md5(req.params.id);

            connection.query('INSERT INTO tokens SET surveyId = ?, token = ?, keepAfterUse = ?', [req.params.id ,hash, true], function(err, rows, fields){
                if (err) throw err;
                res.jsonp(hash);
            });
        },

        publishIndividually : function(req, res){
            // req.params.id -> surveyID
            // Get E-Mails which are assigned to this survey
            connection.query('SELECT * FROM surveys WHERE id = ?', [req.params.id], function(err, rows, fields){
                var survey = rows[0];

                connection.query('SELECT * FROM recipients WHERE surveyID = ?', [req.params.id], function(err, rows, fields){
                    if (err) throw err;

                    if(rows.length === 0){
                        res.jsonp('No Recipients');
                    } else {

                        // for each E-Mail publish one token into the DB
                        for(var i = 0; i < rows.length; i++){
                            // TODO for each E-Mail-Address send an E-Mail to recipient
                            // Create token with surveyID and random Number
                            var hash = md5((Math.random() * req.params.id) + '');
                            var u = req.user.title + ' ' + req.user.firstName + ' ' + req.user.lastName;
                            sendMail(rows[i].email, hash, u, req.user.email, survey.title);

                            connection.query('INSERT INTO tokens SET surveyId = ?, token = ?', [req.params.id ,hash], function(err, rows, fields){
                                if (err) throw err;
                            });
                        }
                        res.jsonp(rows);
                    }
            });

            });
        },

        takePart : function(req, res){
            // sollte &uuml;berfl&uuml;ssig sein
            if(req.body.answers === null){
                return;
            }

            // Need keep and keepValid to decide if token can only be used once (then recipients contains at least one email)
            // or multiple times (recipients contains no email for this survey) -> keep = true, keepValid = true
            connection.query('SELECT * FROM surveys WHERE id = ?', [req.body.surveyID], function(err, rows, fields){
                var keep = false;
                console.log(rows[0].countRecipients);
                if(rows[0].countRecipients == 0){
                    keep = true;
                }
                connection.query('UPDATE tokens SET used = ? WHERE token = ? AND keepAfterUse = ?', [!keep, req.body.token, keep], function(err, rows, fields){     console.log(rows.changedRows);
                    if(rows.changedRows !== 0 || keep){

                    connection.query('UPDATE surveys SET countAnswers=countAnswers+1 WHERE id = ?', [req.body.surveyID], function(err, rows, fields){
                        if (err) throw err;
                        console.log(rows);

                            for(var i = 0; i < req.body.answers.length; i++){
                                var v = (req.body.answers[i].type === 'Slider') ? req.body.answers[i].rate : req.body.answers[i].input;
                                var answer = {value : v, surveyID : req.body.surveyID, questionID : req.body.answers[i].id};
                                connection.query('INSERT INTO answers SET ?', [answer], function(err, rows, fields){
                                    if (err) throw err;
                                });
                            }

                        res.jsonp(rows);
                    });
                        }
                });
            });
        }
    };
};
