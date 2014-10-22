/*globals angular */
'use strict';

angular.module('NavController', []).controller('NavCtrl', ['$scope', 'Users', '$location', 'Authentication', function($scope, Users, $location, Authentication) {
    $scope.isCollapsed = true;
	$scope.loading = false;
	var _user = null;

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
	// console.log('loader started');
	$scope.$on('requestStart', function(ev) {
		$scope.loading = true;
		// console.log('STart recieved');
	});
	$scope.$on('requestEnd', function(ev) {
		$scope.loading = false;
		// console.log('end recieved');
	})

	$scope.toggle = function() {
		$scope.loading = !$scope.loading;
		// console.log('toggling');
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
				// console.log('request');
				return data;
			},
			response: function(data) {
				$rootScope.$broadcast('requestEnd');
				// console.log('ended');
				return data;
			},
			requestError: function(err) {
				console.log(err.errno);
				$location.url('/error');
				$rootScope.$broadcast('requestEnd');
				return err;
			},
			responseError: function(err) {
				// console.log(err.errno);
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
