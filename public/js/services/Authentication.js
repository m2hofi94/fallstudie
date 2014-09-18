//service that makes the User-Object available on the entire site
// stores that information in a cookie, so it can be retrieved in other tabs, and after a reload

'use strict';

angular.module('Authentication', ['ngCookies']).factory('Authentication', ['$cookieStore', '$http', function($cookieStore, $http) {
        var user = $cookieStore.get('userobj');

		return {
			user: function(userObj) {
                if (userObj) {
                    $cookieStore.put('userobj', userObj);
                    user = $cookieStore.get('userobj');
                } else {
                    return user;
                }
            },

            //logging out means removing the user-cookie and the session cookies
            logout: function() {
                $cookieStore.remove('userobj');
                user = null;
                $http.get('/api/logout');
            },

			login : function(user){
				return $http.post('/api/login', user);
			},

			signup : function(user) {
				return $http.post('/api/signup', user);
			},
		};



	}
]);
