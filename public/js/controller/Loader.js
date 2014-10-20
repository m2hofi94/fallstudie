/*globals angular */
'use strict';

angular.module('Loader', []).controller('LoaderCtrl', ['$scope', function($scope) {
	console.log('loader started');
	$scope.$on('requestStart', function(ev) {
		if (!$scope.loading) {$scope.loading = true;}
		console.log('event revieved');
	});
	$scope.$on('requestEnd', function(ev) {
		if ($scope.loading) {$scope.loading = false;}
	})
}]);
