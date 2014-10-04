/*jslint node:true */
'use strict';

module.exports = function(express, passport) {
    var users = require('./controller/users')(passport);
    var surveys = require('./controller/surveys')(null);
    var tokens = require('./controller/tokens')(null);
    var router = express.Router();

    //******************USERS-CRUD-Example**************************
    router.get('/users', users.list);
    router.post('/users', loggedIn, users.create);
    router.get('/users/:userId', loggedIn, users.read);
    // used for User Update Data and Delete User
    router.put('/users', loggedIn, users.update);
    router.delete('/users/:userId', loggedIn, users.delete);

    //*******************Login/Signup*******************************
	router.post('/login', users.login);
	router.post('/signup', users.signup);
    router.get('/logout', users.logout);

    //*******************Questions/Surveys**************************
    router.get('/questions/:token', surveys.getQuestionsWithToken);
    router.post('/surveys', loggedIn, surveys.createSurvey);
    router.get('/surveys', loggedIn, surveys.getSurveys);
    router.put('/surveys', surveys.changeStatus);
    router.delete('/surveys/:id', surveys.deleteSurvey);

    //******************Create Token********************************
    router.post('/tokens/:id', tokens.publishForAll);

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
