/*globals angular */
'use strict';

angular.module('NavController', []).controller('NavCtrl', ['$scope', 'Users', '$location', 'Authentication', function($scope, Users, $location, Authentication) {
    $scope.isCollapsed = true;
	$scope.loading = false;
	var _user = null;

    // Used for Facebook "Like / Share" Element in Footer
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/de_DE/sdk.js#xfbml=1&version=v2.0";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    $scope.$on('$routeChangeStart', function() {
        // Manually delete User Object to refresh the navBar after deleting User
        if($location.url() == '/deleteUser'){
            _user = null;         
        }
        // Called after profile Update to reload the navbar
        if($location.url() == '/profile'){
            Users.changeUserAlert = true;
            _user = Authentication.user();         
        }
        
       $scope.isCollapsed = true;
    });

	$scope.loggedIn = function() {
		return _user;
	};

    $scope.user = function() {
        if (!_user) {
			_user = Authentication.user();
		}
		return _user;
    };

    //logging out is handled in the Authentication Service
    $scope.logout = function() {
        _user = null;
		Authentication.logout();
    };

	$scope.$on('requestStart', function(ev) {
		$scope.loading = true;
	});
	$scope.$on('requestEnd', function(ev) {
		$scope.loading = false;
	})

	$scope.toggle = function() {
		$scope.loading = !$scope.loading;
	}
}]);

angular.module('NavController').run(['$rootScope', '$location', 'Authentication', '$window', function($rootScope, $location, Authentication, $window) {
	$rootScope.$on('$routeChangeStart', function(event, next, current) {
		$window.scrollTo(0,0);

		if (next.protected && !Authentication.user()) {
			event.preventDefault();
			$location.url('/login');
		}

        // Hide "signUp" and "LogIn" page if user is logged in
        if (next.hideIfLoggedIn && Authentication.user()) {
			event.preventDefault();
			$location.url('/home');
		}
	});
}]);

angular.module('NavController').config(['$provide', '$httpProvider', function($provide, $httpProvider) {
	$provide.factory('httpIntercept', ['$location', '$rootScope', function($location, $rootScope) {
		return {
			request: function(data) {
				$rootScope.$broadcast('requestStart');
				return data;
			},
			response: function(data) {
				$rootScope.$broadcast('requestEnd');
				return data;
			},
			requestError: function(err) {
				$location.url('/error');
				$rootScope.$broadcast('requestEnd');
				return err;
			},
			responseError: function(err) {
                // Error 418 is thrown if Survey is not available
                if(err.status !== 418)
				    $location.url('/error');
				$rootScope.$broadcast('requestEnd');
				return err;
			}
		};
	}]);
	$httpProvider.interceptors.push('httpIntercept');
}]);
