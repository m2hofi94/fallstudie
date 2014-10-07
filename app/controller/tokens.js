/*jslint node:true */
'use strict';

var connection = require('./../config/db.js')(100);
var md5 = require('MD5');
var mailer = require('nodemailer');

module.exports = function () {
    var transporter = mailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'anfesys@gmail.com',
            pass: 'DaFSsi6Wfs!'
        }
    });

    var sendMail = function(recipient, token, user){
        console.log("in Send mail");
        var body = 'Guten Tag,<br>' + user + ' l&auml;dt Sie ein, an einer Umfrage teilzunehmen.<br>Dazu klicken Sie bitte auf den unten stehenden Link<br><a href="http://localhost:61701/#/participate/'+token+'">Umfrage</a>';

        var mailOptions = {
            from: 'AnFeSys <AnFeSys@gmail.com>', // sender address
            to: recipient, // list of receivers
            subject: 'Einladung zur Umfrage', // Subject line
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
        publishForAll : function(req, res){
            var hash = md5(req.params.id);

            connection.query('INSERT INTO tokens SET surveyId = ?, token = ?', [req.params.id ,hash], function(err, rows, fields){
                if (err) throw err;
                // console.log(fields);
                res.jsonp(hash);
            });
        },


        publishIndividually : function(req, res){
            // req.params.id -> surveyID
            // Get E-Mails which are assigned to this survey
            connection.query('SELECT * FROM recipients WHERE surveyID = ?', [req.params.id], function(err, rows, fields){
                if (err) throw err;
                console.log(rows);
                // for each E-Mail publish one token into the DB
                for(var i = 0; i < rows.length; i++){
                    // TODO for each E-Mail-Address send an E-Mail to recipient
                    // Create token with surveyID and random Number
                    var hash = md5((Math.random() * req.params.id) + '');
                    var u = req.user.firstName + " " + req.user.lastName;
                    console.log("before Send Mail");
                    sendMail(rows[i].email, hash, u);

                    connection.query('INSERT INTO tokens SET surveyId = ?, token = ?', [req.params.id ,hash], function(err, rows, fields){
                        if (err) throw err;
                    });
                }
                res.jsonp(rows);
            });
        },


        takePart : function(req, res){
            // req.body[0] = token
            // req.body[1] = answers
            // req.body[2] = surveyID

            for(var i = 0; i < req.body[1].length; i++){
                var v = (req.body[1][i].type === 'Slider') ? req.body[1][i].rate : req.body[1][i].input;
                var answer = {value : v, surveyID : req.body[2]};
                connection.query('INSERT INTO answers SET ?', [answer], function(err, rows, fields){
                    if (err) throw err;
                });
            }
            connection.query('DELETE FROM tokens WHERE token = ?', [req.body[0]], function(err, rows, fields){
                if (err) throw err;
                res.jsonp(rows);
            });
        }
    };
};
