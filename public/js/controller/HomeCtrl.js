/*globals angular */
'use strict';

angular.module('HomeController', []).controller('HomeCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
    $scope.dynamic = 25;
    $scope.max = 50;
    $scope.isCollapsed = true;

    $scope.go = function ( path ) {
        $location.url( path );
    };

}]);
