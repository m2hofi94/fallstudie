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
}]);
