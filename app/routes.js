/*jslint node:true */
'use strict';

module.exports = function(express, passport) {
    var users = require('./controller/users')(passport);
    var questions = require('./controller/questions')(null);
    var router = express.Router();

    //******************USERS-CRUD-Example***********************
    router.get('/users', users.list);
    router.post('/users', loggedIn, users.create);
    router.get('/users/:userId', loggedIn, users.read);
    router.put('/users/:userId', loggedIn, users.update);
    router.delete('/users/:userId', loggedIn, users.delete);

    //*******************Login/Signup*******************************
	router.post('/login', users.login);
	router.post('/signup', users.signup);
    router.get('/logout', users.logout);

    //*******************Questions**********************************
    router.get('/questions', questions.getQuestions);
    router.post('/questions', questions.addQuestion);

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
