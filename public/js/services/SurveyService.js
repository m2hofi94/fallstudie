/*globals angular */
/*jslint node:true */
'use strict';

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

        changeStatus : function(id, status){
            return $http.put('/api/surveys', [id, status]);
        },

        deleteSurvey : function(id){
            return $http.delete('/api/surveys/'+ id);
        },

		// create new Question
		createSurvey   : function(surveyData) {
			return $http.post('/api/surveys', surveyData);
		},

        publishSurvey : function(id){
            return $http.post('/api/tokens/' + id);
        },
        
        submitSurvey : function(surveyData){
            return $http.post('/api/submit/', surveyData);
        },

        tempTitle : '',
        idToEdit : -1
	};

}]);
