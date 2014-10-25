'use strict';

/**
Used for updating user data.
Login / Signup are handled in Authentication Service
*/

angular.module('UserService', []).factory('Users', ['$http', function($http) {

	return {

        update : function(updateData) {
			return $http.put('/api/users', updateData);
		},

        resetPassword : function(email){
            return $http.put('/api/resetPassword', email);
        },

        changedUserAlert : false
	};

}]);
