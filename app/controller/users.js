/*jslint node:true */
'use strict';

/**
 * users.js is used to handle users, e.g. creating, setting passwords... etc.
 */

var passwordHash = require('password-hash');
var connection = require('./../config/db.js')(100);
var mailer = require('nodemailer');
var mailSettings = require('./../config/mail.js')();

module.exports = function (passport) {
    var transporter = mailer.createTransport(mailSettings);

    var sendMail = function (recipient, title, text) {
        var mailOptions = {
            from: 'AnFeSys <' + mailSettings.auth.user + '>', // sender address
            to: recipient, // list of receivers
            subject: title, // Subject line
            html: text // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Message sent: ' + info.response);
            }
        });
    };

    return {
        //creates a new entry in the users table for the user
		create: function (req, res) {
            //the password is being secured using a salted hash method
			req.body.password = passwordHash.generate(req.body.password);

            connection.query('INSERT INTO users SET ?', [req.body], function (err, rows, fields) {
                if (err) {
                    if (err.errno === 1062) {
                        //primaryy key violation -> username taken
                        return res.status(400).jsonp({
                            message: "Diese e-Mail ist bei uns bereits registriert"
                        });
                    }
                    return res.status(500);
                }
                res.jsonp(rows);
            });
        },

		//updating the user infos
        update: function (req, res) {
            //if a new password is set, hash it
			if (typeof req.body.passwordToChange != 'undefined')
                req.body.password = passwordHash.generate(req.body.passwordToChange);

            var values = {
                email: req.body.email,
                title: req.body.title,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                password: req.body.password
            };

            connection.query('UPDATE users SET ? WHERE id= ?', [values, req.body.id], function (err, rows, fields) {
                if (err) return res.status(500);
                res.jsonp(rows);
            });
        },

        login: function (req, res, next) {
            passport.authenticate('local-login', function (err, user, info) {
                if (err) {
                    return next(err);
                }

                // Generate a JSON response reflecting authentication status
                if (!user) {
                    return res.send({
                        success: false,
                        message: req.loginMessage
                    });
                }

                //success, log-in user
                req.login(user, function (err) {
                    if (err) {
                        return next(err);
                    }

                    //building the result (returning the user to the client)
                    var result = {};
                    result.success = true;
                    result.user = req.user;
                    return res.send(result);
                });
            })(req, res, next);
        },

        logout: function (req, res) {
            //the logout function is provided by password.js
			req.logout();
            req.session.destroy(function (err) {
                if (err) {return res.status(500);}
				res.send({
                    success: true
                });
            });
        },

        deleteUser: function (req, res) {
            req.logout();
            req.session.destroy(function (err) {
                if (err) {return res.status(500);}

				// everything related to that user (questionnairs, tokens etc.) will be removed
				// because of the foreign key relationships
				connection.query('DELETE FROM users WHERE id = ?', [req.params.userId], function (err, rows, fields) {
                    if (err) return res.status(500);
                });
                res.status(200);
            });
        },

        signup: function (req, res, next) {
            passport.authenticate('local-signup', function (err, user, info) {
                if (err) {
                    return next(err);
                }
                // Generate a JSON response reflecting authentication status
                if (!user) {
                    return res.send({
                        success: false,
                        message: req.signUpMessage
                    });
                }

				// send a registration confirmation email
                var text = 'Guten Tag,<br/><br/>Sie wurden erfolgreich auf der Seite afs.nunki.uberspace.de registriert.<br/>Sie k&ouml;nnen sich nun <a href="http://afs.nunki.uberspace.de">hier</a> anmelden.<br><br>Vielen Dank f&uuml;r die Registrierung<br>Ihr AnFeSys-Team';
                var title = 'Registrierung bei AnFeSys';
                sendMail(req.body.email, title, text);

                //success, log-in user
                req.login(user, function (err) {
                    if (err) {
                        return next(err);
                    }

                    //building the result
                    var result = {};
                    result.success = true;
                    result.user = req.user;
                    return res.send(result);
                });
            })(req, res, next);
        },

		/*
		 * since we hash the password we cannot send it in plain text
		 * for simplicity we simply generate a random new one that is
		 * valid forever and does not need to (but should be) changed.
		 */
        resetPassword: function (req, res) {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
            // Generate random Password of 10 chars length
            for (var i = 0; i < 10; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
			}

            var title = 'Ihr Passwort wurde zur&uuml;ckgesetzt';
            var body = 'Guten Tag,<br/><br/>Ihr Passwort f&uuml;r die Seite <a href="http://afs.nunki.uberspace.de">afs.nunki.uberspace.de</a> wurde erfolgreich zur&uuml;ckgesetzt.<br/>Sie k&ouml;nnen sich nun mit dem Passwort "' + text + '" anmelden.';
            var data = {
                password: passwordHash.generate(text)
            };

            // Update password in DB abd send mail to user
            connection.query('UPDATE users SET ? WHERE email = ?', [data, req.body.email], function (err, rows, fields) {
                if (err) {return res.status(500);}

                if (rows.affectedRows !== 0) {
                    sendMail(req.body.email, title, body);
                    res.status(200).jsonp(rows);
                } else {
                    res.status(418).jsonp(rows);
                }
            });

        },
    };
};
