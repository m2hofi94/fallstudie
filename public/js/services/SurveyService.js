/*globals angular */
/*jslint node:true */
'use strict';

/**
Service is used to
1.) Get Surveys and Answers
2.) Create or Update a survey
3.) Take part on a survey
*/

angular.module('SurveyService', []).factory('Surveys', ['$http', function($http) {

	return {

		// get all of the questions in an array
		getQuestionsWithToken : function(token) {
			return $http.get('/api/questions/' + token);
		},

        getSurveys : function() {
            return $http.get('/api/surveys');
        },
        
        getQuestions : function(id) {
            return $http.get('/api/getQuestions/' + id);
        },

        getAnswers : function(id){
            return $http.get('/api/getAnswers/' + id);
        },

        getRecipients : function(id) {
            return $http.get('/api/getRecipients/' + id);
        },

         getCountOfAnswers : function(id){
            return $http.get('/api/tokens/' + id);
        },

        changeStatus : function(id, status){
            return $http.put('/api/surveys', [id, status]);
        },

		// create new Survey
		createSurvey   : function(surveyData) {
			return $http.post('/api/surveys', surveyData);
		},

        deleteSurvey : function(id){
            return $http.delete('/api/surveys/'+ id);
        },


        publishSurvey : function(id){
            return $http.post('/api/tokens/' + id);
        },
        
        publishSurveyOpen : function(id){
            return $http.post('/api/tokensOpen/' + id);
        },


        submitSurvey : function(surveyData){
            return $http.post('/api/submit/', surveyData);
        },

        tempTitle : '',
        idToEdit : -1,
        restart: false
	};

}]);
