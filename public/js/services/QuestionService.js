/*globals angular */
/*jslint node:true */
'use strict';

angular.module('QuestionService', []).factory('Questions', ['$http', function($http) {

	return {
		// get all of the questions in an array
		getQuestions : function() {
			return $http.get('/api/questions');
		},

		// create new Question
		addQuestion   : function(questionData) {
			return $http.post('/api/questions', questionData);
		},

        removeQuestion : function(questionId) {
			return $http.delete('/api/questions/' + questionId);
		}
	};

}]);
