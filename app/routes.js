/*jslint node:true */
'use strict';

module.exports = function(express, passport) {
    var users = require('./controller/users')(passport);
    var router = express.Router();

    //******************USERS-CRUD-Example***********************
    router.get('/users', users.list);
    router.post('/users', loggedIn, users.create);
    router.get('/users/:userId', loggedIn, users.read);
    router.put('/users/:userId', loggedIn, users.update);
    router.delete('/users/:userId', loggedIn, users.delete);

    //*******************Login/Signup*******************************
	router.post('/users/login', users.login);
	router.post('/users/signup', users.signup);

    //function to check if user is logged in
    //sends a 401 if unsuccessfull
    function loggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        return res.status(401).send('Unauthorized');
    }

    return router;
};
