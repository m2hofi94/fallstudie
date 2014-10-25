/*globals angular */
'use strict';

angular.module('Loader', []).controller('LoaderCtrl', ['$scope', function($scope) {
	$scope.$on('requestStart', function(ev) {
		if (!$scope.loading) {$scope.loading = true;}
	});
	$scope.$on('requestEnd', function(ev) {
		if ($scope.loading) {$scope.loading = false;}
	})
}]);
