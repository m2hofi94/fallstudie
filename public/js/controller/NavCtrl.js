/*globals angular */
'use strict';

angular.module('NavController', []).controller('NavCtrl', ['$scope', 'Authentication', '$location', function($scope, Authentication, $location) {
    $scope.authentication = Authentication;
    $scope.isCollapsed = true;

    $scope.loggedIn = function() {
        return $scope.authentication.user();
    };

    $scope.user = function() {
        return  Authentication.user();
    };

    //logging out is handled in the Authentication Service
    $scope.logout = function() {
        Authentication.logout();
    };
    
     $scope.onLoad = function() {
        if(!$scope.loggedIn()){
            $location.url('/');
        }
    };
}]);

angular.module('NavController').run(['$rootScope', '$location', 'Authentication', '$window', function($rootScope, $location, Authentication, $window) {
	$rootScope.$on('$routeChangeStart', function(event, next, current) {
		$window.scrollTo(0,0);

		if (next.protected && !Authentication.user()) {
			event.preventDefault();
			$location.url('/login');
		}
	});
}]);
