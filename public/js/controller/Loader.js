/*globals angular */
'use strict';

/**
 * Idea of a site-wide loading indicator, that listens to request-Events
 * since that didn't work, currently only important requests have their
 * own local loader implementation
 */

angular.module('Loader', []).controller('LoaderCtrl', ['$scope', function($scope) {
	$scope.$on('requestStart', function(ev) {
		if (!$scope.loading) {$scope.loading = true;}
	});
	$scope.$on('requestEnd', function(ev) {
		if ($scope.loading) {$scope.loading = false;}
	})
}]);
