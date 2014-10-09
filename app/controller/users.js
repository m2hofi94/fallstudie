/*jslint node:true */
'use strict';

var passwordHash = require('password-hash');
var connection = require('./../config/db.js')(100);

module.exports = function(passport) {
    return {
        list: function(req, res) {
            connection.query('SELECT * FROM users', function(err, rows, fields) {
              if (err) throw err;
              res.jsonp(rows);
            });
        },

        create: function(req, res) {
            req.body.password =  passwordHash.generate(req.body.password);
            console.log(req.body);

            connection.query('INSERT INTO users SET ?', [req.body],function(err, rows, fields) {
                if (err) {
                    if (err.errno===1062) {
                        //username taken
                        return res.status(400).jsonp({message: "Diese e-Mail ist bei uns bereits registriert"});
                    }
                    return res.status(500);
                }
              res.jsonp(rows);
            });
        },

        read: function(req, res) {
            connection.query('SELECT * FROM users WHERE id = ?', [req.params.userId],function(err, rows, fields) {
                if (err) return res.status(500);
                res.jsonp(rows);
            });
        },

        update: function(req, res) {
            console.log(req.body.passwordToChange);
            if(typeof req.body.passwordToChange != 'undefined')
                req.body.password = passwordHash.generate(req.body.passwordToChange);

            var values = {email : req.body.email,
                          title : req.body.title,
                          firstName : req.body.firstName,
                          lastName : req.body.lastName,
                          password : req.body.password
                         };

            connection.query('UPDATE users SET ? WHERE id= ?', [values, req.body.id],function(err, rows, fields) {
                console.log(rows);
                if (err) return res.status(500);
                res.jsonp(rows);
            });
        },

        delete: function(req, res) {
            connection.query('DELETE FROM users WHERE id = ?', [req.params.userId],function(err, rows, fields) {
                if (err) return res.status(500);
                res.jsonp(rows);
            });
        },

        login: function(req, res, next) {
            passport.authenticate('local-login', function(err, user, info) {
                if (err) {return next(err);}

                // Generate a JSON response reflecting authentication status
                if (! user) {
                  return res.send({ success : false, message : req.loginMessage });
                }

                //success, log-in user
                req.login(user, function(err) {
                    if (err) {return next(err);}

                    //building the result (returning the user to the client)
                    var result = {};
                    result.success = true;
                    result.user = req.user;
                    return res.send(result);
                });
          })(req, res, next);
        },

        logout: function(req, res) {
            req.logout();
            req.session.destroy(function (err) {
                res.send({success: true});
            });
        },
        
        deleteUser: function(req, res){
            req.logout();
            req.session.destroy(function (err) {
                connection.query('DELETE FROM users WHERE id = ?', [req.params.userId],function(err, rows, fields) {
                    if (err) return res.status(500);
                });
                // res.send({success: true});
            });
        },

        signup: function(req, res, next) {
            passport.authenticate('local-signup', function(err, user, info) {
                if (err) {return next(err);}
                // Generate a JSON response reflecting authentication status
                if (! user) {
                  return res.send({ success : false, message : req.signUpMessage });
                }

                //success, log-in user
                req.login(user, function(err) {
                    if (err) {return next(err);}

                    //building the result
                    var result = {};
                    result.success = true;
                    result.user = req.user;
                    return res.send(result);
                });
          })(req, res, next);
        },
    };
};
