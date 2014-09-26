/*globals angular */
/*jslint node:true */
'use strict';

angular.module('SurveyService', []).factory('Surveys', ['$http', function($http) {

	return {
		// get all of the questions in an array
		getQuestions : function() {
			return $http.get('/api/surveys');
		},

		// create new Question
		createSurvey   : function(surveyData) {
			return $http.post('/api/surveys', surveyData);
		},


	};

}]);
