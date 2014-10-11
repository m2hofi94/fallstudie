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
    router.delete('/deleteUser/:userId', loggedIn, users.deleteUser);
    router.put('/resetPassword', users.resetPassword);

    //*******************Login/Signup*******************************
	router.post('/login', users.login);
	router.post('/signup', users.signup);
    router.get('/logout', users.logout);

    //*******************Questions/Surveys**************************
    router.get('/questions/:token', surveys.getQuestionsWithToken);
    router.get('/getQuestions/:id', loggedIn, surveys.getQuestions);
    router.get('/getAnswers/:id', loggedIn, surveys.getAnswers);
    router.get('/getRecipients/:id', loggedIn, surveys.getRecipients);
    router.post('/surveys', loggedIn, surveys.createSurvey);
    router.get('/surveys', loggedIn, surveys.getSurveys);
    router.put('/surveys', loggedIn, surveys.changeStatus);
    router.delete('/surveys/:id', loggedIn ,surveys.deleteSurvey);

    //******************Create Token********************************
    router.post('/tokensOpen/:id', loggedIn, tokens.publishOpen);
    router.post('/tokens/:id', loggedIn, tokens.publishIndividually);
    router.post('/submit', tokens.takePart);
    router.get('/tokens/:id', loggedIn, tokens.getCountOfAnswers);

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
