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

        activateSurvey : function(id){
            return $http.put('/api/surveys/'+ id);
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
        }

	};

}]);
