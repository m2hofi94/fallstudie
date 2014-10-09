/*globals angular */
'use strict';

angular.module('NavController', []).controller('NavCtrl', ['$scope', '$location', 'Authentication', function($scope, $location, Authentication) {
    $scope.isCollapsed = true;
	var _user = null;

    $scope.$on('$routeChangeStart', function() {
        // Manually delete User Object to refresh the navBar after deleting User
        if($location.url() == '/deleteUser'){
            _user = null;         
        }
        // Called after profile Update to reload the navbar
        if($location.url() == '/profile'){
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
