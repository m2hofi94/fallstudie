/*globals angular */
'use strict';

angular.module('HomeController', []).controller('HomeCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.dynamic = 25;
    $scope.max = 50;
    $scope.isCollapsed = true;

}]);
