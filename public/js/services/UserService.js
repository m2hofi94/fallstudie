'use strict';

angular.module('UserService', []).factory('Users', ['$http', function($http) {

	return {
		// call to get all nerds
		list : function() {
			return $http.get('/api/users');
		},

		// call to POST and create a new nerd
		create : function(userData) {
			return $http.post('/api/users', userData);
		},

        read : function(id) {
			return $http.get('/api/users/' + id);
		},

        update : function(updateData) {
			return $http.put('/api/users/' + updateData.id, updateData);
		},

		// call to DELETE a nerd
		delete : function(id) {
			return $http.delete('/api/users/' + id);
		}
	};

}]);
